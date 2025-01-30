import os
from dotenv import load_dotenv
from fastapi import FastAPI, Depends, HTTPException, Security
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models, schemas
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Optional
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials, OAuth2PasswordRequestForm

# Load environment variables from .env file
load_dotenv()

app = FastAPI()

models.Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# JWT authentication setup
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES"))

oauth2_scheme = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: HTTPAuthorizationCredentials = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        print(f"🔹 Received Token: {token.credentials}")  # Debugging

        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        print(f"✅ Decoded Payload: {payload}")  # Debugging

        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token (no subject)")

        user = db.query(models.User).filter(models.User.username == username).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user
    except JWTError as e:
        print(f"❌ JWT Error: {e}")  # Debugging
        raise HTTPException(status_code=401, detail="Could not validate credentials")

@app.get("/")
def home():
    return {"message": "Welcome to PocketBuddy API"}

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    db_user = models.User(username=user.username, email=user.email, password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    if isinstance(user_id, str) and user_id == "me":
        raise HTTPException(status_code=400, detail="Invalid user ID")
        
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}
