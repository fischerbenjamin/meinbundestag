"""
@author: Benjamin Fischer
"""


# Local imports
import src.modules.database as database


# Global imports
import mockupdb
import unittest
import threading


class TestClass(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.server = mockupdb.MockupDB(auto_ismaster={"maxWireVersion": 3})
        cls.server.run()
        database.init(
            cls.server.uri, cls.server.port,
            threading.Semaphore(), threading.Semaphore()
        )

    @classmethod
    def tearDownClass(cls):
        cls.server.stop()

    def test_client_not_none(self):
        self.assertIsNotNone(database.client)

    def test_database_not_none(self):
        self.assertIsNotNone(database.database)

    def test_collection_not_none(self):
        self.assertIsNotNone(database.speeches)
