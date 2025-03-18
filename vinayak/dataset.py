import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta
import uuid
from faker import Faker
import hashlib

# Initialize Faker for generating realistic data
fake = Faker()

# Set random seed for reproducibility
np.random.seed(42)
random.seed(42)

# Configuration
NUM_RECORDS = 50000
FRAUD_PERCENTAGE = 0.05  # 5% of transactions will be fraudulent
NUM_PARTICIPANTS = 200   # Number of supply chain participants
START_DATE = datetime(2023, 1, 1)
END_DATE = datetime(2025, 3, 15)

# Define lists for categorical variables
PRODUCT_CATEGORIES = ['Electronics', 'Pharmaceuticals', 'Food', 'Textiles', 'Automotive Parts', 'Chemicals', 'Medical Supplies', 'Construction Materials']
PAYMENT_METHODS = ['Bank Transfer', 'Letter of Credit', 'Credit Card', 'Digital Wallet', 'Cryptocurrency', 'Cash on Delivery']
MANUFACTURERS = [f'Manufacturer_{i}' for i in range(1, 51)]
MANUFACTURING_LOCATIONS = ['USA', 'China', 'India', 'Germany', 'Japan', 'Brazil', 'Mexico', 'Vietnam', 'Thailand', 'Malaysia']
CERTIFICATION_STATUSES = ['Certified', 'Pending', 'Expired', 'Not Required']
SUPPLY_CHAIN_NODES = ['Manufacturer', 'Distributor', 'Wholesaler', 'Retailer', 'End Customer']
TRANSPORTATION_METHODS = ['Air Freight', 'Sea Freight', 'Rail', 'Truck', 'Multimodal', 'Express Delivery']

def generate_blockchain_address():
    """Generate a random blockchain-like address"""
    return '0x' + hashlib.sha256(str(random.random()).encode()).hexdigest()[:40]

def generate_transaction_id():
    """Generate a random transaction ID"""
    return str(uuid.uuid4())

def generate_product_id():
    """Generate a random product ID"""
    return f"PRD-{random.randint(1000, 9999)}-{random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}{random.choice('ABCDEFGHIJKLMNOPQRSTUVWXYZ')}"

# Generate participant data
participants = []
for i in range(NUM_PARTICIPANTS):
    participant = {
        'address': generate_blockchain_address(),
        'type': random.choice(SUPPLY_CHAIN_NODES),
        'location': fake.country(),
        'timezone': random.choice([-12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]),
        'reputation_score': random.uniform(1, 10),
        'established_date': fake.date_between(start_date=datetime(2010, 1, 1), end_date=datetime(2023, 12, 31))
    }
    participants.append(participant)

# Create normal transaction patterns
def generate_normal_transaction():
    """Generate a normal transaction"""
    sender = random.choice(participants)
    # Choose a receiver that's not the sender and is logically next in the supply chain
    valid_receivers = [p for p in participants if p != sender and 
                      SUPPLY_CHAIN_NODES.index(p['type']) >= SUPPLY_CHAIN_NODES.index(sender['type'])]
    if not valid_receivers:
        valid_receivers = [p for p in participants if p != sender]
    receiver = random.choice(valid_receivers)
    
    product_category = random.choice(PRODUCT_CATEGORIES)
    
    # Generate realistic timestamp
    timestamp = fake.date_time_between(start_date=START_DATE, end_date=END_DATE)
    
    # Generate realistic product data
    shelf_life_days = random.randint(30, 1825)  # Between 1 month and 5 years
    
    # Calculate realistic market price
    base_price = random.uniform(10, 1000)
    market_price = base_price * random.uniform(0.95, 1.05)  # Within 5% of base price
    
    # Calculate realistic transaction value based on quantity and market price
    quantity = random.randint(1, 100)
    transaction_value = market_price * quantity * random.uniform(0.95, 1.05)
    
    # Generate realistic geographical distance
    geo_distance = random.uniform(100, 10000)  # km
    
    # Generate realistic temporal values
    manufacturing_date = fake.date_time_between(
        start_date=timestamp - timedelta(days=shelf_life_days),
        end_date=timestamp - timedelta(days=1)
    )
    
    # Calculate transaction completion time (in hours)
    completion_time = random.uniform(0.5, 48)  # Between 30 minutes and 2 days
    
    # Generate historical transaction counts
    sender_history = random.randint(5, 1000)
    receiver_history = random.randint(5, 1000)
    
    return {
        'transaction_id': generate_transaction_id(),
        'timestamp': timestamp,
        'sender_address': sender['address'],
        'receiver_address': receiver['address'],
        'product_id': generate_product_id(),
        'transaction_value': transaction_value,
        'transaction_volume': quantity,
        'payment_method': random.choice(PAYMENT_METHODS),
        'transaction_completion_time': completion_time,
        'product_category': product_category,
        'manufacturer_id': random.choice(MANUFACTURERS),
        'manufacturing_location': random.choice(MANUFACTURING_LOCATIONS),
        'manufacturing_timestamp': manufacturing_date,
        'expected_shelf_life': shelf_life_days,
        'product_certification_status': random.choice(CERTIFICATION_STATUSES),
        'sender_historical_transaction_count': sender_history,
        'receiver_historical_transaction_count': receiver_history,
        'network_connection_strength': random.uniform(0.1, 1.0),
        'geographical_distance': geo_distance,
        'time_zone_difference': abs(sender['timezone'] - receiver['timezone']),
        'market_price_deviation': (transaction_value / (market_price * quantity) - 1) * 100,
        'seasonality_factor': random.uniform(0.8, 1.2),
        'supply_chain_node_type': sender['type'],
        'transportation_method': random.choice(TRANSPORTATION_METHODS),
        'temperature_logs': random.uniform(15, 30),
        'is_fraud': 0
    }

def generate_fraudulent_transaction():
    """Generate a fraudulent transaction with suspicious patterns"""
    # Start with a normal transaction and modify it
    transaction = generate_normal_transaction()
    
    # Apply one or more fraud patterns
    fraud_type = random.randint(1, 6)
    
    if fraud_type == 1:
        # Price manipulation
        transaction['market_price_deviation'] = random.uniform(20, 50) * random.choice([-1, 1])
        transaction['transaction_value'] = transaction['transaction_value'] * (1 + transaction['market_price_deviation']/100)
    
    elif fraud_type == 2:
        # Circular transaction (sender and receiver are suspiciously connected)
        transaction['network_connection_strength'] = random.uniform(0.9, 1.0)
        transaction['geographical_distance'] = random.uniform(0, 50)  # Very close geographically
    
    elif fraud_type == 3:
        # Timestamp manipulation
        if random.choice([True, False]):
            # Future dated manufacturing
            transaction['manufacturing_timestamp'] = fake.date_time_between(
                start_date=transaction['timestamp'],
                end_date=transaction['timestamp'] + timedelta(days=30)
            )
        else:
            # Unrealistic shelf life
            transaction['expected_shelf_life'] = random.randint(2000, 3650)  # Unrealistically long shelf life
    
    elif fraud_type == 4:
        # Transaction speed anomaly
        transaction['transaction_completion_time'] = random.choice([
            random.uniform(0.01, 0.1),  # Too fast
            random.uniform(100, 200)    # Too slow
        ])
    
    elif fraud_type == 5:
        # New participant with high volume
        transaction['sender_historical_transaction_count'] = random.randint(0, 3)
        transaction['transaction_volume'] = random.randint(500, 1000)
    
    else:
        # Certification fraud
        transaction['product_certification_status'] = 'Expired'
        transaction['market_price_deviation'] = random.uniform(10, 30)  # Selling at a discount
    
    transaction['is_fraud'] = 1
    return transaction

# Generate the dataset
data = []
num_fraudulent = int(NUM_RECORDS * FRAUD_PERCENTAGE)
num_normal = NUM_RECORDS - num_fraudulent

# Generate normal transactions
for _ in range(num_normal):
    data.append(generate_normal_transaction())

# Generate fraudulent transactions
for _ in range(num_fraudulent):
    data.append(generate_fraudulent_transaction())

# Convert to DataFrame
df = pd.DataFrame(data)

# Shuffle the dataset
df = df.sample(frac=1).reset_index(drop=True)

# Save to CSV
df.to_csv('blockchain_supply_chain_dataset.csv', index=False)

print(f"Dataset generated with {NUM_RECORDS} records ({num_fraudulent} fraudulent, {num_normal} normal)")
print(f"Saved to 'blockchain_supply_chain_dataset.csv'")

# Display dataset statistics
print("\nDataset Statistics:")
print(f"Total records: {len(df)}")
print(f"Fraudulent transactions: {df['is_fraud'].sum()} ({df['is_fraud'].mean()*100:.2f}%)")
print(f"Feature count: {len(df.columns)}")
print("\nSample of the dataset:")
print(df.head())