import * as THREE from 'three'

function createPointLight(){
    const pointLight = new THREE.PointLight(0xffffff, 2.0);
    pointLight.decay = 0.0;//设置光源不随距离衰减   如果使用默认衰减2.0，不同版本可能有差异
    //点光源位置
    pointLight.position.set(200, 200, 0);
    return pointLight
}

function createAmbientLight(){
    const ambientLight = new THREE.AmbientLight(0x404040, 1); // 添加柔和的环境光
    return ambientLight
}

function addLight(scene:THREE.Scene){
    const pointLight = createPointLight()
    const ambientLight = createAmbientLight()
    pointLight.name = 'pointLight';  // 设置一个唯一名称
    scene.add(pointLight,ambientLight)
}

export default addLight