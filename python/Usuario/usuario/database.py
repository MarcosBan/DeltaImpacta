from peewee import *

#HOST = "delta-mysqlserver.mysql.database.azure.com"
HOST = "delta-mysqlserver.mysql.database.azure.com"
#USER = "DeltaAdmin@delta-mysqlserver"
USER = "DeltaAdmin@delta-mysqlserver"
#PASSWORD = "D3lt4T3e4m!"
PASSWORD = "D3lt4T3e4m!" #"e4EyAPShpq"
PORT = "3306"
#DATABASE = 'budgettracker'
DATABASE = "budgettrackerdb" #xWPAAVgWh1"

conn = MySQLDatabase(
    DATABASE, user=USER,
    password=PASSWORD,
    host=HOST
)
