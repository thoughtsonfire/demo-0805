import { PerspectiveCamera,Vector3 } from "three"
import sizes from "../system/sizes"
import { gui, debugObject } from "../system/gui"
function createCamera(){
    const camera = new PerspectiveCamera(70, sizes.width / sizes.height, 0.1, 1000)
    camera.rotation.order = 'YXZ'   //设置旋转轴的顺序
    const PerspectiveVectors = {
        first: new Vector3(0,1.7,0.3),  //第一视角
        third: new Vector3(0,2,-2)      //第三视角
    }
    camera.position.copy(PerspectiveVectors.third)
    camera.lookAt(0,1,0)
    gui.add(debugObject,"firstView").onChange(()=>{
        if(debugObject.firstView){
            camera.position.copy(PerspectiveVectors.first)
        }else{
            camera.position.copy(PerspectiveVectors.third)
        }
    })
    return camera
}   

export default createCamera