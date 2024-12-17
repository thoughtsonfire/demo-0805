import * as THREE from 'three'

function createRender(){
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth,window.innerHeight)
    document.body.appendChild(renderer.domElement)

    return renderer
}

export default createRender