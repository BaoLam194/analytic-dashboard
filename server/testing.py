import pandas as pd

excel_file = './Timothy_TD19_ICQ2.csv'
movies = pd.read_csv(excel_file)
movies.head()
print(movies.head())
print("Header columns:")
print(movies.columns)

print(type(movies.columns))
