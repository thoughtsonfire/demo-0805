<script setup lang="ts">
import { ref, onMounted, watchEffect } from 'vue';  // 引入 Vue 3 的响应式和生命周期钩子
import * as THREE from 'three';  // 引入 Three.js
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';  // 引入 GLTF 模型加载器
import { AnimationMixer } from 'three';  // 引入动画混合器
// 定义动作类型：用于控制模型的不同动画状态
type Action = 'Dance' | 'Death' | 'Idle' | 'Jump' | 'No' | 'Punch' | 'Running' | 'Sitting' | 'Standing' | 'Walking' | 'WalkJump' | 'Wave' | 'Yes';
// 创建响应式引用
const sceneContainer = ref<HTMLElement | null>(null);  // 用于获取 DOM 容器引用
const keyboard = ref({  // 用于跟踪键盘按键状态
    w: false,
    a: false,
    s: false,
    d: false,
    shift: false,
    q: false,
});

let scene: THREE.Scene;  // Three.js 场景
let camera: THREE.PerspectiveCamera;  // Three.js 相机
let renderer: THREE.WebGLRenderer;  // Three.js 渲染器
let model: THREE.Object3D | null = null;  // 3D 模型
let model2: THREE.Object3D | null = null;  // 3D 模型
let mixer: AnimationMixer | null = null;  // 动画混合器
let mixer2: AnimationMixer | null = null;  // 动画混合器
let actions: { [key in Action]?: THREE.AnimationAction } = {};  // 存储动画动作
let currentAction: Action = 'Walking';  // 当前播放的动画动作，默认为 'Walking'

let clock = new THREE.Clock();
let isAttacking = false;  // 用来判断是否正在攻击

const initScene = () => {
    // 初始化 Three.js 场景
    scene = new THREE.Scene();

    // 创建一个透视相机
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;  // 将相机放置在 z = 5 的位置

    // 创建 WebGL 渲染器并将其添加到页面
    renderer = new THREE.WebGLRenderer();
    if (sceneContainer.value) {  // 确保容器存在
        renderer.setSize(window.innerWidth, window.innerHeight);  // 设置渲染器的尺寸
        sceneContainer.value.appendChild(renderer.domElement);  // 将渲染器的 canvas 元素添加到 DOM
    }

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0x404040, 2);  // 环境光，提供柔和的光照
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);  // 定向光，模拟太阳光照射
    directionalLight.position.set(5, 5, 5).normalize();  // 设置光源的位置
    scene.add(directionalLight);

    // 加载 GLTF 格式的 3D 模型
    const loader = new GLTFLoader();
    loader.load('/RobotExpressive.glb', (gltf) => {
        model = gltf.scene;  // 获取加载的模型
        scene.add(model);  // 将模型添加到场景中

        // 创建动画混合器
        mixer = new AnimationMixer(model);

        // 加载模型中的所有动画
        gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);  // 为每个动画创建动作
            if (clip.name.includes('Walking')) actions.Walking = action;  // 存储 'walk' 动作
            if (clip.name.includes('Running')) actions.Running = action;  // 存储 'run' 动作
            if (clip.name.includes('Punch')) actions.Punch = action;  // 存储 'attack' 动作
        });

        // 第二个模型
        model2 = gltf.scene.clone();  // 克隆第二个模型
        model2.position.set(2, 0, 0);  // 将第二个模型放在右侧
        scene.add(model2);

        mixer2 = new AnimationMixer(model2);

        // 默认播放 'walk' 动作
        actions.Walking?.play();
        // 监听窗口大小变化时，调整渲染器和相机的参数
        window.addEventListener('resize', handleResize);

        // 监听键盘事件
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // 启动动画循环
        animate();
    });
    // 动画渲染循环
    const animate = () => {
        requestAnimationFrame(animate);  // 请求下一帧

        // 更新动画混合器
        if (mixer) {
            mixer.update(0.01);  // 更新动画
        }

        // 移动模型
        if (model) {
            const speed = keyboard.value.shift ? 0.1 : 0.05;  // 根据是否按下 Shift 键调整移动速度
            if (keyboard.value.w) model.position.z -= speed;  // 按 'w' 键，模型沿 Z 轴前移
            if (keyboard.value.s) model.position.z += speed;  // 按 's' 键，模型沿 Z 轴后移
            if (keyboard.value.a) model.position.x -= speed;  // 按 'a' 键，模型沿 X 轴左移
            if (keyboard.value.d) model.position.x += speed;  // 按 'd' 键，模型沿 X 轴右移
        }

        // 渲染场景
        renderer.render(scene, camera);
    };
}
// 动画渲染循环
const animate = () => {
    requestAnimationFrame(animate);  // 请求下一帧

    // 更新动画混合器
    if (mixer) {
        mixer.update(0.01);  // 更新动画
    }
    // 更新动画混合器
    if (mixer2) mixer2.update(clock.getDelta());

    // 移动模型
    if (model) {
        const speed = keyboard.value.shift ? 0.1 : 0.05;  // 根据是否按下 Shift 键调整移动速度
        if (keyboard.value.w) model.position.z -= speed;  // 按 'w' 键，模型沿 Z 轴前移
        if (keyboard.value.s) model.position.z += speed;  // 按 's' 键，模型沿 Z 轴后移
        if (keyboard.value.a) model.position.x -= speed;  // 按 'a' 键，模型沿 X 轴左移
        if (keyboard.value.d) model.position.x += speed;  // 按 'd' 键，模型沿 X 轴右移
    }
    // 渲染场景
    renderer.render(scene, camera);
};
// 处理窗口大小变化
const handleResize = () => {
    if (camera) {
        camera.aspect = window.innerWidth / window.innerHeight;  // 更新相机的纵横比
        camera.updateProjectionMatrix();  // 更新投影矩阵
    }
    renderer.setSize(window.innerWidth, window.innerHeight);  // 更新渲染器的尺寸
};

// 键盘按下事件处理
const handleKeyDown = (event: KeyboardEvent) => {
    // 更新键盘状态
    if (event.key === 'w') keyboard.value.w = true;
    if (event.key === 'a') keyboard.value.a = true;
    if (event.key === 's') keyboard.value.s = true;
    if (event.key === 'd') keyboard.value.d = true;
    if (event.key === 'Shift') keyboard.value.shift = true;
    if (event.key === 'q') {
        keyboard.value.q = true
        isAttacking = true
    };
    // 检查是否发生攻击碰撞
    detectAttackCollision();
    // 更新模型的动作和位置
    updateModelMovement();
};

// 键盘松开事件处理
const handleKeyUp = (event: KeyboardEvent) => {
    // 更新键盘状态
    if (event.key === 'w') keyboard.value.w = false;
    if (event.key === 'a') keyboard.value.a = false;
    if (event.key === 's') keyboard.value.s = false;
    if (event.key === 'd') keyboard.value.d = false;
    if (event.key === 'Shift') keyboard.value.shift = false;
    if (event.key === 'q') {
        keyboard.value.q = false
        isAttacking = false
    };

    // 更新模型的动作和位置
    updateModelMovement();
};

// 更新模型的移动和动画
const updateModelMovement = () => {
    if (keyboard.value.q) {
        // 如果按下 'q' 键，播放攻击动作
        if (currentAction !== 'Punch' && actions.Punch) {
            actions[currentAction]?.fadeOut(0.5);  // 当前动作渐变消失
            actions.Punch?.reset().fadeIn(0.5).play();  // 播放攻击动作
            currentAction = 'Punch';  // 更新当前动作
        }
    } else {
        // 判断是否按下了移动键
        const isRunning = keyboard.value.shift;  // 判断是否按下 Shift 键来跑步
        const isMoving = keyboard.value.w || keyboard.value.a || keyboard.value.s || keyboard.value.d;  // 判断是否有任何方向键按下

        if (isMoving) {
            // 如果有按键，更新动作为 'run' 或 'walk'
            if (isRunning) {
                if (currentAction !== 'Running' && actions.Running) {
                    actions[currentAction]?.fadeOut(0.5);  // 当前动作渐变消失
                    actions.Running?.reset().fadeIn(0.5).play();  // 播放跑步动作
                    currentAction = 'Running';  // 更新当前动作
                }
            } else {
                if (currentAction !== 'Walking' && actions.Walking) {
                    actions[currentAction]?.fadeOut(0.5);  // 当前动作渐变消失
                    actions.Walking?.reset().fadeIn(0.5).play();  // 播放走路动作
                    currentAction = 'Walking';  // 更新当前动作
                }
            }
        } else {
            // 如果没有按任何方向键，恢复到 'walk' 动作
            if (currentAction !== 'Walking' && actions.Walking) {
                actions[currentAction]?.fadeOut(0.5);  // 当前动作渐变消失
                actions.Walking?.reset().fadeIn(0.5).play();  // 播放走路动作
                currentAction = 'Walking';  // 更新当前动作
            }
        }
    }
};

// 模拟简单的物理效果
function applyKnockback(target, direction) {
    // 模拟目标物体的位移，产生一种“击退”的效果
    const knockbackStrength = 0.5;  // 击退的强度
    target.position.add(direction.multiplyScalar(knockbackStrength));
}

// 简单的攻击检测
function detectAttackCollision() {
    if (!model || !model2) return;

    const attackRadius = 1;  // 攻击范围
    const distance = model.position.distanceTo(model2.position);

    if (distance < attackRadius && isAttacking) {
        // 模拟物理效果: 播放攻击效果
        const direction = new THREE.Vector3().subVectors(model2.position, model.position).normalize();
        applyKnockback(model2, direction);  // 使目标模型被击退
    }
}
onMounted(() => {
    initScene()
})
</script>

<template>
    <!-- 渲染 Three.js 场景的容器 -->
    <div ref="sceneContainer" class="scene-container"></div>
</template>

<style scoped lang="scss"></style>