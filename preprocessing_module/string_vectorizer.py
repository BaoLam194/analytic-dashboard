import numpy as np
import pandas as pd
from gensim.models import Word2Vec
from sklearn.base import BaseEstimator, TransformerMixin
from typing import Union


class StringVectorizer(BaseEstimator, TransformerMixin):
    """
    Transforms string columns into vector embeddings using character-level Word2Vec.
    """

    def __init__(
        self,
        *,
        columns: Union[str, list[str]] = "all",
        vector_size: int = 100,
        window: int = 5,
        min_count: int = 1,
        workers: int = 4,
        seed: int = 42,
    ) -> None:
        """
        Initialize the string vectorizer.

        Args:
            columns (str or list): Columns to apply vectorization to. Use "all" to apply to all string columns.
            vector_size (int): Dimensionality of the word vectors.
            window (int): Maximum distance between the current and predicted word.
            min_count (int): Ignores all words with total frequency lower than this.
            workers (int): Number of worker threads to train the model.
            seed (int): Seed for reproducibility.
        """
        self.columns = columns
        self.vector_size = vector_size
        self.window = window
        self.min_count = min_count
        self.workers = workers
        self.seed = seed
        self.models = {}
        self.columns_ = []  # Fitted column names

    def _preprocess(self, series: pd.Series) -> list[list[str]]:
        """
        Preprocess string series into character-level token lists.

        Args:
            series (pd.Series): Input string series.

        Returns:
            list[list[str]]: Tokenized characters per string.
        """
        series = series.dropna().astype(str)
        series = series[series.str.strip() != ""]
        return series.apply(lambda text: list(text.lower())).tolist()

    def fit(self, df: pd.DataFrame, y=None) -> "StringVectorizer":
        """
        Fit a Word2Vec model on each selected string column.

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

            tokenized = self._preprocess(df[col])

            if not tokenized or all(len(tokens) == 0 for tokens in tokenized):
                self.models[col] = None
                continue

            model = Word2Vec(
                tokenized,
                vector_size=self.vector_size,
                window=self.window,
                min_count=self.min_count,
                workers=self.workers,
                seed=self.seed,
            )
            self.models[col] = model

        return self

    def _vectorize(self, model: Word2Vec, text: str) -> np.ndarray:
        """
        Vectorize a single string into a fixed-size vector.

        Args:
            model (Word2Vec): Trained Word2Vec model.
            text (str): Input string.

        Returns:
            np.ndarray: Vector representation of the string.
        """
        if pd.isna(text) or model is None:
            return np.zeros(self.vector_size)
        chars = list(str(text).lower())
        vectors = [model.wv[c] for c in chars if c in model.wv]
        return np.mean(vectors, axis=0) if vectors else np.zeros(self.vector_size)

    def transform(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Transform selected string columns into vector representations.

        Args:
            df (pd.DataFrame): Input DataFrame.

        Returns:
            pd.DataFrame: DataFrame with vectorized columns.
        """
        if not self.models:
            raise ValueError("Call 'fit' before 'transform'.")

        df_copy = df.copy()
        result = []

        for col in self.columns_:
            if col not in df_copy.columns:
                raise ValueError(f"Column '{col}' missing in input during transform.")

            model = self.models[col]
            vectors = df_copy[col].apply(lambda val: self._vectorize(model, val))
            vector_df = pd.DataFrame(vectors.tolist(), index=df_copy.index)
            vector_df.columns = [f"{col}_vec_{i}" for i in range(self.vector_size)]
            result.append(vector_df)

        return pd.concat(result, axis=1)

    def fit_transform(self, df: pd.DataFrame, y=None) -> pd.DataFrame:
        """
        Fit the model and transform the DataFrame.

        Args:
            df (pd.DataFrame): Input DataFrame.
            y: Ignored.

        Returns:
            pd.DataFrame: Transformed DataFrame with vectors.
        """
        return self.fit(df).transform(df)
