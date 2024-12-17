import * as THREE from 'three'
import { OrbitControls } from "three/examples/jsm/Addons.js";

function addControls(scene:THREE.Scene,camera:THREE.PerspectiveCamera,renderer:THREE.WebGLRenderer){
    const controls = new OrbitControls(camera,renderer.domElement)
    controls.addEventListener('change',()=>{
        renderer.render(scene,camera)
    })
}

export default addControls