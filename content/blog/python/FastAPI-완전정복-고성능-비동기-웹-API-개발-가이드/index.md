---
templateKey: blog-post
title: FastAPI 완전정복 - 고성능 비동기 웹 API 개발 실전 가이드
date: 2025-11-15T00:00:00.000Z
category: python
description:
  FastAPI 기초부터 고급 활용까지. 비동기 프로그래밍, 의존성 주입, Pydantic 검증, WebSocket, 백그라운드 작업, 데이터베이스 연동, 인증/인가, 테스트까지 실무에서 바로 사용할 수 있는 완벽한 가이드를 제공합니다.
tags:
  - FastAPI
  - Python
  - 비동기 프로그래밍
  - 웹 API
  - REST API
  - asyncio
  - Pydantic
  - WebSocket
  - 데이터베이스
  - 백엔드 개발
---

# FastAPI 완전정복 - 고성능 비동기 웹 API 개발 실전 가이드

FastAPI는 Python으로 고성능 웹 API를 빠르게 개발할 수 있게 해주는 현대적 웹 프레임워크다. Starlette와 Pydantic을 기반으로 하며, 자동 API 문서 생성, 타입 힌팅, 비동기 지원 등 강력한 기능을 제공한다. 이 글은 FastAPI를 활용한 실전 웹 API 개발의 모든 것을 다룬다.

## 1. FastAPI 개요와 시작하기

### 1-1. FastAPI의 특징

- **높은 성능**: NodeJS 및 Go와 비슷한 수준의 성능
- **빠른 개발**: 타입 힌팅과 자동 검증으로 개발 속도 향상
- **자동 문서화**: OpenAPI/Swagger UI 자동 생성
- **비동기 지원**: asyncio 기반 비동기 프로그래밍
- **표준 기반**: OpenAPI, JSON Schema 기반

### 1-2. 기본 설치와 Hello World

```bash
pip install fastapi uvicorn[standard]
```

```python
# main.py
from fastapi import FastAPI
from fastapi.responses import JSONResponse

app = FastAPI(
    title="My API",
    description="FastAPI 완전정복 가이드",
    version="1.0.0"
)

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/health")
async def health_check():
    return JSONResponse(
        content={"status": "healthy"},
        status_code=200
    )

# 서버 실행
# uvicorn main:app --reload
```

### 1-3. 경로 매개변수와 쿼리 매개변수

```python
from fastapi import FastAPI, Query, Path
from typing import Optional
from pydantic import BaseModel

app = FastAPI()

# 경로 매개변수
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    return {"user_id": user_id}

# 쿼리 매개변수
@app.get("/items/")
async def read_items(
    skip: int = 0,
    limit: int = Query(10, ge=1, le=100),
    q: Optional[str] = Query(None, min_length=3, max_length=50)
):
    return {
        "skip": skip,
        "limit": limit,
        "q": q
    }

# 경로와 쿼리 조합
@app.get("/users/{user_id}/items/{item_id}")
async def get_user_item(
    user_id: int = Path(..., gt=0),
    item_id: int = Path(..., gt=0),
    q: Optional[str] = None,
    short: bool = False
):
    return {
        "user_id": user_id,
        "item_id": item_id,
        "q": q,
        "short": short
    }
```

## 2. Pydantic 모델과 데이터 검증

### 2-1. 기본 모델 정의

```python
from pydantic import BaseModel, Field, EmailStr, validator
from typing import Optional, List
from datetime import datetime
from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=0, le=120)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=100)
    
    @validator('password')
    def validate_password(cls, v):
        if not any(char.isdigit() for char in v):
            raise ValueError('Password must contain at least one digit')
        if not any(char.isupper() for char in v):
            raise ValueError('Password must contain at least one uppercase letter')
        return v

class UserResponse(UserBase):
    id: int
    role: UserRole
    created_at: datetime
    is_active: bool
    
    class Config:
        from_attributes = True  # Pydantic v2 (이전에는 orm_mode=True)

class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = Field(None, min_length=1, max_length=100)
    age: Optional[int] = Field(None, ge=0, le=120)
```

### 2-2. 중첩 모델과 리스트

```python
from typing import List, Optional

class Item(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(..., gt=0)
    tax: Optional[float] = Field(None, ge=0, le=1)

class OrderCreate(BaseModel):
    user_id: int
    items: List[Item] = Field(..., min_items=1)
    shipping_address: str

class OrderResponse(BaseModel):
    id: int
    user_id: int
    items: List[Item]
    total: float
    created_at: datetime
    
    class Config:
        from_attributes = True
```

### 2-3. 커스텀 검증자

```python
from pydantic import validator, root_validator
import re

class UserRegistration(BaseModel):
    username: str
    email: EmailStr
    password: str
    confirm_password: str
    phone: Optional[str] = None
    
    @validator('username')
    def validate_username(cls, v):
        if not re.match(r'^[a-zA-Z0-9_]{3,20}$', v):
            raise ValueError('Username must be 3-20 alphanumeric characters or underscores')
        return v
    
    @validator('phone')
    def validate_phone(cls, v):
        if v and not re.match(r'^\+?[1-9]\d{1,14}$', v):
            raise ValueError('Invalid phone number format')
        return v
    
    @root_validator
    def validate_passwords_match(cls, values):
        password = values.get('password')
        confirm_password = values.get('confirm_password')
        if password != confirm_password:
            raise ValueError('Passwords do not match')
        return values
```

## 3. 의존성 주입 (Dependency Injection)

### 3-1. 기본 의존성

```python
from fastapi import Depends, FastAPI, HTTPException
from typing import Optional

app = FastAPI()

# 간단한 의존성
def get_db():
    db = "database_connection"
    try:
        yield db
    finally:
        # 클린업 코드
        print("Closing database connection")

@app.get("/items/")
async def read_items(db: str = Depends(get_db)):
    return {"db": db}

# 의존성 체인
def get_query_token(token: str = Query(...)):
    return token

def get_token_header(token: str = Depends(get_query_token)):
    if token != "secret-token":
        raise HTTPException(status_code=403, detail="Invalid token")
    return token

@app.get("/protected/")
async def protected_route(token: str = Depends(get_token_header)):
    return {"message": "Access granted"}
```

### 3-2. 클래스 기반 의존성

```python
from fastapi import Depends
from typing import Optional

class PaginationParams:
    def __init__(
        self,
        skip: int = 0,
        limit: int = 10
    ):
        self.skip = skip
        self.limit = limit

@app.get("/items/")
async def read_items(pagination: PaginationParams = Depends()):
    return {
        "skip": pagination.skip,
        "limit": pagination.limit
    }
```

### 3-3. 데이터베이스 세션 의존성

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker
from contextlib import asynccontextmanager

# 데이터베이스 설정
DATABASE_URL = "postgresql+asyncpg://user:password@localhost/dbname"

engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(
    engine, class_=AsyncSession, expire_on_commit=False
)

async def get_db() -> AsyncSession:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

@app.get("/users/")
async def get_users(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    return users
```

## 4. 비동기 프로그래밍 심화

### 4-1. 비동기 함수와 await

```python
import asyncio
import aiohttp
from fastapi import FastAPI
from typing import List

app = FastAPI()

async def fetch_data(url: str) -> dict:
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            return await response.json()

@app.get("/fetch-multiple/")
async def fetch_multiple_urls(urls: List[str]):
    # 병렬 실행
    tasks = [fetch_data(url) for url in urls]
    results = await asyncio.gather(*tasks)
    return results

# 타임아웃 처리
async def fetch_with_timeout(url: str, timeout: int = 5):
    try:
        return await asyncio.wait_for(fetch_data(url), timeout=timeout)
    except asyncio.TimeoutError:
        return {"error": "Request timeout"}
```

### 4-2. 백그라운드 작업

```python
from fastapi import BackgroundTasks
from fastapi import FastAPI

app = FastAPI()

def send_email(email: str, message: str):
    # 이메일 전송 로직
    print(f"Sending email to {email}: {message}")

def log_activity(user_id: int, action: str):
    # 활동 로깅
    print(f"User {user_id} performed {action}")

@app.post("/users/", response_model=UserResponse)
async def create_user(
    user: UserCreate,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db)
):
    # 사용자 생성
    db_user = User(**user.dict())
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    
    # 백그라운드 작업 추가
    background_tasks.add_task(send_email, user.email, "Welcome!")
    background_tasks.add_task(log_activity, db_user.id, "user_created")
    
    return db_user
```

### 4-3. 비동기 이벤트 핸들러

```python
from contextlib import asynccontextmanager

@asynccontextmanager
async def lifespan(app: FastAPI):
    # 시작 시 실행
    print("Starting up...")
    # 초기화 작업 (DB 연결, 캐시 설정 등)
    yield
    # 종료 시 실행
    print("Shutting down...")
    # 클린업 작업

app = FastAPI(lifespan=lifespan)
```

## 5. 데이터베이스 연동

### 5-1. SQLAlchemy 비동기 설정

```python
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import Column, Integer, String, DateTime, Boolean
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# 엔진과 세션 생성
DATABASE_URL = "postgresql+asyncpg://user:password@localhost/dbname"

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    future=True
)

AsyncSessionLocal = sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)

# 테이블 생성
async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
```

### 5-2. CRUD 작업

```python
from sqlalchemy import select, update, delete
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def create(self, user_data: UserCreate) -> User:
        hashed_password = get_password_hash(user_data.password)
        db_user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hashed_password
        )
        self.db.add(db_user)
        await self.db.commit()
        await self.db.refresh(db_user)
        return db_user
    
    async def get_by_id(self, user_id: int) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.id == user_id)
        )
        return result.scalar_one_or_none()
    
    async def get_by_email(self, email: str) -> Optional[User]:
        result = await self.db.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_all(
        self,
        skip: int = 0,
        limit: int = 100
    ) -> List[User]:
        result = await self.db.execute(
            select(User)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()
    
    async def update(
        self,
        user_id: int,
        user_update: UserUpdate
    ) -> Optional[User]:
        update_data = user_update.dict(exclude_unset=True)
        if not update_data:
            return await self.get_by_id(user_id)
        
        await self.db.execute(
            update(User)
            .where(User.id == user_id)
            .values(**update_data)
        )
        await self.db.commit()
        return await self.get_by_id(user_id)
    
    async def delete(self, user_id: int) -> bool:
        result = await self.db.execute(
            delete(User).where(User.id == user_id)
        )
        await self.db.commit()
        return result.rowcount > 0

# API 엔드포인트
@app.post("/users/", response_model=UserResponse, status_code=201)
async def create_user(
    user: UserCreate,
    db: AsyncSession = Depends(get_db)
):
    repository = UserRepository(db)
    
    # 이메일 중복 확인
    existing_user = await repository.get_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )
    
    return await repository.create(user)

@app.get("/users/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    repository = UserRepository(db)
    user = await repository.get_by_id(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user
```

## 6. 인증과 인가

### 6-1. JWT 인증 구현

```python
from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# 설정
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: AsyncSession = Depends(get_db)
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    repository = UserRepository(db)
    user = await repository.get_by_id(user_id)
    if user is None:
        raise credentials_exception
    return user

@app.post("/token")
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: AsyncSession = Depends(get_db)
):
    repository = UserRepository(db)
    user = await repository.get_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me/", response_model=UserResponse)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
```

### 6-2. 역할 기반 접근 제어 (RBAC)

```python
from enum import Enum
from fastapi import Depends, HTTPException, status

class Role(str, Enum):
    ADMIN = "admin"
    USER = "user"
    GUEST = "guest"

def require_role(required_role: Role):
    async def role_checker(current_user: User = Depends(get_current_user)):
        if current_user.role != required_role:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions"
            )
        return current_user
    return role_checker

@app.delete("/users/{user_id}")
async def delete_user(
    user_id: int,
    current_user: User = Depends(require_role(Role.ADMIN)),
    db: AsyncSession = Depends(get_db)
):
    repository = UserRepository(db)
    success = await repository.delete(user_id)
    if not success:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": "User deleted"}
```

## 7. WebSocket과 실시간 통신

### 7-1. 기본 WebSocket

```python
from fastapi import WebSocket, WebSocketDisconnect
from typing import List

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)
    
    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.send_personal_message(
                f"Message text was: {data}", websocket
            )
            await manager.broadcast(f"Client #{client_id} says: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
        await manager.broadcast(f"Client #{client_id} left the chat")
```

### 7-2. 실시간 채팅 애플리케이션

```python
from typing import Dict
import json

class ChatManager:
    def __init__(self):
        self.rooms: Dict[str, List[WebSocket]] = {}
    
    async def connect(self, websocket: WebSocket, room: str):
        await websocket.accept()
        if room not in self.rooms:
            self.rooms[room] = []
        self.rooms[room].append(websocket)
    
    def disconnect(self, websocket: WebSocket, room: str):
        if room in self.rooms:
            self.rooms[room].remove(websocket)
    
    async def send_message(self, message: dict, room: str):
        if room in self.rooms:
            for connection in self.rooms[room]:
                await connection.send_json(message)

chat_manager = ChatManager()

@app.websocket("/ws/chat/{room}")
async def chat_endpoint(websocket: WebSocket, room: str):
    await chat_manager.connect(websocket, room)
    try:
        while True:
            data = await websocket.receive_text()
            message = json.loads(data)
            await chat_manager.send_message(message, room)
    except WebSocketDisconnect:
        chat_manager.disconnect(websocket, room)
```

## 8. 파일 업로드와 처리

### 8-1. 단일 파일 업로드

```python
from fastapi import UploadFile, File
from fastapi.responses import FileResponse
import aiofiles
import os

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/upload/")
async def upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    
    async with aiofiles.open(file_path, 'wb') as f:
        content = await file.read()
        await f.write(content)
    
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(content)
    }

@app.get("/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(
            file_path,
            media_type='application/octet-stream',
            filename=filename
        )
    raise HTTPException(status_code=404, detail="File not found")
```

### 8-2. 다중 파일 업로드

```python
from typing import List

@app.post("/upload-multiple/")
async def upload_multiple_files(files: List[UploadFile] = File(...)):
    uploaded_files = []
    
    for file in files:
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        async with aiofiles.open(file_path, 'wb') as f:
            content = await file.read()
            await f.write(content)
        
        uploaded_files.append({
            "filename": file.filename,
            "size": len(content)
        })
    
    return {"uploaded_files": uploaded_files}
```

## 9. 에러 처리와 미들웨어

### 9-1. 커스텀 예외 처리

```python
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException

app = FastAPI()

class CustomException(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

@app.exception_handler(CustomException)
async def custom_exception_handler(request: Request, exc: CustomException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message}
    )

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"detail": exc.errors()}
    )
```

### 9-2. 미들웨어

```python
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import time

class TimingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        return response

class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        print(f"Request: {request.method} {request.url}")
        response = await call_next(request)
        print(f"Response: {response.status_code}")
        return response

app.add_middleware(TimingMiddleware)
app.add_middleware(LoggingMiddleware)
```

## 10. 테스트

### 10-1. 단위 테스트

```python
# test_main.py
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"}

def test_create_user():
    response = client.post(
        "/users/",
        json={
            "email": "test@example.com",
            "full_name": "Test User",
            "age": 25,
            "password": "Test1234"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "test@example.com"
```

### 10-2. 비동기 테스트

```python
import pytest
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_async_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as ac:
        response = await ac.get("/users/")
        assert response.status_code == 200
```

## 11. 프로덕션 배포

### 11-1. Gunicorn과 Uvicorn Workers

```bash
# gunicorn_config.py
bind = "0.0.0.0:8000"
workers = 4
worker_class = "uvicorn.workers.UvicornWorker"
timeout = 120
keepalive = 5

# 실행
gunicorn main:app -c gunicorn_config.py
```

### 11-2. Docker 배포

```dockerfile
# Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

## 12. 결론

FastAPI는 현대적이고 고성능인 Python 웹 프레임워크다. 이 글에서 다룬 내용:

1. **기본 사용법**: 경로, 쿼리, 요청/응답 모델
2. **Pydantic 검증**: 데이터 검증과 변환
3. **의존성 주입**: 재사용 가능한 로직 분리
4. **비동기 프로그래밍**: asyncio를 활용한 고성능 처리
5. **데이터베이스 연동**: SQLAlchemy 비동기 사용
6. **인증/인가**: JWT와 RBAC 구현
7. **WebSocket**: 실시간 통신
8. **파일 처리**: 업로드/다운로드
9. **테스트**: 단위 및 통합 테스트
10. **배포**: 프로덕션 환경 설정

이러한 기능들을 조합하면 확장 가능하고 유지보수하기 쉬운 API를 빠르게 개발할 수 있다.

## 참고 자료

- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [Pydantic 문서](https://docs.pydantic.dev/)
- [SQLAlchemy 비동기 가이드](https://docs.sqlalchemy.org/en/20/orm/extensions/asyncio.html)


