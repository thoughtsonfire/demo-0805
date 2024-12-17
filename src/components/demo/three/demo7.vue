<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
// 导入connon引擎
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
// 引入扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
const RobotExpressive = ref<string>(new URL('@/assets/mode/RobotExpressive.glb', import.meta.url).href)
const box = ref<HTMLDivElement>()
const init = () => {
    // 2. 设置物理引擎（Cannon.js）
    const world = new CANNON.World();
    world.gravity.set(0, 0, -9.82); // 设置重力
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, box.value!.clientWidth / box.value!.clientHeight, 0.1, 1000)
    camera.position.z = 20 // 设置摄像机的z位置
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(box.value!.clientWidth, box.value!.clientHeight)
    box.value!.appendChild(renderer.domElement)
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.position.set(0, 50, 0);  // 调整方向光的位置
    dirLight.castShadow = true // 阴影
    scene.add(dirLight)
    //添加环境光
    const ambientLight = new THREE.AmbientLight(
        0xffffff,//颜色值
        0.5 // 强度值
    )
    scene.add(ambientLight)
    //导入模型
    let model: THREE.Group<THREE.Object3DEventMap> //模型
    // 3. 添加一个简单的地面物理体
    const groundMaterial = new CANNON.Material();
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({
        mass: 0, // 地面不受力
        position: new CANNON.Vec3(0, 0, 0),
        material: groundMaterial
    });
    groundBody.addShape(groundShape);
    world.addBody(groundBody);

    const loader = new GLTFLoader();
    loader.load(RobotExpressive.value, (gltf) => {
        model = gltf.scene;  // 获取加载的模型
        // 将模型添加到场景
        model.position.set(0, 0, 0);  // 设置模型的位置

        scene.add(model);


        // 5. 遍历模型的所有子对象，获取顶点并生成物理模型
        model.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const geometry = child.geometry;
                // geometry.scale(20, 20, 20)
                const vertices = geometry.attributes.position.array;

                // 创建物理形状
                const shape = new CANNON.Trimesh(vertices, geometry.index ? geometry.index.array : null);

                // const mass = 0; // 设置质量
                const material = new CANNON.Material();

                // 创建物理体
                const body = new CANNON.Body({
                    // mass: mass,
                    // position: new CANNON.Vec3(0, 0, 0), // 设置物理体的位置
                    material: material
                });

                body.addShape(shape);
                world.addBody(body);

                // 将物理体绑定到模型的子物体上
                child.body = body;
                // 将物理体的位置同步到 Three.js 模型
                // child.position.copy(body.position);
                // child.rotation.setFromQuaternion(body.quaternion);
            }
        });
        // const body = new CANNON.Body({
        //     mass: 1,
        //     shape: new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5)),
        //     position: new CANNON.Vec3(0, 0, 0)
        // })
        // world.addBody(body);
    }, undefined, (error) => {
        console.error('Error loading model:', error);
    })
    // 创建调试工具
    const cannonDebugger = new CannonDebugger(scene, world);
    //控制器，用于让用户通过鼠标操作（如拖动、滚动、缩放等）来控制 3D 场景中的相机视角
    const controls = new OrbitControls(camera, renderer.domElement)
    const render = () => {
        requestAnimationFrame(render)
        cannonDebugger.update();
        if (!model) return; // 如果 model 未加载，跳过渲染
        // 更新物理引擎
        world.step(1 / 60);

        // 将物理体的更新位置同步到 Three.js 模型
        model.traverse((child) => {
            if (child.isMesh && child.geometry) {
                // 物理体的更新
                const body = child.body;
                if (body) {
                    child.position.copy(body.position);
                    // child.rotation.setFromQuaternion(body.quaternion);
                }
            }
        });

        renderer.render(scene, camera)
    }
    render()
}
onMounted(() => {
    init()
})

</script>

<template>
    <div ref="box" class="box"></div>
</template>

<style scoped>
.box {
    width: 500px;
    height: 500px;
}
</style>