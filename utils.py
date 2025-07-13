import re
import pandas as pd


def calculate_uniqueness(
        series: pd.Series
) -> float:
    """
    Calculate percentage of unique values in a pandas Series.
    """
    if series.empty:
        return 0.0
    return series.nunique(dropna=True) / series.shape[0]


def parse_name(name):
    # Split at the first comma: Last Name vs. the rest
    parts = name.split(',', 1)
    last_name = parts[0].strip()
    rest = parts[1].strip()

    match = re.match(r'([\w]+\.)(\s+[^"(]+)?\s*(["“”][^"]+["“”])?\s*(\(([^)]+)\))?', rest)

    if match:
        title = match.group(1).strip()
        first_names = (match.group(2) or '').strip()
        nickname = (match.group(3) or '').strip('"“”') if match.group(3) else None
        alt_name = match.group(5) if match.group(5) else None

        return pd.Series({
            'last_name': last_name,
            'title': title,
            'first_names': first_names,
            'nickname': nickname,
            'alternate_name': alt_name
        })
    else:
        return pd.Series({
            'last_name': last_name,
            'title': None,
            'first_names': None,
            'nickname': None,
            'alternate_name': None
        })
