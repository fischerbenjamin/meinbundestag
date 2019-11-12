"""
@author: Benjamin Fischer
"""


import mockupdb
import unittest


import src.modules.database as database_src


class TestClass(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.server = mockupdb.MockupDB(auto_ismaster={"maxWireVersion": 3})
        cls.server.run()
        database_src.init(cls.server.uri, cls.server.port)

    @classmethod
    def tearDownClass(cls):
        cls.server.stop()

    def test_client_not_none(self):
        self.assertIsNotNone(database_src.client)

    def test_database_not_none(self):
        self.assertIsNotNone(database_src.database)

    def test_collection_not_none(self):
        self.assertIsNotNone(database_src.speeches)
