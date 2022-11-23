from peewee import *

#HOST = "delta-mysqlserver.mysql.database.azure.com"
HOST = "34.29.12.55"
#USER = "DeltaAdmin@delta-mysqlserver"
USER = "root"
#PASSWORD = "D3lt4T3e4m!"
PASSWORD = "6mX-^|(XxhQQs|<8" #"e4EyAPShpq"
PORT = "3306"
#DATABASE = 'budgettracker'
DATABASE = "deltateamdb" #xWPAAVgWh1"

conn = MySQLDatabase(
    DATABASE, user=USER,
    password=PASSWORD,
    host=HOST
)
