import pandas as pd
import sys
import json

excel_file = sys.argv[1]

try:
    df = pd.read_csv(excel_file)
    headers = list(df.columns)
    print(json.dumps(headers))  # Output headers as JSON
except Exception as e:
    print(json.dumps({"error": str(e)}))