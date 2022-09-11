import os
from typing import List, Union
import azure.functions as func
import fastapi
from bson.json_util import dumps, loads
from pydantic import BaseModel
from datetime import datetime
from . msal import getToken
from .data_modification import format_query, format_search_params, format_query

import requests

app=fastapi.FastAPI()

database.initialize()

@app.get("/heartbeat")
async def health():
    return "OK"

class Usuario(BaseModel):
    nome:str
    usuario: str
    email:str
    data_nascimento: str

@app.get()
async def search(id : Union[str, None] = None, nome : Union[str, None] = None, usuario : Union[str, None] = None, data_nascimento : Union[str, None] = None, data_criacao : Union[str, None] = None, data_alteracao : Union[str, None] = None):
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

@app.post()
async def add(usuario: Usuario):
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
    item_to_add["data_nascimento"] = datetime.strftime(("%Y-%m-%d %H:%M:%S")
    item_to_add["data_criacao"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    item_to_add["data_modificacao"] = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    
    dic = Database.insert(collection,item_to_add)
    obj = Database.find(collection,dic)
    ret = dumps(obj)
    return func.HttpResponse(
          ret, 
          status_code = 203,
          mimetype='application/json'      
     )

@app.put()
async def update(usuario: Usuario):
    pass
   
def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    return func.AsgiMiddleware(app).handle(req, context)
