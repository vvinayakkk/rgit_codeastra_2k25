from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import traceback

app = Flask(__name__)

# Load the model
print("Loading model...")
model = joblib.load('blockchain_fraud_detection_model.pkl')

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'ok', 'message': 'Blockchain Fraud Detection API is running'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.json
        
        # Convert to DataFrame
        df = pd.DataFrame([data])
        
        # Handle datetime columns
        datetime_columns = ['timestamp', 'manufacturing_timestamp']
        for col in datetime_columns:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col])
                df[f'{col}_hour'] = df[col].dt.hour
                df[f'{col}_day'] = df[col].dt.day
                df[f'{col}_month'] = df[col].dt.month
                df[f'{col}_year'] = df[col].dt.year
                df[f'{col}_dayofweek'] = df[col].dt.dayofweek
        
        # Calculate time difference between transaction and manufacturing
        if 'timestamp' in df.columns and 'manufacturing_timestamp' in df.columns:
            df['time_since_manufacturing'] = (df['timestamp'] - df['manufacturing_timestamp']).dt.total_seconds() / 3600  # in hours
        
        # Drop original datetime columns
        df = df.drop(columns=[col for col in datetime_columns if col in df.columns])
        
        # Make prediction
        probability = model.predict_proba(df)[0, 1]
        prediction = 1 if probability >= 0.5 else 0
        
        # Generate risk score (0-100)
        risk_score = int(probability * 100)
        
        # Create response
        response = {
            'prediction': int(prediction),
            'probability': float(probability),
            'risk_score': risk_score,
            'risk_level': get_risk_level(risk_score),
            'timestamp': datetime.now().isoformat()
        }
        
        # Add explanation if fraudulent
        if prediction == 1:
            response['explanation'] = get_fraud_explanation(data, probability)
        
        return jsonify(response)
    
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

def get_risk_level(score):
    """Convert risk score to risk level"""
    if score < 20:
        return 'Very Low'
    elif score < 40:
        return 'Low'
    elif score < 60:
        return 'Medium'
    elif score < 80:
        return 'High'
    else:
        return 'Very High'

def get_fraud_explanation(data, probability):
    """Generate explanation for why transaction was flagged"""
    explanations = []
    
    # Check for price manipulation
    if 'market_price_deviation' in data:
        deviation = data['market_price_deviation']
        if abs(deviation) > 15:
            explanations.append(f"Unusual price deviation of {deviation:.2f}% from market average")
    
    # Check for unrealistic timing
    if 'transaction_completion_time' in data:
        time = data['transaction_completion_time']
        if time < 0.5:
            explanations.append(f"Transaction completed suspiciously quickly ({time:.2f} hours)")
        elif time > 72:
            explanations.append(f"Transaction took unusually long to complete ({time:.2f} hours)")
    
    # Check for suspicious network connections
    if 'network_connection_strength' in data and data['network_connection_strength'] > 0.9:
        explanations.append("Unusually strong network connection between sender and receiver")
    
    # Check for certification issues
    if 'product_certification_status' in data and data['product_certification_status'] == 'Expired':
        explanations.append("Product certification is expired")
    
    # Check for transaction volume anomalies
    if 'transaction_volume' in data and 'sender_historical_transaction_count' in data:
        volume = data['transaction_volume']
        history = data['sender_historical_transaction_count']
        if volume > 100 and history < 5:
            explanations.append("New participant with suspiciously high transaction volume")
    
    # Default explanation if no specific issues found
    if not explanations:
        explanations.append(f"Multiple subtle anomalies detected (confidence: {probability:.2f})")
    
    return explanations

@app.route('/batch_predict', methods=['POST'])
def batch_predict():
    try:
        # Get data from request
        data = request.json
        
        # Convert to DataFrame
        df = pd.DataFrame(data)
        
        # Handle datetime columns
        datetime_columns = ['timestamp', 'manufacturing_timestamp']
        for col in datetime_columns:
            if col in df.columns:
                df[col] = pd.to_datetime(df[col])
                df[f'{col}_hour'] = df[col].dt.hour
                df[f'{col}_day'] = df[col].dt.day
                df[f'{col}_month'] = df[col].dt.month
                df[f'{col}_year'] = df[col].dt.year
                df[f'{col}_dayofweek'] = df[col].dt.dayofweek
        
        # Calculate time difference
        if 'timestamp' in df.columns and 'manufacturing_timestamp' in df.columns:
            df['time_since_manufacturing'] = (df['timestamp'] - df['manufacturing_timestamp']).dt.total_seconds() / 3600
        
        # Drop original datetime columns
        df = df.drop(columns=[col for col in datetime_columns if col in df.columns])
        
        # Make predictions
        probabilities = model.predict_proba(df)[:, 1]
        predictions = (probabilities >= 0.5).astype(int)
        
        # Create response
        results = []
        for i, (pred, prob) in enumerate(zip(predictions, probabilities)):
            risk_score = int(prob * 100)
            result = {
                'index': i,
                'prediction': int(pred),
                'probability': float(prob),
                'risk_score': risk_score,
                'risk_level': get_risk_level(risk_score)
            }
            
            # Add explanation if fraudulent
            if pred == 1:
                result['explanation'] = get_fraud_explanation(data[i], prob)
            
            results.append(result)
        
        return jsonify({
            'results': results,
            'timestamp': datetime.now().isoformat(),
            'total_records': len(results),
            'flagged_records': int(sum(predictions))
        })
    
    except Exception as e:
        print(traceback.format_exc())
        return jsonify({'error': str(e)}), 500

@app.route('/model_info', methods=['GET'])
def model_info():
    """Return information about the model"""
    return jsonify({
        'model_type': 'Blockchain Supply Chain Fraud Detection',
        'features': model[0].get_feature_names_out().tolist(),
        'timestamp': datetime.now().isoformat(),
        'api_version': '1.0.0'
    })

if __name__ == '__main__':
    print("Starting API server...")
    app.run(host='0.0.0.0', port=5001, debug=True)