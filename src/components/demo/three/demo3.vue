<template></template>
<script setup>
import * as THREE from 'three'
import { onMounted } from 'vue'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入connon引擎
import * as CANNON from 'cannon-es'
// 创建物理世界
const world = new CANNON.World()
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	1000
)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
const controls = new OrbitControls(camera, renderer.domElement)
scene.background = new THREE.Color(0x000000)
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap
renderer.outputEncoding = THREE.sRGBEncoding
// 设置时钟
const clock = new THREE.Clock()
onMounted(() => {
	init()
})
function init() {
	camera.position.set(0, 5, 10)
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
	// 创建球和平面
	const sphereGeometry = new THREE.SphereGeometry(1, 26, 26) // 球的几何形状
	const sphereMaterial = new THREE.MeshStandardMaterial()
	// 定义两个材料
	const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
	sphere.castShadow = true // 阴影
	sphere.position.set(0, 5, 0.5) // 球的位置
	scene.add(sphere)
	const floorMaterial = new THREE.MeshStandardMaterial({
		// map: texture,
		color: 0xe4e4e4,
		transparent: true,
		opacity: 0.5,
	})
	const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), floorMaterial)
	floor.position.set(0, -5, 0)
	floor.rotation.x = -Math.PI / 2
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
		shape: sphereShape,
		position: new CANNON.Vec3(0, 5, 0.5),
		//   小球质量
		mass: 1,
		//   物体材质
		material: sphereWorldMaterial,
	})
	// 将物体添加至物理世界
	world.addBody(sphereBody)
	//添加环境光和平行光
	const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
	scene.add(ambientLight)
	const dirLight = new THREE.DirectionalLight(0xffffff, 0.5)
	dirLight.castShadow = true // 阴影
	scene.add(dirLight)
	// 开启场景中的阴影贴图
	renderer.shadowMap.enabled = true
	// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
	// controls.enableDamping = true
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
			friction: 0.1,
			restitution: 0.6,
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
		renderer.render(scene, camera)
		//   渲染下一帧的时候就会调用render函数
		requestAnimationFrame(render)
	}
 
	render()
}
</script>