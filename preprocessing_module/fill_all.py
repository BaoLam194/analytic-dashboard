from typing import Literal

from sklearn.base import BaseEstimator, TransformerMixin
from preprocessing_module.fill_number import FillNumber
from preprocessing_module.fill_string import FillString
import pandas as pd


class FillAll(BaseEstimator, TransformerMixin):
    """
    Fills missing values in both numeric and string columns
    by composing FillNumber and FillString classes.
    """

    def __init__(
        self,
        numeric_strategy: Literal["mean", "median"] = "mean",
    ):
        self.numeric_strategy = numeric_strategy
        self.fill_number = None
        self.fill_string = None
        self.unsupported_columns = []

    def fit(self, df: pd.DataFrame, y=None) -> "FillAll":
        if not isinstance(df, pd.DataFrame):
            raise TypeError("Input must be a pandas DataFrame.")

        numeric_cols = []
        string_cols = []

        for col in df.columns:
            series = df[col].dropna()

            if pd.api.types.is_numeric_dtype(series):
                numeric_cols.append(col)
            elif pd.api.types.is_string_dtype(series):
                string_cols.append(col)
            else:
                self.unsupported_columns.append(col)

        if self.unsupported_columns:
            raise TypeError(f"Unsupported column types in: {self.unsupported_columns}")

        self.fill_number = FillNumber(columns=numeric_cols, strategy=self.numeric_strategy)
        self.fill_string = FillString(columns=string_cols)

        # Fit both transformers
        if numeric_cols:
            self.fill_number.fit(df)
        if string_cols:
            self.fill_string.fit(df)

        return self

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        if self.fill_number is None or self.fill_string is None:
            raise ValueError("Call 'fit' before 'transform'.")

        df_copy = df.copy()

        if self.fill_number.columns_:
            df_copy = self.fill_number.transform(df_copy)
        if self.fill_string.columns_:
            df_copy = self.fill_string.transform(df_copy)

        return df_copy

    def fit_transform(self, df: pd.DataFrame, y=None) -> pd.DataFrame:
        return self.fit(df).transform(df)