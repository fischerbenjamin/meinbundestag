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
from flask_cors import CORS

# Local imports
import src.modules.schema as schema
import src.modules.database as database
import src.modules.ods_wrapper as ods_wrapper


# Global variables
DATABASE = None
ODS_WRAPPER = None
API_AUTHOR, API_VERSION, API_CONTACT = (None, None, None)

APP = flask.Flask(__name__, template_folder="/usr/data")
cors = CORS(APP)
APP.config['CORS_HEADERS'] = 'Content-Type'


@APP.route("/")
def api_home() -> str:
    """Home route of the api showing all available routes.

    This route renders to template.html file to provide the user an overview
    about all supported routes.

    Returns:
        str: rendered template file

    """
    global API_AUTHOR, API_VERSION, API_CONTACT
    logging.info("/")
    descr = dict(
        author=API_AUTHOR,
        name="MeinBundestag",
        version=API_VERSION,
        routes=[
            dict(route="/", descr="Overview about this application"),
            dict(route="/info", descr="General information about stored data"),
            dict(route="/deputies", descr="Names of all deputies"),
            dict(route="/profile/{deputy}", descr=(
                "Profile of given deputy"
                "(pass the name as an dash seperated string, e.g. john-doe)"
            ))
        ],
        description=(
            "This is some further description of the api."
            "Have fun & enjoy :)"
        ),
        contact=API_CONTACT
    )
    return flask.jsonify(descr)


@APP.route("/info")
def api_info() -> Dict[str, Any]:
    """Show some general information about the database.

    Returns:
        Dict[str, Any]: general key-value encoded information

    """
    global DATABASE
    logging.info("/info")
    result = dict(
        stats=DATABASE.meta_get_analysis_limits(),
        speakers=DATABASE.meta_get_all_speakers(),
        info=DATABASE.meta_stats()
    )
    return flask.jsonify(result)


@APP.route("/deputies")
def api_deputies_names() -> List[str]:
    """Return a list containing all deputies of the bundestag.

    This list can be used for an overview or search function in the
    frontend.

    Returns:
        List[str]: names of all deputies

    """
    global ODS_WRAPPER
    names = [
        dict(
            name=schema.Name.from_profile(profile),
            city=profile["personal"]["location"]["city"]
        )
        for profile in ODS_WRAPPER.deputies()
    ]
    return flask.jsonify(names)


@APP.route("/profile/<name>")
def api_profile(name: str) -> Dict[str, Any]:
    """Display the profile of the given deputy.

    This route retrieves the information about the given deputy. It uses the
    overview provided by the ODS to get the username for the profile page
    of abgeordnetenwatch.de. Returns the profile information and all speeches
    of the given deputy.

    Args:
        name (str): deputy's name

    Returns:
        Dict[str, Any]: deputy's profile

    """
    global ODS_WRAPPER, DATABASE
    logging.info("/profile/%s", name)
    my_name = schema.Name.from_url_string(name)
    regex = my_name.get_regex()
    profile = None
    for tmp in ODS_WRAPPER.deputies():
        tmp_name = schema.Name.from_profile(tmp)
        if regex.match(str(tmp_name)):
            profile = ODS_WRAPPER.get_full_profile(tmp)
            break
    if profile is None:
        return flask.jsonify(None)
    profile["profile"]["speeches"] = DATABASE.speech_get_speeches_for_name(
        regex
    )
    return flask.jsonify(profile)


def start(
        api_config: Tuple[str, int, str, str, str],
        ods_config: Tuple[str, str],
        db_client: database.Database
) -> None:
    """Start the flask application.

    This function starts the flask application and is supposed to never return.

    Args:
        api_config (Tuple[str, int, str, str, str]):
            (host, port, author, version, contact)
        ods_config (Tuple[str, str]): (host, pipeline, fallback, profile)
        db_client (database.Database): database client

    """
    global APP, DATABASE, ODS_WRAPPER, API_AUTHOR, API_VERSION, API_CONTACT
    DATABASE = db_client
    ODS_WRAPPER = ods_wrapper.ODS(ods_config)
    host, port, API_AUTHOR, API_VERSION, API_CONTACT = api_config
    APP.run(host=host, port=port)
