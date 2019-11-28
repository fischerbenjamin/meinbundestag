# pylint: disable=global-statement

"""This module implements the REST-API of the backend.

The implementation uses the flask framework to provide a simple REST api.
The user can request the profile information about a certain deputy or
ask for the deputy's speeches. The API also provides routes to retrieve
statistical information of all speeches. Functionality is implemented on
module level because of the design of the flask module.
"""


# Python imports
import logging
from typing import List, Dict, Any, Tuple


# 3rd party modules
import flask


# Local imports
import src.modules.database as database


# Global variables
DATABASE = None
APP = flask.Flask(__name__, template_folder="/usr/data")


@APP.route("/")
def api_home() -> str:
    """Home route of the api showing all available routes.

    This route renders to template.html file to provide the user an overview
    about all supported routes.

    Returns:
        str: rendered template file

    """
    logging.info("/")
    return flask.render_template("template.html")


@APP.route("/info")
def api_info() -> Dict[str, Any]:
    """Show some general information about the database.

    Examples are the number of processed speeches and all existing collections.

    Returns:
        Dict[str, Any]: general key-value encoded information

    """
    global DATABASE
    logging.info("/info")
    return flask.jsonify(DATABASE.meta_stats())


@APP.route("/profile/<name>")
def api_profile(name: str) -> Dict[str, Any]:
    """Display the profile of the given deputy.

    This route retrieves the information about the given deputy by calling
    the ODS.

    Args:
        name (str): deputy's name

    Raises:
        NotImplementedError: Currently not implemented

    Returns:
        Dict[str, Any]: deputy's profile

    """
    logging.info("/profile/%s", name)
    raise NotImplementedError


@APP.route("/speeches/<name>")
def api_speeches(name: str) -> List[dict]:
    """Return all speeches of given deputy.

    This route is thought to be used by the frontend to display the profile
    of a single deputy. The given name is required to be seperated by dashes.

    Args:
        name (str): deputy's name

    Returns:
        List[Dict[str, Any]]: list of all speeches of given deputy

    """
    global DATABASE
    logging.info("/speeches/%s", name)
    speeches = DATABASE.speech_get_speeches_for_name(name, want_json=True)
    return flask.jsonify(speeches)


@APP.route("/speakers")
def api_speakers() -> List[str]:
    """Return a list of all deputies with at least one speech in the database.

    This route can be used to check if a certain deputy is already present in
    the database.

    Returns:
        List[str]: list of names (single name is seperated by dashes)

    """
    global DATABASE
    logging.info("/speakers")
    speakers = DATABASE.meta_get_all_speakers()
    return flask.jsonify(speakers)


@APP.route("/stats")
def api_stats() -> Dict[str, Any]:
    """Return statistics about the analysis of the speeches.

    This route is supposed to give an overview what are the limits of the
    analysis of the speeches. It can be used to classify a single speech
    by comparing it to the min/max values.

    Returns:
        Dict[str, Any]: mapping from keyword to (description, min, max)

    """
    global DATABASE
    logging.info("/stats")
    limits = DATABASE.meta_get_analysis_limits()
    return flask.jsonify(limits)


def start(api_config: Tuple[str, int], db_client: database.Database) -> None:
    """Start the flask application.

    This function starts the flask application and is supposed to never return.

    Args:
        api_config (Tuple[str, int]): (host, port)
        db_client (database.Database): database client

    """
    global APP, DATABASE
    DATABASE = db_client
    host, port = api_config
    APP.run(host=host, port=port)
