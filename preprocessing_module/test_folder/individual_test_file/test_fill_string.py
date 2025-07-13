import pandas as pd
from preprocessing_module.fill_string import FillString  # Adjust the path as needed

def FillStringTest():
    # Create a sample DataFrame with missing string values
    df = pd.DataFrame({
        "color": ["red", "blue", None, "blue", "red"],
        "size": ["S", None, "M", "L", "S"],
        "shape": [None, "circle", "circle", "square", None]
    })

    print("==> Testing FillString with all columns:")
    filler_all = FillString(columns="all")
    df_filled_all = filler_all.fit_transform(df)
    print(df_filled_all)

    print("\n==> Testing FillString with specific columns:")
    filler_cols = FillString(columns=["color", "size"])
    df_filled_cols = filler_cols.fit_transform(df)
    print(df_filled_cols)

    print("\n==> Testing error when column not found:")
    try:
        filler_invalid = FillString(columns=["nonexistent"])
        filler_invalid.fit(df)
    except ValueError as e:
        print("✅ ValueError caught as expected:")
        print(e)

    print("\n==> Testing error when fit is not called before transform:")
    try:
        filler_not_fit = FillString(columns="all")
        filler_not_fit.transform(df)
    except ValueError as e:
        print("✅ ValueError caught as expected:")
        print(e)

    print("\n==> Testing error on mode of all-NaN column:")
    df_nan = pd.DataFrame({
        "empty": [None, None, None]
    })
    try:
        FillString(columns="all").fit(df_nan)
    except ValueError as e:
        print("✅ ValueError caught as expected:")
        print(e)

if __name__ == "__main__":
    FillStringTest()
