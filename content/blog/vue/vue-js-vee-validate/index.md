---
templateKey: blog-post
title: Vue Js Vee Validate
date: 2021-04-25T23:11:34.709Z
category: vue
description: 서비스 개발시 Form 유효성 검사는 필수이다. 보통 정규표현식을 사용하여 간단하게 구현할수 있지만, Vue 에서는 VeeValidate 를 활용하여 일관성 있는 Form 유효성 검사 기능을 구현 할수 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - veevalidate
  - library
---

![Vue Js Vee Validate](/assets/vue-logo.png "Vue Js Vee Validate")

## 개요

서비스 개발시 Form 유효성 검사는 필수다. 보통 정규표현식을 사용하여 간단하게 구현할수 있고, HTML 에서 기본적으로 지원해 주는 type, required 등을 사용해서 구현할수도 있다. 하지만 서비스별로 요구하는 데이터 포맷이 다를때 커스텀을 해야한다. Vue 에서는 VeeValidate 를 활용하여 일관성 있고 커스텀이 유연한 Form 유효성 검사 기능을 구현 할수 있다.

## Form Validation

먼저 Vue 를 활용하여 Form Validation 을 구현해 볼것 이다. 아래와 같이 Form 이 주어지고 이메일, 비밀번호 유효성 검사를 해야한다고 가정해 보자

```html
<template>
  <div class="form-validation">
    <form @submit="formSubmit" method="post">
      <div>
        <label for="email">email</label>
        <input id="email" type="email" required />
      </div>
      <div>
        <label for="password">password</label>
        <input id="password" type="password" required />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: "FormValidation",
    components: {},
    methods: {
      formSubmit() {
        // code..
      },
    },
  }
</script>

<style scoped></style>
```

input 속성 `type`, `required` 만 사용하여 간단하게 form validation 을 구현 했다.

![Vue Js Vee Validation-1](/assets/vee-validation-1.png "Vue Js Vee Validation-1")

![Vue Js Vee Validation-2](/assets/vee-validation-2.png "Vue Js Vee Validation-2")

그렇다면 비밀번호에 영문 or 숫자 조건을 넣는다고 가정 하면 HTML 에서 지원해 주는 type, required 만으로는 영문 or 숫자 조합을 체크 할수 없다

이때 javascript 정규표현식을 사용하여 `영문 or 숫자` 로 입력 되었는지를 체크해 볼수 있다.

```html
<template>
  <div class="form-validation">
    <form @submit="formSubmit" method="post">
      <div>
        <label for="email">email</label>
        <input id="email" type="text" v-model="email" />
      </div>
      <div>
        <label for="password">password</label>
        <input id="password" type="text" v-model="password" />
      </div>
      <button type="submit">Login</button>
    </form>
  </div>
</template>

<script>
  export default {
    name: "FormValidation",
    components: {},
    data() {
      return {
        email: "",
        password: "",
      }
    },
    methods: {
      formSubmit() {
        // code..
        if (
          !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            this.email
          )
        ) {
          alert("이메일 주소를 입력해 주세요.")
        }

        if (!/^[a-zA-Z0-9]{8,20}$/.test(this.password)) {
          alert("비밀번호는 영문 or 숫자 8자 이상 20자 미만으로 입력해 주세요.")
        }

        return true
      },
    },
  }
</script>

<style scoped></style>
```

이메일 입력후, 비밀번호 입력칸에 숫자만 입력할 경우 아래와 같은 경고 문구가 출력 된다.

![Vue Js Vee Validation-3](/assets/vee-validation-3.png "Vue Js Vee Validation-3")

이처럼 javascript, html input api 를 활용하여 간단하게 Form 유효성 검증을 할수 있다. 하지만 다양한 언어로 서비스 하거나 검증할 경우의 수가 많아 질경우 광리해야할 코드양이 많아지게 된다. 이러한 부분을 보완 할수 있는 라이브러리가 VeeValidate 이다.

위에서 작성한 코드를 VeeValidate 를 활용하여 간단하게 구현해 보고 한국어, 영어 2가지 언어를 지원하는 웹 서비스를 만든다고 가정해 보자.

## VeeValidate

Vee-Validate 의 핵심적인 기능으로 `ValidationProvider`, `ValidationObserver`, `extend` 그리고 rules 와 flags 가 어떤 기능을 하는지 알면, 쉽게 사용할 수 있다.

### 설치

#### install with npm

npm install vee-validate --save

#### install with yarn

yarn add vee-validate
`

#### Usage

main.js

```javascript
import { ValidationProvider, extend } from "vee-validate"
import { required } from "vee-validate/dist/rules"

extend("required", {
  ...required,
  message: "This field is required",
})
```

components

```html
<validation-provider rules="required" v-slot="{ errors }">
  <input v-model="value" name="myinput" type="text" />
  <span>{{ errors[0] }}</span>
</validation-provider>
```

기본적인 설치 ~ 사용법 이다.

### 실습

이전에 만들었던 코드에 적용해 보도록 하자

#### main.js 에 import

아래와 같이 하면, 전역으로 설정이 가능 하다

```javascript
// main.js
import { ValidationProvider, extend, ValidationObserver } from "vee-validate" // vee-validate 로 부터 사용할 기능 import

Vue.component("ValidationProvider", ValidationProvider)
Vue.component("ValidationObserver", ValidationObserver)
```

#### Validation Rule 을 정하기

Vee-Validate는 기본적으로 제공하고 있는 Rule 들이 있다.

종류는 공식 홈페이지 참조
https://logaretm.github.io/vee-validate/guide/rules.html#rules

아래는 전체 rule 을 꺼내는 방식이다

```javascript
import * as rules from "vee-validate/dist/rules"
for (let rule in rules) {
  // add the rule
  extend(rule, rules[rule])
}
```

- ValidationProvider 에 rules 라는 이름으로 사용하고 싶은 rule을 넘겨주고,
- ValidationProvider 에 errors 라는 이름의 v-slot을 생성. (provider 가 errors를 자동으로 생성해준다.)
  v-slot="{errors}"
- 에러 메세지를 보여주고 싶은 태그 내부에
  {{ errors[0] }}

errors 는 기본적으로 배열 내부에 메세지를 설정하는 대로 여러개 추가되거나 덮어쓰기 되는 구조이기 때문에 [0] 을 명시해서 디폴트 메세지를 불러와야한다.

여러가지 룰을 적용하고 싶다면, `|` 연산자를 사용하여 여러개를 추가해 줄수 있다.

#### 에러 메세지를 변경하기

- 예시 1
  원래 vee-validate 가 제공하는 rule을 가져와서 메세지를 바꾸고 싶을 때는 아래와 같이 입력하면 된다.

```javascript
extend("required", {
  ...required,
  message: "필수 입력항목입니다.",
})
```

- 예시 2
  아래 예시는 최소 글자 수를 지정하는 rule 인데, 이 rule을 여러번 사용하고 싶었기 때문에 인풋 필드의 이름과 min 이라는 이름으로 parameter 를 받아서 에러메세지를 자동으로 생성하도록 만들었다.

```javascript
extend("min", {
  validate(value, { min }) {
    if (value.length >= min) {
      return true
    }
    return "{_field_}는 {min} 글자 이상이어야 합니다."
  },
  params: ["min"],
})
```

이처럼 parameter 가 필요한 부분에서는 validationprovider 에서 아래와 같이 parameter 를 내려줄 수 있다.

```html
<validation-provider
  name="아이디"
  rules="required|alpha_dash|min:5|max:20"
  v-slot="{ errors, classes }"
>
  <p class="validation-text">{{ errors[0] }}</p>
</validation-provider>
```

`{_field_}` 는 ValidationProvider 가 기본적으로 제공하는 기능이여서 따로 명시해줄 필요가 없고 validation-povider 에 name 으로 넘겨준 값을 그대로 표시해준다.

- 예시 3
  아래 예시는 한글, 영문, 숫자를 체크하는 정규표현식을 사용하여 custom rule 에 메세지를 추가하였다.

```javascript
extend("korAlphaNum", {
  validate: value => {
    let regex = /^[가-힣|aA-zZ|0-9]*$/.test(value)
    if (!regex) {
      return "올바른 한글, 영문, 숫자만 입력해주세요."
    } else {
      return true
    }
  },
})
```

#### 기본 사용법

```javascript
// main.js
import { ValidationProvider, extend, ValidationObserver } from "vee-validate" // vee-validate 로 부터 사용할 기능 import
import * as rules from "vee-validate/dist/rules"
for (let rule in rules) {
  // add the rule
  extend(rule, rules[rule])
}
Vue.component("ValidationProvider", ValidationProvider)
Vue.component("ValidationObserver", ValidationObserver)
```

```html
<template>
  <div class="form-validation">
    <ValidationObserver v-slot="{ invalid }">
      <form @submit="formSubmit" method="post">
        <ValidationProvider rules="email" v-slot="{ errors }">
          <div>
            <label for="email">email</label>
            <input id="email" type="text" v-model="email" />
            {{ errors[0] }}
          </div>
        </ValidationProvider>
        <ValidationProvider rules="min:8|max:20|alpha_dash" v-slot="{ errors }">
          <div>
            <label for="password">password</label>
            <input id="password" type="text" v-model="password" />
            {{ errors[0] }}
          </div>
        </ValidationProvider>
        <button type="submit" :disabled="invalid">Login</button>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
  export default {
    name: "FormValidation",
    components: {},
    data() {
      return {
        email: "",
        password: "",
      }
    },
    methods: {
      formSubmit() {
        return true
      },
    },
  }
</script>

<style scoped></style>
```

VeeValidate를 사용하여 간단하게 form validation 을 구현 했다.

![Vue Js Vee Validation-4](/assets/vee-validation-4.png "Vue Js Vee Validation-4")

![Vue Js Vee Validation-5](/assets/vee-validation-5.png "Vue Js Vee Validation-5")

만약 Form 유효성 검증 메시지를 alert 으로 표시 하고 싶다면 아래 처럼 하면 된다.

#### Alert 으로 Form 유효성 검증 메시지 보여주기

```html
<template>
  <div class="form-validation">
    <ValidationObserver>
      <form @submit="formSubmit" method="post">
        <ValidationProvider ref="refEmail" rules="email">
          <div>
            <label for="email">email</label>
            <input id="email" type="text" v-model="email" />
          </div>
        </ValidationProvider>
        <ValidationProvider ref="refPassword" rules="min:8|max:20|alpha_dash">
          <div>
            <label for="password">password</label>
            <input id="password" type="text" v-model="password" />
          </div>
        </ValidationProvider>
        <button type="submit">Login</button>
      </form>
    </ValidationObserver>
  </div>
</template>

<script>
  export default {
    name: "FormValidation",
    components: {},
    data() {
      return {
        email: "",
        password: "",
      }
    },
    methods: {
      async formSubmit() {
        const refEmail = await this.$refs.refEmail.validate()
        alert(refEmail.valid)
        if (!refEmail.valid) {
          alert(refEmail.errors[0])
          return false
        }
        const refPassword = await this.$refs.refPassword.validate()
        if (!refPassword.valid) {
          alert(refPassword.errors[0])
          return false
        }

        return true
      },
    },
  }
</script>

<style scoped></style>
```

![Vue Js Vee Validation-6](/assets/vee-validation-6.png "Vue Js Vee Validation-6")

#### 다국어 적용하기

VeeValidate를 i18n 기반하여 다국어를 지원해 준다. 아래 코드를 `main.js` 에 추가해 주자

```javascript
// main.js
import {
  ValidationProvider,
  extend,
  ValidationObserver,
  localize, // 지역
} from "vee-validate"
import * as rules from "vee-validate/dist/rules"
for (let rule in rules) {
  // add the rule
  extend(rule, rules[rule])
}
import ko from "vee-validate/dist/locale/ko.json" // 언어팩 json
localize({
  ko,
})
localize("ko") // 한국어 사용
Vue.component("ValidationProvider", ValidationProvider)
Vue.component("ValidationObserver", ValidationObserver)
```

잘못된 이메일 입력후 실행해 보면 한국어로 나오는것을 확인할수 있다.

![Vue Js Vee Validation-7](/assets/vee-validation-7.png "Vue Js Vee Validation-7")
