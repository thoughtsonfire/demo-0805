import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const world = new URL('@/assets/mode/game/world.glb', import.meta.url).href

function addThreeWorld(scene:THREE.Scene){
    const loader = new GLTFLoader()
    loader.load(world,(gltf)=>{
        let mode = gltf.scene
        mode.position.set(0,0,0)
        scene.add(mode)
    })
}

export default addThreeWorld