import pandas as pd
import glob
import pickle
from prophet import Prophet

DATA_PATH = "backend/data/T60/*.xlsx"
MODEL_PATH = "models/prophet_model.pkl"


def load_dataset():
    model = load_model()
    forecast = generate_forecast(model)
    files = glob.glob(DATA_PATH)[:1]

    dfs = []

    for file in files:
        df = pd.read_excel(file, engine="openpyxl")

        df = df.rename(columns={
            "time": "ds",
            "number": "y"
        })

        dfs.append(df)

    data = pd.concat(dfs)

    return data


def clean_data(df):
    df["ds"] = pd.to_datetime(df["ds"])

    df = df.sort_values("ds")

    df["y"] = df["y"].interpolate()

    df = df.dropna()

    return df


def train_model():
    df = load_dataset()
    df = clean_data(df)

    model = Prophet(
        daily_seasonality=True,
        weekly_seasonality=True
    )

    model.fit(df)

    pickle.dump(model, open(MODEL_PATH, "wb"))

    return model


def load_model():
    return pickle.load(open(MODEL_PATH, "rb"))


def generate_forecast(model, hours=24):

    future = model.make_future_dataframe(
        periods=hours,
        freq="H"
    )

    forecast = model.predict(future)

    return forecast[["ds", "yhat"]].tail(hours)