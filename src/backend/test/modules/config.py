"""
@author: Benjamin Fischer

Unit tests for configuration variables.
"""


import os
import unittest


import src.modules.config as config


class TestClass(unittest.TestCase):

    def test_dtd_file(self):
        self.assertTrue(os.path.exists(config.DTD_FILE))

    def test_tmp_file(self):
        self.assertTrue(os.path.exists(config.SAMPLE_PROTOCOL))

    def test_template_file(self):
        self.assertTrue(os.path.exists(config.TEMPLATE_HTML))
