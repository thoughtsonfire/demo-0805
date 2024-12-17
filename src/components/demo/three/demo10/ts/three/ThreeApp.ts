import * as THREE from 'three'
import * as CANNON from 'cannon-es'

import createScene from './base/scene'
import createCamera from './base/camera'
import createRender from './base/render'
import addLight from './base/light'
import addControls from './base/controls'
import Resize from './system/resize'
import addThreeWorld from './main/world'
import addThreeBoxman from './main/boxman'
import addHelper from './base/helper'
import createCannonDebugger from '../cannon/debugger'
import createCannonWorld from '../cannon/cannon_world'
class ThreeApp{
    public scene:THREE.Scene
    public camera:THREE.PerspectiveCamera
    public renderer:THREE.WebGLRenderer

    public cannonWorld:CANNON.World
    constructor(){
        this.scene = createScene()
        this.camera = createCamera()
        this.renderer = createRender()
        addLight(this.scene)
        addControls(this.scene,this.camera,this.renderer)
        addThreeWorld(this.scene)
        addThreeBoxman(this.scene)
        addHelper(this.scene)
        this.cannonWorld = createCannonWorld()
        const cannonDebugger = createCannonDebugger(this.scene,this.cannonWorld)
        const resize = new Resize(this.scene,this.camera,this.renderer)
    }
}

export default ThreeApp