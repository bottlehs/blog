---
templateKey: blog-post
title: Vue Js Vuex State, Mutations, Actions, Getters 이해 및 활용
date: 2021-04-11T20:11:34.709Z
description: Vuex State 는 데이터 상태를 관리 하며, Getters 를 사용하여 동일한 로직을 중앙에서 관리 하도록한다. Mutations 에는 순차적인 로직들만 선언하고 Actions 에는 비 순차적 또는 비동기 처리 로직들을 선언한다. 그리고 mapGetters, mapMutations, mapActions 등 헬퍼 함수가 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - vuex
  - mutations
  - actions
  - getters
---

![Vue Js Vuex State, Mutations, Actions, Getters 이해 및 활용](/assets/vue-logo.png "Vue Js Vuex State, Mutations, Actions, Getters 이해 및 활용")

## Vuex State

Vuex State 는 데이터 상태를 관리 합니다.

### Vuex State 등록

`store/index.js` 에 count state 속성을 추가후 정수형 `0` 으로 초기화 합니다.

```javascript
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  // count state 속성 추가
  state: {
    count: 0, // count 를 0 으로 초기화
  },
  mutations: {},
  actions: {},
  modules: {},
})
```

state는 컴포넌트 간에 공유할 data 속성을 의미합니다. Component 에 있는 data 속성과 동일한 역할을 합니다.

### Vuex State 접근

state에 등록한 count속성은 컴포넌트의 템플릿 코드에서 `$store.state.count` 로 접근할 수 있습니다.

store 를 사용해 보기 위해 `views/Vuex.vue` 컴포넌트를 하나 생성 합니다.

![Vue Js Vuex View Dir](/assets/vue-vuex-view-vuex.png "Vue Js Vuex View Dir")

그리고 아래와 같이 `$store.state.count` 를 사용하여 Vuex 컴포넌트에 사용해 보겠습니다.

```vue
<template>
  <div class="vuex">
    <h1>Vuex 화면 입니다.</h1>
    count : {{ $store.state.count }}
  </div>
</template>

<script>
export default {
  name: "Vuex",
  components: {},
};
```

![Vue Js Vuex View Vuex Render](/assets/vue-vuex-view-vuex-render.png "Vue Js Vuex View Vuex Render")

## Vuex Getters

중앙 데이터 관리식 구조에서 발생하는 문제점 중 하나는 각 컴포넌트에서 Vuex 의 데이터를 접근할 때 중복된 코드를 반복호출 하게 되는 것이다. 예를 들어, 아래와 같은 코드가 있다.

아래 코드는 computed 가 발생 할때 count 에 1를 더하여 리턴하는 코드 이다.

```javascript
// Vuex.vue
computed: {
  count() {
    return this.$store.state.count = this.$store.state.count + 1;
  }
},

// VuexChildA.vue
computed: {
  count() {
    return this.$store.state.count = this.$store.state.count + 1;
  }
},
```

여러 컴포넌트에서 같은 로직을 비효율적으로 중복 사용하고 있다. 이 때, Vuex 의 데이터 (state) 변경을 각 컴포넌트에서 수행하는 게 아니라, Vuex 에서 수행하도록 하고 각 컴포넌트에서 수행 로직을 호출하면, 코드 가독성도 올라가고 성능에서도 이점이 생길 것이다.

Getters 를 사용하여 동일한 로직을 중앙에서 관리 하도록 변경해 보도록 하면 아래와 같다.

```javascript
// store/index.js
getters: {
  getCount: function (state) {
    return state.count = state.count + 1;
  }
},

// Vuex.vue
computed: {
  count() {
    return this.$store.getters.getCount;
  }
},

// VuexChildA.vue
computed: {
  count() {
    return this.$store.getters.getCount;
  }
},

// VuexChildB.vue
computed: {
  count() {
    return this.$store.getters.getCount;
  }
},
```

### Getters 등록

```javascript
// store/index.js
getters: {
  getCount: function (state) {
    return state.count = state.count + 1;
  }
},
```

### Vuex Getters 사용

등록된 getters 를 각 컴포넌트에서 사용하려면 `this.$store` 를 이용하여 `getters` 에 접근한다.

```javascript
// Vuex.vue
computed: {
  count() {
    return this.$store.getters.getCount;
  }
},

// VuexChildA.vue
computed: {
  count() {
    return this.$store.getters.getCount;
  }
},

// VuexChildB.vue
computed: {
  count() {
    return this.$store.getters.getCount;
  }
},
```

getters 를 Vuex 에 등록하고 사용하였다. 참고로, computed 의 장점인 Caching 효과는 단순히 state 값을 반환하는 것이 아니라, getters 에 선언된 속성에 filter(), reverse() 등의 추가적인 계산 로직을 추가 할수 있다.

### Vuex Getters 구현

**view/Vuex.vue**

```vue
<template>
  <div class="vuex">
    <h1>Vuex 화면 입니다.</h1>
    count : {{ $store.state.count }}
    <VuexChildA />
    <VuexChildB />
  </div>
</template>

<script>
import VuexChildA from "../components/VuexChildA"
import VuexChildB from "../components/VuexChildB"

export default {
  name: "Vuex",
  components: {
    VuexChildA,
    VuexChildB,
  },
}
</script>

<style scoped>
.main {
  border: solid 5px #000;
  padding: 100px;
}
</style>
```

**components/VuexChildA.vue**

```vue
<template>
  <div class="vuex-child-a">
    <h1>Vuex Child A</h1>
    count : {{ count }}
  </div>
</template>

<script>
export default {
  name: "VuexChildA",
  computed: {
    count() {
      return this.$store.getters.getCount
    },
  },
}
</script>

<style scoped>
.vuex-child-a {
  border: solid 5px #000;
  padding: 100px;
}
</style>
```

**components/VuexChildB.vue**

```vue
<template>
  <div class="vuex-child-b">
    <h1>Vuex Child B</h1>
    count : {{ count }}
  </div>
</template>

<script>
export default {
  name: "VuexChildB",
  computed: {
    count() {
      return this.$store.getters.getCount
    },
  },
}
</script>

<style scoped>
.vuex-child-b {
  border: solid 5px #000;
  padding: 100px;
}
</style>
```

![Vue Js Vuex View Vuex Render Count 1](/assets/vue-vuex-view-vuex-count1.png "Vue Js Vuex View Vuex Render Count 1")

### Vuex mapGetters

Vuex 에 내장된 helper 함수 이다. mapGetters 로 위 코드를 조금 더 직관적으로 수정 할수 있다.

```javascript
// Vuex.vue
import { mapGetters } from 'vuex'

computed: mapGetters({
  count : 'getCount' // getCount 는 Vuex 의 getters 에 선언된 속성 이름
}),

// VuexChildA.vue
import { mapGetters } from 'vuex'

computed: mapGetters({
  count : 'getCount' // getCount 는 Vuex 의 getters 에 선언된 속성 이름
}),

// VuexChildB.vue
import { mapGetters } from 'vuex'

computed: mapGetters({
  count : 'getCount' // getCount 는 Vuex 의 getters 에 선언된 속성 이름
}),
```

위 코드에서 주의할 점은 위 방법들은 컴포넌트 자체에서 사용할 computed 속성과 함께 사용할 수 없다는 점이다. 해결방안은 ES6 의 문법 `...` 을 사용하면 된다.

```javascript
// Vuex.vue
import { mapGetters } from 'vuex'

computed: {
  ...mapGetters([
    count : 'getCounter' // getCount 는 Vuex 의 getters 에 선언된 속성 이름
  ]),
  othderCount() {
    return 0;
  }
}

// VuexChildA.vue
import { mapGetters } from 'vuex'

computed: {
  ...mapGetters([
    count : 'getCounter' // getCount 는 Vuex 의 getters 에 선언된 속성 이름
  ]),
  othderCount() {
    return 0;
  }
}

// VuexChildB.vue
import { mapGetters } from 'vuex'

computed: {
  ...mapGetters([
    count : 'getCounter' // getCount 는 Vuex 의 getters 에 선언된 속성 이름
  ]),
  othderCount() {
    return 0;
  }
}
```

다만 `...` 문법을 사용하려면 Babel 라이브러리 설치 및 babel preset 에 추가가 필요하다.

## Vuex Mutations

Mutations 이란 Vuex 의 데이터, 즉 state 값을 변경하는 로직들을 의미한다. Getters 와 차이점은 아래와 같다.

- 인자를 받아 Vuex 에 넘겨줄 수 있고
- computed 가 아닌 methods 에 등록

Actions 과의 차이는 아래와 같다.

- Mutations 는 동기적 로직을 정의
- Actions 는 비동기적 로직을 정의

Mutations 의 성격상 안에 정의한 로직들이 순차적으로 일어나야 각 컴포넌트의 반영 여부를 제대로 추적할 수가 있기 때문이다.

컴포넌트에서 직접 state 에 접근하여 변경하는 것이 아니라. Vue 의 Reactivity 체계와 상태관리 패턴에 맞지 않은 구현방식이다. 안티패턴인 이유는 여러 개의 컴포넌트에서 같은 state 값을 동시에 제어하게 되면, state 값이 어느 컴포넌트에서 호출해서 변경된건지 추적하기가 어렵기 때문이다. 하지만, 상태 변화를 명시적으로 수행함으로써 테스팅, 디버깅, Vue 의 Reactive 성질 준수 의 혜택을 얻는다.

아래와 같이 commit 을 이용하여 state 를 변경한다.

![Vue Js Vuex Mutations](/assets/vue-vuex-mutation.png "Vue Js Vuex Mutations")

Mutations 이 기억하기 어렵다면 Setters 로 이해해도 좋다.

### Vuex Mutations 등록

getters 와 마찬가지로 Vuex 에 mutations 속성을 추가한다.

```javascript
// store/index.js
mutations: {
  addCount: function (state, payload) {
    return state.count = state.count + 1;
  }
},
```

### Vuex Mutations 사용

`vies/Vuex.vue`, `components/VuexChildA.vue`, `components/VuexChildB.vue` 의 기존 코드에 아래와이 methods 를 등록 하도록 한다.

```javascript
// Vuex.vue
import { mapGetters } from 'vuex'

computed: {
  ...mapGetters([
    count : 'getCounter' // getCount 는 Vuex 의 getters 에 선언된 속성 이름
  ]),
  othderCount() {
    return 0;
  }
},
methods: {
  addCount() {
    this.$store.commit('addCount');
  }
}

// VuexChildA.vue
import { mapGetters } from 'vuex'

computed: {
  ...mapGetters([
    count : 'getCounter' // getCount 는 Vuex 의 getters 에 선언된 속성 이름
  ]),
  othderCount() {
    return 0;
  }
},
methods: {
  addCount() {
    this.$store.commit('addCount');
  }
}


// VuexChildB.vue
import { mapGetters } from 'vuex'

computed: {
  ...mapGetters([
    count : 'getCounter' // getCount 는 Vuex 의 getters 에 선언된 속성 이름
  ]),
  othderCount() {
    return 0;
  }
},
methods: {
  addCount() {
    this.$store.commit('addCount');
  }
}

```

![Vue Js Vuex Mutations Render](/assets/vue-vuex-mutation-render.png "Vue Js Vuex Mutations Render")

motations 은 getters 와 다르게 `this.$store.mutations.addCount` 처럼 호출을 할수 없고 `this.$store.commit('addCount')` 로 호출 해야 한다. commit 을 이용하여 mutations 이벤트를 호출해야 한다. 이유는 추적 가능한 상태 변화를 위해 Vue 프레임워크가 구조화가 되어 있기 때문이다 라고 이해 하면 된다.

### Vuex Mutations 인자 값 넘기기

```javascript
// Vuex.vue
import { mapGetters } from 'vuex'

computed: {
  ...mapGetters([
    count : 'getCounter' // getCount 는 Vuex 의 getters 에 선언된 속성 이름
  ]),
  othderCount() {
    return 0;
  }
},
methods: {
  addCount() {
    this.$store.commit('addCount', 10);
  }
}
```

각 컴포넌트에서 Vuex 의 state 를 조작하는데 필요한 특정 값들을 넘기고 싶을 때는 commit() 에 두 번째 인자를 추가한다.

```javascript
// store/index.js
mutations: {
  addCount: function (state, payload = 1) {
    return state.count = state.count + payload;
  }
},
```

이를 Vuex 에서 위와 같이 받을 수 있다.

위와 같이 인자를 넘길수 있다. 로직을 해석 하자면 아래와 같다.
`views/Vuex.vue` 에서 addCount 를 호출할때 10 을 넘겨 주고 mutations - addCount 에서는 넘어온 인자를 state.count 에 더한다. 만약 넘어온 인자가 없다면 기본값을 1로 한다.

![Vue Js Vuex Mutations Render 2](/assets/vue-vuex-mutation-render2.png "Vue Js Vuex Mutations Render 2")

### Vuex mapMutations

mapGetters 와 마찬가지로, Vuex 에 내장된 mapMutations 를 이용하여 코드 가독성을 높일 수 있다.

**components/VuexChildA.vue**

```vue
<template>
  <div class="vuex-child-a">
    <h1>Vuex Child A</h1>
    <button @click="addCount()">Count + 1</button>
    count : {{ count }}
  </div>
</template>

<script>
import { mapMutations } from "vuex"

export default {
  name: "VuexChildA",
  // eslint-disable-next-line no-undef
  computed: {
    count() {
      return this.$store.getters.getCount
    },
  },
  methods: {
    ...mapMutations({
      addCount: "addCount", // 앞 addCounter 는 해당 컴포넌트의 메서드를, 뒤 addCounter 는 Vuex 의 Mutations 를 의미
    }),
  },
}
</script>

<style scoped>
.vuex-child-a {
  border: solid 5px #000;
  padding: 100px;
}
</style>
```

## Vuex Actions

Mutations 에는 순차적인 로직들만 선언하고 Actions 에는 비 순차적 또는 비동기 처리 로직들을 선언한다. 이렇게 나누는 이유는 아래와 같다.
Mutations 의 역할 자체가 State 관리에 주안점을 두고 있고. 상태관리 자체가 한 데이터에 대해 여러 개의 컴포넌트가 관여하는 것을 효율적으로 관리하기 위함인데 Mutations 에 비동기 처리 로직들이 포함되면 같은 값에 대해 여러 개의 컴포넌트에서 변경을 요청했을 때, 그 변경 순서 파악이 어렵기 때문이다. 따라서, setTimeout() 이나 서버와의 http 통신 처리 같이 결과를 받아올 타이밍이 예측되지 않은 로직은 Actions 에 선언한다.

### Vuex Actions 등록

Vuex 에 Actions 를 등록하는 방법은 다른 속성과 유사하다. actions 를 선언하고 action method 를 추가해주면 된다.

```javascript
// store/index.js
actions: {
  mutations: {
    addCount: function (state, payload = 1) {
      return state.count = state.count + payload;
    }
  },
  addCount: function (context) {
    // commit 의 대상인 addCount 는 mutations 의 메서드를 의미한다.
    // 비동기 로직 수행후
    return setTimeout(function () {
      context.commit("addCount");
    }, 1000);
  },
},
```

상태가 변화하는 걸 추적하기 위해 actions 는 결국 mutations 의 메서드를 호출(commit) 하는 구조가 된다.

setTimeout 과 같은 비동기 처리 로직들은 actions 에 선언해준다. XHR 을 활용한 비동기 처리도 동일 하다.

```javascript
// store/index.js
actions: {
  mutations: {
    addCount: function (state, payload = 1) {
      return state.count = state.count + payload;
    }
  },
  addCount: function (context) {
   return axios.get("coffee.json").then(function(data) {
      context.commit('addCount', data.length);
    });
  }
},
```

### Vuex Actions 사용

앞에서는 mutations 를 이용하여 count 를 하나씩 늘렸다. 이번엔 actions 를 이용해보자. actions 를 호출할 때는 아래와 같이 dispatch() 를 이용한다.

전체 구조도에서 dispatch 의 동작을 보면 아래와 같다.

![Vue Js Vuex Actions](/assets/vue-vuex-actions.png "Vue Js Vuex Actions")

```vue
<template>
  <div class="vuex">
    <h1>Vuex 화면 입니다.</h1>
    count : {{ $store.state.count }}
    <button @click="addCount">Count + 10</button>
    <button @click="actionAddCount">Action Count + 1</button>
    <VuexChildA />
    <VuexChildB />
  </div>
</template>

<script>
import VuexChildA from "../components/VuexChildA"
import VuexChildB from "../components/VuexChildB"

export default {
  name: "Vuex",
  components: {
    VuexChildA,
    VuexChildB,
  },
  methods: {
    // Mitations
    addCount() {
      this.$store.commit("addCount", 10)
    },
    // Actions
    actionAddCount() {
      this.$store.dispatch("addCount")
    },
  },
}
</script>
```

![Vue Js Vuex Actions Render](/assets/vue-vuex-actions-render.png "Vue Js Vuex Actions Render")

### Vuex Actions 인자 값 넘기기

```javascript
methods: {
  // Actions 를 이용할 때
  actionAddCount() {
    this.$store.dispatch("addCount",1);
  },
},
```

key - value 객체 형태로 인자값을 넘길때는 아래와 같이 하면 된다.

```javascript
methods: {
  // Actions 를 이용할 때
  actionAddCount() {
    this.$store.dispatch("addCount", { count: 5 });
  },
},
```

```javascript
// store/index.js
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

export default new Vuex.Store({
  // code..
  actions: {
    addCount: function (context, payload) {
      // commit 의 대상인 addCount 는 mutations 의 메서드를 의미한다.
      // 비동기 로직 수행후
      return setTimeout(function () {
        context.commit("addCount", payload.count)
      }, 1000)
    },
  },
  // code..
})
```

### Vuex mapActions

Vuex 에 내장된 helper 인 mapActions 를 사용하여 조금더 직관적으로 만들수 있다.

```vue
<template>
  <div class="vuex">
    <h1>Vuex 화면 입니다.</h1>
    count : {{ $store.state.count }}
    <button @click="addCount">Count + 10</button>
    <button @click="actionsAddCount({ count: 5 })">Action Count + 5</button>
    <VuexChildA />
    <VuexChildB />
  </div>
</template>

<script>
import VuexChildA from "../components/VuexChildA"
import VuexChildB from "../components/VuexChildB"

import { mapActions } from "vuex"
export default {
  name: "Vuex",
  components: {
    VuexChildA,
    VuexChildB,
  },
  methods: {
    ...mapActions({
      actionsAddCount: "addCount",
    }),
    addCount() {
      this.$store.commit("addCount", 10)
    },
  },
}
</script>
```

## 폴더 구조화 & Namespacing

![Vue Js Vuex Modules](/assets/vue-vuex-modules.png "Vue Js Vuex Modules")

```javascript
import Vue from "vue"
import Vuex from "vuex"

Vue.use(Vuex)

import coffee from "./modules/coffee"
import shop from "./modules/shop"

export default new Vuex.Store({
  // count state 속성 추가
  state: {
    count: 0, // count 를 0 으로 초기화
  },
  getters: {
    getCount: function (state) {
      return state.count
    },
  },
  mutations: {
    addCount: function (state, payload = 1) {
      console.log("addCount")
      return (state.count = state.count + payload)
    },
  },
  actions: {
    addCount: function (context, payload) {
      // commit 의 대상인 addCount 는 mutations 의 메서드를 의미한다.
      // 비동기 로직 수행후
      return setTimeout(function () {
        context.commit("addCount", payload.count)
      }, 1000)
    },
  },
  modules: { coffee, shop },
})
```

중간 크기 이상의 복잡한 앱을 제작할 때 getters & mutations & actions 의 이름을 유일하게 정하지 않으면 namespace 충돌이 난다. 따라서, 네임스페이스를 구분하기 위해 types.js 로 각 속성의 이름들을 빼고 store.js 와 각 컴포넌트에 import 하여 사용하는 방법이 있다. 혹은 modules 라는 폴더로 만들어 각 단위별로 파일을 분리해서 관리하는 방법도 있다.

Vuex 가 생각보다 복잡하므로 앱이 커서 중형 이상의 앱에서만 사용하는게 좋다. 간단한 화면 개발에는 오히려 Vuex 를 사용하지 않고 개발 하는것을 추천 한다.
