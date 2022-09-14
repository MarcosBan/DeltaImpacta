import os
from typing import List, Union
import azure.functions as func
import fastapi
from bson.json_util import dumps, loads
from pydantic import BaseModel
from datetime import datetime
from . msal import getToken
from .data_modification import format_query, format_search_params, format_query
from .data_access import Database

import requests
database = None
app=fastapi.FastAPI()

if(not database):
    database = Database()

class Usuario(BaseModel):
    nome:str
    usuario: str
    email:str
    data_nascimento: str


@app.get("/heartbeat")
def health():
    return "OK"

@app.get("/")
def search(id : Union[str, None] = None, nome : Union[str, None] = None, usuario : Union[str, None] = None, data_nascimento : Union[str, None] = None, data_criacao : Union[str, None] = None, data_alteracao : Union[str, None] = None):
    ret = None
    status_code = None
    try:
        
        search_params = {"id": id, "nome": nome, "usuario": usuario, "data_nascimento": data_nascimento, "data_criacao": data_criacao,"data_alteracao":data_alteracao}
        query_params = {}
        query_params["condicoes"] = format_search_params(search_params, "service_type") 
        query_params["conteudo"] = None
        query = format_query("usuario", query_params,"select")
        result = database.execute_query(query)
        ret = dumps(result)
        status_code = 200
    except Exception as e:
        ret = str(e)
        status_code = 400
    finally:
        return func.HttpResponse(
            ret, 
            status_code = status_code,
            mimetype='application/json'     
        )

@app.post("/")
def add(usuario: Usuario):
    endpoint = "https://graph.microsoft.com/v1.0/users"
    http_headers = {'Authorization': 'Bearer ' + getToken()['access_token'],
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'}
    try:
        response = requests.post(endpoint, headers=http_headers, stream=False, json={
            "givenName": usuario.nome,
            "surname": usuario.nome,
            "displayName": usuario.usuario,
            "passwordProfile": {
                "password": "VeryVeryHardPassword1!"
            },
            "identities": [
                {
                    "signInType": "emailAddress",
                    "issuer": "mpmttest.onmicrosoft.com",
                    "issuerAssignedId": usuario.email
                }
            ]
        }
        )
        response.raise_for_status()
    except requests.exceptions.HTTPError as e:
        raise fastapi.HTTPException(
            status_code=500, detail=response.json())

    MSUser = response.json()
    collection = MSUser["id"]
    item_to_add = usuario.dict()
    item_to_add["data_nascimento"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    item_to_add["data_criacao"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    item_to_add["data_modificacao"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    statement = format_query("Usuario", item_to_add, "insert")
    database.execute_non_query(statement)
    
    return func.HttpResponse(
          "OK", 
          status_code = 200,
          mimetype='application/json'      
     )

@app.put()
def update(usuario: Usuario):
    pass
   
def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    return func.AsgiMiddleware(app).handle(req, context)
