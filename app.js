// app.js - AXP Fusion Dynamics (v22.0 - SaaS Data Structure & Optotype Rotation Lock)
// 重構：修復 Supabase 寫入的反模式，將 raw_data 升級為標準的關聯式 JSON Schema
// 修正：徹底拔除可預測字庫，改為高頻醫療視標，並強制鎖死文字旋轉，確保睫狀肌調節極限

import { AIM_MATRIX, PROTOCOL_NAMES } from './matrix.js';
import { createTarget } from './shapes.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

const supabaseUrl = 'https://wvholwcyrldixlsgoege.supabase.co';
const supabaseKey = 'sb_publishable_BozJ84tPQF-jBHGKtXKqgw_ELodM54e';
const supabase = createClient(supabaseUrl, supabaseKey);

// === SaaS 強制登入介面 ===
let currentPatientCode = 'GUEST';
const loginOverlay = document.createElement('div');
loginOverlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(243, 244, 246, 0.95); z-index:9999; display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:sans-serif;";
loginOverlay.innerHTML = `
    <h1 style="color:#0f172a; letter-spacing:2px; margin-bottom:10px;">AXP FUSION DYNAMICS</h1>
    <p style="color:#475569; margin-bottom:30px; font-weight:bold;">企業級雙眼視覺雲端診療系統</p>
    <div style="background:#ffffff; padding:40px; border-radius:12px; text-align:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        <p style="margin-bottom:15px; font-size:14px; font-weight:bold; color:#64748b;">請輸入姓名加生日</p>
        <input type="text" id="patient-code-input" placeholder="例如: 凡特錫0123" style="background-color:#f1f5f9; padding:12px; width:220px; text-align:center; border-radius:6px; border:1px solid #cbd5e1; margin-bottom:25px; font-size:16px; font-weight:bold; color:#475569; outline:none; transition:0.2s;">
        <br>
        <button id="login-btn" style="background:#2563eb; color:white; border:none; padding:12px 30px; border-radius:6px; font-size:16px; cursor:pointer; font-weight:bold; transition:0.3s; box-shadow: 0 4px 6px rgba(37,99,235,0.2);">登入並開始訓練</button>
    </div>
`;
document.body.appendChild(loginOverlay);

function performLogin() {
    const code = document.getElementById('patient-code-input')?.value.trim();
    if(!code) return alert("請輸入姓名與生日！");
    currentPatientCode = code; 
    loginOverlay.style.display = 'none'; 
}

document.getElementById('login-btn')?.addEventListener('click', performLogin);
const inputField = document.getElementById('patient-code-input');
if(inputField) {
    inputField.addEventListener('focus', () => { inputField.style.borderColor = '#2563eb'; inputField.style.backgroundColor = '#ffffff'; });
    inputField.addEventListener('blur', () => { inputField.style.borderColor = '#cbd5e1'; inputField.style.backgroundColor = '#f1f5f9'; });
    inputField.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); performLogin(); } });
}

// === DOM 元素綁定 ===
const container = document.getElementById('webgl-container');
const controlPanel = document.querySelector('.control-panel'); 
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const statusText = document.getElementById('status-text');

const shapeSelect = document.getElementById('shape-select');
const customTextInput = document.getElementById('custom-text'); 
const textInputGroup = document.getElementById('text-input-group'); 
const sizeSlider = document.getElementById('size-slider');
const sizeLabel = document.getElementById('size-label');
const thickSlider = document.getElementById('thick-slider');
const thickLabel = document.getElementById('thick-label');
const fillCheckbox = document.getElementById('fill-checkbox');
const rotateCheckbox = document.getElementById('rotate-checkbox');
const aiToggle = document.getElementById('ai-toggle');
const speedSlider = document.getElementById('speed-slider');
const speedLabel = document.getElementById('speed-label');
const stereoSlider = document.getElementById('stereo-slider');
const stereoLabel = document.getElementById('stereo-label');

const prismSlider = document.getElementById('prism-slider');
const prismLabel = document.getElementById('prism-label');
const prismValHud = document.getElementById('prism-val-hud'); 

const screenSpecSelect = document.getElementById('screen-spec');
const viewDistInput = document.getElementById('view-dist');

const glassesSelect = document.getElementById('glasses-select');
const balanceSlider = document.getElementById('balance-slider');
const balanceLabel = document.getElementById('balance-label');
const redSlider = document.getElementById('red-slider');
const greenSlider = document.getElementById('green-slider');
const blueSlider = document.getElementById('blue-slider');

const timerDisplay = document.getElementById('timer-val');
const dynamicModeTag = document.getElementById('dynamic-mode-tag');

const siloPrompt = document.createElement('div');
siloPrompt.id = 'silo-prompt';
siloPrompt.style.cssText = "position:absolute; bottom:80px; left:50%; transform:translateX(-50%); font-size:18px; font-weight:bold; letter-spacing:2px; background:rgba(15, 23, 42, 0.85); backdrop-filter:blur(8px); padding:12px 24px; border-radius:12px; border:2px solid #4ade80; z-index:100; display:none; text-shadow: 0 0 10px rgba(0,0,0,0.5); text-align:center; transition: 0.3s; pointer-events:none;";
document.getElementById('arena').appendChild(siloPrompt);

// 引擎與臨床全域狀態變數
let isRunning = false, animationId;
let currentSize = 200, currentSpeed = 20, currentStereo = 0, currentThick = 9.0;
let isRotating = true, isFilled = false;
let activeProtocol = null, protocolStage = 0, protocolTime = 0, totalTimerSec = 0, lastTime = 0, phase = 0;
let currentSaccadeX = 0, currentSaccadeY = 0, saccadeTimer = 0, currentRoamX = 0, currentRoamY = 0;

// 內部隱藏的軌跡與模式變數
let currentAxis = 'horizontal';
let currentMode = 'crossover';

let sessionLogs = [];
let isTestModeActive = false, taskActive = false;
let taskDirection = '', taskEye = 'both', taskSpawnTime = 0, timeSinceLastTask = 0, nextTaskInterval = 3000, statusTimeout = null;
let taskInitialPrism = "";

let consecutiveHits = 0;
let consecutiveMisses = 0;

let isAIRescueActive = false;
let aiRescueStartTime = 0;
let originalSizeBeforeRescue = 200;
let originalPrismBeforeRescue = 0; 
let protocolTimePausedVal = 0;

let flipperTimer = 0;
let flipperState = true; 

// 🚀 CTO 修正：高頻醫療級無意義字串 (Optotypes)
const AXP_WORDS = ['H O T V', 'Z R K D', 'E M C W', 'S N E L', 'O S V D', 'N H Z O', 'A X 7 P', '9 Q 2 M'];
let currentWordIndex = 0;
let lastWordChangeTime = 0;

// ==========================================
// 核心圖學：Layer Masking 雙渲染引擎
// ==========================================
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');
const aspect = container.clientWidth / container.clientHeight;
const d = 500; 
const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
camera.position.set(0, 0, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); 
ambientLight.layers.enable(1); ambientLight.layers.enable(2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9); 
directionalLight.position.set(0, 0, 200); 
directionalLight.layers.enable(1); directionalLight.layers.enable(2);
scene.add(directionalLight);

const rtLeft = new THREE.WebGLRenderTarget(container.clientWidth, container.clientHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat });
const rtRight = new THREE.WebGLRenderTarget(container.clientWidth, container.clientHeight, { minFilter: THREE.LinearFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat });

const anaglyphShader = {
    uniforms: {
        "mapLeft": { value: rtLeft.texture },
        "mapRight": { value: rtRight.texture },
        "colorLeft": { value: new THREE.Color(0.0, 0.0, 1.0) }, 
        "colorRight": { value: new THREE.Color(1.0, 0.0, 0.0) }, 
        "intensityLeft": { value: 1.0 },
        "intensityRight": { value: 1.0 },
        "prismOffset": { value: 0.0 } 
    },
    vertexShader: ` varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); } `,
    fragmentShader: `
        uniform sampler2D mapLeft;
        uniform sampler2D mapRight;
        uniform vec3 colorLeft;
        uniform vec3 colorRight;
        uniform float intensityLeft;
        uniform float intensityRight;
        varying vec2 vUv;
        void main() {
            vec4 texelLeft = texture2D(mapLeft, vUv);
            vec4 texelRight = texture2D(mapRight, vUv);
            float lumLeft = dot(texelLeft.rgb, vec3(0.299, 0.587, 0.114));
            float lumRight = dot(texelRight.rgb, vec3(0.299, 0.587, 0.114));
            vec3 finalColor = (vec3(lumLeft) * colorLeft * intensityLeft) + 
                              (vec3(lumRight) * colorRight * intensityRight);
            gl_FragColor = vec4(finalColor, max(texelLeft.a, texelRight.a));
        }
    `
};

const postMaterial = new THREE.ShaderMaterial(anaglyphShader);
const postScene = new THREE.Scene();
const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
postScene.add(postQuad);

const starCanvas = document.createElement('canvas');
starCanvas.width = 32; starCanvas.height = 32;
const starCtx = starCanvas.getContext('2d');
starCtx.beginPath(); starCtx.arc(16, 16, 14, 0, Math.PI * 2); starCtx.fillStyle = 'white'; starCtx.fill();
const starTexture = new THREE.CanvasTexture(starCanvas);

const starsCount = 200; 
const posArrayLeft = new Float32Array(starsCount * 3);
const posArrayRight = new Float32Array(starsCount * 3);

for(let i=0; i < starsCount; i++) {
    const baseX = (Math.random() - 0.5) * 1600; const baseY = (Math.random() - 0.5) * 1400; 
    const depthFactor = Math.random(); const baseZ = -200 - depthFactor * 800; const parallax = 3 + depthFactor * 25; 
    posArrayLeft[i*3] = baseX - parallax; posArrayLeft[i*3+1] = baseY; posArrayLeft[i*3+2] = baseZ;
    posArrayRight[i*3] = baseX + parallax; posArrayRight[i*3+1] = baseY; posArrayRight[i*3+2] = baseZ;
}

const starsGeoLeft = new THREE.BufferGeometry(); starsGeoLeft.setAttribute('position', new THREE.BufferAttribute(posArrayLeft, 3));
const starsGeoRight = new THREE.BufferGeometry(); starsGeoRight.setAttribute('position', new THREE.BufferAttribute(posArrayRight, 3));

const starMatLeft = new THREE.PointsMaterial({ size: 5.85, map: starTexture, transparent: true, opacity: 1.0, alphaTest: 0.1, sizeAttenuation: true, color: 0xffffff, blending: THREE.NormalBlending, depthWrite: false });
const starMatRight = new THREE.PointsMaterial({ size: 5.85, map: starTexture, transparent: true, opacity: 1.0, alphaTest: 0.1, sizeAttenuation: true, color: 0xffffff, blending: THREE.NormalBlending, depthWrite: false });

const starsLeft = new THREE.Points(starsGeoLeft, starMatLeft);
const starsRight = new THREE.Points(starsGeoRight, starMatRight);

starsLeft.layers.set(1); starsRight.layers.set(2); 
scene.add(starsLeft); scene.add(starsRight);

let targetLeft, targetRight;

// 測驗原點修正 (高對比黑圈底 + 無視深度)
const cueGroupLeft = new THREE.Group();
const cueGroupRight = new THREE.Group();

const cueOutlineGeo = new THREE.CircleGeometry(1.4, 32);
const cueOutlineMatLeft = new THREE.MeshBasicMaterial({ color: 0x000000, depthTest: false, depthWrite: false });
const cueOutlineMatRight = new THREE.MeshBasicMaterial({ color: 0x000000, depthTest: false, depthWrite: false });
const outlineLeft = new THREE.Mesh(cueOutlineGeo, cueOutlineMatLeft);
const outlineRight = new THREE.Mesh(cueOutlineGeo, cueOutlineMatRight);

const cueDotGeo = new THREE.CircleGeometry(1, 32); 
const cueDotMatLeft = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, depthWrite: false }); 
const cueDotMatRight = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, depthWrite: false });
const dotLeft = new THREE.Mesh(cueDotGeo, cueDotMatLeft); 
const dotRight = new THREE.Mesh(cueDotGeo, cueDotMatRight);

outlineLeft.renderOrder = 998; outlineRight.renderOrder = 998;
dotLeft.renderOrder = 999; dotRight.renderOrder = 999;

outlineLeft.layers.set(1); dotLeft.layers.set(1);
outlineRight.layers.set(2); dotRight.layers.set(2);

cueGroupLeft.add(outlineLeft); cueGroupLeft.add(dotLeft);
cueGroupRight.add(outlineRight); cueGroupRight.add(dotRight);

cueGroupLeft.visible = false; cueGroupRight.visible = false; 
scene.add(cueGroupLeft); scene.add(cueGroupRight);

function forceRenderFrame() {
    if (isRunning) return; 
    camera.layers.set(1); renderer.setRenderTarget(rtLeft); renderer.clear(); renderer.render(scene, camera);
    camera.layers.set(2); renderer.setRenderTarget(rtRight); renderer.clear(); renderer.render(scene, camera);
    camera.layers.set(0); renderer.setRenderTarget(null); renderer.render(postScene, postCamera);
}

function updateOpticsFromUI() {
    const rVal = redSlider ? parseInt(redSlider.value) : 100;
    const gVal = greenSlider ? parseInt(greenSlider.value) : 100;
    const bVal = blueSlider ? parseInt(blueSlider.value) : 100;
    
    let balance = balanceSlider ? parseInt(balanceSlider.value) : 50;
    let opacityLeft = balance < 50 ? (balance / 50) : 1; 
    let opacityRight = balance > 50 ? ((100 - balance) / 50) : 1;
    
    postMaterial.uniforms.intensityRight.value = (rVal / 100.0) * opacityRight;
    if(document.getElementById('r-val')) document.getElementById('r-val').innerText = rVal + '%';
    
    let leftColor = new THREE.Color();
    if (glassesSelect && glassesSelect.value === 'rg') {
        if(document.getElementById('l-val')) document.getElementById('l-val').innerText = gVal + '%';
        leftColor.setRGB(0.0, 1.0, 0.0);
        postMaterial.uniforms.intensityLeft.value = (gVal / 100.0) * opacityLeft;
    } else {
        if(document.getElementById('l-val')) document.getElementById('l-val').innerText = bVal + '%';
        leftColor.setRGB(0.0, 0.0, 1.0);
        postMaterial.uniforms.intensityLeft.value = (bVal / 100.0) * opacityLeft;
    }
    postMaterial.uniforms.colorLeft.value.copy(leftColor);

    if (prismSlider) {
        const prismVal = parseFloat(prismSlider.value);
        const pText = prismVal > 0 ? `${prismVal.toFixed(1)} Δ (BO)` : prismVal < 0 ? `${Math.abs(prismVal).toFixed(1)} Δ (BI)` : `0.0 Δ (平光)`;
        if(prismLabel) prismLabel.innerText = pText;
        if(prismValHud && !isRunning) prismValHud.innerText = pText;
    }
    
    if (!isRunning) {
        updatePositions(phase, ''); 
    }
}

function clearTargets() {
    if (targetLeft) { targetLeft.traverse(child => { if(child.isMesh) { child.geometry?.dispose(); child.material?.dispose(); }}); scene.remove(targetLeft); }
    if (targetRight) { targetRight.traverse(child => { if(child.isMesh) { child.geometry?.dispose(); child.material?.dispose(); }}); scene.remove(targetRight); }
}

function buildTargets() {
    clearTargets(); 
    if(textInputGroup) textInputGroup.style.display = shapeSelect?.value === 'text' ? 'block' : 'none';
    const shapeVal = shapeSelect ? shapeSelect.value : 'sphere5';
    const txtVal = customTextInput ? customTextInput.value : 'A X P';
    
    targetLeft = createTarget(shapeVal, 0xffffff, isFilled, txtVal, currentThick);
    targetRight = createTarget(shapeVal, 0xffffff, isFilled, txtVal, currentThick);
    
    targetLeft.traverse(c => { c.layers.set(1); if(c.isMesh) { c.material.blending = THREE.NormalBlending; c.material.color.setHex(0xffffff); } });
    targetRight.traverse(c => { c.layers.set(2); if(c.isMesh) { c.material.blending = THREE.NormalBlending; c.material.color.setHex(0xffffff); } });

    updateScaleAndThickness(); scene.add(targetLeft); scene.add(targetRight); updateOpticsFromUI(); 
}

function updateScaleAndThickness(dynamicSize = currentSize) {
    const scaleFactor = dynamicSize / 200;
    if(targetLeft && targetRight) { 
        targetLeft.scale.set(scaleFactor, scaleFactor, scaleFactor); 
        targetRight.scale.set(scaleFactor, scaleFactor, scaleFactor); 
        const thicknessScale = 1 + (scaleFactor - 1) * 0.35; 
        const correctionScale = thicknessScale / scaleFactor;
        
        [targetLeft, targetRight].forEach(target => {
            target.traverse(child => { 
                if(child.isMesh && child.geometry) {
                    if (child.geometry.type === 'BoxGeometry') { child.scale.x = correctionScale; child.scale.z = correctionScale; } 
                    else if (child.geometry.type === 'TorusGeometry') { child.scale.set(correctionScale, correctionScale, correctionScale); }
                } 
            });
        });
    }
    const cueScale = Math.max(12, dynamicSize * 0.04); 
    cueGroupLeft.scale.set(cueScale, cueScale, 1); 
    cueGroupRight.scale.set(cueScale, cueScale, 1);
    forceRenderFrame();
}

function updatePositions(phaseVal, currentAnim = '') {
    const maxPrismLoad = parseFloat(prismSlider ? prismSlider.value : 0);
    let targetPrismDemand = maxPrismLoad;

    // 支援波形運算
    if (isRunning) {
        if (aiToggle && aiToggle.checked && currentAnim.includes('flipper')) {
            targetPrismDemand = flipperState ? maxPrismLoad : -maxPrismLoad * 0.2;
        } else {
            const wave = (Math.sin(phaseVal - Math.PI/2) + 1) / 2; 
            if (currentMode === 'oneway_bo') targetPrismDemand = wave * Math.max(0, maxPrismLoad);
            else if (currentMode === 'oneway_bi') targetPrismDemand = wave * Math.min(0, maxPrismLoad);
            else targetPrismDemand = Math.sin(phaseVal) * maxPrismLoad; 
        }
    }

    const spec = screenSpecSelect ? screenSpecSelect.value : 'generic';
    let pixelToCm = 2.54 / 96; 
    if (spec === 'retina16') pixelToCm = 34.5 / window.screen.width; 
    else if (spec === 'ipad13') pixelToCm = 2.54 / 132; 
    const viewDistM = (parseFloat(viewDistInput ? viewDistInput.value : 50) || 50) / 100;

    const requiredSeparationCm = targetPrismDemand * viewDistM;
    const totalSeparationPx = requiredSeparationCm / pixelToCm;
    let disp = totalSeparationPx / 2;

    let pxLeftX = 0, pxRightX = 0, pxLeftY = 0, pxRightY = 0;
    let vertDisp = 0;

    if (currentAxis === 'lissajous') {
        pxLeftX = disp; pxRightX = -disp;
        pxLeftY = Math.sin(phaseVal * 2) * (totalSeparationPx * 0.3);
        pxRightY = pxLeftY;
    }
    else if (currentAxis === 'vertical') { pxLeftY = disp; pxRightY = -disp; } 
    else if (currentAxis === 'circular') {
        const orbitX = Math.cos(phaseVal) * Math.abs(totalSeparationPx * 0.25); 
        const orbitY = Math.sin(phaseVal) * Math.abs(totalSeparationPx * 0.25);
        pxLeftX = disp + orbitX; pxRightX = -disp + orbitX; pxLeftY = orbitY; pxRightY = orbitY;
    } 
    else { pxLeftX = disp; pxRightX = -disp; } // horizontal

    let finalLeftX = pxLeftX + currentRoamX + currentSaccadeX; let finalLeftY = pxLeftY + currentRoamY + currentSaccadeY;
    let finalRightX = pxRightX + currentRoamX + currentSaccadeX; let finalRightY = pxRightY + currentRoamY + currentSaccadeY;

    const maxVertPx = (1.5 * viewDistM) / pixelToCm;
    if (currentAnim.includes('vertical_tune')) {
        let vFactor = currentAnim.includes('heavy') ? 1.0 : (currentAnim.includes('medium') ? 0.6 : 0.3);
        vertDisp = Math.sin(protocolTime / 2000) * (maxVertPx / 2) * vFactor;
        finalLeftY += vertDisp; finalRightY -= vertDisp;
    }

    const maxBOPx = (40 * viewDistM) / pixelToCm;
    const maxBIPx = (6 * viewDistM) / pixelToCm; 

    let dx = finalLeftX - finalRightX; 
    if (dx > maxBOPx) { let scale = maxBOPx / dx; finalLeftX *= scale; finalRightX *= scale; } 
    else if (dx < -maxBIPx) { let scale = -maxBIPx / dx; finalLeftX *= scale; finalRightX *= scale; }

    let dy = finalLeftY - finalRightY;
    if (Math.abs(dy) > maxVertPx) { let scale = maxVertPx / Math.abs(dy); finalLeftY *= scale; finalRightY *= scale; }

    if(targetLeft && targetRight) {
        targetLeft.children.forEach((layer, i) => { layer.position.x = -(i * 15) * currentStereo; });
        targetRight.children.forEach((layer, i) => { layer.position.x = (i * 15) * currentStereo; });
        targetLeft.position.set(finalLeftX, finalLeftY, 0); targetRight.position.set(finalRightX, finalRightY, 0);
        
        const currentSepX = targetLeft.position.x - targetRight.position.x;
        const currentSepY = targetLeft.position.y - targetRight.position.y;
        
        const horizontalPrism = (Math.abs(currentSepX) * pixelToCm) / viewDistM;
        let hPrismDir = currentSepX >= 0 ? "BO" : "BI";
        const verticalPrism = (Math.abs(currentSepY) * pixelToCm) / viewDistM;
        
        if (prismValHud) {
            let hudText = `${horizontalPrism.toFixed(1)} Δ (${hPrismDir})`;
            if (Math.abs(currentSepY) > 0.5) { hudText += ` | ↕ ${verticalPrism.toFixed(1)} Δ`; }
            prismValHud.innerText = hudText;
        }
    }

    if (taskActive && isTestModeActive) {
        const offsetDist = Math.min(currentSize * 0.6, 200); 
        let cueDx = 0, cueDy = 0;
        if (taskDirection === 'ArrowUp') cueDy = offsetDist; if (taskDirection === 'ArrowDown') cueDy = -offsetDist;
        if (taskDirection === 'ArrowLeft') cueDx = -offsetDist; if (taskDirection === 'ArrowRight') cueDx = offsetDist;
        cueGroupLeft.position.set(finalLeftX + cueDx, finalLeftY + cueDy, 20); 
        cueGroupRight.position.set(finalRightX + cueDx, finalRightY + cueDy, 20);
        
        const isBlink = Math.floor(performance.now() / 120) % 2 === 0;
        cueGroupLeft.visible = isBlink && (taskEye === 'both' || taskEye === 'left');
        cueGroupRight.visible = isBlink && (taskEye === 'both' || taskEye === 'right');
    }
    forceRenderFrame();
}

function spawnTask() {
    if (!isTestModeActive) return;
    taskActive = true; taskSpawnTime = performance.now();
    taskInitialPrism = prismValHud ? prismValHud.innerText : '0.0';
    const dirs = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']; taskDirection = dirs[Math.floor(Math.random() * dirs.length)];
    const eyes = ['both', 'both', 'left', 'right']; taskEye = eyes[Math.floor(Math.random() * eyes.length)];
}

function handleTaskResult(result, rt = 0) {
    taskActive = false; cueGroupLeft.visible = false; cueGroupRight.visible = false; timeSinceLastTask = 0; nextTaskInterval = 2000 + Math.random() * 3000; 
    let logMsg = "", statusLabel = ""; 
    const currentPrismStr = prismValHud ? prismValHud.innerText : '0.0';
    const dx = targetRight.position.x - targetLeft.position.x; const dy = targetRight.position.y - targetLeft.position.y;

    if (taskEye === 'both') {
        if (result === 'hit') { 
            logMsg = `🟢 完美融像 (反應 ${rt}s) | 稜鏡: ${currentPrismStr}`; statusLabel = "完美融像(FUSION)"; 
            consecutiveHits++; consecutiveMisses = 0;
            
            if (aiToggle && aiToggle.checked && consecutiveHits >= 3) {
                consecutiveHits = 0;
                const stageMax = AIM_MATRIX[activeProtocol] ? AIM_MATRIX[activeProtocol].length - 1 : 9;
                if (protocolStage < stageMax) {
                    protocolStage++; loadMatrixStage(activeProtocol, protocolStage);
                    logMsg = `🚀 AI 難度升級 | ${logMsg}`; if(statusText) statusText.style.color = '#38bdf8';
                }
            } else { if(!isAIRescueActive && statusText) statusText.style.color = '#4ade80'; }
            
        } else {
            let failType = ""; let reason = result === 'wrong' ? "按錯方向" : "超時未答";
            let triggerRescue = false;
            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5) { failType = "垂直融像破裂"; statusLabel = "垂直破裂(VERT_FAIL)"; triggerRescue = true; } 
            else {
                if (dx < 0) { failType = "聚合不足"; statusLabel = "聚合不足(BO_FAIL)"; triggerRescue = true; } 
                else { failType = "開散不足"; statusLabel = "開散不足(BI_FAIL)"; triggerRescue = true; }
            }
            logMsg = `🔴 ${failType} (${reason}) | 稜鏡: ${currentPrismStr}`; 
            consecutiveMisses++; consecutiveHits = 0;
            
            if (aiToggle && aiToggle.checked && consecutiveMisses >= 2) {
                consecutiveMisses = 0;
                if (protocolStage > 0) {
                    protocolStage--; loadMatrixStage(activeProtocol, protocolStage);
                    logMsg = `📉 AI 難度調降 | ${logMsg}`; if(statusText) statusText.style.color = '#facc15';
                }
            } else { if(!isAIRescueActive && statusText) statusText.style.color = '#f87171'; }
            
            if (aiToggle && aiToggle.checked && triggerRescue && !isAIRescueActive && !isTestModeActive) { activateAIRescue(logMsg); }
        }
    } else {
        const eyeName = taskEye === 'left' ? '左通道' : '右通道';
        if (result === 'hit') { logMsg = `🟢 ${eyeName}去抑制 (反應 ${rt}s)`; statusLabel = `${eyeName}去抑制(ANTI_SUPP_${taskEye.toUpperCase()})`; if(!isAIRescueActive && statusText) statusText.style.color = '#4ade80'; } 
        else { let reason = result === 'wrong' ? "按錯方向" : "超時未答"; logMsg = `⚫ ${eyeName}抑制 (${reason})`; statusLabel = `${eyeName}抑制(SUPP_${taskEye.toUpperCase()})`; if(!isAIRescueActive && statusText) statusText.style.color = '#facc15'; }
    }
    
    if(!isAIRescueActive && statusText) statusText.innerText = logMsg;
    sessionLogs.push({ time: totalTimerSec.toString(), initial_sep: "0", initial_prism: taskInitialPrism, response_sep: "0", response_prism: currentPrismStr, reaction_time: rt, stereo: currentStereo.toFixed(2), size: currentSize.toFixed(1), status: statusLabel, eye: taskEye });

    if (!isAIRescueActive) {
        if(statusTimeout) clearTimeout(statusTimeout);
        statusTimeout = setTimeout(() => { if (isRunning && statusText) { statusText.innerText = isTestModeActive ? "TEST MODE ACTIVE" : "TRAINING"; statusText.style.color = isTestModeActive ? "#deff9a" : '#e11d48'; } }, 2000);
    }
}

function activateAIRescue(reasonMsg) {
    if (loginOverlay.style.display !== 'none' || !isRunning || isAIRescueActive) return;
    isAIRescueActive = true; aiRescueStartTime = performance.now();
    originalSizeBeforeRescue = currentSize; originalPrismBeforeRescue = parseFloat(prismSlider ? prismSlider.value : 0); protocolTimePausedVal = protocolTime; 
    if(prismSlider) { prismSlider.value = (originalPrismBeforeRescue * 0.4).toFixed(1); prismSlider.dispatchEvent(new Event('input')); }
    updateScaleAndThickness(Math.min(600, currentSize * 1.5)); updateUIValues(); protocolTime = -999999; 
    if(statusText) { statusText.innerText = `⚠️ AI 介入：稜鏡減壓啟動 | 原因: ${reasonMsg.split('|')[0].trim()}`; statusText.style.color = '#facc15'; }
    if(dynamicModeTag) { dynamicModeTag.innerText = `[ AI RESCUE ACTIVE ] Colddown: 15s | Vergence Recovery...`; dynamicModeTag.style.color = '#facc15'; }
}

function endAIRescue() {
    if (!isAIRescueActive) return;
    isAIRescueActive = false; protocolTime = protocolTimePausedVal; currentSize = originalSizeBeforeRescue; 
    if(prismSlider) { prismSlider.value = originalPrismBeforeRescue.toFixed(1); prismSlider.dispatchEvent(new Event('input')); }
    updateScaleAndThickness(); updateUIValues(); 
    if(statusText) { statusText.innerText = isTestModeActive ? "TEST MODE ACTIVE" : "TRAINING"; statusText.style.color = isTestModeActive ? "#deff9a" : '#e11d48'; }
    if(activeProtocol && dynamicModeTag) {
        const config = AIM_MATRIX[activeProtocol][protocolStage]; 
        const stageMaxStr = AIM_MATRIX[activeProtocol] ? AIM_MATRIX[activeProtocol].length : 10;
        dynamicModeTag.innerText = `[ ${PROTOCOL_NAMES[activeProtocol].split(' ')[0]} ] Stage ${protocolStage + 1}/${stageMaxStr} : ${config.name}`;
        dynamicModeTag.style.color = '#deff9a';
    }
}

function showClinicalReport(logs, totalTime, protocolName) {
    let fusionCount = 0, suppCount = 0, antiSuppCount = 0, boFail = 0, biFail = 0, vertFail = 0;
    let tableRowsHTML = "";
    logs.forEach(log => {
        if(log.status.includes('FUSION')) fusionCount++;
        if(log.status.includes('SUPP_') && !log.status.includes('ANTI')) suppCount++;
        if(log.status.includes('ANTI_SUPP')) antiSuppCount++;
        if(log.status.includes('BO_FAIL')) boFail++;
        if(log.status.includes('BI_FAIL')) biFail++;
        if(log.status.includes('VERT_FAIL')) vertFail++;
        let statusColor = log.status.includes('FUSION') || log.status.includes('ANTI') ? '#10b981' : (log.status.includes('SUPP') ? '#f59e0b' : '#ef4444');
        tableRowsHTML += `<tr style="border-bottom: 1px solid #e2e8f0; font-size:13px; text-align:center;"><td style="padding: 8px;">${log.time}s</td><td style="padding: 8px; font-weight:bold; color:${statusColor};">${log.status.split('(')[0]}</td><td style="padding: 8px; font-size:12px; color:#64748b;">${log.initial_prism}</td><td style="padding: 8px; font-weight:bold; color:#0f172a;">${log.response_prism}</td><td style="padding: 8px; font-family:monospace;">${log.reaction_time}s</td></tr>`;
    });

    const reportOverlay = document.createElement('div');
    reportOverlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15, 23, 42, 0.8); backdrop-filter:blur(5px); z-index:10000; display:flex; justify-content:center; align-items:center; font-family:sans-serif;";
    reportOverlay.innerHTML = `
        <div style="background:#ffffff; width: 650px; max-height: 85vh; border-radius:12px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); display:flex; flex-direction:column; overflow:hidden;">
            <div style="background:#4A90E2; color:white; padding: 20px; text-align:center;"><h2 style="margin:0; font-size:22px; letter-spacing:1px;">AXP 臨床視覺診療報告</h2><p style="margin:5px 0 0 0; opacity:0.8; font-size:14px;">病患代碼: ${currentPatientCode}</p></div>
            <div style="padding: 20px; overflow-y:auto; flex-grow:1; color:#334155;">
                <div style="display:flex; justify-content:space-between; margin-bottom: 20px; background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0;"><div><p style="margin:0 0 5px 0; font-size:12px; color:#64748b; font-weight:bold;">訓練總時長</p><p style="margin:0; font-size:18px; font-weight:bold; color:#0f172a;">${Math.floor(totalTime / 60)}分 ${totalTime % 60}秒</p></div><div style="text-align:right;"><p style="margin:0 0 5px 0; font-size:12px; color:#64748b; font-weight:bold;">訓練模組</p><p style="margin:0; font-size:14px; font-weight:bold; color:#0f172a;">${protocolName.split(' ')[0]}</p></div></div>
                <h3 style="font-size:15px; margin-bottom:10px; color:#4A90E2; border-bottom:1px solid #e2e8f0; padding-bottom:5px;">📊 綜合表現分析</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
                    <div style="background:#ecfdf5; padding:10px; border-radius:6px; border:1px solid #a7f3d0;"><span style="font-size:12px; color:#059669; font-weight:bold;">🟢 完美融像次數</span><br><span style="font-size:20px; font-weight:bold; color:#065f46;">${fusionCount}</span></div>
                    <div style="background:#ecfdf5; padding:10px; border-radius:6px; border:1px solid #a7f3d0;"><span style="font-size:12px; color:#059669; font-weight:bold;">🟢 去抑制成功</span><br><span style="font-size:20px; font-weight:bold; color:#065f46;">${antiSuppCount}</span></div>
                    <div style="background:#fef2f2; padding:10px; border-radius:6px; border:1px solid #fecaca;"><span style="font-size:12px; color:#dc2626; font-weight:bold;">🔴 聚合不足 (BO 破裂)</span><br><span style="font-size:20px; font-weight:bold; color:#991b1b;">${boFail}</span></div>
                    <div style="background:#fef2f2; padding:10px; border-radius:6px; border:1px solid #fecaca;"><span style="font-size:12px; color:#dc2626; font-weight:bold;">🔴 開散不足 (BI 破裂)</span><br><span style="font-size:20px; font-weight:bold; color:#991b1b;">${biFail}</span></div>
                    <div style="background:#fffbeb; padding:10px; border-radius:6px; border:1px solid #fde68a;"><span style="font-size:12px; color:#d97706; font-weight:bold;">⚫ 單通道抑制發生</span><br><span style="font-size:20px; font-weight:bold; color:#b45309;">${suppCount}</span></div>
                    <div style="background:#fef2f2; padding:10px; border-radius:6px; border:1px solid #fecaca;"><span style="font-size:12px; color:#dc2626; font-weight:bold;">🔴 垂直融像破裂</span><br><span style="font-size:20px; font-weight:bold; color:#991b1b;">${vertFail}</span></div>
                </div>
                <h3 style="font-size:15px; margin-bottom:10px; color:#4A90E2; border-bottom:1px solid #e2e8f0; padding-bottom:5px;">📋 計量級測驗明細</h3>
                <table style="width:100%; border-collapse: collapse;"><thead><tr style="background:#f1f5f9; font-size:12px; color:#64748b;"><th style="padding:8px; text-align:center;">時間點</th> <th style="padding:8px; text-align:center;">判定狀態</th><th style="padding:8px; text-align:center;">出現時($T_0$)</th> <th style="padding:8px; text-align:center;">按下時($T_{resp}$)</th><th style="padding:8px; text-align:center;">反應時間</th></tr></thead><tbody>${tableRowsHTML || '<tr><td colspan="5" style="text-align:center; padding:10px; color:#94a3b8;">無紀錄</td></tr>'}</tbody></table>
            </div>
            <div style="padding: 15px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; text-align:center;"><button id="close-report-btn" style="background:#D4AF37; color:white; border:none; padding:10px 25px; border-radius:6px; font-size:15px; cursor:pointer; font-weight:bold; transition:0.2s;">關閉並初始化系統</button></div>
        </div>
    `;
    document.body.appendChild(reportOverlay);
    document.getElementById('close-report-btn').addEventListener('click', () => { document.body.removeChild(reportOverlay); executeReset(); });
}

// 💡 寫入 JSON Object Schema
async function uploadToSupabase() {
    if (sessionLogs.length === 0) return alert("尚無測驗數據！");
    
    const finalTime = totalTimerSec; 
    const finalProtocol = activeProtocol ? PROTOCOL_NAMES[activeProtocol] : 'MANUAL_MODE';
    
    const payloadData = {
        patient_id: currentPatientCode,
        environmental_setup: {
            prism_base: document.getElementById('prism-slider')?.value || 0,
            anaglyph_balance: document.getElementById('balance-slider')?.value || 50
        },
        clinical_logs: [...sessionLogs]
    };

    isRunning = false; 
    cancelAnimationFrame(animationId); 
    if(startBtn) { startBtn.innerText = "開始 [ Space ]"; startBtn.classList.remove('active'); }
    if(statusText) { statusText.innerText = "UPLOADING TO SUPABASE..."; statusText.style.color = "#38bdf8"; }
    
    try {
        const { data, error } = await supabase.from('training_sessions').insert([{ 
            duration_sec: finalTime, 
            protocol_name: finalProtocol, 
            raw_data: payloadData,
            patient_code: currentPatientCode  
        }]);
        
        if (error) throw error;
        
        if(statusText) { statusText.innerText = "UPLOAD SUCCESSFUL"; statusText.style.color = "#4ade80"; }
        showClinicalReport(payloadData.clinical_logs, finalTime, finalProtocol);
        sessionLogs = []; 
    } catch (err) {
        console.error("Supabase Upload Error:", err);
        if(statusText) { statusText.innerText = "UPLOAD FAILED"; statusText.style.color = "#f87171"; }
    }
}

function updateGlassesUI() {
    const lLabelText = document.getElementById('l-label-text');
    if (glassesSelect && glassesSelect.value === 'rb') {
        if(greenSlider) greenSlider.style.display = 'none'; if(blueSlider) blueSlider.style.display = 'block';
        if(lLabelText) lLabelText.innerText = '藍光';
    } else {
        if(greenSlider) greenSlider.style.display = 'block'; if(blueSlider) blueSlider.style.display = 'none';
        if(lLabelText) lLabelText.innerText = '綠光';
    }
    updateOpticsFromUI();
}

if(glassesSelect) glassesSelect.addEventListener('change', updateGlassesUI);
[redSlider, greenSlider, blueSlider].forEach(slider => { if(slider) slider.addEventListener('input', updateOpticsFromUI); });
if(prismSlider) prismSlider.addEventListener('input', updateOpticsFromUI);

function updateUIValues() {
    if(sizeLabel) sizeLabel.innerText = currentSize.toFixed(1) + 'px'; 
    if(speedLabel) speedLabel.innerText = currentSpeed.toFixed(1); 
    if(thickLabel) thickLabel.innerText = currentThick.toFixed(1);
    if(stereoLabel) stereoLabel.innerText = (currentStereo > 0 ? '+' : '') + currentStereo.toFixed(2);
    
    const hudStereoVal = document.getElementById('hud-stereo-val');
    if(hudStereoVal) hudStereoVal.innerText = currentStereo.toFixed(2);
    
    let balance = balanceSlider ? parseInt(balanceSlider.value) : 50; 
    if(balanceLabel) balanceLabel.innerText = balance === 50 ? "均衡 50/50" : (balance < 50 ? `副弱 ${balance}%` : `主弱 ${100-balance}%`);
    
    if(sizeSlider) sizeSlider.value = currentSize; 
    if(speedSlider) speedSlider.value = currentSpeed; if(thickSlider) thickSlider.value = currentThick; 
    if(stereoSlider) stereoSlider.value = currentStereo;
}

if (screenSpecSelect) screenSpecSelect.addEventListener('change', () => { updateOpticsFromUI(); });
if (viewDistInput) viewDistInput.addEventListener('input', () => { updateOpticsFromUI(); });

if(sizeSlider) sizeSlider.addEventListener('input', (e) => { currentSize = parseFloat(e.target.value); updateUIValues(); updateScaleAndThickness(); disableAI(); });
if(speedSlider) speedSlider.addEventListener('input', (e) => { currentSpeed = parseFloat(e.target.value); updateUIValues(); disableAI(); });
if(thickSlider) thickSlider.addEventListener('input', (e) => { currentThick = parseFloat(e.target.value); updateUIValues(); buildTargets(); disableAI(); });
if(stereoSlider) stereoSlider.addEventListener('input', (e) => { currentStereo = Math.max(-0.15, Math.min(0.15, parseFloat(e.target.value))); e.target.value = currentStereo; updateUIValues(); if (!isRunning) updatePositions(0, ''); disableAI(); });

if(balanceSlider) balanceSlider.addEventListener('input', () => { updateUIValues(); updateOpticsFromUI(); disableAI(); });
if(rotateCheckbox) rotateCheckbox.addEventListener('change', (e) => { isRotating = e.target.checked; disableAI(); });
if(shapeSelect) shapeSelect.addEventListener('change', buildTargets); 
if(customTextInput) customTextInput.addEventListener('input', buildTargets); 
if(fillCheckbox) fillCheckbox.addEventListener('change', (e) => { isFilled = e.target.checked; buildTargets(); });

function disableAI() {
    if (aiToggle && aiToggle.checked) { aiToggle.checked = false; }
    if(dynamicModeTag) { dynamicModeTag.innerText = "AXP FUSION DYNAMICS (手動模式)"; dynamicModeTag.style.color = '#f8fafc'; }
    
    currentAxis = 'horizontal';
    currentMode = 'crossover';
    
    siloPrompt.style.display = 'none'; 
    if(isAIRescueActive) endAIRescue();
}

function loadMatrixStage(protocol, stage) {
    const config = AIM_MATRIX[protocol][stage]; if (!config) return;
    
    if(shapeSelect) {
        let optionExists = Array.from(shapeSelect.options).some(opt => opt.value === config.shape);
        if (!optionExists) { const newOpt = new Option(`[AI 模式] ${config.shape}`, config.shape); shapeSelect.add(newOpt); }
        shapeSelect.value = config.shape; 
    }
    
    currentAxis = config.axis || 'horizontal';
    currentMode = config.mode || 'crossover';

    if(fillCheckbox) fillCheckbox.checked = config.fill; isFilled = config.fill;
    
    currentStereo = Math.max(-0.15, Math.min(0.15, config.stereo)); 
    currentSize = config.size; currentSpeed = config.speed; currentThick = config.thick;
    isRotating = !config.anim.includes('none'); if(rotateCheckbox) rotateCheckbox.checked = isRotating; 
    
    if(prismSlider) {
        prismSlider.value = config.dist; 
    }

    updateUIValues(); buildTargets();
    
    const stageMaxStr = AIM_MATRIX[protocol] ? AIM_MATRIX[protocol].length : 10;
    if(dynamicModeTag) {
        dynamicModeTag.innerText = `[ ${PROTOCOL_NAMES[protocol].split(' ')[0]} ] Stage ${stage + 1}/${stageMaxStr} : ${config.name}`;
        dynamicModeTag.style.color = '#deff9a'; 
    }
    protocolTime = 0; flipperTimer = 0; currentSaccadeX = 0; currentSaccadeY = 0; saccadeTimer = 0; currentRoamX = 0; currentRoamY = 0;
}

function toggleFullScreen() {
    const elem = document.getElementById('fv-fusion-app');
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (elem.requestFullscreen) { elem.requestFullscreen(); } else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); } 
    } else {
        if (document.exitFullscreen) { document.exitFullscreen(); } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
    }
}

if(fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullScreen);

// ==========================================
// 🚀 動態動畫與矩陣渲染迴圈
// ==========================================
function animate(time) {
    if (!isRunning) return;
    if (!lastTime) lastTime = time; const dt = time - lastTime; lastTime = time;
    if (Math.floor(time / 1000) > Math.floor((time - dt) / 1000)) {
        totalTimerSec++; 
        if(timerDisplay) timerDisplay.innerText = Math.floor(totalTimerSec / 60).toString().padStart(2, '0') + ':' + (totalTimerSec % 60).toString().padStart(2, '0');
    }
    const speedFactor = 40000 / Math.max(1, currentSpeed); phase += dt / speedFactor; 

    if (isTestModeActive) {
        if (!taskActive) { timeSinceLastTask += dt; if (timeSinceLastTask > nextTaskInterval) spawnTask(); } 
        else { if (performance.now() - taskSpawnTime > 8000) handleTaskResult('miss'); }
    }

    if (isAIRescueActive) {
        const timeInRescue = performance.now() - aiRescueStartTime;
        if (timeInRescue > 15000) { endAIRescue(); } 
        else { const timeLeft = Math.ceil((15000 - timeInRescue) / 1000); if(dynamicModeTag) dynamicModeTag.innerText = `[ AI RESCUE ACTIVE ] Colddown: ${timeLeft}s | Vergence Recovery...`; }
    }

    let currentAnim = '';

    if (aiToggle && aiToggle.checked && activeProtocol && !isAIRescueActive) {
        protocolTime += dt; const config = AIM_MATRIX[activeProtocol][protocolStage]; currentAnim = config.anim || ''; 
        
        if (currentAnim.includes('breathing_fractal')) {
            const breathScale = currentSize + (currentSize * 0.2 * Math.sin(phase));
            updateScaleAndThickness(breathScale);
        }

        if (currentAnim.includes('silo_text')) {
            siloPrompt.style.display = 'block';
            let sineVal = Math.sin(phase);
            if (sineVal > 0) {
                siloPrompt.innerText = "提示：目標正在變小，代表它正在靠近你！請慢慢吐氣 😮‍💨";
                siloPrompt.style.color = "#ef4444"; siloPrompt.style.borderColor = "#ef4444";
            } else {
                siloPrompt.innerText = "提示：目標正在變大，代表它正在遠離你！請深深吸氣 😌";
                siloPrompt.style.color = "#3b82f6"; siloPrompt.style.borderColor = "#3b82f6";
            }
            updateScaleAndThickness(currentSize * (1 - sineVal * 0.3));
        } else {
            siloPrompt.style.display = 'none';
        }

        if (currentAnim.includes('balanceDrift')) {
            const drift = Math.sin(protocolTime / 1500) * 0.4 + 0.6; 
            targetLeft.traverse(c => { if(c.isMesh) c.material.opacity = drift; }); targetRight.traverse(c => { if(c.isMesh) c.material.opacity = 1.2 - drift; });
        }
        if (currentAnim.includes('flicker')) {
            let flickerSpeed = currentAnim.includes('heavy') ? 100 : (currentAnim.includes('medium') ? 250 : 500);
            let isRedTurn = Math.floor(protocolTime / flickerSpeed) % 2 === 0;
            targetLeft.traverse(c => { if(c.isMesh) c.material.opacity = isRedTurn ? 1 : 0.05; });
            targetRight.traverse(c => { if(c.isMesh) c.material.opacity = isRedTurn ? 0.05 : 1; });
        } else if (!currentAnim.includes('balanceDrift')) {
            targetLeft.traverse(c => { if(c.isMesh) c.material.opacity = 1; }); targetRight.traverse(c => { if(c.isMesh) c.material.opacity = 1; });
        }

        if (currentAnim.includes('flipper')) {
            let delay = currentAnim.includes('slow') ? 3000 : 1500;
            flipperTimer += dt;
            if (flipperTimer > delay) { flipperState = !flipperState; flipperTimer = 0; }
        }
        
        if (currentAnim.includes('text_') && shapeSelect && shapeSelect.value === 'text') {
            if (time - lastWordChangeTime > 3500) {
                lastWordChangeTime = time;
                currentWordIndex = (currentWordIndex + 1) % AXP_WORDS.length;
                if(customTextInput) customTextInput.value = AXP_WORDS[currentWordIndex];
                buildTargets(); 
            }
        }

        const maxStages = AIM_MATRIX[activeProtocol] ? AIM_MATRIX[activeProtocol].length : 10;
        if (protocolTime > 60000) { protocolStage = (protocolStage + 1) % maxStages; loadMatrixStage(activeProtocol, protocolStage); }
    }

    const isRoamActive = currentAnim.includes('roam') || (!aiToggle.checked && currentAxis === 'roam');
    const isSaccadeActive = currentAnim.includes('saccade') || (!aiToggle.checked && currentAxis === 'saccade');

    if (isRoamActive) {
        currentRoamX = Math.sin(time / 3000) * 350;
        currentRoamY = Math.cos(time / 2100) * 250;
    } else {
        currentRoamX = 0; currentRoamY = 0;
    }

    if (currentAnim.includes('starfield')) {
        let starSpeed = currentAnim.includes('fast') ? 0.005 : 0.002;
        let rotDir = currentAnim.includes('ccw') ? 1 : -1; 
        starsLeft.rotation.z += starSpeed * rotDir; starsRight.rotation.z += starSpeed * rotDir;
    } else { 
        starsLeft.rotation.z = 0; starsRight.rotation.z = 0; 
    }

    if (isSaccadeActive) {
        saccadeTimer += dt; 
        if (saccadeTimer > 1500) { 
            saccadeTimer = 0; 
            currentSaccadeX = (Math.random() > 0.5 ? 1 : -1) * (150 + Math.random() * 200); 
            currentSaccadeY = (Math.random() > 0.5 ? 1 : -1) * (100 + Math.random() * 150); 
        }
    } else {
        currentSaccadeX = 0; currentSaccadeY = 0;
    }

    if(targetLeft && targetRight) {
        targetLeft.children.forEach((layer, index) => { 
            // 🚀 新武器動態擾動與本體自轉判定
            if (shapeSelect && (shapeSelect.value.includes('crystal') || shapeSelect.value.includes('sphere') || shapeSelect.value === 'nested_dodeca' || shapeSelect.value === 'torusKnot') && isRotating) { 
                layer.rotation.x += (index % 2 === 0 ? 0.01 : -0.01); 
                layer.rotation.y += 0.015; 
            } 
        });
        targetRight.children.forEach((layer, index) => { 
            if (shapeSelect && (shapeSelect.value.includes('crystal') || shapeSelect.value.includes('sphere') || shapeSelect.value === 'nested_dodeca' || shapeSelect.value === 'torusKnot') && isRotating) { 
                layer.rotation.x += (index % 2 === 0 ? 0.01 : -0.01); 
                layer.rotation.y += 0.015; 
            } 
        });
    }
    
    updatePositions(phase, currentAnim); 
    
    // 🚀 CTO 修正：強制鎖死 text 的旋轉，維持高頻空間視網膜成像的銳利度
    if (isRotating && shapeSelect?.value !== 'text') { 
        targetLeft.rotation.z = phase * 0.5; 
        targetRight.rotation.z = phase * 0.5; 
    } else if (shapeSelect?.value === 'text') {
        targetLeft.rotation.z = 0;
        targetRight.rotation.z = 0;
    }

    camera.layers.set(1); renderer.setRenderTarget(rtLeft); renderer.clear(); renderer.render(scene, camera);
    camera.layers.set(2); renderer.setRenderTarget(rtRight); renderer.clear(); renderer.render(scene, camera);
    camera.layers.set(0); renderer.setRenderTarget(null); renderer.render(postScene, postCamera);

    animationId = requestAnimationFrame(animate);
}

function toggleTraining() {
    if(loginOverlay.style.display !== 'none') return; 
    isRunning = !isRunning;
    if (isRunning) {
        if(startBtn) { startBtn.innerText = "暫停 [ Space ]"; startBtn.classList.add('active'); }
        if(statusText) { statusText.innerText = isAIRescueActive ? statusText.innerText : (isTestModeActive ? "TEST MODE ACTIVE" : "TRAINING"); statusText.style.color = isAIRescueActive ? '#facc15' : (isTestModeActive ? "#deff9a" : '#e11d48'); }
        lastTime = performance.now(); animate(lastTime);
    } else {
        if(startBtn) { startBtn.innerText = "繼續 [ Space ]"; startBtn.classList.remove('active'); }
        if(statusText) { statusText.innerText = "PAUSED"; statusText.style.color = '#FCE473'; }
        cancelAnimationFrame(animationId);
        taskActive = false; cueGroupLeft.visible = false; cueGroupRight.visible = false;
        forceRenderFrame();
    }
}

function executeReset() {
    isRunning = false; cancelAnimationFrame(animationId); 
    if(startBtn) { startBtn.innerText = "開始 [ Space ]"; startBtn.classList.remove('active'); }
    if(statusText) { statusText.innerText = "IDLE"; statusText.style.color = '#f8fafc'; }
    totalTimerSec = 0; if(timerDisplay) timerDisplay.innerText = "00:00"; 
    disableAI();
    taskActive = false; isTestModeActive = false; cueGroupLeft.visible = false; cueGroupRight.visible = false;
    consecutiveHits = 0; consecutiveMisses = 0;
    
    currentSize = 200; currentSpeed = 20; currentStereo = 0; currentThick = 9.0;
    currentSaccadeX = 0; currentSaccadeY = 0; currentRoamX = 0; currentRoamY = 0; phase = 0;
    isRotating = true; isFilled = false; sessionLogs = []; isAIRescueActive = false;
    
    if(shapeSelect) shapeSelect.value = 'sphere5'; 
    if(rotateCheckbox) rotateCheckbox.checked = true; 
    if(fillCheckbox) fillCheckbox.checked = false; 
    if(balanceSlider) balanceSlider.value = 50;
    if(prismSlider) prismSlider.value = 0;
    
    if(redSlider) redSlider.value = 100; 
    if(greenSlider) greenSlider.value = 100; 
    if(blueSlider) blueSlider.value = 100;
    
    updateUIValues(); buildTargets(); updatePositions(0, '');
    forceRenderFrame();
}

if(startBtn) startBtn.addEventListener('click', toggleTraining); 
if(resetBtn) resetBtn.addEventListener('click', executeReset);

document.addEventListener('keydown', (e) => {
    if(loginOverlay.style.display !== 'none') return; 

    const activeTag = document.activeElement ? document.activeElement.tagName : '';
    const activeType = document.activeElement ? document.activeElement.type : '';
    if (activeTag === 'INPUT' && (activeType === 'text' || activeType === 'number')) {
        return;
    }

    const code = e.code;
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
        e.preventDefault();
        if (taskActive && isRunning && isTestModeActive) { const rt = ((performance.now() - taskSpawnTime) / 1000).toFixed(2); if (code === taskDirection) handleTaskResult('hit', rt); else handleTaskResult('wrong', rt); }
        return;
    }

    const shortcuts = ['Space', 'Enter', 'KeyE', 'KeyW', 'KeyS', 'KeyD', 'KeyA', 'KeyF', 'KeyR', 'KeyG', 'KeyZ', 'Digit0', 'Numpad0', 'Digit1', 'Digit2', 'Numpad1', 'Numpad2', 'BracketLeft', 'BracketRight', 'Comma', 'Period', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'KeyQ'];
    if (shortcuts.includes(code)) {
        e.preventDefault(); if (document.activeElement) document.activeElement.blur(); 
        switch(code) {
            case 'Space': toggleTraining(); break; 
            case 'Enter': executeReset(); break; 
            case 'KeyE': if(controlPanel) { controlPanel.style.display = controlPanel.style.display === 'none' ? 'flex' : 'none'; setTimeout(onWindowResize, 50); } break;
            case 'KeyG': uploadToSupabase(); break; 
            case 'KeyZ': 
                if(aiToggle) { 
                    aiToggle.checked = !aiToggle.checked; 
                    if (!aiToggle.checked) { disableAI(); } 
                    else { if (!activeProtocol) { activeProtocol = 'KeyY'; protocolStage = 0; } loadMatrixStage(activeProtocol, protocolStage); }
                } 
                break;
            case 'KeyQ': toggleFullScreen(); break; 
            case 'Digit0': case 'Numpad0':
                if (isAIRescueActive) { 
                    if(statusText) {
                        statusText.innerText = "急救中禁用測驗"; 
                        statusText.style.color = "#facc15"; 
                        setTimeout(() => { if(statusText.innerText === "急救中禁用測驗") { statusText.innerText = isRunning ? "TRAINING" : "IDLE"; statusText.style.color = isRunning ? '#e11d48' : '#f8fafc'; } }, 2000);
                    }
                    break; 
                }
                isTestModeActive = !isTestModeActive;
                if (!isTestModeActive) { 
                    taskActive = false; cueGroupLeft.visible = false; cueGroupRight.visible = false; 
                    if (isRunning && statusText) { statusText.innerText = "TRAINING"; statusText.style.color = '#e11d48'; } 
                } else { 
                    if (isRunning && statusText) { statusText.innerText = "TEST MODE ACTIVE"; statusText.style.color = '#deff9a'; } 
                }
                break;
            
            case 'Digit1': case 'Numpad1': 
                if(prismSlider) { prismSlider.value = Math.max(parseFloat(prismSlider.min), parseFloat(prismSlider.value) - 0.5).toFixed(1); prismSlider.dispatchEvent(new Event('input')); }
                break;
            case 'Digit2': case 'Numpad2': 
                if(prismSlider) { prismSlider.value = Math.min(parseFloat(prismSlider.max), parseFloat(prismSlider.value) + 0.5).toFixed(1); prismSlider.dispatchEvent(new Event('input')); }
                break;
                
            case 'BracketRight': if(stereoSlider) { stereoSlider.value = Math.min(0.15, parseFloat(stereoSlider.value) + 0.01).toFixed(2); stereoSlider.dispatchEvent(new Event('input')); } break;
            case 'BracketLeft': if(stereoSlider) { stereoSlider.value = Math.max(-0.15, parseFloat(stereoSlider.value) - 0.01).toFixed(2); stereoSlider.dispatchEvent(new Event('input')); } break;
            case 'Period': if(speedSlider) { speedSlider.value = Math.min(100, parseFloat(speedSlider.value) + (e.shiftKey ? 10 : 1)); speedSlider.dispatchEvent(new Event('input')); } break;
            case 'Comma': if(speedSlider) { speedSlider.value = Math.max(1, parseFloat(speedSlider.value) - (e.shiftKey ? 10 : 1)); speedSlider.dispatchEvent(new Event('input')); } break;
            
            case 'KeyW': currentSize = Math.min(600, currentSize + 10); updateUIValues(); buildTargets(); if(!isAIRescueActive) disableAI(); break;
            case 'KeyS': currentSize = Math.max(50, currentSize - 10); updateUIValues(); buildTargets(); if(!isAIRescueActive) disableAI(); break;
            
            case 'KeyD': currentThick = Math.min(10, currentThick + 1.0); updateUIValues(); buildTargets(); if(!isAIRescueActive) disableAI(); break;
            case 'KeyA': currentThick = Math.max(1, currentThick - 1.0); updateUIValues(); buildTargets(); if(!isAIRescueActive) disableAI(); break;
            case 'KeyF': if(fillCheckbox) { fillCheckbox.checked = !fillCheckbox.checked; fillCheckbox.dispatchEvent(new Event('change')); } break;
            case 'KeyR': if(rotateCheckbox) { rotateCheckbox.checked = !rotateCheckbox.checked; rotateCheckbox.dispatchEvent(new Event('change')); } break;
            case 'KeyY': case 'KeyU': case 'KeyI': case 'KeyO': case 'KeyP':
                if (isAIRescueActive) { alert("AI 急救代管中，無法切換 Program。"); break; }
                if(aiToggle) aiToggle.checked = true; 
                const maxStages = AIM_MATRIX[code] ? AIM_MATRIX[code].length : 10;
                if (activeProtocol === code && isRunning) { protocolStage = (protocolStage + 1) % maxStages; } else { activeProtocol = code; protocolStage = 0; }
                loadMatrixStage(activeProtocol, protocolStage); if (!isRunning) toggleTraining(); break;
        }
    }
});

updateGlassesUI(); updateUIValues(); buildTargets();

function onWindowResize() {
    const width = container.clientWidth; const height = container.clientHeight;
    camera.left = -d * (width / height); camera.right = d * (width / height); camera.updateProjectionMatrix();
    renderer.setSize(width, height); rtLeft.setSize(width, height); rtRight.setSize(width, height);
    forceRenderFrame();
}
window.addEventListener('resize', onWindowResize); setTimeout(onWindowResize, 100);
