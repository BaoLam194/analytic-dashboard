import pandas as pd
from preprocessing_module.fill_all import FillAll

def FillAllTest():
    # Sample DataFrame with numeric, string, and unsupported types
    df = pd.DataFrame({
        "age": [25, None, 30, 35],
        "name": ["Alice", None, "Charlie", "David"],
        "gender": ["F", "M", None, "M"],
        "score": [90.5, None, 85.0, 88.0],
        "registered": [True, False, True, None]  # This should raise an error
    })

    # Try block to handle the expected error
    print("==> Testing FillAll with unsupported column 'registered':")
    try:
        filler = FillAll(numeric_strategy="mean")
        df_filled = filler.fit_transform(df)
        print("Unexpected Success - this should raise an error!\n", df_filled)
    except TypeError as e:
        print("TypeError caught as expected:")
        print(e)

    # Now remove the unsupported column and test again
    df_valid = df.drop(columns=["registered"])
    print("\n==> Testing FillAll with valid numeric and string columns only:")
    filler = FillAll(numeric_strategy="median")
    df_filled = filler.fit_transform(df_valid)
    print("Transformation Successful:\n", df_filled)

# You can run it directly for now:
if __name__ == "__main__":
    FillAllTest()
