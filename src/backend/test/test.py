"""
@author: Benjamin Fischer

Testsuite for unit tests.
"""

import sys
import unittest


import test.modules.parsing as parsing_test
import test.modules.config as config_test
import test.modules.scraper as scraper_test
import test.modules.database as database_test
import test.modules.processing as processing_test


def suite():
    """
    Create the testsuite.

    Returns:
        unittest.TestSuite: runnable testsuite containing all unit tests
    """
    test_suite = unittest.TestSuite()
    test_suite.addTest(unittest.makeSuite(parsing_test.TestClass))
    test_suite.addTest(unittest.makeSuite(config_test.TestClass))
    #test_suite.addTest(unittest.makeSuite(scraper_test.TestClass))
    test_suite.addTest(unittest.makeSuite(database_test.TestClass))
    test_suite.addTest(unittest.makeSuite(processing_test.TestClass))
    return test_suite


def run():
    """
    Run the testsuite.
    """
    all_suite = suite()
    runner = unittest.TextTestRunner(verbosity=3)
    result = runner.run(all_suite)
    if result.wasSuccessful():
        sys.exit(0)
    else:
        sys.exit(1)
