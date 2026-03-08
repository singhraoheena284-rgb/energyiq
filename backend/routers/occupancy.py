from fastapi import APIRouter
import random

from services.prophet_service import load_model, generate_forecast

router = APIRouter()

@router.get("/occupancy/forecast")
def occupancy_forecast():

    model = load_model()
    forecast = generate_forecast(model)

    return forecast.to_dict(orient="records")

@router.get("/metrics")
async def get_occupancy_metrics():
    # Mocking YOLOv8 based occupancy detection
    zones = ["Library", "Cafeteria", "Main Hall", "Lab 1", "Auditorium"]
    data = []
    
    total_people = 0
    active_zones = 0
    
    for zone in zones:
        # Generate some random logical data
        people = random.randint(0, 50)
        total_people += people
        if people > 5:
            active_zones += 1
            
        data.append({
            "zone": zone,
            "people_count": people,
            "status": "Busy" if people > 30 else "Normal" if people > 10 else "Empty",
            # Simulated bounding box count
            "detections": people + random.randint(0, 2)
        })
        
    return {
        "timestamp": "now",
        "total_people": total_people,
        "active_zones": active_zones,
        "zones_data": data
    }


@router.get("/prophet-forecast")
async def get_prophet_forecast(periods: int = 30, freq: str = "D"):
    """
    Returns T60 data in Prophet format: historical series and Prophet forecast.
    Uses T60/GUI_NO.D0601.xlsx (or first available) as occupancy-related time series.
    """
    # try:
    #     result = build_prophet_forecast(periods=periods, freq=freq)
    #     return result
    # except FileNotFoundError as e:
    #     raise HTTPException(status_code=404, detail=str(e))
    # except Exception as e:
    #     raise HTTPException(status_code=500, detail=str(e))
