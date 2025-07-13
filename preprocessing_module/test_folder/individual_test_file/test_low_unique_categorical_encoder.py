import pandas as pd
from preprocessing_module.low_unique_categorical_encoder import LowUniqueCategoricalEncoder

def LowUniqueCategoricalEncoderTest():
    df = pd.DataFrame({
        "color": ["red", "blue", "green", "blue", "red"],
        "size": ["S", "M", "L", "XL", "M"],
        "shape": ["circle", "square", "triangle", "circle", "square"]
    })

    print("==> Test 1: One-hot encoding (default):")
    encoder1 = LowUniqueCategoricalEncoder(columns=["color", "size"])
    df_encoded_1 = encoder1.fit_transform(df)
    print(df_encoded_1)

    print("\n==> Test 2: Ordinal encoding:")
    encoder2 = LowUniqueCategoricalEncoder(columns=["color", "size"], use_onehot=False)
    df_encoded_2 = encoder2.fit_transform(df)
    print(df_encoded_2)

    print("\n==> Test 3: Encode all columns using one-hot:")
    encoder3 = LowUniqueCategoricalEncoder(columns="all")
    df_encoded_3 = encoder3.fit_transform(df)
    print(df_encoded_3)

    print("\n==> Test 4: Handle unknown category during transform:")
    df_new = pd.DataFrame({
        "color": ["red", "purple"],  # "purple" is unseen
        "size": ["S", "XXL"]         # "XXL" is unseen
    })
    try:
        df_transformed = encoder1.transform(df_new)
        print("✅ Successfully handled unknown values:\n", df_transformed)
    except Exception as e:
        print("❌ Unexpected error during unknown category handling:")
        print(e)

    print("\n==> Test 5: Invalid column input:")
    try:
        encoder_invalid = LowUniqueCategoricalEncoder(columns=["nonexistent"])
        encoder_invalid.fit(df)
    except ValueError as e:
        print("✅ ValueError caught as expected:")
        print(e)

if __name__ == "__main__":
    LowUniqueCategoricalEncoderTest()
