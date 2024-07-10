/* eslint-disable */
import * as THREE from "three";
import * as RAPIER from "@dimforge/rapier3d-compat"
import {CapsuleCollider, RigidBody, useRapier} from "@react-three/rapier";
import {useRef} from "react";
import {usePersonControls} from "@/hooks";
import {useFrame} from "@react-three/fiber";

const MOVE_SPEED = 5;
const direction = new THREE.Vector3();
const frontVector = new THREE.Vector3();
const sideVector = new THREE.Vector3();

const Player = () => {
    const playerRef = useRef<any>();
    const { forward, backward, left, right, jump } = usePersonControls();
    const rapier = useRapier();
    useFrame((state) => {
        if (!playerRef.current) return;

        const velocity = playerRef.current.linvel();

        frontVector.set(0, 0, +backward - +forward);
        sideVector.set(+left - +right, 0, 0);
        // 为了使角色精确地沿着相机所指向的轨迹移动，我们需要添加applyEuler 。
        direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(MOVE_SPEED).applyEuler(state.camera.rotation);

        playerRef.current.wakeUp();
        playerRef.current.setLinvel({ x: direction.x, y: velocity.y, z: direction.z });

        // jumping
        // 访问Rapier物理引擎场景。它包含所有物理对象并管理它们的交互。
        const world = rapier.world;
        // @ts-ignore
        // 创建一条从玩家当前位置开始并指向 y 轴的射线。该光线被“投射”到场景中，以确定它是否与场景中的任何对象相交。
        const ray = world.castRay(new RAPIER.Ray(playerRef.current.translation(), { x: 0, y: -1, z: 0 }));
        const grounded = ray && ray.collider && Math.abs(ray.timeOfImpact) <= 1;
        if (jump && grounded) doJump();

        // 移动相机，将获取玩家的当前位置，并在每次刷新帧时更改相机的位置。
        const {x, y, z} = playerRef.current.translation();
        state.camera.position.set(x, y, z);
    });

    const doJump = () => {
        playerRef.current.setLinvel({x: 0, y: 8, z: 0});
    }

    return (
        <>
             <RigidBody colliders={false} position={[0, 1, -2]} mass={1} ref={playerRef} lockRotations>
                <mesh>
                    <capsuleGeometry args={[0.5, 0.5]} />
                    <CapsuleCollider args={[0.5, 0.5]} />
                </mesh>
            </RigidBody>
        </>
    );
}

export default Player;