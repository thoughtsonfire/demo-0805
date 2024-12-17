import { Scene, Color, Fog} from 'three'

function createScene(){
    const scene = new Scene()

    scene.background = new Color( 0x88ccee )
    scene.fog = new Fog( 0x88ccee, 0, 50 )
    // new Fog() 是创建雾霾效果的构造函数。
    // 第一个参数：0x88ccee 是雾霾的颜色，使用的是十六进制值。这里的颜色是淡蓝色。
    // 第二个参数：0 是雾霾的起始距离，表示从距离摄像机多远的地方开始有雾霾效果。在这个例子中是从摄像机的位置开始就有雾霾。
    // 第三个参数：50 是雾霾的结束距离，表示到达这个距离时，雾霾达到最大浓度。在这个例子中，50 是雾霾效果的最大范围。

    return scene;
}

export { createScene }
export default createScene