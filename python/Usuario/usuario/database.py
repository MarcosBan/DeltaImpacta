from peewee import *

#HOST = "delta-mysqlserver.mysql.database.azure.com"
HOST = "useful-figure-363814:southamerica-east1:deltabd-agoravai"
#USER = "DeltaAdmin@delta-mysqlserver"
USER = "root"
#PASSWORD = "D3lt4T3e4m!"
PASSWORD = "root" #"e4EyAPShpq"
PORT = "3306"
#DATABASE = 'budgettracker'
DATABASE = "deltabd-agoravai" #xWPAAVgWh1"

conn = MySQLDatabase(
    DATABASE, user=USER,
    password=PASSWORD,
    host=HOST
)
