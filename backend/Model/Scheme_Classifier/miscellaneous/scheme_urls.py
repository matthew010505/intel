import csv
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Set up Selenium WebDriver
driver = webdriver.Chrome()  # Replace with your WebDriver setup
driver.get("https://www.myscheme.gov.in/search")  # Replace with your webpage URL

try:
    wait = WebDriverWait(driver, 10)

    # Initialize variables
    current_page = 1
    last_page = 282  # Update as per your requirement
    csv_filename = "extracted_urls.csv"

    # Open the CSV file in write mode and add headers
    with open(csv_filename, mode="w", newline="", encoding="utf-8") as file:
        writer = csv.writer(file)
        writer.writerow(["Page Number", "URL"])  # Adding headers

        while current_page <= last_page:
            # Re-locate the pagination list dynamically
            pagination = wait.until(EC.presence_of_all_elements_located((By.CSS_SELECTOR, "ul.list-none li")))

            # Find the current page element
            for li in pagination:
                if li.text.strip() == str(current_page):
                    try:
                         # Scroll the element into view using JavaScript
                        driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", li)

                        # Wait for the element to be clickable
                        wait.until(EC.element_to_be_clickable((By.XPATH, f"//li[text()='{current_page}']")))

                        # Attempt to click the element using JavaScript
                        driver.execute_script("arguments[0].click();", li)

                        # Allow the page content to load
                        time.sleep(2)  # Use a dynamic wait if possible
                                        
                        # Wait for the page content to load
                        time.sleep(2)  # Adjust if necessary, or use WebDriverWait for specific content

                        # Extract URLs from the page
                        links = driver.find_elements(By.TAG_NAME, "a")  # Adjust the selector if necessary
                        page_urls = {link.get_attribute("href") for link in links if link.get_attribute("href")}

                        # Write URLs to the CSV file
                        for url in page_urls:
                            writer.writerow([current_page, url])

                        print(f"Page {current_page}: Found {len(page_urls)} URLs and wrote to CSV.")

                        # Increment the page counter
                        current_page += 1
                        break
                    except Exception as e:
                        print(f"Error processing page {current_page}: {e}")
                        driver.quit()
                        exit()

finally:
    # Close the browser
    driver.quit()
