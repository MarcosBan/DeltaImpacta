"""
    Métodos de rota da entidade Saida
"""
from datetime import datetime
from typing import Any, Union

import peewee
from fastapi import APIRouter, HTTPException, Response

from ..models.saida import atualiza_saida, busca_saida,cria_saida, lista_saidas,delete_saida
from pydantic import BaseModel
from pydantic.utils import GetterDict

router_saidas = APIRouter(
    prefix="/saidas",
    tags=["saidas"]
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

class SaidaModeloEntrada(BaseModel):
    """
        Modelo de entrada de dados de Saida
    """
    nome:str
    descricao:Union[str,None]=None
    valor:float
    tipo_saida:int
    usuario:int
     
    class Config:
        """
            Necessary config data.
        """ 
        schema_extra = {
            "example": {
                "nome": "Saida Teste",
                "descricao": "Descrição da saida teste",
                "valor": 150.00,
                "tipo_saida":5,
                "usuario":2
            }
        }


class SaidaModeloEntradaUpdate(BaseModel):
    """
        Modelo de entrada de dados de Saida por atualização
    """
    id:int
    nome:Union[None,str]=None
    descricao:Union[str,None]=None
    valor:Union[None,float]=None
    tipo_saida:Union[None,int]=None
    usuario:Union[None,int]=None
     
    class Config:
        """
            Necessary config data.
        """ 
        schema_extra = {
            "example": {
                "nome": "Saida Teste",
                "descricao": "Descrição da saida teste",
                "valor": 150.00,
                "tipo_saida":5,
                "usuario":2
            }
        }

class SaidaModeloSaida(BaseModel):
    """
        Modelo de saída de dados de Saida
    """
    id:int
    nome:str
    descricao:str
    valor:float
    tipo_saida:object
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


@router_saidas.get("/", response_model=list[SaidaModeloSaida], 
                          summary="Lista de saidas",
                          description="Retorna todas as saidas")
async def lista()->list[SaidaModeloSaida]:
    """
        Retorna todas os saidas
    """
    
    try: 
        return await lista_saidas()
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_saidas.get("/view/{id}", response_model=SaidaModeloSaida, 
                        summary="Retorna uma única saida")
async def busca(id: int) -> SaidaModeloSaida:
    """
        Consulta todos os dados de saida

        - **id**: o id do saida a ser consultado.
    """
    saida = await busca_saida(id=id)
    if saida is None:
        raise HTTPException(status_code=404, detail="Saida não encontrada.")

    return saida

@router_saidas.post("/", response_model=SaidaModeloSaida, 
                            summary="Cria uma nova saida")
async def cria(modelo: SaidaModeloEntrada)-> SaidaModeloSaida:
    """
        Criação de saida.
    """
    try: 
        return await cria_saida(modelo.nome,modelo.valor, modelo.tipo_saida,
        modelo.usuario, modelo.descricao)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_saidas.put("/", response_model=SaidaModeloSaida, 
                          summary="Atualiza um saida")
async def atualiza(modelo: SaidaModeloEntradaUpdate)-> SaidaModeloSaida:
    """
        Atualização de saida
    """
    try: 
        return await atualiza_saida(modelo.id, modelo.usuario, modelo.nome,
        modelo.valor, modelo.descricao, modelo.tipo_saida) 
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_saidas.delete(
    "/remove/{id}",
    summary="Exclui uma saida",
    response_class=Response,
    responses={
        200: {"description": "Saida excluída com sucesso"},
        404: {"description": "Saida não encontrada"},
    },
)

async def exclui(id: int):
    """
        Exclusão de saida
    """
    del_saida = delete_saida(id)
    if del_saida is None or del_saida != 1:
        return Response(status_code=404)
    return Response(status_code=200)