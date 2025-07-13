import pandas as pd
from preprocessing_module.letter_number_splitter import LetterNumberSplitter

def LetterNumberSplitterTest():
    # Sample data
    df = pd.DataFrame({
        "ticket": ["PC 17599", "C85", "A/5 21171", "STON/O2. 3101282", None],
        "other": ["X123", "Y456", "Z789", None, "P321"]
    })

    print("==> Testing with space=True (default):")
    splitter_space = LetterNumberSplitter(columns=["ticket"], space=True)
    df_transformed_space = splitter_space.fit_transform(df)
    print(df_transformed_space)

    print("\n==> Testing with space=False:")
    splitter_no_space = LetterNumberSplitter(columns=["ticket"], space=False)
    df_transformed_no_space = splitter_no_space.fit_transform(df)
    print(df_transformed_no_space)

    print("\n==> Testing multiple columns with mixed patterns:")
    splitter_multi = LetterNumberSplitter(columns=["ticket", "other"], space=False)
    df_transformed_multi = splitter_multi.fit_transform(df)
    print(df_transformed_multi)

    print("\n==> Testing with invalid column:")
    try:
        splitter_invalid = LetterNumberSplitter(columns=["missing_col"])
        splitter_invalid.fit_transform(df)
    except ValueError as e:
        print("✅ ValueError caught as expected:")
        print(e)

if __name__ == "__main__":
    LetterNumberSplitterTest()
