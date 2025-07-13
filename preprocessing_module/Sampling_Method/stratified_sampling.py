from typing import Optional, Tuple
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.model_selection import train_test_split

class StratifiedSplitter(BaseEstimator, TransformerMixin):
    """
    Stratified splitter for DataFrame, preserving target distribution in train/validation split.

    Attributes:
        target_col (str): The name of the target column for stratification.
        test_size (float): Fraction of data to be used as validation set.
        random_state (int): Random seed for reproducibility.
    """

    def __init__(self, target_col: str, test_size: float = 0.2, random_state: int = 42) -> None:
        """
        Initialize the StratifiedSplitter.

        Args:
            target_col (str): The column to stratify on (target).
            test_size (float): Proportion of the dataset to include in the validation split.
            random_state (int): Controls the shuffling for reproducibility.
        """
        self.target_col = target_col
        self.test_size = test_size
        self.random_state = random_state

    def fit(self, X: pd.DataFrame, y: Optional[pd.Series] = None) -> "StratifiedSplitter":
        """
        Fit method for compatibility. Does nothing.

        Args:
            X (pd.DataFrame): Input data.
            y (pd.Series, optional): Unused.

        Returns:
            self: The fitted splitter.
        """
        return self

    def transform(
        self, X: pd.DataFrame
    ) -> Tuple[pd.DataFrame, pd.Series, pd.DataFrame, pd.Series]:
        """
        Perform the stratified split.

        Args:
            X (pd.DataFrame): The full dataset including target column.

        Returns:
            Tuple: X_train, y_train, X_validate, y_validate
        """
        if self.target_col not in X.columns:
            raise ValueError(f"Target column '{self.target_col}' not found in the dataset.")

        y = X[self.target_col]
        X_features = X.drop(columns=[self.target_col])

        X_train, X_validate, y_train, y_validate = train_test_split(
            X_features,
            y,
            test_size=self.test_size,
            stratify=y,
            random_state=self.random_state
        )

        return X_train, y_train, X_validate, y_validate
