---
templateKey: blog-post
title: Event Sourcing과 CQRS 패턴 - 이벤트 기반 아키텍처 설계 실전 가이드
date: 2025-12-07T00:00:00.000Z
category: springboot
description:
  Event Sourcing과 CQRS 패턴의 기초부터 실전 구현까지. 이벤트 스토어 설계, 이벤트 리플레이, 스냅샷, 읽기 모델 동기화, Spring Boot 구현, 실전 예제까지 완벽하게 다룹니다.
tags:
  - Event Sourcing
  - CQRS
  - 이벤트 기반 아키텍처
  - Spring Boot
  - 이벤트 스토어
  - 도메인 이벤트
  - 마이크로서비스
  - 분산 시스템
---

# Event Sourcing과 CQRS 패턴 - 이벤트 기반 아키텍처 설계 실전 가이드

Event Sourcing은 애플리케이션의 상태 변경을 일련의 이벤트로 저장하는 패턴이다. CQRS(Command Query Responsibility Segregation)는 명령(쓰기)과 쿼리(읽기)를 분리하는 패턴이다. 이 두 패턴을 결합하면 확장 가능하고 유연한 이벤트 기반 아키텍처를 구축할 수 있다.

## 1. Event Sourcing과 CQRS 개요

### 1-1. Event Sourcing이란?

Event Sourcing은 다음과 같은 특징을 가진다:

- **이벤트 저장**: 상태 변경을 이벤트로 저장
- **이벤트 리플레이**: 이벤트를 재생하여 현재 상태 복원
- **완전한 감사 추적**: 모든 변경 이벤트 기록
- **시간 여행**: 과거 시점의 상태 조회 가능
- **이벤트 재처리**: 읽기 모델 재구축 가능

### 1-2. CQRS란?

CQRS는 다음과 같은 특징을 가진다:

- **명령과 쿼리 분리**: 쓰기와 읽기 모델 분리
- **독립적 스케일링**: 읽기/쓰기 각각 독립적으로 스케일링
- **최적화**: 읽기 모델을 쿼리에 최적화
- **복잡도 관리**: 도메인 로직과 쿼리 로직 분리

### 1-3. 전통적 방식 vs Event Sourcing + CQRS

| 구분 | 전통적 방식 | Event Sourcing + CQRS |
|------|-------------|----------------------|
| **데이터 저장** | 현재 상태만 저장 | 모든 이벤트 저장 |
| **감사 추적** | 별도 로그 필요 | 이벤트가 감사 추적 |
| **읽기 성능** | 단일 모델 | 최적화된 읽기 모델 |
| **복잡도** | 낮음 | 높음 |
| **시간 여행** | 불가능 | 가능 |
| **이벤트 재처리** | 불가능 | 가능 |

## 2. 기본 개념과 아키텍처

### 2-1. 이벤트 정의

```java
// BaseEvent.java
public abstract class BaseEvent {
    private String aggregateId;
    private Long version;
    private LocalDateTime occurredAt;
    private String eventType;
    
    public BaseEvent(String aggregateId) {
        this.aggregateId = aggregateId;
        this.occurredAt = LocalDateTime.now();
        this.eventType = this.getClass().getSimpleName();
    }
    
    // getters and setters
}

// OrderCreatedEvent.java
public class OrderCreatedEvent extends BaseEvent {
    private String userId;
    private List<OrderItem> items;
    private BigDecimal totalAmount;
    
    public OrderCreatedEvent(String orderId, String userId, 
                            List<OrderItem> items, BigDecimal totalAmount) {
        super(orderId);
        this.userId = userId;
        this.items = items;
        this.totalAmount = totalAmount;
    }
    
    // getters and setters
}

// OrderPaidEvent.java
public class OrderPaidEvent extends BaseEvent {
    private String paymentId;
    private BigDecimal amount;
    private LocalDateTime paidAt;
    
    public OrderPaidEvent(String orderId, String paymentId, 
                         BigDecimal amount, LocalDateTime paidAt) {
        super(orderId);
        this.paymentId = paymentId;
        this.amount = amount;
        this.paidAt = paidAt;
    }
    
    // getters and setters
}
```

### 2-2. Aggregate Root

```java
// Order.java (Aggregate Root)
public class Order {
    private String id;
    private String userId;
    private List<OrderItem> items;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private Long version;
    private List<BaseEvent> uncommittedEvents = new ArrayList<>();
    
    // 이벤트로부터 Aggregate 재구성
    public static Order fromEvents(List<BaseEvent> events) {
        Order order = new Order();
        for (BaseEvent event : events) {
            order.apply(event);
        }
        return order;
    }
    
    // 이벤트 적용
    private void apply(BaseEvent event) {
        if (event instanceof OrderCreatedEvent) {
            apply((OrderCreatedEvent) event);
        } else if (event instanceof OrderPaidEvent) {
            apply((OrderPaidEvent) event);
        } else if (event instanceof OrderCancelledEvent) {
            apply((OrderCancelledEvent) event);
        }
        this.version = event.getVersion();
    }
    
    private void apply(OrderCreatedEvent event) {
        this.id = event.getAggregateId();
        this.userId = event.getUserId();
        this.items = event.getItems();
        this.totalAmount = event.getTotalAmount();
        this.status = OrderStatus.CREATED;
    }
    
    private void apply(OrderPaidEvent event) {
        this.status = OrderStatus.PAID;
    }
    
    private void apply(OrderCancelledEvent event) {
        this.status = OrderStatus.CANCELLED;
    }
    
    // 명령 처리
    public void create(String userId, List<OrderItem> items, BigDecimal totalAmount) {
        if (this.id != null) {
            throw new IllegalStateException("Order already created");
        }
        
        OrderCreatedEvent event = new OrderCreatedEvent(
            UUID.randomUUID().toString(),
            userId,
            items,
            totalAmount
        );
        
        apply(event);
        uncommittedEvents.add(event);
    }
    
    public void pay(String paymentId, BigDecimal amount, LocalDateTime paidAt) {
        if (this.status != OrderStatus.CREATED) {
            throw new IllegalStateException("Order cannot be paid");
        }
        
        OrderPaidEvent event = new OrderPaidEvent(
            this.id,
            paymentId,
            amount,
            paidAt
        );
        
        apply(event);
        uncommittedEvents.add(event);
    }
    
    public void cancel(String reason) {
        if (this.status == OrderStatus.PAID || this.status == OrderStatus.CANCELLED) {
            throw new IllegalStateException("Order cannot be cancelled");
        }
        
        OrderCancelledEvent event = new OrderCancelledEvent(this.id, reason);
        apply(event);
        uncommittedEvents.add(event);
    }
    
    public List<BaseEvent> getUncommittedEvents() {
        return new ArrayList<>(uncommittedEvents);
    }
    
    public void markEventsAsCommitted() {
        uncommittedEvents.clear();
    }
    
    // getters
}
```

## 3. 이벤트 스토어 구현

### 3-1. 이벤트 스토어 인터페이스

```java
// EventStore.java
public interface EventStore {
    void saveEvents(String aggregateId, List<BaseEvent> events, Long expectedVersion);
    List<BaseEvent> getEvents(String aggregateId);
    List<BaseEvent> getEvents(String aggregateId, Long fromVersion);
    List<BaseEvent> getAllEvents();
    List<BaseEvent> getEventsByType(String eventType);
}
```

### 3-2. JPA 기반 이벤트 스토어

```java
// EventEntity.java
@Entity
@Table(name = "events")
public class EventEntity {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String aggregateId;
    
    @Column(nullable = false)
    private Long version;
    
    @Column(nullable = false)
    private String eventType;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String eventData;
    
    @Column(nullable = false)
    private LocalDateTime occurredAt;
    
    // getters and setters
}

// JpaEventStore.java
@Repository
public class JpaEventStore implements EventStore {
    
    @Autowired
    private EventRepository eventRepository;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    @Override
    @Transactional
    public void saveEvents(String aggregateId, List<BaseEvent> events, Long expectedVersion) {
        // 낙관적 잠금 확인
        Long currentVersion = eventRepository.findMaxVersionByAggregateId(aggregateId)
            .orElse(0L);
        
        if (expectedVersion != null && !currentVersion.equals(expectedVersion)) {
            throw new ConcurrentModificationException(
                "Expected version " + expectedVersion + " but was " + currentVersion
            );
        }
        
        Long nextVersion = currentVersion;
        for (BaseEvent event : events) {
            nextVersion++;
            event.setVersion(nextVersion);
            
            EventEntity entity = new EventEntity();
            entity.setId(UUID.randomUUID().toString());
            entity.setAggregateId(aggregateId);
            entity.setVersion(nextVersion);
            entity.setEventType(event.getClass().getSimpleName());
            entity.setEventData(serializeEvent(event));
            entity.setOccurredAt(event.getOccurredAt());
            
            eventRepository.save(entity);
        }
    }
    
    @Override
    public List<BaseEvent> getEvents(String aggregateId) {
        List<EventEntity> entities = eventRepository
            .findByAggregateIdOrderByVersionAsc(aggregateId);
        return deserializeEvents(entities);
    }
    
    @Override
    public List<BaseEvent> getEvents(String aggregateId, Long fromVersion) {
        List<EventEntity> entities = eventRepository
            .findByAggregateIdAndVersionGreaterThanOrderByVersionAsc(aggregateId, fromVersion);
        return deserializeEvents(entities);
    }
    
    private String serializeEvent(BaseEvent event) {
        try {
            return objectMapper.writeValueAsString(event);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize event", e);
        }
    }
    
    private BaseEvent deserializeEvent(EventEntity entity) {
        try {
            Class<?> eventClass = Class.forName(
                "com.example.events." + entity.getEventType()
            );
            return (BaseEvent) objectMapper.readValue(
                entity.getEventData(),
                eventClass
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize event", e);
        }
    }
    
    private List<BaseEvent> deserializeEvents(List<EventEntity> entities) {
        return entities.stream()
            .map(this::deserializeEvent)
            .collect(Collectors.toList());
    }
}
```

### 3-3. Repository 패턴

```java
// OrderRepository.java
@Repository
public class OrderRepository {
    
    @Autowired
    private EventStore eventStore;
    
    public Order findById(String orderId) {
        List<BaseEvent> events = eventStore.getEvents(orderId);
        if (events.isEmpty()) {
            return null;
        }
        return Order.fromEvents(events);
    }
    
    public void save(Order order) {
        List<BaseEvent> uncommittedEvents = order.getUncommittedEvents();
        if (!uncommittedEvents.isEmpty()) {
            Long expectedVersion = order.getVersion() - uncommittedEvents.size();
            eventStore.saveEvents(order.getId(), uncommittedEvents, expectedVersion);
            order.markEventsAsCommitted();
        }
    }
}
```

## 4. CQRS 구현

### 4-1. 명령 처리 (Write Side)

```java
// CreateOrderCommand.java
public class CreateOrderCommand {
    private String userId;
    private List<OrderItem> items;
    private BigDecimal totalAmount;
    
    // getters and setters
}

// OrderCommandHandler.java
@Component
public class OrderCommandHandler {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private EventPublisher eventPublisher;
    
    public String handle(CreateOrderCommand command) {
        Order order = new Order();
        order.create(
            command.getUserId(),
            command.getItems(),
            command.getTotalAmount()
        );
        
        orderRepository.save(order);
        
        // 이벤트 발행
        for (BaseEvent event : order.getUncommittedEvents()) {
            eventPublisher.publish(event);
        }
        
        return order.getId();
    }
    
    public void handle(PayOrderCommand command) {
        Order order = orderRepository.findById(command.getOrderId());
        if (order == null) {
            throw new OrderNotFoundException(command.getOrderId());
        }
        
        order.pay(
            command.getPaymentId(),
            command.getAmount(),
            LocalDateTime.now()
        );
        
        orderRepository.save(order);
        
        for (BaseEvent event : order.getUncommittedEvents()) {
            eventPublisher.publish(event);
        }
    }
}
```

### 4-2. 읽기 모델 (Read Side)

```java
// OrderReadModel.java
@Entity
@Table(name = "order_read_model")
public class OrderReadModel {
    @Id
    private String id;
    
    private String userId;
    
    @ElementCollection
    @CollectionTable(name = "order_items_read", joinColumns = @JoinColumn(name = "order_id"))
    private List<OrderItem> items;
    
    private BigDecimal totalAmount;
    
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    
    private LocalDateTime createdAt;
    private LocalDateTime paidAt;
    
    // getters and setters
}

// OrderReadRepository.java
@Repository
public interface OrderReadRepository extends JpaRepository<OrderReadModel, String> {
    List<OrderReadModel> findByUserId(String userId);
    List<OrderReadModel> findByStatus(OrderStatus status);
    List<OrderReadModel> findByCreatedAtBetween(LocalDateTime start, LocalDateTime end);
}
```

### 4-3. 이벤트 핸들러 (읽기 모델 업데이트)

```java
// OrderReadModelUpdater.java
@Component
public class OrderReadModelUpdater {
    
    @Autowired
    private OrderReadRepository readRepository;
    
    @EventListener
    public void handle(OrderCreatedEvent event) {
        OrderReadModel readModel = new OrderReadModel();
        readModel.setId(event.getAggregateId());
        readModel.setUserId(event.getUserId());
        readModel.setItems(event.getItems());
        readModel.setTotalAmount(event.getTotalAmount());
        readModel.setStatus(OrderStatus.CREATED);
        readModel.setCreatedAt(event.getOccurredAt());
        
        readRepository.save(readModel);
    }
    
    @EventListener
    public void handle(OrderPaidEvent event) {
        OrderReadModel readModel = readRepository.findById(event.getAggregateId())
            .orElseThrow(() -> new OrderNotFoundException(event.getAggregateId()));
        
        readModel.setStatus(OrderStatus.PAID);
        readModel.setPaidAt(event.getPaidAt());
        
        readRepository.save(readModel);
    }
    
    @EventListener
    public void handle(OrderCancelledEvent event) {
        OrderReadModel readModel = readRepository.findById(event.getAggregateId())
            .orElseThrow(() -> new OrderNotFoundException(event.getAggregateId()));
        
        readModel.setStatus(OrderStatus.CANCELLED);
        
        readRepository.save(readModel);
    }
}
```

### 4-4. 쿼리 처리 (Read Side)

```java
// OrderQueryService.java
@Service
public class OrderQueryService {
    
    @Autowired
    private OrderReadRepository readRepository;
    
    public OrderReadModel getOrder(String orderId) {
        return readRepository.findById(orderId)
            .orElseThrow(() -> new OrderNotFoundException(orderId));
    }
    
    public List<OrderReadModel> getOrdersByUser(String userId) {
        return readRepository.findByUserId(userId);
    }
    
    public List<OrderReadModel> getOrdersByStatus(OrderStatus status) {
        return readRepository.findByStatus(status);
    }
    
    public List<OrderReadModel> getOrdersByDateRange(
        LocalDateTime start,
        LocalDateTime end
    ) {
        return readRepository.findByCreatedAtBetween(start, end);
    }
}
```

## 5. 스냅샷 패턴

### 5-1. 스냅샷 구현

```java
// Snapshot.java
@Entity
@Table(name = "snapshots")
public class Snapshot {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String aggregateId;
    
    @Column(nullable = false)
    private Long version;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String snapshotData;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // getters and setters
}

// SnapshotRepository.java
@Repository
public interface SnapshotRepository extends JpaRepository<Snapshot, String> {
    Optional<Snapshot> findTopByAggregateIdOrderByVersionDesc(String aggregateId);
}

// SnapshotService.java
@Service
public class SnapshotService {
    
    @Autowired
    private SnapshotRepository snapshotRepository;
    
    @Autowired
    private EventStore eventStore;
    
    @Autowired
    private ObjectMapper objectMapper;
    
    private static final int SNAPSHOT_INTERVAL = 100; // 100개 이벤트마다 스냅샷
    
    public void saveSnapshot(String aggregateId, Order order) {
        if (order.getVersion() % SNAPSHOT_INTERVAL == 0) {
            Snapshot snapshot = new Snapshot();
            snapshot.setId(UUID.randomUUID().toString());
            snapshot.setAggregateId(aggregateId);
            snapshot.setVersion(order.getVersion());
            snapshot.setSnapshotData(serializeOrder(order));
            snapshot.setCreatedAt(LocalDateTime.now());
            
            snapshotRepository.save(snapshot);
        }
    }
    
    public Order loadFromSnapshot(String aggregateId) {
        Optional<Snapshot> snapshotOpt = snapshotRepository
            .findTopByAggregateIdOrderByVersionDesc(aggregateId);
        
        if (snapshotOpt.isPresent()) {
            Snapshot snapshot = snapshotOpt.get();
            Order order = deserializeOrder(snapshot.getSnapshotData());
            
            // 스냅샷 이후의 이벤트 로드
            List<BaseEvent> events = eventStore.getEvents(
                aggregateId,
                snapshot.getVersion()
            );
            
            // 이벤트 적용
            for (BaseEvent event : events) {
                order.apply(event);
            }
            
            return order;
        } else {
            // 스냅샷이 없으면 모든 이벤트 로드
            List<BaseEvent> events = eventStore.getEvents(aggregateId);
            return Order.fromEvents(events);
        }
    }
    
    private String serializeOrder(Order order) {
        try {
            return objectMapper.writeValueAsString(order);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize order", e);
        }
    }
    
    private Order deserializeOrder(String data) {
        try {
            return objectMapper.readValue(data, Order.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deserialize order", e);
        }
    }
}
```

## 6. 이벤트 발행과 구독

### 6-1. 이벤트 발행자

```java
// EventPublisher.java
@Component
public class EventPublisher {
    
    private final ApplicationEventPublisher applicationEventPublisher;
    
    public EventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = applicationEventPublisher;
    }
    
    public void publish(BaseEvent event) {
        applicationEventPublisher.publishEvent(event);
    }
    
    public void publishAll(List<BaseEvent> events) {
        for (BaseEvent event : events) {
            publish(event);
        }
    }
}
```

### 6-2. 외부 시스템 이벤트 발행 (Kafka)

```java
// KafkaEventPublisher.java
@Component
public class KafkaEventPublisher {
    
    @Autowired
    private KafkaTemplate<String, Object> kafkaTemplate;
    
    @EventListener
    @Async
    public void handle(BaseEvent event) {
        String topic = "domain-events";
        kafkaTemplate.send(topic, event.getAggregateId(), event);
    }
}
```

### 6-3. 이벤트 구독자

```java
// InventoryEventHandler.java
@Component
public class InventoryEventHandler {
    
    @Autowired
    private InventoryService inventoryService;
    
    @EventListener
    @Async
    public void handle(OrderCreatedEvent event) {
        // 재고 차감
        for (OrderItem item : event.getItems()) {
            inventoryService.decreaseStock(
                item.getProductId(),
                item.getQuantity()
            );
        }
    }
    
    @EventListener
    @Async
    public void handle(OrderCancelledEvent event) {
        // 재고 복구
        Order order = loadOrder(event.getAggregateId());
        for (OrderItem item : order.getItems()) {
            inventoryService.increaseStock(
                item.getProductId(),
                item.getQuantity()
            );
        }
    }
}

// NotificationEventHandler.java
@Component
public class NotificationEventHandler {
    
    @Autowired
    private NotificationService notificationService;
    
    @EventListener
    @Async
    public void handle(OrderCreatedEvent event) {
        notificationService.sendOrderConfirmation(event.getUserId(), event.getAggregateId());
    }
    
    @EventListener
    @Async
    public void handle(OrderPaidEvent event) {
        Order order = loadOrder(event.getAggregateId());
        notificationService.sendPaymentConfirmation(order.getUserId(), event.getAggregateId());
    }
}
```

## 7. Spring Boot 통합

### 7-1. 설정

```java
// EventSourcingConfig.java
@Configuration
@EnableAsync
public class EventSourcingConfig {
    
    @Bean
    public ObjectMapper objectMapper() {
        ObjectMapper mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule());
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        return mapper;
    }
    
    @Bean
    public TaskExecutor eventTaskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("event-handler-");
        executor.initialize();
        return executor;
    }
}
```

### 7-2. REST API

```java
// OrderController.java
@RestController
@RequestMapping("/api/orders")
public class OrderController {
    
    @Autowired
    private OrderCommandHandler commandHandler;
    
    @Autowired
    private OrderQueryService queryService;
    
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(@RequestBody CreateOrderRequest request) {
        CreateOrderCommand command = new CreateOrderCommand();
        command.setUserId(request.getUserId());
        command.setItems(request.getItems());
        command.setTotalAmount(request.getTotalAmount());
        
        String orderId = commandHandler.handle(command);
        
        OrderReadModel order = queryService.getOrder(orderId);
        return ResponseEntity.ok(toResponse(order));
    }
    
    @PostMapping("/{orderId}/pay")
    public ResponseEntity<Void> payOrder(
        @PathVariable String orderId,
        @RequestBody PayOrderRequest request
    ) {
        PayOrderCommand command = new PayOrderCommand();
        command.setOrderId(orderId);
        command.setPaymentId(request.getPaymentId());
        command.setAmount(request.getAmount());
        
        commandHandler.handle(command);
        
        return ResponseEntity.ok().build();
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<OrderResponse> getOrder(@PathVariable String orderId) {
        OrderReadModel order = queryService.getOrder(orderId);
        return ResponseEntity.ok(toResponse(order));
    }
    
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getOrders(
        @RequestParam(required = false) String userId,
        @RequestParam(required = false) OrderStatus status
    ) {
        List<OrderReadModel> orders;
        if (userId != null) {
            orders = queryService.getOrdersByUser(userId);
        } else if (status != null) {
            orders = queryService.getOrdersByStatus(status);
        } else {
            orders = queryService.getAllOrders();
        }
        
        List<OrderResponse> responses = orders.stream()
            .map(this::toResponse)
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }
    
    private OrderResponse toResponse(OrderReadModel order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setUserId(order.getUserId());
        response.setItems(order.getItems());
        response.setTotalAmount(order.getTotalAmount());
        response.setStatus(order.getStatus());
        response.setCreatedAt(order.getCreatedAt());
        return response;
    }
}
```

## 8. 실전 패턴과 모범 사례

### 8-1. 이벤트 버전 관리

```java
// OrderCreatedEventV2.java
public class OrderCreatedEventV2 extends BaseEvent {
    private String userId;
    private List<OrderItem> items;
    private BigDecimal totalAmount;
    private String shippingAddress; // 새 필드 추가
    
    // getters and setters
}

// 이벤트 업그레이드
@Component
public class EventUpgrader {
    
    public BaseEvent upgrade(BaseEvent event) {
        if (event instanceof OrderCreatedEvent && 
            event.getVersion() < 2) {
            // V1을 V2로 업그레이드
            OrderCreatedEvent v1 = (OrderCreatedEvent) event;
            OrderCreatedEventV2 v2 = new OrderCreatedEventV2(
                v1.getAggregateId(),
                v1.getUserId(),
                v1.getItems(),
                v1.getTotalAmount(),
                "" // 기본값
            );
            v2.setVersion(2L);
            return v2;
        }
        return event;
    }
}
```

### 8-2. 이벤트 순서 보장

```java
// OrderedEventStore.java
@Component
public class OrderedEventStore {
    
    @Autowired
    private EventStore eventStore;
    
    @Autowired
    private RedisTemplate<String, String> redisTemplate;
    
    public void saveEvents(String aggregateId, List<BaseEvent> events, Long expectedVersion) {
        String lockKey = "lock:" + aggregateId;
        
        // 분산 락 획득
        Boolean locked = redisTemplate.opsForValue()
            .setIfAbsent(lockKey, "locked", Duration.ofSeconds(10));
        
        if (!locked) {
            throw new ConcurrentModificationException("Failed to acquire lock");
        }
        
        try {
            eventStore.saveEvents(aggregateId, events, expectedVersion);
        } finally {
            redisTemplate.delete(lockKey);
        }
    }
}
```

### 8-3. 이벤트 재처리

```java
// EventReplayService.java
@Service
public class EventReplayService {
    
    @Autowired
    private EventStore eventStore;
    
    @Autowired
    private OrderReadModelUpdater readModelUpdater;
    
    @Autowired
    private OrderReadRepository readRepository;
    
    public void replayEvents(String aggregateId) {
        // 읽기 모델 삭제
        readRepository.deleteById(aggregateId);
        
        // 이벤트 재생
        List<BaseEvent> events = eventStore.getEvents(aggregateId);
        for (BaseEvent event : events) {
            readModelUpdater.handle(event);
        }
    }
    
    public void replayAllEvents() {
        List<BaseEvent> allEvents = eventStore.getAllEvents();
        
        // 읽기 모델 전체 삭제
        readRepository.deleteAll();
        
        // 이벤트 재생
        for (BaseEvent event : allEvents) {
            readModelUpdater.handle(event);
        }
    }
}
```

## 9. 모니터링과 디버깅

### 9-1. 이벤트 로깅

```java
// LoggingEventHandler.java
@Component
public class LoggingEventHandler {
    
    private static final Logger logger = LoggerFactory.getLogger(
        LoggingEventHandler.class);
    
    @EventListener
    public void handle(BaseEvent event) {
        logger.info("Event occurred: {} for aggregate: {} at version: {}",
            event.getEventType(),
            event.getAggregateId(),
            event.getVersion());
    }
}
```

### 9-2. 메트릭 수집

```java
// MetricsEventHandler.java
@Component
public class MetricsEventHandler {
    
    private final Counter eventCounter;
    private final Timer eventProcessingTime;
    
    public MetricsEventHandler(MeterRegistry meterRegistry) {
        this.eventCounter = Counter.builder("events.total")
            .description("Total number of events")
            .register(meterRegistry);
        
        this.eventProcessingTime = Timer.builder("events.processing.time")
            .description("Event processing time")
            .register(meterRegistry);
    }
    
    @EventListener
    public void handle(BaseEvent event) {
        eventCounter.increment(
            Tags.of("type", event.getEventType())
        );
    }
}
```

## 10. 결론

Event Sourcing과 CQRS는 복잡하지만 강력한 아키텍처 패턴이다. 이 글에서 다룬 내용:

1. **기본 개념**: Event Sourcing, CQRS 패턴
2. **이벤트 정의**: 도메인 이벤트 설계
3. **Aggregate Root**: 이벤트 기반 도메인 모델
4. **이벤트 스토어**: 이벤트 저장 및 조회
5. **CQRS 구현**: 명령/쿼리 분리
6. **스냅샷**: 성능 최적화
7. **이벤트 발행/구독**: 이벤트 기반 통신
8. **Spring Boot 통합**: 실전 구현
9. **실전 패턴**: 버전 관리, 순서 보장, 재처리

이러한 패턴들을 적절히 활용하면 확장 가능하고 유연한 이벤트 기반 시스템을 구축할 수 있다.

## 참고 자료

- [Event Sourcing 패턴](https://martinfowler.com/eaaDev/EventSourcing.html)
- [CQRS 패턴](https://martinfowler.com/bliki/CQRS.html)
- [Axon Framework](https://axoniq.io/)
- [EventStore](https://www.eventstore.com/)

