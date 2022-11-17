"""
    Métodos de banco de dados para usuario
"""
from datetime import datetime
from typing import Union
from peewee import *
from .Base import BaseModel

class Usuario(BaseModel):
    """
        Classe de modelo de usuário, 
        com métodos de manipulação e persistência de dados

        - **id**: o id do usuário. Número
        - **nome**: o nome de exibição do usuário. Texto 41 caracteres.
        - **email**: o email  do usuário. Texto 41 caracteres.
        - **senha**: a senha  do usuário. Texto 41 caracteres.

    """
    id = PrimaryKeyField(null=False)
    nome = CharField(max_length=41, null=False)
    email = CharField(max_length=41, null=False)
    senha = CharField(max_length=50, null=False)
    nascimento = IntegerField()
    data_criacao = DateTimeField(default=datetime.now())
    data_alteracao = DateTimeField(default=datetime.now())
    ativo = BooleanField(default=True)

    class Meta:
        db_table = 'usuario'

async def cria_usuario(nome: str, email: str, senha: str, nascimento: int):
    
    old = Usuario.filter(Usuario.email == email and Usuario.ativo).first()
    if old is not None:
        raise ValueError("Email já existe.")

    objeto_usuario = Usuario(
        nome=nome,
        email=email,
        senha = senha,
        nascimento = nascimento
    )
    objeto_usuario.save()
  
    return objeto_usuario

async def busca_usuario(id: int)-> Usuario:
    return Usuario.filter(Usuario.id == id).first()

async def lista_usuarios(skip: int = 0, limit: int = 100)->list[Usuario]:
    return list(Usuario.select().offset(skip).limit(limit))

async def delete_usuario(id: int):
    return Usuario.update({"ativo":0}).where(Usuario.id==id).execute()
  
async def atualiza_usuario(id: int, 
                        nome: Union[str, None]=None, 
                        email: Union[str,None] = None,
                        senha: Union[str,None]=None,
                        nascimento: Union[int,None]= None) -> Usuario:
    itens_to_update = {}
    itens_to_update["nome"] = nome
    itens_to_update["email"] = email
    itens_to_update["senha"] = senha
    itens_to_update["nascimento"] = nascimento
    iterator = itens_to_update.copy()
    for key, value in iterator.items():
        if(value is None):
            del itens_to_update[key]
    if(len(itens_to_update) == 0):
        raise ValueError("Usuário inválido.")

    ret = Usuario.update(itens_to_update).where(Usuario.id==id).execute()
    if ret != 1:
        raise Exception("Não foi possível atualizar.")

    old = Usuario.filter(Usuario.id).first()
    if old is None:
         raise ValueError("Usuário não encontrado.")
    return old     
