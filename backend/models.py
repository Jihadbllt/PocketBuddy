from sqlalchemy import Column, Integer, String, DECIMAL, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    budget = Column(DECIMAL(10,2), nullable=False, default=1000.00)  # Use DECIMAL for precision

    # Relationship with Expenses
    expenses = relationship("Expense", back_populates="user", cascade="all, delete")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String(50), nullable=False)
    amount = Column(DECIMAL(10,2), nullable=False)  # Ensure proper financial precision
    description = Column(String(255), nullable=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)

    # Relationship with User
    user = relationship("User", back_populates="expenses")
