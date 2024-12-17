import * as THREE from 'three'
function createCamera(){
    const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1010);
    camera.position.set(0,20,15)

    return camera
}

export default createCamera