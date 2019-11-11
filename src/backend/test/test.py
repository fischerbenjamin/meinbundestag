"""
@author: Benjamin Fischer

Testsuite for unit tests.
"""


import unittest


import test.modules.parsing as parsing_test
import test.modules.config as config_test


def suite():
    """
    Create the testsuite.

    Returns:
        unittest.TestSuite: runnable testsuite containing all unit tests
    """
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.makeSuite(parsing_test.TestClass))
    test_suite.addTest(unittest.makeSuite(config_test.TestClass))
    return test_suite


def run():
    """
    Run the testsuite.
    """
    all_suite = suite()
    runner = unittest.TextTestRunner(verbosity=3)
    runner.run(all_suite)
