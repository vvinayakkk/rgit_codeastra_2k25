    # fraud_detection_model.py
import numpy as np
import pandas as pd
from sklearn.ensemble import IsolationForest
import joblib

# Simulate a dataset of 10,000 retailers
np.random.seed(42)
n_samples = 10000

data = {
    'id': range(1, n_samples + 1),
    'name': [f'Retailer {i}' for i in range(1, n_samples + 1)],
    'phone': [f'555-{np.random.randint(1000000, 9999999)}' for _ in range(n_samples)],
    'address': [f'{np.random.randint(1, 1000)} St, City {i % 100}' for i in range(n_samples)],
    'transaction_count': np.random.poisson(lam=50, size=n_samples),  # Simulating transactions
    'avg_transaction_value': np.random.normal(100, 20, n_samples),   # Avg transaction value
    'days_since_last_transaction': np.random.exponential(30, n_samples),  # Days since last transaction
}

# Introduce some fraudulent patterns (e.g., high transaction count with low avg value)
fraud_indices = np.random.choice(n_samples, 100, replace=False)  # 1% fraud
data['transaction_count'][fraud_indices] = np.random.poisson(lam=200, size=100)
data['avg_transaction_value'][fraud_indices] = np.random.normal(10, 5, 100)

df = pd.DataFrame(data)

# Features for fraud detection
X = df[['transaction_count', 'avg_transaction_value', 'days_since_last_transaction']]

# Train Isolation Forest model
model = IsolationForest(contamination=0.01, random_state=42)  # 1% expected fraud
model.fit(X)

# Predict fraud (-1 for anomaly, 1 for normal)
df['is_fraud'] = model.predict(X)
df['is_fraud'] = df['is_fraud'].apply(lambda x: 1 if x == -1 else 0)  # Convert to 0/1

# Save the model
joblib.dump(model, 'fraud_detection_model.pkl')

# Save dataset for reference (optional)
df.to_csv('retailer_dataset.csv', index=False)

print("Model trained and saved. Fraud detection stats:")
print(df['is_fraud'].value_counts())