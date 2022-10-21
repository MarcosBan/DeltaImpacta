"""
    Métodos de rota da entidade TipoSaida
"""
from datetime import date, datetime
from sqlite3 import Timestamp
from typing import Any, List

import peewee
from fastapi import APIRouter, HTTPException, Response, Request
from ..models.tipo_saida import TipoSaida, busca_tipo_saida, cria_tipo_saida, delete_tipo_saida, lista_tipo_saidas
from pydantic import BaseModel
from pydantic.utils import GetterDict

router_tipo_saidas = APIRouter(
    prefix="/saidas",
    tags=["saidas"]
)

class PeeweeGetterDict(GetterDict):
    """
        Getter Dict class.
    """
    def get(self, key: Any, default: Any = None):
        """
            De-Para do modelo pros dtos

            - **key**: The object's key.
        """
        res = getattr(self._obj, key, default)
        if isinstance(res, peewee.ModelSelect):
            return list(res)
        return res

class TipoSaidaModeloSaida(BaseModel):
    """
        Modelo de saida de dados de TipoSaida.
    """
    nome:str
    id_usuario:int

class TipoSaidaModeloSaida(TipoSaidaModeloSaida):
    """
        Modelo de retorno de dados de TipoSaida
    """
    id:int
    
    class Config:
        """
            Necessary config data.
        """ 
        orm_mode = True
        getter_dict = PeeweeGetterDict


@router_tipo_saidas.get("/", response_model=List[TipoSaidaModeloSaida], summary="List of saidas",
                     description="Returns all saidas")
def lista() -> list[TipoSaida]:
    """
        Lista todos os tipos de saida
    """
    return lista_tipo_saidas()


@router_tipo_saidas.get("/view/{id}"
                        , response_model=TipoSaidaModeloSaida
                        , summary="Retorna um único tipo de saida.")
async def busca(id: int) -> TipoSaidaModeloSaida:
    """
        Retorna um único tipo de saida

        - **id**: o id do tipo de saida. Número
    """
    saida = busca_tipo_saida(id=id)
    if saida is None:
        raise HTTPException(status_code=404, detail="TipoSaida não encontrado.")

    return saida


@router_tipo_saidas.post("/", 
                        response_model=TipoSaidaModeloSaida, 
                        summary="Cria um novo tipo de saida.")
async def cria(model: TipoSaidaModeloSaida)-> TipoSaidaModeloSaida:
    """
        Cria um novo tipo de saida.
    """
    try: 
        return await cria_tipo_saida(nome=model.nome)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router_tipo_saidas.delete(
    "/remove/{id}",
    summary="Deleta um tipo de saida.",
    response_class=Response,
    responses={
        200: {"description": "TipoSaida successfully deleted"},
        404: {"description": "TipoSaida not found"},
    },
)
async def remove(id: int):
    """
        Deleta um tipo de saida.

        - **id**: o id do tipo de saida. Número
    """
    delete = delete_tipo_saida(id)
    if delete is None or delete == 0:
        return Response(status_code=404)
    return Response(status_code=200)