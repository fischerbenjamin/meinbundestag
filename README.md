# meinbundestag

[![Build Status](https://travis-ci.com/fischerbenjamin/meinbundestag.svg?branch=master)](https://travis-ci.com/fischerbenjamin/meinbundestag)

*MeinBundestag* is an application about the German parliament.
It provides information about the deputies of the current election period and allows the user to read the speeches held in the parliament.

The goal of this application is to make these kind of information easily accessible by providing a mobile application and therefore increase the political interest of its users.

The application is still under development, so there is no installable version of it in one of the app stores.
If you're already interested, you can run the application yourself following the instructions described [here](#usage).

## Table of contents

1. [Open data](#open-data)

1. [Technology](#technology)
    * [Backend](#backend)
    * [Frontend](#frontend)
1. [Usage](#usage)
1. [Preview](#preview)
1. [Contact](#contact)

## Open data

The application basically uses two open data sources provided by:

* [abgeordnetenwatch](https://www.abgeordnetenwatch.de)

* [bundestag](https://www.bundestag.de/services/opendata)

The data provided by *abgeordnetenwatch* contains personal information about each deputy of the German parliament as well as information about their votings and subsidiary activities.
These information are published via their website and [API](https://www.abgeordnetenwatch.de/api) and are pretty straightforward to use.

The protocols of the German parliament are published on its website.
They are formatted as .xml files and free to use.
There is also a DTD for the protocols of the current election period for easier automated usage.

## Technology

The application is split into the backend providing the actual data and the frontend running on a mobile device.
Here is a general overview which technology is used in particular:

* Backend ([Python](https://www.python.org/)): [Docker](https://www.docker.com/), [Docker-Compose](https://docs.docker.com/compose/)
* Frontend (Javascript/[Node](https://nodejs.org/)): [React Native](https://facebook.github.io/react-native/), [Expo](https://expo.io/)

### Backend

The backend itself consists of three services:

* MongoDB database

    The database persists the processed protocols and is connected to the backend network.
    The source code contains a module *database* that implements the communication with the database.

* Flask webserver

    The python backend provides a simple REST API using Flask for the frontend to interact with. Furthermore, it is running a web-scraper that is constantly looking for new protocols based on the selenium package.
    The speeches are analyzed with the textblob package that is used for the sentiment analysis.
    This feature is rather experimental and does not produce fully
    reliable results yet.
    Of course, it is interacting with the database and the ODS via the backend network.
    Currently, the Flask application enables *CORS* headers for an easier development using the expo client.
    Due to security issues, disable this feature when running the backend in production.

* ODS

    The ODS is experimentally used for providing the list of all deputies of the parliament.
    The pipeline is configured once manually and afterwards set in an environment file.
    Without specifying the pipeline in this file, the Python backend uses a fallback implementation to fetch the data directly from *abgeordnetenwatch*.

### Frontend

The frontend is a minimalistic React Native application that only uses native elements.
Expo is used for an easier development phase using the webview.
The frontend has only been tested using the Expo app for android on a native device without building an apk and installing it.  

## Usage

You have to install the following list of software before running the application:

* [docker](https://www.docker.com/)
* [docker-compose](https://docs.docker.com/compose/)
* [node](https://nodejs.org)
* [yarn](https://yarnpkg.comz)

There is a Makefile in the *src/* directory that provides a target for building the backend.
It also provides targets for the frontend, but these targets require additional software to be installed, so it may be easier to run the expo client directly.

You must provide a valid *.env* file in the *src/* folder that sets the following environment variables:

```bash
### DATABASE ###

DB_HOST=database
DB_PORT=27017
CLEAR_DB=no
DB_USER={your-user}
DB_PASSWORD={your-password}


### BACKEND ###

# CONFIG:: API
API_PORT=3000
API_HOST=0.0.0.0
API_AUTHOR={your-name}
API_VERSION={your-version}
API_CONTACT={your-mail}

# CONFIG:: SCRAPER
SCRAPER_TIMEOUT=5
SCRAPER_INTERVAL=86400

# CONFIG:: PROTOCOL
PROTOCOL_DTD_FILE=/usr/data/protocol.dtd
PROTOCOL_DIRECTORY=/protocols

# CONFIG:: ODS (leave blank so fallbacks are used)
ODS_HOST={}
ODS_PIPELINE_DEPUTIES={}
ODS_FALLBACK_DEPUTIES=https://www.abgeordnetenwatch.de/api/parliament/bundestag/deputies.json
ODS_PROFILE_URL={}
```

Of course, you can change these values according to your settings.
You'll probably have to create a user/password in the database container when specifying it here.
The general procedure in order to run the application on your local machine then looks like this:

```bash
# clone the repository
git clone https://github.com/fischerbenjamin/meinbundestag.git

# run the backend
(cd meinbundestag/src && make backend)

# run the frontend
(cd meinbundestag/src/mobile/meinbundestag-mobile && yarn install && yarn web)
```

Running the application on the expo client on your device requires you to configure the IP address of the host providing the backend in the file *src/mobile/meinbundestag-mobile/config.js*.

## Preview

TODO: add images

## Contact

You can simply [contact](mailto:benjamin.f.fischer@fau.de) me by writing me an e-mail. Feel free to share your interest, criticism or anything else. I'm looking forward to your message :)
