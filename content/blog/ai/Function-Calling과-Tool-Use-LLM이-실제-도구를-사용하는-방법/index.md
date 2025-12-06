---
templateKey: blog-post
title: Function Calling과 Tool Use - LLM이 실제 도구를 사용하는 방법
date: 2025-01-15T11:00:00.000Z
category: ai
description:
  Function Calling과 Tool Use를 통해 LLM이 API 호출, 데이터베이스 조회, 코드 실행 등 실제 도구를 사용하는 방법을 설명합니다. OpenAI, Anthropic, Google의 구현 방식과 실전 활용 예시를 알아봅니다.
tags:
  - Function Calling
  - Tool Use
  - LLM
  - API
  - OpenAI
  - Anthropic
  - Google
  - AI
  - Agent
---

![Function Calling과 Tool Use - LLM이 실제 도구를 사용하는 방법](/assets/ai.png "Function Calling과 Tool Use - LLM이 실제 도구를 사용하는 방법")

채팅GPT나 클로드 같은 LLM을 사용해본 사람이라면 한 가지 아쉬운 점을 느꼈을 것이다. 이 AI들은 텍스트를 생성하는 능력은 뛰어나지만, 실시간 정보를 조회하거나 외부 시스템과 상호작용하는 것은 불가능하다는 점이다. 예를 들어 "오늘 서울 날씨가 어때?"라고 물어보면, LLM은 학습 데이터에 있는 과거 정보를 바탕으로 답변할 뿐, 실제로 현재 날씨를 확인할 수는 없다. 마치 도서관에 갇혀서 책만 읽을 수 있는 사람과 같다. 책에는 많은 지식이 있지만, 밖에서 무슨 일이 일어나고 있는지는 알 수 없다.

Function Calling과 Tool Use는 바로 이런 한계를 극복하는 핵심 기술이다. 이 기술을 사용하면 LLM이 함수를 호출하고 도구를 사용해서 데이터베이스를 조회하고, API를 호출하고, 계산을 수행하는 등 실제로 외부 세계와 상호작용할 수 있게 된다. 마치 도서관에 있던 사람에게 전화를 걸고, 컴퓨터를 사용하고, 계산기를 사용할 수 있는 능력을 부여하는 것과 같다. 이 글에서는 Function Calling이 어떻게 작동하는지, 주요 LLM 제공업체들이 어떻게 구현했는지, 그리고 실제로 어떻게 활용할 수 있는지를 자세히 설명한다.

## Function Calling이란?

Function Calling은 LLM이 함수를 호출할 수 있도록 하는 메커니즘이다. 좀 더 쉽게 설명하면, LLM에게 "너가 사용할 수 있는 도구들이 있어"라고 알려주고, 각 도구가 무엇을 하는지 설명해주면, LLM은 상황에 맞는 도구를 선택해서 사용할 수 있게 된다. 예를 들어 날씨를 물어보면, LLM은 자동으로 날씨 조회 함수를 선택하고, 필요한 정보(도시 이름 등)를 넣어서 함수를 호출한다. 그럼 애플리케이션이 실제로 날씨 API를 호출해서 정보를 가져오고, 그 결과를 LLM에게 알려주면, LLM은 그 정보를 바탕으로 사용자에게 친절하게 답변한다.

이 과정은 마치 요리사에게 요리 도구들을 보여주고 각 도구의 용도를 설명한 다음, 요리사가 상황에 맞는 도구를 선택해서 사용하는 것과 같다. 예를 들어 "고기를 자르세요"라고 하면, 요리사는 자동으로 칼을 선택하고, "계란을 풀어주세요"라고 하면 계란 풀기를 선택한다. Function Calling도 마찬가지로, LLM이 사용자의 요청을 이해하고 적절한 함수를 선택해서 사용한다.

### 기본 작동 원리

Function Calling이 어떻게 작동하는지 단계별로 자세히 알아보자. 전체 과정은 크게 4단계로 나눌 수 있다.

**1단계: 함수 정의**

먼저 LLM이 사용할 수 있는 함수들을 정의해야 한다. 이는 마치 요리사에게 사용할 수 있는 도구들을 보여주는 것과 같다. 각 함수는 이름, 설명, 필요한 매개변수 등을 포함한다. 예를 들어 날씨를 조회하는 함수라면, 함수 이름은 "get_weather"이고, 설명은 "특정 도시의 현재 날씨 정보를 조회합니다"이고, 필요한 매개변수는 도시 이름과 온도 단위(섭씨 또는 화씨)이다. 이렇게 함수를 정의하면, LLM은 이 함수가 무엇을 하는지 이해하고, 언제 사용해야 하는지 판단할 수 있다.
```python
functions = [
    {
        "name": "get_weather",
        "description": "특정 도시의 현재 날씨 정보를 조회합니다",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "도시 이름, 예: 서울, 부산"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "온도 단위"
                }
            },
            "required": ["city"]
        }
    }
]
```

**2단계: LLM 호출**

함수를 정의했으면, 이제 사용자의 질문과 함께 함수 목록을 LLM에게 전달한다. 예를 들어 사용자가 "서울 날씨가 어때?"라고 물어보면, 이 질문과 함께 앞서 정의한 함수 목록을 LLM에게 보낸다. LLM은 질문을 분석해서 "이 질문에 답하려면 날씨 정보가 필요하구나"라고 판단하고, 자동으로 날씨 조회 함수를 선택한다. 그리고 필요한 매개변수인 도시 이름("서울")을 추출해서 함수 호출 형식으로 반환한다. 이때 LLM은 실제로 함수를 실행하지 않고, "이 함수를 호출해야 한다"는 정보만 반환한다.
```python
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "서울 날씨가 어때?"}
    ],
    functions=functions,
    function_call="auto"  # LLM이 자동으로 함수 호출 결정
)
```

**3단계: 함수 실행**

LLM이 함수 호출을 요청하면, 이제 애플리케이션이 실제로 함수를 실행한다. LLM이 반환한 함수 이름과 매개변수를 받아서, 실제 날씨 API를 호출하거나 데이터베이스를 조회하는 등의 작업을 수행한다. 이 단계는 LLM이 아닌 애플리케이션이 담당한다. 왜냐하면 실제 외부 시스템과 상호작용하는 것은 보안상 애플리케이션에서 직접 제어해야 하기 때문이다. 마치 요리사가 "칼을 사용하세요"라고 말하면, 실제로 칼을 사용하는 것은 요리사 본인이 하는 것과 같다.
```python
if response.choices[0].message.get("function_call"):
    function_name = response.choices[0].message["function_call"]["name"]
    function_args = json.loads(
        response.choices[0].message["function_call"]["arguments"]
    )
    
    # 실제 함수 실행
    if function_name == "get_weather":
        result = get_weather(
            city=function_args["city"],
            unit=function_args.get("unit", "celsius")
        )
```

**4단계: 결과 반환 및 최종 답변**

함수를 실행한 결과를 다시 LLM에게 전달한다. 예를 들어 날씨 API를 호출해서 "서울의 현재 온도는 15도, 맑음"이라는 정보를 받았다면, 이 정보를 LLM에게 전달한다. 그러면 LLM은 이 정보를 바탕으로 사용자에게 친절하고 자연스러운 답변을 생성한다. "서울의 현재 날씨는 맑고 온도는 15도입니다. 가벼운 옷차림으로 외출하시기 좋은 날씨네요!" 같은 식으로 말이다. 이렇게 해서 사용자는 단순히 데이터를 받는 것이 아니라, LLM이 이해하고 해석한 자연스러운 답변을 받을 수 있다.
```python
# 함수 실행 결과를 LLM에 전달
messages.append({
    "role": "function",
    "name": function_name,
    "content": json.dumps(result)
})

# 최종 답변 생성
final_response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=messages
)
```

## 주요 LLM 제공업체별 구현

Function Calling은 개념은 비슷하지만, 각 LLM 제공업체마다 구현 방식이 조금씩 다르다. 마치 같은 요리를 만들지만 각 요리사마다 레시피가 다른 것과 같다. 주요 제공업체인 OpenAI, Anthropic, Google의 구현 방식을 하나씩 살펴보자.

### OpenAI: Functions API

OpenAI는 2023년 6월에 Functions API를 도입했다. 이는 GPT-3.5-turbo와 GPT-4에서 지원되며, 가장 널리 사용되는 Function Calling 구현 방식 중 하나다. OpenAI의 방식은 비교적 직관적이고 사용하기 쉬워서, 많은 개발자들이 처음 접하는 Function Calling 방식이다.

**기본 사용법**
```python
import openai
import json

# 함수 정의
functions = [
    {
        "name": "calculate",
        "description": "수학 계산을 수행합니다",
        "parameters": {
            "type": "object",
            "properties": {
                "expression": {
                    "type": "string",
                    "description": "계산할 수식, 예: 2+2, 10*5"
                }
            },
            "required": ["expression"]
        }
    }
]

# LLM 호출
response = openai.ChatCompletion.create(
    model="gpt-4",
    messages=[
        {"role": "user", "content": "123 곱하기 456은 얼마야?"}
    ],
    functions=functions,
    function_call="auto"
)

# 함수 호출 확인
message = response.choices[0].message
if message.get("function_call"):
    function_name = message["function_call"]["name"]
    args = json.loads(message["function_call"]["arguments"])
    
    # 함수 실행
    if function_name == "calculate":
        result = eval(args["expression"])  # 실제로는 안전한 계산기 사용
        
        # 결과를 LLM에 전달
        messages = [
            {"role": "user", "content": "123 곱하기 456은 얼마야?"},
            message,
            {
                "role": "function",
                "name": function_name,
                "content": str(result)
            }
        ]
        
        # 최종 답변
        final_response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            functions=functions
        )
        print(final_response.choices[0].message.content)
```

**함수 호출 제어**
```python
# 자동 결정 (기본값)
function_call="auto"

# 특정 함수만 호출
function_call={"name": "get_weather"}

# 함수 호출 금지
function_call="none"
```

### Anthropic: Tool Use (Claude)

Anthropic의 Claude는 Tool Use라는 이름으로 유사한 기능을 제공한다. 구조는 OpenAI와 조금 다르지만 기본 개념은 동일하다. Claude의 Tool Use는 여러 도구를 동시에 사용할 수 있다는 특징이 있다. 예를 들어 날씨를 조회하면서 동시에 주식 가격도 조회할 수 있다. 이는 OpenAI가 한 번에 하나의 함수만 호출할 수 있는 것과 대조적이다. 마치 한 손에 칼을, 다른 손에 도마를 동시에 사용할 수 있는 것과 같다.

**기본 사용법**
```python
import anthropic

client = anthropic.Anthropic()

# 도구 정의
tools = [
    {
        "name": "get_stock_price",
        "description": "주식 가격을 조회합니다",
        "input_schema": {
            "type": "object",
            "properties": {
                "symbol": {
                    "type": "string",
                    "description": "주식 심볼, 예: AAPL, TSLA"
                }
            },
            "required": ["symbol"]
        }
    }
]

# 메시지 전송
message = client.messages.create(
    model="claude-3-opus-20240229",
    max_tokens=1024,
    tools=tools,
    messages=[
        {"role": "user", "content": "애플 주식 가격이 얼마야?"}
    ]
)

# 도구 사용 확인
for content_block in message.content:
    if content_block.type == "tool_use":
        tool_name = content_block.name
        tool_input = content_block.input
        
        # 도구 실행
        if tool_name == "get_stock_price":
            result = get_stock_price(tool_input["symbol"])
            
            # 결과를 Claude에 전달
            follow_up = client.messages.create(
                model="claude-3-opus-20240229",
                max_tokens=1024,
                tools=tools,
                messages=[
                    {"role": "user", "content": "애플 주식 가격이 얼마야?"},
                    message,
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "tool_result",
                                "tool_use_id": content_block.id,
                                "content": str(result)
                            }
                        ]
                    }
                ]
            )
            print(follow_up.content[0].text)
```

**Claude의 특징**
- `tool_use` 블록으로 도구 사용 표현
- `tool_use_id`로 도구와 결과 매칭
- 여러 도구를 동시에 사용 가능

### Google: Function Calling (Gemini)

Google의 Gemini도 Function Calling을 지원한다. Gemini는 Google의 대규모 언어 모델로, Function Calling 기능을 통해 외부 도구와 상호작용할 수 있다. Gemini의 구현 방식은 OpenAI와 유사하지만, Google의 생태계와 잘 통합되어 있다는 특징이 있다. 예를 들어 Google의 다양한 API와 쉽게 연동할 수 있다.

**기본 사용법**
```python
import google.generativeai as genai

genai.configure(api_key="your-api-key")

# 함수 정의
functions = [
    {
        "name": "search_web",
        "description": "웹 검색을 수행합니다",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "검색 쿼리"
                }
            },
            "required": ["query"]
        }
    }
]

# 모델 생성
model = genai.GenerativeModel(
    model_name="gemini-pro",
    tools=[{"function_declarations": functions}]
)

# 대화 시작
chat = model.start_chat()
response = chat.send_message("최신 AI 뉴스를 검색해줘")

# 함수 호출 처리
for candidate in response.candidates:
    if candidate.content.parts:
        for part in candidate.content.parts:
            if hasattr(part, "function_call"):
                function_name = part.function_call.name
                args = dict(part.function_call.args)
                
                # 함수 실행
                if function_name == "search_web":
                    result = search_web(args["query"])
                    
                    # 결과 반환
                    chat.send_message({
                        "function_response": {
                            "name": function_name,
                            "response": result
                        }
                    })
                    
                    # 최종 답변
                    final_response = chat.send_message("결과를 요약해줘")
                    print(final_response.text)
```

## 실전 활용 예시

이제 Function Calling을 실제로 어떻게 활용할 수 있는지 구체적인 예시를 통해 알아보자. 각 예시는 실제로 사용할 수 있는 코드와 함께 설명하므로, 직접 따라해볼 수 있다.

### 예시 1: 날씨 정보 조회 Agent

가장 간단하고 이해하기 쉬운 예시로 날씨 정보를 조회하는 Agent를 만들어보자. 사용자가 "서울 날씨가 어때?"라고 물어보면, Agent는 자동으로 날씨 API를 호출해서 현재 날씨 정보를 가져오고, 그 정보를 바탕으로 친절하게 답변한다. 이 예시를 통해 Function Calling의 전체 흐름을 이해할 수 있다.

```python
import openai
import json
import requests

def get_weather(city: str, unit: str = "celsius") -> dict:
    """실제 날씨 API 호출 (예시)"""
    api_key = "your-weather-api-key"
    url = f"https://api.weather.com/v1/current?city={city}&unit={unit}&key={api_key}"
    response = requests.get(url)
    return response.json()

# 함수 정의
functions = [
    {
        "name": "get_weather",
        "description": "특정 도시의 현재 날씨와 예보를 조회합니다",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {
                    "type": "string",
                    "description": "도시 이름"
                },
                "unit": {
                    "type": "string",
                    "enum": ["celsius", "fahrenheit"],
                    "description": "온도 단위"
                }
            },
            "required": ["city"]
        }
    }
]

def weather_agent(user_query: str) -> str:
    """날씨 조회 Agent"""
    messages = [{"role": "user", "content": user_query}]
    
    while True:
        # LLM 호출
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            functions=functions,
            function_call="auto"
        )
        
        message = response.choices[0].message
        messages.append(message)
        
        # 함수 호출이 있는 경우
        if message.get("function_call"):
            function_name = message["function_call"]["name"]
            function_args = json.loads(message["function_call"]["arguments"])
            
            # 함수 실행
            if function_name == "get_weather":
                function_response = get_weather(
                    city=function_args["city"],
                    unit=function_args.get("unit", "celsius")
                )
                
                # 결과를 메시지에 추가
                messages.append({
                    "role": "function",
                    "name": function_name,
                    "content": json.dumps(function_response)
                })
            else:
                break
        else:
            # 최종 답변 반환
            return message.content
    
    return "날씨 정보를 가져올 수 없습니다."

# 사용 예시
result = weather_agent("서울과 부산 날씨 비교해줘")
print(result)
```

### 예시 2: 데이터베이스 조회 Agent

데이터베이스에 저장된 정보를 조회하는 것도 Function Calling의 중요한 활용 사례다. 사용자가 자연어로 질문하면, Agent는 자동으로 적절한 SQL 쿼리를 생성하고 실행해서 결과를 가져온다. 예를 들어 "나이가 30세 이상인 사용자 수를 알려줘"라고 물어보면, Agent는 데이터베이스 스키마를 참고해서 적절한 SQL 쿼리를 만들고, 실행해서 결과를 사용자에게 알려준다. 이렇게 하면 기술적인 SQL 지식이 없는 사용자도 데이터베이스에서 정보를 쉽게 조회할 수 있다.

```python
import sqlite3
import openai
import json

def execute_query(query: str) -> list:
    """SQL 쿼리 실행"""
    conn = sqlite3.connect("database.db")
    cursor = conn.cursor()
    cursor.execute(query)
    results = cursor.fetchall()
    conn.close()
    return results

# 함수 정의
functions = [
    {
        "name": "execute_sql_query",
        "description": "데이터베이스에 SQL 쿼리를 실행합니다",
        "parameters": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "실행할 SQL 쿼리"
                }
            },
            "required": ["query"]
        }
    }
]

def db_agent(user_query: str, schema: str) -> str:
    """데이터베이스 조회 Agent"""
    system_message = f"""
    당신은 데이터베이스 쿼리 전문가입니다.
    다음 스키마를 참고하여 사용자의 질문에 답하기 위한 SQL 쿼리를 작성하세요.
    
    스키마:
    {schema}
    """
    
    messages = [
        {"role": "system", "content": system_message},
        {"role": "user", "content": user_query}
    ]
    
    while True:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            functions=functions,
            function_call="auto"
        )
        
        message = response.choices[0].message
        messages.append(message)
        
        if message.get("function_call"):
            function_name = message["function_call"]["name"]
            function_args = json.loads(message["function_call"]["arguments"])
            
            if function_name == "execute_sql_query":
                try:
                    query_results = execute_query(function_args["query"])
                    messages.append({
                        "role": "function",
                        "name": function_name,
                        "content": json.dumps(query_results)
                    })
                except Exception as e:
                    messages.append({
                        "role": "function",
                        "name": function_name,
                        "content": f"에러: {str(e)}"
                    })
            else:
                break
        else:
            return message.content
    
    return "쿼리를 실행할 수 없습니다."

# 사용 예시
schema = """
CREATE TABLE users (
    id INTEGER PRIMARY KEY,
    name TEXT,
    email TEXT,
    age INTEGER
);
"""

result = db_agent("나이가 30세 이상인 사용자 수를 알려줘", schema)
print(result)
```

### 예시 3: 여러 도구를 사용하는 Agent

실제로 유용한 Agent는 여러 도구를 조합해서 사용한다. 예를 들어 날씨를 확인하고, 캘린더 일정을 확인하고, 그 결과를 이메일로 보내는 것처럼, 여러 작업을 순차적으로 수행할 수 있다. 이 예시에서는 날씨 조회, 캘린더 조회, 이메일 전송 세 가지 함수를 정의하고, Agent가 사용자의 요청에 따라 적절한 함수들을 순차적으로 호출하는 방법을 보여준다. 이렇게 하면 복잡한 작업도 자연어로 간단하게 요청할 수 있다.

```python
import openai
import json
import requests
from datetime import datetime

def get_weather(city: str) -> dict:
    """날씨 조회"""
    # 실제 API 호출
    return {"temperature": 20, "condition": "맑음"}

def get_calendar_events(date: str) -> list:
    """캘린더 이벤트 조회"""
    # 실제 캘린더 API 호출
    return [{"title": "회의", "time": "14:00"}]

def send_email(to: str, subject: str, body: str) -> dict:
    """이메일 전송"""
    # 실제 이메일 API 호출
    return {"status": "sent"}

# 여러 함수 정의
functions = [
    {
        "name": "get_weather",
        "description": "도시의 날씨 정보를 조회합니다",
        "parameters": {
            "type": "object",
            "properties": {
                "city": {"type": "string"}
            },
            "required": ["city"]
        }
    },
    {
        "name": "get_calendar_events",
        "description": "특정 날짜의 캘린더 이벤트를 조회합니다",
        "parameters": {
            "type": "object",
            "properties": {
                "date": {"type": "string", "description": "YYYY-MM-DD 형식"}
            },
            "required": ["date"]
        }
    },
    {
        "name": "send_email",
        "description": "이메일을 전송합니다",
        "parameters": {
            "type": "object",
            "properties": {
                "to": {"type": "string"},
                "subject": {"type": "string"},
                "body": {"type": "string"}
            },
            "required": ["to", "subject", "body"]
        }
    }
]

def multi_tool_agent(user_query: str) -> str:
    """여러 도구를 사용하는 Agent"""
    messages = [{"role": "user", "content": user_query}]
    
    max_iterations = 10
    iteration = 0
    
    while iteration < max_iterations:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=messages,
            functions=functions,
            function_call="auto"
        )
        
        message = response.choices[0].message
        messages.append(message)
        
        if message.get("function_call"):
            function_name = message["function_call"]["name"]
            function_args = json.loads(message["function_call"]["arguments"])
            
            # 함수 실행
            if function_name == "get_weather":
                result = get_weather(function_args["city"])
            elif function_name == "get_calendar_events":
                result = get_calendar_events(function_args["date"])
            elif function_name == "send_email":
                result = send_email(
                    function_args["to"],
                    function_args["subject"],
                    function_args["body"]
                )
            else:
                break
            
            messages.append({
                "role": "function",
                "name": function_name,
                "content": json.dumps(result)
            })
            
            iteration += 1
        else:
            return message.content
    
    return "최대 반복 횟수에 도달했습니다."

# 사용 예시
result = multi_tool_agent(
    "오늘 서울 날씨 확인하고, 오늘 일정도 확인한 다음, "
    "결과를 이메일로 보내줘 (to: user@example.com)"
)
print(result)
```

## LangChain과의 통합

LangChain은 Function Calling을 쉽게 사용할 수 있게 해준다.

```python
from langchain.agents import initialize_agent, Tool
from langchain.llms import OpenAI
from langchain.utilities import SerpAPIWrapper

# 검색 도구
search = SerpAPIWrapper()
search_tool = Tool(
    name="Search",
    func=search.run,
    description="최신 정보를 검색하는 데 사용합니다"
)

# 계산 도구
def calculator(expression: str) -> str:
    """수학 계산"""
    try:
        result = eval(expression)
        return str(result)
    except:
        return "계산 오류"

calc_tool = Tool(
    name="Calculator",
    func=calculator,
    description="수학 계산을 수행하는 데 사용합니다"
)

# Agent 초기화
llm = OpenAI(temperature=0)
agent = initialize_agent(
    [search_tool, calc_tool],
    llm,
    agent="zero-shot-react-description",
    verbose=True
)

# 실행
result = agent.run("2024년 한국 인구수를 검색하고, 2023년 대비 증가율을 계산해줘")
print(result)
```

## 모범 사례

Function Calling을 효과적으로 사용하려면 몇 가지 모범 사례를 따르는 것이 중요하다. 이렇게 하면 LLM이 더 정확하게 함수를 선택하고, 더 나은 결과를 얻을 수 있다.

### 1. 함수 설명 작성

함수 설명이 명확해야 LLM이 올바른 함수를 선택한다. 이는 마치 요리사에게 도구를 설명할 때, "이건 칼이에요"라고만 말하는 것보다 "이건 고기를 자르는 칼이에요"라고 구체적으로 설명하는 것이 더 나은 것과 같다. 함수 설명이 모호하면 LLM이 잘못된 함수를 선택하거나, 아예 함수를 사용하지 않을 수 있다. 따라서 함수가 무엇을 하는지, 언제 사용해야 하는지, 어떤 매개변수가 필요한지를 명확하게 설명해야 한다.

**나쁜 예시**
```python
{
    "name": "get_data",
    "description": "데이터를 가져옵니다"  # 너무 모호함
}
```

**좋은 예시**
```python
{
    "name": "get_user_profile",
    "description": "사용자 ID를 받아 해당 사용자의 프로필 정보(이름, 이메일, 가입일)를 반환합니다. 사용자가 존재하지 않으면 None을 반환합니다."
}
```

### 2. 매개변수 타입 명시

함수의 매개변수 타입을 정확히 정의하는 것도 중요하다. JSON Schema를 사용해서 각 매개변수가 어떤 타입인지(문자열, 숫자, 불린 등), 어떤 값이 허용되는지, 어떤 값이 필수인지를 명확하게 지정해야 한다. 이렇게 하면 LLM이 올바른 형식의 매개변수를 생성할 수 있다. 예를 들어 사용자 ID가 1 이상의 정수여야 한다면, 이를 명확히 지정해야 LLM이 음수나 문자열을 전달하지 않는다.

```python
{
    "type": "object",
    "properties": {
        "user_id": {
            "type": "integer",
            "description": "사용자 고유 ID (1 이상의 정수)"
        },
        "include_history": {
            "type": "boolean",
            "description": "구매 이력을 포함할지 여부"
        }
    },
    "required": ["user_id"]
}
```

### 3. 에러 처리

함수 실행 중 에러가 발생할 수 있으므로 적절히 처리해야 한다. 예를 들어 날씨 API가 일시적으로 사용할 수 없거나, 데이터베이스 연결이 끊어질 수 있다. 이런 경우 에러 메시지를 LLM에게 전달하면, LLM은 사용자에게 친절하게 상황을 설명하거나, 대안을 제시할 수 있다. 마치 요리 중에 재료가 없으면 요리사가 다른 재료를 사용하거나 사용자에게 알려주는 것과 같다.

```python
def safe_function_call(function_name: str, args: dict):
    """안전한 함수 호출"""
    try:
        if function_name == "get_weather":
            return get_weather(args["city"])
        # ...
    except KeyError as e:
        return {"error": f"필수 매개변수 누락: {e}"}
    except Exception as e:
        return {"error": f"함수 실행 실패: {str(e)}"}
```

### 4. 반복 제한

Function Calling을 사용할 때는 무한 루프를 방지하기 위해 반복 횟수를 제한하는 것이 중요하다. 예를 들어 Agent가 계속해서 함수를 호출하려고 시도하거나, 잘못된 함수를 반복적으로 호출할 수 있다. 이런 경우 최대 반복 횟수를 설정해서, 일정 횟수 이상 반복되면 자동으로 중단하도록 해야 한다. 마치 요리사가 같은 실수를 계속 반복하지 않도록 제한하는 것과 같다.

```python
max_iterations = 10
iteration = 0

while iteration < max_iterations:
    # ... 함수 호출 로직
    iteration += 1
    if not message.get("function_call"):
        break
```

### 5. 결과 검증

함수 실행 결과를 검증하고 LLM에 적절한 형식으로 전달하는 것도 중요하다. 함수가 반환한 결과가 예상과 다를 수 있거나, 형식이 맞지 않을 수 있다. 따라서 결과를 검증하고, 필요하면 포맷을 변환해서 LLM이 이해하기 쉬운 형식으로 전달해야 한다. 예를 들어 복잡한 객체를 JSON 문자열로 변환하거나, 에러 메시지를 명확하게 포맷팅하는 것이 필요하다.

```python
def validate_and_format_result(result):
    """결과 검증 및 포맷팅"""
    if isinstance(result, dict):
        return json.dumps(result, ensure_ascii=False)
    elif isinstance(result, list):
        return json.dumps(result, ensure_ascii=False)
    else:
        return str(result)
```

## 주의사항과 한계

Function Calling은 강력한 기능이지만, 사용할 때 주의해야 할 사항들이 있다. 이들을 미리 알고 있으면 더 안전하고 효과적으로 사용할 수 있다.

### 1. 보안 위험

함수 호출은 보안 위험이 있다. 특히 코드 실행 함수는 주의해야 한다. LLM이 생성한 코드나 쿼리가 악의적일 수 있거나, 시스템에 해를 끼칠 수 있다. 예를 들어 SQL 쿼리를 실행하는 함수가 있다면, LLM이 생성한 쿼리가 데이터베이스를 삭제하거나 민감한 정보를 노출할 수 있다. 따라서 신뢰할 수 있는 함수만 제공하고, 입력을 검증하며, 가능하면 샌드박스 환경에서 실행하는 것이 좋다. 마치 위험한 도구를 사용할 때 안전 장치를 갖추는 것과 같다.

**대응 방안**
- 신뢰할 수 있는 함수만 제공
- 입력 검증 및 샌드박싱
- 권한 제어

### 2. 비용 증가

함수 호출은 추가 LLM 호출로 비용이 증가한다. 일반적인 대화에서는 한 번의 LLM 호출로 충분하지만, Function Calling을 사용하면 함수를 호출하기 전에 한 번, 함수 결과를 받은 후 최종 답변을 생성하기 위해 또 한 번 호출해야 한다. 따라서 여러 함수를 호출하거나 복잡한 작업을 수행하면 비용이 빠르게 증가할 수 있다. 따라서 필요한 경우에만 함수를 호출하고, 결과를 캐싱해서 재사용하는 등의 최적화가 필요하다.

**대응 방안**
- 필요한 경우에만 함수 호출
- 결과 캐싱
- 저렴한 모델 사용

### 3. 지연 시간

함수 실행으로 인해 응답 시간이 늘어난다. LLM이 답변을 생성하는 것보다, 외부 API를 호출하거나 데이터베이스를 조회하는 것이 더 오래 걸릴 수 있다. 예를 들어 날씨 API가 2초가 걸리고, 데이터베이스 조회가 1초가 걸린다면, 전체 응답 시간은 최소 3초 이상이 된다. 따라서 비동기 처리를 사용하거나, 병렬로 여러 함수를 실행하거나, 타임아웃을 설정하는 등의 최적화가 필요하다.

**대응 방안**
- 비동기 처리
- 병렬 함수 실행
- 타임아웃 설정

### 4. 함수 선택 오류

LLM이 잘못된 함수를 선택할 수 있다. 예를 들어 날씨를 물어봤는데 주식 가격 조회 함수를 호출하거나, 아예 함수를 호출하지 않고 학습 데이터에 있는 정보로 답변할 수 있다. 이런 문제를 줄이려면 함수 설명을 명확하게 작성하고, Few-shot 예시를 제공하고, 함수 호출 결과를 검증하는 것이 중요하다. 또한 사용자에게 함수 호출이 실패했거나 잘못된 함수가 호출되었음을 알려주는 것도 좋다.

**대응 방안**
- 명확한 함수 설명
- Few-shot 예시 제공
- 함수 호출 검증

## FAQ

**Q: Function Calling과 Tool Use의 차이는?**  
A: 개념은 동일하지만 제공업체별로 용어가 다릅니다. OpenAI는 "Function Calling", Anthropic은 "Tool Use", Google은 "Function Calling"을 사용합니다.

**Q: 모든 LLM이 Function Calling을 지원하나요?**  
A: 아닙니다. GPT-3.5-turbo 이상, Claude 3 이상, Gemini Pro 이상에서 지원합니다. 오픈소스 모델 중에서는 일부만 지원합니다.

**Q: 함수를 동적으로 추가할 수 있나요?**  
A: 가능합니다. 각 LLM 호출 시 functions 파라미터에 함수 목록을 전달하면 됩니다.

**Q: 함수 호출을 강제할 수 있나요?**  
A: 가능합니다. OpenAI의 경우 `function_call={"name": "function_name"}`으로 특정 함수 호출을 강제할 수 있습니다.

**Q: 여러 함수를 동시에 호출할 수 있나요?**  
A: 모델에 따라 다릅니다. Claude는 여러 도구를 동시에 사용할 수 있지만, OpenAI는 한 번에 하나의 함수만 호출합니다.

**Q: 함수 호출 실패 시 어떻게 하나요?**  
A: 에러 메시지를 LLM에 전달하면 LLM이 대안을 제시하거나 사용자에게 알릴 수 있습니다.

## 결론

Function Calling과 Tool Use는 LLM이 실제 도구를 사용할 수 있게 해주는 핵심 기술이다. 이 기술 덕분에 LLM은 단순히 텍스트를 생성하는 것을 넘어서, 날씨를 조회하고, 데이터베이스를 쿼리하고, 계산을 수행하는 등 실제로 유용한 작업을 할 수 있게 되었다. 마치 도서관에 갇혀 있던 사람에게 외부 세계와 소통할 수 있는 능력을 부여한 것과 같다.

주요 LLM 제공업체인 OpenAI, Anthropic, Google이 각각 유사한 기능을 제공하고 있으며, LangChain 같은 프레임워크를 통해 더 쉽게 활용할 수 있다. 각 제공업체의 구현 방식은 조금씩 다르지만, 기본 개념은 동일하므로 한 가지를 배우면 다른 것도 쉽게 이해할 수 있다.

실무에서는 함수 설명을 명확히 작성하고, 에러 처리를 철저히 하며, 보안을 고려해 신뢰할 수 있는 함수만 제공하는 것이 중요하다. 또한 비용과 성능을 고려해서 최적화하는 것도 필요하다. Function Calling을 올바르게 활용하면 LLM의 활용 범위를 크게 확장할 수 있고, 더 유용하고 실용적인 AI 애플리케이션을 만들 수 있다. 처음에는 어려울 수 있지만, 하나씩 배워가다 보면 점점 익숙해지고, 자신만의 노하우를 쌓을 수 있을 것이다.

