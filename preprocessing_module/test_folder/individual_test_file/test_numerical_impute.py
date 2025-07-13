import pandas as pd
import numpy as np
from preprocessing_module.numerical_impute import NumericalPreprocessor  # Adjust the path as needed

def NumericalImputeTest():
    # Create a sample DataFrame with missing values
    df = pd.DataFrame({
        "A": [1.0, 2.0, np.nan, 4.0, 5.0],
        "B": [100, 200, 300, np.nan, 500],
        "C": ["x", "y", "z", "x", "y"]  # non-numeric, should be ignored
    })

    # Test median imputation with scaling
    preprocessor1 = NumericalPreprocessor(use_median=True, use_scale=True)
    preprocessor1.fit(df)
    transformed1 = preprocessor1.transform(df)

    assert isinstance(transformed1, pd.DataFrame), "Output is not a DataFrame"
    assert transformed1.shape == df.shape, "Shape mismatch after transformation"
    assert np.allclose(transformed1["A"].mean(), 0, atol=1e-6), "Column A not scaled properly"
    assert np.allclose(transformed1["B"].std(ddof=0), 1, atol=1e-6), "Column B not scaled properly"
    assert transformed1["C"].equals(df["C"]), "Non-numeric column C should remain unchanged"

    # Test mean imputation without scaling
    preprocessor2 = NumericalPreprocessor(use_median=False, use_scale=False)
    preprocessor2.fit(df)
    transformed2 = preprocessor2.transform(df)

    assert not transformed2.isnull().any().any(), "There should be no missing values after imputation"
    assert np.isclose(transformed2["A"].iloc[2], df["A"].mean(skipna=True)), "Mean imputation failed for column A"
    assert np.isclose(transformed2["B"].iloc[3], df["B"].mean(skipna=True)), "Mean imputation failed for column B"
    assert transformed2["C"].equals(df["C"]), "Non-numeric column C should remain unchanged"

    print("All tests passed!")

if __name__ == "__main__":
    NumericalImputeTest()