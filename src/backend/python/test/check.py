"""Helper script to detect possible bugs during parsing/processing."""


# Python imports
import time
import json


# Local imports
import src.modules.parsing as parsing
import src.modules.processing as processing


def run(protocol_file: str, dtd_file: str, output_file: str) -> None:
    """Parse and process speeches of test protocol.

    Tries to parse and process the given protocol. The result is written to
    the given output file (JSON format).

    Args:
        protocol_file (str): protocol to parse
        dtd_file (str): document type definition
        output_file (str): output file

    """
    ts_start = time.time()
    speeches = parsing.get_speeches(protocol_file, dtd_file)
    print("Parsing speeches took {:3.2f} seconds".format(time.time()-ts_start))
    ts_start = time.time()
    processing.analyze_speeches(speeches)
    print("Processing speeches took {:3.2f} seconds".format(
        time.time()-ts_start
    ))
    speeches_json = [speech.to_json() for speech in speeches]
    with open(output_file, "w") as out:
        json.dump(speeches_json, out, indent=4)
    print("Check result in {}".format(output_file))
