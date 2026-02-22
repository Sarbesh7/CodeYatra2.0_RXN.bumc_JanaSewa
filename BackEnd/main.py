# from fastapi import FastAPI,Depends,HTTPException,status
# import models
# import Config, schemas, auth_token, hashing
# from sqlalchemy.orm import Session
# from datetime import timedelta
# from Config import engine, session
# from fastapi.security import OAuth2PasswordRequestForm





# app=FastAPI()
# models.Base.metadata.create_all(bind=engine)

# def get_db():
#     db =session()
#     try:
#         yield db
#     finally: 
#         db.close()



# @app.get("/")
# def greet():
#     return(" Welcome to JanaSewa")




# @app.post("/users",response_model=schemas.ShowUser,tags=['user'])
# def create_user(user:schemas.User ,db:Session=Depends(get_db)):
#     new_user= models.User(name=user.name, email=user.email, password=hashing.Hash.bcrypt(user.password))
#     db.add(new_user)
#     db.commit()
#     db.refresh(new_user)
#     return new_user


# @app.get("/all_users/")
# def get_all_users(db: Session = Depends(get_db)):
#     db_users= db.query(models.User).all()
#     return db_users



# @app.delete("/users/{id}", tags=['user'])    
# def delete_users(id: int,db: Session = Depends(get_db)):
#     db_user = db.query(models.User).filter(models.User.id == id).first()
#     if db_user:
#         db.delete(db_user)
#         db.commit()
#         return "deleted Successfully"
#     else:
#         raise HTTPException(status_code=404, detail="user not found")
    


# @app.post("/login",response_model=schemas.Token,tags=['login'])
# def login_user(request:schemas.Login ,db:Session=Depends(get_db)):
#     user= db.query(models.User).filter(models.User.email == request.email).first()
#     if not user:
#         raise HTTPException(status_code=404,detail="user not found")
    
#     if not hashing.Hash.verify(user.password,request.password):
#           raise HTTPException(status_code=401,detail="Invalid Password")
    

#     access_token=auth_token.create_access_token(
#         data={'sub':str(user.id)},expires_delta= timedelta(minutes=15)
#         )
#     return {
#         "access_token": access_token,
#         "token_type": "bearer"
#     }


# @app.post("/token",response_model=schemas.Token,tags=['login'])
# def login_for_services(form_data:OAuth2PasswordRequestForm=Depends() ,db:Session=Depends(get_db)):
#     user= db.query(models.User).filter(models.User.email == form_data.username).first()
#     if not user:
#         raise HTTPException(status_code=404,detail="user not found")
    
#     if not hashing.Hash.verify(user.password,form_data.password):
#         raise HTTPException(status_code=401,detail="Invalid Password")
    

#     access_token=auth_token.create_access_token(
#         data={'sub':str(user.id)},expires_delta= timedelta(minutes=15)
#         )
#     return {
#         "access_token": access_token,
#         "token_type": "bearer"
#     }

# @app.get("/me", response_model=schemas.ShowUser, tags=['user'])
# def get_current_user_info(current_user_id: int = Depends(get_current_user), db: Session = Depends(get_db)):
#     user = db.query(models.User).filter(models.User.id == current_user_id).first()
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")
#     return user


from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import timedelta
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

import models
import schemas
import hashing
import auth_token
import Config

from Config import engine, sessionmaker


# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="JanaSewa API",
    description="E-Governance Backend System",
    version="1.0.0"
)


# ==========================
# DATABASE DEPENDENCY
# ==========================
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==========================
# OAUTH2 SETUP
# ==========================
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")


# ==========================
# GET CURRENT USER
# ==========================
def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):

    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    token_data = auth_token.verify_token(token, credentials_exception)

    user = db.query(models.User).filter(models.User.id == int(token_data.id)).first()

    if user is None:
        raise credentials_exception

    return user


# ==========================
# ROOT
# ==========================
@app.get("/")
def greet():
    return {"message": "Welcome to JanaSewa 🚀"}


# ==========================
# CREATE USER
# ==========================
@app.post("/users", response_model=schemas.ShowUser, tags=["User"])
def create_user(user: schemas.User, db: Session = Depends(get_db)):

    # Check duplicate email
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    new_user = models.User(
        name=user.name,
        email=user.email,
        password=hashing.Hash.bcrypt(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ==========================
# GET ALL USERS (Protected)
# ==========================
@app.get("/users", response_model=List[schemas.ShowUser], tags=["User"])
def get_all_users(
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    users = db.query(models.User).all()
    return users


# ==========================
# DELETE USER (Protected)
# ==========================
@app.delete("/users/{id}", tags=["User"])
def delete_user(
    id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):

    user = db.query(models.User).filter(models.User.id == id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}


# ==========================
# LOGIN (OAuth2 Standard)
# ==========================
@app.post("/login", response_model=schemas.Token, tags=["Authentication"])
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    user = db.query(models.User).filter(models.User.email == form_data.username).first()

    if not user or not hashing.Hash.verify(user.password, form_data.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )

    access_token = auth_token.create_access_token(
        data={"sub": str(user.id)},
        expires_delta=timedelta(minutes=Config.ACCESS_TOKEN_EXPIRE_MINUTES)
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }



