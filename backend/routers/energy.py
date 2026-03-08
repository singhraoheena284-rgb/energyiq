from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
import schemas
import random
from datetime import datetime
import asyncio

router = APIRouter(
    prefix="/api/energy",
    tags=["energy"]
)

# Simulate XGBoost prediction and current data retrieval
@router.get("/current", response_model=schemas.EnergyDataResponse)
async def get_current_energy(db: Session = Depends(get_db)):
    # Simulate a small delay for "model inference"
    await asyncio.sleep(0.1)
    
    # Generate realistic pseudo-random data
    base_consumption = 400
    consumption = base_consumption + random.uniform(-20, 50)
    
    # Solar generation peaks midday, let's just use a random value for now
    hour = datetime.now().hour
    if 6 <= hour <= 18:
        solar = 200 + random.uniform(-10, 80)
    else:
        solar = 0
        
    predicted = consumption + random.uniform(10, 40)
    carbon = (consumption - solar) * 0.4  # simple mock formula
    if carbon < 0: carbon = 0

    return {
        "id": random.randint(1, 1000),
        "timestamp": datetime.now(),
        "consumption_kwh": round(consumption, 2),
        "solar_generation_kwh": round(solar, 2),
        "predicted_demand_kwh": round(predicted, 2),
        "carbon_emissions_kg": round(carbon, 2)
    }

@router.get("/forecast")
async def get_energy_forecast():
    # Return mock array of forecast data for charts
    times = [f"{i:02d}:00" for i in range(24)]
    data = []
    for t in times:
        is_day = 6 <= int(t[:2]) <= 18
        data.append({
            "time": t,
            "demand": random.randint(200, 600),
            "solar": random.randint(50, 350) if is_day else 0,
            "prediction": random.randint(250, 650)
        })
    return data
