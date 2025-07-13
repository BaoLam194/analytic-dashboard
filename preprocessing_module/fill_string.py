import pandas as pd
from typing import Union
from sklearn.base import BaseEstimator, TransformerMixin

class FillString(BaseEstimator, TransformerMixin):
    """
    Imputes missing string values using the mode (most frequent value) for each column.
    """

    def __init__(self, columns: Union[str, list[str]] = "all"):
        """
        Initialize the FillString transformer.

        Args:
            columns (str or list): Columns to impute. Use "all" to apply to all columns.
        """
        self.columns = columns
        self.fill_values = {}
        self.columns_ = []

    def fit(self, df: pd.DataFrame, y=None) -> "FillString":
        """
        Compute the mode (most frequent value) for each selected column.

        Args:
            df (pd.DataFrame): Input DataFrame.
            y: Ignored.

        Returns:
            self
        """
        if not isinstance(df, pd.DataFrame):
            raise TypeError("Input must be a pandas DataFrame.")

        columns_to_process = df.columns if self.columns == "all" else self.columns
        self.columns_ = list(columns_to_process)

        for col in self.columns_:
            if col not in df.columns:
                raise ValueError(f"Column '{col}' not found in input DataFrame.")

            mode_series = df[col].mode(dropna=True)
            if mode_series.empty:
                raise ValueError(f"No non-null values to compute mode for column '{col}'.")

            self.fill_values[col] = mode_series[0]

        return self

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Fill missing values in the selected columns using the computed mode.

        Args:
            df (pd.DataFrame): Input DataFrame.

        Returns:
            pd.DataFrame: Transformed DataFrame with missing values filled.
        """
        if not self.fill_values:
            raise ValueError("Call 'fit' before 'transform'.")

        df_copy = df.copy()

        for col, fill_val in self.fill_values.items():
            if col not in df_copy.columns:
                raise ValueError(f"Column '{col}' missing in input during transform.")
            df_copy[col] = df_copy[col].fillna(fill_val)

        return df_copy

    def fit_transform(self, df: pd.DataFrame, y=None) -> pd.DataFrame:
        """
        Fit and transform the DataFrame in a single step.

        Args:
            df (pd.DataFrame): Input DataFrame.
            y: Ignored.

        Returns:
            pd.DataFrame: Transformed DataFrame with missing values filled.
        """
        return self.fit(df).transform(df)
