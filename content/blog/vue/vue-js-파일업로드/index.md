---
templateKey: blog-post
title: Vue Js 뷰 파일업로드
date: 2021-05-02T15:11:34.709Z
category: vue
description: 라우트에 연결하거나 탐색을 수행 할 때 이름이 있는 라우트를 사용할수 있다. 사용 법은 routes 에 name 옵션을 지정 하면 된다. 라우트 관리가 편리 하다 라는 장점이 있다.
tags:
  - vue
  - javascript
  - framework
  - frontend
  - web
  - file
  - FormData
  - FileReader
---

![Vue Js 뷰 파일업로드](/assets/vue-logo.png "Vue Js 뷰 파일업로드")

## MIME TYPE이란

이미지나 사진 동영상 파일등은 바이너리 데이터이다. 즉 0과 1의 조합으로 구성되어 있다. 초기 이메일 시스템에서는 본문에 들어갈 텍스트 뿐만 아니라 첨부파일도 전송 가능하게 하기 위해서 바이너리 데이터인 첨부파일을 아스키 코드로 인코딩하는 방법을 찾아야 했다. 즉, 이메일은 아스키 코드로만 주고 받고 할 수 있었다.

MIME이란 Multipurpose Internet Mail Extension 이란 뜻인데, 보면 다목적의 인터넷 메일 확장이라는 뜻이다. 즉, 바이너리 데이터인 첨부파일을 아스키 코드로 인코딩하여 본문에 덧붙이겠다는 뜻이다.(Extension의 의미)

보낼때 인코딩된 바이너리 데이터(사진,이미지등)가 어떤 타입인지를 명시해야 받는 측에서 그것대로 해석 할 수 있다.

![MIME TYPE](/assets/vue-fileupload-http-mime.png "MIME TYPE")

보면 aaa.png라는 이미지를 마임 타입으로 변환하여 전송하고 수신자는 마임타입을 다시 원본 바이너리 데이터로 복호화 한다. 즉, 마임 타입이란 바이너리 -> 아스키 인코딩 방식이라고 보면 된다. 그리고, 그 바이너리 데이터가 어떤것이냐를 마임 타입에 명시한다. 그래야, 받는 측에서 제대로 복호화 할 수 있다.

## MIME TYPE의 구성

### 개별 타입

| 메인타입    | 설명                                                                                                                                  | 서브 타입                                                                                                                           |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| text        | 텍스트를 포함하는 모든 문서를 나타내며 이론상으로는 인간이 읽을 수 있어야 합니다                                                      | text/plain, text/html, text/css, text/javascript                                                                                    |
| image       | 모든 종류의 이미지를 나타냅니다. (animated gif처럼) 애니메이션되는 이미지가 이미지 타입에 포함되긴 하지만, 비디오는 포함되지 않습니다 | image/gif, image/png, image/jpeg, image/bmp, image/webp                                                                             |
| audio       | 모든 종류의 오디오 파일들을 나타냅니다.                                                                                               | audio/midi, audio/mpeg, audio/webm, audio/ogg, audio/wav                                                                            |
| video       | 모든 종류의 비디오 파일들을 나타냅니다.                                                                                               | video/webm, video/ogg                                                                                                               |
| application | 모든 종류의 이진 데이터를 나타냅니다                                                                                                  | application/octet-stream, application/pkcs12, application/vnd.mspowerpoint, application/xhtml+xml, application/xml, application/pdf |

### 멀티파트 타입

| 메인타입  | 설명                                                    | 서브 타입                                 |
| --------- | ------------------------------------------------------- | ----------------------------------------- |
| multipart | 여러가지 타입의 데이터들을 동시에 전송할 때 사용합니다. | multipart/form-data, multipart/byteranges |

## File API

브라우저는 File API 지원 한다. 아래는 File API 를 지원 하는 웹 브라우저 이다.

![File API](/assets/vue-fileupload-file-api.png "File API")

File API 는 아래와 같이 정의되어 있다.

- FileList : 파일 리스트
- File : 파일 데이터
- FileReader : 파일 읽기
- Blob : 바이트 데이터

```html
<!--html-->
<input id="input" type="file" accept="text/*" />
<script>
  var inputEl = document.querySelector("#input")
  inputEl.addEventListener("change", function (event) {
    // FileList
    var fileList = inputEl.files || event.target.files
    // File
    var file = fileList[0]
    var reader = new FileReader()
    reader.onload = function (progressEvent) {
      console.log(progressEvent.target.result)
    }
    reader.readAsText(file)
  })
</script>
```

위 예제는 input[type=file] 로 입력받은 파일을 FileReader 로 내용을 Text 로 읽는 예제다.

### input file type

기본적으로 브라우저에서는 보안상 로컬 파일에 직접 접근 할 수 없다. input[type=file] 는 브라우저에서 유저가 직접 로컬의 파일을 선택할 수 있게 도와준다. 이렇게 선택한 파일은 File 로 정의되고 FileList 에 담기게 된다. 이때 multiple 설정 여부와 관계없이 ArrayLike 형태인 FileList 로 담긴다. 파일을 선택하면 input, change EventHandler 가 발생되며, 선택된 파일은 HTMLInputElement.files 에 저장된다.

### input 의 속성

`input[type=file]` 은 value, accept, capture, files, multiple 속성을 갖을 수 있다.

- value [DOMString] : 파일 경로
- accept [MIME] : 사용 가능한 파일 종류
- capture [string] : 파일 캡처 방법
- multiple [boolean] : 여러 파일 선택 여부
- files [FileList] : 선택된 파일들

#### input.value

`input[type=file]` value 에는 파일의 경로를 가진다. 브라우저에서는 보안상 로컬 파일에 직접 접근 할 수 없으며, 로컬 파일 구조의 노출을 막고자 C:\fakepath\ 를 포함하여, 숨긴다. 이 경로의 브라우저마다 구현된 형태가 다를 수 있다.

#### input.accept

`input[type=file]` accept 는 선택 가능한 파일 종류를 설정할 수 있다. 파일은 , 로 구분하며, 아래와 같은 형태로 작성할 수 있다.

- `accept="image/*"` : png 같은 이미지파일
- `accept="video/*"` : mp4 같은 동영상파일
- `accept="audio/*"` : wav 같은 오디오파일
- `accept=".pdf, .doc, .csv"` : pdf, doc, css 확장자 파일

#### input.capture

`input[type=file]` capture 는 모바일 같은 특정 기기에서 capture 방법을 설정할 수 있다.

- `capture="camera"` : 카메라
- `capture="camcorder"` : 동영상
- `capture="microphone"` : 마이크

capture 속성을 지원하지 않는 브라우저의 경우, accept="image/\*;capture=camera" 으로 사용할 수도 있다.

### FileList

`input.files` 에는 선택한 파일들을 FileList 로 가진다. FileList 는 File 들을 가지는 객체이며, `{ [index]: File, length: number }` 형태를 가진 array-like object 이다. `FileList[index]` 혹은 `FileList.item(index)` 형태로 File 에 접근할 수 있다. 이 FileList 는 Symbol(Symbol.iterator) 가 정의되어 있어, 순차적으로 참조하기 위해서, for of 를 사용할 수 있다. 혹은 `Array.from()` 로 변환하여 참조 할 수 있다.

```javascript
// javascript
function (event) {
  var fileList = event.target.files;
  for(const file of fileList) {
    // ...
  }
  Array.from(fileList).forEach((file) => {
    // ...
  })
};
```

### File

브라우저는 보안상 파일을 조작할 수 없다. 때문에 모든 값은 읽기 전용 이다. File 은 아래 속성을 가질 수 있다.

- **name** : 파일 이름
- **lastModified** : 파일을 마지막으로 수정한 Unix Time
- **lastModifiedDate** : 파일을 마지막으로 수정한 Date 객체
- **size** : 파일의 크기 (Byte 값)
- **type** : MIME 유형

```
File name: "android-logo.png"
lastModified: 1620010077441
lastModifiedDate: Mon May 03 2021 11:47:57 GMT+0900 (Korean Standard Time)
size: 27871
type: "image/png"`
```

File 은 Blob 을 확장하여 구현되었다.

### Blob (Binary Large Object)

Blob 객체는 파일를 text 나 2진 데이터 형태로 읽을 수 있다. Blob 은 아래 속성을 가질 수 있다.

- **size** : 파일의 크기 (Byte 값)
- **type** : MIME 유형

Blob 은 2가지 방법으로 생성할 수 있다.

- **new Blob(ArrayBuffer | Blob | DOMString, {type?: MIME})**: Blob
- **Blob.slice(start?, end?, contentType?)**: Blob
  Blob 의 바이트를 시작 및 끝 바이트 범위에서 복제해 새로운 Blob 객체를 생성하고 반환한다.

```javascript
async function () {
  const textBlob = new Blob(
    ['😀test txt'],
  );
  console.log( await textBlob.text() );
  // 😀test txt
  const uintBlob = new Blob(
    [new Uint8Array([240, 159, 152, 128, 116, 101, 115, 116, 32, 116, 120, 116])],
    {type: 'text/plain'}
  );
  console.log( await uintBlob.text() );
  // 😀test txt
  const obj = { test: '😀test txt'};
  const jsonBlob = new Blob(
    [JSON.stringify(obj, null, 2)],
    {type : 'application/json'}
  );
  console.log( await jsonBlob.text() );
  // {
  //   test: 😀test txt
  // }
  const copyBlob1 = textBlob.slice();
  const copyBlob2 = new Blob([copyBlob1]);
  console.log( await copyBlob1.text() );
  // 😀test txt
  console.log( await copyBlob2.text() );
  // 😀test txt
}
```

Blob 의 내용은 3가지 방법으로 읽을 수 있다.

- **Blob.stream()**: ReadableStream
- **Blob.text()**: Promise<UTF-8>
- **Blob.arrayBuffer()**: Promise<ArrayBuffer>

```javascript
function (event) {
  var file = event.target.files[0];
  (async function (blob) {
    const slice = blob.slice();
    console.log(slice);
    // Blob {size: 12, type: ""}
    const stream = blob.stream();
    console.log(stream);
    // ReadableStream {locked: false}
    const text = await blob.text();
    console.log(text);
    // 😀test txt
    const arrayBuffer = await blob.arrayBuffer();
    console.log(arrayBuffer);
    // ArrayBuffer(12) {}
    //   Int8Array(7498)
    //   Int16Array(3749)
    //   Uint8Array(7498)
    //   byteLength: 7498
  })(file);
};
```

#### Blob ReadableStream 와 ArrayBuffer

`Blob.stream()` 은 `ReadableStream` 을 반환한다. ReadableStream 은 Streams API 로 바이트 데이터 를 chunk 단위로 처리할 수 있게 도와준다. `ReadableStream.getReader()` 는 read 를 요청하고 다른 stream 이 발생되지 않도록 lock 을 건다 read() 으로 반환된 Promise 에서 값을 조회할 수 있다.

```javascript
new Blob(["😀test txt"])
  .stream()
  .getReader()
  .read()
  .then(({ value, done }) => {
    const uint8array = value
    return new TextDecoder("utf-8").decode(uint8array)
  })
  .then(console.log)
// 😀test txt
```

Blob.arrayBuffer() 는 ArrayBuffer 는 반환한다. ArrayBuffer 는 수정할 수 없는 바이트로 구성된 배열 이다. ArrayBuffer 는 TypedArray (Int8Array | Int16Array | Int32Array | Uint8Array 등) 로 변환할 수 있다.

```javascript
new Blob(["😀test txt"])
  .arrayBuffer()
  .then(arrayBuffer => {
    return new TextDecoder("utf-8").decode(uint8array)
  })
  .then(console.log)
// 😀test txt
```

여기서 사용된 TextDecoder 는 텍스트를 UTF-8 | ISO-8859–2 같은 형태로 인코딩 혹은 디코딩 할 수 있게 도와주는 객체다. TextDecoder.decode() 는 ArrayBuffer 를 설정한 형태의 Text 로 decode 할 수 있다.

#### Blob URL

URL.createObjectURL 를 이용하면, Blob 객체를 가리키는 URL 을 생성할 수 있다. https://www.w3.org/TR/FileAPI/#blob-url URL 은 blob:${url origin}/${UUID} 로 생성된다.

ex) blob:https://example.org/9115d58c-bcda-ff47-86e5-083e9a2153041

해당 URL 은 생성된 탭에서만 쓸 수 있다. Blob URL 은 페이지를 떠나기 전까지 유지되기 때문에, 필요하다면 revokeObjectURL 로 해지 해줄 수 있다.

```javascript
var blob = new Blob([‘😀test txt’]);
var url = URL.createObjectURL(blob);
console.log(url);
// blob:http://localhost:8000/a1fa84dc-fd52-4435-bc22-b1cb2a7c5d84
fetch(url)
  .then(res => res.text())
  .then((text) => {
    URL.revokeObjectURL(url);
    console.log(text);
    // 😀test txt
 });
```

해당 URL 은 a href 에 설정해서 다운로드 받을 수도록 설정할 수 있다. 이때 만약 `revokeObjectURL` 로 해지했다면 다운로드에 실패하게 된다.

```html
<!--html-->
<a href="http://localhost:8000/file-path" download="file.txt"> download </a>
```

#### Blob Canvas 와 createImageBitmap

Canvas 로 만든 Image 는 toBlob 으로 Blob 으로 만들 수 있다. 이때 기본 type 은 image/png 이다. CanvasRenderingContext2D.drawImage() 를 이용하면, Blob 을 Canvas 에 그릴 수 도 있다. 이때 직접적으로 Blob 을 전달할 수 없고, Image 로 변환하거나, createImageBitmap 로 ImageBitmap 를 생성해서 전달해야 한다. createImageBitmap 는 ImageData | Blob 을 전달 받아 ImageBitmap 를 생성할 수 있다.

```html
<!--html-->
<canvas id="canvas" width="5" height="5"></canvas>
<script>
  var canvas = document.getElementById("canvas")
  var ctx = canvas.getContext("2d")
  var dataURL = canvas.toDataURL()
  console.log(dataURL)
  // data:image/png;base64,iVBORw0…
  canvas.toBlob(blob => {
    console.log(blob)
    // Blob {size: 72, type: "image/png"}

    createImageBitmap(blob).then(imageBitmap => {
      console.log(imageBitmap)
      // ImageBitmap {width: 5, height: 5}
      ctx.drawImage(img, 0, 0)
    })
  })
</script>
```

### FileReader

FileReader 은 File 이나 Blob 의 내용을 읽을 수 있게 도와준다. 보안상 직접적인 Local Storage 에는 접근할 수 없다. FileReader 에는 4가지 방법으로 파일을 전달 할 수 있다.

- readAsArrayBuffer(file|blob) [ArrayBuffer]
- readAsBinaryString(file|blob) [0..255 범위의 문자열]
- readAsDataURL(file|blob) [Base64]
- readAsText(file|blob) [UTF-16|UTF-8 문자열]

FileReader 에서 전달 받은 파일을 읽기 성공하면 load EventLinser 에 등록한 function 이 호출된다. 이외에 `loadstart | progress | loadend | error` 로 읽는 상태에 따라 function 이 호출 된다.

```javascript
function (event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (progressEvent) => {
    console.log(progressEvent.target.result);
  };
  reader.readAsArrayBuffer(file);
  // readAsArrayBuffer ArrayBuffer(12) {}
  reader.readAsDataURL(file);
  // readAsDataURL data:text/plain;base64,8J+YgHRlc3QgdHh0
  reader.readAsBinaryString(file);
  // readAsBinaryString ðtest txt
  reader.readAsText(file);
  // readAsText 😀test txt
};
```

### Network 와 File

XMLHttpRequest 와 Fetch 를 이용해 Network 상의 파일을 가져올 수 있다. 이때 XMLHttpRequest.responseType 의 설정 값에 따라 응답 데이터 유형 을 설정할 수 있다. XMLHttpRequest.responseType 은 arraybuffer | blob | document | json | text 로 설정할 수 있으며 기본값을 text 이다.

```javascript
var imageUrl = "http://localhost:8080/image.png"
var xhr = new XMLHttpRequest()
xhr.responseType = "arraybuffer" || "blob"
xhr.onload = function (e) {
  var arraybuffer = xhr.response || e.target.response
}
xhr.open("GET", imageUrl)
xhr.send()
```

fetch 는 응답 데이터 가 Response 객체 로 생성되어 전달된다. Response 는 4 가지 변환 할 수 있다.

- Response.arrayBuffer()
- Response.blob()
- Response.json()
- Response.text()

만약 해당 형태로 변환하지 못한다면 SyntaxError 가 발생된다.

```javascript
var imageUrl = "http://localhost:8080/image.png"
fetch(imageUrl)
  .then(res => res.blob())
  .then(console.log)
// Blob {size: 75677, type: "image/png"}
fetch(imageUrl)
  .then(res => res.arrayBuffer())
  .then(console.log)
// ArrayBuffer(75677) {}
```

## Vue File Upload

Vue 를 파일업로드 기능은 File API 를 활용하여 미리보기 이미지를 표시해주고, 파일정보를 체크하여 벨리데이션 체크 하는것 까지 간단한 예제를 살펴볼 것이다.

![Vue File Upload](/assets/vue-fileupload-sample.png "Vue File Upload")

**install axios**

```npm
npm install axios
```

**axios module**

```javascript
// src/http/index.js
import axios from "axios"

const http = axios.create({
  baseURL: "https://testrestapi.cafe24.com",
  headers: { "content-type": "application/json" },
})

http.defaults.headers.post["Content-Type"] = "application/x-www-form-urlencoded"

export default http
```

**View/FileUpload.vue**

```html
<template>
  <div class="file-upload">
    <form @submit.prevent="formSubmit" method="post">
      <input type="file" ref="selectFile" @change="previewFile" />
      <ul v-if="selectFile">
        <li>lastModified : {{ selectFile.lastModified }}</li>
        <li>lastModifiedDate : {{ selectFile.lastModifiedDate }}</li>
        <li>name : {{ selectFile.name }}</li>
        <li>size(byte) : {{ selectFile.size }}</li>
        <li>type : {{ selectFile.type }}</li>
        <li>webkitRelativePath : {{ selectFile.webkitRelativePath }}</li>
      </ul>
      <img v-if="previewImgUrl" :src="previewImgUrl" />
      <button type="submit" :disabled="isUploading">Upload</button>

      <div>
        <hr />
        response : {{ response }}
      </div>
    </form>
  </div>
</template>

<script>
  // axios module import
  import http from "../http"

  export default {
    name: "FormValidation",
    components: {},
    data() {
      return {
        selectFile: null, // 파일 객체
        previewImgUrl: null, // 미리보기 이미지 URL
        isUploading: false, // 파일 업로드 체크
        response: null, // 파일 업로드후 응답값
      }
    },
    methods: {
      previewFile() {
        // 선택된 파일이 있는가?
        if (0 < this.$refs.selectFile.files.length) {
          // 0 번째 파일을 가져 온다.
          this.selectFile = this.$refs.selectFile.files[0]
          // 마지막 . 위치를 찾고 + 1 하여 확장자 명을 가져온다.
          let fileExt = this.selectFile.name.substring(
            this.selectFile.name.lastIndexOf(".") + 1
          )
          // 소문자로 변환
          fileExt = fileExt.toLowerCase()
          // 이미지 확장자 체크, 1메가 바이트 이하 인지 체크
          if (
            ["jpeg", "png", "gif", "bmp"].includes(fileExt) &&
            this.selectFile.size <= 1048576
          ) {
            // FileReader 를 활용하여 파일을 읽는다
            var reader = new FileReader()
            reader.onload = e => {
              // base64
              this.previewImgUrl = e.target.result
            }
            reader.readAsDataURL(this.selectFile)
          } else if (this.selectFile.size <= 1048576) {
            // 이미지외 파일
            this.previewImgUrl = null
          } else {
            alert("파일을 다시 선택해 주세요.")
            this.selectFile = null
            this.previewImgUrl = null
          }
        } else {
          // 파일을 선택하지 않았을때
          this.selectFile = null
          this.previewImgUrl = null
        }
        console.log(this.selectFile)
      },

      async formSubmit() {
        if (this.selectFile) {
          // Form 필드 생성
          let form = new FormData()
          form.append("file", this.selectFile) // api file name
          this.isUploading = true

          http
            .post("/api/sample/upload/", form, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            })
            .then(res => {
              this.response = res
              this.isUploading = false
            })
            .catch(error => {
              this.response = error
              this.isUploading = false
            })
        } else {
          alert("파일을 선택해 주세요.")
        }

        return true
      },
    },
  }
</script>

<style scoped></style>
```
