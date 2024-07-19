import { useAnimations, useGLTF, useKeyboardControls } from "@react-three/drei";
import { useFrame, useThree, RootState } from "@react-three/fiber";
import {
  CapsuleCollider, RapierRigidBody, RigidBody,
  quat, euler
} from "@react-three/rapier";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { toFixed } from "../../utils";

const SPEED = 4; // 移动速度
const JUMP = 7; // 跳跃速度
const direction = new THREE.Vector3(); // 空间方向
// 生成枚举
enum STATUS {
  walk,
  idle,
  run
}
interface ControlDispatcher extends THREE.EventDispatcher {
  getDistance(): number;
}
function Player() {
  // 加载模型
  const { scene, animations } = useGLTF("./player.glb");
  const { ref, actions, names } = useAnimations(animations, scene);
  const [status, setStatus] = useState(names[STATUS.idle])

  const { camera } = useThree();

  const player = useRef<RapierRigidBody>(null); // 玩家的引用
  useKeyboardControls((state) => move(state))

  console.log('status',status);
  console.log('names',names);

  // 帧渲染
  useFrame((state: RootState, delta) => {
    if (!player.current) return;

    // 玩家移动前的相机距离，用来确保相机跟随玩家移动
    const distance = toFixed((state.controls as ControlDispatcher).getDistance());
    // 更新相机位置
    updateCamera(state, distance, delta);

    if (direction.x !== 0 || direction.z !== 0) {
      rotation();
    }
  })

  // 动画监听
  useEffect(() => {
    if (!names || !actions) return
    names?.forEach(name => {
      actions[name]?.fadeOut(0.2);
    });
    actions[status]?.reset().fadeIn(0.2).play()
  }, [actions, names, status])


  // 移动逻辑
  function move(state: {
    [key: string]: boolean;
  }): boolean {
    console.log('state', state);
    if (!camera || !player.current) return false
    const { forward, backward, left, right, jump } = state
    // 获取移动方向
    direction.set(Number(right) - Number(left), 0, Number(backward) - Number(forward))
      .normalize()
      .multiplyScalar(SPEED)
      .applyEuler(camera.rotation); // 以相机方向为基准,应用欧拉角

    const velocity = {
      x: toFixed(direction.x),
      y: player.current.linvel().y,
      z: toFixed(direction.z),
    };
    player.current.setLinvel(velocity, true);
    // 跳跃
    if (jump) {
      player.current.setLinvel({ x: 0, y: JUMP, z: 0 }, true);
    }

    // 播放动画
    let key = names[STATUS.walk]
    if (direction.x !== 0 || direction.z !== 0 || jump) {
      key = names[STATUS.idle]
    }

    if (status !== key) setStatus(key)
    return true
  }
  // 人物旋转
  function rotation() {
    if (!player.current) return
    const rotationAngle = Math.atan2(direction.x, direction.z); // 旋转角度
    // 直接使用四元数进行旋转
    const rotationEuler = euler().set(0, rotationAngle, 0); // 旋转欧拉角
    const rotationQuaternion = quat().setFromEuler(rotationEuler); // 旋转四元数
    const startQuaternion = quat().copy(player.current.rotation()); // 当前旋转四元数
    startQuaternion.slerp(rotationQuaternion, 0.2);
    player.current.setRotation(startQuaternion, true);
  }
  // 更新相机位置
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function updateCamera(state: any, distance: number, delta: number) {
    if (!player.current) return

    const playerPos = player.current.translation(); // 玩家世界坐标

    const rotateDelta = (direction.x / 100) * delta;

    const { camera, controls } = state;
    controls.target.copy(playerPos);
    const spherical = new THREE.Spherical(
      distance,
      controls.getPolarAngle(),
      controls.getAzimuthalAngle() - rotateDelta
    );
    const position = new THREE.Vector3().setFromSpherical(spherical);
    camera.position.copy(playerPos).add(position);
  }

  return <group dispose={null}>
    <RigidBody
      ref={player}
      colliders={false}
      type="dynamic"
      enabledRotations={[false, false, false]}
    >
      <primitive ref={ref} object={scene} position={[0, -1, 0]} />
      <CapsuleCollider args={[0.6, 0.3]} position={[0, -0.1, 0]} />
    </RigidBody>
  </group>
}

export default Player;