import * as THREE from 'three'

function createAxesHelper(scene:THREE.Scene){
    const axesHelper = new THREE.AxesHelper(5000)
    scene.add(axesHelper)
}

function createPointLightHelper(scene:THREE.Scene){
    const pointLightHelper = new THREE.PointLightHelper((scene.getObjectByName('pointLight') as THREE.PointLight),20)
    scene.add(pointLightHelper)
}

function addHelper(scene:THREE.Scene){
    createAxesHelper(scene)
    createPointLightHelper(scene)
}

export default addHelper