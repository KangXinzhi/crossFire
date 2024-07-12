import {PointerLockControls, Sky} from "@react-three/drei";
import {Physics, RigidBody} from "@react-three/rapier";
import Ground from "./components/Ground";
import Player from "./components/Player";

import {WeaponModel} from "./model/WeaponModel";

export const App = () => {
    return (
        <>
            <PointerLockControls />
            <Sky sunPosition={[100, 20, 100]}/>
             {/**定向光 */}
            <ambientLight intensity={1.5} />

            {/**定向光展示阴影 */}
            <directionalLight
                castShadow
                intensity={.8}
                position={[50, 50, 0]} />
            <Physics gravity={[0, -20, 0]}>
                <Ground />
                <Player />
                <RigidBody>
                    <mesh castShadow receiveShadow position={[0, 3, -5]}>
                        <boxGeometry />
                    </mesh>
                </RigidBody>
            </Physics>
            <group position={[3, 1, -2]}>
                <WeaponModel />
            </group>
        </>
    )
}

export default App;
