---
templateKey: blog-post
title: 웹 게임 개발 기술 스택 완전정복 - 실전 가이드
date: 2025-12-07T00:00:00.000Z
category: javascript
description:
  웹 게임 개발의 모든 것을 다룹니다. Phaser, Three.js, Babylon.js, Unity WebGL 등 주요 게임 엔진부터 그래픽스, 오디오, 네트워킹, 성능 최적화, 배포 전략까지 실무에서 바로 사용할 수 있는 완벽한 가이드를 제공합니다.
tags:
  - 웹 게임
  - 게임 개발
  - Phaser
  - Three.js
  - Babylon.js
  - Unity WebGL
  - Canvas API
  - WebGL
  - 게임 엔진
  - JavaScript
  - HTML5 게임
---

# 웹 게임 개발 기술 스택 완전정복 - 실전 가이드

웹 게임 개발은 HTML5, Canvas API, WebGL 등의 기술을 활용하여 브라우저에서 실행되는 게임을 만드는 것이다. 모바일과 데스크톱 모두에서 실행 가능하며, 별도의 설치 없이 즉시 플레이할 수 있는 장점이 있다. 이 글은 웹 게임 개발에 필요한 모든 기술 스택을 실전 예제와 함께 다룬다.

## 1. 웹 게임 개발 개요

### 1-1. 웹 게임의 특징

웹 게임은 다음과 같은 특징을 가진다:

- **크로스 플랫폼**: 브라우저가 있는 모든 기기에서 실행
- **즉시 플레이**: 설치 없이 바로 플레이 가능
- **쉬운 배포**: 웹 서버에 업로드하면 전 세계 어디서나 접근 가능
- **낮은 진입 장벽**: 플러그인 설치 불필요
- **실시간 업데이트**: 서버 업데이트로 즉시 반영

### 1-2. 웹 게임 개발 기술 스택

| 기술 | 용도 | 예시 |
|------|------|------|
| **Canvas API** | 2D 그래픽 렌더링 | 간단한 2D 게임 |
| **WebGL** | 3D 그래픽 렌더링 | 3D 게임, 시뮬레이션 |
| **Web Audio API** | 오디오 처리 | 사운드, 음악 재생 |
| **WebSocket** | 실시간 통신 | 멀티플레이어 게임 |
| **IndexedDB** | 로컬 저장소 | 게임 데이터 저장 |
| **Service Worker** | 오프라인 지원 | PWA 게임 |

### 1-3. 게임 엔진 선택 가이드

| 엔진 | 타입 | 난이도 | 성능 | 용도 |
|------|------|--------|------|------|
| **Phaser** | 2D | 중급 | 높음 | 2D 액션, 퍼즐 게임 |
| **Three.js** | 3D | 중급 | 높음 | 3D 시각화, 게임 |
| **Babylon.js** | 3D | 중급 | 매우 높음 | 고품질 3D 게임 |
| **Unity WebGL** | 2D/3D | 고급 | 매우 높음 | 전문 게임 개발 |
| **PixiJS** | 2D | 중급 | 매우 높음 | 고성능 2D 게임 |
| **Matter.js** | 물리 | 중급 | 중간 | 물리 기반 게임 |

## 2. Canvas API 기초

### 2-1. 기본 Canvas 설정

```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Canvas Game</title>
    <style>
        body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: #000;
        }
        canvas {
            border: 1px solid #fff;
        }
    </style>
</head>
<body>
    <canvas id="gameCanvas" width="800" height="600"></canvas>
    <script src="game.js"></script>
</body>
</html>
```

```javascript
// game.js
class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        
        this.player = {
            x: this.width / 2,
            y: this.height / 2,
            radius: 20,
            speed: 5,
            color: '#00ff00'
        };
        
        this.keys = {};
        this.setupEventListeners();
        this.gameLoop();
    }
    
    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });
    }
    
    update() {
        // 플레이어 이동
        if (this.keys['ArrowUp'] || this.keys['w']) {
            this.player.y -= this.player.speed;
        }
        if (this.keys['ArrowDown'] || this.keys['s']) {
            this.player.y += this.player.speed;
        }
        if (this.keys['ArrowLeft'] || this.keys['a']) {
            this.player.x -= this.player.speed;
        }
        if (this.keys['ArrowRight'] || this.keys['d']) {
            this.player.x += this.player.speed;
        }
        
        // 경계 체크
        this.player.x = Math.max(this.player.radius, 
            Math.min(this.width - this.player.radius, this.player.x));
        this.player.y = Math.max(this.player.radius, 
            Math.min(this.height - this.player.radius, this.player.y));
    }
    
    render() {
        // 화면 클리어
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // 플레이어 그리기
        this.ctx.beginPath();
        this.ctx.arc(this.player.x, this.player.y, 
            this.player.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = this.player.color;
        this.ctx.fill();
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();
    }
    
    gameLoop() {
        this.update();
        this.render();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// 게임 시작
new Game();
```

### 2-2. 스프라이트 애니메이션

```javascript
// sprite-animation.js
class Sprite {
    constructor(image, frameWidth, frameHeight, frameCount, fps = 10) {
        this.image = image;
        this.frameWidth = frameWidth;
        this.frameHeight = frameHeight;
        this.frameCount = frameCount;
        this.fps = fps;
        this.currentFrame = 0;
        this.frameTime = 1000 / fps;
        this.lastTime = Date.now();
    }
    
    update() {
        const now = Date.now();
        if (now - this.lastTime >= this.frameTime) {
            this.currentFrame = (this.currentFrame + 1) % this.frameCount;
            this.lastTime = now;
        }
    }
    
    draw(ctx, x, y) {
        const sx = this.currentFrame * this.frameWidth;
        ctx.drawImage(
            this.image,
            sx, 0, this.frameWidth, this.frameHeight,
            x, y, this.frameWidth, this.frameHeight
        );
    }
}

// 사용 예시
const image = new Image();
image.src = 'sprite-sheet.png';
image.onload = () => {
    const sprite = new Sprite(image, 64, 64, 8, 12);
    
    function animate() {
        sprite.update();
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        sprite.draw(ctx, 100, 100);
        requestAnimationFrame(animate);
    }
    animate();
};
```

### 2-3. 파티클 시스템

```javascript
// particle-system.js
class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        this.life = 1.0;
        this.decay = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 5 + 2;
        this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
        this.vy += 0.1; // 중력
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    
    isDead() {
        return this.life <= 0;
    }
}

class ParticleSystem {
    constructor() {
        this.particles = [];
    }
    
    emit(x, y, count = 10) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y));
        }
    }
    
    update() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update();
            if (this.particles[i].isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    draw(ctx) {
        this.particles.forEach(particle => particle.draw(ctx));
    }
}

// 사용 예시
const particleSystem = new ParticleSystem();

canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    particleSystem.emit(
        e.clientX - rect.left,
        e.clientY - rect.top,
        20
    );
});
```

## 3. Phaser 게임 엔진

### 3-1. Phaser 설치 및 기본 설정

```bash
# npm 설치
npm install phaser

# 또는 CDN 사용
# <script src="https://cdn.jsdelivr.net/npm/phaser@3.70.0/dist/phaser.min.js"></script>
```

```javascript
// main.js
import Phaser from 'phaser';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: 'game-container',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

let player;
let platforms;
let cursors;

function preload() {
    // 이미지 로드
    this.load.image('sky', 'assets/sky.png');
    this.load.image('ground', 'assets/platform.png');
    this.load.image('star', 'assets/star.png');
    this.load.spritesheet('dude', 'assets/dude.png', {
        frameWidth: 32,
        frameHeight: 48
    });
}

function create() {
    // 배경
    this.add.image(400, 300, 'sky');
    
    // 플랫폼 생성
    platforms = this.physics.add.staticGroup();
    platforms.create(400, 568, 'ground').setScale(2).refreshBody();
    platforms.create(600, 400, 'ground');
    platforms.create(50, 250, 'ground');
    platforms.create(750, 220, 'ground');
    
    // 플레이어 생성
    player = this.physics.add.sprite(100, 450, 'dude');
    player.setBounce(0.2);
    player.setCollideWorldBounds(true);
    
    // 플레이어 애니메이션
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });
    
    this.anims.create({
        key: 'turn',
        frames: [{ key: 'dude', frame: 4 }],
        frameRate: 20
    });
    
    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });
    
    // 충돌 설정
    this.physics.add.collider(player, platforms);
    
    // 입력 설정
    cursors = this.input.keyboard.createCursorKeys();
    
    // 별 생성
    stars = this.physics.add.group({
        key: 'star',
        repeat: 11,
        setXY: { x: 12, y: 0, stepX: 70 }
    });
    
    stars.children.entries.forEach((child) => {
        child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });
    
    this.physics.add.collider(stars, platforms);
    this.physics.add.overlap(player, stars, collectStar, null, this);
}

function update() {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }
    
    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectStar(player, star) {
    star.disableBody(true, true);
    
    // 점수 추가
    score += 10;
    scoreText.setText('Score: ' + score);
    
    // 모든 별 수집 시 재생성
    if (stars.countActive(true) === 0) {
        stars.children.entries.forEach((child) => {
            child.enableBody(true, child.x, 0, true, true);
        });
    }
}
```

### 3-2. Phaser Scene 관리

```javascript
// scenes/MenuScene.js
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    create() {
        this.add.text(400, 200, 'My Game', {
            fontSize: '64px',
            fill: '#fff'
        }).setOrigin(0.5);
        
        const startButton = this.add.text(400, 400, 'Start Game', {
            fontSize: '32px',
            fill: '#0f0'
        }).setOrigin(0.5).setInteractive();
        
        startButton.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
        
        startButton.on('pointerover', () => {
            startButton.setStyle({ fill: '#ff0' });
        });
        
        startButton.on('pointerout', () => {
            startButton.setStyle({ fill: '#0f0' });
        });
    }
}

// scenes/GameScene.js
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    
    preload() {
        // 리소스 로드
    }
    
    create() {
        // 게임 생성
    }
    
    update() {
        // 게임 업데이트
    }
}

// main.js
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [MenuScene, GameScene]
};

const game = new Phaser.Game(config);
```

## 4. Three.js 3D 게임 개발

### 4-1. Three.js 기본 설정

```bash
npm install three
```

```javascript
// three-game.js
import * as THREE from 'three';

class Game3D {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.shadowMap.enabled = true;
        document.body.appendChild(this.renderer.domElement);
        
        // 조명
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(5, 10, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);
        
        // 지면
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const ground = new THREE.Mesh(groundGeometry, groundMaterial);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);
        
        // 플레이어 (큐브)
        const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
        const playerMaterial = new THREE.MeshStandardMaterial({ color: 0x00ff00 });
        this.player = new THREE.Mesh(playerGeometry, playerMaterial);
        this.player.position.set(0, 0.5, 0);
        this.player.castShadow = true;
        this.scene.add(this.player);
        
        // 카메라 위치
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        // 입력 처리
        this.keys = {};
        this.setupControls();
        
        // 애니메이션 루프
        this.animate();
    }
    
    setupControls() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.key.toLowerCase()] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.key.toLowerCase()] = false;
        });
    }
    
    update() {
        const speed = 0.1;
        
        if (this.keys['w'] || this.keys['arrowup']) {
            this.player.position.z -= speed;
        }
        if (this.keys['s'] || this.keys['arrowdown']) {
            this.player.position.z += speed;
        }
        if (this.keys['a'] || this.keys['arrowleft']) {
            this.player.position.x -= speed;
        }
        if (this.keys['d'] || this.keys['arrowright']) {
            this.player.position.x += speed;
        }
        
        // 플레이어 회전
        this.player.rotation.y += 0.01;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        this.update();
        this.renderer.render(this.scene, this.camera);
    }
}

new Game3D();
```

### 4-2. Three.js 물리 엔진 (Cannon.js)

```bash
npm install cannon
```

```javascript
// physics-game.js
import * as THREE from 'three';
import * as CANNON from 'cannon';

class PhysicsGame {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(this.renderer.domElement);
        
        // 물리 월드 생성
        this.world = new CANNON.World();
        this.world.gravity.set(0, -9.82, 0);
        this.world.broadphase = new CANNON.NaiveBroadphase();
        
        // 지면
        const groundShape = new CANNON.Plane();
        const groundBody = new CANNON.Body({ mass: 0 });
        groundBody.addShape(groundShape);
        groundBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
        this.world.add(groundBody);
        
        const groundGeometry = new THREE.PlaneGeometry(20, 20);
        const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x808080 });
        const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
        groundMesh.rotation.x = -Math.PI / 2;
        this.scene.add(groundMesh);
        
        // 공 생성
        this.createBall(0, 5, 0);
        
        // 조명
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 10, 5);
        this.scene.add(light);
        this.scene.add(new THREE.AmbientLight(0xffffff, 0.5));
        
        this.camera.position.set(0, 5, 10);
        this.camera.lookAt(0, 0, 0);
        
        this.animate();
    }
    
    createBall(x, y, z) {
        // 물리 바디
        const shape = new CANNON.Sphere(0.5);
        const body = new CANNON.Body({ mass: 1 });
        body.addShape(shape);
        body.position.set(x, y, z);
        this.world.add(body);
        
        // 메시
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const material = new THREE.MeshStandardMaterial({ color: 0xff0000 });
        const mesh = new THREE.Mesh(geometry, material);
        this.scene.add(mesh);
        
        // 물리와 메시 동기화
        body.mesh = mesh;
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 물리 시뮬레이션
        this.world.step(1/60);
        
        // 메시 업데이트
        this.world.bodies.forEach((body) => {
            if (body.mesh) {
                body.mesh.position.copy(body.position);
                body.mesh.quaternion.copy(body.quaternion);
            }
        });
        
        this.renderer.render(this.scene, this.camera);
    }
}

new PhysicsGame();
```

## 5. Babylon.js 고급 3D 게임

### 5-1. Babylon.js 기본 설정

```bash
npm install @babylonjs/core @babylonjs/loaders
```

```javascript
// babylon-game.js
import { Engine, Scene, ArcRotateCamera, HemisphericLight, 
         Vector3, MeshBuilder, StandardMaterial, Color3 } from '@babylonjs/core';

class BabylonGame {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.engine = new Engine(this.canvas, true);
        this.scene = this.createScene();
        
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
        
        window.addEventListener('resize', () => {
            this.engine.resize();
        });
    }
    
    createScene() {
        const scene = new Scene(this.engine);
        
        // 카메라
        const camera = new ArcRotateCamera(
            'camera',
            -Math.PI / 2,
            Math.PI / 2.5,
            10,
            Vector3.Zero(),
            scene
        );
        camera.attachToCanvas(this.canvas, true);
        
        // 조명
        const light = new HemisphericLight('light', new Vector3(0, 1, 0), scene);
        light.intensity = 0.7;
        
        // 박스 생성
        const box = MeshBuilder.CreateBox('box', { size: 2 }, scene);
        const material = new StandardMaterial('material', scene);
        material.diffuseColor = new Color3(0, 1, 0);
        box.material = material;
        
        // 애니메이션
        scene.registerBeforeRender(() => {
            box.rotation.y += 0.01;
        });
        
        return scene;
    }
}

new BabylonGame('renderCanvas');
```

### 5-2. Babylon.js 에셋 로딩

```javascript
// asset-loader.js
import { SceneLoader, AssetContainer } from '@babylonjs/core';
import '@babylonjs/loaders/glTF';

class AssetManager {
    constructor(scene) {
        this.scene = scene;
        this.assets = new Map();
    }
    
    async loadGLTF(name, path) {
        const container = await SceneLoader.LoadAssetContainerAsync(
            path,
            '',
            this.scene
        );
        
        this.assets.set(name, container);
        return container;
    }
    
    instantiate(name, position) {
        const container = this.assets.get(name);
        if (!container) {
            throw new Error(`Asset ${name} not found`);
        }
        
        const instance = container.instantiateModelsToScene(
            (sourceName) => `${name}_${sourceName}`,
            false,
            { doNotInstantiate: true }
        );
        
        if (position) {
            instance.rootNodes.forEach((node) => {
                node.position = position;
            });
        }
        
        return instance;
    }
}

// 사용 예시
const assetManager = new AssetManager(scene);
await assetManager.loadGLTF('character', './models/character.gltf');
const character = assetManager.instantiate('character', new Vector3(0, 0, 0));
```

## 6. 오디오 처리

### 6-1. Web Audio API

```javascript
// audio-manager.js
class AudioManager {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = new Map();
        this.music = null;
    }
    
    async loadSound(name, url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        this.sounds.set(name, audioBuffer);
    }
    
    playSound(name, volume = 1.0) {
        const audioBuffer = this.sounds.get(name);
        if (!audioBuffer) {
            console.warn(`Sound ${name} not found`);
            return;
        }
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = audioBuffer;
        gainNode.gain.value = volume;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start(0);
        
        return source;
    }
    
    async playMusic(url, loop = true) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
        
        const source = this.audioContext.createBufferSource();
        const gainNode = this.audioContext.createGain();
        
        source.buffer = audioBuffer;
        source.loop = loop;
        gainNode.gain.value = 0.5;
        
        source.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        source.start(0);
        
        this.music = { source, gainNode };
        return this.music;
    }
    
    setMusicVolume(volume) {
        if (this.music) {
            this.music.gainNode.gain.value = volume;
        }
    }
    
    stopMusic() {
        if (this.music) {
            this.music.source.stop();
            this.music = null;
        }
    }
}

// 사용 예시
const audioManager = new AudioManager();

// 사운드 로드
await audioManager.loadSound('jump', './sounds/jump.mp3');
await audioManager.loadSound('coin', './sounds/coin.mp3');

// 사운드 재생
audioManager.playSound('jump', 0.8);
audioManager.playSound('coin', 1.0);

// 배경음악
await audioManager.playMusic('./music/background.mp3', true);
audioManager.setMusicVolume(0.3);
```

### 6-2. Phaser 오디오

```javascript
// phaser-audio.js
class GameScene extends Phaser.Scene {
    preload() {
        // 오디오 로드
        this.load.audio('background', 'assets/music/background.mp3');
        this.load.audio('jump', 'assets/sounds/jump.wav');
        this.load.audio('coin', 'assets/sounds/coin.wav');
    }
    
    create() {
        // 배경음악
        this.backgroundMusic = this.sound.add('background', {
            loop: true,
            volume: 0.5
        });
        this.backgroundMusic.play();
        
        // 사운드 효과
        this.jumpSound = this.sound.add('jump', { volume: 0.8 });
        this.coinSound = this.sound.add('coin', { volume: 1.0 });
    }
    
    collectCoin() {
        this.coinSound.play();
        // 코인 수집 로직
    }
    
    playerJump() {
        this.jumpSound.play();
        // 점프 로직
    }
}
```

## 7. 네트워킹과 멀티플레이어

### 7-1. WebSocket 기반 멀티플레이어

```javascript
// multiplayer-client.js
class MultiplayerClient {
    constructor(gameUrl) {
        this.ws = new WebSocket(gameUrl);
        this.players = new Map();
        this.localPlayerId = null;
        
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        this.ws.onopen = () => {
            console.log('Connected to game server');
        };
        
        this.ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            this.handleMessage(message);
        };
        
        this.ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
        
        this.ws.onclose = () => {
            console.log('Disconnected from game server');
        };
    }
    
    handleMessage(message) {
        switch (message.type) {
            case 'playerJoined':
                this.onPlayerJoined(message);
                break;
            case 'playerLeft':
                this.onPlayerLeft(message);
                break;
            case 'playerUpdate':
                this.onPlayerUpdate(message);
                break;
            case 'gameState':
                this.onGameState(message);
                break;
        }
    }
    
    sendPlayerUpdate(position, rotation) {
        this.ws.send(JSON.stringify({
            type: 'playerUpdate',
            position: position,
            rotation: rotation
        }));
    }
    
    onPlayerJoined(message) {
        this.localPlayerId = message.playerId;
        console.log('Joined game as player:', message.playerId);
    }
    
    onPlayerLeft(message) {
        this.players.delete(message.playerId);
    }
    
    onPlayerUpdate(message) {
        if (message.playerId !== this.localPlayerId) {
            const player = this.players.get(message.playerId);
            if (player) {
                player.position = message.position;
                player.rotation = message.rotation;
            }
        }
    }
    
    onGameState(message) {
        // 게임 상태 동기화
        message.players.forEach((playerData) => {
            if (playerData.id !== this.localPlayerId) {
                this.players.set(playerData.id, playerData);
            }
        });
    }
}

// 사용 예시
const multiplayer = new MultiplayerClient('ws://localhost:8080/game');

// 게임 루프에서 플레이어 위치 전송
function gameLoop() {
    if (multiplayer.localPlayerId) {
        multiplayer.sendPlayerUpdate(
            player.position,
            player.rotation
        );
    }
    requestAnimationFrame(gameLoop);
}
```

### 7-2. Socket.io를 활용한 실시간 게임

```javascript
// socketio-client.js
import io from 'socket.io-client';

class SocketIOGameClient {
    constructor(serverUrl) {
        this.socket = io(serverUrl);
        this.players = new Map();
        this.setupEventHandlers();
    }
    
    setupEventHandlers() {
        this.socket.on('connect', () => {
            console.log('Connected:', this.socket.id);
        });
        
        this.socket.on('playerJoined', (playerData) => {
            this.players.set(playerData.id, playerData);
        });
        
        this.socket.on('playerLeft', (playerId) => {
            this.players.delete(playerId);
        });
        
        this.socket.on('playerMoved', (data) => {
            const player = this.players.get(data.id);
            if (player) {
                player.position = data.position;
                player.rotation = data.rotation;
            }
        });
        
        this.socket.on('gameState', (state) => {
            // 게임 상태 업데이트
            this.updateGameState(state);
        });
    }
    
    sendMovement(position, rotation) {
        this.socket.emit('playerMove', {
            position: position,
            rotation: rotation
        });
    }
    
    sendAction(actionType, data) {
        this.socket.emit('playerAction', {
            type: actionType,
            data: data
        });
    }
}

// 서버 측 (Node.js)
const io = require('socket.io')(server);

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);
    
    socket.on('playerMove', (data) => {
        // 다른 플레이어에게 전송
        socket.broadcast.emit('playerMoved', {
            id: socket.id,
            position: data.position,
            rotation: data.rotation
        });
    });
    
    socket.on('disconnect', () => {
        console.log('Player disconnected:', socket.id);
        io.emit('playerLeft', socket.id);
    });
});
```

## 8. 성능 최적화

### 8-1. 객체 풀링

```javascript
// object-pool.js
class ObjectPool {
    constructor(createFn, resetFn, initialSize = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        this.active = [];
        
        // 초기 객체 생성
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }
    
    acquire() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFn();
        }
        this.active.push(obj);
        return obj;
    }
    
    release(obj) {
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
            this.resetFn(obj);
            this.pool.push(obj);
        }
    }
    
    releaseAll() {
        this.active.forEach(obj => {
            this.resetFn(obj);
            this.pool.push(obj);
        });
        this.active = [];
    }
}

// 사용 예시 - 총알 풀
const bulletPool = new ObjectPool(
    () => ({ x: 0, y: 0, vx: 0, vy: 0, active: false }),
    (bullet) => {
        bullet.active = false;
        bullet.x = 0;
        bullet.y = 0;
    },
    50
);

function shootBullet(x, y, angle, speed) {
    const bullet = bulletPool.acquire();
    bullet.x = x;
    bullet.y = y;
    bullet.vx = Math.cos(angle) * speed;
    bullet.vy = Math.sin(angle) * speed;
    bullet.active = true;
    return bullet;
}

function updateBullets() {
    activeBullets.forEach((bullet, index) => {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;
        
        // 화면 밖으로 나가면 반환
        if (bullet.x < 0 || bullet.x > canvas.width ||
            bullet.y < 0 || bullet.y > canvas.height) {
            bulletPool.release(bullet);
            activeBullets.splice(index, 1);
        }
    });
}
```

### 8-2. 공간 분할 (Spatial Partitioning)

```javascript
// spatial-grid.js
class SpatialGrid {
    constructor(width, height, cellSize) {
        this.width = width;
        this.height = height;
        this.cellSize = cellSize;
        this.cols = Math.ceil(width / cellSize);
        this.rows = Math.ceil(height / cellSize);
        this.grid = [];
        
        for (let i = 0; i < this.rows; i++) {
            this.grid[i] = [];
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = [];
            }
        }
    }
    
    getCell(x, y) {
        const col = Math.floor(x / this.cellSize);
        const row = Math.floor(y / this.cellSize);
        return {
            row: Math.max(0, Math.min(this.rows - 1, row)),
            col: Math.max(0, Math.min(this.cols - 1, col))
        };
    }
    
    insert(obj) {
        const cell = this.getCell(obj.x, obj.y);
        this.grid[cell.row][cell.col].push(obj);
        obj._cell = cell;
    }
    
    remove(obj) {
        if (obj._cell) {
            const cell = obj._cell;
            const index = this.grid[cell.row][cell.col].indexOf(obj);
            if (index > -1) {
                this.grid[cell.row][cell.col].splice(index, 1);
            }
            obj._cell = null;
        }
    }
    
    getNearby(x, y, radius) {
        const startCell = this.getCell(x - radius, y - radius);
        const endCell = this.getCell(x + radius, y + radius);
        const nearby = [];
        
        for (let row = startCell.row; row <= endCell.row; row++) {
            for (let col = startCell.col; col <= endCell.col; col++) {
                this.grid[row][col].forEach(obj => {
                    const dx = obj.x - x;
                    const dy = obj.y - y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance <= radius) {
                        nearby.push(obj);
                    }
                });
            }
        }
        
        return nearby;
    }
    
    clear() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.grid[i][j] = [];
            }
        }
    }
}

// 사용 예시
const spatialGrid = new SpatialGrid(800, 600, 100);

// 객체 추가
enemies.forEach(enemy => spatialGrid.insert(enemy));

// 근처 적 찾기
const nearbyEnemies = spatialGrid.getNearby(player.x, player.y, 150);
```

### 8-3. 프레임 레이트 최적화

```javascript
// frame-rate-manager.js
class FrameRateManager {
    constructor(targetFPS = 60) {
        this.targetFPS = targetFPS;
        this.frameTime = 1000 / targetFPS;
        this.lastTime = performance.now();
        this.deltaTime = 0;
        this.accumulator = 0;
    }
    
    update(callback) {
        const currentTime = performance.now();
        this.deltaTime = currentTime - this.lastTime;
        this.lastTime = currentTime;
        
        // 프레임 드롭 보정
        this.accumulator += this.deltaTime;
        
        while (this.accumulator >= this.frameTime) {
            callback(this.frameTime);
            this.accumulator -= this.frameTime;
        }
    }
    
    getFPS() {
        return 1000 / this.deltaTime;
    }
}

// 사용 예시
const frameManager = new FrameRateManager(60);

function gameLoop() {
    frameManager.update((deltaTime) => {
        // 게임 로직 업데이트 (deltaTime 사용)
        updateGame(deltaTime);
    });
    
    // 렌더링은 항상 실행
    renderGame();
    
    requestAnimationFrame(gameLoop);
}
```

## 9. 게임 상태 관리

### 9-1. 상태 머신

```javascript
// state-machine.js
class StateMachine {
    constructor() {
        this.states = new Map();
        this.currentState = null;
        this.previousState = null;
    }
    
    addState(name, state) {
        this.states.set(name, state);
    }
    
    changeState(name) {
        if (this.currentState && this.currentState.onExit) {
            this.currentState.onExit();
        }
        
        this.previousState = this.currentState;
        this.currentState = this.states.get(name);
        
        if (this.currentState && this.currentState.onEnter) {
            this.currentState.onEnter();
        }
    }
    
    update(deltaTime) {
        if (this.currentState && this.currentState.update) {
            this.currentState.update(deltaTime);
        }
    }
}

// 사용 예시
const stateMachine = new StateMachine();

// 메뉴 상태
stateMachine.addState('menu', {
    onEnter: () => {
        showMenu();
    },
    update: (deltaTime) => {
        // 메뉴 업데이트
    },
    onExit: () => {
        hideMenu();
    }
});

// 게임 상태
stateMachine.addState('playing', {
    onEnter: () => {
        startGame();
    },
    update: (deltaTime) => {
        updateGame(deltaTime);
    },
    onExit: () => {
        pauseGame();
    }
});

// 상태 전환
stateMachine.changeState('menu');
```

### 9-2. 게임 데이터 저장

```javascript
// save-system.js
class SaveSystem {
    constructor() {
        this.storageKey = 'gameSave';
    }
    
    save(data) {
        try {
            const json = JSON.stringify(data);
            localStorage.setItem(this.storageKey, json);
            return true;
        } catch (e) {
            console.error('Save failed:', e);
            return false;
        }
    }
    
    load() {
        try {
            const json = localStorage.getItem(this.storageKey);
            return json ? JSON.parse(json) : null;
        } catch (e) {
            console.error('Load failed:', e);
            return null;
        }
    }
    
    delete() {
        localStorage.removeItem(this.storageKey);
    }
    
    // IndexedDB 사용 (대용량 데이터)
    async saveToIndexedDB(data) {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open('GameDB', 1);
            
            request.onerror = () => reject(request.error);
            request.onsuccess = () => {
                const db = request.result;
                const transaction = db.transaction(['saves'], 'readwrite');
                const store = transaction.objectStore('saves');
                const saveRequest = store.put(data, 'gameSave');
                
                saveRequest.onsuccess = () => resolve();
                saveRequest.onerror = () => reject(saveRequest.error);
            };
            
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains('saves')) {
                    db.createObjectStore('saves');
                }
            };
        });
    }
}

// 사용 예시
const saveSystem = new SaveSystem();

const gameData = {
    level: 5,
    score: 10000,
    inventory: ['sword', 'shield', 'potion'],
    playerStats: {
        health: 100,
        mana: 50
    }
};

saveSystem.save(gameData);
const loadedData = saveSystem.load();
```

## 10. 배포와 최적화

### 10-1. 번들링 (Webpack/Vite)

```javascript
// webpack.config.js
const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                type: 'asset/resource'
            }
        ]
    },
    optimization: {
        minimize: true
    },
    devServer: {
        static: './dist',
        port: 8080
    }
};
```

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    'phaser': ['phaser'],
                    'three': ['three']
                }
            }
        },
        chunkSizeWarningLimit: 1000
    },
    server: {
        port: 3000
    }
});
```

### 10-2. 에셋 최적화

```javascript
// asset-loader.js
class AssetLoader {
    constructor() {
        this.assets = new Map();
        this.loadedCount = 0;
        this.totalCount = 0;
    }
    
    async loadImage(name, url) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                this.assets.set(name, img);
                this.onAssetLoaded();
                resolve(img);
            };
            img.onerror = reject;
            img.src = url;
        });
    }
    
    async loadImages(images) {
        this.totalCount = images.length;
        const promises = images.map(({ name, url }) => 
            this.loadImage(name, url)
        );
        return Promise.all(promises);
    }
    
    onAssetLoaded() {
        this.loadedCount++;
        const progress = this.loadedCount / this.totalCount;
        this.onProgress?.(progress);
    }
    
    getAsset(name) {
        return this.assets.get(name);
    }
}

// 사용 예시
const loader = new AssetLoader();
loader.onProgress = (progress) => {
    console.log(`Loading: ${Math.round(progress * 100)}%`);
};

await loader.loadImages([
    { name: 'player', url: './assets/player.png' },
    { name: 'enemy', url: './assets/enemy.png' },
    { name: 'background', url: './assets/background.jpg' }
]);
```

### 10-3. PWA 설정

```javascript
// service-worker.js
const CACHE_NAME = 'game-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/bundle.js',
    '/assets/player.png',
    '/assets/background.jpg'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
```

```html
<!-- manifest.json -->
{
    "name": "My Game",
    "short_name": "Game",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#000",
    "theme_color": "#000",
    "icons": [
        {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png"
        },
        {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png"
        }
    ]
}
```

## 11. 실전 게임 예제 - 플랫포머 게임

```javascript
// platformer-game.js
import Phaser from 'phaser';

class PlatformerScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlatformerScene' });
    }
    
    preload() {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.spritesheet('player', 'assets/player.png', {
            frameWidth: 32,
            frameHeight: 48
        });
        this.load.image('coin', 'assets/coin.png');
    }
    
    create() {
        // 배경
        this.add.image(400, 300, 'sky');
        
        // 플랫폼
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
        
        // 플레이어
        this.player = this.physics.add.sprite(100, 450, 'player');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        
        // 애니메이션
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'player', frame: 4 }],
            frameRate: 20
        });
        
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        
        // 충돌
        this.physics.add.collider(this.player, this.platforms);
        
        // 입력
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // 코인
        this.coins = this.physics.add.group({
            key: 'coin',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        
        this.coins.children.entries.forEach((child) => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        
        this.physics.add.collider(this.coins, this.platforms);
        this.physics.add.overlap(this.player, this.coins, this.collectCoin, null, this);
        
        // 점수
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            fill: '#000'
        });
    }
    
    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }
        
        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
    
    collectCoin(player, coin) {
        coin.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        
        if (this.coins.countActive(true) === 0) {
            this.coins.children.entries.forEach((child) => {
                child.enableBody(true, child.x, 0, true, true);
            });
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: PlatformerScene
};

const game = new Phaser.Game(config);
```

## 12. 결론

웹 게임 개발은 다양한 기술 스택을 활용하여 강력한 게임을 만들 수 있다. 이 글에서 다룬 내용:

1. **Canvas API**: 기본 2D 그래픽 렌더링
2. **게임 엔진**: Phaser, Three.js, Babylon.js
3. **오디오 처리**: Web Audio API
4. **네트워킹**: WebSocket, Socket.io
5. **성능 최적화**: 객체 풀링, 공간 분할
6. **상태 관리**: 상태 머신, 데이터 저장
7. **배포**: 번들링, PWA

이러한 기술들을 조합하면 브라우저에서 실행되는 고품질 게임을 개발할 수 있다.

## 참고 자료

- [Phaser 공식 문서](https://phaser.io/)
- [Three.js 문서](https://threejs.org/)
- [Babylon.js 문서](https://www.babylonjs.com/)
- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

