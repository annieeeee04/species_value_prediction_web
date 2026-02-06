from fastapi import FastAPI
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os

app = FastAPI()

# Allow React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(__file__)
MODEL_PATH = os.path.join(BASE_DIR, "model.joblib")
model = joblib.load(MODEL_PATH)

class PredictRequest(BaseModel):
    initialS1: float
    initialS2: float
    initialS3: float
    initialS4: float
    initialS5: float
    initialS6: float
    initialS7: float
    initialS8: float
    initialS9: float
    initialS10: float
    initialS11: float
    initialS12: float
    initialS13: float
    initialS14: float
    initialS15: float
    initialS16: float
    initialS17: float
    initialS18: float
    initialS19: float
    initialS20: float

@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/predict")
def predict(req: PredictRequest):
    try:
        # Model expects S1..S20 as column names
        df = pd.DataFrame([{
            "S1": req.initialS1,
            "S2": req.initialS2,
            "S3": req.initialS3,
            "S4": req.initialS4,
            "S5": req.initialS5,
            "S6": req.initialS6,
            "S7": req.initialS7,
            "S8": req.initialS8,
            "S9": req.initialS9,
            "S10": req.initialS10,
            "S11": req.initialS11,
            "S12": req.initialS12,
            "S13": req.initialS13,
            "S14": req.initialS14,
            "S15": req.initialS15,
            "S16": req.initialS16,
            "S17": req.initialS17,
            "S18": req.initialS18,
            "S19": req.initialS19,
            "S20": req.initialS20,
        }])

        pred = model.predict(df)[0]
        return {"prediction": float(pred)}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))