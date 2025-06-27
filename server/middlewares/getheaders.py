import pandas as pd
import sys
import json
import os

excel_file = sys.argv[1]

try:
    _, ext = os.path.splitext(excel_file)
    ext = ext.lower()
    if ext == '.csv':
        df = pd.read_csv(excel_file)
    elif ext in ['.xls', '.xlsx']:
        df = pd.read_excel(excel_file)
    else:
        print(f"Unsupported file type: {ext}", file=sys.stderr)
        sys.exit(1)
    headers = list(df.columns)
    new_headers =[]
    for header in headers:
        if df[header].dtype == "object":
            new_headers.append( f"{header} categorical")
        else: new_headers.append( f"{header} numerical")
    print(json.dumps(new_headers))  # Output headers as JSON
except Exception as e:
    print(json.dumps({"error": str(e)}))