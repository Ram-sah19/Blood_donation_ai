# blood_donation_ai/api.py

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import pickle

# Load your trained model
with open("blood_model.pkl", "rb") as f:
    model = pickle.load(f)

# Define request/response format
class InputData(BaseModel):
    feature1: float
    feature2: float
    feature3: float
    # Add all the features your model expects

app = FastAPI()

# Enable CORS for frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or restrict to your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Blood Donation AI is up!"}

@app.post("/predict")
def predict(data: InputData):
    input_list = [[
        data.feature1,
        data.feature2,
        data.feature3,
        # Add the rest here
    ]]
    prediction = model.predict(input_list)
    return {"result": prediction[0]}
