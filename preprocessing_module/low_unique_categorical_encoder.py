import pandas as pd
from typing import Union
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import OneHotEncoder, OrdinalEncoder

class LowUniqueCategoricalEncoder(BaseEstimator, TransformerMixin):
    """
    Encodes categorical columns with low unique values using either OneHot or Ordinal encoding.
    """

    def __init__(self, columns: Union[str, list[str]] = "all", use_onehot: bool = True):
        """
        Initialize the encoder.

        Args:
            columns (str or list): Columns to encode. Use "all" to encode all columns.
            use_onehot (bool): Whether to use OneHotEncoder. If False, uses OrdinalEncoder.
        """
        self.columns = columns
        self.use_onehot = use_onehot
        self.encoders = {}
        self.output_columns = []
        self.columns_ = []  # stores actual columns fitted on

    def fit(
            self,
            df: pd.DataFrame,
            y=None
    ):
        """
        Fit the encoders to each column.

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

        for col in columns_to_process:
            if col not in df.columns:
                raise ValueError(f"Column '{col}' not found in input DataFrame.")

            if self.use_onehot:
                encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
                encoder.fit(df[[col]])
                self.output_columns.extend(encoder.get_feature_names_out([col]))
            else:
                encoder = OrdinalEncoder(handle_unknown='use_encoded_value', unknown_value=-1)
                encoder.fit(df[[col]])
                self.output_columns.append(col)

            self.encoders[col] = encoder

        return self

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Transform the DataFrame using the fitted encoders.

        Args:
            df (pd.DataFrame): Input DataFrame.

        Returns:
            pd.DataFrame: Transformed DataFrame.
        """
        if not self.encoders:
            raise ValueError("Call 'fit' before 'transform'.")

        df_copy = df.copy()
        transformed_parts = []

        for col in self.columns_:
            if col not in df_copy.columns:
                raise ValueError(f"Column '{col}' missing in input during transform.")

            encoder = self.encoders[col]
            transformed = encoder.transform(df_copy[[col]])

            if self.use_onehot:
                col_names = encoder.get_feature_names_out([col])
            else:
                col_names = [col]

            transformed_df = pd.DataFrame(transformed, columns=col_names, index=df_copy.index)
            transformed_parts.append(transformed_df)

        return pd.concat(transformed_parts, axis=1)

    def fit_transform(self, df: pd.DataFrame, y=None) -> pd.DataFrame:
        """
        Fit and transform the input DataFrame.

        Args:
            df (pd.DataFrame): Input DataFrame.
            y: Ignored.

        Returns:
            pd.DataFrame: Transformed DataFrame.
        """
        return self.fit(df).transform(df)
