---
templateKey: blog-post
title: PostgreSQL 고급 기능 - JSON, Full-Text Search, Partitioning
date: 2025-11-28T00:00:00.000Z
category: etc
description:
  PostgreSQL의 고급 기능들을 실전 예제와 함께 정리합니다. JSON/JSONB 데이터 타입, Full-Text Search, 테이블 파티셔닝, 인덱싱 전략, 성능 최적화까지 모든 것을 다룹니다.
tags:
  - PostgreSQL
  - 데이터베이스
  - JSON
  - Full-Text Search
  - Partitioning
  - 인덱싱
  - 성능 최적화
  - SQL
---

# PostgreSQL 고급 기능 - JSON, Full-Text Search, Partitioning

PostgreSQL은 가장 강력한 오픈소스 관계형 데이터베이스 중 하나다. JSON 지원, Full-Text Search, 파티셔닝 등 고급 기능들을 통해 다양한 요구사항을 충족할 수 있다. 이 글은 PostgreSQL의 고급 기능을 실전 예제와 함께 정리한다.

## 1. JSON과 JSONB

### 1-1. JSON 타입 기본

```sql
-- JSON 컬럼이 있는 테이블 생성
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    metadata JSON,
    attributes JSONB
);

-- JSON 데이터 삽입
INSERT INTO products (name, metadata, attributes) VALUES
('Laptop', 
 '{"brand": "Dell", "model": "XPS 13", "year": 2024}',
 '{"cpu": "Intel i7", "ram": "16GB", "storage": "512GB SSD", "price": 1299}');

-- JSON 데이터 조회
SELECT name, metadata, attributes FROM products;

-- JSON 필드 접근
SELECT 
    name,
    metadata->>'brand' AS brand,
    attributes->>'cpu' AS cpu,
    (attributes->>'price')::INTEGER AS price
FROM products;
```

### 1-2. JSONB 연산자

```sql
-- JSONB 연산자들
SELECT 
    -- 필드 접근
    attributes->'cpu' AS cpu_json,           -- JSON 반환
    attributes->>'cpu' AS cpu_text,          -- 텍스트 반환
    
    -- 중첩 필드 접근
    attributes->'specs'->>'ram' AS ram,
    
    -- 배열 접근
    attributes->'tags'->0 AS first_tag,
    attributes->'tags'->>0 AS first_tag_text,
    
    -- 경로 접근
    attributes#>'{specs,ram}' AS ram_path,
    attributes#>>'{specs,ram}' AS ram_path_text,
    
    -- 키 존재 확인
    attributes ? 'cpu' AS has_cpu,
    attributes ?| ARRAY['cpu', 'ram'] AS has_any,
    attributes ?& ARRAY['cpu', 'ram'] AS has_all,
    
    -- JSONB 포함 확인
    attributes @> '{"cpu": "Intel i7"}' AS contains_cpu,
    '{"cpu": "Intel i7"}' <@ attributes AS is_contained
    
FROM products;
```

### 1-3. JSONB 함수

```sql
-- JSONB 함수들
SELECT 
    -- 키 추출
    jsonb_object_keys(attributes) AS keys,
    
    -- 값 추출
    jsonb_array_elements(attributes->'tags') AS tag,
    
    -- 객체 병합
    attributes || '{"warranty": "2 years"}'::jsonb AS merged,
    
    -- 키 제거
    attributes - 'price' AS without_price,
    attributes - ARRAY['price', 'warranty'] AS without_multiple,
    
    -- 배열 요소 제거
    attributes #- '{tags,0}' AS without_first_tag,
    
    -- 타입 변환
    jsonb_typeof(attributes->'price') AS price_type,
    
    -- JSONB 크기
    jsonb_array_length(attributes->'tags') AS tags_count
    
FROM products;
```

### 1-4. JSONB 인덱싱

```sql
-- GIN 인덱스 생성 (전체 JSONB 검색용)
CREATE INDEX idx_products_attributes_gin ON products USING GIN (attributes);

-- 특정 키에 대한 인덱스
CREATE INDEX idx_products_cpu ON products ((attributes->>'cpu'));
CREATE INDEX idx_products_price ON products (((attributes->>'price')::INTEGER));

-- JSONB 경로 인덱스
CREATE INDEX idx_products_specs ON products USING GIN ((attributes->'specs'));

-- 사용 예시
-- GIN 인덱스를 활용한 쿼리
SELECT * FROM products 
WHERE attributes @> '{"cpu": "Intel i7"}';

-- 특정 키 인덱스를 활용한 쿼리
SELECT * FROM products 
WHERE attributes->>'cpu' = 'Intel i7';
```

### 1-5. JSONB 업데이트

```sql
-- JSONB 필드 업데이트
UPDATE products 
SET attributes = attributes || '{"warranty": "2 years"}'::jsonb
WHERE id = 1;

-- 중첩 필드 업데이트
UPDATE products 
SET attributes = jsonb_set(
    attributes,
    '{specs,ram}',
    '"32GB"',
    true  -- 없으면 생성
)
WHERE id = 1;

-- 배열에 요소 추가
UPDATE products 
SET attributes = jsonb_set(
    attributes,
    '{tags}',
    COALESCE(attributes->'tags', '[]'::jsonb) || '"new-tag"'::jsonb
)
WHERE id = 1;

-- 키 제거
UPDATE products 
SET attributes = attributes - 'warranty'
WHERE id = 1;
```

## 2. Full-Text Search

### 2-1. 기본 Full-Text Search

```sql
-- Full-Text Search용 테이블 생성
CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- tsvector 컬럼 추가
ALTER TABLE articles ADD COLUMN search_vector tsvector;

-- tsvector 생성 함수
CREATE OR REPLACE FUNCTION update_search_vector() RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := 
        setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(NEW.content, '')), 'B');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 트리거 생성
CREATE TRIGGER update_articles_search_vector
    BEFORE INSERT OR UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_search_vector();

-- 샘플 데이터
INSERT INTO articles (title, content) VALUES
('Introduction to PostgreSQL', 'PostgreSQL is a powerful open-source database...'),
('Advanced SQL Techniques', 'Learn advanced SQL techniques for data analysis...'),
('Database Performance Optimization', 'Optimize your database queries for better performance...');

-- Full-Text Search 쿼리
SELECT title, content
FROM articles
WHERE search_vector @@ to_tsquery('english', 'PostgreSQL & database');

-- 순위 기반 검색
SELECT 
    title,
    content,
    ts_rank(search_vector, to_tsquery('english', 'PostgreSQL & database')) AS rank
FROM articles
WHERE search_vector @@ to_tsquery('english', 'PostgreSQL & database')
ORDER BY rank DESC;
```

### 2-2. GIN 인덱스와 Full-Text Search

```sql
-- GIN 인덱스 생성
CREATE INDEX idx_articles_search_vector ON articles USING GIN (search_vector);

-- 인덱스를 활용한 빠른 검색
SELECT title, content
FROM articles
WHERE search_vector @@ to_tsquery('english', 'PostgreSQL & database');

-- 여러 언어 지원
CREATE INDEX idx_articles_search_korean ON articles 
USING GIN (to_tsvector('korean', title || ' ' || content));

-- 한국어 검색
SELECT title, content
FROM articles
WHERE to_tsvector('korean', title || ' ' || content) 
      @@ to_tsquery('korean', '데이터베이스 & 최적화');
```

### 2-3. 고급 Full-Text Search

```sql
-- 사용자 정의 텍스트 검색 설정
CREATE TEXT SEARCH CONFIGURATION english_custom (COPY = english);

-- 동의어 사전 생성
CREATE TEXT SEARCH DICTIONARY english_synonym (
    TEMPLATE = synonym,
    SYNONYMS = english_synonyms
);

-- 동의어 사전을 텍스트 검색 설정에 추가
ALTER TEXT SEARCH CONFIGURATION english_custom
    ALTER MAPPING FOR asciiword, word
    WITH english_synonym, english_stem;

-- 사용자 정의 설정 사용
SELECT title, content
FROM articles
WHERE to_tsvector('english_custom', title || ' ' || content)
      @@ to_tsquery('english_custom', 'database | DB');

-- 하이라이트 검색 결과
SELECT 
    title,
    ts_headline(
        'english',
        content,
        to_tsquery('english', 'PostgreSQL'),
        'StartSel=<mark>, StopSel=</mark>'
    ) AS highlighted_content
FROM articles
WHERE search_vector @@ to_tsquery('english', 'PostgreSQL');
```

### 2-4. Full-Text Search 성능 최적화

```sql
-- 부분 인덱스 (NULL이 아닌 경우만 인덱싱)
CREATE INDEX idx_articles_search_partial ON articles 
USING GIN (search_vector)
WHERE search_vector IS NOT NULL;

-- 표현식 인덱스
CREATE INDEX idx_articles_title_search ON articles 
USING GIN (to_tsvector('english', title));

-- 복합 인덱스
CREATE INDEX idx_articles_title_content ON articles 
USING GIN (
    to_tsvector('english', title),
    to_tsvector('english', content)
);

-- 통계 정보 업데이트
ANALYZE articles;

-- 쿼리 실행 계획 확인
EXPLAIN ANALYZE
SELECT title, content
FROM articles
WHERE search_vector @@ to_tsquery('english', 'PostgreSQL');
```

## 3. 테이블 파티셔닝

### 3-1. Range Partitioning

```sql
-- 파티션된 테이블 생성
CREATE TABLE sales (
    id SERIAL,
    sale_date DATE NOT NULL,
    product_id INTEGER,
    amount DECIMAL(10, 2),
    PRIMARY KEY (id, sale_date)
) PARTITION BY RANGE (sale_date);

-- 월별 파티션 생성
CREATE TABLE sales_2024_01 PARTITION OF sales
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE sales_2024_02 PARTITION OF sales
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

CREATE TABLE sales_2024_03 PARTITION OF sales
    FOR VALUES FROM ('2024-03-01') TO ('2024-04-01');

-- 기본 파티션 (나머지 모든 값)
CREATE TABLE sales_default PARTITION OF sales DEFAULT;

-- 데이터 삽입
INSERT INTO sales (sale_date, product_id, amount) VALUES
('2024-01-15', 1, 100.00),
('2024-02-20', 2, 200.00),
('2024-03-10', 3, 150.00);

-- 파티션 프루닝 확인
EXPLAIN ANALYZE
SELECT * FROM sales
WHERE sale_date >= '2024-01-01' AND sale_date < '2024-02-01';
```

### 3-2. List Partitioning

```sql
-- 리스트 파티셔닝
CREATE TABLE products_by_region (
    id SERIAL,
    name VARCHAR(100),
    region VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2),
    PRIMARY KEY (id, region)
) PARTITION BY LIST (region);

-- 지역별 파티션 생성
CREATE TABLE products_north PARTITION OF products_by_region
    FOR VALUES IN ('Seoul', 'Incheon', 'Gyeonggi');

CREATE TABLE products_south PARTITION OF products_by_region
    FOR VALUES IN ('Busan', 'Daegu', 'Ulsan');

CREATE TABLE products_central PARTITION OF products_by_region
    FOR VALUES IN ('Daejeon', 'Gwangju', 'Jeonju');

-- 데이터 삽입
INSERT INTO products_by_region (name, region, price) VALUES
('Product A', 'Seoul', 100.00),
('Product B', 'Busan', 200.00),
('Product C', 'Daejeon', 150.00);
```

### 3-3. Hash Partitioning

```sql
-- 해시 파티셔닝
CREATE TABLE user_sessions (
    id SERIAL,
    user_id INTEGER NOT NULL,
    session_data JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id, user_id)
) PARTITION BY HASH (user_id);

-- 4개의 해시 파티션 생성
CREATE TABLE user_sessions_0 PARTITION OF user_sessions
    FOR VALUES WITH (MODULUS 4, REMAINDER 0);

CREATE TABLE user_sessions_1 PARTITION OF user_sessions
    FOR VALUES WITH (MODULUS 4, REMAINDER 1);

CREATE TABLE user_sessions_2 PARTITION OF user_sessions
    FOR VALUES WITH (MODULUS 4, REMAINDER 2);

CREATE TABLE user_sessions_3 PARTITION OF user_sessions
    FOR VALUES WITH (MODULUS 4, REMAINDER 3);
```

### 3-4. 파티션 관리

```sql
-- 새 파티션 추가
CREATE TABLE sales_2024_04 PARTITION OF sales
    FOR VALUES FROM ('2024-04-01') TO ('2024-05-01');

-- 파티션 분할
ALTER TABLE sales_2024_01 
    SPLIT PARTITION sales_2024_01 INTO (
        PARTITION sales_2024_01_early FOR VALUES FROM ('2024-01-01') TO ('2024-01-15'),
        PARTITION sales_2024_01_late FOR VALUES FROM ('2024-01-15') TO ('2024-02-01')
    );

-- 파티션 제거 (데이터 보존)
ALTER TABLE sales DETACH PARTITION sales_2024_01;

-- 파티션 삭제 (데이터 삭제)
DROP TABLE sales_2024_01;

-- 파티션 통계 정보
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE tablename LIKE 'sales_%'
ORDER BY tablename;
```

## 4. 인덱싱 전략

### 4-1. B-Tree 인덱스

```sql
-- 기본 B-Tree 인덱스
CREATE INDEX idx_users_email ON users (email);

-- 복합 인덱스
CREATE INDEX idx_orders_user_date ON orders (user_id, order_date DESC);

-- 부분 인덱스
CREATE INDEX idx_active_users ON users (email) 
WHERE is_active = true;

-- 표현식 인덱스
CREATE INDEX idx_users_lower_email ON users (LOWER(email));

-- UNIQUE 인덱스
CREATE UNIQUE INDEX idx_users_username_unique ON users (username);
```

### 4-2. GIN 인덱스

```sql
-- JSONB용 GIN 인덱스
CREATE INDEX idx_products_attributes_gin ON products USING GIN (attributes);

-- 배열용 GIN 인덱스
CREATE INDEX idx_products_tags_gin ON products USING GIN (tags);

-- Full-Text Search용 GIN 인덱스
CREATE INDEX idx_articles_search_gin ON articles USING GIN (search_vector);
```

### 4-3. GiST 인덱스

```sql
-- 기하학적 데이터용 GiST 인덱스
CREATE INDEX idx_locations_geom ON locations USING GIST (geom);

-- 범위 타입용 GiST 인덱스
CREATE INDEX idx_events_period ON events USING GIST (period);

-- Full-Text Search용 GiST 인덱스 (GIN 대신)
CREATE INDEX idx_articles_search_gist ON articles USING GIST (search_vector);
```

### 4-4. 인덱스 최적화

```sql
-- 인덱스 사용 통계 확인
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan AS index_scans,
    idx_tup_read AS tuples_read,
    idx_tup_fetch AS tuples_fetched
FROM pg_stat_user_indexes
ORDER BY idx_scan;

-- 사용되지 않는 인덱스 찾기
SELECT 
    schemaname,
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;

-- 인덱스 크기 확인
SELECT 
    tablename,
    indexname,
    pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY pg_relation_size(indexrelid) DESC;

-- 인덱스 재구성
REINDEX INDEX CONCURRENTLY idx_users_email;

-- 인덱스 통계 업데이트
ANALYZE users;
```

## 5. 성능 최적화

### 5-1. 쿼리 최적화

```sql
-- EXPLAIN ANALYZE로 쿼리 계획 확인
EXPLAIN ANALYZE
SELECT * FROM orders
WHERE user_id = 123
  AND order_date >= '2024-01-01'
ORDER BY order_date DESC
LIMIT 10;

-- 인덱스 힌트 (PostgreSQL 12+)
SET enable_seqscan = off;  -- 순차 스캔 비활성화 (테스트용)

-- 통계 정보 업데이트
ANALYZE orders;

-- 쿼리 통계 확인
SELECT 
    query,
    calls,
    total_exec_time,
    mean_exec_time,
    max_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

### 5-2. 연결 풀링

```sql
-- 연결 수 제한
ALTER SYSTEM SET max_connections = 200;

-- 공유 버퍼 크기 조정
ALTER SYSTEM SET shared_buffers = '256MB';

-- 작업 메모리 조정
ALTER SYSTEM SET work_mem = '16MB';

-- 설정 적용
SELECT pg_reload_conf();
```

### 5-3. VACUUM과 ANALYZE

```sql
-- 자동 VACUUM 설정
ALTER TABLE orders SET (
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05
);

-- 수동 VACUUM
VACUUM ANALYZE orders;

-- 전체 VACUUM (테이블 잠금)
VACUUM FULL orders;

-- VACUUM 통계 확인
SELECT 
    schemaname,
    tablename,
    n_dead_tup AS dead_tuples,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

## 6. 실전 예제

### 6-1. 이커머스 데이터베이스 설계

```sql
-- 제품 테이블 (JSONB 사용)
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    attributes JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 제품 속성 인덱스
CREATE INDEX idx_products_attributes_gin ON products USING GIN (attributes);
CREATE INDEX idx_products_price ON products (price);

-- 주문 테이블 (파티셔닝)
CREATE TABLE orders (
    id SERIAL,
    user_id INTEGER NOT NULL,
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL,
    shipping_info JSONB,
    PRIMARY KEY (id, order_date)
) PARTITION BY RANGE (order_date);

-- 월별 파티션
CREATE TABLE orders_2024_01 PARTITION OF orders
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

-- 주문 검색 (Full-Text Search)
CREATE TABLE order_notes (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    note_text TEXT NOT NULL,
    search_vector tsvector,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_order_notes_search ON order_notes USING GIN (search_vector);

-- 검색 벡터 업데이트 트리거
CREATE TRIGGER update_order_notes_search_vector
    BEFORE INSERT OR UPDATE ON order_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_search_vector();
```

### 6-2. 복합 쿼리 예제

```sql
-- JSONB와 Full-Text Search 조합
SELECT 
    p.id,
    p.name,
    p.price,
    p.attributes->>'brand' AS brand,
    ts_rank(n.search_vector, to_tsquery('english', 'quality')) AS rank
FROM products p
JOIN order_notes n ON n.order_id IN (
    SELECT id FROM orders WHERE product_id = p.id
)
WHERE p.attributes @> '{"category": "electronics"}'
  AND n.search_vector @@ to_tsquery('english', 'quality')
ORDER BY rank DESC, p.price
LIMIT 10;

-- 파티션 프루닝과 인덱스 활용
SELECT 
    o.id,
    o.total_amount,
    o.shipping_info->>'address' AS address
FROM orders o
WHERE o.order_date >= '2024-01-01'
  AND o.order_date < '2024-02-01'
  AND o.status = 'completed'
ORDER BY o.order_date DESC;
```

## 7. 모니터링과 유지보수

### 7-1. 성능 모니터링

```sql
-- 활성 쿼리 확인
SELECT 
    pid,
    usename,
    application_name,
    state,
    query,
    query_start,
    state_change
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY query_start;

-- 테이블 통계
SELECT 
    schemaname,
    tablename,
    n_live_tup AS live_tuples,
    n_dead_tup AS dead_tuples,
    last_vacuum,
    last_autovacuum,
    last_analyze,
    last_autoanalyze
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;

-- 인덱스 사용 통계
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

### 7-2. 용량 관리

```sql
-- 데이터베이스 크기
SELECT 
    pg_database.datname,
    pg_size_pretty(pg_database_size(pg_database.datname)) AS size
FROM pg_database
ORDER BY pg_database_size(pg_database.datname) DESC;

-- 테이블 크기
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - 
                   pg_relation_size(schemaname||'.'||tablename)) AS indexes_size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

## 8. 결론

PostgreSQL의 고급 기능들을 적절히 활용하면 강력하고 효율적인 데이터베이스 시스템을 구축할 수 있다. 이 글에서 다룬 내용:

1. **JSON/JSONB**: 유연한 스키마 데이터 저장 및 검색
2. **Full-Text Search**: 강력한 텍스트 검색 기능
3. **파티셔닝**: 대용량 데이터 관리 (Range, List, Hash)
4. **인덱싱**: B-Tree, GIN, GiST 등 다양한 인덱스 타입
5. **성능 최적화**: 쿼리 최적화, 연결 풀링, VACUUM
6. **모니터링**: 성능 및 용량 모니터링

이러한 기능들을 조합하여 확장 가능하고 성능이 뛰어난 데이터베이스 애플리케이션을 개발할 수 있다.

## 참고 자료

- [PostgreSQL 공식 문서](https://www.postgresql.org/docs/)
- [PostgreSQL JSON 문서](https://www.postgresql.org/docs/current/datatype-json.html)
- [PostgreSQL Full-Text Search](https://www.postgresql.org/docs/current/textsearch.html)
- [PostgreSQL Partitioning](https://www.postgresql.org/docs/current/ddl-partitioning.html)

