"""
@author: Benjamin Fischer
"""

# Local imports
import src.modules.api as api
import src.modules.updater as updater
import src.modules.database as database


# Global imports
import os
import logging
import threading


def __init_logging(log_lvl: str):
    """
    Configures the logging facility.

    Args:
        log_lvl (str): logging level
    """
    log = logging.getLogger('werkzeug')
    log.setLevel(logging.ERROR)
    logging.basicConfig(
        format='%(levelname)s %(module)s@%(funcName)s %(asctime)s %(message)s',
        datefmt='%d.%m.%y-%H:%M:%S',
        level=log_lvl
    )


def run() -> None:
    """
    Runs the application after initializing the logging facility.
    """
    __init_logging(os.environ["LOGLEVEL"].upper())
    if database.init(os.environ["DB_HOST"], int(os.environ["DB_PORT"])):
        logging.info("Successfully connected to the database.")
    thread_updater = threading.Thread(target=updater.start)
    thread_api = threading.Thread(target=api.start, args=(
        os.environ["API_HOST"], os.environ["API_PORT"]
    ))
    thread_updater.start()
    thread_api.start()
    logging.info("Started updater and api thread.")
