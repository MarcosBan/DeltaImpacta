import unittest
import azure.functions as func
import json 
from user import main
from unittest import mock

class TestUserApi(unittest.TestCase):
    global tenant_id, id, name, chain_id
    tenant_id = "1579ea21-c3a2-4adc-9297-a128df9d67f3"
    # id = 'dione_confort_hall'
    # name = 'Dione Confort Hall'
    # chain_id = 'dione_test_hotels3'

       
    def test_health(self):

        req = func.HttpRequest(
            method='GET',
            body=None,
            url='/health')

        resp = main(req, '')

        self.assertEqual(
            resp.get_body(),
            b'"OK"'
        )

        def test_add(self):
            req = func.HttpRequest(
                method='GET',
                body=None,
                url='/health')

            resp = main(req, '')

            self.assertEqual(
                resp.get_body(),
                b'"OK"'
            )   
    def test_add(self):
        mock_user = {
            "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#users/$entity",
            "id": "87d349ed-44d7-43e1-9a83-5f2406dee5bd",
            "businessPhones": [],
            "displayName": "Adele Vance",
            "givenName": "Adele",
            "jobTitle": "Product Marketing Manager",
            "mail": "AdeleV@contoso.onmicrosoft.com",
            "mobilePhone": "+1 425 555 0109",
            "officeLocation": "18/2111",
            "preferredLanguage": "en-US",
            "surname": "Vance",
            "userPrincipalName": "AdeleV@contoso.onmicrosoft.com",
            "authorization":{
                                "tenant_id": {tenant_id},  
                                "role": "colaborator",
                                "status": "enabled"
                            }}
        req = func.HttpRequest(
            method="POST",
            headers={
                "Content-Type": "application/json"
            },
            body=bytes(json.dumps(mock_user), "utf-8"),
            url=f'/add_user'
        )
        resp = main(req, '')
        assert f'{resp.status_code}' == "200"