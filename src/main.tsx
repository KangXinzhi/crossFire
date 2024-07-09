import React from 'react'
import ReactDOM from 'react-dom/client'
import {Canvas} from "@react-three/fiber";

import App from './App.jsx'
import './index.css';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div id="container">
        <Canvas camera={{ fov: 45 }} shadows>
            <App />
        </Canvas>
    </div>
  </React.StrictMode>,
)
