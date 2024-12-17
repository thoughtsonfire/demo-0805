import * as THREE from 'three'
import sizes from '../system/sizes'

function createRenderer(conatiner:HTMLDivElement){
    const renderer = new THREE.WebGLRenderer({
        canvas:conatiner,
        antialias:true
    })
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.VSMShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.setSize(sizes.width,sizes.height)
    //像素比（pixelRatio）1或2
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    return renderer
}

export default createRenderer