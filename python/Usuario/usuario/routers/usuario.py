"""
    Métodos de rota da entidade Usuario
"""
from datetime import datetime
from typing import Any, Union

import peewee
from fastapi import APIRouter, HTTPException, Response
from ..models.usuario import atualiza_usuario, busca_usuario,cria_usuario, lista_usuarios,delete_usuario
from pydantic import BaseModel
from pydantic.utils import GetterDict
import hashlib

router_usuarios = APIRouter(
    prefix="/usuarios",
    tags=["usuarios"]
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

class UsuarioModeloEntrada(BaseModel):
    """
        Modelo de entrada de dados de Usuario
    """
    nome: str
    email: str
    senha: str
    nascimento:int
     
    class Config:
        """
            Necessary config data.
        """ 
        schema_extra = {
            "example": {
                "id": 0,
                "nome": "Nome Teste",
                "email": "teste@teste.com",
                "senha": "1SenhaMuitoDificil!",
                "nascimento": 19000101 
            }
        }


class UsuarioModeloEntradaUpdate(BaseModel):
    """
        Modelo de entrada de dados de Usuario
    """
    id: int
    nome: Union[None,str]=None
    email: Union[None,str]=None
    senha: Union[None,str]=None
    nascimento:Union[None,int]=None
     
    class Config:
        """
            Necessary config data.
        """ 
        schema_extra = {
            "example": {
                "id": 0,
                "nome": "Nome Teste",
                "email": "teste@teste.com",
                "senha": "1SenhaMuitoDificil!",
                "nascimento": 19000101 
            }
        }

class UsuarioModeloSaida(BaseModel):
    """
        Model to output of usuario data.
    """
    id: str
    nome: str
    email: str
    nascimento: int
    data_criacao: datetime
    data_alteracao: datetime
    ativo: bool

    class Config:
        """
            Necessary config data.
        """ 
        orm_mode = True
        getter_dict = PeeweeGetterDict


@router_usuarios.get("/", response_model=list[UsuarioModeloSaida], 
                          summary="Lista de usuários",
                          description="Retorno todos os usuários")
async def lista()->list[UsuarioModeloSaida]:
    """
        Retorna todos os usuários
    """
    return await lista_usuarios()


@router_usuarios.get("/view/{id}", response_model=UsuarioModeloSaida, 
                        summary="Retorna um único usuário")
async def busca(id: int) -> UsuarioModeloSaida:
    """
        Consulta todos os dados do usuário

        - **id**: o id do usuário a ser consultado.
    """
    usuario = busca_usuario(id=id)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario não encontrado.")

    return usuario

async def login(email: str, senha:str) -> UsuarioModeloSaida:
    """
        Valida Email e senha do usuário.
        - **email**: o email  do usuário. Texto 41 caracteres.
        - **senha**: a senha  do usuário. Texto 41 caracteres.
    """
    usuario = busca_usuario(email=email)
    if usuario is None:
        raise HTTPException(status_code=404, detail="Usuario não encontrado.")
    if hashlib.sha256(senha.encode('utf-8')).hexdigest() != usuario.senha:
        raise HTTPException(status_code=400, detail="Senha inválida.")
    return usuario

@router_usuarios.post("/", response_model=UsuarioModeloSaida, 
                            summary="Cria um novo usuário")
async def cria(usuario: UsuarioModeloEntrada)-> UsuarioModeloSaida:
    """
        Criação de usuário.
    """
    try: 
        return await cria_usuario(nome=usuario.nome, 
                                    email=usuario.email, 
                                    nascimento=usuario.nascimento, 
                                    senha=usuario.senha)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_usuarios.put("/", response_model=UsuarioModeloSaida, 
                          summary="Atualiza um usuário")
async def atualiza(usuario: UsuarioModeloEntradaUpdate)-> UsuarioModeloSaida:
    """
        Atualização de usuário
    """
    try: 
        return await atualiza_usuario(id=usuario.id, 
                                    nome=usuario.nome, 
                                    email=usuario.email, 
                                    nascimento=usuario.nascimento,
                                    senha=usuario.senha)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router_usuarios.delete(
    "/remove/{id}",
    summary="Exclui um usuário",
    response_class=Response,
    responses={
        200: {"description": "Usuario excluído com sucesso"},
        404: {"description": "Usuario não encontrado"},
    },
)

async def exclui(id: int):
    """
        Exclusão de usuário
    """
    del_usuario = delete_usuario(id)
    if del_usuario is None or del_usuario != 1:
        return Response(status_code=404)
    return Response(status_code=200)