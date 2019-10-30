"""
@author: Benjamin Fischer
"""


import time
from selenium import webdriver


class Scraper:

    """
    This class is used to scrape the url @url_bundestag_opendata for
    new protocol files.
    """

    url_bundestag_opendata = "https://www.bundestag.de/services/opendata"

    def __init__(self, timeout: int):
        self.links = []
        self.timeout = timeout
        self.driver = webdriver.Chrome(options=self.__get_driver_options())
        self.driver.fullscreen_window()

    def __get_driver_options(self) -> webdriver.ChromeOptions:
        """Configuration method for driver options.

        Returns:
            webdriver.ChromeOptions: options that are used for chromedriver
        """
        chrome_options = webdriver.ChromeOptions()
        chrome_options.add_argument('--no-sandbox')
        chrome_options.add_argument('--window-size=1920,1200')
        chrome_options.add_argument('--headless')
        chrome_options.add_argument('--disable-gpu')
        return chrome_options

    def update_links(self) -> int:
        """Updates the url links to the .xml files.

        Returns:
            int: number of links of previous call
        """
        reference = len(self.links)
        document_links = self.driver.find_elements_by_class_name(
            "bt-link-dokument"
        )
        for link in document_links:
            href = link.get_attribute("href")
            if ".xml" in href and href not in self.links:
                self.links.append(href)
        return reference

    def next_page(self, first: bool = False) -> int:
        """Emulate the button click for the next protocols.

        Args:
            first (bool, optional): Flag that indicates the first call.
                                    Defaults to False.

        Returns:
            int: number of links of previous call
        """
        if not first:
            next_button = self.driver.find_element_by_css_selector(
                ".slick-next"
            )
            webdriver.ActionChains(self.driver).move_to_element(
                next_button).perform()
            next_button.click()
            time.sleep(self.timeout)
        return self.update_links()

    def run(self, debug=False) -> list:
        """Cycles through the table with the protocols and extracts the
        links to the .xml files. Stops when no new links were found.

        Args:
            debug (bool, optional): Print debug information. Defaults to False.

        Returns:
            list: list containing all found .xml files (urls)
        """
        self.driver.get(Scraper.url_bundestag_opendata)
        time.sleep(self.timeout)
        first = True
        while True:
            if debug:
                print("Next Iteration:")
            if self.next_page(first) == len(self.links):
                break
            time.sleep(self.timeout)
            first = False
            if debug:
                for link in self.links:
                    print(link)
        return self.links
