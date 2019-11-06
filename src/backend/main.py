import argparse

import src.app as app
import test.test as test


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-t", "--test", action="store_true", dest="test",
        help="Running tests instead of application."
    )
    args = parser.parse_args()
    if args.test:
        print("Running tests.")
        test.run()
    else:
        print("Running app.")
        app.run()
