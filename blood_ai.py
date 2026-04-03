import google.generativeai as genai
import json
import pickle
import os

# Load trained model
try:
    with open("blood_model.pkl", "rb") as f:
        model = pickle.load(f)
except FileNotFoundError:
    print("❌ Error: Trained model file 'blood_model.pkl' not found. Run 'train_blood_ai.py' first.")
    exit()

# 🔑 Configure Gemini API key
genai.configure(api_key="**********************")  # replace with yours if needed

# Use correct model name (adjust if not available in your key/project)
model_name = "models/gemini-1.5-pro"

# Start Gemini chat
try:
    chat = genai.GenerativeModel(model_name).start_chat()
except Exception as e:
    print("❌ Gemini Initialization Failed:", e)
    exit()

# 🩸 Input from user
prompt = input("🩸 Enter patient's condition & blood request: ")

# Ask Gemini to extract structured info
gemini_prompt = (
    "From the following message, extract ONLY a JSON object like:\n"
    "{\n"
    "  \"urgency_level\": \"\",\n"
    "  \"blood_group\": \"\",\n"
    "  \"units_needed\": 0,\n"
    "  \"purity_required\": \"\"\n"
    "}\n"
    "Reply ONLY with the JSON and nothing else.\n"
    f"Message: {prompt}"
)

try:
    response = chat.send_message(gemini_prompt)
    response_text = response.text.strip()
    print("\n🔍 Gemini Raw Response:\n", response_text)

    # Try parsing Gemini's response
    info = json.loads(response_text)
except json.JSONDecodeError:
    print("❌ Error: Gemini response was not valid JSON.")
    exit()
except Exception as e:
    print("❌ Gemini API Error:", e)
    exit()

# 🧾 Display structured info
print("\n🧾 Extracted Info:")
for key, val in info.items():
    print(f"{key.capitalize().replace('_', ' ')}: {val}")

# Simulated inputs to model
recency = 2
frequency = 3
monetary = info.get("units_needed", 1)
time = 4

# Predict donation possibility
try:
    prediction = model.predict([[recency, frequency, monetary, time]])[0]
except Exception as e:
    print("❌ Error making prediction:", e)
    exit()

# Show result
print("\n🤖 AI Prediction:")
if prediction == 1:
    print("✅ Proceed: Blood request is likely valid and can be fulfilled.")
else:
    print("⚠️ Caution: Blood request may not be prioritized, review further.")
