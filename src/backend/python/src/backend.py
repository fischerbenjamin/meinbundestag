"""Running the backend.

This module starts the backend. Therefore, it releases the required threads
with the given environment variables as configuration.
"""


# Global imports
import os
import sys
import logging
import threading
from typing import List


# Local imports
import src.modules.api as api
import src.modules.schema as schema
import src.modules.updating as updating
import src.modules.database as database
import src.modules.scraping as scraping
import src.modules.myexceptions as myexceptions


def __init_logging(logging_level: str) -> None:
    """Configure the logging facility.

    Args:
        logging_level (str): logging level of the logging facility

    """
    log = logging.getLogger("werkzeug")
    log.setLevel(logging.ERROR)
    logging.basicConfig(
        format="%(asctime)s %(levelname)s %(message)s",
        datefmt="%H:%M:%S %d.%m.%y",
        level=logging_level
    )


def __parse_env_variables() -> schema.EnvVars:
    """Parse the environment variables and return them as typedef object.

    Returns:
        schema.EnvVars: object containing all required env variables

    """
    try:
        logging_config = os.environ["LOGLEVEL"].upper()
        database_config = (
            os.environ["DB_HOST"], int(os.environ["DB_PORT"]),
            os.environ["CLEAR_DB"].lower() == "yes",
            os.environ["DB_USER"], os.environ["DB_PASSWORD"]
        )
        api_config = (
            os.environ["API_HOST"], int(os.environ["API_PORT"]),
            os.environ["API_AUTHOR"], os.environ["API_VERSION"],
            os.environ["API_CONTACT"]
        )
        scraper_config = (
            int(os.environ["SCRAPER_TIMEOUT"]),
            int(os.environ["SCRAPER_INTERVAL"])
        )
        protocol_config = (
            os.environ["PROTOCOL_DTD_FILE"], os.environ["PROTOCOL_DIRECTORY"]
        )
        ods_config = (
            os.environ["ODS_HOST"], os.environ["ODS_PIPELINE_DEPUTIES"],
            os.environ["ODS_FALLBACK_DEPUTIES"], os.environ["ODS_PROFILE_URL"]
        )
    except KeyError as key_error:
        print("Missing required environment variable: %s", str(key_error))
        sys.exit(1)
    except ValueError as value_error:
        print("Unable to convert port: %s", str(value_error))
        sys.exit(1)
    return schema.EnvVars(
        database_config=database_config, api_config=api_config,
        scraper_config=scraper_config, protocol_config=protocol_config,
        ods_config=ods_config, logging_config=logging_config
    )


def __create_threads(
        env_vars: schema.EnvVars, sem_scraper: threading.Semaphore,
        sem_updater: threading.Semaphore, db_client: database.Database
) -> List[threading.Thread]:
    """Create all threads that run in the backend.

    Returns the thread objects so they can all get started 'simultaneously'.

    Args:
        env_vars (schema.EnvVars): environment variables
        sem_scraper (threading.Semaphore): semaphore of scraper
        sem_updater (threading.Semaphore): semaphore of updater

    Returns:
        List[threading.Thread]: list containig all four threads

    """
    t_scraper = scraping.Scraper(
        sem=sem_scraper,
        database_client=db_client,
        scraper_config=env_vars.scraper_config
    )
    t_updater = updating.Updater(
        sem=sem_updater,
        database_client=db_client,
        protocol_config=env_vars.protocol_config
    )
    t_scraper_timer = scraping.ScraperTimer(
        sem=sem_scraper,
        scraper_config=env_vars.scraper_config
    )
    t_api = threading.Thread(target=api.start, args=(
        env_vars.api_config, env_vars.ods_config, db_client
    ))
    return [t_api, t_scraper_timer, t_scraper, t_updater]


def run() -> None:
    """Run the backend."""
    env_vars = __parse_env_variables()
    __init_logging(env_vars.logging_config)
    sem_scraper = threading.Semaphore(1)
    sem_updater = threading.Semaphore(0)
    try:
        db_client = database.Database(
            env_vars.database_config, sem_updater, sem_scraper
        )
        logging.info("Successfully connected to the database.")
    except myexceptions.DatabaseInitException:
        logging.error("Could not connect to the database.")
        sys.exit(1)
    done_protocols = len(db_client.protocol_get_all(query={"done": False}))
    for _ in range(done_protocols):
        sem_updater.release()
    threads = __create_threads(env_vars, sem_scraper, sem_updater, db_client)
    for thread in threads:
        thread.start()
    logging.info("Started all threads successfully.")
