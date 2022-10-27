
import logging
import os
import msal

azureB2C = {
    "authority": os.environ['ADB2C_AUTHORITY'],
    "client_id": os.environ['ADB2C_CLIENT_ID'],
    "scope": ["https://graph.microsoft.com/.default"],
    "secret": os.environ['ADB2C_CLIENT_SECRET'],
    "endpoint": "https://graph.microsoft.com/v1.0/users"
}


msal = msal.ConfidentialClientApplication(
    azureB2C["client_id"], authority=azureB2C["authority"],
    client_credential=azureB2C["secret"]
)


def getToken():
    logging.info(azureB2C)

    # The pattern to acquire a token looks like this.
    result = None

    # First, the code looks up a token from the cache.
    # Because we're looking for a token for the current app, not for a user,
    # use None for the account parameter.
    result = msal.acquire_token_silent(azureB2C["scope"], account=None)

    if not result:
        logging.info(
            "No suitable token exists in cache. Let's get a new one from AAD.")
        result = msal.acquire_token_for_client(scopes=azureB2C["scope"])

    if "access_token" in result:
        # Call a protected API with the access token.
        print(result["token_type"])
    else:
        print(result.get("error"))
        print(result.get("error_description"))
        # You might need this when reporting a bug.
        print(result.get("correlation_id"))

    return result
