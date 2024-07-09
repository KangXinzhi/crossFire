/* eslint-disable */
import * as THREE from "three";
import {RigidBody} from "@react-three/rapier";
import {useRef} from "react";
import {usePersonControls} from "@/hooks";
import {useFrame} from "@react-three/fiber";

const MOVE_SPEED = 5;
const JUMP_SPEED = 10;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const Player = () => {
    const playerRef = useRef<any>();
    const { forward, backward, left, right, jump } = usePersonControls();

    console.log(forward, backward, left, right, jump);
    useFrame(() => {
        if (!playerRef.current) return;

        const velocity = playerRef.current.linvel();

        frontVector.set(0, 0, +backward - +forward);
        sideVector.set(+left - +right, 0, 0);
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED);

        playerRef.current.wakeUp();

        // 如果 jump 为 true，设置 y 方向的速度为 JUMP_SPEED，否则保持当前的 y 方向速度
        const yVelocity = jump ? JUMP_SPEED : velocity.y;
        // playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });
        playerRef.current.setLinvel({ x: direction.x, y: yVelocity, z: direction.z });
    });
    return (
        <>
             <RigidBody position={[0, 1, -2]} ref={playerRef}>
                <mesh>
                    <capsuleGeometry args={[0.5, 0.5]}/>
                </mesh>
            </RigidBody>
        </>
    );
}

export default Player;