"""
@author: Benjamin Fischer

This module stores default variables for an easier use in other modules.
"""


# Global imports
import os


DTD_FILE = os.path.abspath("data/dbtplenarprotokoll-data.dtd")
SAMPLE_PROTOCOL = os.path.abspath("data/sample_protocol.xml")
SCRAPER_DEFAULT_TIMEOUT = 10
TMP_FILE = "/tmp/protocol.xml"
UPDATE_INTERVAL = 60*60*24
