import sys
import json
import pandas as pd
import os
import scipy.stats as stats
import matplotlib.pyplot as plt
import base64
from io import BytesIO
import seaborn as sns

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
        #read the extension of the file
        _, ext = os.path.splitext(file_path)
        ext = ext.lower()

        # Read the file jhere
        if ext == '.csv':
            df = pd.read_csv(file_path)
        elif ext in ['.xls', '.xlsx']:
            df = pd.read_excel(file_path)
        else:
            print(f"Unsupported file type: {ext}", file=sys.stderr)
            sys.exit(1)

        # Depending on the analysis mode and options, process accordingly
        mode = data.get("mode")
        var_one = data.get("varone").split(" ")
        varone = var_one[0]
        typeone = var_one[1]
        vartwo =""
        typetwo =""
        if(mode =="bivariate"):
            var_two = data.get("vartwo").split(" ")
            vartwo = var_two[0]
            typetwo =var_two[1]
        ana_option = data.get("ana_option", [])
        visual = data.get("visualization")

        result = {}
        result["analysis"] = df[varone].describe().to_dict()

        if "variance" in ana_option and len(result["analysis"]) > 4:
            # ignore categorical as it only has 4 value in describe
            result["analysis"]["variance"] = df[varone].var()
        if "range" in ana_option and len(result["analysis"]) > 4:
            # ignore categorical as it only has 4 value in describe
            data = df[varone].dropna()  # remove NaNs
            mean = data.mean()
            sem = stats.sem(data)  # standard error of the mean
            # Calculate the 95% CI
            ci_low, ci_high = stats.t.interval(0.95, df=len(data)-1, loc=mean, scale=sem)
            result["analysis"]["ci95_lower"] = ci_low
            result["analysis"]["ci95_upper"] = ci_high
        if vartwo: result["summary_two"] = df[vartwo].describe().to_dict()
        # only varone and numerical
        if visual:
            if typeone =="numerical" and mode =="univariate":
                plt.figure(figsize=(20, 12))

                if visual =="hist": 
                    df[varone].plot(kind=visual, bins=30,edgecolor='black', color='steelblue')
                    plt.title(f'Histogram of {varone}')
                elif visual =="kde": 
                    df[varone].plot(kind=visual, color='steelblue')
                    plt.title(f'KDE graph of {varone}')
                elif visual =="histkde":
                    ax = df[varone].plot(kind="hist", bins=30,density=True,alpha=0.8,edgecolor='black', color='steelblue', label='Histogram')
                    df[varone].plot(kind="kde", ax =ax, color='darkorange',label='KDE')
                    plt.title(f'Histogram and KDE of {varone}')
                    plt.legend()
                elif visual =="boxplot": # boxplot
                    plt.boxplot(df[varone].dropna(), patch_artist=True,
                        boxprops=dict(facecolor='skyblue', color='black'),   # Fill color & border
                        medianprops=dict(color='red', linewidth=2),           # Median line
                        whiskerprops=dict(color='black'),
                        capprops=dict(color='black'),
                        flierprops=dict(marker='o', markerfacecolor='orange', markersize=6, linestyle='none')) # outlier
                    plt.title(f'Boxplot of {varone}')
                
                if visual !="boxplot": plt.xlabel(varone)
                plt.ylabel('Frequency')
                
                # Save plot to bytes buffer
                buf = BytesIO()
                plt.savefig(buf, format='png', bbox_inches='tight')
                plt.close()
                
                # Encode as base64
                buf.seek(0)
                result['visualization'] = base64.b64encode(buf.read()).decode('utf-8')
                result['visualization'] = f"data:image/png;base64,{result['visualization']}"
            
            if typeone =="categorical" and mode =="univariate" and (visual =="bar" or visual =="pie"):
                plt.figure(figsize=(20, 12))
                
                if visual =="bar": 
                    df[varone].value_counts().plot(kind=visual, edgecolor='black', color=['steelblue', 'pink',
                                                                                        'yellow', 'purple', 'orange'])
                    plt.title(f'Bar chart of {varone}')
                    plt.xlabel(varone)
                else: 
                    df[varone].value_counts().plot(kind=visual, color='steelblue')
                    plt.title(f'Pie chart of {varone}')



                # Save plot to bytes buffer
                buf = BytesIO()
                plt.savefig(buf, format='png', bbox_inches='tight')
                plt.close()
                
                # Encode as base64
                buf.seek(0)
                result['visualization'] = base64.b64encode(buf.read()).decode('utf-8')
                result['visualization'] = f"data:image/png;base64,{result['visualization']}"
            if mode =="bivariate" and typeone =="numerical" and typetwo =="numerical":
                plt.figure(figsize=(20, 12))
                if visual =="scatter": # scatter plot
                    df.plot.scatter(x=varone, y= vartwo)
                    plt.title(f'Scatter plot between {varone} and {vartwo}')
                elif visual =="hexbin": # hexbin plot
                    df.plot.hexbin(x=varone, y=vartwo, gridsize=25)
                    plt.title(f'Hexbin plot between {varone} and {vartwo}')

                # Save plot to bytes buffer
                buf = BytesIO()
                plt.savefig(buf, format='png', bbox_inches='tight')
                plt.close()
                
                # Encode as base64
                buf.seek(0)
                result['visualization'] = base64.b64encode(buf.read()).decode('utf-8')
                result['visualization'] = f"data:image/png;base64,{result['visualization']}"
            if mode =="bivariate" and typeone =="numerical" and typetwo =="categorical":

                plt.figure(figsize=(20, 12))
                if visual =="boxplot": # botplot based on different categories
                    sns.boxplot(x=varone, y=vartwo, data=df, orient='h')
                    plt.title(f'Box Plot of {varone} by {vartwo}')
                    

                # Save plot to bytes buffer
                buf = BytesIO()
                plt.savefig(buf, format='png', bbox_inches='tight')
                plt.close()
                
                # Encode as base64
                buf.seek(0)
                result['visualization'] = base64.b64encode(buf.read()).decode('utf-8')
                result['visualization'] = f"data:image/png;base64,{result['visualization']}"
            if mode =="bivariate" and typeone =="categorical" and typetwo =="numerical":
                plt.figure(figsize=(20, 12))
                if visual =="boxplot": # botplot based on different categories
                    sns.boxplot(x=varone, y=vartwo, data=df)
                    plt.title(f'Box Plot of {varone} by {vartwo}')
                elif visual =="violin": #violin plot based on cateogries
                    sns.violinplot(x=varone, y=vartwo, data=df)
                    plt.title(f"Violin Plot of {varone} vs {vartwo}")
                elif visual =="bar" : #barplot
                    sns.barplot(x=varone, y=vartwo, data=df)
                    plt.title(f"Bar Plot of {varone} vs {vartwo}")
                elif visual =="swarm" : #barplot
                    sns.swarmplot(x=varone, y=vartwo, data=df)
                    plt.title(f"Swarm Plot of {varone} vs {vartwo}")
                # Save plot to bytes buffer
                buf = BytesIO()
                plt.savefig(buf, format='png', bbox_inches='tight')
                plt.close()
                
                # Encode as base64
                buf.seek(0)
                result['visualization'] = base64.b64encode(buf.read()).decode('utf-8')
                result['visualization'] = f"data:image/png;base64,{result['visualization']}"
                    
            if mode =="bivariate" and typeone =="categorical" and typetwo =="categorical":
                plt.figure(figsize=(20, 12))
                if visual =="count" : #countplot
                    sns.countplot(x=varone, hue=vartwo, data=df)
                    plt.title(f"Count Plot of {varone} by {vartwo}")
                elif visual =="stack":
                    cross_tab = pd.crosstab(df[varone], df[vartwo], normalize='index')
                    cross_tab.plot(kind='bar', stacked=True)
                    plt.title(f"Stacked Bar Chart of {varone} and {vartwo}")
                    plt.ylabel("Proportion")
                # Save plot to bytes buffer
                buf = BytesIO()
                plt.savefig(buf, format='png', bbox_inches='tight')
                plt.close()
                
                # Encode as base64
                buf.seek(0)
                result['visualization'] = base64.b64encode(buf.read()).decode('utf-8')
                result['visualization'] = f"data:image/png;base64,{result['visualization']}"
        # Output result to stdout 
        print(json.dumps(result))

    except Exception as e:
        print(f"Error processing file: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    main()