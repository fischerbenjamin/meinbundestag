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
import logging


app = flask.Flask(__name__, template_folder="/usr/data")
db = None


@app.route("/")
def home() -> None:
    logging.info("/")
    return flask.render_template("template.html")


@app.route("/clear")
def clear() -> dict:
    global db
    logging.info("/clear")
    return flask.jsonify(db.clear())


@app.route("/show")
def show() -> dict:
    global db
    logging.info("/show")
    return flask.jsonify(db.show())


@app.route("/profile/<name>")
def profile(name: str) -> dict:
    logging.info("/profile/{}".format(name))
    raise NotImplementedError


@app.route("/speeches/<name>")
def speeches(name: str) -> list:
    global db
    logging.info("/speeches/{}".format(name))
    speeches = db.get_speeches_for_user(name, want_json=True)
    return flask.jsonify(speeches)


@app.route("/speakers")
def speakers() -> list:
    global db
    logging.info("/speakers")
    speakers = db.get_all_speakers()
    return flask.jsonify(speakers)


def start(host: str, port: int, database: database.Database) -> None:
    global app, db
    db = database
    app.run(host=host, port=port)
