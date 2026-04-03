from fastapi import APIRouter, HTTPException
from backend.models.schemas import NLRequest
from backend.core.database import requests_collection
import pickle
import google.generativeai as genai
import json
import re
import os
from dotenv import load_dotenv

router = APIRouter(prefix="/requests", tags=["Blood Requests"])

load_dotenv()

# Load ML trained model from parent active directory
model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "blood_model.pkl")
with open(model_path, "rb") as f:
    model = pickle.load(f)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=api_key)
chat = genai.GenerativeModel("models/gemini-2.5-flash").start_chat()

@router.post("/process-request")
async def process_request(req: NLRequest):
    try:
        response = chat.send_message(f"Extract the blood request in strict JSON format: {{\"urgency_level\": \"\", \"blood_group\": \"\", \"units_needed\": 0, \"city\": \"\"}} from: {req.message}")
        match = re.search(r"\{.*\}", response.text.strip(), re.DOTALL)
        if not match:
            raise ValueError("No JSON found from AI.")
        info = json.loads(match.group())
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

    monetary = info.get("units_needed", 1)
    prediction = int(model.predict([[2, 3, monetary, 4]])[0])
    status_msg = "Proceed" if prediction == 1 else "Caution"

    db_request = {
        "original_message": req.message,
        "extracted_info": info,
        "ai_prediction": prediction,
        "prediction_message": status_msg,
        "status": "pending_donor"
    }
    await requests_collection.insert_one(db_request)
    return db_request

@router.get("/active")
async def get_active_requests():
    cursor = requests_collection.find({"status": "pending_donor"})
    requests = await cursor.to_list(length=100)
    for req in requests:
        req["_id"] = str(req["_id"])
    return requests
