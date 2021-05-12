---
templateKey: blog-post
title: Android ROOM
date: 2021-05-02T18:11:34.709Z
category: android
description:
tags:
  - android
  - kotlin
  - framework
  - room
---

![Android ROOM](/assets/android-logo.png "Android ROOM")

## 개요

> Room은 SQLite에 대한 추상화 레이어를 제공하여 원활한 데이터베이스 액세스를 지원하는 동시에 SQLite를 완벽히 활용합니다. 상당한 양의 구조화된 데이터를 처리하는 앱은 데이터를 로컬로 유지하여 대단한 이점을 얻을 수 있습니다. 가장 일반적인 사용 사례는 관련 데이터를 캐싱하는 것입니다. 이런 방식으로 기기가 네트워크에 액세스할 수 없을 때 오프라인 상태인 동안에도 사용자가 여전히 콘텐츠를 탐색할 수 있습니다. 나중에 기기가 다시 온라인 상태가 되면 사용자가 시작한 콘텐츠 변경사항이 서버에 동기화됩니다. Room은 이러한 문제를 자동으로 처리하므로 SQLite 대신 Room을 사용할 것을 적극적으로 권장합니다.

## ROOM 특징

![Android ROOM Architecture](/assets/android_room_architecture.png "Android ROOM Architecture")

Android ROOM Architecture

### Database (데이터베이스)

저장하는 데이터의 집합 단위를 말합니다

```kotlin
@Database(version = 1, entities = {Coffees.class})
abstract class AppDatabase extends RoomDatabase(){
  abstract public CoffeesDao coffeesDao();
}
```

### Entity (항목)

데이터베이스 내의 테이블을 의미합니다

```kotlin
@Entity
public class Coffees{
  // 기본키
  @PrimaryKey
  public int id;

  public String title;
}
```

### DAO (다오)

데이터베이스에 접근하는 함수(insert,update,delete,...)를 제공합니다

```kotlin
@Dao
interface CoffeesDao {
  // 조회
  @Query("SELECT * FROM table_coffees")
  fun getAll(): List<Coffees>

  // 입력
  @Insert
  fun insertAll(vararg contacts: Coffees)

  // 삭제
  @Delete
  fun delete(contacts: Coffees)
}
```

## 사용해 보기

```sh
pakage
│── MainActivity.kt
│── AppDatabase.kt
│── Coffees.kt
└── CoffeesDao.kt
```

### Gradle에 ROOM 추가

room dependencies를 추가해준다

app/build.gradle

```groovy
dependencies {
  def room_version = "2.2.6"

  implementation "androidx.room:room-runtime:$room_version"
  annotationProcessor "androidx.room:room-compiler:$room_version"
  implementation "androidx.room:room-ktx:$room_version"
  implementation "androidx.room:room-rxjava2:$room_version"
  implementation "androidx.room:room-guava:$room_version"
  testImplementation "androidx.room:room-testing:$room_version"
}
```

### Entity 만들기

```kotlin
// Coffees.kt
@Entity
public class Coffees{
  // 기본키
  @PrimaryKey
  public int id;

  public String title;
}
```

### Dao 만들기

```kotlin
// CoffeesDao.kt
@Dao
interface CoffeesDao {
  // 조회
  @Query("SELECT * FROM table_coffees")
  fun getAll(): List<Coffees>

  // 입력
  @Insert
  fun insertAll(vararg contacts: Coffees)

  // 삭제
  @Delete
  fun delete(contacts: Coffees)
}
```

### Database 만들기

```kotlin
// AppDatabase.kt
@Database(entities = [Coffees]::class], version = 1, exportSchema = false)
abstract class AppDatabase : RoomDatabase() {
    abstract fun coffeesDao(): CoffeesDao

    companion object {
        private var instance: AppDatabase? = null

        @Synchronized
        fun getInstance(context: Context): AppDatabase? {
            if (instance == null) {
                instance = Room.databaseBuilder(
                    context.applicationContext,
                    AppDatabase::class.java,
                    "database-coffeeapp"
                )
                    .allowMainThreadQueries()
                    .build()
            }
            return instance
        }
    }
}
```

### MainActivity

```kotlin
// MainActivity.kt
var db : AppDatabase? = null

override fun onCreate(savedInstanceState: Bundle?) {
  val coffee = Coffees(0, 'title');

  // insert
  db?.coffesDao()?.insertAll(coffee);

  // select
  val list = db!!.coffesDao().getAll();
  Log.i("MainActivity",""+list.size) // 1

  // delete
  db?.coffesDao()?.delete(coffee);

  // select
  val list = db!!.coffesDao().getAll();
  Log.i("MainActivity",""+list.size) // 0
}
```

안드로이드 앱에서 내부 DB의 개념과 실제로 Room 데이터베이스 라이브러리를 활용하여 입력,출력,삭제를 구현한 예제 이다. Room DB 라이브러리를 사용해보기 전 SQLite DB 라이브러리를 먼저 접해보시는 것을 추천 한다. 다음에는 간단한 TODO 앱을 개발해 보겠다.
