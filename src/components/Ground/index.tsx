import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import {CuboidCollider, RigidBody} from "@react-three/rapier";
import floorTexture from "@/assets/floor.png";

const Ground = () => {
    const texture = useTexture(floorTexture);
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    return (
        <RigidBody type="fixed" colliders={false}>
            <mesh receiveShadow position={[0, 0, 0]} rotation-x={-Math.PI / 2}>
                <planeGeometry args={[500, 500]} />
                <meshStandardMaterial map={texture} />
            </mesh>
            <CuboidCollider args={[500, 2, 500]} position={[0, -5, 0]}/>
        </RigidBody>
    );
}

export default Ground;