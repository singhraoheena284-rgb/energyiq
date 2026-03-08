# from fastapi import APIRouter
# from services.prophet_service import load_model, generate_forecast

# router = APIRouter()

# model = load_model()


# @router.get("/forecast")
# def forecast():

#     result = generate_forecast(model)

#     return result.to_dict(orient="records")



from fastapi import APIRouter
from services.prophet_service import load_model, generate_forecast

router = APIRouter()

model = load_model()

@router.get("/forecast")
def forecast():
    result = generate_forecast(model)
    return result.to_dict(orient="records")