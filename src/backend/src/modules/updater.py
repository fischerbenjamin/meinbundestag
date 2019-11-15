"""
@author: Benjamin Fischer
"""


# Local imports
import src.modules.parsing as parsing
import src.modules.database as database
import src.modules.processing as processing


# Global imports
import os
import wget
import threading


class Updater(threading.Thread):

    def __init__(self, semaphore: threading.Semaphore):
        self.semaphore = semaphore

    def run(self):
        while True:
            self.semaphore.acquire()
            protocol = database.get_protocol_to_process()
            fpath = os.path.join("/protocols", protocol.fname)
            wget.download(protocol.url, fpath)
            speeches = parsing.get_speeches(fpath)
            for speech in speeches:
                processing.analyze(speech)
            database.protocol_is_done(protocol)
            database.insert_speeches(speeches)
