import csv
import json
import re
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Function to clean text
def clean_text(text):
    return re.sub(r"\s+", " ", text).strip()

# Set up Selenium WebDriver
driver = webdriver.Chrome()  # Ensure chromedriver is in PATH
wait = WebDriverWait(driver, 10)

# Read URLs from CSV
with open('cleaned_urls1.csv', mode='r', encoding='utf-8') as file:
    reader = csv.DictReader(file)

    for sno, row in enumerate(reader, start=1):
        scheme_url = row["URL"]
        print(f"{sno}. Processing URL: {scheme_url}")

        try:
            # Navigate to the URL
            driver.get(scheme_url)

            # Extract content with error handling
            try:
                scheme_title = wait.until(
                    EC.presence_of_element_located((By.CSS_SELECTOR, "h1.font-bold.text-xl"))
                ).text
            except:
                scheme_title = "N/A"

            try:
                location = driver.find_element(By.CSS_SELECTOR, "h3.text-raven").text
            except:
                location = "N/A"

            try:
                description = driver.find_element(
                    By.CSS_SELECTOR, "div.markdown-options span[data-slate-string='true']"
                ).text
            except:
                description = "N/A"

            benefits = [
                clean_text(span.text)
                for span in driver.find_elements(By.CSS_SELECTOR, "div#benefits .markdown-options span[data-slate-string='true']")
            ] or ["N/A"]

            eligibility = [
                clean_text(li.text)
                for li in driver.find_elements(By.CSS_SELECTOR, "div#eligibility ul li span[data-slate-string='true']")
            ] or ["N/A"]

            application_process = [
                clean_text(step.text)
                for step in driver.find_elements(By.CSS_SELECTOR, "#application-process div.markdown-options div.mb-2 span[data-slate-string='true']")
            ] or ["N/A"]

            documents_required = [
                clean_text(step.text)
                for step in driver.find_elements(By.CSS_SELECTOR, "#documents-required ol li span[data-slate-string='true']")
            ] or ["N/A"]

            additional_documents = [
                clean_text(step.text)
                for step in driver.find_elements(By.CSS_SELECTOR, "#documents-required div.mb-2 span[data-slate-string='true']")
            ] or ["N/A"]

            all_documents = documents_required + additional_documents

            # Combine data
            scheme_data = {
                "scheme_name": scheme_title,
                "location": location,
                "description": description,
                "eligibility": eligibility,
                "benefits": benefits,
                "application_process": application_process,
                "required_documents": all_documents,
            }

            # Print and save the extracted data
            print(json.dumps(scheme_data, indent=4, ensure_ascii=False))
            with open("scheme_data.json", "a", encoding="utf-8") as f:
                json.dump(scheme_data, f, indent=4, ensure_ascii=False)
                f.write("\n\n")

        except Exception as e:
            print(f"Error processing {scheme_url}: {e}")
            driver.save_screenshot(f"error_{sno}.png")  # Save screenshot for debugging
            continue

# Close the browser
driver.quit()
