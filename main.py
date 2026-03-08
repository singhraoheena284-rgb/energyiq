from fastapi import FastAPI
from routers.forecast import router as forecast_router

app = FastAPI()

app.include_router(forecast_router)
# app.include_router(forecast_router, prefix="/api")