"""
@author: Benjamin Fischer
"""

# Local imports
import src.modules.api as api
import src.modules.updater as updater
import src.modules.database as database
import src.modules.scraper as scraper
import src.modules.myexceptions as myexceptions


# Global imports
import os
import sys
import logging
import threading


def __init_logging(log_lvl: str):
    """
    Configures the logging facility.

    Args:
        log_lvl (str): logging level
    """
    log = logging.getLogger("werkzeug")
    log.setLevel(logging.ERROR)
    logging.basicConfig(
        format="%(asctime)s %(levelname)s %(module)s@%(funcName)s %(message)s",
        datefmt="%H:%M:%S %d.%m.%y",
        level=log_lvl
    )


def run() -> None:
    """
    Runs the application after initializing the logging facility.
    """
    __init_logging(os.environ["LOGLEVEL"].upper())
    scraper_sem = threading.Semaphore(1)
    updater_sem = threading.Semaphore(0)
    try:
        db = database.Database(
            os.environ["DB_HOST"], int(os.environ["DB_PORT"]),
            updater_sem, scraper_sem
        )
        logging.info("Successfully connected to the database.")
    except myexceptions.DatabaseInitException:
        logging.error("Could not connect to the database.")
        sys.exit(1)
    if os.environ["CLEAR_DB"].lower() == "true":
        logging.info("Clearing database before startup.")
        db.clear()
    for i in range(len(db.get_all_protocols(query={"done": False}))):
        updater_sem.release()
    scraper_obj = scraper.Scraper(2, scraper_sem, db)
    updater_obj = updater.Updater(updater_sem, db)
    thread_scraper = threading.Thread(target=scraper_obj.run)
    thread_updater = threading.Thread(target=updater_obj.run)
    thread_api = threading.Thread(target=api.start, args=(
        os.environ["API_HOST"], os.environ["API_PORT"], db
    ))
    thread_api.start()
    thread_scraper.start()
    thread_updater.start()
    logging.info("Started api-, scraper- and updater-thread.")
