import json
import pickle
from json.decoder import JSONDecodeError

data = []

# Load JSON data from file
try:
    with open('scheme_data.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
except JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
except FileNotFoundError as e:
    print(f"File not found: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")

# Ensure `data` is not empty before proceeding
if not data:
    print("No data loaded. Exiting the script.")
    exit()

# Function to process a single dictionary
schemes=[d["scheme_name"] for d in data]
def process_entry(entry):
    combined = []
    for key, value in entry.items():

        if isinstance(value, list):
            # Concatenate list elements into a single string
            value = " ".join(value)
        combined.append(f"{key}: {value}")
    return " ".join(combined)

# Process the JSON data
processed_entries = [process_entry(item) for item in data]

# Save processed entries to a pickle file
with open("processed_entries.pkl", "wb") as pkl_file:
    pickle.dump(processed_entries, pkl_file)

# Save the original data (schemes array) to another pickle file
with open("schemes.pkl", "wb") as pkl_file:
    pickle.dump(schemes, pkl_file)

print("Processed entries and schemes array have been saved as pickle files.")
