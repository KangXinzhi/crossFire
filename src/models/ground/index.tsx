import { useEffect } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";

useGLTF.preload("./world.glb");

function Ground({ log = true }) {
  /*----------------------------变量命名------------------------------*/
  // 加载模型
  const ground = useGLTF("./world.glb"); // 地面
  /*----------------------------生命周期-------------------------------*/
  useEffect(() => {
    if (log) {
      console.log("ground:", ground.scene);
    }
  });

  return (
    <group dispose={null}>
      <RigidBody
        name="环境"
        type="fixed"
        colliders="trimesh"
        position={[0, 0, 0]}
      >
        <primitive object={ground.scene} />
      </RigidBody>
    </group>
  );
}
export default Ground
