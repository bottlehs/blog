---
templateKey: blog-post
title: LLM 추론 최적화 - KV Cache, Quantization, Speculative Decoding
date: 2025-11-28T00:00:00.000Z
category: ai
description:
  LLM 추론 성능을 최적화하는 핵심 기술들을 실전 예제와 함께 정리합니다. KV Cache, Quantization, Speculative Decoding, 배치 처리, 모델 병렬화 등 모든 최적화 기법을 다룹니다.
tags:
  - LLM
  - 추론 최적화
  - KV Cache
  - Quantization
  - Speculative Decoding
  - AI
  - 성능 최적화
  - 모델 서빙
---

# LLM 추론 최적화 - KV Cache, Quantization, Speculative Decoding

LLM 추론은 계산 집약적이고 메모리를 많이 사용한다. 프로덕션 환경에서 LLM을 효율적으로 서빙하려면 다양한 최적화 기법이 필요하다. 이 글은 KV Cache, Quantization, Speculative Decoding 등 핵심 최적화 기술을 실전 예제와 함께 정리한다.

## 1. LLM 추론의 기본 구조

### 1-1. Transformer 추론 과정

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

# 모델 로드
model = AutoModelForCausalLM.from_pretrained("gpt2")
tokenizer = AutoTokenizer.from_pretrained("gpt2")

# 기본 추론
def basic_inference(prompt: str, max_length: int = 100):
    inputs = tokenizer(prompt, return_tensors="pt")
    
    # 각 토큰 생성마다 전체 모델을 통과
    outputs = model.generate(
        inputs.input_ids,
        max_length=max_length,
        do_sample=True,
        temperature=0.7
    )
    
    return tokenizer.decode(outputs[0], skip_special_tokens=True)
```

### 1-2. 추론의 병목 지점

LLM 추론의 주요 병목 지점:

1. **메모리 사용량**: 모델 파라미터와 중간 활성화 값 저장
2. **계산량**: Attention 메커니즘의 O(n²) 복잡도
3. **메모리 대역폭**: GPU 메모리 접근 속도
4. **순차적 생성**: 토큰을 하나씩 생성하는 특성

## 2. KV Cache 최적화

### 2-1. KV Cache 개념

KV Cache는 이전 토큰들의 Key와 Value를 캐싱하여 반복 계산을 피하는 기법이다.

```python
import torch
import torch.nn as nn
from transformers import GPT2LMHeadModel

class OptimizedGPT2Inference:
    def __init__(self, model_name: str = "gpt2"):
        self.model = GPT2LMHeadModel.from_pretrained(model_name)
        self.tokenizer = AutoTokenizer.from_pretrained(model_name)
        self.kv_cache = None
    
    def generate_with_kv_cache(self, prompt: str, max_new_tokens: int = 50):
        inputs = self.tokenizer(prompt, return_tensors="pt")
        input_ids = inputs.input_ids
        
        # 초기 KV Cache 생성
        past_key_values = None
        generated_ids = input_ids.clone()
        
        for _ in range(max_new_tokens):
            # KV Cache를 활용한 추론
            outputs = self.model(
                input_ids=generated_ids[:, -1:],  # 마지막 토큰만 입력
                past_key_values=past_key_values,    # 이전 KV Cache 사용
                use_cache=True
            )
            
            # 새로운 KV Cache 업데이트
            past_key_values = outputs.past_key_values
            
            # 다음 토큰 선택
            next_token_logits = outputs.logits[0, -1, :]
            next_token_id = torch.argmax(next_token_logits, dim=-1).unsqueeze(0)
            
            # 생성된 토큰 추가
            generated_ids = torch.cat([generated_ids, next_token_id.unsqueeze(0)], dim=1)
        
        return self.tokenizer.decode(generated_ids[0], skip_special_tokens=True)
```

### 2-2. KV Cache 구현 상세

```python
class KVCache:
    def __init__(self, num_layers: int, batch_size: int, seq_len: int, hidden_size: int, num_heads: int):
        self.num_layers = num_layers
        self.cache = {}
        
        # 각 레이어별 Key, Value 캐시 초기화
        for layer_idx in range(num_layers):
            self.cache[f"layer_{layer_idx}_key"] = torch.zeros(
                batch_size, num_heads, seq_len, hidden_size // num_heads
            )
            self.cache[f"layer_{layer_idx}_value"] = torch.zeros(
                batch_size, num_heads, seq_len, hidden_size // num_heads
            )
    
    def update(self, layer_idx: int, new_key: torch.Tensor, new_value: torch.Tensor):
        """새로운 Key, Value로 캐시 업데이트"""
        old_key = self.cache[f"layer_{layer_idx}_key"]
        old_value = self.cache[f"layer_{layer_idx}_value"]
        
        # 기존 캐시와 새로운 값 연결
        self.cache[f"layer_{layer_idx}_key"] = torch.cat([old_key, new_key], dim=2)
        self.cache[f"layer_{layer_idx}_value"] = torch.cat([old_value, new_value], dim=2)
    
    def get(self, layer_idx: int):
        """특정 레이어의 Key, Value 반환"""
        return (
            self.cache[f"layer_{layer_idx}_key"],
            self.cache[f"layer_{layer_idx}_value"]
        )
```

### 2-3. KV Cache 성능 비교

```python
import time

def benchmark_inference(model, tokenizer, prompt: str, use_cache: bool = True):
    inputs = tokenizer(prompt, return_tensors="pt")
    
    start_time = time.time()
    
    if use_cache:
        # KV Cache 사용
        past_key_values = None
        generated_ids = inputs.input_ids
        
        for _ in range(50):
            outputs = model(
                input_ids=generated_ids[:, -1:],
                past_key_values=past_key_values,
                use_cache=True
            )
            past_key_values = outputs.past_key_values
            next_token = torch.argmax(outputs.logits[0, -1, :]).unsqueeze(0)
            generated_ids = torch.cat([generated_ids, next_token.unsqueeze(0)], dim=1)
    else:
        # KV Cache 미사용 (전체 시퀀스 재계산)
        generated_ids = inputs.input_ids
        for _ in range(50):
            outputs = model(input_ids=generated_ids)
            next_token = torch.argmax(outputs.logits[0, -1, :]).unsqueeze(0)
            generated_ids = torch.cat([generated_ids, next_token.unsqueeze(0)], dim=1)
    
    elapsed_time = time.time() - start_time
    return elapsed_time, generated_ids

# 성능 비교
prompt = "The future of AI is"
time_with_cache, _ = benchmark_inference(model, tokenizer, prompt, use_cache=True)
time_without_cache, _ = benchmark_inference(model, tokenizer, prompt, use_cache=False)

print(f"KV Cache 사용: {time_with_cache:.2f}초")
print(f"KV Cache 미사용: {time_without_cache:.2f}초")
print(f"속도 향상: {time_without_cache / time_with_cache:.2f}x")
```

## 3. Quantization (양자화)

### 3-1. 양자화 개념

양자화는 모델의 가중치와 활성화 값을 낮은 비트로 변환하여 메모리 사용량과 계산 속도를 개선하는 기법이다.

```python
from transformers import AutoModelForCausalLM, BitsAndBytesConfig
import torch

# 8-bit 양자화 설정
quantization_config = BitsAndBytesConfig(
    load_in_8bit=True,
    llm_int8_threshold=6.0,
    llm_int8_has_fp16_weight=False
)

# 양자화된 모델 로드
model_8bit = AutoModelForCausalLM.from_pretrained(
    "gpt2",
    quantization_config=quantization_config,
    device_map="auto"
)

# 4-bit 양자화 설정
quantization_config_4bit = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_compute_dtype=torch.float16,
    bnb_4bit_use_double_quant=True,
    bnb_4bit_quant_type="nf4"
)

model_4bit = AutoModelForCausalLM.from_pretrained(
    "gpt2",
    quantization_config=quantization_config_4bit,
    device_map="auto"
)
```

### 3-2. 동적 양자화

```python
import torch.quantization as quant

# 모델 준비
model.eval()

# 양자화 설정
model.qconfig = quant.get_default_qconfig('fbgemm')

# 양자화 준비
quant.prepare(model, inplace=True)

# 캘리브레이션 데이터로 양자화
calibration_data = torch.randn(100, 10)
with torch.no_grad():
    for i in range(10):
        model(calibration_data)

# 양자화 변환
quant.convert(model, inplace=True)
```

### 3-3. GPTQ 양자화

```python
from auto_gptq import AutoGPTQForCausalLM, BaseQuantizeConfig

# GPTQ 양자화 설정
quantize_config = BaseQuantizeConfig(
    bits=4,
    group_size=128,
    desc_act=False
)

# 모델 양자화
model = AutoGPTQForCausalLM.from_pretrained(
    "gpt2",
    quantize_config=quantize_config
)

# 양자화 실행
examples = [
    tokenizer("Hello, how are you?", return_tensors="pt")
    for _ in range(100)
]

model.quantize(examples)

# 양자화된 모델 저장
model.save_quantized("./gpt2-4bit")
```

### 3-4. 양자화 성능 비교

```python
import torch

def measure_memory_usage(model, input_ids):
    torch.cuda.reset_peak_memory_stats()
    _ = model(input_ids)
    memory_used = torch.cuda.max_memory_allocated() / 1024**3  # GB
    return memory_used

# 원본 모델
original_model = AutoModelForCausalLM.from_pretrained("gpt2").cuda()
original_memory = measure_memory_usage(original_model, input_ids)

# 8-bit 양자화 모델
model_8bit = AutoModelForCausalLM.from_pretrained(
    "gpt2",
    quantization_config=quantization_config,
    device_map="auto"
)
memory_8bit = measure_memory_usage(model_8bit, input_ids)

# 4-bit 양자화 모델
model_4bit = AutoModelForCausalLM.from_pretrained(
    "gpt2",
    quantization_config=quantization_config_4bit,
    device_map="auto"
)
memory_4bit = measure_memory_usage(model_4bit, input_ids)

print(f"원본 모델: {original_memory:.2f} GB")
print(f"8-bit 양자화: {memory_8bit:.2f} GB ({original_memory/memory_8bit:.2f}x 감소)")
print(f"4-bit 양자화: {memory_4bit:.2f} GB ({original_memory/memory_4bit:.2f}x 감소)")
```

## 4. Speculative Decoding

### 4-1. Speculative Decoding 개념

Speculative Decoding은 작은 모델로 여러 토큰을 예측하고, 큰 모델로 검증하여 병렬 처리를 가능하게 하는 기법이다.

```python
class SpeculativeDecoder:
    def __init__(self, draft_model, target_model, tokenizer):
        self.draft_model = draft_model  # 작은 모델
        self.target_model = target_model  # 큰 모델
        self.tokenizer = tokenizer
    
    def generate(self, prompt: str, max_tokens: int = 50, gamma: int = 4):
        """
        gamma: 추측할 토큰 수
        """
        input_ids = self.tokenizer(prompt, return_tensors="pt").input_ids
        generated_ids = input_ids.clone()
        
        while len(generated_ids[0]) < max_tokens:
            # 1. Draft 모델로 gamma개의 토큰 추측
            draft_outputs = self.draft_model.generate(
                input_ids=generated_ids,
                max_new_tokens=gamma,
                do_sample=False,
                use_cache=True
            )
            draft_tokens = draft_outputs[0][len(generated_ids[0]):]
            
            # 2. Target 모델로 검증
            accepted_tokens = []
            for i, token in enumerate(draft_tokens):
                # Target 모델로 확률 계산
                target_outputs = self.target_model(
                    input_ids=torch.cat([generated_ids, torch.tensor([accepted_tokens + [token]])], dim=1),
                    use_cache=True
                )
                
                # Accept/Reject 결정
                draft_prob = self._get_draft_probability(draft_tokens[:i+1], generated_ids)
                target_prob = torch.softmax(target_outputs.logits[0, -1, :], dim=-1)[token]
                
                if self._should_accept(draft_prob, target_prob):
                    accepted_tokens.append(token)
                else:
                    # Reject 시 Target 모델에서 직접 샘플링
                    new_token = torch.multinomial(target_prob, 1)
                    accepted_tokens.append(new_token.item())
                    break
            
            # 3. 수락된 토큰 추가
            generated_ids = torch.cat([
                generated_ids,
                torch.tensor([accepted_tokens]).unsqueeze(0)
            ], dim=1)
        
        return self.tokenizer.decode(generated_ids[0], skip_special_tokens=True)
    
    def _get_draft_probability(self, tokens, prefix):
        # Draft 모델의 확률 계산
        pass
    
    def _should_accept(self, draft_prob, target_prob):
        # Accept/Reject 결정 로직
        return target_prob >= draft_prob
```

### 4-2. 병렬 Speculative Decoding

```python
import torch.nn.functional as F

def parallel_speculative_decode(
    draft_model,
    target_model,
    input_ids,
    gamma: int = 4,
    temperature: float = 1.0
):
    """
    병렬로 여러 토큰을 추측하고 검증
    """
    # Draft 모델로 gamma개 토큰 생성
    with torch.no_grad():
        draft_outputs = draft_model.generate(
            input_ids,
            max_new_tokens=gamma,
            do_sample=True,
            temperature=temperature,
            use_cache=True
        )
    
    draft_sequence = draft_outputs[0][len(input_ids[0]):]
    
    # Target 모델로 전체 시퀀스 검증
    full_sequence = torch.cat([input_ids, draft_sequence.unsqueeze(0)], dim=1)
    target_outputs = target_model(full_sequence, use_cache=True)
    
    # 각 위치에서 Accept/Reject 결정
    accepted_tokens = []
    for i in range(len(draft_sequence)):
        draft_token = draft_sequence[i]
        
        # Target 모델의 확률
        target_logits = target_outputs.logits[0, len(input_ids[0]) + i - 1, :]
        target_probs = F.softmax(target_logits / temperature, dim=-1)
        
        # Draft 모델의 확률
        draft_logits = draft_outputs.logits[0, len(input_ids[0]) + i - 1, :]
        draft_probs = F.softmax(draft_logits / temperature, dim=-1)
        
        # Accept 확률 계산
        accept_prob = min(1.0, target_probs[draft_token] / draft_probs[draft_token])
        
        if torch.rand(1) < accept_prob:
            accepted_tokens.append(draft_token.item())
        else:
            # Reject: Target 모델에서 재샘플링
            new_token = torch.multinomial(target_probs, 1)
            accepted_tokens.append(new_token.item())
            break
    
    return torch.tensor([accepted_tokens])
```

## 5. 배치 처리 최적화

### 5-1. 동적 배치 처리

```python
class DynamicBatching:
    def __init__(self, model, tokenizer, max_batch_size: int = 8):
        self.model = model
        self.tokenizer = tokenizer
        self.max_batch_size = max_batch_size
        self.request_queue = []
    
    def add_request(self, prompt: str, max_tokens: int = 50):
        """요청을 큐에 추가"""
        self.request_queue.append({
            "prompt": prompt,
            "max_tokens": max_tokens,
            "input_ids": self.tokenizer(prompt, return_tensors="pt").input_ids
        })
    
    def process_batch(self):
        """배치 처리"""
        if not self.request_queue:
            return []
        
        # 배치 크기 결정
        batch_size = min(len(self.request_queue), self.max_batch_size)
        batch = self.request_queue[:batch_size]
        self.request_queue = self.request_queue[batch_size:]
        
        # 패딩으로 배치 구성
        max_length = max(len(req["input_ids"][0]) for req in batch)
        batch_input_ids = []
        attention_masks = []
        
        for req in batch:
            input_ids = req["input_ids"][0]
            padding_length = max_length - len(input_ids)
            
            padded_input = torch.cat([
                input_ids,
                torch.zeros(padding_length, dtype=torch.long)
            ])
            batch_input_ids.append(padded_input)
            
            attention_mask = torch.cat([
                torch.ones(len(input_ids)),
                torch.zeros(padding_length)
            ])
            attention_masks.append(attention_mask)
        
        batch_input_ids = torch.stack(batch_input_ids)
        attention_masks = torch.stack(attention_masks)
        
        # 배치 추론
        with torch.no_grad():
            outputs = self.model.generate(
                batch_input_ids,
                attention_mask=attention_masks,
                max_new_tokens=50,
                use_cache=True,
                pad_token_id=self.tokenizer.pad_token_id
            )
        
        # 결과 디코딩
        results = []
        for i, output in enumerate(outputs):
            decoded = self.tokenizer.decode(output, skip_special_tokens=True)
            results.append(decoded)
        
        return results
```

### 5-2. Continuous Batching

```python
class ContinuousBatching:
    def __init__(self, model, tokenizer):
        self.model = model
        self.tokenizer = tokenizer
        self.active_requests = []
        self.kv_caches = {}
    
    def add_request(self, request_id: str, prompt: str, max_tokens: int):
        """새 요청 추가"""
        input_ids = self.tokenizer(prompt, return_tensors="pt").input_ids
        self.active_requests.append({
            "id": request_id,
            "input_ids": input_ids,
            "max_tokens": max_tokens,
            "generated_tokens": 0,
            "kv_cache": None
        })
    
    def process_step(self):
        """한 스텝 처리"""
        if not self.active_requests:
            return
        
        # 모든 요청의 다음 토큰 생성
        for req in self.active_requests:
            if req["generated_tokens"] >= req["max_tokens"]:
                continue
            
            # 마지막 토큰만 사용
            last_token = req["input_ids"][:, -1:]
            
            outputs = self.model(
                input_ids=last_token,
                past_key_values=req["kv_cache"],
                use_cache=True
            )
            
            # KV Cache 업데이트
            req["kv_cache"] = outputs.past_key_values
            
            # 다음 토큰 선택
            next_token = torch.argmax(outputs.logits[0, -1, :], dim=-1)
            req["input_ids"] = torch.cat([req["input_ids"], next_token.unsqueeze(0)], dim=1)
            req["generated_tokens"] += 1
        
        # 완료된 요청 제거
        self.active_requests = [
            req for req in self.active_requests
            if req["generated_tokens"] < req["max_tokens"]
        ]
```

## 6. 모델 병렬화

### 6-1. Pipeline Parallelism

```python
import torch.nn as nn
from torch.distributed import Pipeline

class PipelineParallelModel(nn.Module):
    def __init__(self, num_layers: int, hidden_size: int, num_gpus: int = 4):
        super().__init__()
        self.num_gpus = num_gpus
        self.layers_per_gpu = num_layers // num_gpus
        
        # 각 GPU에 할당될 레이어
        self.gpu_layers = nn.ModuleList([
            nn.ModuleList([
                nn.TransformerEncoderLayer(hidden_size, 8)
                for _ in range(self.layers_per_gpu)
            ])
            for _ in range(num_gpus)
        ])
    
    def forward(self, x):
        # Pipeline으로 순차 처리
        for gpu_idx in range(self.num_gpus):
            layers = self.gpu_layers[gpu_idx]
            for layer in layers:
                x = layer(x)
        return x
```

### 6-2. Tensor Parallelism

```python
class TensorParallelAttention(nn.Module):
    def __init__(self, hidden_size: int, num_heads: int, num_gpus: int = 2):
        super().__init__()
        self.num_gpus = num_gpus
        self.num_heads_per_gpu = num_heads // num_gpus
        
        # 각 GPU에 할당될 Attention 헤드
        self.qkv_layers = nn.ModuleList([
            nn.Linear(hidden_size, hidden_size // num_gpus)
            for _ in range(num_gpus)
        ])
    
    def forward(self, x):
        # 각 GPU에서 부분 계산
        qkv_outputs = []
        for layer in self.qkv_layers:
            qkv_outputs.append(layer(x))
        
        # 결과 병합
        return torch.cat(qkv_outputs, dim=-1)
```

## 7. Flash Attention

### 7-1. Flash Attention 구현

```python
try:
    from flash_attn import flash_attn_func
except ImportError:
    print("Flash Attention이 설치되지 않았습니다.")

def flash_attention_forward(q, k, v, dropout_p=0.0, softmax_scale=None):
    """
    Flash Attention을 사용한 효율적인 Attention 계산
    """
    return flash_attn_func(
        q, k, v,
        dropout_p=dropout_p,
        softmax_scale=softmax_scale,
        causal=True
    )

# 사용 예시
class FlashAttentionLayer(nn.Module):
    def __init__(self, hidden_size: int, num_heads: int):
        super().__init__()
        self.hidden_size = hidden_size
        self.num_heads = num_heads
        self.head_dim = hidden_size // num_heads
        
        self.q_proj = nn.Linear(hidden_size, hidden_size)
        self.k_proj = nn.Linear(hidden_size, hidden_size)
        self.v_proj = nn.Linear(hidden_size, hidden_size)
        self.o_proj = nn.Linear(hidden_size, hidden_size)
    
    def forward(self, x):
        batch_size, seq_len, _ = x.shape
        
        q = self.q_proj(x)
        k = self.k_proj(x)
        v = self.v_proj(x)
        
        # Flash Attention 사용
        q = q.view(batch_size, seq_len, self.num_heads, self.head_dim)
        k = k.view(batch_size, seq_len, self.num_heads, self.head_dim)
        v = v.view(batch_size, seq_len, self.num_heads, self.head_dim)
        
        output = flash_attention_forward(q, k, v)
        output = output.contiguous().view(batch_size, seq_len, self.hidden_size)
        
        return self.o_proj(output)
```

## 8. 실전 통합 예제

### 8-1. 최적화된 추론 서버

```python
from fastapi import FastAPI, Request
from pydantic import BaseModel
import torch

app = FastAPI()

class InferenceRequest(BaseModel):
    prompt: str
    max_tokens: int = 50
    temperature: float = 0.7

class OptimizedLLMService:
    def __init__(self):
        # 양자화된 모델 로드
        self.model = AutoModelForCausalLM.from_pretrained(
            "gpt2",
            quantization_config=quantization_config_4bit,
            device_map="auto"
        )
        self.tokenizer = AutoTokenizer.from_pretrained("gpt2")
        self.batcher = ContinuousBatching(self.model, self.tokenizer)
    
    def generate(self, request: InferenceRequest):
        # 배치 처리로 효율적 생성
        request_id = str(uuid.uuid4())
        self.batcher.add_request(
            request_id,
            request.prompt,
            request.max_tokens
        )
        
        # 배치 처리
        result = self.batcher.process_step()
        return result

service = OptimizedLLMService()

@app.post("/generate")
async def generate(request: InferenceRequest):
    result = service.generate(request)
    return {"generated_text": result}
```

## 9. 성능 벤치마크

### 9-1. 종합 성능 비교

```python
def benchmark_all_techniques(model_name: str = "gpt2"):
    results = {}
    
    # 1. 기본 추론
    baseline_time = benchmark_baseline(model_name)
    results["baseline"] = baseline_time
    
    # 2. KV Cache
    kv_cache_time = benchmark_kv_cache(model_name)
    results["kv_cache"] = kv_cache_time
    results["kv_cache_speedup"] = baseline_time / kv_cache_time
    
    # 3. 8-bit 양자화
    quant8_time, quant8_memory = benchmark_quantization(model_name, bits=8)
    results["quant8"] = {"time": quant8_time, "memory": quant8_memory}
    
    # 4. 4-bit 양자화
    quant4_time, quant4_memory = benchmark_quantization(model_name, bits=4)
    results["quant4"] = {"time": quant4_time, "memory": quant4_memory}
    
    # 5. Speculative Decoding
    spec_time = benchmark_speculative(model_name)
    results["speculative"] = spec_time
    results["speculative_speedup"] = baseline_time / spec_time
    
    return results
```

## 10. 결론

LLM 추론 최적화는 다양한 기법을 조합하여 수행한다. 이 글에서 다룬 내용:

1. **KV Cache**: 반복 계산 제거로 속도 향상
2. **Quantization**: 메모리 사용량 감소 (4-bit, 8-bit)
3. **Speculative Decoding**: 병렬 처리로 생성 속도 향상
4. **배치 처리**: 동적 배치, Continuous Batching
5. **모델 병렬화**: Pipeline, Tensor Parallelism
6. **Flash Attention**: 메모리 효율적인 Attention 계산

이러한 기법들을 적절히 조합하면 프로덕션 환경에서 LLM을 효율적으로 서빙할 수 있다.

## 참고 자료

- [vLLM: High-Throughput LLM Serving](https://github.com/vllm-project/vllm)
- [Flash Attention](https://github.com/Dao-AILab/flash-attention)
- [GPTQ: Accurate Post-Training Quantization](https://github.com/IST-DASLab/gptq)
- [Speculative Decoding](https://arxiv.org/abs/2211.17192)









