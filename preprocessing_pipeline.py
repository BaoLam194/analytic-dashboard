import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from preprocessing_module import (
    FillString,
    LetterNumberSplitter,
    LowUniqueCategoricalEncoder,
    NumericalPreprocessor,
    StringVectorizer,
)


def preprocessor(df: pd.DataFrame) -> pd.DataFrame:
    numerical_cols = list(df.select_dtypes(include=["int64", "float64"]).columns)
    string_cols = list(df.select_dtypes(include=["object", "string"]).columns)

    # Compute low cardinality string columns
    low_card_cols = [col for col in string_cols if df[col].nunique() / len(df) < 0.2]
    text_cols = [col for col in string_cols if col not in low_card_cols]

    # Define pipelines
    num_pipe = Pipeline([
        ("num_preprocessor", NumericalPreprocessor()),
    ])

    cat_pipe = Pipeline([
        ("fill", FillString()),
        ("encode", LowUniqueCategoricalEncoder(use_onehot=True)),
    ])

    text_pipe = Pipeline([
        ("split", LetterNumberSplitter()),
        ("vectorize", StringVectorizer(vector_size=50)),
    ])

    # Combine all
    full_pipe = ColumnTransformer([
        ("num", num_pipe, numerical_cols),
        ("cat", cat_pipe, low_card_cols),
        ("text", text_pipe, text_cols),
    ], remainder='drop')

    # Fit and transform
    transformed = full_pipe.fit_transform(df)

    # Construct output DataFrame with column names if possible
    try:
        out_columns = full_pipe.get_feature_names_out()
    except AttributeError:
        out_columns = [f"feature_{i}" for i in range(transformed.shape[1])]

    return pd.DataFrame(transformed, columns=out_columns)


if __name__ == "__main__":
    #Sample, taken from online source
    df = pd.DataFrame({
        "Age": [22, 35, 58],
        "Salary": [40000, 55000, 72000],
        "Gender": ["Male", "Female", "Female"],
        "Bio": ["Born 1990", "Lives in Hanoi", "Engineer 2001"]
    })

    processed_df = preprocessor(df)
    print(processed_df)
