import pandas as pd

df = pd.read_json("scheme_data.json")

df.to_excel("scheme_data.xlsx", index=False)