from peewee import *

#HOST = "delta-mysqlserver.mysql.database.azure.com"
HOST = "remotemysql.com"
#USER = "DeltaAdmin@delta-mysqlserver"
USER = "9gh33Y1Tqh"
#PASSWORD = "D3lt4T3e4m!"
PASSWORD = "HVcIVr35dF" #"e4EyAPShpq"
PORT = "3306"
#DATABASE = 'budgettracker'
DATABASE = "9gh33Y1Tqh" #xWPAAVgWh1"

conn = MySQLDatabase(
    DATABASE, user=USER,
    password=PASSWORD,
    host=HOST
)