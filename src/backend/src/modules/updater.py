"""
@author: Benjamin Fischer
"""


# Local imports
import src.modules.parsing as parsing
import src.modules.processing as processing
import src.modules.database as database
import src.modules.config as config
import src.modules.scraper as scraper


# Global imports
import wget
import time


def start(
    timeout: int = config.SCRAPER_DEFAULT_TIMEOUT,
    interval: int = config.UPDATE_INTERVAL
):
    my_scraper = scraper.Scraper(timeout)
    old_links, new_links = ([], [])
    while True:
        new_links = my_scraper.run()
        work = [link for link in new_links if link not in old_links]
        for link in work:
            wget.download(link, config.TMP_FILE)
            speeches = parsing.get_speeches(config.TMP_FILE)
            for speech in speeches:
                processing.analyze(speech)
            database.insert_speeches(speeches)
        old_links = new_links.copy()
        time.sleep(interval)
