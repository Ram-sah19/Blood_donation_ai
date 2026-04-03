# train_blood_ai.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
import pickle

# Load dataset
df = pd.read_csv("transfusion.csv")

# Rename columns for consistency
df.columns = ["Recency", "Frequency", "Monetary", "Time", "Donated"]

# Split data
X = df.drop("Donated", axis=1)
y = df["Donated"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save model
with open("blood_model.pkl", "wb") as f:
    pickle.dump(model, f)

print("✅ Model trained and saved as blood_model.pkl")
