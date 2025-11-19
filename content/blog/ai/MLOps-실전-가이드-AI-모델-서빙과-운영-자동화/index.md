---
templateKey: blog-post
title: MLOps 실전 가이드 - AI 모델 서빙과 운영 자동화 완벽 정리
date: 2025-11-15T00:00:00.000Z
category: ai
description:
  MLOps의 개념부터 실전 구현까지. 모델 버전 관리(MLflow), A/B 테스트, 모델 서빙(KServe, Seldon), 성능 모니터링, 데이터 드리프트 감지까지 프로덕션 환경에서 AI 모델을 운영하는 모든 것을 다룹니다.
tags:
  - MLOps
  - 머신러닝 운영
  - 모델 서빙
  - MLflow
  - Kubernetes
  - AI 모델 배포
  - 모델 모니터링
  - 데이터 드리프트
  - A/B 테스트
  - KServe
  - Seldon
---

# MLOps 실전 가이드 - AI 모델 서빙과 운영 자동화 완벽 정리

머신러닝 모델을 개발하는 것과 프로덕션 환경에서 안정적으로 운영하는 것은 완전히 다른 차원의 문제다. Jupyter Notebook에서 95% 정확도를 달성한 모델이 실제 서비스에서는 성능이 급격히 떨어지거나, 모델 업데이트 후 롤백이 어려워 서비스 장애가 발생하는 사례는 흔하다. **MLOps(Machine Learning Operations)**는 이러한 문제를 해결하기 위한 실무 방법론이다. 이 글은 MLOps의 핵심 개념부터 실전 구현까지, 프로덕션 환경에서 AI 모델을 안정적으로 운영하는 모든 것을 다룬다.

## 1. MLOps란 무엇인가?

### 1-1. 정의와 배경

MLOps는 DevOps의 머신러닝 버전으로, ML 모델의 개발부터 배포, 모니터링, 재학습까지 전체 라이프사이클을 자동화하고 표준화하는 관행이다. 전통적인 소프트웨어 개발과 달리 ML은 다음과 같은 특수성을 가진다:

- **데이터 의존성**: 모델 성능이 데이터 품질과 분포에 직접적으로 의존
- **실험 중심 개발**: 다양한 하이퍼파라미터와 아키텍처를 시도해야 함
- **모델 재학습 필요성**: 데이터 분포 변화(Concept Drift)에 따라 주기적 업데이트 필요
- **재현성 요구**: 동일한 결과를 보장하기 위한 환경 관리 필요

### 1-2. MLOps의 핵심 가치

1. **재현성(Reproducibility)**: 동일한 코드와 데이터로 동일한 모델을 재생성 가능
2. **협업성(Collaboration)**: 데이터 과학자, ML 엔지니어, DevOps 팀 간 원활한 협업
3. **자동화(Automation)**: 수동 작업을 최소화하고 파이프라인 자동화
4. **모니터링(Monitoring)**: 프로덕션 환경에서 모델 성능과 데이터 품질 지속 추적
5. **확장성(Scalability)**: 수백 개의 모델을 동시에 운영할 수 있는 인프라

### 1-3. MLOps vs DevOps

| 구분 | DevOps | MLOps |
|------|--------|-------|
| **버전 관리** | 코드만 관리 | 코드 + 데이터 + 모델 모두 관리 |
| **테스트** | 단위/통합 테스트 | 데이터 검증, 모델 성능 테스트 |
| **배포** | 코드 배포 | 모델 + 인퍼런스 서버 배포 |
| **모니터링** | 애플리케이션 메트릭 | 모델 성능, 데이터 드리프트, 예측 분포 |
| **CI/CD** | 코드 변경 시 빌드/배포 | 데이터/코드 변경 시 재학습/재배포 |

## 2. MLOps 아키텍처 설계

### 2-1. 전체 파이프라인 구조

```
[데이터 수집] → [데이터 검증] → [특성 엔지니어링] → [모델 학습]
                                                          ↓
[모델 평가] ← [모델 검증] ← [모델 등록] ← [모델 패키징]
     ↓
[모델 배포] → [A/B 테스트] → [프로덕션 서빙] → [모니터링]
     ↑                                                      ↓
[자동 재학습] ← [드리프트 감지] ← [성능 저하 알림] ← [로그 수집]
```

### 2-2. 주요 구성 요소

#### 데이터 파이프라인
- **데이터 수집**: 실시간 스트리밍(Kafka) 또는 배치 처리
- **데이터 검증**: Great Expectations, Pandera를 활용한 스키마/분포 검증
- **특성 저장소(Feature Store)**: Feast, Tecton을 활용한 특성 재사용

#### 모델 개발 환경
- **실험 추적**: MLflow, Weights & Biases(W&B), Neptune
- **모델 레지스트리**: 모델 버전 관리 및 메타데이터 저장
- **하이퍼파라미터 튜닝**: Optuna, Ray Tune

#### 모델 서빙
- **온라인 서빙**: REST API, gRPC를 통한 실시간 추론
- **배치 추론**: 대량 데이터 처리용 스케줄링
- **엣지 배포**: 모바일/IoT 디바이스용 경량화 모델

#### 모니터링 및 관찰 가능성
- **모델 성능 메트릭**: 정확도, 지연 시간, 처리량
- **데이터 드리프트 감지**: Evidently AI, Fiddler
- **예측 분포 모니터링**: 예측값의 통계적 분포 추적

## 3. 모델 버전 관리 - MLflow 실전

### 3-1. MLflow 개요

MLflow는 Databricks에서 개발한 오픈소스 MLOps 플랫폼으로, 실험 추적, 모델 레지스트리, 모델 서빙을 통합 제공한다.

**핵심 컴포넌트:**
- **Tracking**: 실험 파라미터, 메트릭, 아티팩트 추적
- **Projects**: 재현 가능한 ML 프로젝트 패키징
- **Models**: 다양한 플랫폼으로 모델 배포
- **Model Registry**: 중앙화된 모델 저장소

### 3-2. MLflow 실험 추적 구현

```python
import mlflow
import mlflow.sklearn
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score
import pandas as pd

# MLflow 실험 설정
mlflow.set_experiment("customer_churn_prediction")

# 실험 시작
with mlflow.start_run(run_name="rf_baseline_v1"):
    # 데이터 로드
    df = pd.read_csv("data/customer_churn.csv")
    X_train, X_test, y_train, y_test = train_test_split(
        df.drop("churn", axis=1), 
        df["churn"], 
        test_size=0.2, 
        random_state=42
    )
    
    # 하이퍼파라미터 정의
    params = {
        "n_estimators": 100,
        "max_depth": 10,
        "min_samples_split": 5,
        "random_state": 42
    }
    
    # 모델 학습
    model = RandomForestClassifier(**params)
    model.fit(X_train, y_train)
    
    # 예측 및 평가
    y_pred = model.predict(X_test)
    accuracy = accuracy_score(y_test, y_pred)
    precision = precision_score(y_test, y_pred)
    recall = recall_score(y_test, y_pred)
    
    # MLflow에 로깅
    mlflow.log_params(params)
    mlflow.log_metrics({
        "accuracy": accuracy,
        "precision": precision,
        "recall": recall
    })
    
    # 모델 저장
    mlflow.sklearn.log_model(
        model, 
        "model",
        registered_model_name="ChurnPredictor"
    )
    
    # 데이터셋 정보 로깅
    mlflow.log_artifact("data/customer_churn.csv", "dataset")
    
    print(f"Accuracy: {accuracy:.4f}")
    print(f"Run ID: {mlflow.active_run().info.run_id}")
```

### 3-3. 모델 레지스트리 활용

```python
from mlflow.tracking import MlflowClient

client = MlflowClient()

# 모델 버전 조회
model_versions = client.search_model_versions("name='ChurnPredictor'")
for mv in model_versions:
    print(f"Version: {mv.version}, Stage: {mv.current_stage}")

# 모델을 Staging으로 전환
client.transition_model_version_stage(
    name="ChurnPredictor",
    version=1,
    stage="Staging"
)

# Production으로 승격
client.transition_model_version_stage(
    name="ChurnPredictor",
    version=1,
    stage="Production"
)

# Production 모델 로드
import mlflow.pyfunc
model = mlflow.pyfunc.load_model(
    model_uri=f"models:/ChurnPredictor/Production"
)
```

### 3-4. MLflow 서빙

```bash
# MLflow 모델 서빙 서버 시작
mlflow models serve -m models:/ChurnPredictor/Production -p 5000

# 예측 요청
curl -X POST http://localhost:5000/invocations \
  -H 'Content-Type: application/json' \
  -d '{
    "inputs": [[25, 50000, 1, 0, 1]]
  }'
```

## 4. 모델 서빙 전략

### 4-1. 서빙 패턴 비교

#### 1) 실시간 서빙 (Online Serving)
- **용도**: 사용자 요청에 즉시 응답 필요
- **예시**: 추천 시스템, 사기 탐지, 챗봇
- **요구사항**: 낮은 지연 시간(<100ms), 높은 가용성

#### 2) 배치 서빙 (Batch Serving)
- **용도**: 대량 데이터 처리, 주기적 예측
- **예시**: 일일 리포트 생성, 주간 예측 배치
- **요구사항**: 높은 처리량, 비용 효율성

#### 3) 스트리밍 서빙 (Streaming Serving)
- **용도**: 실시간 데이터 스트림 처리
- **예시**: 실시간 이상 탐지, 실시간 추천
- **요구사항**: 낮은 지연 시간, 높은 처리량

### 4-2. Kubernetes 기반 모델 서빙 - KServe

KServe는 Kubernetes 네이티브 모델 서빙 플랫폼으로, 자동 스케일링, 카나리 배포, A/B 테스트를 지원한다.

#### KServe 설치

```bash
# KServe 설치
kubectl apply -f https://github.com/kserve/kserve/releases/download/v0.11.0/kserve.yaml

# InferenceService 생성
kubectl apply -f - <<EOF
apiVersion: "serving.kserve.io/v1beta1"
kind: "InferenceService"
metadata:
  name: "churn-predictor"
spec:
  predictor:
    sklearn:
      storageUri: "s3://mlflow-bucket/models/ChurnPredictor/1"
      resources:
        requests:
          cpu: "100m"
          memory: "1Gi"
        limits:
          cpu: "1000m"
          memory: "2Gi"
EOF
```

#### Python 클라이언트로 예측

```python
from kserve import KServeClient
import requests
import json

# KServe 클라이언트
kserve_client = KServeClient()

# InferenceService 생성
kserve_client.set_credentials(
    storage_type="S3",
    s3_endpoint="s3.amazonaws.com",
    s3_region="us-east-1",
    s3_use_https=True,
    s3_verify_ssl=True
)

# 예측 요청
service_name = "churn-predictor"
namespace = "default"
headers = {"Host": f"{service_name}.{namespace}.example.com"}

data = {
    "instances": [
        [25, 50000, 1, 0, 1],
        [35, 75000, 0, 1, 0]
    ]
}

response = requests.post(
    f"http://{service_name}.{namespace}/v1/models/churn-predictor:predict",
    headers=headers,
    json=data
)

predictions = response.json()
print(predictions)
```

### 4-3. Seldon Core를 활용한 고급 서빙

Seldon Core는 더 세밀한 트래픽 라우팅과 A/B 테스트를 지원한다.

```yaml
apiVersion: machinelearning.seldon.io/v1
kind: SeldonDeployment
metadata:
  name: churn-predictor
spec:
  name: churn-ab-test
  predictors:
  - name: default
    replicas: 2
    graph:
      name: model-a
      type: MODEL
      modelUri: s3://models/model-a
      children:
      - name: model-b
        type: MODEL
        modelUri: s3://models/model-b
        children: []
    traffic: 50
  - name: canary
    replicas: 1
    graph:
      name: model-c
      type: MODEL
      modelUri: s3://models/model-c
    traffic: 50
```

## 5. A/B 테스트와 카나리 배포

### 5-1. A/B 테스트 전략

새로운 모델을 배포할 때 기존 모델과 성능을 비교하는 것이 중요하다.

```python
import numpy as np
from scipy import stats

class ABTestEvaluator:
    def __init__(self, control_metrics, treatment_metrics):
        self.control = control_metrics
        self.treatment = treatment_metrics
    
    def statistical_significance(self, alpha=0.05):
        """통계적 유의성 검정"""
        t_stat, p_value = stats.ttest_ind(
            self.control, 
            self.treatment
        )
        
        is_significant = p_value < alpha
        improvement = np.mean(self.treatment) - np.mean(self.control)
        
        return {
            "p_value": p_value,
            "is_significant": is_significant,
            "improvement": improvement,
            "improvement_pct": (improvement / np.mean(self.control)) * 100
        }
    
    def confidence_interval(self, confidence=0.95):
        """신뢰 구간 계산"""
        diff = np.array(self.treatment) - np.array(self.control)
        mean_diff = np.mean(diff)
        std_diff = np.std(diff, ddof=1)
        n = len(diff)
        
        t_critical = stats.t.ppf((1 + confidence) / 2, n - 1)
        margin = t_critical * (std_diff / np.sqrt(n))
        
        return {
            "mean_difference": mean_diff,
            "lower_bound": mean_diff - margin,
            "upper_bound": mean_diff + margin,
            "confidence": confidence
        }

# 사용 예시
control_accuracy = [0.85, 0.86, 0.84, 0.87, 0.85]
treatment_accuracy = [0.88, 0.89, 0.87, 0.90, 0.88]

evaluator = ABTestEvaluator(control_accuracy, treatment_accuracy)
result = evaluator.statistical_significance()
ci = evaluator.confidence_interval()

print(f"P-value: {result['p_value']:.4f}")
print(f"Improvement: {result['improvement_pct']:.2f}%")
print(f"95% CI: [{ci['lower_bound']:.4f}, {ci['upper_bound']:.4f}]")
```

### 5-2. 트래픽 분할 구현

```python
import random
from typing import Dict, Any

class TrafficSplitter:
    def __init__(self, splits: Dict[str, float]):
        """
        splits: {"model-a": 0.5, "model-b": 0.5}
        """
        assert abs(sum(splits.values()) - 1.0) < 1e-6, "Splits must sum to 1.0"
        self.splits = splits
        self.cumulative = []
        cumulative = 0
        for model, weight in splits.items():
            cumulative += weight
            self.cumulative.append((cumulative, model))
    
    def route(self, user_id: str = None) -> str:
        """사용자를 모델로 라우팅"""
        if user_id:
            # 일관된 라우팅을 위해 해시 사용
            hash_val = hash(user_id) % 10000
            threshold = (hash_val / 10000.0) * sum(self.splits.values())
        else:
            threshold = random.random()
        
        for cum, model in self.cumulative:
            if threshold <= cum:
                return model
        return self.cumulative[-1][1]

# 사용 예시
splitter = TrafficSplitter({
    "model-a": 0.7,  # 70% 트래픽
    "model-b": 0.3   # 30% 트래픽
})

# 사용자별 일관된 라우팅
user_model = splitter.route(user_id="user123")
print(f"User routed to: {user_model}")
```

## 6. 모델 모니터링과 드리프트 감지

### 6-1. 데이터 드리프트 감지

데이터 분포가 시간에 따라 변화하는 현상을 감지하는 것이 중요하다.

```python
import pandas as pd
import numpy as np
from scipy import stats
from typing import Tuple

class DataDriftDetector:
    def __init__(self, reference_data: pd.DataFrame):
        self.reference = reference_data
        self.reference_stats = self._compute_stats(reference_data)
    
    def _compute_stats(self, data: pd.DataFrame) -> dict:
        """기준 데이터의 통계량 계산"""
        stats = {}
        for col in data.columns:
            if data[col].dtype in ['int64', 'float64']:
                stats[col] = {
                    "mean": data[col].mean(),
                    "std": data[col].std(),
                    "min": data[col].min(),
                    "max": data[col].max()
                }
            else:
                stats[col] = {
                    "value_counts": data[col].value_counts().to_dict()
                }
        return stats
    
    def detect_drift(self, current_data: pd.DataFrame, 
                    threshold: float = 0.05) -> dict:
        """드리프트 감지"""
        drift_report = {
            "drifted_features": [],
            "drift_scores": {},
            "overall_drift": False
        }
        
        for col in self.reference.columns:
            if col not in current_data.columns:
                continue
            
            ref_col = self.reference[col]
            curr_col = current_data[col]
            
            if ref_col.dtype in ['int64', 'float64']:
                # Kolmogorov-Smirnov 테스트
                ks_stat, p_value = stats.ks_2samp(ref_col, curr_col)
                drift_score = 1 - p_value
                
                if drift_score > threshold:
                    drift_report["drifted_features"].append(col)
                    drift_report["drift_scores"][col] = {
                        "score": drift_score,
                        "p_value": p_value,
                        "test": "KS"
                    }
            else:
                # 카이제곱 검정
                ref_counts = ref_col.value_counts()
                curr_counts = curr_col.value_counts()
                
                # 공통 카테고리만 비교
                common_cats = set(ref_counts.index) & set(curr_counts.index)
                if len(common_cats) > 0:
                    ref_vals = [ref_counts.get(cat, 0) for cat in common_cats]
                    curr_vals = [curr_counts.get(cat, 0) for cat in common_cats]
                    
                    chi2, p_value = stats.chisquare(curr_vals, ref_vals)
                    drift_score = 1 - p_value
                    
                    if drift_score > threshold:
                        drift_report["drifted_features"].append(col)
                        drift_report["drift_scores"][col] = {
                            "score": drift_score,
                            "p_value": p_value,
                            "test": "Chi-square"
                        }
        
        drift_report["overall_drift"] = len(drift_report["drifted_features"]) > 0
        return drift_report

# 사용 예시
reference_data = pd.DataFrame({
    "age": np.random.normal(35, 10, 1000),
    "income": np.random.normal(50000, 15000, 1000),
    "category": np.random.choice(["A", "B", "C"], 1000)
})

# 시간이 지나 데이터 분포가 변경됨
current_data = pd.DataFrame({
    "age": np.random.normal(40, 12, 1000),  # 평균이 변경됨
    "income": np.random.normal(55000, 18000, 1000),  # 분산이 증가
    "category": np.random.choice(["A", "B", "C", "D"], 1000, p=[0.3, 0.3, 0.3, 0.1])  # 새로운 카테고리 추가
})

detector = DataDriftDetector(reference_data)
drift_report = detector.detect_drift(current_data, threshold=0.05)

print(f"Drifted features: {drift_report['drifted_features']}")
print(f"Overall drift detected: {drift_report['overall_drift']}")
```

### 6-2. 모델 성능 모니터링

```python
import time
from datetime import datetime, timedelta
from collections import defaultdict
import numpy as np

class ModelPerformanceMonitor:
    def __init__(self, window_size: int = 1000):
        self.window_size = window_size
        self.predictions = []
        self.actuals = []
        self.latencies = []
        self.timestamps = []
        self.metrics_history = []
    
    def log_prediction(self, prediction: float, actual: float, 
                      latency: float):
        """예측 결과 로깅"""
        self.predictions.append(prediction)
        self.actuals.append(actual)
        self.latencies.append(latency)
        self.timestamps.append(datetime.now())
        
        # 윈도우 크기 제한
        if len(self.predictions) > self.window_size:
            self.predictions.pop(0)
            self.actuals.pop(0)
            self.latencies.pop(0)
            self.timestamps.pop(0)
    
    def compute_metrics(self) -> dict:
        """현재 성능 메트릭 계산"""
        if len(self.predictions) == 0:
            return {}
        
        predictions = np.array(self.predictions)
        actuals = np.array(self.actuals)
        
        # 분류 문제 가정 (이진 분류)
        if len(np.unique(actuals)) == 2:
            from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
            
            accuracy = accuracy_score(actuals, predictions)
            precision = precision_score(actuals, predictions, zero_division=0)
            recall = recall_score(actuals, predictions, zero_division=0)
            f1 = f1_score(actuals, predictions, zero_division=0)
            
            metrics = {
                "accuracy": accuracy,
                "precision": precision,
                "recall": recall,
                "f1_score": f1
            }
        else:
            # 회귀 문제
            from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
            
            mse = mean_squared_error(actuals, predictions)
            mae = mean_absolute_error(actuals, predictions)
            rmse = np.sqrt(mse)
            r2 = r2_score(actuals, predictions)
            
            metrics = {
                "mse": mse,
                "mae": mae,
                "rmse": rmse,
                "r2_score": r2
            }
        
        # 지연 시간 통계
        metrics.update({
            "avg_latency": np.mean(self.latencies),
            "p95_latency": np.percentile(self.latencies, 95),
            "p99_latency": np.percentile(self.latencies, 99),
            "throughput": len(self.predictions) / (
                (self.timestamps[-1] - self.timestamps[0]).total_seconds() + 1e-6
            )
        })
        
        return metrics
    
    def check_performance_degradation(self, baseline_metrics: dict, 
                                     threshold: float = 0.05) -> dict:
        """성능 저하 감지"""
        current_metrics = self.compute_metrics()
        
        alerts = []
        for metric_name, baseline_value in baseline_metrics.items():
            if metric_name not in current_metrics:
                continue
            
            current_value = current_metrics[metric_name]
            
            # 정확도, F1 등은 높을수록 좋음
            if metric_name in ["accuracy", "precision", "recall", "f1_score", "r2_score"]:
                degradation = (baseline_value - current_value) / baseline_value
                if degradation > threshold:
                    alerts.append({
                        "metric": metric_name,
                        "baseline": baseline_value,
                        "current": current_value,
                        "degradation": degradation,
                        "severity": "high" if degradation > 0.1 else "medium"
                    })
            # MSE, MAE, RMSE는 낮을수록 좋음
            elif metric_name in ["mse", "mae", "rmse"]:
                degradation = (current_value - baseline_value) / baseline_value
                if degradation > threshold:
                    alerts.append({
                        "metric": metric_name,
                        "baseline": baseline_value,
                        "current": current_value,
                        "degradation": degradation,
                        "severity": "high" if degradation > 0.1 else "medium"
                    })
        
        return {
            "has_degradation": len(alerts) > 0,
            "alerts": alerts,
            "current_metrics": current_metrics
        }

# 사용 예시
monitor = ModelPerformanceMonitor(window_size=1000)

# 시뮬레이션: 예측 결과 로깅
for i in range(100):
    prediction = np.random.rand()
    actual = np.random.rand()
    latency = np.random.uniform(10, 50)  # 10-50ms
    monitor.log_prediction(prediction, actual, latency)

# 성능 메트릭 확인
metrics = monitor.compute_metrics()
print("Current metrics:", metrics)

# 성능 저하 감지
baseline = {"r2_score": 0.85, "rmse": 0.15}
degradation_check = monitor.check_performance_degradation(baseline, threshold=0.05)
print("Degradation check:", degradation_check)
```

## 7. CI/CD 파이프라인 구축

### 7-1. GitHub Actions를 활용한 ML 파이프라인

```yaml
# .github/workflows/ml-pipeline.yml
name: ML Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  schedule:
    - cron: '0 2 * * *'  # 매일 새벽 2시 재학습

jobs:
  data-validation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - name: Install dependencies
        run: |
          pip install -r requirements.txt
          pip install great-expectations
      
      - name: Validate data
        run: |
          python scripts/validate_data.py
        env:
          DATA_PATH: ${{ secrets.DATA_PATH }}
  
  train-model:
    needs: data-validation
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - name: Install dependencies
        run: pip install -r requirements.txt
      
      - name: Train model
        run: python scripts/train.py
        env:
          MLFLOW_TRACKING_URI: ${{ secrets.MLFLOW_TRACKING_URI }}
          MLFLOW_S3_BUCKET: ${{ secrets.MLFLOW_S3_BUCKET }}
      
      - name: Evaluate model
        run: python scripts/evaluate.py
      
      - name: Check model performance
        run: |
          python scripts/check_performance.py
          if [ $? -ne 0 ]; then
            echo "Model performance below threshold"
            exit 1
          fi
  
  deploy-model:
    needs: train-model
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/churn-predictor \
            model=${{ secrets.ECR_REGISTRY }}/churn-predictor:${{ github.sha }}
      
      - name: Run smoke tests
        run: |
          python scripts/smoke_tests.py
```

### 7-2. 모델 성능 검증 스크립트

```python
# scripts/check_performance.py
import mlflow
import sys
from mlflow.tracking import MlflowClient

def check_model_performance():
    client = MlflowClient()
    
    # 최신 실험 실행 가져오기
    experiment = client.get_experiment_by_name("customer_churn_prediction")
    runs = client.search_runs(
        experiment_ids=[experiment.experiment_id],
        order_by=["start_time DESC"],
        max_results=1
    )
    
    if not runs:
        print("No runs found")
        sys.exit(1)
    
    latest_run = runs[0]
    metrics = latest_run.data.metrics
    
    # 성능 임계값
    thresholds = {
        "accuracy": 0.85,
        "precision": 0.80,
        "recall": 0.75,
        "f1_score": 0.78
    }
    
    failed_checks = []
    for metric_name, threshold in thresholds.items():
        if metric_name in metrics:
            if metrics[metric_name] < threshold:
                failed_checks.append(
                    f"{metric_name}: {metrics[metric_name]:.4f} < {threshold}"
                )
    
    if failed_checks:
        print("Model performance below thresholds:")
        for check in failed_checks:
            print(f"  - {check}")
        sys.exit(1)
    else:
        print("All performance checks passed!")
        sys.exit(0)

if __name__ == "__main__":
    check_model_performance()
```

## 8. 실전 운영 사례와 베스트 프랙티스

### 8-1. 모델 재학습 전략

#### 시간 기반 재학습
- **일일 재학습**: 빠르게 변화하는 데이터 (예: 주식 예측)
- **주간 재학습**: 중간 속도 변화 (예: 고객 이탈 예측)
- **월간 재학습**: 느린 변화 (예: 신용 평가)

#### 성능 기반 재학습
- 성능 저하가 임계값을 넘으면 자동 재학습 트리거
- 데이터 드리프트가 감지되면 재학습

```python
# 재학습 트리거 로직
def should_retrain(monitor: ModelPerformanceMonitor, 
                  baseline_metrics: dict) -> bool:
    degradation_check = monitor.check_performance_degradation(
        baseline_metrics, 
        threshold=0.05
    )
    
    if degradation_check["has_degradation"]:
        high_severity_alerts = [
            a for a in degradation_check["alerts"] 
            if a["severity"] == "high"
        ]
        if len(high_severity_alerts) > 0:
            return True
    
    return False
```

### 8-2. 모델 롤백 전략

```python
import mlflow
from mlflow.tracking import MlflowClient

def rollback_model(model_name: str, target_version: int):
    """모델을 특정 버전으로 롤백"""
    client = MlflowClient()
    
    # 현재 Production 모델 버전 확인
    current_prod = client.get_latest_versions(
        model_name, 
        stages=["Production"]
    )
    
    if current_prod:
        # 현재 Production을 Archived로 이동
        client.transition_model_version_stage(
            name=model_name,
            version=current_prod[0].version,
            stage="Archived"
        )
    
    # 타겟 버전을 Production으로 승격
    client.transition_model_version_stage(
        name=model_name,
        version=target_version,
        stage="Production"
    )
    
    print(f"Rolled back {model_name} to version {target_version}")
```

### 8-3. 비용 최적화

1. **모델 양자화**: FP32 → INT8 변환으로 추론 비용 4배 감소
2. **배치 처리**: 개별 요청 대신 배치로 처리하여 GPU 활용률 향상
3. **캐싱**: 자주 요청되는 입력에 대한 예측 결과 캐싱
4. **오토스케일링**: 트래픽에 따라 자동으로 인스턴스 수 조정

## 9. 결론

MLOps는 ML 모델을 프로덕션 환경에서 안정적으로 운영하기 위한 필수 관행이다. 이 글에서 다룬 핵심 내용을 요약하면:

1. **모델 버전 관리**: MLflow를 활용한 실험 추적과 모델 레지스트리
2. **모델 서빙**: Kubernetes 기반 서빙 (KServe, Seldon)으로 확장 가능한 인프라 구축
3. **A/B 테스트**: 통계적 검정을 통한 모델 성능 비교
4. **모니터링**: 데이터 드리프트와 모델 성능 지속 추적
5. **자동화**: CI/CD 파이프라인을 통한 재학습과 배포 자동화

MLOps를 제대로 구축하면 수백 개의 모델을 동시에 운영하면서도 안정성과 성능을 보장할 수 있다. 시작은 작게, 하지만 확장 가능한 구조로 설계하는 것이 중요하다.

## 참고 자료

- [MLflow 공식 문서](https://mlflow.org/)
- [KServe GitHub](https://github.com/kserve/kserve)
- [Seldon Core 문서](https://docs.seldon.io/projects/seldon-core/)
- [Google MLOps 가이드](https://cloud.google.com/architecture/mlops-continuous-delivery-and-automation-pipelines-in-machine-learning)


