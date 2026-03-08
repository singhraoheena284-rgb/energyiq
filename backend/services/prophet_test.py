import pandas as pd
from prophet import Prophet
from prophet.plot import plot_plotly

# 1 Load dataset
df = pd.read_excel("GUI_NO.D0670.xlsx")

# 2 Rename columns for Prophet
df = df.rename(columns={
    "time": "ds",
    "number": "y"
})

# 3 Clean data
df = df.dropna()

# 4 Train model
model = Prophet()
model.fit(df)

# 5 Create future dataframe
future = model.make_future_dataframe(periods=24, freq='H')

# 6 Predict
forecast = model.predict(future)

# 7 Plot graph
fig = plot_plotly(model, forecast)
fig.show()