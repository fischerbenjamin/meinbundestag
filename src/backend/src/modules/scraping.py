"""Scraping module for protocol links of the homepage of the Bundestag.

Retrieving the urls of the protocols of the Bundestag.
"""


# Global imports
import os
import re
import time
import logging
import threading
from typing import Tuple


# 3rd party modules
import selenium.webdriver as webdriver


# Local imports
import src.modules.schema as schema
import src.modules.database as database


class Scraper(threading.Thread):
    """Scraper that searches for xml files (protocols) of the Bundestag."""

    # URL of the homepage of the German Bundestag
    URL_BUNDESTAG_OPENDATA = "https://www.bundestag.de/services/opendata"
    # The class every link to a protocol file is assigned to
    CLASS_OF_DOCUMENT_LINKS = "bt-link-dokument"
    # The regular expression a link to a protocol file has to match
    LINK_RGX = r"(.)*\.xml$"
    # Mapping to check if a button is clickable (see BTN_DISABLED_ATTR)
    # (Python will cast any non-empty string to True)
    CLICKABLE = {
        "false": True,
        "true": False
    }
    # Attribute that stores the link
    LINK_ATTRIBUTE = "href"
    # Class of the button that loads the next page of protocols
    BTN_NEXT_CSS = ".slick-next"
    # Class of the button that loads the previous page of protocols
    BTN_PREV_CSS = ".slick-prev"
    # Indicates if a button is disabled or enaled (notice the negation)
    BTN_DISABLED_ATTR = "aria-disabled"
    # Options for the selenium web driver
    WEBDRIVER_OPTIONS = [
        "--no-sandbox",
        "--window-size=1920,1200",
        "--headless",
        "--disable-gpu"
    ]

    def __init__(
            self, scraper_config: Tuple[int, int], sem: threading.Semaphore,
            database_client: database.Database
    ):
        """Init object.

        Args:
            scraper_config (Tuple[int, int]): (timeout, interval)
            sem (threading.Semaphore): communication with database
            database (database.Database): database

        """
        threading.Thread.__init__(self)
        self.sem = sem
        self.db_client = database_client
        self.timeout, _ = scraper_config
        self.__init_done_links_from_database()
        self.__init_webdriver()

    def __del__(self):
        """Close driver on deletion."""
        self.driver.close()

    def __init_done_links_from_database(self) -> None:
        """Load already processed protocol links from the database on startup.

        These links are not required to be collected again.
        """
        processed_links = [
            prot.url
            for prot in self.db_client.protocol_get_all(query={"done": True})
        ]
        logging.info(
            "Initialized with %d done links from DB", len(processed_links)
        )
        self.links = processed_links

    def __init_webdriver(self) -> None:
        """Initialize the selenium chrome webdriver with predefined options."""
        chrome_options = webdriver.ChromeOptions()
        for opt in Scraper.WEBDRIVER_OPTIONS:
            chrome_options.add_argument(opt)
        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.fullscreen_window()

    def __update_links(self) -> None:
        """Collect the links of the current table page.

        Insert the collected links into the own list and the database if they
        have not been collected yet.
        """
        document_links = self.driver.find_elements_by_class_name(
            Scraper.CLASS_OF_DOCUMENT_LINKS
        )
        for entry in document_links:
            link = entry.get_attribute(Scraper.LINK_ATTRIBUTE)
            if re.match(Scraper.LINK_RGX, link):
                if link not in self.links:
                    name = os.path.basename(link)
                    protocol = schema.Protocol(url=link, fname=name)
                    self.db_client.protocol_insert(protocol)
                    self.links.append(link)

    @staticmethod
    def __button_is_clickable(
            button: webdriver.remote.webelement.WebElement
    ) -> bool:
        """Check if the given button is clickable.

        Args:
            button (webdriver.remote.webelement.WebElement): next/prev button

        Returns:
            bool: True if clickable, False otherwise

        """
        is_disabled = button.get_attribute(Scraper.BTN_DISABLED_ATTR)
        return Scraper.CLICKABLE[is_disabled]

    def __move(self, forwards: bool) -> None:
        """Cycle through the table in the given direction.

        Stop when the button of the given direction is not clickable anymore.

        Args:
            forwards (bool): forwards/backwards (using next/prev)

        """
        is_clickable = True
        if forwards:
            logging.info("Scraper is now moving forwards.")
            btn_css_sel = Scraper.BTN_NEXT_CSS
        else:
            logging.info("Scraper is now moving backwards.")
            btn_css_sel = Scraper.BTN_PREV_CSS
        while is_clickable:
            self.__update_links()
            button = self.driver.find_element_by_css_selector(btn_css_sel)
            act = webdriver.ActionChains(self.driver).move_to_element(button)
            act.perform()
            is_clickable = Scraper.__button_is_clickable(button)
            if is_clickable:
                button.click()
                time.sleep(self.timeout)

    def run(self) -> None:
        """Infinetly cycles through the table and collects protocol links.

        Either the SraperTimer or the Updater restart this procedure.
        """
        self.driver.get(Scraper.URL_BUNDESTAG_OPENDATA)
        while True:
            logging.info("Scraper requests semaphore.")
            self.sem.acquire()
            logging.info("Scraper obtained semaphore.")
            self.__move(forwards=True)
            self.__move(forwards=False)


class ScraperTimer(threading.Thread):
    """Simple wakeup thread for the Scraper class.

    It releases the scraper's semaphore in a pre-defined interval.
    """

    def __init__(
            self, scraper_config: Tuple[int, int], sem: threading.Semaphore
    ):
        """Init object.

        Args:
            scraper_config (Tuple[int, int]): (timeout, interval)
            sem (threading.Semaphore): semaphore to release

        """
        threading.Thread.__init__(self)
        _, self.interval = scraper_config
        self.sem = sem

    def run(self):
        """Release the semaphore of the scraper object endlessly."""
        while True:
            time.sleep(self.interval)
            self.sem.release()
            logging.info("ScraperTimer released the scraper's semaphore.")
