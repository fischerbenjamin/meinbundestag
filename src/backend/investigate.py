"""
@author: Benjamin Fischer
"""

# Local imports
import src.modules.parsing as parsing
import src.modules.processing as processing

# Global imports
import os
import time
import argparse


def parse_arguments() -> tuple:
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
    protocol, dtd = parse_arguments()
    t = time.time()
    speeches = parsing.get_speeches(protocol, dtd)
    print("Parsing speeches took {:3.2f} seconds".format(time.time()-t))
    t = time.time()
    processing.analyze_speeches(speeches)
    print("Processing speeches took {:3.2f} seconds".format(time.time()-t))
