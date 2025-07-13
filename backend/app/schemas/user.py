from pydantic import BaseModel, EmailStr

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    name: str

class UserUpdate(BaseModel):
    username: str | None = None
    email: EmailStr | None = None
    name: str | None = None

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr
    name: str

    class Config:
        from_attributes = True