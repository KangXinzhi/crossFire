import { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import "./index.css";

// 模型加载时显示的页面
function Loading() {

  const { progress } = useProgress();
  const [couldStart, setStart] = useState(false);
  const [load, setLoad] = useState(true);

  useEffect(() => {
    if (progress >= 100) {
      setStart(true);
    }
  }, [progress]);

  function start() {
    setLoad(false)
  }

  return (
    load && (
      <div className={`loading`}>
        <div className="load">加载进度： {progress.toFixed()} %</div>
        {couldStart && (
          <div className="start" onClick={start}>
            开始
          </div>
        )}
      </div>
    )
  );
}
export default Loading