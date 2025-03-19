from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Enable CORS for React frontend (e.g., http://localhost:3000)

# CSV file path
CSV_FILE = 'retailer_dataset.csv'

# Load the trained fraud detection model
try:
    model = joblib.load('fraud_detection_model.pkl')
except FileNotFoundError:
    raise Exception("Fraud detection model not found. Please train and save it first.")

# Ensure CSV exists; if not, create an empty one with the expected structure
if not os.path.exists(CSV_FILE):
    df = pd.DataFrame(columns=[
        'id', 'name', 'phone', 'address', 'logo', 'color', 'favorite', 
        'transaction_count', 'avg_transaction_value', 'days_since_last_transaction', 
        'created_at', 'is_fraud'
    ])
    df.to_csv(CSV_FILE, index=False)

# Helper function to read CSV
def load_retailers():
    df = pd.read_csv(CSV_FILE)
    # Ensure all columns exist, filling missing ones with defaults
    default_columns = {
        'id': 0, 'name': '', 'phone': '', 'address': '', 'logo': '📷', 'color': 'bg-green-500',
        'favorite': 0, 'transaction_count': 0, 'avg_transaction_value': 0.0, 
        'days_since_last_transaction': 0.0, 'created_at': datetime.now().isoformat(), 
        'is_fraud': 0
    }
    for col, default in default_columns.items():
        if col not in df.columns:
            df[col] = default
    return df

# Helper function to save CSV
def save_retailers(df):
    df.to_csv(CSV_FILE, index=False)

# Helper function to predict fraud
def predict_fraud(transaction_count, avg_transaction_value, days_since_last_transaction):
    features = np.array([[transaction_count, avg_transaction_value, days_since_last_transaction]])
    prediction = model.predict(features)[0]
    return 1 if prediction == -1 else 0  # 1 for fraud, 0 for normal

# GET /api/retailers - Fetch all retailers with optional search
@app.route('/api/retailers', methods=['GET'])
def get_retailers():
    search_term = request.args.get('search', '').lower()
    df = load_retailers()
    
    # Filter by search term
    if search_term:
        df = df[df['name'].str.lower().str.contains(search_term, na=False)]
    
    # Ensure data types and calculate fraud on-the-fly
    retailers_list = df.to_dict('records')
    for retailer in retailers_list:
        retailer['favorite'] = bool(int(retailer['favorite']))  # Convert to boolean
        retailer['is_fraud'] = predict_fraud(
            float(retailer['transaction_count']),
            float(retailer['avg_transaction_value']),
            float(retailer['days_since_last_transaction'])
        )
    
    return jsonify(retailers_list)

# GET /api/retailers/<id> - Fetch a single retailer
@app.route('/api/retailers/<int:id>', methods=['GET'])
def get_retailer(id):
    df = load_retailers()
    retailer = df[df['id'] == id].to_dict('records')
    
    if not retailer:
        return jsonify({"error": "Retailer not found"}), 404
    
    retailer = retailer[0]
    retailer['favorite'] = bool(int(retailer['favorite']))
    retailer['is_fraud'] = predict_fraud(
        float(retailer['transaction_count']),
        float(retailer['avg_transaction_value']),
        float(retailer['days_since_last_transaction'])
    )
    return jsonify(retailer)

# POST /api/retailers - Add a new retailer
@app.route('/api/retailers', methods=['POST'])
def add_retailer():
    data = request.json
    required_fields = ['name', 'phone', 'address', 'logo', 'color']
    
    if not all(field in data for field in required_fields):
        return jsonify({"error": "Missing required fields"}), 400

    df = load_retailers()
    new_id = int(df['id'].max() + 1) if not df.empty else 1
    
    new_retailer = {
        'id': new_id,
        'name': data['name'],
        'phone': data['phone'],
        'address': data['address'],
        'logo': data['logo'],
        'color': data['color'],
        'favorite': 0,  # Default to False (0)
        'transaction_count': data.get('transaction_count', 0),
        'avg_transaction_value': data.get('avg_transaction_value', 0.0),
        'days_since_last_transaction': data.get('days_since_last_transaction', 0.0),
        'created_at': datetime.now().isoformat(),
        'is_fraud': 0  # Will be updated below
    }
    
    # Predict fraud
    new_retailer['is_fraud'] = predict_fraud(
        new_retailer['transaction_count'],
        new_retailer['avg_transaction_value'],
        new_retailer['days_since_last_transaction']
    )
    
    # Append to DataFrame and save
    df = pd.concat([df, pd.DataFrame([new_retailer])], ignore_index=True)
    save_retailers(df)
    
    new_retailer['favorite'] = bool(new_retailer['favorite'])
    return jsonify(new_retailer), 201

# PUT /api/retailers/<id>/favorite - Toggle favorite status
@app.route('/api/retailers/<int:id>/favorite', methods=['PUT'])
def toggle_favorite(id):
    df = load_retailers()
    retailer_idx = df.index[df['id'] == id].tolist()
    
    if not retailer_idx:
        return jsonify({"error": "Retailer not found"}), 404
    
    idx = retailer_idx[0]
    df.at[idx, 'favorite'] = 1 - df.at[idx, 'favorite']  # Toggle 0 to 1 or 1 to 0
    save_retailers(df)
    
    retailer = df.iloc[idx].to_dict()
    retailer['favorite'] = bool(int(retailer['favorite']))
    retailer['is_fraud'] = predict_fraud(
        float(retailer['transaction_count']),
        float(retailer['avg_transaction_value']),
        float(retailer['days_since_last_transaction'])
    )
    return jsonify(retailer)

# Optional: DELETE /api/retailers/<id> - Delete a retailer
@app.route('/api/retailers/<int:id>', methods=['DELETE'])
def delete_retailer(id):
    df = load_retailers()
    if id not in df['id'].values:
        return jsonify({"error": "Retailer not found"}), 404
    
    df = df[df['id'] != id]
    save_retailers(df)
    return jsonify({"message": "Retailer deleted"}), 200

if __name__ == '__main__':
    app.run(debug=True, port=1000)