import sizes from "./sizes";
import * as THREE from 'three'
let camera:THREE.PerspectiveCamera,renderer:THREE.WebGLRenderer
function resizeEvent(){
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    camera.aspect = sizes.width/sizes.height
    camera.updateProjectionMatrix()

    renderer.setSize(sizes.width,sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
}

function resizeEventListener(_camera:THREE.PerspectiveCamera,_renderer:THREE.WebGLRenderer){
    camera = _camera
    renderer = _renderer
    window.addEventListener('resize',resizeEvent)
}

function clear(){
    window.removeEventListener("resize", resizeEvent)
}

export { resizeEventListener, clear }