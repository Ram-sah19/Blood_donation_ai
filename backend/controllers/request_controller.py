import os
import json
import re
import pickle
from fastapi import APIRouter, HTTPException
import google.generativeai as genai
from dotenv import load_dotenv

from backend.models.schemas import NLRequest, StructuredBloodRequest
from backend.core.database import requests_collection

router = APIRouter(prefix="/requests", tags=["Blood Requests"])

load_dotenv()

# Load ML trained model
model_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "blood_model.pkl")
with open(model_path, "rb") as f:
    model = pickle.load(f)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=api_key)
chat = genai.GenerativeModel("models/gemini-2.5-flash").start_chat()

@router.post("/parse-nlp")
async def parse_nlp(req: NLRequest):
    """Takes a raw paragraph from the doctor and auto-fills the structured schema Fields."""
    prompt = f"""
    Extract the medical request into this exact JSON format. If a field is missing, leave it as an empty string (or 0 for numbers).
    {{
      "patient_name": "",
      "patient_age": 0,
      "patient_gender": "",
      "disease": "",
      "blood_group_required": "",
      "units_needed": 0,
      "urgency_level": "Medium",
      "required_date": "",
      "notes": ""
    }}
    Message: {req.message}
    """
    try:
        response = chat.send_message(prompt)
        match = re.search(r"\{.*\}", response.text.strip(), re.DOTALL)
        if not match:
            raise ValueError("No JSON found from AI.")
        info = json.loads(match.group())
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI Parse Error: {str(e)}")

@router.post("/create")
async def create_structured_request(req: StructuredBloodRequest):
    """Saves the final structured request and assigns ML Priority."""
    try:
        # Dummy features for ranking model
        monetary = req.units_needed if req.units_needed > 0 else 1
        prediction = int(model.predict([[2, 3, monetary, 4]])[0])
        status_msg = "Proceed" if prediction == 1 else "Caution"
        
        db_request = req.model_dump()
        db_request["ai_prediction"] = prediction
        db_request["prediction_message"] = status_msg
        
        # Insert into Mongo
        result = await requests_collection.insert_one(db_request)
        db_request["_id"] = str(result.inserted_id)
        
        return db_request
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database/Model Error: {str(e)}")

@router.get("/active")
async def get_active_requests():
    cursor = requests_collection.find({"status": "open"})
    requests = await cursor.to_list(length=100)
    for req in requests:
        req["_id"] = str(req["_id"])
    return requests
