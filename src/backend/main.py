"""Entrypoint for running/testing backend."""


# Global imports
import argparse


# Local imports
import src.backend as backend


if __name__ == "__main__":
    PARSER = argparse.ArgumentParser()
    PARSER.add_argument(
        "-t", "--test", action="store_true", dest="test",
        help="Running tests instead of application."
    )
    ARGS = PARSER.parse_args()
    if ARGS.test:
        import test.test as test
        print("Running tests.")
        test.run()
    else:
        print("Running backend.")
        backend.run()
