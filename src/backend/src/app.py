"""
@author: Benjamin Fischer
"""

# Local imports
import src.modules.api as api
import src.modules.updater as updater
import src.modules.database as database


# Global imports
import os
import threading


def run():
    print(database.init(os.environ["DB_HOST"], int(os.environ["DB_PORT"])))
    api.start(host='0.0.0.0', port=int(os.environ["API_PORT"]))
    thread_api = threading.Thread(target=api.start(), args=(
        os.environ["API_HOST"], os.environ["API_PORT"]
    ))
    thread_updater = threading.Thread(target=updater.start())
    thread_api.start()
    thread_updater.start()
