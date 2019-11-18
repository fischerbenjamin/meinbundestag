"""
@author: Benjamin Fischer
"""


# Local imports
import src.modules.parsing as parsing
import src.modules.database as database
import src.modules.processing as processing
import src.modules.myexceptions as myexceptions


# Global imports
import os
import wget
import logging
import threading


class Updater(threading.Thread):

    def __init__(self, sem: threading.Semaphore):
        self.sem = sem

    def run(self):
        while True:
            logging.info("Updater requests semaphore.")
            self.sem.acquire()
            logging.info("Updater obtained semaphore.")
            protocol = database.get_protocol_to_process()
            fpath = os.path.join("/protocols", protocol.fname)
            wget.download(protocol.url, fpath)
            speeches = parsing.get_speeches(fpath)
            try:
                processing.analyze_speeches(speeches)
            except myexceptions.SpeechAnalysisException:
                logging.error(
                    "Failed analyzing speech in protocol '{}'".format(
                        protocol.url
                    )
                )
            database.protocol_is_done(protocol)
            database.insert_speeches(speeches)
