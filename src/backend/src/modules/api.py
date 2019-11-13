"""
@author: Benjamin Fischer

This module provides the backend's api. It uses the flask framework to
provide a simple REST api. The user can request the profile information about
a certain deputy or get the deputy's speeches.
"""

# Local imports
import src.modules.database as database


# Global imports
import flask


app = flask.Flask(__name__)


@app.route("/list")
def list() -> dict:
    return flask.jsonify(database.list_speeches())


@app.route("/profile/<name>")
def profile(name: str) -> dict:
    raise NotImplementedError


@app.route("/speeches/<name>")
def speeches(name: str) -> list:
    speeches = database.get_speeches_for_user(name)
    return flask.jsonify(speeches)


def start(host: str, port: int) -> None:
    global app
    app.run(host=host, port=port)
