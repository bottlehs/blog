---
templateKey: blog-post
title: 스프링 부트 API 인터페이스 및 결과 데이터 구조 설계
date: 2021-04-08T20:29:29.537Z
category: springboot
description: Http 프로토콜은 여러 가지 사용목적에 따라 GET, POST, PUT, DELETE, FETCH.. 등 HttpMethod를 제공하고 있다. 주소 체계는 정형화된 구조로 구성하고 HttpMethod를 통해 리소스의 사용목적을 판단되도록 해야 한다.
tags:
  - 스프링
  - 스프링부트
  - Spring
  - SpringBoot
  - Java
  - 프레임워크
  - 스프링부트구조
  - 아키텍쳐
---

![스프링 부트 API 인터페이스 및 결과 데이터 구조 설계](/assets/springboot.png "스프링 부트 API 인터페이스 및 결과 데이터 구조 설계")

API 서버 개발 진행을 위해 api 인터페이스 및 결과 데이터의 구조를 살펴보고 확장 가능한 형태로 설계해 보자. api는 제공 대상이 클라이언트 App 또는 Web 개발자이다. 한번 배포되고 공유한 API는 구조를 쉽게 바꿀 수 없기 때문에, 처음부터 효율적이고 확장 가능한 형태로 모델을 설계하고 시작하는 것이 좋다. 그래서 아래와 같이 HttpMethod를 사용하고 Restful 한 API를 만들기 위해 몇 가지 규칙을 적용하도록 하겠다.

## API 인터페이스

### 리소스의 사용목적에 따라 Http method 구분

Http 프로토콜은 여러 가지 사용목적에 따라 HttpMethod를 제공하고 있다. 여기서는 그중 아래의 5가지 HttpMethod를 상황에 맞게 api 구현에 사용하도록 하겠다.

- GET : 서버에 주어진 리소스의 정보를 요청.(읽기)
- POST : 서버에 리소스를 제출. (쓰기)
- PUT : 서버에 리소스를 제출, POST와 달리 리소스 갱신 시 사용한다.(수정)
- DELETE : 서버에 주어진 리소스를 삭제 요청한다.(삭제 시)
- FETCH : 서버에 리소스를 제출, PUT와 달리 특정 리소스 갱신 시 사용한다.(일부 수정)

### 리소스에 Mapping된 주소 체계 정형화

주소 체계는 아래처럼 정형화된 구조로 구성하고 HttpMethod를 통해 리소스의 사용목적을 판단되도록 한다.

- GET /api/v1/api/user/{userId} – 회원 userId에 해당하는 정보를 조회한다.
- GET /api/v1/users – 회원 리스트를 조회한다.
- POST /api/v1/user – 신규 회원정보를 입력한다.
- PUT /api/v1/user/{userId} – 기존 회원의 정보를 수정한다.
- DELETE /api/v1/user/{userId} – userId로 기존 회원의 정보를 삭제한다.
- PUT /api/v1/user/{userId} – 기존 회원의 특정 정보만을 수정한다.

### 결과 데이터 구조 표준화

결과 데이터는 아래의 샘플처럼 결과 데이터 + api요청 결과 데이터로 구성한다.

#### 결과 모델의 정의

```json
// 기존 USER 정보
{
  "email": "id@domain.com",
  "name": "user name"
}
```

```json
// 표준화한 USER 정보
{
  "data": {
    "email": "id@doamin.com",
    "name": "user name"
  },
  "success": true,
  "code": 0,
  "message": "성공하였습니다."
}
```

## 구현

### api의 실행 결과를 담는 공통 모델

api의 처리 상태 및 메시지를 내려주는 데이터로 구성된다. success는 api의 성공실패 여부를 나타내고 code, msg는 해당 상황에서의 응답 코드와 응답 메시지를 나타낸다.

```java
@Getter
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseEntity implements Serializable {
  private static final long serialVersionUID = 9141498463876264960L;

  @CreationTimestamp
  @Temporal(TemporalType.TIMESTAMP)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss",
      timezone = "Asia/Seoul")
  @Column(name = "reg_dt", updatable = false)
  private Date reg_dt;

  @UpdateTimestamp
  @Temporal(TemporalType.TIMESTAMP)
  @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss",
      timezone = "Asia/Seoul")
  @Column(name = "mod_dt", updatable = true)
  private Date mod_dt;

  // 변환 로직을 직접 구현

  public Date getRegDt() {
    return reg_dt;
  }

  public void setRegDt(Date reg_dt) {
    this.reg_dt = reg_dt;
  }

  public Date getModDt() {
    return mod_dt;
  }

  public void setModDt(Date mod_dt) {
    this.mod_dt = mod_dt;
  }
}

```

### 결과가 단일건인 api를 담는 모델

Generic Interface에 <T>를 지정하여 어떤 형태의 값도 넣을 수 있도록 구현합니다. 또한 CommonResult를 상속받으므로 api요청 결과도 같이 출력되도록 합니다.

```java
@RestController
@Api(tags = "공지사항")
@RequestMapping(value = "/api")
public class NoticeController {
  ..code
  @ManyToMany(fetch = FetchType.LAZY)
  @ApiOperation(value = "조회-단건", notes = "단건 조회", tags = "공지사항")
  @GetMapping(value = "/notice/{id}")
  @ResponseStatus(value = HttpStatus.OK)
  public Notice get(@PathVariable Integer id) {
    return noticeService.getId(id);
  }
  ..code
}
```

### 결과가 여러건인 api를 담는 모델

api 결과가 다중 건인 경우에 대한 데이터 모델이다. 결과 필드를 List 형태로 선언하고 Generic Interface에 <T>를 지정하여 어떤 형태의 List값도 넣을 수 있도록 구현합니다. 또한 CommonResult를 상속받으므로 api요청 결과도 같이 출력되도록 합니다.

```java
@RestController
@Api(tags = "공지사항")
@RequestMapping(value = "/api")
public class NoticeController {
  ..code
  @ManyToMany(fetch = FetchType.LAZY)
  @ApiOperation(value = "조회", notes = "전체 조회", tags = "공지사항")
  @GetMapping(value = "/notice")
  @ResponseStatus(value = HttpStatus.OK)
  public List<Notice> getAll() {
    return noticeService.getAll();
  }
  ..code
}
```

### 결과 모델을 처리할 Service 정의

결과 모델에 데이터를 넣어주는 역할을 할 Service를 정의합니다. api.service 하위에 service package를 생성하고 아래의 Service Class를 생성합니다.

```java
public interface NoticeService {
  ..code
  // 조회
  List<Notice> getAll();

  // 조회-단건
  Notice getId(Integer id);
  ..code
}

```

```java
@Service
public class NoticeServiceImpl implements NoticeService {
  ..code
  // 조회
  @Override
  public List<Notice> getAll() {
    return noticeRepository.findAll();
  }

  // 조회-단건
  @Override
  public Notice getId(Integer id) {
    return noticeRepository.getOne(id);
  }
  ..code
}

```

### HttpMethod와 정형화된 주소체계를 Controller에 정의

소스의 사용 목적에 따라 GetMapping, PostMapping, PutMapping, DeleteMapping, FetchMapping 사용

```java
@RestController
@Api(tags = "공지사항")
@RequestMapping(value = "/api")
public class NoticeController {
  private final NoticeService noticeService;

  public NoticeController(NoticeService noticeService) {
    this.noticeService = noticeService;
  }

  @ManyToMany(fetch = FetchType.LAZY)
  @ApiOperation(value = "조회", notes = "전체 조회", tags = "공지사항")
  @GetMapping(value = "/notice")
  @ResponseStatus(value = HttpStatus.OK)
  public List<Notice> getAll() {
    return noticeService.getAll();
  }

  @ManyToMany(fetch = FetchType.LAZY)
  @ApiOperation(value = "조회-단건", notes = "단건 조회", tags = "공지사항")
  @GetMapping(value = "/notice/{id}")
  @ResponseStatus(value = HttpStatus.OK)
  public Notice get(@PathVariable Integer id) {
    return noticeService.getId(id);
  }

  @ApiOperation(value = "등록", notes = "등록", tags = "공지사항")
  @PostMapping(value = "/notice")
  @ResponseStatus(value = HttpStatus.OK)
  public Notice add(@RequestBody Notice notice) {
    return noticeService.add(notice.getTitle(), notice.getCont(), notice.getTp());
  }

  @ApiOperation(value = "삭제", notes = "전체 삭제", tags = "공지사항")
  @DeleteMapping(value = "/notice")
  @ResponseStatus(value = HttpStatus.OK)
  public void removeAll() {
    noticeService.removeAll();
  }

  @ApiOperation(value = "삭제-단건", notes = "단건 삭제", tags = "공지사항")
  @DeleteMapping(value = "/notice/{id}")
  @ResponseStatus(value = HttpStatus.OK)
  public void remove(@PathVariable Integer id) {
    noticeService.remove(id);
  }

  @ApiOperation(value = "수정", notes = "단건 수정", tags = "공지사항")
  @PutMapping(value = "/notice/{id}")
  @ResponseStatus(value = HttpStatus.OK)
  public Notice modify(@PathVariable Integer id, @RequestBody Notice notice) {
    return noticeService.modify(id, notice.getTitle(), notice.getCont(), notice.getTp());
  }
}
```

api 서비스를 구축하기 위한 인터페이스 및 결과 구조 설계 방법 이다.

자세한 소스 코드는 "https://github.com/bottlehs/springboot-vue-starter-kit" 참고 하길 바란다.
