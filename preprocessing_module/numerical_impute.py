from typing import Optional
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import StandardScaler


class NumericalPreprocessor(BaseEstimator, TransformerMixin):
    """
    Preprocess numerical columns by imputing missing values and optionally scaling.

    Attributes:
        use_median (bool): Whether to use median for imputation (mean otherwise).
        use_scale (bool): Whether to apply StandardScaler after imputation.
        impute_values_ (dict): Stores imputation values per column.
        scaler (StandardScaler): Scaler instance used for normalization.
    """

    def __init__(self, use_median: bool = True, use_scale: bool = True) -> None:
        """
        Initialize the NumericalPreprocessor.

        Args:
            use_median (bool): Whether to impute missing values using the median. If False, uses mean.
            use_scale (bool): Whether to apply standard scaling to the numeric features.
        """
        self.use_median = use_median
        self.use_scale = use_scale
        self.impute_values_: dict[str, float] = {}
        self.scaler = StandardScaler()

    def fit(self, X: pd.DataFrame, y: Optional[pd.Series] = None) -> "NumericalPreprocessor":
        """

        Fit the imputer and scaler on the numeric columns.

        Args:
            X (pd.DataFrame): Input data.
            y (pd.Series, optional): Unused.

        Returns:
            self: The fitted transformer.
        """
        if not isinstance(X, pd.DataFrame):
            raise TypeError("Input must be a pandas DataFrame.")

        numeric_cols = X.select_dtypes(include=["number"]).columns

        for col in numeric_cols:
            self.impute_values_[col] = X[col].median() if self.use_median else X[col].mean()

        X_filled = X[numeric_cols].fillna(self.impute_values_)

        if self.use_scale:
            self.scaler.fit(X_filled)

        return self

    def transform(self, X: pd.DataFrame) -> pd.DataFrame:
        """
        Apply imputation and scaling to the numeric columns.

        Args:
            X (pd.DataFrame): Input data to transform.

        Returns:
            pd.DataFrame: Transformed DataFrame with imputed and optionally scaled values.
        """
        if not isinstance(X, pd.DataFrame):
            raise TypeError("Input must be a pandas DataFrame.")

        X_copy = X.copy()
        numeric_cols = X_copy.select_dtypes(include=["number"]).columns

        if len(numeric_cols) == 0:
            return X_copy

        for col in self.impute_values_:
            if col not in X_copy.columns:
                raise ValueError(f"Column '{col}' missing from input data during transform.")

        X_filled = X_copy[numeric_cols].fillna(self.impute_values_)

        if self.use_scale:
            X_scaled = self.scaler.transform(X_filled)
            X_copy[numeric_cols] = X_scaled
        else:
            X_copy[numeric_cols] = X_filled

        return X_copy
