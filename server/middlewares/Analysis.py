import sys
import json
import pandas as pd
import os

def main():
    if len(sys.argv) < 2:
        print("No data received", file=sys.stderr)
        sys.exit(1)

    try:
        # Get JSON string from argument
        data_json = sys.argv[1]
        data = json.loads(data_json)
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}", file=sys.stderr)
        sys.exit(1)

    # Extract file path
    file_path = data.get("filePath")
    if not file_path:
        print("Missing 'filePath' in data", file=sys.stderr)
        sys.exit(1)

    try:

         _, ext = os.path.splitext(file_path)
        ext = ext.lower()
        # Load CSV file
        df = pd.read_csv(file_path)

        # Depending on the analysis mode and options, process accordingly
        mode = data.get("mode")
        varone = data.get("varone")
        vartwo =""
        if(mode =="bivariate"):
            vartwo = data.get("vartwo")
        ana_option = data.get("ana_option", [])
        visual = data.get("visualization")

        result = ""
        result += str(type(mode)) + str(type(varone))+ str(type(vartwo))+str(type(ana_option))+str(type(file_path))

        # You can add other options (like 'visualization') here

        # Output result to stdout
        print(json.dumps(result))

    except Exception as e:
        print(f"Error processing file: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()