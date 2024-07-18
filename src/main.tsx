import React from 'react'
import ReactDOM from 'react-dom/client'
import {Canvas} from "@react-three/fiber";

import App from './App.jsx'
import UI from './UI/UI.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <div id="container">
        <UI />
        <Canvas camera={{ fov: 45 }} shadows>
            <App />
        </Canvas>
    </div>
  </React.StrictMode>,
)
