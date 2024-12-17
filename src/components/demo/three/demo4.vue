<script setup lang="ts">
import * as THREE from 'three'
// 引入扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// 导入connon引擎
import * as CANNON from 'cannon-es'

import { onMounted, ref } from 'vue'
const RobotExpressive = ref<string>(new URL('@/assets/mode/RobotExpressive.glb', import.meta.url).href)

// 创建物理世界
const world = new CANNON.World()
// 初始化 Three.js 场景
const scene = new THREE.Scene()
// 创建一个透视相机
const camera = new THREE.PerspectiveCamera(
    75,//相机视锥体竖直方向视野角度
    window.innerWidth / window.innerHeight,//相机视锥体水平方向和竖直方向长度比，一般设置为Canvas画布宽高比width / height
    0.1,//相机视锥体近裁截面相对相机距离
    1000//	相机视锥体远裁截面相对相机距离，far-near构成了视锥体高度方向
)
// Three.js 渲染器
const renderer = new THREE.WebGLRenderer(
    {
        antialias: true,// 开启抗锯齿
        alpha: true // 开启透明背景
    }
)
//控制器，用于让用户通过鼠标操作（如拖动、滚动、缩放等）来控制 3D 场景中的相机视角
const controls = new OrbitControls(camera, renderer.domElement)
//背景色
scene.background = new THREE.Color(0x000000)
renderer.shadowMap.enabled = true //启用阴影映射
renderer.shadowMap.type = THREE.PCFSoftShadowMap //设置阴影类型
renderer.outputEncoding = THREE.sRGBEncoding    //设置输出编码

// 设置时钟
const clock = new THREE.Clock()

const init = () => {
    let model //模型
    let modelBody //模型网格
    let modelBodies: Array<any> //模型网格数组
    let isModelLoaded = false;
    let isBodyCreated = false;
    //相机位置xyz坐标
    camera.position.set(0, 5, 10)
    //设置three.js渲染区域的尺寸(像素px)
    renderer.setSize(window.innerWidth, window.innerHeight)
    //渲染器WebGLRenderer通过属性.domElement可以获得渲染方法.render()生成的Canvas画布，.domElement本质上就是一个HTML元素：Canvas画布。
    document.body.appendChild(renderer.domElement)
    //球的属性
    const sphereGeometry = new THREE.SphereGeometry(
        1,//表示球体的半径。这里的 1 是球体的半径，即球的大小。
        26,//表示横向（水平）细分的分段数。这个值越大，球体的细节越多，表面越平滑。
        26//表示纵向（垂直）细分的分段数。和横向分段一样，纵向分段数决定了球体表面的平滑度。
    ) // 球的几何形状
    const sphereMaterial = new THREE.MeshStandardMaterial()//创建球体材质
    //创建球体网格
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.castShadow = true // 阴影
    sphere.position.set(0, 5, 0.5) // 球的位置
    scene.add(sphere)
    //导入模型
    const loader = new GLTFLoader();
    loader.load(
        RobotExpressive.value, // 模型路径
        (gltf) => {
            console.log("Model loaded:", gltf);  // 确认模型已加载
            model = gltf.scene;  // 获取加载的模型
            // 将模型添加到场景
            scene.add(model);
            // 创建物理体的容器
            modelBodies = [];
            // 遍历模型中的所有子对象 (meshes)
            model.traverse(function (child) {
                if (child.isMesh) {
                    // 获取当前子对象的边界框
                    const box = new THREE.Box3().setFromObject(child);
                    const size = new THREE.Vector3();
                    box.getSize(size); // 获取边界框的大小

                    // 创建物理体形状 (使用CANNON.Box)
                    const shape = new CANNON.Box(new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2));

                    // 设置物理体的位置，位置以模型的子对象为基准
                    const position = new CANNON.Vec3(child.position.x, child.position.y, child.position.z);
                    const mass = 1; // 设置质量 (如果是静态物体可以设为0)

                    // 创建物理体
                    modelBody = new CANNON.Body({
                        mass: mass,
                        position: position
                    });

                    // 添加形状到物理体
                    modelBody.addShape(shape);

                    // 将物理体添加到物理世界中
                    world.addBody(modelBody);

                    // 记录这个物理体（稍后更新位置）
                    modelBodies.push({ body: modelBody, mesh: child });
                }
            });

        }
    )
    // 地面属性
    const floorMaterial = new THREE.MeshStandardMaterial({
        // map: texture,
        color: 0xe4e4e4,//颜色
        transparent: true,//支持透明度，这意味着可以通过设置 opacity 来控制材质的透明程度。
        opacity: 0.5,
    })//创建地板材质
    //创建地板网格
    const floor = new THREE.Mesh(
        new THREE.PlaneGeometry(20, 20),// 20x20 单位大小的矩形平面
        floorMaterial  //材质
    )
    floor.position.set(0, -5, 0)//地板位置
    floor.rotation.x = -Math.PI / 2//floor.rotation.x 设置了地面的旋转角度。-Math.PI / 2 表示将地面绕 X 轴旋转 90 度。
    floor.receiveShadow = true // 接收阴影
    scene.add(floor)
    // 设置物理世界的重力
    world.gravity.set(0, -9.8, 0)
    // 创建物理小球形状
    const sphereShape = new CANNON.Sphere(1)
    //设置物体材质
    // const sphereWorldMaterial = new CANNON.Material()
    const sphereWorldMaterial = new CANNON.Material('sphereMaterial')
    const groundWorldMaterial = new CANNON.Material('groundMaterial')
    // 创建物理世界的物体
    const sphereBody = new CANNON.Body({
        shape: sphereShape,// 物体的形状
        position: new CANNON.Vec3(0, 5, 0.5),// 物体的初始位置
        mass: 1,//小球质量
        material: sphereWorldMaterial, //   物体材质
    })
    // 将物体添加至物理世界
    world.addBody(sphereBody)
    //添加环境光
    const ambientLight = new THREE.AmbientLight(
        0xffffff,//颜色值
        0.5 // 强度值
    )
    scene.add(ambientLight)
    //平行光
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
    dirLight.castShadow = true // 阴影
    scene.add(dirLight)
    // 开启场景中的阴影贴图
    renderer.shadowMap.enabled = true
    // 物理世界创建地面
    const floorShape = new CANNON.Plane()
    const floorBody = new CANNON.Body()
    floorBody.material = groundWorldMaterial
    // 当质量为0的时候，可以使得物体保持不动
    floorBody.mass = 0
    floorBody.addShape(floorShape)
    // 地面位置
    floorBody.position.set(0, -5, 0)
    // 旋转地面的位置
    floorBody.quaternion.setFromAxisAngle(
        new CANNON.Vec3(1, 0, 0),
        -Math.PI / 2
    )
    world.addBody(floorBody)
    //创建联系材质
    const concretePlasticMaterial = new CANNON.ContactMaterial(
        sphereWorldMaterial,
        groundWorldMaterial,
        {
            friction: 0.1,//摩擦力
            restitution: 0.6,//弹性反弹
        }
    )
    //添加联系材质
    world.addContactMaterial(concretePlasticMaterial)
    function render() {
        let deltaTime = clock.getDelta()
        // 更新物理引擎里世界的物体
        world.step(1 / 120, deltaTime) // 更新
        controls.update()
        sphere.position.copy(sphereBody.position) // 渲染引擎复制物理引擎中的数据

        // 同步每个物理体的位置和旋转
        modelBodies?.forEach(function (item) {
            item.mesh.position.copy(item.body.position);
            item.mesh.rotation.setFromQuaternion(item.body.quaternion);
        });
        renderer.render(scene, camera)
        //   渲染下一帧的时候就会调用render函数
        requestAnimationFrame(render)
    }

    render()
}

onMounted(() => {
    init()
})
</script>

<template>

</template>

<style scoped></style>