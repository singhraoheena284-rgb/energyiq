from fastapi import APIRouter
import random
from datetime import datetime

router = APIRouter(
    prefix="/api/system",
    tags=["system"]
)

@router.get("/status")
async def get_system_status():
    # Mocking system health monitor
    services = ["API Gateway", "PostgreSQL", "FastAPI Core", "XGBoost Engine", "Redis Cache", "YOLOv8 Service"]
    
    statuses = []
    for s in services:
        # 90% chance of being healthy
        is_healthy = random.random() > 0.1
        
        statuses.append({
            "service": s,
            "status": "Healthy" if is_healthy else "Warning",
            "uptime_hours": random.randint(24, 720),
            "last_check": datetime.now().isoformat()
        })
        
    return {
        "overall_health": "Good" if all(s["status"] == "Healthy" for s in statuses) else "Degraded",
        "services": statuses
    }
