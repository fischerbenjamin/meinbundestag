"""Running the backend.

This module starts the backend. Therefore, it releases the required threads
with the given environment variables as configuration.
"""


# Global imports
import os
import sys
import logging
import threading
from typing import List, Tuple, Any


# Local imports
import src.modules.api as api
import src.modules.schema as schema
import src.modules.updating as updating
import src.modules.database as database
import src.modules.scraping as scraping
import src.modules.myexceptions as myexceptions


def __init_logging(other_config: Tuple[Any, ...]) -> None:
    """Configure the logging facility.

    Args:
        logging_level (str): logging level of the logging facility

    """
    log = logging.getLogger("werkzeug")
    log.setLevel(logging.ERROR)
    logging.basicConfig(
        format="%(asctime)s %(levelname)s %(message)s",
        datefmt="%H:%M:%S %d.%m.%y",
        level=other_config
    )


def __parse_env_variables() -> schema.EnvVars:
    """Parse the environment variables and return them as typedef object.

    Returns:
        schema.EnvVars: object containing all required env variables

    """
    try:
        env_logging_level = os.environ["LOGLEVEL"].upper()
        env_database_host = os.environ["DB_HOST"]
        env_database_port = int(os.environ["DB_PORT"])
        env_database_del = "CLEAR_DB" in os.environ.keys()
        env_api_host = os.environ["API_HOST"]
        env_api_port = int(os.environ["API_PORT"])
        env_scraper_interval = int(os.environ["SCRAPER_INTERVAL"])
        env_scraper_timeout = int(os.environ["SCRAPER_TIMEOUT"])
        env_protocol_dtd_file = os.environ["PROTOCOL_DTD_FILE"]
        env_protocol_directory = os.environ["PROTOCOL_DIRECTORY"]
    except KeyError as key_error:
        print("Missing required environment variable: %s", str(key_error))
        sys.exit(1)
    except ValueError as value_error:
        print("Unable to convert port: %s", str(value_error))
        sys.exit(1)
    return schema.EnvVars(
        database_config=(
            env_database_host, env_database_port, env_database_del
        ),
        api_config=(env_api_host, env_api_port),
        scraper_config=(env_scraper_timeout, env_scraper_interval),
        protocol_config=(env_protocol_dtd_file, env_protocol_directory),
        other_config=(env_logging_level)
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
        env_vars.api_config, db_client
    ))
    return [t_api, t_scraper_timer, t_scraper, t_updater]


def run() -> None:
    """Run the backend."""
    env_vars = __parse_env_variables()
    __init_logging(env_vars.other_config)
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
