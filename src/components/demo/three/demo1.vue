<template>
    <div>
        <div style="position: relative;" ref="sceneContainer" class="scene-container">
            <button style="position: absolute;" @click="startCustomAnimation">开始自定义动画</button>
        </div>
    </div>
</template>

<script lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

export default {
    name: 'ThreeScene',
    setup() {
        const sceneContainer = ref<HTMLDivElement | null>(null);
        let scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer;
        let mixer: THREE.AnimationMixer;
        let model: THREE.Object3D;
        let animationFrameId: number;
        let isCustomAnimation = false;
        let defaultAction: THREE.AnimationAction, customAction: THREE.AnimationAction;
        let time: number

        const RobotExpressive = ref<string>(new URL('@/assets/mode/RobotExpressive.glb', import.meta.url).href)

        // 初始化 Three.js 场景
        const initScene = () => {
            if (!sceneContainer.value) return;

            // 创建场景、相机和渲染器
            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            camera.position.set(0, 1, 5);  // 相机的位置设置，确保它在模型前面
            renderer = new THREE.WebGLRenderer();
            renderer.setSize(window.innerWidth, window.innerHeight);
            sceneContainer.value.appendChild(renderer.domElement);

            const light = new THREE.AmbientLight(0xffffff, 1); // 环境光
            scene.add(light);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // 定向光
            directionalLight.position.set(5, 5, 5).normalize();
            scene.add(directionalLight);

            // 加载 GLTF 模型
            const loader = new GLTFLoader();
            loader.load(
                RobotExpressive.value, // 请替换为你的模型路径
                (gltf: THREE.GLTF) => {
                    console.log('模型加载成功:', gltf);  // 输出加载的模型
                    model = gltf.scene;
                    scene.add(model);

                    // 将模型的位置调整到相机视野范围内
                    gltf.scene.position.set(0, 0, -5);
                    // 动画设置
                    mixer = new THREE.AnimationMixer(model);

                    // 假设模型包含两个动画：'default' 和 'custom'（你可以根据实际情况调整）
                    gltf.animations.forEach(item => {
                        if (item.name == 'Walking') {
                            defaultAction = mixer.clipAction(item);
                        }
                    });
                    gltf.animations[1].loop = THREE.LoopOnce
                    customAction = mixer.clipAction(gltf.animations[1]);
                    time = Math.floor((gltf.animations[1].duration) * 1000)
                    // 启动默认动画
                    defaultAction.play();
                },
                undefined,
                (error) => {
                    console.error('模型加载失败:', error);
                }
            );

            camera.position.z = 5;

            // 渲染循环
            const animate = () => {
                if (mixer) {
                    mixer.update(0.01); // 更新动画
                }
                renderer.render(scene, camera);
                animationFrameId = requestAnimationFrame(animate);
            };

            animate();
        };

        // 切换到自定义动画
        const startCustomAnimation = () => {
            isCustomAnimation = true;
            if (customAction) {
                // 停止默认动画并播放自定义动画
                defaultAction.stop();
                customAction.reset().play();

                // 自定义动画持续 2 秒，结束后返回默认动画
                setTimeout(() => {
                    isCustomAnimation = false;
                    customAction.stop();
                    defaultAction.reset().play();
                }, time); // 自定义动画持续 2 秒
            }
        };

        // 在组件挂载时初始化场景
        onMounted(() => {
            initScene();
        });

        // 在组件卸载时清理动画
        onBeforeUnmount(() => {
            cancelAnimationFrame(animationFrameId);
            if (sceneContainer.value) {
                sceneContainer.value.innerHTML = '';
            }
        });

        return {
            sceneContainer,
            startCustomAnimation
        };
    }
};
</script>

<style scoped>
.scene-container {
    width: 500px;
    height: 500px;
    background-color: #000;
}
</style>