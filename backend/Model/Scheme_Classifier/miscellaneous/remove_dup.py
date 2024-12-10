import pandas as pd

# Load the CSV file
input_file = "extracted_urls.csv"  # Replace with your file name
output_file = "Cleaned_urls.csv"  # File to save the results

# Read the CSV file
df = pd.read_csv(input_file)

# Drop the first column if it's an unnamed index or not needed
if "Page Number" in df.columns:  # Check if an unintended index column exists
    df = df.drop(columns=["Page Number"])  # Drop the first column

# Remove duplicates based on a specific column
column_name = "URL"  # Replace with the column name you want to check
df = df.drop_duplicates(subset=[column_name])

# Add a new serial number column
df.reset_index(drop=True, inplace=True)  # Reset index to re-index rows
df.insert(0, "S.No", df.index + 1)  # Add a new column for serial numbers starting from 1

# Save the cleaned CSV
df.to_csv(output_file, index=False)

print(f"Duplicates based on '{column_name}' removed, first column dropped, and S.No added. Cleaned data saved to {output_file}.")
