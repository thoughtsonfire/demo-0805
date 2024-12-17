import * as THREE from 'three'
import Stats from 'three/addons/libs/stats.module.js';

import createScene from './base/scene'
import createCamera from './base/camera'
import addLight from './base/light'
import createRenderer from './base/render'
import * as resize from './system/resize'
import gameInit from './main/game';
const stats = new Stats()
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
// stats.dom.style.top = "20%"
document.body.appendChild(stats.dom);
class ThreeApp {
    constructor(container:HTMLDivElement){
        console.log('场景初始化');
        this.container = container
        this.init()
        gameInit(this)
    }

    container:HTMLDivElement
    scene:THREE.Scene|null|undefined
    camera:THREE.PerspectiveCamera|null|undefined
    renderer: THREE.WebGLRenderer|null|undefined
    tick:Function | null | undefined
    player:THREE.Group<THREE.Object3DEventMap>|null|undefined
    mixer:THREE.AnimationMixer|null|undefined
    allActions:|Object|Record<string, THREE.AnimationAction>|null|undefined
    currentAction:|Object|Record<string, THREE.AnimationAction>|null|undefined
    control:any
    init(){
        this.scene = createScene()
        this.camera = createCamera()
        addLight(this.scene)
        this.renderer = createRenderer(this.container)
        resize.resizeEventListener(this.camera, this.renderer)
    }
    render(){
        const clock = new THREE.Clock()
        let previousTime = 0
        const STEPS_PER_FRAME = 5
        this.tick=()=>{
            stats.update()
            const deltaTime = Math.min(0.05,clock.getDelta())/ STEPS_PER_FRAME
            const elapsedTime = clock.getElapsedTime()
            const mixerUpdateDelta = elapsedTime - previousTime
            previousTime = elapsedTime


            this.renderer!.render(this.scene!, this.camera!)
            requestAnimationFrame((this.tick) as FrameRequestCallback)
        }
        this.tick()
    }
    clear() {
        console.log("清理内存")
        location.reload()
        resize.clear()
        this.tick = null
        this.scene = null
        this.camera = null
        this.renderer!.dispose()
        this.control!.dispose()
    }
}

export default ThreeApp