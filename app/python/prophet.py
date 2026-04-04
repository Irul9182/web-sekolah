

import sys
import json
import pandas as pd
from prophet import Prophet
from datetime import datetime

def main():
    input_data = sys.stdin.read()
    
    try:
        payload = json.loads(input_data)
    except json.JSONDecodeError:
        print(json.dumps({"error": "Invalid JSON input"}))
        sys.exit(1)


    data = [
        {"ds": "2024-01-01", "y": 105000000},
        {"ds": "2024-02-01", "y": 80000000},
        {"ds": "2024-03-01", "y": 92000000},
        {"ds": "2024-04-01", "y": 115000000},
        {"ds": "2024-05-01", "y": 98000000},
        {"ds": "2024-06-01", "y": 120000000},
        {"ds": "2024-07-01", "y": 110000000},
        {"ds": "2024-08-01", "y": 95000000},
        {"ds": "2024-09-01", "y": 130000000},
        {"ds": "2024-10-01", "y": 125000000},
        {"ds": "2024-11-01", "y": 140000000},
        {"ds": "2024-12-01", "y": 160000000},
    ]
    # ────────────────────────────────────────────────────────────

    # Ambil periods dari payload, default 6 bulan
    periods = payload.get("periods", 6)

    # Buat DataFrame
    df = pd.DataFrame(data)
    df["ds"] = pd.to_datetime(df["ds"])
    df["y"] = df["y"].astype(float)

    # Training model Prophet
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=False,
        daily_seasonality=False,
        interval_width=0.95  # 95% confidence interval
    )
    model.fit(df)

    # Prediksi ke depan
    future = model.make_future_dataframe(periods=periods, freq="MS")
    forecast = model.predict(future)

    # Pisahkan data aktual vs prediksi
    last_actual_date = df["ds"].max()

    result_actual = []
    result_forecast = []

    for _, row in forecast.iterrows():
        entry = {
            "ds": row["ds"].strftime("%Y-%m-%d"),
            "yhat": round(row["yhat"], 2),
            "yhat_lower": round(row["yhat_lower"], 2),
            "yhat_upper": round(row["yhat_upper"], 2),
        }
        if row["ds"] <= last_actual_date:
            result_actual.append(entry)
        else:
            result_forecast.append(entry)

    # Output JSON
    output = {
        "status": "success",
        "periods": periods,
        "trained_on": len(data),
        "actual": result_actual,
        "forecast": result_forecast,
    }

    print(json.dumps(output))

if __name__ == "__main__":
    main()