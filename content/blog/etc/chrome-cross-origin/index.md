---
templateKey: blog-post
title: Chrome cross origin
date: 2020-10-18T07:11:12.292Z
category: etc
description: OSX, Windows Chrome cross origin
tags:
  - OSX
  - Windows
  - Chrome
---

## OSX

```
open -n -a /Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --args --user-data-dir="/tmp/chrome_dev_test" --disable-web-security
```

## Wondows

```
"[PATH_TO_CHROME]\chrome.exe" --disable-web-security --disable-gpu --user-data-dir=~/chromeTemp
"[PATH_TO_CHROME]\chrome.exe --user-data-dir="C://Chrome dev session" --disable-web-security"
```

## Linux

```
google-chrome --disable-web-security
```
