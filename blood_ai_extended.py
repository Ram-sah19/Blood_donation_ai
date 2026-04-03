# blood_ai_extended.py

import google.generativeai as genai
import json
import pickle
import os
import requests
import re
from dotenv import load_dotenv

load_dotenv()

# Load your trained model
with open("blood_model.pkl", "rb") as f:
    model = pickle.load(f)

# 🔑 Set Gemini API key securely from .env
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# Gemini model setup
model_name = "models/gemini-2.5-flash"
chat = genai.GenerativeModel(model_name).start_chat()

# 🩸 User input
prompt = input("\n🩸 Enter patient's condition & blood request: ")

# Ask Gemini to extract structured info
response = chat.send_message(f"""
Extract the blood request in this exact JSON format:
{{
    "urgency_level": "",
    "blood_group": "",
    "units_needed": 0,
    "purity_required": "",
    "city": ""
}}
Message: {prompt}
""")

# 🧠 Get Gemini reply as text
response_text = response.text.strip()

print("\n🔍 Gemini Raw Response:\n", response_text)

# ✅ Clean and extract JSON block only
match = re.search(r"\{.*\}", response_text, re.DOTALL)
if not match:
    print("❌ Error: No valid JSON found in Gemini response.")
    exit()

try:
    info = json.loads(match.group())
except json.JSONDecodeError:
    print("❌ Error: Failed to parse Gemini response into JSON.")
    exit()

# 📋 Display info
print("\n🧾 Extracted Info:")
for key, val in info.items():
    print(f"{key.capitalize().replace('_', ' ')}: {val}")

# Dummy feature values for model prediction
recency = 2
frequency = 3
monetary = info.get("units_needed", 1)
time = 4

# Model prediction
prediction = model.predict([[recency, frequency, monetary, time]])[0]

print("\n🤖 AI Prediction:")
if prediction == 1:
    print("✅ Proceed: Blood request is likely valid and can be fulfilled.")
else:
    print("⚠️ Caution: Blood request may not be prioritized, review further.")

# 📍 Find nearby hospitals
def find_hospitals(city):
    print(f"\n🔍 Searching hospitals in: {city}")
    url = f"https://nominatim.openstreetmap.org/search.php?q=hospital+in+{city}&format=jsonv2"
    try:
        res = requests.get(url)
        hospitals = res.json()
        if hospitals:
            print("\n🏥 Nearby Hospitals:")
            for i, h in enumerate(hospitals[:3], 1):
                print(f"{i}. {h.get('display_name')}")
        else:
            print("No hospitals found.")
    except Exception as e:
        print("Error fetching hospital info:", e)

if info.get("city"):
    find_hospitals(info["city"])

# 📨 Simulate notifications
print("\n📩 Notifying donors of blood type:", info.get("blood_group"))
print("📍 Sharing recipient hospital/location to matched donors.")

# 🛰️ Simulate tracking
donor_location = "Donor at 13.0827°N, 80.2707°E (Chennai)"
recipient_location = f"Recipient in {info.get('city', 'unknown')}"
print(f"\n📡 Tracking started:")
print(f" - Donor: {donor_location}")
print(f" - Recipient: {recipient_location}")

# 🔔 Notify blood bank
print("\n🔔 Blood bank notified about urgent request for", info.get("blood_group"))
print("📞 Blood bank is on the way to hospital.")
