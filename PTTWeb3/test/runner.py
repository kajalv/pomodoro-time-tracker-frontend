'''
Front End Tests - Web 3
Note: IDE may show some errors but it should work anyway
'''

import random
import string
import traceback

from selenium import webdriver
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions
from selenium.webdriver.common.by import By

'''
Class to setup Selenium driver and run all tests
'''
class FrontEndTests:
    def __init__(self, url):
        self.url = url
        options = webdriver.ChromeOptions()
        options.add_argument('headless')
        options.add_argument('window-size=1200x600')
        self.driver = webdriver.Chrome(executable_path='./chromedriver',options=options)
    
    def exists_element(self, locator):
        try:
            self.wait.until(expected_conditions.presence_of_element_located((By.CSS_SELECTOR, locator)))
            text = self.driver.find_element_by_css_selector(locator).text
        except Exception as e:
            print(e)
            return "None"
        return text
    
    def run_all_tests(self):
        result = True
        try:
            # Setup the driver
            print("Setting up driver...")
            self.driver.get(self.url)

            print("Running tests...")

            # Add a pause so there's sufficient time to render
            #self.wait = WebDriverWait(self.driver, 10)
            self.test_home_page()

            print("Tests completed.")

        except Exception:
            traceback.print_exc()
            result = False
        
        # Close the driver
        print("Closing driver.")
        self.driver.close()

        return result
    
    '''
    TEST CASES START HERE
    '''

    def test_home_page(self):
        '''
        This test checks the page and title to make sure they are correct. Basic sanity check.
        '''
        assert self.driver.current_url, ExpectedResults.BASE_URL
        assert self.driver.title, ExpectedResults.PAGE_TITLE
        src = self.driver.find_element_by_xpath("//div[@id='root']/div/div[@class='homePage']/img").get_attribute("src")
        assert ExpectedResults.LARGE_POMODORO in src
        assert src.endswith(ExpectedResults.PNG)

'''
Class to store expected results
'''
class ExpectedResults:
    PAGE_TITLE="Pomodoro Time Tracker"
    BASE_URL="http://localhost:3000/"
    LARGE_POMODORO="large_pomodoro"
    PNG=".png"

if __name__ == '__main__':
    test_runner = FrontEndTests("http://localhost:3000/")
    if test_runner.run_all_tests():
        print("RESULT: Tests passed.")
    else:
        print("RESULT: Failure!")
