from datetime import timedelta,datetime,timezone
from jose import JWTError,jwt
from fastapi import Depends,HTTPException,status
from fastapi.security import OAuth2PasswordBearer

SECRET_KEY = "09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30


def create_access_token(data:dict,expires_delta:timedelta| None= None):
    to_encode=data.copy()
    if expires_delta:
        expire=datetime.now(timezone.utc)+ expires_delta
    else:
        expire= datetime.now(timezone.utc) + timedelta(minutes=15) 
    to_encode.update({"exp":expire})  
    encoded_jwt= jwt.encode(to_encode,SECRET_KEY,algorithm=ALGORITHM)
    return encoded_jwt

# oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")



# def get_current_user(token:str=Depends(oauth2_scheme)):
#     #decode the token
#     try:
#       payload= jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])
#       #get the user id
#       user_id=payload.get('sub')
#       #validate token data
#       if not user_id:
#          raise HTTPException(status_code=401 ,detail='invalid token')
#       return int(user_id)
    
#     except (JWTError, ValueError):
#      raise HTTPException(status_code=401, detail="Invalid token")


    
    
    



 


    
    
    



 
