import pandas as pd
from typing import Union, Literal
from sklearn.base import BaseEstimator, TransformerMixin

class FillNumber(BaseEstimator, TransformerMixin):
    """
    Imputes missing numeric values using the specified strategy: 'mean' or 'median'.
    """

    def __init__(self, columns: Union[str, list[str]] = "all",
                 strategy: Literal["mean", "median"] = "mean"):
        """
        Initialize the FillNumber transformer.

        Args:
            columns (str or list): Columns to impute. Use "all" to apply to all numeric columns.
            strategy (str): Imputation strategy - "mean" or "median".
        """
        self.columns = columns
        self.strategy = strategy
        self.fill_values = {}
        self.columns_ = []

    def fit(self, df: pd.DataFrame, y=None) -> "FillNumber":
        """
        Compute the fill value for each selected column based on the strategy.

        Args:
            df (pd.DataFrame): Input DataFrame.
            y: Ignored.

        Returns:
            self
        """
        if not isinstance(df, pd.DataFrame):
            raise TypeError("Input must be a pandas DataFrame.")

        if self.columns == "all":
            columns_to_process = df.select_dtypes(include="number").columns
        else:
            columns_to_process = self.columns

        self.columns_ = list(columns_to_process)

        for col in self.columns_:
            if col not in df.columns:
                raise ValueError(f"Column '{col}' not found in input DataFrame.")

            series = df[col].dropna()

            if not pd.api.types.is_numeric_dtype(series):
                raise TypeError(f"Column '{col}' is not numeric.")

            if series.empty:
                raise ValueError(f"No non-null values to compute fill value for column '{col}'.")

            if self.strategy == "mean":
                self.fill_values[col] = series.mean()
            elif self.strategy == "median":
                self.fill_values[col] = series.median()
            else:
                raise ValueError(f"Unsupported strategy: {self.strategy}")

        return self

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Fill missing values in the selected columns using the computed fill values.

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
