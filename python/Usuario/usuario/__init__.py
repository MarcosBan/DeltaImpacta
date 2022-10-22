from usuario.routers import entrada, saida, tipo_entrada, tipo_saida
from .database import *
from fastapi import FastAPI
import azure.functions as func
from .routers import usuario

app = FastAPI(title='Delta Budget Tracker API', description='APIs para usuario', version='0.1')


@app.get("/")
async def root():
    return {"message": "Acordada!"}


app.include_router(usuario.router_usuarios)
app.include_router(tipo_entrada.router_tipo_entradas)
app.include_router(tipo_saida.router_tipo_saidas)
app.include_router(entrada.router_entradas)
app.include_router(saida.router_saidas)


@app.on_event("startup")
async def startup():
    print("Connectando...")
    if conn.is_closed():
        conn.connect()


@app.on_event("shutdown")
async def shutdown():
    print("Fechando...")
    if not conn.is_closed():
        conn.close()    


def main(req: func.HttpRequest, context: func.Context) -> func.HttpResponse:
    return func.AsgiMiddleware(app).handle(req, context)