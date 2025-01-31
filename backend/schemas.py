from pydantic import BaseModel, Field
from typing import Optional

# User Creation Schema
class UserCreate(BaseModel):
    username: str
    email: str
    password: str

# User Response Schema (Without Budget)
class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    budget: float

    class Config:
        from_attributes = True  # Ensure compatibility with SQLAlchemy models

# User Response Schema (With Budget)
class UserWithBudgetResponse(UserResponse):
    budget: float  # Include budget when retrieving user details

# Expense Creation Schema
class ExpenseCreate(BaseModel):
    category: str
    amount: float = Field(gt=0, description="Expense amount must be greater than 0")
    description: Optional[str] = None  # Description is optional

# Expense Response Schema
class ExpenseResponse(BaseModel):
    id: int
    category: str
    amount: float
    description: Optional[str] = None
    user_id: int

    class Config:
        from_attributes = True

# Budget Update Schema
class BudgetUpdate(BaseModel):
    budget: float = Field(ge=0, description="Budget must be a non-negative number")  # Ensure budget is >= 0
