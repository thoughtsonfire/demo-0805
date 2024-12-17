import * as THREE from 'three'

function createFilrLight(){
    // HemisphereLight（半球光）
    // 0x8dc1de: 这是天空光的颜色，使用的是十六进制颜色值（浅蓝色）。
    // 0x00668d: 这是地面光的颜色，也是十六进制颜色值（深蓝色）。
    // 1.5: 这是光的强度。值越大，光源越亮，值越小则光源越暗。
    const fillLight = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 1.5)
    fillLight.position.set(2,1,1)
    return fillLight
}

function createDirectionLight(){
    //定向光 定向光的特点是光线平行并且没有衰减，光源的位置不会影响照射的结果
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 2.5 );
    directionalLight.position.set( - 5, 25, - 1 );
    directionalLight.castShadow = true;
    directionalLight.shadow.camera.near = 0.01;
    directionalLight.shadow.camera.far = 500;
    directionalLight.shadow.camera.right = 30;
    directionalLight.shadow.camera.left = - 30;
    directionalLight.shadow.camera.top	= 30;
    directionalLight.shadow.camera.bottom = - 30;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.radius = 4;
    directionalLight.shadow.bias = - 0.00006;
    return directionalLight
}

function addLight(scene:THREE.Scene){
    let fillLight = createFilrLight()
    let directionalLight = createDirectionLight()
    scene.add(fillLight)
    scene.add(directionalLight)
}

export default addLight