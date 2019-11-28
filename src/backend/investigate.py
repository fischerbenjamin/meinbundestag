"""Helper script to detect possible bugs during parsing/processing."""


# Global imports
import os
import time
import json
import argparse
from typing import Tuple


# Local imports
import src.modules.parsing as parsing
import src.modules.processing as processing


def parse_arguments() -> Tuple[str, str]:
    """Parse the command line arguments.

    Returns:
        Tuple[str, str]: paths of (protocol, dtd file)

    """
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-p", "--protocol", dest="protocol",
        help="filepath of protocol"
    )
    parser.add_argument(
        "-d", "--dtd", dest="dtd",
        help="filepath of dtd"
    )
    args = parser.parse_args()
    return (os.path.abspath(args.protocol), os.path.abspath(args.dtd))


if __name__ == "__main__":
    PROTOCOL, DTD_FILE = parse_arguments()
    TS_START = time.time()
    SPEECHES = parsing.get_speeches(PROTOCOL, DTD_FILE)
    print("Parsing speeches took {:3.2f} seconds".format(time.time()-TS_START))
    TS_START = time.time()
    processing.analyze_speeches(SPEECHES)
    print("Processing speeches took {:3.2f} seconds".format(
        time.time()-TS_START
    ))
    SPEECHES_JSON = [speech.to_json() for speech in SPEECHES]
    with open("output.json", "w") as fp:
        json.dump(SPEECHES_JSON, fp, indent=4)
