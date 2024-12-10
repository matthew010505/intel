import csv
import json
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

driver = webdriver.Chrome()  # Ensure chromedriver is in PATH
wait = WebDriverWait(driver, 10)

data = []

# Load JSON data from file
try:
    with open('scheme_data.json', 'r', encoding='utf-8') as file:
        data = json.load(file)
except json.JSONDecodeError as e:
    print(f"Error decoding JSON: {e}")
except FileNotFoundError as e:
    print(f"File not found: {e}")
except Exception as e:
    print(f"An unexpected error occurred: {e}")

# Convert the data into a dictionary for faster lookup
scheme_dict = {scheme["scheme_name"]: scheme for scheme in data}

# Open CSV file and process URLs
with open('cleaned_urls.csv', mode='r', encoding='utf-8') as file:
    reader = csv.DictReader(file)

    for sno, row in enumerate(reader, start=1):
        scheme_url = row["URL"]
        print(f"{sno}. Processing URL: {scheme_url}")

        try:
            # Navigate to the URL
            driver.get(scheme_url)

            # Extract scheme title with error handling
            try:
                scheme_title = wait.until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "h1.font-bold.text-xl"))
                ).text
            except:
                scheme_title = "N/A"

            # If title is found, try to match it with the JSON data
            if scheme_title != "N/A":
                # Check if the scheme title exists in the dictionary
                if scheme_title in scheme_dict:
                    scheme_dict[scheme_title]["url"] = scheme_url
                    print(f"URL updated for scheme: {scheme_title}")
                else:
                    print(f"Scheme not found in data: {scheme_title}")
            else:
                print(f"Failed to extract title for URL: {scheme_url}")

        except Exception as e:
            print(f"Error processing {scheme_url}: {e}")
            driver.save_screenshot(f"error_{sno}.png")  # Save screenshot for debugging
            continue

# Write the updated data back to the JSON file
try:
    with open('scheme_data.json', 'w', encoding='utf-8') as file:
        json.dump(data, file, ensure_ascii=False, indent=4)
    print("Updated JSON data saved successfully.")
except Exception as e:
    print(f"Error saving updated JSON data: {e}")

# Close the browser
driver.quit()
