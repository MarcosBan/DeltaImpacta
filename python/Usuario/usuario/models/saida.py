from datetime import datetime
from typing import Union
from peewee import *
from ..models.tipo_saida import TipoSaida
from ..models.usuario import Usuario
from .Base import BaseModel

class Saida(BaseModel):
    id = PrimaryKeyField(null=False)
    nome = CharField(max_length=45)
    valor = FloatField()
    tipo_saida = ForeignKeyField(TipoSaida,backref="saidas", lazy_load=False)
    usuario = ForeignKeyField(Usuario,backref="saidas", lazy_load=False)
    descricao= CharField(max_length=100, null=True)
    data_criacao = DateTimeField(default=datetime.now())
    data_alteracao = DateTimeField(default=datetime.now())
    ativo = BooleanField(default=True)

    class Meta:
        db_table = 'saida'

async def cria_saida(nome: str, 
                        valor: float, 
                        id_tipo_saida: int,
                        id_usuario: int,
                        descricao:str='',) -> Saida:
    """
        Método de criação de saida

        - **nome**: o nome da saida. Texto
        - **valor**: o valor da saida. Decimal
        - **id_tipo_saida**: o id do tipo da saida. Número
        - **id_usuário**: o id do usuário. Número
        - **descricao**: a descrição da saida. Texto. Aceita vazio.
    """
    # old = Saida.filter(Saida.nome == nome & Saida.tipo_saida_id == tipo_saida_id & Saida.valor == valor & Saida.data_criacao.month == datetime.now().month).first()
    # if old is not None:
    #     raise ValueError("Saida already exists.")

    objeto_saida = Saida(
        valor=valor,
        tipo_saida = id_tipo_saida,
        usuario = id_usuario,
        nome=nome,
        descricao=descricao
    )
    objeto_saida.save()
  
    return objeto_saida

async def atualiza_saida(id: int, 
                        id_usuario:int,
                        nome: Union[str, None]=None, 
                        valor: Union[float,None] = None,
                        descricao: Union[str, None]=None, 
                        id_tipo_saida: Union[int,None]=None):
    itens_to_update = {}
    itens_to_update["nome"] = nome
    itens_to_update["descricao"] = descricao
    itens_to_update["valor"] = valor
    itens_to_update["tipo_saida"] = id_tipo_saida
    for key, value in itens_to_update.items():
        if(value == None):
            del itens_to_update[key]
    if(len(itens_to_update) == 0):
        raise ValueError("Saida Inválida.")

    Saida.update(itens_to_update).where(Saida.id==id & Saida.id_usuario == id_usuario).execute()
    old = Saida.filter(Saida.id == id & Saida.id_usuario).first()
    if old is not None:
         raise ValueError("Saida não encontrada.")
    return old     

async def busca_saida(id: int):
    return Saida.filter(Saida.id == id).first()

async def lista_saidas(skip: int = 0, limit: int = 100)->list:
    return list(Saida.select().offset(skip).limit(limit))

async def delete_saida(id: int):
    """
        Método de exclusão de saida

        - **id**: o id da saida. Número
    """
    return Saida.update({"ativo":False}).where(Saida.id==id).execute()
