import joblib
import pandas as pd

from fastapi import FastAPI
from pydantic import BaseModel, Field

app = FastAPI(title="Waste War Reward Prediction API")

# Load model once when the service starts
model_pipeline = joblib.load("model.pkl")


class ItemDetails(BaseModel):
    category: str
    material: str
    weight_kg: float = Field(gt=0)
    age_years: float = Field(ge=0)


@app.get("/")
def home():
    return {"message": "Waste War ML API is running"}


@app.post("/predict")
def predict_reward_points(item: ItemDetails):
    input_data = pd.DataFrame([{
        "category": item.category,
        "material": item.material,
        "weight_kg": item.weight_kg,
        "age_years": item.age_years
    }])

    prediction = model_pipeline.predict(input_data)[0]

    return {
        "estimated_reward_points": round(
            max(0, float(prediction)), 2
        )
    }