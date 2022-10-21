"""
    Métodos relacionados à rota de Entradaa.
"""
from typing import Any, List

import peewee
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pydantic.utils import GetterDict

from ..models.entrada import busca_entrada, cria_entrada, lista_entradas, atualiza_entrada

router_entradas = APIRouter(
    prefix="/entradas",
    tags=["entradas"]
)

class PeeweeGetterDict(GetterDict):
    """
        Getter Dict class.
    """
    def get(self, key: Any, default: Any = None):
        """
            de-para de model para dtos

            - **key**: The object's key.
        """
        res = getattr(self._obj, key, default)
        if isinstance(res, peewee.ModelSelect):
            return list(res)
        return res

class EntradaInModel(BaseModel):
    """
        Model para entrada de dados de Entrada.
    """
    id:int=0
    nome:str
    descricao:str=""
    valor:float
    id_tipo_entrada:int
    id_usuario:int

class EntradaOutModel(EntradaInModel):
    """
        Model para retorno de dados de Entrada.
    """
    id:int
    tipo_entrada:str

    class Config:
        """
            Necessary config data.
        """ 
        orm_mode = True
        getter_dict = PeeweeGetterDict


@router_entradas.get("/", 
                        response_model=List[EntradaOutModel], 
                        summary="Lista todas as entradas",
                        description="Lista todas as entradas")
def lista() -> list[EntradaOutModel]:
    """
        Lista todas as entradas
    """
    return lista_entradas()


@router_entradas.get("/view/{id}", 
                    response_model=EntradaOutModel,
                    summary="Busca uma única entrada.")
async def busca(id: int) -> EntradaOutModel:
    """
        Busca uma única entrada.

        - **id**: o id da entrada. Número.
    """
    entrada = busca_entrada(id=id)
    if entrada is None:
        raise HTTPException(status_code=404, detail="Entrada not found")

    return entrada


@router_entradas.post("/",  
                        response_model=EntradaOutModel, 
                        summary="Cria uma nova entrada.")
async def cria(model: EntradaInModel)-> EntradaOutModel:
    """
        Cria uma nova entrada.
    """
    try: 
        return await cria_entrada(
                        id_usuario=model.id_usuario,
                        nome = model.nome, 
                        valor=model.valor,
                        descricao=model.descricao,
                        id_tipo_entrada=model.id_tipo_entrada)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_entradas.put("/", response_model=EntradaOutModel, 
                        summary="Atualiza detalhes da entrada.")
async def update(model: EntradaInModel)-> EntradaOutModel:
    """
        Atualiza detalhes da entrada.
    """
    try: 
        return await atualiza_entrada(id = model.id, 
                        id_usuario=model.id_usuario,
                        nome = model.nome, 
                        valor=model.valor,
                        descricao=model.descricao,
                        id_tipo_entrada=model.id_tipo_entrada)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# @router_entradas.delete(
#     "/remove/{id}",
#     summary="Delete an individual entrada",
#     response_class=Response,
#     responses={
#         200: {"description": "Entrada successfully deleted"},
#         404: {"description": "Entrada not found"},
#     },
# )

# async def remove_entrada(id: int):
#     del_entrada = delete_entrada(id)
#     if del_entrada is None:
#         return Response(status_code=404)
#     return Response(status_code=200)