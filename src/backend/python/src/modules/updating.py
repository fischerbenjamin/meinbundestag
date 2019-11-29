"""Updater module for downloading and processing protocols.

This module is used to process collected protocol links and store the parsed
and processed speeches into the database.
"""


# Global imports
import os
import logging
import threading
from typing import Tuple


# 3rd party modules
import wget


# Local imports
import src.modules.parsing as parsing
import src.modules.database as database
import src.modules.processing as processing
import src.modules.myexceptions as myexceptions


class Updater(threading.Thread):
    """Implementation of the updater thread.

    The updater request for unprocessed protocols, downloads and parses them
    and stores the processed speeches into the database.
    """

    def __init__(
            self, sem: threading.Semaphore, database_client: database.Database,
            protocol_config: Tuple[str, str]
    ):
        """Init object.

        Args:
            sem (threading.Semaphore): semaphore for comm. with database
            database (database.Database): database
            protocol_config (Tuple[str, str]): (dtd file, destination)

        """
        threading.Thread.__init__(self)
        self.sem = sem
        self.db_client = database_client
        self.dtd_file, self.protocols_directory = protocol_config

    def run(self):
        """Infinetly process protocols which have not been processed yet."""
        while True:
            logging.info("Updater requests semaphore.")
            self.sem.acquire()
            logging.info("Updater obtained semaphore.")
            protocol = self.db_client.protocol_get_next()
            if protocol is None:
                continue
            try:
                fpath = os.path.join(self.protocols_directory, protocol.fname)
                wget.download(protocol.url, fpath)
                speeches = parsing.get_speeches(fpath, self.dtd_file)
                processing.analyze_speeches(speeches)
                self.db_client.speech_insert_collection(speeches)
            except myexceptions.SpeechParsingException as parse_exception:
                logging.error(
                    "Failed parsing speeches in protocol %s", protocol.url
                )
                print(str(parse_exception))
            except myexceptions.SpeechAnalysisException:
                logging.error(
                    "Failed analyzing speech in protocol %s", protocol.url
                )
            finally:
                # Execute this even if a failure occured to pretend that the
                # broken protocol is updated multiple times
                self.db_client.protocol_is_done(protocol)
