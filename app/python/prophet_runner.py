import sys
import json
import pandas as pd
from prophet import Prophet
import base64


def main():
    try:
        input_data = base64.b64decode(sys.argv[1]).decode("utf-8")
        payload = json.loads(input_data)
    except Exception as e:
        print(json.dumps({
            "status": "error",
            "error": f"Invalid JSON input: {str(e)}"
        }))
        sys.exit(1)

    data    = payload.get("data", [])
    periods = payload.get("periods", 6)

    if len(data) < 6:
        print(json.dumps({
            "status": "error",
            "error": f"Data historis tidak cukup. Minimal 6 bulan, diterima {len(data)}."
        }))
        sys.exit(1)

    # Buat DataFrame
    df       = pd.DataFrame(data)
    df["ds"] = pd.to_datetime(df["ds"])
    df["y"]  = df["y"].astype(float)

    n_months = len(df)

    # ---------------------------------------------------------------
    # Tentukan seasonality berdasarkan jumlah data historis
    #
    #  < 12 bulan  → matikan semua seasonality (data terlalu sedikit)
    #  12–23 bulan → pakai seasonality manual dengan fourier_order kecil
    #  ≥ 24 bulan  → aktifkan yearly_seasonality bawaan Prophet
    # ---------------------------------------------------------------
    if n_months < 12:
        # Data < 1 tahun: tidak ada cukup sinyal musiman
        model = Prophet(
            yearly_seasonality=False,
            weekly_seasonality=False,
            daily_seasonality=False,
            interval_width=0.95,
        )

    elif n_months < 24:
        # Data 12–23 bulan: tambahkan seasonality manual dengan order rendah
        # agar tidak overfitting
        model = Prophet(
            yearly_seasonality=False,   # matikan bawaan
            weekly_seasonality=False,
            daily_seasonality=False,
            interval_width=0.95,
        )
        model.add_seasonality(
            name="yearly",
            period=365.25,
            fourier_order=3,            # rendah = smooth, tidak overfit
        )

    else:
        # Data ≥ 2 tahun: Prophet bisa deteksi pola tahunan dengan aman
        model = Prophet(
            yearly_seasonality=True,
            weekly_seasonality=False,
            daily_seasonality=False,
            interval_width=0.95,
        )

    model.fit(df)

    # Prediksi ke depan
    future   = model.make_future_dataframe(periods=periods, freq="MS")
    forecast = model.predict(future)

    last_actual_date = df["ds"].max()

    result_actual   = []
    result_forecast = []

    for _, row in forecast.iterrows():
        entry = {
            "ds":         row["ds"].strftime("%Y-%m-%d"),
            "yhat":       round(row["yhat"], 2),
            "yhat_lower": round(row["yhat_lower"], 2),
            "yhat_upper": round(row["yhat_upper"], 2),
        }
        if row["ds"] <= last_actual_date:
            result_actual.append(entry)
        else:
            result_forecast.append(entry)

    print(json.dumps({
        "status":         "success",
        "periods":        periods,
        "trained_on":     n_months,
        "seasonality":    (
            "none"   if n_months < 12 else
            "manual" if n_months < 24 else
            "full"
        ),
        "actual":         result_actual,
        "forecast":       result_forecast,
    }))


if __name__ == "__main__":
    main()