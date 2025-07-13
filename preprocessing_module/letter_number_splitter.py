import pandas as pd
import numpy as np
from typing import Union
from sklearn.base import BaseEstimator, TransformerMixin


class LetterNumberSplitter(BaseEstimator, TransformerMixin):
    """
    Splits string values in specified columns into alphabetic prefix and numeric suffix.

    Example:
        "PC 17599" → Prefix: "PC", Number: "17599"
        "C85" → Prefix: "C", Number: "85"
    """

    def __init__(self, columns: Union[str, list[str]] = "all", space: bool = True) -> None:
        """
        Initialize the transformer.

        Args:
            columns (str or list): Columns to apply the transformation to. Use "all" to apply to all columns.
            space (bool): Whether to expect a space between prefix and number (e.g., "PC 17599").
        """
        self.columns = columns
        self.space = space
        self.columns_ = []

    def fit(self, df: pd.DataFrame, y=None) -> "LetterNumberSplitter":
        """
        Validate input and store columns to process.

        Args:
            df (pd.DataFrame): Input DataFrame.
            y: Ignored.

        Returns:
            self
        """
        if not isinstance(df, pd.DataFrame):
            raise TypeError("Input must be a pandas DataFrame.")

        self.columns_ = df.columns if self.columns == "all" else self.columns

        for col in self.columns_:
            if col not in df.columns:
                raise ValueError(f"Column '{col}' not found in input DataFrame.")

        return self

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Apply the prefix-number split transformation.

        Args:
            df (pd.DataFrame): Input DataFrame.

        Returns:
            pd.DataFrame: DataFrame with added _Prefix and _Number columns.
        """


        if self.columns_ is None or len(self.columns_) == 0:
            raise ValueError("Call 'fit' before 'transform'.")

        df_copy = df.copy()

        for col in self.columns_:
            original = df[col]

            # Convert to string for regex processing
            df_copy[col] = df_copy[col].astype(str)

            if self.space:
                df_copy[f"{col}_Prefix"] = df_copy[col].str.extract(r'^([A-Za-z./\d]+)?\s')
                df_copy[f"{col}_Number"] = df_copy[col].str.extract(r'(\d+)$')
            else:
                df_copy[f"{col}_Prefix"] = df_copy[col].str.extract(r'([A-Za-z]+)')
                df_copy[f"{col}_Number"] = df_copy[col].str.extract(r'(\d+)')

            # Restore original column values (preserve NaNs and types)
            df_copy[col] = original

        # Replace string "nan" with proper np.nan
        df_copy.replace("nan", np.nan, inplace=True)

        return df_copy

    def fit_transform(self, df: pd.DataFrame, y=None) -> pd.DataFrame:
        """
        Fit and transform the DataFrame.

        Args:
            df (pd.DataFrame): Input DataFrame.
            y: Ignored.

        Returns:
            pd.DataFrame: Transformed DataFrame.
        """
        return self.fit(df).transform(df)
