"""
@author: Benjamin Fischer

Unit tests for scraper module.
"""


import unittest
import time
import multiprocessing


import src.modules.scraper as scraper_src
import src.modules.config as config_src


class TestClass(unittest.TestCase):

    def test_init(self):
        _ = scraper_src.Scraper(10)

    def test_update_links(self):
        links = scraper_src.Scraper(10).update_links()
        self.assertEqual(links, 0)

    def test_no_exception_after_one_run(self):
        scraper = scraper_src.Scraper(config_src.SCRAPER_DEFAULT_TIMEOUT)
        p = multiprocessing.Process(target=scraper.run, name="Scraper")
        p.start()
        time.sleep(config_src.SCRAPER_DEFAULT_TIMEOUT * 2)
        p.terminate()
        p.join()
