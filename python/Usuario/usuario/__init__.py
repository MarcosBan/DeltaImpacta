from fastapi import FastAPI
from pydantic import BaseModel
from redbird.repos import MemoryRepo
import azure.functions as func
from sqlalchemy import create_engine
from redbird.repos import SQLRepo

connection_string = "mysql+pymysql://%s:%s@%s:%s/%s" % (USER, PASSWORD, HOST, PORT, DATABASE)
engine = create_engine(connection_string)

app = FastAPI()

repo = SQLRepo(engine=engine, table="my_table")

class Usuario(BaseModel):
    nome:str
    usuario: str
    email:str
    data_nascimento: str
    
@app.post("/users", description="Create an user")
def create_item(item: Usuario):
    #todo post to msal
    repo.add(item)

@app.get("/users", description="Get all users")
def get_users():
    return repo.filter_by().all()

@app.get("/users/{item_id}", description="Get item by ID")
def get_item(item_id: int):
    return repo[item_id]

@app.patch("/users/{item_id}", description="Update an item")
def update_item(item_id: int, values: dict):
    repo[item_id] = values

@app.delete("/users/{item_id}", description="Delete an item")
def delete_item(item_id: int):
    del repo[item_id]