import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import "./index.css";


const radius = 100; // 摇杆半径

// 触摸屏控制，摇杆适配
export default function JoyStick() {
  const [stick, setStick] = useState(false); // 摇杆是否按下
  const [joyPos, setJoyPos] = useState({ x: 0, y: 0 }); // 摇杆出现位置
  const [stickPos, setStickPos] = useState({ x: 0, y: 0 }); // 摇杆相对移动位置
  const [click, setClick] = useState(false); // 按钮是否按下

  const [isTouchScreen, setIsTouchScreen] = useState(false)

  const joyStick = useRef<HTMLDivElement>(null);
  const stickBox = useRef<HTMLDivElement>(null);

  // 摇杆按下
  function keyDown(e: React.TouchEvent) {
    setJoyPos({
      x: e.touches[0].clientX - radius,
      y: e.touches[0].clientY - radius,
    });
    setStick(true);
  }
  // 摇杆松开
  function keyUp() {
    joyStick.current?.classList.remove("appear");
    joyStick.current?.classList.add("disappear");
    const stickPos = new THREE.Vector3(0, 0);

    console.log('速度归零')
    setStickPos(stickPos);
    setTimeout(() => {
      setStick(false);
    }, 200);
  }
  // 摇杆移动
  function keyMove(e: React.TouchEvent) {
    if (stick) {
      const stickPosX = e.touches[0].clientX - joyPos.x - radius;
      const stickPosY = e.touches[0].clientY - joyPos.y - radius;

      const stickPos = new THREE.Vector3(stickPosX, stickPosY); // 左右移动
      if (stickPos.length() > radius) {
        stickPos.multiplyScalar(radius / stickPos.length());
      }
      setStickPos(stickPos);
      const direction = new THREE.Vector3(stickPos.x, 0, stickPos.y);
      console.log('direction:', direction)
    }
  }
  // 按下按钮
  function touchStart(e: React.TouchEvent) {
    e.stopPropagation();
    setClick(true);
    console.log('action', true)
  }
  // 松开按钮
  function touchEnd(e: React.TouchEvent) {
    e.stopPropagation();
    setClick(false);
    console.log('action', false)
  }

  // 检测是否是触摸屏
  useEffect(() => {
    if (('ontouchstart' in window) ||
      (navigator.maxTouchPoints > 0)) {
      setIsTouchScreen(true)
    } else {
      setIsTouchScreen(false)
    }
  }, [])

  return (isTouchScreen &&
    <div
      className="rocker"
      onTouchStart={keyDown}
      onTouchEnd={keyUp}
      onTouchMove={keyMove}
    >
      {stick && (
        <div
          ref={joyStick}
          className="joystick appear"
          style={{ left: joyPos.x, top: joyPos.y }}
        >
          <div className="stickBox">
            <div
              ref={stickBox}
              className="stick"
              style={{ left: stickPos.x, top: stickPos.y }}
            />
          </div>
        </div>
      )}

      <div
        className={click ? "button click" : "button"}
        onTouchStart={touchStart}
        onTouchEnd={touchEnd}
      ></div>
    </div>
  );
}
