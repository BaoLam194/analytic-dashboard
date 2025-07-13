from individual_test_file import (
    FillAllTest,
    FillNumberTest,
    LetterNumberSplitterTest,
    LowUniqueCategoricalEncoderTest,
    FillStringTest,
    NumericalImputeTest,
)


def run_all_tests():
    print("🧪 Running FillAllTest...")
    FillAllTest()

    print("🧪 Running FillNumberTest...")
    FillNumberTest()

    print("🧪 Running LetterNumberSplitterTest...")
    LetterNumberSplitterTest()

    print("🧪 Running LowUniqueCategoricalEncoderTest...")
    LowUniqueCategoricalEncoderTest()

    print("🧪 Running FillStringTest...")
    FillStringTest()

    print("🧪 Running NumericalImputeTest...")
    NumericalImputeTest()

if __name__ == "__main__":
    run_all_tests()