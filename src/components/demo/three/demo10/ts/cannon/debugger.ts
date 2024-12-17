import CannonDebugger from 'cannon-es-debugger'
import * as THREE from 'three'
import * as CANNON from 'cannon-es'
function createCannonDebugger(scene:THREE.Scene,world:CANNON.World){
    const cannonDebugger = CannonDebugger(scene, world)
    return cannonDebugger
}

export default createCannonDebugger