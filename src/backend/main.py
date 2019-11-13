import argparse


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-t", "--test", action="store_true", dest="test",
        help="Running tests instead of application."
    )
    args = parser.parse_args()
    if args.test:
        print("Running tests.")
        import test.test as test
        test.run()
    else:
        print("Running app.")
        import src.app as app
        app.run()
