import * as THREE from 'three'
import * as CANNON from 'cannon-es'
declare class CannonDebugger {
    constructor(scene: THREE.Scene, world: CANNON.World, options?: object);
  
    update(): void;
    destroy(): void;
}
class Resize{
    constructor(scene:THREE.Scene,camera:THREE.PerspectiveCamera,renderer:THREE.WebGLRenderer,cannonDebugger?:CannonDebugger){
        function render(){
            requestAnimationFrame(render)
            cannonDebugger?.update()
            renderer.render(scene,camera)
        }
        render()
    }
}

export default Resize