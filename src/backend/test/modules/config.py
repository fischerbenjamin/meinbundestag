"""
@author: Benjamin Fischer

Unit tests for configuration variables.
"""


import os
import unittest


import src.modules.config as config_src


class TestClass(unittest.TestCase):

    def test_dtd_file(self):
        self.assertTrue(os.path.exists(config_src.DTD_FILE))

    def test_scraper_default_timeout(self):
        self.assertIsInstance(config_src.SCRAPER_DEFAULT_TIMEOUT, int)
        self.assertGreater(config_src.SCRAPER_DEFAULT_TIMEOUT, 0)

    def test_update_interval(self):
        self.assertIsInstance(config_src.UPDATE_INTERVAL, int)
        self.assertGreater(config_src.UPDATE_INTERVAL, 0)

    def test_tmp_file(self):
        self.assertTrue(os.path.exists(os.path.dirname(config_src.TMP_FILE)))