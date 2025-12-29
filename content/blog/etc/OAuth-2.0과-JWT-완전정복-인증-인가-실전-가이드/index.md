---
templateKey: blog-post
title: OAuth 2.0과 JWT 완전정복 - 인증/인가 실전 가이드
date: 2025-11-28T00:00:00.000Z
category: etc
description:
  OAuth 2.0과 JWT를 활용한 현대적인 인증/인가 시스템을 실전 예제와 함께 완벽하게 정리합니다. Authorization Code Flow, Implicit Flow, Client Credentials, JWT 생성/검증, 보안 모범 사례까지 모든 것을 다룹니다.
tags:
  - OAuth 2.0
  - JWT
  - 인증
  - 인가
  - 보안
  - API
  - 웹 개발
  - 백엔드
---

# OAuth 2.0과 JWT 완전정복 - 인증/인가 실전 가이드

OAuth 2.0과 JWT는 현대적인 웹 애플리케이션의 인증/인가 시스템의 핵심이다. 이 글은 OAuth 2.0의 다양한 플로우와 JWT의 생성/검증을 실전 예제와 함께 정리한다.

## 1. OAuth 2.0 기초

### 1-1. OAuth 2.0 개요

OAuth 2.0은 제3자 애플리케이션에게 제한된 리소스 접근 권한을 부여하는 인가 프레임워크다.

**주요 역할:**
- **Resource Owner**: 리소스 소유자 (사용자)
- **Client**: 리소스에 접근하려는 애플리케이션
- **Authorization Server**: 액세스 토큰 발급
- **Resource Server**: 보호된 리소스 제공

### 1-2. OAuth 2.0 플로우 종류

1. **Authorization Code Flow**: 가장 안전한 플로우
2. **Implicit Flow**: 단순하지만 보안 취약 (deprecated)
3. **Client Credentials Flow**: 서버 간 통신
4. **Resource Owner Password Credentials Flow**: 신뢰할 수 있는 클라이언트용
5. **Device Flow**: IoT 디바이스용

## 2. Authorization Code Flow

### 2-1. 기본 플로우

```python
from flask import Flask, redirect, request, session
import requests
import secrets

app = Flask(__name__)
app.secret_key = secrets.token_hex(16)

# OAuth 2.0 설정
CLIENT_ID = "your-client-id"
CLIENT_SECRET = "your-client-secret"
REDIRECT_URI = "http://localhost:5000/callback"
AUTHORIZATION_URL = "https://oauth-provider.com/authorize"
TOKEN_URL = "https://oauth-provider.com/token"

@app.route("/login")
def login():
    # 1. Authorization Code 요청
    state = secrets.token_urlsafe(32)
    session['oauth_state'] = state
    
    params = {
        "response_type": "code",
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "scope": "read write",
        "state": state
    }
    
    auth_url = f"{AUTHORIZATION_URL}?{requests.compat.urlencode(params)}"
    return redirect(auth_url)

@app.route("/callback")
def callback():
    # 2. Authorization Code 수신
    code = request.args.get("code")
    state = request.args.get("state")
    
    # State 검증 (CSRF 방지)
    if state != session.get('oauth_state'):
        return "Invalid state parameter", 400
    
    # 3. Access Token 교환
    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET
    }
    
    response = requests.post(TOKEN_URL, data=token_data)
    token_response = response.json()
    
    # 4. Access Token 저장
    session['access_token'] = token_response['access_token']
    session['refresh_token'] = token_response.get('refresh_token')
    
    return "Login successful!"

@app.route("/api/data")
def get_data():
    # 5. Access Token으로 리소스 접근
    access_token = session.get('access_token')
    if not access_token:
        return redirect("/login")
    
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get("https://api.example.com/data", headers=headers)
    
    return response.json()
```

### 2-2. PKCE (Proof Key for Code Exchange)

```python
import hashlib
import base64
import secrets

def generate_code_verifier():
    """Code Verifier 생성"""
    return base64.urlsafe_b64encode(secrets.token_bytes(32)).decode('utf-8').rstrip('=')

def generate_code_challenge(verifier):
    """Code Challenge 생성 (SHA256)"""
    challenge = hashlib.sha256(verifier.encode('utf-8')).digest()
    return base64.urlsafe_b64encode(challenge).decode('utf-8').rstrip('=')

@app.route("/login-pkce")
def login_pkce():
    # PKCE를 사용한 안전한 Authorization Code Flow
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)
    
    session['code_verifier'] = code_verifier
    state = secrets.token_urlsafe(32)
    session['oauth_state'] = state
    
    params = {
        "response_type": "code",
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "scope": "read write",
        "state": state,
        "code_challenge": code_challenge,
        "code_challenge_method": "S256"
    }
    
    auth_url = f"{AUTHORIZATION_URL}?{requests.compat.urlencode(params)}"
    return redirect(auth_url)

@app.route("/callback-pkce")
def callback_pkce():
    code = request.args.get("code")
    state = request.args.get("state")
    
    if state != session.get('oauth_state'):
        return "Invalid state", 400
    
    # Code Verifier와 함께 토큰 요청
    token_data = {
        "grant_type": "authorization_code",
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "client_id": CLIENT_ID,
        "code_verifier": session.get('code_verifier')
    }
    
    response = requests.post(TOKEN_URL, data=token_data)
    token_response = response.json()
    
    session['access_token'] = token_response['access_token']
    return "Login successful!"
```

## 3. Client Credentials Flow

### 3-1. 서버 간 통신

```python
import requests
from datetime import datetime, timedelta

class OAuth2Client:
    def __init__(self, client_id, client_secret, token_url):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token_url = token_url
        self.access_token = None
        self.token_expires_at = None
    
    def get_access_token(self):
        """Access Token 획득"""
        # 토큰이 유효하면 재사용
        if self.access_token and self.token_expires_at:
            if datetime.now() < self.token_expires_at:
                return self.access_token
        
        # 새 토큰 요청
        token_data = {
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
            "scope": "api:read api:write"
        }
        
        response = requests.post(self.token_url, data=token_data)
        token_response = response.json()
        
        self.access_token = token_response['access_token']
        expires_in = token_response.get('expires_in', 3600)
        self.token_expires_at = datetime.now() + timedelta(seconds=expires_in)
        
        return self.access_token
    
    def make_authenticated_request(self, url, method='GET', **kwargs):
        """인증된 요청"""
        token = self.get_access_token()
        headers = kwargs.get('headers', {})
        headers['Authorization'] = f"Bearer {token}"
        kwargs['headers'] = headers
        
        return requests.request(method, url, **kwargs)

# 사용 예시
client = OAuth2Client(
    client_id="your-client-id",
    client_secret="your-client-secret",
    token_url="https://oauth-provider.com/token"
)

response = client.make_authenticated_request("https://api.example.com/data")
print(response.json())
```

## 4. JWT (JSON Web Token)

### 4-1. JWT 구조

JWT는 세 부분으로 구성된다:
1. **Header**: 토큰 타입과 알고리즘
2. **Payload**: 클레임 (사용자 정보, 권한 등)
3. **Signature**: 서명

```
Header.Payload.Signature
```

### 4-2. JWT 생성

```python
import jwt
from datetime import datetime, timedelta
import secrets

# JWT 설정
SECRET_KEY = secrets.token_urlsafe(32)
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: timedelta = None):
    """Access Token 생성"""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "access"
    })
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict):
    """Refresh Token 생성"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=30)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.utcnow(),
        "type": "refresh"
    })
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# 사용 예시
user_data = {
    "user_id": 123,
    "username": "alice",
    "email": "alice@example.com",
    "roles": ["user", "admin"]
}

access_token = create_access_token(user_data, expires_delta=timedelta(minutes=15))
refresh_token = create_refresh_token({"user_id": user_data["user_id"]})

print(f"Access Token: {access_token}")
print(f"Refresh Token: {refresh_token}")
```

### 4-3. JWT 검증

```python
from functools import wraps
from flask import request, jsonify

def verify_token(token: str):
    """JWT 토큰 검증"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # 토큰 만료
    except jwt.InvalidTokenError:
        return None  # 유효하지 않은 토큰

def token_required(f):
    """토큰 검증 데코레이터"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        
        # Authorization 헤더에서 토큰 추출
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            try:
                token = auth_header.split(' ')[1]  # "Bearer <token>"
            except IndexError:
                return jsonify({'message': 'Invalid token format'}), 401
        
        if not token:
            return jsonify({'message': 'Token is missing'}), 401
        
        # 토큰 검증
        payload = verify_token(token)
        if not payload:
            return jsonify({'message': 'Token is invalid or expired'}), 401
        
        # 요청에 사용자 정보 추가
        request.current_user = payload
        return f(*args, **kwargs)
    
    return decorated

# 사용 예시
@app.route("/api/protected")
@token_required
def protected_route():
    user = request.current_user
    return jsonify({
        'message': 'Access granted',
        'user_id': user['user_id'],
        'username': user['username']
    })
```

### 4-4. RS256 알고리즘 (비대칭 키)

```python
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric import rsa
import jwt

# RSA 키 쌍 생성
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)

public_key = private_key.public_key()

# Private Key를 PEM 형식으로 저장
private_pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)

# Public Key를 PEM 형식으로 저장
public_pem = public_key.public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

# RS256으로 JWT 생성
def create_token_rs256(data: dict):
    """RS256 알고리즘으로 JWT 생성"""
    token = jwt.encode(
        data,
        private_pem,
        algorithm="RS256"
    )
    return token

# RS256으로 JWT 검증
def verify_token_rs256(token: str):
    """RS256 알고리즘으로 JWT 검증"""
    try:
        payload = jwt.decode(
            token,
            public_pem,
            algorithms=["RS256"]
        )
        return payload
    except jwt.InvalidTokenError:
        return None

# 사용 예시
user_data = {"user_id": 123, "username": "alice"}
token = create_token_rs256(user_data)
payload = verify_token_rs256(token)
```

## 5. Refresh Token 구현

### 5-1. Refresh Token 플로우

```python
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import jwt

app = Flask(__name__)

# 토큰 저장소 (실제로는 데이터베이스 사용)
token_store = {}

def create_token_pair(user_data: dict):
    """Access Token과 Refresh Token 쌍 생성"""
    access_token = create_access_token(
        user_data,
        expires_delta=timedelta(minutes=15)
    )
    
    refresh_token = create_refresh_token({"user_id": user_data["user_id"]})
    
    # Refresh Token 저장
    token_store[refresh_token] = {
        "user_id": user_data["user_id"],
        "created_at": datetime.utcnow()
    }
    
    return access_token, refresh_token

@app.route("/api/refresh", methods=["POST"])
def refresh_token():
    """Refresh Token으로 새 Access Token 발급"""
    data = request.get_json()
    refresh_token = data.get("refresh_token")
    
    if not refresh_token:
        return jsonify({"error": "Refresh token is required"}), 400
    
    # Refresh Token 검증
    payload = verify_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        return jsonify({"error": "Invalid refresh token"}), 401
    
    # Refresh Token이 저장소에 있는지 확인
    if refresh_token not in token_store:
        return jsonify({"error": "Refresh token not found"}), 401
    
    # 새 Access Token 생성
    user_id = payload["user_id"]
    user_data = {"user_id": user_id}  # 실제로는 DB에서 조회
    
    new_access_token = create_access_token(
        user_data,
        expires_delta=timedelta(minutes=15)
    )
    
    return jsonify({
        "access_token": new_access_token
    })

@app.route("/api/logout", methods=["POST"])
def logout():
    """로그아웃 (Refresh Token 무효화)"""
    data = request.get_json()
    refresh_token = data.get("refresh_token")
    
    if refresh_token in token_store:
        del token_store[refresh_token]
    
    return jsonify({"message": "Logged out successfully"})
```

## 6. OAuth 2.0 + JWT 통합

### 6-1. Authorization Server 구현

```python
from flask import Flask, request, jsonify, redirect
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)

# 클라이언트 정보 (실제로는 데이터베이스)
clients = {
    "client-id-123": {
        "client_secret": "client-secret-456",
        "redirect_uris": ["http://localhost:5000/callback"],
        "scopes": ["read", "write"]
    }
}

# Authorization Code 저장소
auth_codes = {}

@app.route("/authorize", methods=["GET"])
def authorize():
    """Authorization Code 발급"""
    client_id = request.args.get("client_id")
    redirect_uri = request.args.get("redirect_uri")
    response_type = request.args.get("response_type")
    scope = request.args.get("scope")
    state = request.args.get("state")
    
    # 클라이언트 검증
    if client_id not in clients:
        return jsonify({"error": "invalid_client"}), 400
    
    if redirect_uri not in clients[client_id]["redirect_uris"]:
        return jsonify({"error": "invalid_redirect_uri"}), 400
    
    if response_type != "code":
        return jsonify({"error": "unsupported_response_type"}), 400
    
    # 사용자 인증 (실제로는 로그인 페이지)
    # 여기서는 간단히 사용자 ID를 받는다고 가정
    user_id = request.args.get("user_id", "123")
    
    # Authorization Code 생성
    import secrets
    auth_code = secrets.token_urlsafe(32)
    auth_codes[auth_code] = {
        "client_id": client_id,
        "user_id": user_id,
        "scope": scope,
        "created_at": datetime.utcnow(),
        "expires_in": 600  # 10분
    }
    
    # 리다이렉트
    redirect_url = f"{redirect_uri}?code={auth_code}&state={state}"
    return redirect(redirect_url)

@app.route("/token", methods=["POST"])
def token():
    """Access Token 발급"""
    grant_type = request.form.get("grant_type")
    
    if grant_type == "authorization_code":
        # Authorization Code Flow
        code = request.form.get("code")
        client_id = request.form.get("client_id")
        client_secret = request.form.get("client_secret")
        redirect_uri = request.form.get("redirect_uri")
        
        # Authorization Code 검증
        if code not in auth_codes:
            return jsonify({"error": "invalid_grant"}), 400
        
        auth_info = auth_codes[code]
        
        # 만료 확인
        if (datetime.utcnow() - auth_info["created_at"]).seconds > auth_info["expires_in"]:
            del auth_codes[code]
            return jsonify({"error": "invalid_grant"}), 400
        
        # 클라이언트 검증
        if client_id != auth_info["client_id"]:
            return jsonify({"error": "invalid_client"}), 400
        
        if client_secret != clients[client_id]["client_secret"]:
            return jsonify({"error": "invalid_client"}), 400
        
        # JWT Access Token 생성
        user_data = {
            "user_id": auth_info["user_id"],
            "client_id": client_id,
            "scope": auth_info["scope"]
        }
        
        access_token = create_access_token(user_data, timedelta(hours=1))
        refresh_token = create_refresh_token({"user_id": auth_info["user_id"]})
        
        # Authorization Code 삭제
        del auth_codes[code]
        
        return jsonify({
            "access_token": access_token,
            "token_type": "Bearer",
            "expires_in": 3600,
            "refresh_token": refresh_token,
            "scope": auth_info["scope"]
        })
    
    elif grant_type == "refresh_token":
        # Refresh Token Flow
        refresh_token = request.form.get("refresh_token")
        client_id = request.form.get("client_id")
        client_secret = request.form.get("client_secret")
        
        # Refresh Token 검증
        payload = verify_token(refresh_token)
        if not payload or payload.get("type") != "refresh":
            return jsonify({"error": "invalid_grant"}), 400
        
        # 클라이언트 검증
        if client_secret != clients[client_id]["client_secret"]:
            return jsonify({"error": "invalid_client"}), 400
        
        # 새 Access Token 생성
        user_data = {"user_id": payload["user_id"], "client_id": client_id}
        access_token = create_access_token(user_data, timedelta(hours=1))
        
        return jsonify({
            "access_token": access_token,
            "token_type": "Bearer",
            "expires_in": 3600
        })
    
    else:
        return jsonify({"error": "unsupported_grant_type"}), 400
```

### 6-2. Resource Server 구현

```python
@app.route("/api/user/profile")
@token_required
def get_user_profile():
    """사용자 프로필 조회"""
    user = request.current_user
    user_id = user["user_id"]
    
    # 실제로는 데이터베이스에서 조회
    profile = {
        "user_id": user_id,
        "username": "alice",
        "email": "alice@example.com"
    }
    
    return jsonify(profile)

@app.route("/api/data", methods=["GET", "POST"])
@token_required
def handle_data():
    """리소스 접근"""
    user = request.current_user
    
    # Scope 검증
    scopes = user.get("scope", "").split()
    if "read" not in scopes and request.method == "GET":
        return jsonify({"error": "insufficient_scope"}), 403
    
    if "write" not in scopes and request.method == "POST":
        return jsonify({"error": "insufficient_scope"}), 403
    
    if request.method == "GET":
        return jsonify({"data": "some data"})
    else:
        return jsonify({"message": "Data created"}), 201
```

## 7. 보안 모범 사례

### 7-1. 토큰 보안

```python
# 1. HTTPS 사용 필수
# 2. 토큰을 안전하게 저장 (HttpOnly Cookie)
from flask import make_response

@app.route("/login", methods=["POST"])
def login():
    # 로그인 처리
    user_data = {"user_id": 123, "username": "alice"}
    access_token = create_access_token(user_data)
    refresh_token = create_refresh_token({"user_id": user_data["user_id"]})
    
    response = make_response(jsonify({"message": "Login successful"}))
    
    # HttpOnly Cookie로 저장 (XSS 방지)
    response.set_cookie(
        "access_token",
        access_token,
        httponly=True,
        secure=True,  # HTTPS만
        samesite="Strict",  # CSRF 방지
        max_age=900  # 15분
    )
    
    response.set_cookie(
        "refresh_token",
        refresh_token,
        httponly=True,
        secure=True,
        samesite="Strict",
        max_age=2592000  # 30일
    )
    
    return response

# 3. 토큰 만료 시간 단축
access_token = create_access_token(user_data, timedelta(minutes=15))

# 4. 토큰 블랙리스트 (로그아웃 시)
blacklisted_tokens = set()

def is_token_blacklisted(token: str) -> bool:
    return token in blacklisted_tokens

def verify_token_secure(token: str):
    """보안 강화된 토큰 검증"""
    # 블랙리스트 확인
    if is_token_blacklisted(token):
        return None
    
    # 토큰 검증
    payload = verify_token(token)
    if not payload:
        return None
    
    # 추가 검증 (IP 주소, User-Agent 등)
    # 실제로는 토큰에 포함된 정보와 요청 정보 비교
    
    return payload
```

### 7-2. CSRF 방지

```python
import secrets

# CSRF 토큰 생성
def generate_csrf_token():
    return secrets.token_urlsafe(32)

# CSRF 토큰 검증
def verify_csrf_token(token: str, session_token: str) -> bool:
    return token == session_token and len(token) > 0

@app.route("/api/sensitive-action", methods=["POST"])
@token_required
def sensitive_action():
    """CSRF 보호가 필요한 액션"""
    csrf_token = request.headers.get("X-CSRF-Token")
    session_token = session.get("csrf_token")
    
    if not verify_csrf_token(csrf_token, session_token):
        return jsonify({"error": "Invalid CSRF token"}), 403
    
    # 액션 수행
    return jsonify({"message": "Action completed"})
```

### 7-3. Rate Limiting

```python
from functools import wraps
from collections import defaultdict
from datetime import datetime, timedelta

# Rate Limiting 저장소
rate_limit_store = defaultdict(list)

def rate_limit(max_requests: int = 5, window: int = 60):
    """Rate Limiting 데코레이터"""
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # 클라이언트 식별 (IP 주소 또는 사용자 ID)
            client_id = request.remote_addr
            
            now = datetime.utcnow()
            window_start = now - timedelta(seconds=window)
            
            # 윈도우 내 요청 수 확인
            requests_in_window = [
                req_time for req_time in rate_limit_store[client_id]
                if req_time > window_start
            ]
            
            if len(requests_in_window) >= max_requests:
                return jsonify({
                    "error": "Rate limit exceeded",
                    "retry_after": window
                }), 429
            
            # 요청 시간 기록
            rate_limit_store[client_id].append(now)
            
            return f(*args, **kwargs)
        return decorated_function
    return decorator

@app.route("/api/login", methods=["POST"])
@rate_limit(max_requests=5, window=60)
def login():
    # 로그인 처리
    pass
```

## 8. 실전 예제

### 8-1. 완전한 인증 시스템

```python
from flask import Flask, request, jsonify, session
from functools import wraps
import jwt
from datetime import datetime, timedelta

app = Flask(__name__)
app.secret_key = "your-secret-key"

# 사용자 데이터베이스 (실제로는 DB 사용)
users = {
    "alice": {"password": "hashed_password", "user_id": 1, "roles": ["user"]},
    "bob": {"password": "hashed_password", "user_id": 2, "roles": ["user", "admin"]}
}

def create_token(user_data: dict):
    """JWT 토큰 생성"""
    payload = {
        "user_id": user_data["user_id"],
        "username": user_data["username"],
        "roles": user_data["roles"],
        "exp": datetime.utcnow() + timedelta(hours=1),
        "iat": datetime.utcnow()
    }
    return jwt.encode(payload, app.secret_key, algorithm="HS256")

def verify_token(token: str):
    """JWT 토큰 검증"""
    try:
        payload = jwt.decode(token, app.secret_key, algorithms=["HS256"])
        return payload
    except jwt.InvalidTokenError:
        return None

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            token = request.headers["Authorization"].split(" ")[1]
        
        if not token:
            return jsonify({"error": "Token is missing"}), 401
        
        payload = verify_token(token)
        if not payload:
            return jsonify({"error": "Token is invalid"}), 401
        
        request.current_user = payload
        return f(*args, **kwargs)
    return decorated

def role_required(*roles):
    """역할 기반 접근 제어"""
    def decorator(f):
        @wraps(f)
        @token_required
        def decorated(*args, **kwargs):
            user_roles = request.current_user.get("roles", [])
            if not any(role in user_roles for role in roles):
                return jsonify({"error": "Insufficient permissions"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    username = data.get("username")
    password = data.get("password")
    
    # 사용자 인증 (실제로는 해시된 비밀번호 검증)
    if username not in users:
        return jsonify({"error": "Invalid credentials"}), 401
    
    user = users[username]
    # 실제로는 bcrypt 등으로 비밀번호 검증
    if password != user["password"]:
        return jsonify({"error": "Invalid credentials"}), 401
    
    # 토큰 생성
    token = create_token({
        "user_id": user["user_id"],
        "username": username,
        "roles": user["roles"]
    })
    
    return jsonify({"access_token": token})

@app.route("/api/profile")
@token_required
def get_profile():
    user = request.current_user
    return jsonify({
        "user_id": user["user_id"],
        "username": user["username"],
        "roles": user["roles"]
    })

@app.route("/api/admin")
@role_required("admin")
def admin_only():
    return jsonify({"message": "Admin access granted"})
```

## 9. 결론

OAuth 2.0과 JWT는 현대적인 인증/인가 시스템의 핵심이다. 이 글에서 다룬 내용:

1. **OAuth 2.0 플로우**: Authorization Code, Client Credentials, PKCE
2. **JWT 생성/검증**: HS256, RS256 알고리즘
3. **Refresh Token**: 토큰 갱신 메커니즘
4. **보안 모범 사례**: HTTPS, HttpOnly Cookie, CSRF 방지, Rate Limiting
5. **역할 기반 접근 제어**: RBAC 구현

이러한 기술들을 적절히 조합하면 안전하고 확장 가능한 인증/인가 시스템을 구축할 수 있다.

## 참고 자료

- [OAuth 2.0 공식 스펙](https://oauth.net/2/)
- [JWT 공식 사이트](https://jwt.io/)
- [OAuth 2.0 Security Best Practices](https://datatracker.ietf.org/doc/html/draft-ietf-oauth-security-topics)
- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)








