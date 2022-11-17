"""
    Métodos de rota da entidade TipoEntrada
"""
from datetime import datetime
from typing import Any, List
import peewee
from fastapi import APIRouter, HTTPException, Response
from ..models.tipo_entrada import TipoEntrada, busca_tipo_entrada, cria_tipo_entrada, delete_tipo_entrada, lista_tipo_entradas
from pydantic import BaseModel
from pydantic.utils import GetterDict

router_tipo_entradas = APIRouter(
    prefix="/tipoentradas",
    tags=["tipo de entradas"]
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

class TipoEntradaModeloEntrada(BaseModel):
    """
        Modelo de entrada de dados de TipoEntrada.
    """
    nome:str
    descricao:str
    
    class Config:
        """
            Necessary config data.
        """ 
        schema_extra = {
            "example": {
                "nome": "Nome do tipo de entrada",
                "descricao": "Descrição detalhada do tipo de entrada."
            }
        }

class TipoEntradaModeloSaida(TipoEntradaModeloEntrada):
    """
        Modelo de retorno de dados de TipoEntrada
    """
    id:int
    data_criacao:datetime
    data_alteracao:datetime
    ativo:bool
    
    class Config:
        """
            Necessary config data.
        """ 
        orm_mode = True
        getter_dict = PeeweeGetterDict


@router_tipo_entradas.get("/", response_model=List[TipoEntradaModeloSaida], summary="List of entradas",
                     description="Retorna todos os tipos de entradas")
async def lista(inclui_inativos:bool=False) -> list[TipoEntrada]:
    """
        Lista todos os tipos de entrada
    """
    return await lista_tipo_entradas(inclui_inativos)


@router_tipo_entradas.get("/view/{id}"
                        , response_model=TipoEntradaModeloSaida
                        , summary="Retorna um único tipo de entrada.")
async def busca(id: int) -> TipoEntradaModeloSaida:
    """
        Retorna um único tipo de entrada

        - **id**: o id do tipo de entrada. Número
    """
    entrada = await busca_tipo_entrada(id=id)
    if entrada is None:
        raise HTTPException(status_code=404, detail="TipoEntrada não encontrado.")

    return entrada


@router_tipo_entradas.post("/", 
                        response_model=TipoEntradaModeloSaida, 
                        summary="Cria um novo tipo de entrada.")
async def cria(model: TipoEntradaModeloEntrada)-> TipoEntradaModeloSaida:
    """
        Cria um novo tipo de entrada.
    """
    try: 
        return await cria_tipo_entrada(nome=model.nome, descricao=model.descricao)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router_tipo_entradas.delete(
    "/remove/{id}",
    summary="Deleta um tipo de entrada.",
    response_class=Response,
    responses={
        200: {"description": "TipoEntrada excluído com sucesso."},
        404: {"description": "TipoEntrada não encontrado."},
    },
)
async def remove(id: int):
    """
        Deleta um tipo de entrada.

        - **id**: o id do tipo de entrada. Número
    """
    delete = await delete_tipo_entrada(id)
    if delete is None or delete == 0:
        return Response(status_code=404)
    return Response(status_code=200)