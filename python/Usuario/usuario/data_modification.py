import datetime


async def format_search_params(search_params):
    search_params_dict = {}
    for chave, valor in search_params.items():
            if(not valor or valor.strip() == ""):
                continue
            
            if(type(valor) is str):
                if(chave.__contains__("_date")):
                    formated_date = datetime.strptime(valor, "%Y-%m-%d %H:%M:%S")
                    if(chave.__contains__("start_")):
                        search_params_dict[chave.strip("start_")] = f">= {formated_date} AND "
                    elif(chave.__contains__("end_")):
                        search_params_dict[chave.strip("end_")] +=  f"> {formated_date}"
                    else:
                        search_params_dict[chave] = f"= {formated_date}"
                else:
                    search_params_dict[chave]= f"= {valor}"
            elif(type(valor) is int or type(valor) is float):
                search_params_dict[chave] = f"= {valor}"
            else:
                raise Exception(f"Parameter data {chave} is not in an acceptable format. Please send it as an integer, a text or a float valor.")
    return search_params_dict

async def format_content_params(content_params):
    dic = {}
    for chave, valor in content_params.items():
            if(not valor or valor.strip() == ""):
                continue

            if(type(valor) is str):
                if(chave.__contains__("_date")):
                    formated_date = datetime.strptime(valor, "%Y-%m-%d %H:%M:%S")
                    dic[chave] = f"= {formated_date}"
                else:
                    dic[chave]= f"= {valor}"
            elif(type(valor) is int or type(valor) is float):
                dic[chave] = f"= {valor}"
            else:
                raise Exception(f"Parameter data {chave} is not in an acceptable format. Please send it as an integer, a text or a float valor.")
    return dic

async def format_query(table_name, query_params, query_type):
    query_select = f"Select * from {table_name} where "
    query_insert = f"insert into {table_name} "
    insert_order = ""
    query_update = f"update {table_name} set "
    condicoes = {}
    condicoes_query = ""
    conteudo = {}
    conteudo_query = ""
    try:
        if(query_type == "update" or query_type == "select"):
            if(not query_params["condicoes"]):
                raise Exception("Não foi possível localizar as condições da consulta. Analise seus dados e tente novamente.")
        if(query_type == "update" or query_type == "insert"):
            if(not query_params["conteudo"]):
                raise Exception("Não foi possível localizar o conteudo da consulta. Analise seus dados e tente novamente.")

        if(query_type == "update" or query_type == "select"):
            condicoes = query_params["condicoes"]                
            for chave, valor in condicoes.items():
                if(len(condicoes_query)> 0 ):
                    condicoes_query += " AND "
                condicoes_query += f"({chave} {valor})" 
        
        if(query_type == "update" or query_type == "insert"):
            conteudo = query_params["conteudo"]                
            for chave, valor in conteudo.items():
                if(len(conteudo_query)> 0 ):
                    conteudo_query += " AND "
                    insert_order += ", "
                insert_order += {chave}
                conteudo_query += f"({chave} {valor})" 
        
        if(query_type == "update"):
            return f"{query_update}{conteudo_query} WHERE {condicoes_query}"
    
        if(query_type == "insert"):
            return f"{query_insert}({insert_order}) VALUES ({conteudo_query})"
    
        if(query_type == "select"):
            return f"{query_select}{condicoes_query}"
        
    except Exception as e:
        raise Exception(f"error on format_query: {e}.")


