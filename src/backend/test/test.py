# tests/runner.py
import unittest

# import your test modules
import test.modules.parsing as parsing_test


def suite():
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.makeSuite(parsing_test.TestClass))
    return test_suite


def run():
    all_suite = suite()
    runner = unittest.TextTestRunner(verbosity=3)
    runner.run(all_suite)
