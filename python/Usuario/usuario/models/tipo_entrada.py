from datetime import datetime
from peewee import *

from .Base import BaseModel

class TipoEntrada(BaseModel):
    """
        Classe de modelo de Tipos de Entrada, 
        com métodos de manipulação e persistência de dados

        - **id**: o id do tipo de entrada. Número
        - **nome**: o nome de exibição do tipo de entrada. Texto 41 caracteres.
        - **descricao**: a descricao do tipo de entrada. Texto 100 caracteres.

    """
    id = PrimaryKeyField(null=False)
    nome = CharField(max_length=45, null=False)
    descricao= CharField(max_length=100, null=True)
    data_criacao = DateTimeField(default=datetime.now())
    data_alteracao = DateTimeField(default=datetime.now())
    ativo = BooleanField(default=True)
    
    class Meta:
        db_table = 'tipo_entrada'

async def cria_tipo_entrada(nome: str, descricao:str)->TipoEntrada:
    """
        método de crição de tipo de entrada.

        - **nome**: o nome de exibição do tipo de entrada. Texto 41 caracteres.
        - **descricao**: a descricao do tipo de entrada. Texto 100 caracteres.

    """
    
    old = TipoEntrada.filter(TipoEntrada.nome == nome & TipoEntrada.ativo).first()
    if old is not None:
        raise ValueError("Tipo de Entrada já existe.")

    if descricao.strip(' ') == '':
        descricao = None

    tipo_entrada_object = TipoEntrada(
        nome=nome,
        descricao=descricao
    )
    tipo_entrada_object.save()
  
    return tipo_entrada_object
 
async def busca_tipo_entrada(id: int)->TipoEntrada:
    """
        Método de busca por um único tipo de entrada

        - **id**: o id do tipo de entrada. Número
    """
    
    return TipoEntrada.filter(TipoEntrada.id == id).first()

async def lista_tipo_entradas(inclui_inativos:bool=False, 
skip: int = 0, limit: int = 100)->list[TipoEntrada]:
    """
        Método de listagem de tipos de entrada
    """
    
    if inclui_inativos:
        return list(TipoEntrada.select().where(TipoEntrada.ativo).offset(skip).limit(limit))
    
    return list(TipoEntrada.select().offset(skip).limit(limit))

async def delete_tipo_entrada(id: int):
    """
        Método de exclusão de tipo de entrada

        - **id**: o id do tipo de entrada. Número
    """
    return TipoEntrada.update({"ativo":-1}).where(TipoEntrada.id==id).execute()
  
