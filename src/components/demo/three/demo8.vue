<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as THREE from 'three'
// 导入connon引擎
import * as CANNON from 'cannon-es'
import CannonDebugger from 'cannon-es-debugger';
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const canvas = ref<HTMLDivElement>()
const RobotExpressive = ref<string>(new URL('@/assets/mode/RobotExpressive.glb', import.meta.url).href)
const Soldier = ref<string>(new URL('@/assets/mode/Soldier.glb', import.meta.url).href)
const Xbot = ref<string>(new URL('@/assets/mode/Xbot.glb', import.meta.url).href)
const Girl = ref<string>(new URL('@/assets/mode/Girl.glb', import.meta.url).href)
const RedMode = ref<string>(new URL('@/assets/mode/red/redMode.gltf', import.meta.url).href)
const Underworld = ref<string>(new URL('@/assets/mode/Underworld.glb', import.meta.url).href)
type Action = 'Idle' | 'Run' | 'Walk' | 'TPose'
let currentAction: Action = 'Walk';  // 当前播放的动画动作，默认为 'Walking'
let actions: { [key in Action]?: THREE.AnimationAction } = {};  // 存储动画动作
const init = () => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, canvas.value!.clientWidth / canvas.value!.clientHeight, 0.1, 10000)
    camera.position.z = 1000
    // AxesHelper：辅助观察的坐标系
    const axesHelper = new THREE.AxesHelper(500);
    scene.add(axesHelper);
    const world = new CANNON.World();
    world.gravity.set(0, -9.82, 0); // 设置重力
    const cannonDebugger = CannonDebugger(scene, world);
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(canvas.value!.clientWidth, canvas.value!.clientHeight)
    canvas.value!.appendChild(renderer.domElement)
    // 设置相机控件轨道控制器OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    controls.addEventListener('change', function () {
        renderer.render(scene, camera); //执行渲染操作
    });//监听鼠标、键盘事件

    //添加光源
    const pointLight = new THREE.PointLight(0xffffff, 20.0);
    pointLight.decay = 0.0;//设置光源不随距离衰减   如果使用默认衰减2.0，不同版本可能有差异
    //点光源位置
    pointLight.position.set(100, 200, 200);//点光源放在x轴上
    scene.add(pointLight); //点光源添加到场景中
    // 光源辅助观察
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
    scene.add(pointLightHelper);


    // 地面属性
    const floorMaterial = new THREE.MeshLambertMaterial({
        // map: texture,
        color: 0xe4e4e4,//颜色
        transparent: true,//支持透明度，这意味着可以通过设置 opacity 来控制材质的透明程度。
        opacity: 0.5,
        side: THREE.DoubleSide, //两面可见

    })//创建地板材质
    //创建地板网格
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(10000, 10000),// 50x50 单位大小的矩形平面
        floorMaterial  //材质
    )
    floor.position.set(0, 0, 0)//地板位置
    floor.rotation.x = -Math.PI / 2//floor.rotation.x 设置了地面的旋转角度。-Math.PI / 2 表示将地面绕 X 轴旋转 90 度。
    floor.receiveShadow = true // 接收阴影
    scene.add(floor)

    // 物理世界创建地面
    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body()
    floorBody.material = new CANNON.Material()
    // 当质量为0的时候，可以使得物体保持不动
    floorBody.mass = 0
    floorBody.addShape(floorShape)
    // 地面位置
    floorBody.position.set(0, 0, 0)
    // 旋转地面的位置
    floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -Math.PI / 2
    )
    world.addBody(floorBody)

    //添加模型
    const loader = new GLTFLoader();
    let model: THREE.Group<THREE.Object3DEventMap> //模型
    let mixer: THREE.AnimationMixer

    loader.load(Girl.value, (gltf) => {
        model = gltf.scene;  // 获取加载的模型
        model.position.set(0, 5, 0);  // 设置模型的位置
        scene.add(model);
        const scale = {
            x: 100,
            y: 100,
            z: 100
        }
        model.scale.set(scale.x, scale.y, scale.z);
        // 添加动画
        mixer = new THREE.AnimationMixer(model);
        gltf.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip);  // 为每个动画创建动作
            if (clip.name.includes('Idle')) actions.Idle = action;  // 存储  动作
            if (clip.name.includes('Run')) actions.Run = action;  // 存储  动作
            if (clip.name.includes('TPose')) actions.TPose = action;  // 存储  动作
            if (clip.name.includes('Walk')) actions.Walk = action;  // 存储 动作
        });
        addPhysicModel()
    });
    //创建物理刚体
    // 创建一个复合物体来容纳所有形状
    const compoundBody = new CANNON.Body({
        mass: 0,  // 设置整体模型的质量
        position: new CANNON.Vec3(0, 0, 0),  // 设置物理体的位置
        material: new CANNON.Material()  // 设置物理材质
    });
    const addPhysicModel = () => {
        // 遍历模型的所有子对象，获取顶点并生成物理形状
        model.traverse((child) => {
            if (child.isMesh && child.geometry) {
                const geometry = child.geometry;
                const vertices = geometry.attributes.position.array;
                const index = geometry.index ? geometry.index.array : null;
                console.log("Vertices:", vertices);
                console.log("index:", index);

                // 创建物理形状
                const shape = new CANNON.Trimesh(vertices, index);

                const rotation = child.rotation;  // 获取子物体的旋转
                const euler = new THREE.Euler(rotation.x, rotation.y, rotation.z, 'XYZ'); // 设置旋转顺序
                const threeQuaternion = new THREE.Quaternion().setFromEuler(euler); // 创建四元数

                // 获取子物体的世界坐标
                const worldPosition = new THREE.Vector3();
                child.getWorldPosition(worldPosition);
                console.log("World position of child:", worldPosition);


                // 创建偏移量和四元数
                const offset = new CANNON.Vec3(worldPosition.x, worldPosition.y, worldPosition.z);
                const quaternion = new CANNON.Quaternion(threeQuaternion.x, threeQuaternion.y, threeQuaternion.z, threeQuaternion.w); // 使用 threeQuaternion

                console.log("Adding shape:", shape);
                // 将形状添加到复合物体中
                compoundBody.addShape(shape, offset, quaternion);
            }
        });
        compoundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0);  // 绕X轴旋转90度
        // 将复合物体添加到物理世界中
        world.addBody(compoundBody);
    }
    const updatePhysics = () => {
        // 推进物理引擎
        world.step(1 / 60); // 更新物理世界，每秒60次
        // 同步模型位置和旋转
        scene.traverse((object) => {
            if (object.userData.physicsBody) {
                const body = object.userData.physicsBody;
                object.position.copy(body.position);
                object.rotation.setFromQuaternion(body.rotation);
            }
        });
        mixer.update(0.016); // 每帧更新动画
    }
    const animate = () => {
        // 控制变量
        const moveSpeed = 5; // 控制移动速度
        const direction = new THREE.Vector3(); // 控制方向的向量
        const velocity = new THREE.Vector3(); // 控制速度的向量

        // 键盘输入监听
        const keys = {
            W: false,
            A: false,
            S: false,
            D: false
        };

        // 监听键盘事件
        window.addEventListener('keydown', (event) => {
            if (event.key === 'w') keys.W = true;
            if (event.key === 'a') keys.A = true;
            if (event.key === 's') keys.S = true;
            if (event.key === 'd') keys.D = true;
        });

        window.addEventListener('keyup', (event) => {
            if (event.key === 'w') keys.W = false;
            if (event.key === 'a') keys.A = false;
            if (event.key === 's') keys.S = false;
            if (event.key === 'd') keys.D = false;
        });

        // 控制角色移动
        direction.set(0, 0, 0);
        if (keys.W) direction.z -= 1;
        if (keys.S) direction.z += 1;
        if (keys.A) direction.x -= 1;
        if (keys.D) direction.x += 1;

        // 规范化方向向量以保持一致的速度
        direction.normalize();

        // 通过物理引擎设置速度
        if (compoundBody) {
            compoundBody.velocity.set(direction.x * moveSpeed, compoundBody.velocity.y, direction.z * moveSpeed);
        }
        // 播放动画：基于速度判断是否播放走路动画
        if (direction.length() > 0.1) {
            actions?.Walk?.play()
        } else {
            actions?.Idle?.play()
        }
        updatePhysics()
    }
    const render = () => {
        requestAnimationFrame(render)
        cannonDebugger.update();
        if (!model) return; // 如果 model 未加载，跳过渲染
        // 更新物理引擎和同步模型
        animate()
        renderer.render(scene, camera)
    }
    render()
}

onMounted(() => {
    init()
})

</script>

<template>
    <div ref="canvas" class="canvas"></div>
</template>

<style scoped lang="scss">
.canvas {
    width: 1000px;
    height: 800px;
}
</style>