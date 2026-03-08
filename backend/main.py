from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from calendar_analysis import router as calendar_router
from routers.forecast import router as forecast_router
import models
from database import engine
from routers import energy, occupancy, system

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Energy Analytics Backend API")
app.include_router(calendar_router, prefix="/analysis")
app.include_router(forecast_router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(energy.router)
app.include_router(occupancy.router)
app.include_router(system.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Energy Analytics API Gateway"}
