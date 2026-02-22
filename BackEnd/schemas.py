from pydantic import BaseModel,ConfigDict
from typing import Optional


class User(BaseModel):
    name:str
    email:str
    password:str

class ShowUser (BaseModel):

    id: int
    name:str
    email:str  
    model_config = ConfigDict(from_attributes=True)

    
class Login(BaseModel):
    email:str
    password:str

class Token(BaseModel):
    access_token:str
    token_type:str