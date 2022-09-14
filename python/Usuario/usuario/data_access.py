import os
import mysql.connector


class Database():
  
  mydb = mysql.connector.connect(
  host = "localhost",
  user = "username",
  password = "password",
  database = "database_name") 
  
  def execute_non_query(self, statement):
    mycursor = self.mydb.cursor()
    mycursor.executemany(statement)
    self.mydb.commit()
    self.mydb.close()

    return "ok"

  def execute_query(self, query):
    mycursor = self.mydb.cursor()
    mycursor.execute(query)
    myresult = mycursor.fetchall()
    self.mydb.close()
    return myresult