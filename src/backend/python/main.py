"""Entrypoint for running/testing backend."""


# Python imports
import os
import argparse


# Local imports
import src.backend as backend


if __name__ == "__main__":
    PARSER = argparse.ArgumentParser(
        description="""
            Running the backend. The user can either (!) run tests or check
            an example protocol or run the backend service. For the latter,
            please use the high level @make rules.
        """
    )
    PARSER.add_argument(
        "--test", action="store_true", dest="test",
        help="Running tests instead of application."
    )
    PARSER.add_argument(
        "--check", action="store_true", dest="check",
        help="Check implementation of parsing and processing."
    )
    PARSER.add_argument(
        "-p", type=str, dest="protocol", metavar="protocol.xml",
        help="Example protocol to check."
    )
    PARSER.add_argument(
        "-d", type=str, dest="dtd", metavar="protocol.dtd",
        help="Document type definition."
    )
    PARSER.add_argument(
        "-o", type=str, dest="output", metavar="output.json",
        help="Destination of output file."
    )
    ARGS = PARSER.parse_args()
    if ARGS.test:
        import test.test as test
        print("Running tests.")
        test.run()
    if ARGS.check:
        import test.check as check
        print("Running check.")
        PROTOCOL, DTD, OUTPUT = (
            os.path.abspath(ARGS.protocol),
            os.path.abspath(ARGS.dtd),
            ARGS.output
        )
        check.run(PROTOCOL, DTD, OUTPUT)
    else:
        print("Running backend.")
        backend.run()
