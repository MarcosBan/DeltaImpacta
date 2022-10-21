from datetime import datetime
from typing import Union
from peewee import *
from ..models.tipo_entrada import TipoEntrada
from ..models.usuario import Usuario
from .Base import BaseModel

class Entrada(BaseModel):
    id = PrimaryKeyField(null=False)
    nome = CharField(max_length=45)
    valor = FloatField()
    id_tipo_entrada = ForeignKeyField(TipoEntrada, backref='entradas')
    id_usuario = ForeignKeyField(Usuario, backref='entradas')
    descricao= CharField(max_length=100, null=True)
    data_criacao = DateTimeField(default=datetime.now())
    data_alteracao = DateTimeField(default=datetime.now())
    ativo = BitField(default=1)

    class Meta:
        db_table = 'entrada'

async def cria_entrada(nome: str, 
                        valor: float, 
                        id_tipo_entrada: int,
                        id_usuario: int,
                        descricao:str='',) -> Entrada:
    """
        Método de criação de entrada

        - **nome**: o nome da entrada. Texto
        - **valor**: o valor da entrada. Decimal
        - **id_tipo_entrada**: o id do tipo da entrada. Número
        - **id_usuário**: o id do usuário. Número
        - **descricao**: a descrição da entrada. Texto. Aceita vazio.
    """
    # old = Entrada.filter(Entrada.nome == nome & Entrada.tipo_entrada_id == tipo_entrada_id & Entrada.valor == valor & Entrada.data_criacao.month == datetime.now().month).first()
    # if old is not None:
    #     raise ValueError("Entrada already exists.")

    objeto_entrada = Entrada(
        valor=valor,
        id_tipo_entrada = id_tipo_entrada,
        id_usuario = id_usuario,
        nome=nome,
        descricao=descricao
    )
    objeto_entrada.save()
  
    return objeto_entrada

async def atualiza_entrada(id: int, 
                        id_usuario:int,
                        nome: Union[str, None]=None, 
                        valor: Union[float,None] = None,
                        descricao: Union[str, None]=None, 
                        id_tipo_entrada: Union[int,None]=None):
    itens_to_update = {}
    itens_to_update["nome"] = nome
    itens_to_update["descricao"] = descricao
    itens_to_update["valor"] = valor
    itens_to_update["id_tipo_entrada"] = id_tipo_entrada
    for key, value in itens_to_update.items():
        if(value == None):
            del itens_to_update[key]
    if(len(itens_to_update) == 0):
        raise ValueError("Entrada Inválida.")

    Entrada.update(itens_to_update).where(Entrada.id==id & Entrada.id_usuario == id_usuario).execute()
    old = Entrada.filter(Entrada.id == id & Entrada.id_usuario).first()
    if old is not None:
         raise ValueError("Entrada não encontrada.")
    return old     

def busca_entrada(id: int):
    return Entrada.filter(Entrada.id_entrada == id).first()

def lista_entradas(skip: int = 0, limit: int = 100)->list:
    return list(Entrada.select().offset(skip).limit(limit))

def delete_entrada(id: int):
    """
        Método de exclusão de entrada

        - **id**: o id da entrada. Número
    """
    return Entrada.update({"ativo":0}).where(Entrada.id==id).execute()
