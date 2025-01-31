import os
from decimal import Decimal
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
from fastapi.middleware.cors import CORSMiddleware

# Load environment variables
load_dotenv()

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
    expose_headers=["*"],  
)

# Ensure MySQL tables are created
models.Base.metadata.create_all(bind=engine)

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

# JWT authentication setup
SECRET_KEY = str(os.getenv("SECRET_KEY", "fallback_secret"))
REFRESH_SECRET_KEY = str(os.getenv("REFRESH_SECRET_KEY", "fallback_refresh_secret"))
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 15))
REFRESH_TOKEN_EXPIRE_DAYS = int(os.getenv("REFRESH_TOKEN_EXPIRE_DAYS", 7))

oauth2_scheme = HTTPBearer()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta if expires_delta else timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)

# Database session dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# User authentication
def get_current_user(token: HTTPAuthorizationCredentials = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(token.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")

        user = db.query(models.User).filter(models.User.username == username).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        return user
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# API Routes
@app.get("/")
def home():
    return {"message": "Welcome to PocketBuddy API"}

@app.post("/users/", response_model=schemas.UserResponse)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(models.User).filter(models.User.email == user.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_password = hash_password(user.password)
    db_user = models.User(username=user.username, email=user.email, password=hashed_password, budget=Decimal("0"))
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.get("/users/me", response_model=schemas.UserResponse)
def read_users_me(current_user: models.User = Depends(get_current_user)):
    return current_user

@app.get("/users/{user_id}", response_model=schemas.UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

# Get User Budget
@app.get("/budget/")
def get_budget(current_user: models.User = Depends(get_current_user)):
    return {"budget": float(current_user.budget)}

# Update Budget (Fixing Decimal Conversion)
@app.put("/set-budget/")
def set_budget(
    budget_update: schemas.BudgetUpdate, 
    current_user: models.User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    if budget_update.budget < 0:
        raise HTTPException(status_code=400, detail="Budget cannot be negative")

    current_user.budget = Decimal(str(budget_update.budget))
    db.commit()
    db.refresh(current_user)
    return {"message": "Budget updated successfully", "new_budget": float(current_user.budget)}

# Add Expense (Deduct from Budget)
@app.post("/expenses/")
def add_expense(expense: schemas.ExpenseCreate, current_user: models.User = Depends(get_current_user), db: Session = Depends(get_db)):
    if float(current_user.budget) < expense.amount:
        raise HTTPException(status_code=400, detail="Not enough budget!")

    # Deduct expense from user's budget
    current_user.budget = Decimal(str(current_user.budget)) - Decimal(str(expense.amount))
    db.commit()
    db.refresh(current_user)

    # Create new expense record
    new_expense = models.Expense(**expense.dict(), user_id=current_user.id)
    db.add(new_expense)
    db.commit()
    db.refresh(new_expense)

    return {"message": "Expense added successfully", "remaining_budget": float(current_user.budget), "expense": new_expense}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(models.User).filter(
        (models.User.username == form_data.username) | (models.User.email == form_data.username)
    ).first()

    if not user or not verify_password(form_data.password, user.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    access_token = create_access_token(data={"sub": user.username})
    refresh_token = create_refresh_token(data={"sub": user.username})

    return {"access_token": access_token, "refresh_token": refresh_token, "token_type": "bearer"}

@app.post("/refresh")
def refresh_token(refresh_token: str, db: Session = Depends(get_db)):
    try:
        payload = jwt.decode(refresh_token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")

        if username is None:
            raise HTTPException(status_code=401, detail="Invalid refresh token")

        user = db.query(models.User).filter(models.User.username == username).first()
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")

        new_access_token = create_access_token(data={"sub": user.username})
        return {"access_token": new_access_token, "token_type": "bearer"}
    
    except JWTError:
        raise HTTPException(status_code=401, detail="Could not validate refresh token")
