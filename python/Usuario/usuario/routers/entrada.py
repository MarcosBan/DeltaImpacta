"""
    Métodos de rota da entidade Entrada
"""
from datetime import datetime
from typing import Any, Union

import peewee
from fastapi import APIRouter, HTTPException, Response

from ..models.entrada import atualiza_entrada, busca_entrada,cria_entrada, lista_entradas,delete_entrada
from pydantic import BaseModel
from pydantic.utils import GetterDict

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
            De-Para

            - **key**: a chave do objeto.
        """
        res = getattr(self._obj, key, default)
        if isinstance(res, peewee.ModelSelect):
            return list(res)
        return res

class EntradaModeloEntrada(BaseModel):
    """
        Modelo de entrada de dados de Entrada
    """
    nome:str
    descricao:Union[str,None]=None
    valor:float
    tipo_entrada:int
    usuario:int
     
    class Config:
        """
            Necessary config data.
        """ 
        schema_extra = {
            "example": {
                "nome": "Entrada Teste",
                "descricao": "Descrição da entrada teste",
                "valor": 150.00,
                "tipo_entrada":5,
                "usuario":2
            }
        }


class EntradaModeloEntradaUpdate(BaseModel):
    """
        Modelo de entrada de dados de Entrada
    """
    id:int
    nome:Union[None,str]=None
    descricao:Union[str,None]=None
    valor:Union[None,float]=None
    tipo_entrada:Union[None,int]=None
    usuario:Union[None,int]=None
     
    class Config:
        """
            Necessary config data.
        """ 
        schema_extra = {
            "example": {
                "nome": "Entrada Teste",
                "descricao": "Descrição da entrada teste",
                "valor": 150.00,
                "tipo_entrada":5,
                "usuario":2
            }
        }

class EntradaModeloSaida(BaseModel):
    """
        Modelo de saída de dados de Entrada
    """
    id:int
    nome:str
    descricao:str
    valor:float
    tipo_entrada:object
    usuario: object
    data_criacao: datetime
    data_alteracao: datetime
    ativo: bool

    class Config:
        """
            Necessary config data.
        """ 
        orm_mode = True
        getter_dict = PeeweeGetterDict


@router_entradas.get("/", response_model=list[EntradaModeloSaida], 
                          summary="Lista de entradas",
                          description="Retorna todas as entradas")
async def lista()->list[EntradaModeloSaida]:
    """
        Retorna todas os entradas
    """
    
    try: 
        return await lista_entradas()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_entradas.get("/view/{id}", response_model=EntradaModeloSaida, 
                        summary="Retorna uma única entrada")
async def busca(id: int) -> EntradaModeloSaida:
    """
        Consulta todos os dados de entrada

        - **id**: o id do entrada a ser consultado.
    """
    entrada = await busca_entrada(id=id)
    if entrada is None:
        raise HTTPException(status_code=404, detail="Entrada não encontrada.")

    return entrada

@router_entradas.post("/", response_model=EntradaModeloSaida, 
                            summary="Cria uma nova entrada")
async def cria(modelo: EntradaModeloEntrada)-> EntradaModeloSaida:
    """
        Criação de entrada.
    """
    try: 
        return await cria_entrada(modelo.nome,modelo.valor, modelo.tipo_entrada,
        modelo.usuario, modelo.descricao)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_entradas.put("/", response_model=EntradaModeloSaida, 
                          summary="Atualiza um entrada")
async def atualiza(modelo: EntradaModeloEntradaUpdate)-> EntradaModeloSaida:
    """
        Atualização de entrada
    """
    try: 
        return await atualiza_entrada(modelo.id, modelo.usuario, modelo.nome,
        modelo.valor, modelo.descricao, modelo.tipo_entrada) 
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_entradas.delete(
    "/remove/{id}",
    summary="Exclui uma entrada",
    response_class=Response,
    responses={
        200: {"description": "Entrada excluída com sucesso"},
        404: {"description": "Entrada não encontrada"},
    },
)

async def exclui(id: int):
    """
        Exclusão de entrada
    """
    del_entrada = delete_entrada(id)
    if del_entrada is None or del_entrada != 1:
        return Response(status_code=404)
    return Response(status_code=200)