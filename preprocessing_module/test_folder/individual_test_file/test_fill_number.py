import pandas as pd
from preprocessing_module.fill_number import FillNumber

def FillNumberTest():
    # Create a DataFrame with numeric columns containing missing values
    df = pd.DataFrame({
        "height": [160, 170, None, 180],
        "weight": [55.0, None, 65.0, 70.0],
        "age": [None, 22, 30, 28]
    })

    print("==> Testing FillNumber with mean strategy:")
    filler_mean = FillNumber(strategy="mean")
    df_filled_mean = filler_mean.fit_transform(df)
    print(df_filled_mean)

    print("\n==> Testing FillNumber with median strategy:")
    filler_median = FillNumber(strategy="median")
    df_filled_median = filler_median.fit_transform(df)
    print(df_filled_median)

    print("\n==> Testing FillNumber with specific columns:")
    df_partial = pd.DataFrame({
        "x": [1.0, None, 3.0],
        "y": ["a", "b", "c"]  # non-numeric
    })
    try:
        filler = FillNumber(columns=["x", "y"], strategy="mean")
        filler.fit_transform(df_partial)
    except TypeError as e:
        print("✅ TypeError caught as expected (non-numeric column):")
        print(e)

if __name__ == "__main__":
    FillNumberTest()
