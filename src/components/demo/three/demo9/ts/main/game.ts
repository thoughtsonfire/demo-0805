import * as THREE from 'three'
import { Octree } from 'three/examples/jsm/Addons.js'
import { OctreeHelper } from 'three/examples/jsm/Addons.js'
import { Capsule } from 'three/examples/jsm/Addons.js'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { DRACOLoader } from 'three/examples/jsm/Addons.js'

import ThreeApp from '../ThreeApp'
import { debugObject, gui } from '../system/gui'
import CapsuleHelper from './CapsuleHelper'

const Xbot = new URL('@/assets/mode/Xbot.glb', import.meta.url).href
const CollisionWorld = new URL('@/assets/mode/collision-world.glb', import.meta.url).href
let that:ThreeApp
function gameInit(th:ThreeApp){
    console.log("gameInit");
    
    that = th
    
    const loader = new GLTFLoader()
    loader.load(Xbot,(gltf)=>{
        that.player = gltf.scene
        that.scene?.add(that!.player)
        that.player.add((that!.camera) as THREE.PerspectiveCamera)

        // 启用阴影
        that.player.traverse( function ( object ) {
            if ( object instanceof THREE.Mesh ) object.castShadow = true;
        } );

        // 关键帧动画
        const animations = gltf.animations;
        that.mixer = new THREE.AnimationMixer(that.player);
        that.allActions= {}
        for (const clip of animations) {
            const action = that.mixer.clipAction(clip)
            if(clip.name === 'idle'){
                action.weight = 1.0 //默认播放Idle对应的休息动画
            }else{
                action.weight = 0.0
            }
            action.play();
            (that.allActions as Record<string, THREE.AnimationAction>)[clip.name] = action
        }
        that.currentAction = (that.allActions as Record<string, THREE.AnimationAction>)['idle']
    })

    loader.load(CollisionWorld,(gltf)=>{
        that.scene?.add(gltf.scene);
    })

}

export default gameInit