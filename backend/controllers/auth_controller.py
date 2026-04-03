from fastapi import APIRouter, HTTPException
from backend.models.schemas import UserRegister, UserLogin
from backend.core.database import users_collection
from backend.core.auth import get_password_hash, verify_password, create_access_token

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register")
async def register(user: UserRegister):
    existing_user = await users_collection.find_one({"email": user.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pwd = get_password_hash(user.password)
    user_dict = user.model_dump()
    user_dict["password_hash"] = hashed_pwd
    del user_dict["password"]
    
    result = await users_collection.insert_one(user_dict)
    token = create_access_token({"sub": user.email, "role": user.role})
    return {"access_token": token, "role": user.role, "name": user.name}

@router.post("/login")
async def login(user: UserLogin):
    db_user = await users_collection.find_one({"email": user.email})
    if not db_user or not verify_password(user.password, db_user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": db_user["email"], "role": db_user["role"]})
    return {"access_token": token, "role": db_user["role"], "name": db_user["name"]}
