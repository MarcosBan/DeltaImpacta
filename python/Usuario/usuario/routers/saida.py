"""
    Métodos relacionados à rota de Saida.
"""
from typing import Any, List

import peewee
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from pydantic.utils import GetterDict

from ..models.saida import busca_saida, cria_saida, lista_saidas, atualiza_saida

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
            de-para de model para dtos

            - **key**: The object's key.
        """
        res = getattr(self._obj, key, default)
        if isinstance(res, peewee.ModelSelect):
            return list(res)
        return res

class SaidaInModel(BaseModel):
    """
        Model para saida de dados de Saida.
    """
    id:int=0
    nome:str
    descricao:str=""
    valor:float
    id_tipo_saida:int
    id_usuario:int

class SaidaOutModel(SaidaInModel):
    """
        Model para retorno de dados de Saida.
    """
    id:int
    tipo_saida:str

    class Config:
        """
            Necessary config data.
        """ 
        orm_mode = True
        getter_dict = PeeweeGetterDict


@router_saidas.get("/", 
                        response_model=List[SaidaOutModel], 
                        summary="Lista todas as saidas",
                        description="Lista todas as saidas")
def lista() -> list[SaidaOutModel]:
    """
        Lista todas as saidas
    """
    return lista_saidas()


@router_saidas.get("/view/{id}", 
                    response_model=SaidaOutModel,
                    summary="Busca uma única saida.")
async def busca(id: int) -> SaidaOutModel:
    """
        Busca uma única saida.

        - **id**: o id da saida. Número.
    """
    saida = busca_saida(id=id)
    if saida is None:
        raise HTTPException(status_code=404, detail="Saida not found")

    return saida


@router_saidas.post("/",  
                        response_model=SaidaOutModel, 
                        summary="Cria uma nova saida.")
async def cria(model: SaidaInModel)-> SaidaOutModel:
    """
        Cria uma nova saida.
    """
    try: 
        return await cria_saida(
                        id_usuario=model.id_usuario,
                        nome = model.nome, 
                        valor=model.valor,
                        descricao=model.descricao,
                        id_tipo_saida=model.id_tipo_saida)
        
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_saidas.put("/", response_model=SaidaOutModel, 
                        summary="Atualiza detalhes da saida.")
async def update(model: SaidaInModel)-> SaidaOutModel:
    """
        Atualiza detalhes da saida.
    """
    try: 
        return await atualiza_saida(id = model.id, 
                        id_usuario=model.id_usuario,
                        nome = model.nome, 
                        valor=model.valor,
                        descricao=model.descricao,
                        id_tipo_saida=model.id_tipo_saida)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


# @router_saidas.delete(
#     "/remove/{id}",
#     summary="Delete an individual saida",
#     response_class=Response,
#     responses={
#         200: {"description": "Saida successfully deleted"},
#         404: {"description": "Saida not found"},
#     },
# )

# async def remove_saida(id: int):
#     del_saida = delete_saida(id)
#     if del_saida is None:
#         return Response(status_code=404)
#     return Response(status_code=200)