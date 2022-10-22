from datetime import datetime
from peewee import *

from .Base import BaseModel

class TipoSaida(BaseModel):
    """
        Classe de modelo de Tipos de Saida, 
        com métodos de manipulação e persistência de dados

        - **id**: o id do tipo de saida. Número
        - **nome**: o nome de exibição do tipo de saida. Texto 41 caracteres.
        - **descricao**: a descricao do tipo de saida. Texto 100 caracteres.

    """
    id = PrimaryKeyField(null=False)
    nome = CharField(max_length=45, null=False)
    descricao= CharField(max_length=100, null=True)
    data_criacao = DateTimeField(default=datetime.now())
    data_alteracao = DateTimeField(default=datetime.now())
    ativo = BooleanField(default=True)
    
    class Meta:
        db_table = 'tipo_saida'

async def cria_tipo_saida(nome: str, descricao:str)->TipoSaida:
    """
        método de crição de tipo de saida.

        - **nome**: o nome de exibição do tipo de saida. Texto 41 caracteres.
        - **descricao**: a descricao do tipo de saida. Texto 100 caracteres.

    """
    
    old = TipoSaida.filter(TipoSaida.nome == nome & TipoSaida.ativo).first()
    if old is not None:
        raise ValueError("Tipo de Saida já existe.")

    if descricao.strip(' ') == '':
        descricao = None

    tipo_saida_object = TipoSaida(
        nome=nome,
        descricao=descricao
    )
    tipo_saida_object.save()
  
    return tipo_saida_object
 
async def busca_tipo_saida(id: int)->TipoSaida:
    """
        Método de busca por um único tipo de saida

        - **id**: o id do tipo de saida. Número
    """
    
    return TipoSaida.filter(TipoSaida.id == id).first()

async def lista_tipo_saidas(inclui_inativos:bool=False, 
skip: int = 0, limit: int = 100)->list[TipoSaida]:
    """
        Método de listagem de tipos de saida
    """
    
    if inclui_inativos:
        return list(TipoSaida.select().where(TipoSaida.ativo).offset(skip).limit(limit))
    
    return list(TipoSaida.select().offset(skip).limit(limit))

async def delete_tipo_saida(id: int):
    """
        Método de exclusão de tipo de saida

        - **id**: o id do tipo de saida. Número
    """
    return TipoSaida.update({"ativo":int(False)}).where(TipoSaida.id==id).execute()
  
