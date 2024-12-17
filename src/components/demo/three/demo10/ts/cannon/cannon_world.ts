import * as CANNON from 'cannon-es'

function createCannonWorld(){
    const cannonWorld = new CANNON.World()
    return cannonWorld
}

export default createCannonWorld