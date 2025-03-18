import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.neural_network import MLPClassifier
from sklearn.metrics import classification_report, confusion_matrix, roc_auc_score, precision_recall_curve
from sklearn.model_selection import GridSearchCV
from imblearn.over_sampling import SMOTE
import matplotlib.pyplot as plt
import seaborn as sns
import xgboost as xgb
from sklearn.impute import SimpleImputer
import joblib
import time

# Load the dataset
print("Loading dataset...")
df = pd.read_csv('blockchain_supply_chain_dataset.csv')

# Data preprocessing
print("Preprocessing data...")

# Handle datetime columns
datetime_columns = ['timestamp', 'manufacturing_timestamp']
for col in datetime_columns:
    df[col] = pd.to_datetime(df[col])
    df[f'{col}_hour'] = df[col].dt.hour
    df[f'{col}_day'] = df[col].dt.day
    df[f'{col}_month'] = df[col].dt.month
    df[f'{col}_year'] = df[col].dt.year
    df[f'{col}_dayofweek'] = df[col].dt.dayofweek

# Calculate time difference between transaction and manufacturing
df['time_since_manufacturing'] = (df['timestamp'] - df['manufacturing_timestamp']).dt.total_seconds() / 3600  # in hours

# Drop original datetime columns
df = df.drop(columns=datetime_columns)

# Drop non-numeric columns that are not useful for ML
df = df.drop(columns=['transaction_id', 'sender_address', 'receiver_address', 'product_id'])

# Identify categorical and numerical columns
categorical_columns = df.select_dtypes(include=['object']).columns.tolist()
numerical_columns = df.select_dtypes(include=['int64', 'float64']).columns.tolist()
numerical_columns.remove('is_fraud')  # Remove target variable from features

# Create feature engineering pipeline
preprocessor = ColumnTransformer(
    transformers=[
        ('num', Pipeline([
            ('imputer', SimpleImputer(strategy='median')),
            ('scaler', StandardScaler())
        ]), numerical_columns),
        ('cat', Pipeline([
            ('imputer', SimpleImputer(strategy='most_frequent')),
            ('onehot', OneHotEncoder(handle_unknown='ignore'))
        ]), categorical_columns)
    ])

# Split the data
X = df.drop('is_fraud', axis=1)
y = df['is_fraud']
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

# Apply preprocessing
print("Applying preprocessing transformations...")
preprocessor.fit(X_train)
X_train_processed = preprocessor.transform(X_train)
X_test_processed = preprocessor.transform(X_test)

# Apply SMOTE to handle class imbalance
print("Applying SMOTE for class balance...")
smote = SMOTE(random_state=42)
X_train_resampled, y_train_resampled = smote.fit_resample(X_train_processed, y_train)

# Define models to train
models = {
    'Random Forest': RandomForestClassifier(n_estimators=100, random_state=42, n_jobs=-1),
    'Gradient Boosting': GradientBoostingClassifier(n_estimators=100, random_state=42),
    'XGBoost': xgb.XGBClassifier(n_estimators=100, random_state=42, n_jobs=-1),
    'Neural Network': MLPClassifier(hidden_layer_sizes=(64, 32), max_iter=300, random_state=42)
}

# Train and evaluate models
best_model = None
best_auc = 0
results = {}

print("Training models...")
for name, model in models.items():
    print(f"Training {name}...")
    start_time = time.time()
    model.fit(X_train_resampled, y_train_resampled)
    training_time = time.time() - start_time
    
    # Make predictions
    y_pred = model.predict(X_test_processed)
    y_pred_proba = model.predict_proba(X_test_processed)[:, 1]
    
    # Calculate metrics
    auc = roc_auc_score(y_test, y_pred_proba)
    report = classification_report(y_test, y_pred, output_dict=True)
    conf_matrix = confusion_matrix(y_test, y_pred)
    
    # Store results
    results[name] = {
        'model': model,
        'auc': auc,
        'report': report,
        'confusion_matrix': conf_matrix,
        'training_time': training_time
    }
    
    print(f"{name} - AUC: {auc:.4f}, Training time: {training_time:.2f} seconds")
    print(f"Classification Report:\n{classification_report(y_test, y_pred)}")
    
    # Keep track of best model
    if auc > best_auc:
        best_auc = auc
        best_model = name

# Fine-tune the best model
print(f"\nFine-tuning {best_model}...")
if best_model == 'Random Forest':
    param_grid = {
        'n_estimators': [100, 200, 300],
        'max_depth': [None, 10, 20, 30],
        'min_samples_split': [2, 5, 10],
        'min_samples_leaf': [1, 2, 4]
    }
    model = RandomForestClassifier(random_state=42, n_jobs=-1)
elif best_model == 'Gradient Boosting':
    param_grid = {
        'n_estimators': [100, 200, 300],
        'learning_rate': [0.01, 0.1, 0.2],
        'max_depth': [3, 5, 7]
    }
    model = GradientBoostingClassifier(random_state=42)
elif best_model == 'XGBoost':
    param_grid = {
        'n_estimators': [100, 200, 300],
        'learning_rate': [0.01, 0.1, 0.2],
        'max_depth': [3, 5, 7]
    }
    model = xgb.XGBClassifier(random_state=42, n_jobs=-1)
else:  # Neural Network
    param_grid = {
        'hidden_layer_sizes': [(64, 32), (128, 64), (256, 128)],
        'alpha': [0.0001, 0.001, 0.01],
        'learning_rate_init': [0.001, 0.01, 0.1]
    }
    model = MLPClassifier(max_iter=300, random_state=42)

# Perform grid search
grid_search = GridSearchCV(model, param_grid, cv=3, scoring='roc_auc', n_jobs=-1)
grid_search.fit(X_train_resampled, y_train_resampled)

# Get the best model
best_tuned_model = grid_search.best_estimator_
print(f"Best parameters: {grid_search.best_params_}")

# Evaluate the best model
y_pred = best_tuned_model.predict(X_test_processed)
y_pred_proba = best_tuned_model.predict_proba(X_test_processed)[:, 1]
auc = roc_auc_score(y_test, y_pred_proba)
report = classification_report(y_test, y_pred)
conf_matrix = confusion_matrix(y_test, y_pred)

print(f"\nTuned {best_model} - AUC: {auc:.4f}")
print(f"Classification Report:\n{report}")

# Create a complete model pipeline
final_pipeline = Pipeline([
    ('preprocessor', preprocessor),
    ('model', best_tuned_model)
])

# Save the model
print("\nSaving model...")
joblib.dump(final_pipeline, 'blockchain_fraud_detection_model.pkl')

# Feature importance analysis (if applicable)
if best_model in ['Random Forest', 'Gradient Boosting', 'XGBoost']:
    # Get feature names after preprocessing
    feature_names = []
    for name, transformer, cols in preprocessor.transformers_:
        if name == 'num':
            feature_names.extend(cols)
        elif name == 'cat':
            for col in cols:
                categories = preprocessor.named_transformers_['cat'].named_steps['onehot'].categories_[cols.index(col)]
                feature_names.extend([f"{col}_{cat}" for cat in categories])
    
    # Limit to actual number of features
    feature_names = feature_names[:X_train_processed.shape[1]]
    
    # Get feature importances
    importances = best_tuned_model.feature_importances_
    indices = np.argsort(importances)[::-1]
    
    # Print feature ranking
    print("\nFeature ranking:")
    for i in range(min(20, len(indices))):
        if i < len(feature_names):
            print(f"{i+1}. {feature_names[indices[i]]}: {importances[indices[i]]:.4f}")
    
    # Plot feature importances
    plt.figure(figsize=(12, 8))
    plt.title("Feature importances")
    plt.bar(range(min(20, len(indices))), 
            importances[indices][:20],
            align="center")
    plt.xticks(range(min(20, len(indices))), 
               [feature_names[i] if i < len(feature_names) else f"Feature {i}" for i in indices[:20]], 
               rotation=90)
    plt.tight_layout()
    plt.savefig('feature_importances.png')

# Generate ROC curve
plt.figure(figsize=(10, 8))
for name, result in results.items():
    y_pred_proba = result['model'].predict_proba(X_test_processed)[:, 1]
    fpr, tpr, _ = precision_recall_curve(y_test, y_pred_proba)
    plt.plot(fpr, tpr, label=f"{name} (AUC = {result['auc']:.4f})")

# Add tuned model
fpr, tpr, _ = precision_recall_curve(y_test, y_pred_proba)
plt.plot(fpr, tpr, label=f"Tuned {best_model} (AUC = {auc:.4f})", linewidth=2)

plt.xlabel('Recall')
plt.ylabel('Precision')
plt.title('Precision-Recall Curve')
plt.legend()
plt.grid(True)
plt.savefig('precision_recall_curve.png')

print("\nModel training and evaluation complete.")
print(f"Best model: {best_model}")
print(f"Best AUC: {auc:.4f}")
print("Model saved as 'blockchain_fraud_detection_model.pkl'")
print("Visualizations saved as 'feature_importances.png' and 'precision_recall_curve.png'")