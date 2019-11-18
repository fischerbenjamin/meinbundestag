"""
@author: Benjamin Fischer
"""


# Local imports
import src.modules.database as database
import src.modules.schema as schema


# Global imports
import os
import re
import time
import logging
import threading
import selenium.webdriver as webdriver


class Scraper:

    """
    This class is used to scrape the url @url_bundestag_opendata for
    new protocol files.
    """

    URL_BUNDESTAG_OPENDATA = "https://www.bundestag.de/services/opendata"
    CLASS_OF_DOCUMENT_LINKS = "bt-link-dokument"
    LINK_RGX = r"(.)*\.xml$"
    CLICKABLE = {
        "false": True,
        "true": False
    }
    LINK_ATTRIBUTE = "href"
    BTN_NEXT_CSS = ".slick-next"
    BTN_PREV_CSS = ".slick-prev"
    BTN_DISABLED_ATTR = "aria-disabled"

    def __init__(
        self, timeout: int, sem: threading.Semaphore,
        database: database.Database
    ):
        self.sem = sem
        self.db = database
        self.timeout = timeout
        self.driver = webdriver.Chrome(options=self.__get_driver_options())
        self.driver.fullscreen_window()
        self.links = self.__get_done_links_from_database()

    def __del__(self):
        self.driver.close()

    def __get_done_links_from_database(self) -> list:
        processed_links = [
            protocol.url
            for protocol in self.db.get_all_protocols(query={"done": True})
        ]
        logging.info("Initialized with {} from database".format(
            len(processed_links)
        ))
        return processed_links

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

    def __update_links(self) -> None:
        document_links = self.driver.find_elements_by_class_name(
            Scraper.CLASS_OF_DOCUMENT_LINKS
        )
        for entry in document_links:
            link = entry.get_attribute(Scraper.LINK_ATTRIBUTE)
            if re.match(Scraper.LINK_RGX, link):
                if link not in self.links:
                    name = os.path.basename(link)
                    protocol = schema.Protocol(url=link, fname=name)
                    self.db.insert_protocol(protocol)
                    self.links.append(link)

    def __move(self, forwards: bool = True) -> None:
        is_clickable = True
        if forwards:
            logging.info("Scraper moving forwards.")
            btn_css_sel = Scraper.BTN_NEXT_CSS
        else:
            logging.info("Scraper moving backwards.")
            btn_css_sel = Scraper.BTN_PREV_CSS
        while is_clickable:
            self.__update_links()
            button = self.driver.find_element_by_css_selector(btn_css_sel)
            act = webdriver.ActionChains(self.driver).move_to_element(button)
            act.perform()
            is_clickable = Scraper.CLICKABLE[
                button.get_attribute(Scraper.BTN_DISABLED_ATTR)
            ]
            if is_clickable:
                button.click()
                time.sleep(self.timeout)

    def run(self) -> None:
        self.driver.get(Scraper.URL_BUNDESTAG_OPENDATA)
        while True:
            logging.info("Scraper requests semaphore.")
            self.sem.acquire()
            logging.info("Scraper obtained semaphore.")
            self.__move(forwards=True)
            self.__move(forwards=False)
