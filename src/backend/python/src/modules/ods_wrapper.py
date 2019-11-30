"""This module is responsible for calling the JVALUE ODS.

The implementation tries to retrieve the resources from the ods first.
If a request fails, the wrapper class automatically calls the API of
abgeordnetenwatch in order to retrieve the desired information.
"""


# Python imports
import logging
from typing import Tuple


# 3rd party modules
import requests


class ODS:
    """Wrapper class for JVALUE ODS calls."""

    def __init__(self, ods_config: Tuple[str, str, str, str]):
        """Initialize object.

        Args:
            ods_config (Tuple[str, str, str, str]):
                (host, pipeline, fallback, profile)

        """
        self.ods_host = ods_config[0]
        self.ods_pipeline_deputies = ods_config[1]
        self.ods_fallback_deputies = ods_config[2]
        self.ods_profile_url = ods_config[3]
        self.ods_deputies = "http://{}/{}".format(
            self.ods_host, self.ods_pipeline_deputies
        )

    def __ods_pipeline_deputies(self) -> dict:
        """Access deputies overview via JValue ODS.

        Try to access the predefined storage pipeline for the overview.

        Returns:
            dict: overview or None if the ODS was unreachable

        """
        try:
            res = requests.get(self.ods_deputies, timeout=0.5)
            # pylint: disable=no-member
            if res.status_code == requests.codes.ok:
                try:
                    return res.json()["profiles"]
                except TypeError:
                    logging.error(
                        "ODS pipeline not existing/correctly configured"
                    )
                    return None
            # pylint: enable=no-member
        except requests.exceptions.ConnectionError:
            logging.warning("Cannot reach ODS for deputies pipeline")
        return None

    def __fallback_deputies(self) -> dict:
        """Access deputies overview via abgeordnetenwatch.de.

        Access the overview directly if the ODS fails.

        Returns:
            dict: deputies.json (only profiles)

        """
        res = requests.get(self.ods_fallback_deputies)
        # pylint: disable=no-member
        if res.status_code == requests.codes.ok:
            return res.json()["profiles"]
        # pylint: enable=no-member
        return None

    def deputies(self) -> dict:
        """Get deputies overview (wrapper function).

        Returns:
            dict: result or None on failure

        """
        ods_resp = self.__ods_pipeline_deputies()
        if ods_resp is not None:
            logging.info("Calling ods for pipeline deputies was successful")
            return ods_resp
        logging.warning("Using fallback for pipeline deputies")
        return self.__fallback_deputies()

    def get_full_profile(self, profile: dict) -> dict:
        """Return the full profile information of given profile.

        Uses the 'username' attribute in order to request the full profile
        from abgeordnetenwatch.de

        Args:
            profile (dict): profile from overview

        Returns:
            dict: full profile

        """
        username = profile["meta"]["username"]
        url = self.ods_profile_url.format(username)
        res = requests.get(url)
        # pylint: disable=no-member
        if res.status_code == requests.codes.ok:
            return res.json()
        # pylint: enable=no-member
        return None
