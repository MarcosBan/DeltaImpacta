from peewee import *

#HOST = "delta-mysqlserver.mysql.database.azure.com"
HOST = "35.198.23.78"
#USER = "DeltaAdmin@delta-mysqlserver"
USER = "root"
#PASSWORD = "D3lt4T3e4m!"
PASSWORD = "!DtbD;02#eS" #"e4EyAPShpq"
PORT = "3306"
#DATABASE = 'budgettracker'
DATABASE = "deltabd-agoravai" #xWPAAVgWh1"

conn = MySQLDatabase(
    DATABASE, user=USER,
    password=PASSWORD,
    host=HOST
)
