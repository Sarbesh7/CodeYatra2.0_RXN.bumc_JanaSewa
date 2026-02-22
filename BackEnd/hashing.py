import bcrypt


class Hash():
    @staticmethod
    def bcrypt(password:str):
      password_bytes= password[:72].encode('utf-8')
      hashed= bcrypt.hashpw(password_bytes,bcrypt.gensalt())
      return hashed.decode('utf-8') 
    


    @staticmethod
    def verify(hashed_password,plain_password):
       plain_password_bytes=plain_password[:72].encode('utf-8')
       return bcrypt.checkpw(plain_password_bytes,hashed_password.encode('utf-8'))
