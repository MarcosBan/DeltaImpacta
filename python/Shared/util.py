import re

@staticmethod
    def sanitize(value:str)->str:
        sanitize_caracter_japanese=re.compile(u'[\u064B-\u0652\u06D4\u0670\u0674\u06D5-\u06ED*$&¨#%=!^]+', re.UNICODE)
        return sanitize_caracter_japanese.sub('',value.strip())
        
    @classmethod
    def sanitize_dict(cls, dic:dict) -> dict:
        dic_copy = dic.copy()
        for key, value in dic_copy.items():
            if type(value) == str:
                dic[key] =  cls.sanitize(value)
            if type(value) == list:
                dic[key] =  cls.sanitize_list(value)
            if type(value) == dict:
                dic[key] =  cls.sanitize_dict(value)
        return dic

    @classmethod
    def sanitize_list(cls, object:list) -> list:
        list_sanitized=[]
        for value in object:
            if type(value) == str:
                list_sanitized.append(cls.sanitize(value))
            if type(value) == dict:
                list_sanitized.append(cls.sanitize_dict(value))
        return  list_sanitized