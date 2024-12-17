import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
const boxman = new URL('@/assets/mode/game/boxman.glb', import.meta.url).href

function addThreeBoxman(scene:THREE.Scene){
    const loader = new GLTFLoader()
    loader.load(boxman,(gltf)=>{
        let mode = gltf.scene
        scene.add(mode)
        mode.position.y=15
    })
}

export default addThreeBoxman