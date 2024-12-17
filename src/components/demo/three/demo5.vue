<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Mesh } from 'three'
import * as THREE from 'three'
// 引入轨道控制器扩展库OrbitControls.js
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
//引入性能监视器stats.js
import Stats from 'three/addons/libs/stats.module.js';
// 引入dat.gui.js的一个类GUI
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

const threeBox = ref<HTMLBodyElement>()
const init = () => {
    // 创建3D场景对象Scene
    const scene = new THREE.Scene()
    //创建一个长方体几何对象Geometry
    const geometry = new THREE.BoxGeometry(100, 60, 20)
    //创建一个材质对象Material
    const material = new THREE.MeshPhongMaterial({
        color: 0xff0000,//0xff0000设置材质颜色为红色
        shininess: 20, //高光部分的亮度，默认30
        transparent: true,//开启透明
        opacity: 0.5,//设置透明度
        specular: 0x444444, //高光部分的颜色
    })
    // 两个参数分别为几何体geometry、材质material
    const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    //设置网格模型在三维空间中的位置坐标，默认是坐标原点
    mesh.position.set(100, 0, 0);
    scene.add(mesh);

    // 实例化一个透视投影相机对象
    const camera = new THREE.PerspectiveCamera();

    //相机在Three.js三维坐标系中的位置
    // 根据需要设置相机位置具体值
    camera.position.set(-100, 15, 10);
    camera.lookAt(10, 10, 10);
    // 定义相机输出画布的尺寸(单位:像素px)
    const width = 800; //宽度
    const height = 500; //高度
    // 30:视场角度, width / height:Canvas画布宽高比, 1:近裁截面, 3000：远裁截面
    camera.fov = 75;  // 设置视场角
    camera.aspect = width / height; // 设置纵横比
    camera.near = 1;  // 设置近裁剪面
    camera.far = 3000;  // 设置远裁剪面

    // 更新投影矩阵 (设置参数后需要调用此方法)
    camera.updateProjectionMatrix();


    // 创建渲染器对象
    const renderer = new THREE.WebGLRenderer();
    renderer.antialias = true   //渲染器锯齿属性.antialias
    renderer.setSize(width, height); //设置three.js渲染区域的尺寸(像素px)
    renderer.render(scene, camera); //执行渲染操作
    threeBox.value!.appendChild(renderer.domElement);

    //创建stats对象
    const stats = new Stats();
    //stats.domElement:web页面上输出计算结果,一个div元素，
    threeBox.value!.appendChild(stats.domElement);
    // stats.domElement显示：渲染帧率  刷新频率,一秒渲染次数 
    stats.setMode(0);//默认模式
    //stats.domElement显示：渲染周期 渲染一帧多长时间(单位：毫秒ms)
    // stats.setMode(1);
    // AxesHelper：辅助观察的坐标系
    const axesHelper = new THREE.AxesHelper(150);
    scene.add(axesHelper);

    //点光源：两个参数分别表示光源颜色和光照强度
    // 参数1：0xffffff是纯白光,表示光源颜色
    // 参数2：1.0,表示光照强度，可以根据需要调整
    const pointLight = new THREE.PointLight(0xffffff, 10.0);
    pointLight.decay = 0.0;//设置光源不随距离衰减   如果使用默认衰减2.0，不同版本可能有差异
    //点光源位置
    pointLight.position.set(10, 50, -20);//点光源放在x轴上
    scene.add(pointLight); //点光源添加到场景中

    // 光源辅助观察
    const pointLightHelper = new THREE.PointLightHelper(pointLight, 10);
    scene.add(pointLightHelper);

    // 添加环境光
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // 添加柔和的环境光
    scene.add(ambientLight);

    // 平行光
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    // 设置光源的方向：通过光源position属性和目标指向对象的position属性计算
    directionalLight.position.set(80, 100, 50);
    // 方向光指向对象网格模型mesh，可以不设置，默认的位置是0,0,0
    directionalLight.target = mesh;
    scene.add(directionalLight);

    // DirectionalLightHelper：可视化平行光
    const dirLightHelper = new THREE.DirectionalLightHelper(directionalLight, 5, 0xff0000);
    scene.add(dirLightHelper);

    // 设置相机控件轨道控制器OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    // 如果OrbitControls改变了相机参数，重新调用渲染器渲染三维场景
    controls.addEventListener('change', function () {
        renderer.render(scene, camera); //执行渲染操作
    });//监听鼠标、键盘事件
    // 渲染循环
    const clock = new THREE.Clock();


    // 随机创建大量的模型,测试渲染性能
    // const num = 1000; //控制长方体模型数量
    // for (let i = 0; i < num; i++) {
    //     const geometry = new THREE.BoxGeometry(5, 5, 5);
    //     const material = new THREE.MeshLambertMaterial({
    //         color: 0x00ffff
    //     });
    //     const mesh = new THREE.Mesh(geometry, material);
    //     // 随机生成长方体xyz坐标
    //     const x = (Math.random() - 0.5) * 200
    //     const y = (Math.random() - 0.5) * 200
    //     const z = (Math.random() - 0.5) * 200
    //     mesh.position.set(x, y, z)
    //     scene.add(mesh); // 模型对象插入场景中
    // }

    // 不同硬件设备的屏幕的设备像素比window.devicePixelRatio值可能不同
    console.log('查看当前屏幕设备像素比', window.devicePixelRatio);
    // 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x444444, 1); //设置背景颜色

    // 实例化一个gui对象
    const gui = new GUI();
    //改变交互界面style属性
    gui.domElement.style.right = '0px';
    gui.domElement.style.width = '300px';
    //创建一个对象，对象属性的值可以被GUI库创建的交互界面改变
    const obj = {
        x: 30,
        y: 60,
        z: 300,
    };
    // gui界面上增加交互界面，改变obj对应属性
    gui.add(obj, 'x', 0, 100);
    gui.add(obj, 'y', 0, 50);
    gui.add(obj, 'z', 0, 60);
    // setInterval(function () {
    //     console.log('x', obj.x);
    // }, 10)

    gui.add(mesh.position, 'x', 0, 180);
    gui.add(mesh.position, 'y', 0, 180);
    gui.add(mesh.position, 'z', 0, 180);

    const obj1 = {
        color: 0x00ffff,
    };
    // .addColor()生成颜色值改变的交互界面
    gui.addColor(obj1, 'color').onChange(function (value) {
        mesh.material.color.set(value);
    });

    // 参数3、参数4数据类型：数字(拖动条)
    const obj2 = {
        x: 30,
    }
    gui.add(obj2, 'x', 0, 180).onChange(function (value) {
        mesh.position.x = value;
    });

    const obj3 = {
        scale: 0,
    };
    gui.add(obj3, 'scale', {
        left: -100,
        center: 0,
        right: 100
        // 左: -100,//可以用中文
        // 中: 0,
        // 右: 100
    }).name('位置选择').onChange(function (value) {
        mesh.position.x = value;
    });

    const obj4 = {
        bool: false,
    };
    // 改变的obj属性数据类型是布尔值，交互界面是单选框
    gui.add(obj4, 'bool').name('是否旋转');

    //材质子菜单
    const obj5 = {
        color: 0x00ffff,// 材质颜色
        specular: 0x444444
    }
    const matFolder = gui.addFolder('材质');
    matFolder.close();
    // 材质颜色color
    matFolder.addColor(obj5, 'color').onChange(function (value) {
        material.color.set(value);
    });
    // 材质高光颜色specular
    matFolder.addColor(obj5, 'specular').onChange(function (value) {
        material.specular.set(value);
    });

    //光源菜单
    const light = gui.addFolder('光源')
    light.close()
    // 环境光子菜单
    const ambientFolder = light.addFolder('环境光');
    ambientFolder.add(ambientLight, 'intensity', 0, 2);

    //平行光子菜单
    const dirFolder = light.addFolder('平行光');
    // 平行光强度
    dirFolder.add(directionalLight, 'intensity', 0, 2);
    // 平行光位置
    dirFolder.add(directionalLight.position, 'x', -400, 400);
    dirFolder.add(directionalLight.position, 'y', -400, 400);
    dirFolder.add(directionalLight.position, 'z', -400, 400);


    // 你可以通过BufferGeometry自定义任何几何形状，具体一点说就是定义顶点数据
    //创建一个空的几何体对象
    const customizeGeo = new THREE.BufferGeometry();
    //类型化数组创建顶点数据
    const vertices = new Float32Array([
        0, 0, 0, //顶点1坐标
        50, 0, 0, //顶点2坐标
        0, 100, 0, //顶点3坐标
        0, 0, 10, //顶点4坐标
        0, 0, 100, //顶点5坐标
        50, 0, 10, //顶点6坐标
    ]);
    // 创建属性缓冲区对象
    //3个为一组，表示一个顶点的xyz坐标
    const attribue = new THREE.BufferAttribute(vertices, 3);
    // 设置几何体attributes属性的位置属性
    customizeGeo.attributes.position = attribue;
    // 点渲染模式
    const customizeMaterial = new THREE.PointsMaterial({
        color: 0xffff00,
        size: 10.0 //点对象像素尺寸
    });
    const points = new THREE.Points(customizeGeo, customizeMaterial); //点模型对象
    scene.add(points)

    // 创建线模型对象
    const lineGeo = new THREE.BufferGeometry();
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0xff0000 //线条颜色
    })
    lineGeo.attributes.position = attribue;
    const line = new THREE.LineLoop(lineGeo, lineMaterial);
    scene.add(line)

    //网格模型
    const meshGeo = new THREE.BufferGeometry();
    const meshMaterial = new THREE.MeshLambertMaterial({
        color: 0x0000ff, //材质颜色
        side: THREE.DoubleSide, //两面可见
    });
    const meshVertices = new Float32Array([
        0, 0, 0, //顶点1坐标
        80, 0, 0, //顶点2坐标
        80, 80, 0, //顶点3坐标
        0, 80, 0, //顶点4坐标
    ]);
    //3个为一组，表示一个顶点的xyz坐标
    const meshAttribue = new THREE.BufferAttribute(meshVertices, 3);
    const indexes = new Uint16Array([
        // 下面索引值对应顶点位置数据中的顶点坐标
        0, 1, 2, 0, 2, 3,
    ])
    meshGeo.index = new THREE.BufferAttribute(indexes, 1);
    //顶点法线数据
    // 矩形平面，无索引，两个三角形，6个顶点
    // 每个顶点的法线数据和顶点位置数据一一对应
    const normals = new Float32Array([
        0, 0, 1, //顶点1法线( 法向量 )
        0, 0, 1, //顶点2法线
        0, 0, 1, //顶点3法线
        0, 0, 1, //顶点4法线
    ]);
    meshGeo.attributes.normal = new THREE.BufferAttribute(normals, 3);
    meshGeo.attributes.position = meshAttribue
    const meshBox = new THREE.Mesh(meshGeo, meshMaterial)
    scene.add(meshBox)

    const meshGeo1 = new THREE.PlaneGeometry(100, 50); //矩形平面几何体
    console.log('几何体', meshGeo1);
    console.log('顶点位置数据', meshGeo1.attributes.position);
    console.log('顶点索引数据', meshGeo1.index);

    // 几何体xyz三个方向都放大2倍
    geometry.scale(2, 2, 2);
    // 几何体沿着x轴平移50
    geometry.translate(50, 0, 0);
    // 几何体绕着x轴旋转45度
    geometry.rotateX(Math.PI / 4);

    const v3 = new THREE.Vector3(1, 1, 1)
    //向量Vector3对象表示方向
    const axis = new THREE.Vector3(1, 1, 1);
    axis.normalize(); //向量归一化
    //沿着axis轴表示方向平移100
    mesh.translateOnAxis(axis, 100);
    //x轴方向放大2倍
    mesh.scale.x = 2.0;
    //网格模型xyz方向分别缩放0.5,1.5,2倍
    mesh.scale.set(0.5, 1.5, 2)

    //绕y轴的角度设置为60度
    mesh.rotation.y += Math.PI / 3;
    // //绕y轴的角度增加60度
    // mesh.rotation.y += Math.PI / 3;
    //绕y轴的角度减去60度
    // mesh.rotation.y -= Math.PI / 3;

    mesh.rotateX(Math.PI / 4);//绕x轴旋转π/4

    const geo10 = new THREE.BoxGeometry(20, 20, 20)
    const material10 = new THREE.MeshLambertMaterial({ color: 0x00ffff })
    const group10 = new THREE.Group()
    const mesh10_1 = new THREE.Mesh(geo10, material10)
    const mesh10_2 = new THREE.Mesh(geo10, material10)
    mesh10_2.translateX(25)
    group10.add(mesh10_1)
    group10.add(mesh10_2)
    // group.add(mesh1,mesh2);//add方法可以同时插入多个子对象
    //沿着Y轴平移mesh1和mesh2的父对象，mesh1和mesh2跟着平移
    group10.translateY(100);
    //父对象旋转，子对象跟着旋转
    group10.rotateY(Math.PI / 6)
    //父对象缩放，子对象跟着缩放
    group10.scale.set(4, 4, 4);
    scene.add(group10)

    const group11 = new THREE.Group()
    group11.name = '小区房子'
    const group11_1 = new THREE.Group()
    group11_1.name = '高层'
    for (let i = 0; i < 5; i++) {
        const geo = new THREE.BoxGeometry(20, 60, 10)
        const material = new THREE.MeshLambertMaterial({
            color: 0x00ffff
        })
        const mesh = new THREE.Mesh(geo, material)
        mesh.position.x = i * 30
        group11_1.add(mesh)
        mesh.name = i + 1 + '号楼'
    }
    group11_1.position.y = 30
    const group11_2 = new THREE.Group()
    group11_2.name = '洋房'
    for (let i = 0; i < 5; i++) {
        const geometry = new THREE.BoxGeometry(20, 30, 10)
        const material = new THREE.MeshLambertMaterial({
            color: 0x00ffff
        })
        const mesh = new THREE.Mesh(geometry, material)
        mesh.position.x = i * 30
        group11_2.add(mesh)
        mesh.name = i + 6 + '号楼'
    }
    group11_2.position.z = 50
    group11_2.position.y = 15
    group11.add(group11_1, group11_2)
    group11.position.set(-50, 0, -25)
    group11.traverse((obj) => {
        console.log('所有模型节点的名字', obj.name);
        // obj.isMesh：if判断模型对象obj是不是网格模型'Mesh'
        if (obj instanceof Mesh) {//判断条件也可以是obj.type === 'Mesh'
            obj.material.color.set(0xffff00);
            const worldPosition = new THREE.Vector3()
            obj.getWorldPosition(worldPosition)
            const meshAxesHelper = new THREE.AxesHelper(50);
            obj.add(meshAxesHelper)
            console.log('世界坐标', worldPosition);
            console.log('本地坐标', obj.position);
        }
    })
    // 返回名.name为"4号楼"对应的对象

    scene.add(group11)
    const nameNode = scene.getObjectByName("4号楼");
    if (nameNode instanceof Mesh) {
        nameNode?.material.color.set(0xff0000);
    }

    const geometry_texture = new THREE.SphereGeometry(25, 25, 25); //球体
    //纹理贴图加载器TextureLoader
    const texLoader = new THREE.TextureLoader();
    const texture_img = new URL('@/assets/imgs/logo.png', import.meta.url).href
    // .load()方法加载图像，返回一个纹理对象Texture
    const texture = texLoader.load(texture_img);
    texture.colorSpace = THREE.SRGBColorSpace;//设置为SRGB颜色空间
    console.log(texture, '-------------------------------------------');
    const material_textture = new THREE.MeshLambertMaterial({
        // 设置纹理贴图：Texture对象作为材质map属性的属性值
        map: texture,//map表示材质的颜色贴图属性
        side: THREE.DoubleSide,
    })
    const mesh_texture = new Mesh(geometry_texture, material_textture)
    scene.add(mesh_texture)

    const geometry_texture_1 = new THREE.PlaneGeometry(200, 100)
    console.log('uv', geometry_texture_1.attributes.uv);
    /**纹理坐标0~1之间随意定义*/
    const uvs = new Float32Array([
        0, 0, //图片左下角
        0.5, 0, //图片右下角
        0.5, 0.5, //图片右上角
        0, 0.5, //图片左上角
    ]);
    // 设置几何体attributes属性的位置normal属性
    geometry_texture_1.attributes.uv = new THREE.BufferAttribute(uvs, 2); //2个为一组,表示一个顶点的纹理坐标
    const mesh_texture_1 = new Mesh(geometry_texture_1, material_textture)
    scene.add(mesh_texture_1)

    const render = () => {
        texture.offset.x += 0.0001;//设置纹理动画：偏移量根据纹理和动画需要，设置合适的值
        //requestAnimationFrame循环调用的函数中调用方法update(),来刷新时间
        stats.update();
        const spt = clock.getDelta() * 1000;//毫秒
        // console.log('两帧渲染时间间隔(毫秒)', spt);
        // console.log('帧率FPS', 1000 / spt);
        renderer.render(scene, camera); //执行渲染操作
        if (obj4.bool) {
            mesh.rotateY(0.01);//每次绕y轴旋转0.01弧度
        }
        requestAnimationFrame(render)
    }
    render()
}
onMounted(() => {
    init()
})
</script>

<template>
    <div ref="threeBox"></div>
</template>

<style scoped></style>