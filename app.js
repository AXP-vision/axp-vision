// app.js - AXP Fusion Dynamics (v24.0 - 凡特錫臨床神經視光黑金旗艦版)
// 核心升級：
// 1. 植入「雙眼同視八角太空艙周邊定錨框 (Peripheral Fusion Lock)」與「10秒迷走神經呼吸同調光環」
// 2. 支援 dichoptic_lock 左眼外框／右眼核心之雙眼分視互補渲染，並每 8 秒自動交換左右眼角色防止單側疲勞
// 3. 升級 [Z] 鍵為「AI 動態自適應闖關教練」，依方向鍵答題正確率即時升降難度並隨機變換視標
// 4. 支援 13" / 16" / 24" / 27" / 32" 真實螢幕物理寬度稜鏡度換算，並完成 100% 醫療法規詞彙消毒

import { AIM_MATRIX, PROTOCOL_NAMES } from './matrix.js';
import { createTarget } from './shapes.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// === SaaS 後端資料庫配置 ===
const supabaseUrl = 'https://wvholwcyrldixlsgoege.supabase.co';
const supabaseKey = 'sb_publishable_BozJ84tPQF-jBHGKtXKqgw_ELodM54e';
const supabase = createClient(supabaseUrl, supabaseKey);

// === VIP 專屬授權登入介面 (凡特錫深海藍 × 醫療尊爵金，去除「病患/診療」等醫療違規詞) ===
let currentPatientCode = 'VIP-GUEST';
const loginOverlay = document.createElement('div');
loginOverlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:radial-gradient(circle at 50% 30%, #1a365d 0%, #070b14 90%); z-index:9999; display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:'Noto Sans TC', sans-serif;";
loginOverlay.innerHTML = `
    <div style="background:rgba(15, 23, 42, 0.9); padding:45px 40px; border-radius:16px; text-align:center; box-shadow: 0 25px 60px rgba(0,0,0,0.6); border: 1px solid rgba(212, 175, 55, 0.45); border-top: 4px solid #D4AF37; max-width: 420px; width: 90%;">
        <div style="color:#D4AF37; font-size:12px; font-weight:800; letter-spacing:2px; margin-bottom:8px;">FANTASTIC VISION LAB</div>
        <h1 style="color:#ffffff; font-size:26px; font-weight:900; letter-spacing:1.5px; margin-bottom:8px;">AXP FUSION <span style="color:#D4AF37;">PRO</span></h1>
        <p style="color:#94a3b8; margin-bottom:28px; font-size:14px; font-weight:500;">高階雙眼融像與視覺空間動態優化系統</p>
        <p style="margin-bottom:12px; font-size:13.5px; font-weight:700; color:#cbd5e1;">請輸入您的 VIP 個案專屬授權碼</p>
        <input type="text" id="patient-code-input" placeholder="例如: FV-0123" style="background-color:#0f172a; padding:13px; width:100%; text-align:center; border-radius:8px; border:1.5px solid #334155; margin-bottom:22px; font-size:16px; font-weight:800; color:#D4AF37; outline:none; transition:0.2s; letter-spacing:1px;">
        <button id="login-btn" style="background:linear-gradient(135deg, #D4AF37 0%, #b89225 100%); color:#0f172a; border:none; padding:14px 30px; width:100%; border-radius:8px; font-size:16px; cursor:pointer; font-weight:900; transition:0.3s; box-shadow: 0 8px 20px rgba(212, 175, 55, 0.25);">驗證授權並啟動系統</button>
    </div>
`;
document.body.appendChild(loginOverlay);

function performLogin() {
    const code = document.getElementById('patient-code-input')?.value.trim();
    if(!code) return alert("請輸入有效的 VIP 個案授權碼！");
    currentPatientCode = code.toUpperCase(); 
    loginOverlay.style.display = 'none'; 
}

document.getElementById('login-btn')?.addEventListener('click', performLogin);
const inputField = document.getElementById('patient-code-input');
if(inputField) {
    inputField.addEventListener('focus', () => { inputField.style.borderColor = '#D4AF37'; });
    inputField.addEventListener('blur', () => { inputField.style.borderColor = '#334155'; });
    inputField.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); performLogin(); } });
}

// === DOM 元素綁定 ===
const container = document.getElementById('webgl-container');
const controlPanel = document.querySelector('.control-panel'); 
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const reportBtn = document.getElementById('report-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const statusText = document.getElementById('status-text');
const hudScoreVal = document.getElementById('hud-score-val');

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
const stageIndicatorLabel = document.getElementById('stage-indicator-label');
const btnTestMode = document.getElementById('btn-test-mode');
const breathIndicator = document.getElementById('breath-indicator');
const breathText = document.getElementById('breath-text');

const siloPrompt = document.createElement('div');
siloPrompt.id = 'silo-prompt';
siloPrompt.style.cssText = "position:absolute; bottom:68px; left:50%; transform:translateX(-50%); font-size:16px; font-weight:800; letter-spacing:1.5px; background:rgba(15, 23, 42, 0.88); backdrop-filter:blur(8px); padding:10px 22px; border-radius:10px; border:1.5px solid #D4AF37; color:#f8fafc; z-index:100; display:none; text-align:center; pointer-events:none;";
document.getElementById('arena').appendChild(siloPrompt);

// === 核心狀態變數 ===
let isRunning = false, animationId;
let currentSize = 280, currentSpeed = 18, currentStereo = 0.02, currentThick = 8.0;
let currentDistractors = 0; 
let isRotating = true, isFilled = false;
let activeProtocol = null, protocolStage = 0, protocolTime = 0, totalTimerSec = 0, lastTime = 0, phase = 0;
let currentSaccadeX = 0, currentSaccadeY = 0, saccadeTimer = 0, currentRoamX = 0, currentRoamY = 0;
let dichopticSwapState = false; // 每 8 秒自動交換左右眼互補組件，平衡雙眼負荷

let currentAxis = 'horizontal';
let currentMode = 'crossover';

let sessionLogs = [];
let sessionScore = 0;
let isTestModeActive = false, taskActive = false;
let taskDirection = '', taskEye = 'both', taskSpawnTime = 0, timeSinceLastTask = 0, nextTaskInterval = 2800, statusTimeout = null;
let taskInitialPrism = "";

let consecutiveHits = 0;
let consecutiveMisses = 0;
let isAIRescueActive = false;
let aiRescueStartTime = 0;
let originalSizeBeforeRescue = 280;
let originalPrismBeforeRescue = 0; 
let protocolTimePausedVal = 0;

let flipperTimer = 0;
let flipperState = true; 

const AXP_WORDS = ['H O T V', 'Z R K D', 'E M C W', 'S N E L', 'O S V D', 'N H Z O', 'A X 7 P', '9 Q 2 M'];
let currentWordIndex = 0;
let lastWordChangeTime = 0;

// ==========================================
// 核心圖學：Layer Masking 雙通道渲染引擎
// ==========================================
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');
const aspect = container.clientWidth / container.clientHeight;
const d = 500; 
const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
camera.position.set(0, 0, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
container.appendChild(renderer.domElement);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.45); 
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
        "intensityRight": { value: 1.0 }
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

// =========================================================================
// 🔬 升級背景架構：1. 雙眼同視八角太空艙周邊定錨框 (Peripheral Fusion Lock)
//                  2. 零視差深空微光星塵 (消除舊版紅藍交錯假性融像)
//                  3. 迷走神經 10 秒呼吸同調光環 (Polyvagal Breathing Halo)
// =========================================================================
const peripheralLockGroup = new THREE.Group();
const frameMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.16 });
// 外圍雙眼同視八角定錨環 (同時開啟 Layer 1 與 Layer 2，零視差穩定周邊視野)
const octFrame = new THREE.Mesh(new THREE.RingGeometry(430, 434, 8), frameMat);
octFrame.rotation.z = Math.PI / 8;
octFrame.layers.enable(1); octFrame.layers.enable(2);
peripheralLockGroup.add(octFrame);

// 四向水平與垂直地平線微光刻度
for (let a = 0; a < 4; a++) {
    const tick = new THREE.Mesh(new THREE.PlaneGeometry(28, 2.5), frameMat);
    const angle = (a * Math.PI) / 2;
    tick.position.set(Math.cos(angle) * 415, Math.sin(angle) * 415, -50);
    tick.rotation.z = angle;
    tick.layers.enable(1); tick.layers.enable(2);
    peripheralLockGroup.add(tick);
}

// 迷走神經 10 秒呼吸同調光環 (隨呼吸緩慢收放，引導雙眼放鬆不憋氣)
const breathHaloMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.09 });
const breathHaloMesh = new THREE.Mesh(new THREE.RingGeometry(190, 198, 64), breathHaloMat);
breathHaloMesh.position.z = -80;
breathHaloMesh.layers.enable(1); breathHaloMesh.layers.enable(2);
peripheralLockGroup.add(breathHaloMesh);
scene.add(peripheralLockGroup);

// 零視差微光深空星塵 (僅 70 顆，提供環境深度感而不產生紅藍重影干擾)
const starCanvas = document.createElement('canvas');
starCanvas.width = 32; starCanvas.height = 32;
const starCtx = starCanvas.getContext('2d');
starCtx.beginPath(); starCtx.arc(16, 16, 12, 0, Math.PI * 2); starCtx.fillStyle = 'white'; starCtx.fill();
const starTexture = new THREE.CanvasTexture(starCanvas);

const starsCount = 70; 
const posArrayCommon = new Float32Array(starsCount * 3);
for(let i = 0; i < starsCount; i++) {
    posArrayCommon[i*3] = (Math.random() - 0.5) * 1500;
    posArrayCommon[i*3+1] = (Math.random() - 0.5) * 1200;
    posArrayCommon[i*3+2] = -300 - Math.random() * 500;
}
const starsGeo = new THREE.BufferGeometry();
starsGeo.setAttribute('position', new THREE.BufferAttribute(posArrayCommon, 3));
const starMat = new THREE.PointsMaterial({ size: 4.2, map: starTexture, transparent: true, opacity: 0.32, color: 0xffffff, depthWrite: false });
const starsCommon = new THREE.Points(starsGeo, starMat);
starsCommon.layers.enable(1); starsCommon.layers.enable(2);
scene.add(starsCommon);

let targetLeft, targetRight;
let distractorGroupLeft = new THREE.Group();
let distractorGroupRight = new THREE.Group();
let distractorData = []; 

// 方向鍵測驗閃爍提示點
const cueGroupLeft = new THREE.Group();
const cueGroupRight = new THREE.Group();
const cueOutlineGeo = new THREE.CircleGeometry(1.4, 32);
const cueOutlineMat = new THREE.MeshBasicMaterial({ color: 0x000000, depthTest: false, depthWrite: false });
const cueDotGeo = new THREE.CircleGeometry(1, 32); 
const cueDotMat = new THREE.MeshBasicMaterial({ color: 0xffffff, depthTest: false, depthWrite: false }); 

const outlineLeft = new THREE.Mesh(cueOutlineGeo, cueOutlineMat);
const outlineRight = new THREE.Mesh(cueOutlineGeo, cueOutlineMat);
const dotLeft = new THREE.Mesh(cueDotGeo, cueDotMat); 
const dotRight = new THREE.Mesh(cueDotGeo, cueDotMat);

outlineLeft.renderOrder = 998; outlineRight.renderOrder = 998;
dotLeft.renderOrder = 999; dotRight.renderOrder = 999;
outlineLeft.layers.set(1); dotLeft.layers.set(1);
outlineRight.layers.set(2); dotRight.layers.set(2);

cueGroupLeft.add(outlineLeft, dotLeft);
cueGroupRight.add(outlineRight, dotRight);
cueGroupLeft.visible = false; cueGroupRight.visible = false; 
scene.add(cueGroupLeft, cueGroupRight, distractorGroupLeft, distractorGroupRight);

function forceRenderFrame() {
    if (isRunning) return; 
    camera.layers.set(1); renderer.setRenderTarget(rtLeft); renderer.clear(); renderer.render(scene, camera);
    camera.layers.set(2); renderer.setRenderTarget(rtRight); renderer.clear(); renderer.render(scene, camera);
    camera.layers.set(0); renderer.setRenderTarget(null); renderer.render(postScene, postCamera);
}

// 計算跨螢幕尺寸之精準物理像素轉換比 (cm per CSS pixel)
function getPhysicalPixelToCm() {
    const spec = screenSpecSelect ? screenSpecSelect.value : 'mbp16';
    const screenWidthMapCm = {
        'laptop14': 30.5,
        'mbp16': 34.5,
        'desktop24': 53.1,
        'desktop27': 59.8,
        'desktop32': 70.8
    };
    const physicalWidthCm = screenWidthMapCm[spec] || 34.5;
    const logicalScreenPx = Math.max(800, window.screen.width || window.innerWidth);
    return physicalWidthCm / logicalScreenPx;
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
        leftColor.setRGB(0.0, 0.45, 1.0);
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
    
    while(distractorGroupLeft.children.length > 0){ 
        const c = distractorGroupLeft.children[0]; c.geometry?.dispose(); c.material?.dispose(); distractorGroupLeft.remove(c); 
    }
    while(distractorGroupRight.children.length > 0){ 
        const c = distractorGroupRight.children[0]; c.geometry?.dispose(); c.material?.dispose(); distractorGroupRight.remove(c); 
    }
    distractorData = [];
}

function buildTargets() {
    clearTargets(); 
    if(textInputGroup) textInputGroup.style.display = shapeSelect?.value === 'text' ? 'block' : 'none';
    const shapeVal = shapeSelect ? shapeSelect.value : 'dichoptic_lock';
    const txtVal = customTextInput ? customTextInput.value : 'H O T V';
    
    const leftRole = dichopticSwapState ? 'right' : 'left';
    const rightRole = dichopticSwapState ? 'left' : 'right';

    targetLeft = createTarget(shapeVal, 0xffffff, isFilled, txtVal, currentThick, leftRole);
    targetRight = createTarget(shapeVal, 0xffffff, isFilled, txtVal, currentThick, rightRole);
    targetLeft.traverse(c => { c.layers.set(1); if(c.isMesh) { c.material.blending = THREE.NormalBlending; c.material.color.setHex(0xffffff); } });
    targetRight.traverse(c => { c.layers.set(2); if(c.isMesh) { c.material.blending = THREE.NormalBlending; c.material.color.setHex(0xffffff); } });

    if (currentDistractors > 0) {
        const distMatLeft = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.3 });
        const distMatRight = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4, metalness: 0.3 });
        
        const geoPool = [
            new THREE.OctahedronGeometry(1.2, 0),
            new THREE.TorusGeometry(0.9, 0.35, 16, 32),
            new THREE.DodecahedronGeometry(1.1, 0)
        ];

        for (let i = 0; i < currentDistractors; i++) {
            const geo = geoPool[i % geoPool.length];
            const meshL = new THREE.Mesh(geo, distMatLeft);
            const meshR = new THREE.Mesh(geo, distMatRight);
            meshL.layers.set(1); meshR.layers.set(2);
            distractorGroupLeft.add(meshL); distractorGroupRight.add(meshR);
            
            distractorData.push({
                phaseOffset: (i * Math.PI * 2) / currentDistractors,
                speedMultiplier: 0.5 + (i % 3) * 0.25,
                orbitRadiusX: 190 + (i * 45),
                orbitRadiusY: 140 + (i * 35),
                zOffset: (i % 2 === 0 ? 1 : -1) * 60,
                baseSize: 38
            });
        }
    }

    updateScaleAndThickness(); 
    scene.add(targetLeft, targetRight); 
    updateOpticsFromUI(); 
}

function updateScaleAndThickness(dynamicSize = currentSize) {
    const scaleFactor = dynamicSize / 200;
    if(targetLeft && targetRight) { 
        targetLeft.scale.set(scaleFactor, scaleFactor, scaleFactor); 
        targetRight.scale.set(scaleFactor, scaleFactor, scaleFactor); 
    }

    for (let i = 0; i < currentDistractors; i++) {
        if(distractorGroupLeft.children[i]) {
            const dSize = distractorData[i].baseSize * scaleFactor * 0.65;
            distractorGroupLeft.children[i].scale.set(dSize, dSize, dSize);
            distractorGroupRight.children[i].scale.set(dSize, dSize, dSize);
        }
    }

    const cueScale = Math.max(14, dynamicSize * 0.045); 
    cueGroupLeft.scale.set(cueScale, cueScale, 1); 
    cueGroupRight.scale.set(cueScale, cueScale, 1);
    forceRenderFrame();
}

function updatePositions(phaseVal, currentAnim = '') {
    const maxPrismLoad = parseFloat(prismSlider ? prismSlider.value : 0);
    let targetPrismDemand = maxPrismLoad;

    if (isRunning) {
        if (currentAnim.includes('flipper')) {
            targetPrismDemand = flipperState ? maxPrismLoad : -maxPrismLoad * 0.35;
        } else {
            const wave = (Math.sin(phaseVal - Math.PI/2) + 1) / 2; 
            if (currentMode === 'oneway_bo') targetPrismDemand = wave * Math.max(0, maxPrismLoad);
            else if (currentMode === 'oneway_bi') targetPrismDemand = wave * Math.min(0, maxPrismLoad);
            else targetPrismDemand = Math.sin(phaseVal) * maxPrismLoad; 
        }
    }

    const pixelToCm = getPhysicalPixelToCm();
    const viewDistM = (parseFloat(viewDistInput ? viewDistInput.value : 50) || 50) / 100;

    const requiredSeparationCm = targetPrismDemand * viewDistM;
    const totalSeparationPx = requiredSeparationCm / pixelToCm;
    let baseDispX = totalSeparationPx / 2;

    let pxLeftX = 0, pxRightX = 0, pxLeftY = 0, pxRightY = 0;

    if (currentAxis === 'lissajous') {
        pxLeftX = baseDispX + Math.sin(phaseVal) * 220;
        pxRightX = -baseDispX + Math.sin(phaseVal) * 220;
        pxLeftY = Math.sin(phaseVal * 2) * 140;
        pxRightY = pxLeftY;
    }
    else if (currentAxis === 'vertical') {
        pxLeftX = baseDispX; pxRightX = -baseDispX;
        pxLeftY = Math.sin(phaseVal) * 180; pxRightY = pxLeftY;
    } 
    else if (currentAxis === 'circular') {
        const orbitX = Math.cos(phaseVal) * 180; 
        const orbitY = Math.sin(phaseVal) * 180;
        pxLeftX = baseDispX + orbitX; pxRightX = -baseDispX + orbitX; pxLeftY = orbitY; pxRightY = orbitY;
    } 
    else {
        pxLeftX = baseDispX; pxRightX = -baseDispX;
    }

    let finalLeftX = pxLeftX + currentRoamX + currentSaccadeX; let finalLeftY = pxLeftY + currentRoamY + currentSaccadeY;
    let finalRightX = pxRightX + currentRoamX + currentSaccadeX; let finalRightY = pxRightY + currentRoamY + currentSaccadeY;

    const maxVertPx = (1.5 * viewDistM) / pixelToCm;
    if (currentAnim.includes('vertical_tune')) {
        let vFactor = currentAnim.includes('heavy') ? 0.9 : (currentAnim.includes('medium') ? 0.6 : 0.35);
        const vertDisp = Math.sin(protocolTime / 2000) * (maxVertPx / 2) * vFactor;
        finalLeftY += vertDisp; finalRightY -= vertDisp;
    }

    const maxBOPx = (35 * viewDistM) / pixelToCm;
    const maxBIPx = (12 * viewDistM) / pixelToCm; 

    let dx = finalLeftX - finalRightX; 
    if (dx > maxBOPx) { let scale = maxBOPx / dx; finalLeftX *= scale; finalRightX *= scale; } 
    else if (dx < -maxBIPx) { let scale = -maxBIPx / dx; finalLeftX *= scale; finalRightX *= scale; }

    if(targetLeft && targetRight) {
        targetLeft.children.forEach((layer, i) => { layer.position.x = -(i * 14) * currentStereo; });
        targetRight.children.forEach((layer, i) => { layer.position.x = (i * 14) * currentStereo; });
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

    for (let i = 0; i < currentDistractors; i++) {
        const dData = distractorData[i];
        const dPhase = (phase * dData.speedMultiplier * 1.5) + dData.phaseOffset;
        const roamingX = Math.cos(dPhase) * dData.orbitRadiusX;
        const roamingY = Math.sin(dPhase) * dData.orbitRadiusY;
        const depthDisp = (currentStereo * dData.zOffset * 0.1); 

        if (distractorGroupLeft.children[i]) {
            distractorGroupLeft.children[i].position.set(baseDispX + roamingX + depthDisp, roamingY, dData.zOffset);
            distractorGroupLeft.children[i].rotation.x += 0.015;
            distractorGroupLeft.children[i].rotation.y += 0.01;
        }
        if (distractorGroupRight.children[i]) {
            distractorGroupRight.children[i].position.set(-baseDispX + roamingX - depthDisp, roamingY, dData.zOffset);
            distractorGroupRight.children[i].rotation.x += 0.015;
            distractorGroupRight.children[i].rotation.y += 0.01;
        }
    }

    if (taskActive && isTestModeActive) {
        const offsetDist = Math.min(currentSize * 0.58, 190); 
        let cueDx = 0, cueDy = 0;
        if (taskDirection === 'ArrowUp') cueDy = offsetDist; if (taskDirection === 'ArrowDown') cueDy = -offsetDist;
        if (taskDirection === 'ArrowLeft') cueDx = -offsetDist; if (taskDirection === 'ArrowRight') cueDx = offsetDist;
        cueGroupLeft.position.set(finalLeftX + cueDx, finalLeftY + cueDy, 25); 
        cueGroupRight.position.set(finalRightX + cueDx, finalRightY + cueDy, 25);
        
        const isBlink = Math.floor(performance.now() / 130) % 2 === 0;
        cueGroupLeft.visible = isBlink && (taskEye === 'both' || taskEye === 'left');
        cueGroupRight.visible = isBlink && (taskEye === 'both' || taskEye === 'right');
    }
    forceRenderFrame();
}

function spawnTask() {
    if (!isTestModeActive) return;
    taskActive = true; taskSpawnTime = performance.now();
    taskInitialPrism = prismValHud ? prismValHud.innerText : '0.0';
    const dirs = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    taskDirection = dirs[Math.floor(Math.random() * dirs.length)];
    const eyes = ['both', 'both', 'left', 'right'];
    taskEye = eyes[Math.floor(Math.random() * eyes.length)];
}

function handleTaskResult(result, rt = 0) {
    taskActive = false; cueGroupLeft.visible = false; cueGroupRight.visible = false; timeSinceLastTask = 0; nextTaskInterval = 2200 + Math.random() * 2200; 
    let logMsg = "", statusLabel = ""; 
    const currentPrismStr = prismValHud ? prismValHud.innerText : '0.0';
    const dx = targetRight.position.x - targetLeft.position.x; const dy = targetRight.position.y - targetLeft.position.y;

    if (result === 'hit') {
        sessionScore += 10 + (consecutiveHits * 5);
        if (hudScoreVal) hudScoreVal.innerText = sessionScore;
    }

    if (taskEye === 'both') {
        if (result === 'hit') { 
            consecutiveHits++; consecutiveMisses = 0;
            logMsg = `🟢 雙眼精準合像 (${rt}s) | COMBO x${consecutiveHits}`; statusLabel = "完美融像(FUSION)"; 
            
            // 🚀 [Z] 鍵 AI 動態階梯闖關：每連對 2 次即自動晉級並變換立體幾何，保持高度新鮮感
            if (aiToggle && aiToggle.checked && consecutiveHits >= 2) {
                consecutiveHits = 0;
                const stageMax = AIM_MATRIX[activeProtocol] ? AIM_MATRIX[activeProtocol].length - 1 : 9;
                if (protocolStage < stageMax) {
                    protocolStage++; loadMatrixStage(activeProtocol, protocolStage);
                    logMsg = `✨ AI 動態晉級 Stage ${protocolStage + 1} | 反應 ${rt}s`;
                    if(statusText) statusText.style.color = '#D4AF37';
                }
            } else { if(!isAIRescueActive && statusText) statusText.style.color = '#34d399'; }
            
        } else {
            let failType = ""; let reason = result === 'wrong' ? "方向誤差" : "反應逾時";
            let triggerRescue = false;
            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5) { failType = "垂直融像失準"; statusLabel = "垂直失準(VERT_FAIL)"; triggerRescue = true; } 
            else {
                if (dx < 0) { failType = "內聚負荷臨界"; statusLabel = "聚合不足(BO_FAIL)"; triggerRescue = true; } 
                else { failType = "外展負荷臨界"; statusLabel = "開散不足(BI_FAIL)"; triggerRescue = true; }
            }
            logMsg = `🔴 ${failType} (${reason})`; 
            consecutiveMisses++; consecutiveHits = 0;
            
            if (aiToggle && aiToggle.checked && consecutiveMisses >= 2) {
                consecutiveMisses = 0;
                if (protocolStage > 0) {
                    protocolStage--; loadMatrixStage(activeProtocol, protocolStage);
                    logMsg = `📉 AI 自動減壓退階 | ${logMsg}`; if(statusText) statusText.style.color = '#facc15';
                }
            } else { if(!isAIRescueActive && statusText) statusText.style.color = '#fb7185'; }
            
            if (aiToggle && aiToggle.checked && triggerRescue && !isAIRescueActive) { activateAIRescue(logMsg); }
        }
    } else {
        const eyeName = taskEye === 'left' ? '左眼通道' : '右眼通道';
        if (result === 'hit') {
            consecutiveHits++;
            logMsg = `🟢 ${eyeName}訊號暢通 (${rt}s)`; statusLabel = `${eyeName}去抑制(ANTI_SUPP_${taskEye.toUpperCase()})`;
            if(!isAIRescueActive && statusText) statusText.style.color = '#34d399';
        } else {
            let reason = result === 'wrong' ? "方向誤差" : "未察覺閃爍";
            logMsg = `🟡 ${eyeName}間歇抑制 (${reason})`; statusLabel = `${eyeName}抑制(SUPP_${taskEye.toUpperCase()})`;
            if(!isAIRescueActive && statusText) statusText.style.color = '#facc15';
        }
    }
    
    if(!isAIRescueActive && statusText) statusText.innerText = logMsg;
    
    sessionLogs.push({ time: totalTimerSec.toString(), initial_sep: "0", initial_prism: taskInitialPrism, response_sep: "0", response_prism: currentPrismStr, reaction_time: rt, stereo: currentStereo.toFixed(2), size: currentSize.toFixed(1), status: statusLabel, eye: taskEye, distractors: currentDistractors });

    if (!isAIRescueActive) {
        if(statusTimeout) clearTimeout(statusTimeout);
        statusTimeout = setTimeout(() => { if (isRunning && statusText) { statusText.innerText = isTestModeActive ? "INTERACTIVE TEST ON" : "TRAINING ACTIVE"; statusText.style.color = isTestModeActive ? "#D4AF37" : '#38bdf8'; } }, 2200);
    }
}

function activateAIRescue(reasonMsg) {
    if (loginOverlay.style.display !== 'none' || !isRunning || isAIRescueActive) return;
    isAIRescueActive = true; aiRescueStartTime = performance.now();
    originalSizeBeforeRescue = currentSize; originalPrismBeforeRescue = parseFloat(prismSlider ? prismSlider.value : 0); protocolTimePausedVal = protocolTime; 
    if(prismSlider) { prismSlider.value = (originalPrismBeforeRescue * 0.4).toFixed(1); prismSlider.dispatchEvent(new Event('input')); }
    updateScaleAndThickness(Math.min(550, currentSize * 1.35)); updateUIValues(); protocolTime = -999999; 
    if(statusText) { statusText.innerText = `🌿 視覺減壓緩衝中 | ${reasonMsg}`; statusText.style.color = '#facc15'; }
    if(dynamicModeTag) { dynamicModeTag.innerText = `[ 視覺減壓緩衝 12s ] 正在溫和釋放雙眼融像張力...`; dynamicModeTag.style.color = '#facc15'; }
}

function endAIRescue() {
    if (!isAIRescueActive) return;
    isAIRescueActive = false; protocolTime = protocolTimePausedVal; currentSize = originalSizeBeforeRescue; 
    if(prismSlider) { prismSlider.value = originalPrismBeforeRescue.toFixed(1); prismSlider.dispatchEvent(new Event('input')); }
    updateScaleAndThickness(); updateUIValues(); 
    if(statusText) { statusText.innerText = isTestModeActive ? "INTERACTIVE TEST ON" : "TRAINING ACTIVE"; statusText.style.color = isTestModeActive ? "#D4AF37" : '#38bdf8'; }
    if(activeProtocol && dynamicModeTag) {
        const config = AIM_MATRIX[activeProtocol][protocolStage]; 
        const stageMaxStr = AIM_MATRIX[activeProtocol] ? AIM_MATRIX[activeProtocol].length : 10;
        dynamicModeTag.innerText = `[ ${PROTOCOL_NAMES[activeProtocol].split(' ')[0]} ] Stage ${protocolStage + 1}/${stageMaxStr} : ${config.name}`;
        dynamicModeTag.style.color = '#D4AF37';
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
        let statusColor = log.status.includes('FUSION') || log.status.includes('ANTI') ? '#059669' : (log.status.includes('SUPP') ? '#d97706' : '#e11d48');
        tableRowsHTML += `<tr style="border-bottom: 1px solid #e2e8f0; font-size:13px; text-align:center;"><td style="padding: 8px;">${log.time}s</td><td style="padding: 8px; font-weight:bold; color:${statusColor};">${log.status.split('(')[0]}</td><td style="padding: 8px; font-size:12px; color:#64748b;">${log.initial_prism}</td><td style="padding: 8px; font-weight:bold; color:#0f172a;">${log.response_prism}</td><td style="padding: 8px; font-family:monospace;">${log.reaction_time}s</td></tr>`;
    });

    const reportOverlay = document.createElement('div');
    reportOverlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15, 23, 42, 0.85); backdrop-filter:blur(6px); z-index:10000; display:flex; justify-content:center; align-items:center; font-family:'Noto Sans TC', sans-serif;";
    reportOverlay.innerHTML = `
        <div style="background:#ffffff; width: 660px; max-width:94vw; max-height: 86vh; border-radius:14px; box-shadow: 0 25px 50px rgba(0,0,0,0.4); display:flex; flex-direction:column; overflow:hidden; border-top: 5px solid #D4AF37;">
            <div style="background:#1A365D; color:white; padding: 20px; text-align:center;">
                <h2 style="margin:0; font-size:21px; font-weight:900; letter-spacing:1px;">AXP 雙眼融像與視覺空間評估報告</h2>
                <p style="margin:5px 0 0 0; color:#D4AF37; font-size:13.5px; font-weight:700;">VIP 個案授權碼: ${currentPatientCode} ｜ 綜合積分: ${sessionScore}</p>
            </div>
            <div style="padding: 20px; overflow-y:auto; flex-grow:1; color:#334155;">
                <div style="display:flex; justify-content:space-between; margin-bottom: 18px; background:#f8fafc; padding:14px 18px; border-radius:8px; border:1px solid #cbd5e1;">
                    <div><p style="margin:0 0 4px 0; font-size:12px; color:#64748b; font-weight:bold;">練習總時長</p><p style="margin:0; font-size:18px; font-weight:900; color:#1A365D;">${Math.floor(totalTime / 60)}分 ${totalTime % 60}秒</p></div>
                    <div style="text-align:right;"><p style="margin:0 0 4px 0; font-size:12px; color:#64748b; font-weight:bold;">主要執行模組</p><p style="margin:0; font-size:14px; font-weight:800; color:#1A365D;">${protocolName.split('(')[0]}</p></div>
                </div>
                <h3 style="font-size:15px; margin-bottom:10px; color:#1A365D; border-bottom:1.5px solid #e2e8f0; padding-bottom:6px; font-weight:900;">📊 雙眼協同表現統計</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
                    <div style="background:#ecfdf5; padding:10px 14px; border-radius:8px; border:1px solid #a7f3d0;"><span style="font-size:12px; color:#059669; font-weight:bold;">🟢 雙眼精準合像次數</span><br><span style="font-size:20px; font-weight:900; color:#065f46;">${fusionCount}</span></div>
                    <div style="background:#ecfdf5; padding:10px 14px; border-radius:8px; border:1px solid #a7f3d0;"><span style="font-size:12px; color:#059669; font-weight:bold;">🟢 單側去抑制喚醒成功</span><br><span style="font-size:20px; font-weight:900; color:#065f46;">${antiSuppCount}</span></div>
                    <div style="background:#fef2f2; padding:10px 14px; border-radius:8px; border:1px solid #fecaca;"><span style="font-size:12px; color:#e11d48; font-weight:bold;">🔴 內聚負荷失準 (BO)</span><br><span style="font-size:20px; font-weight:900; color:#9f1239;">${boFail}</span></div>
                    <div style="background:#fef2f2; padding:10px 14px; border-radius:8px; border:1px solid #fecaca;"><span style="font-size:12px; color:#e11d48; font-weight:bold;">🔴 外展負荷失準 (BI)</span><br><span style="font-size:20px; font-weight:900; color:#9f1239;">${biFail}</span></div>
                    <div style="background:#fffbeb; padding:10px 14px; border-radius:8px; border:1px solid #fde68a;"><span style="font-size:12px; color:#d97706; font-weight:bold;">🟡 間歇性單眼抑制</span><br><span style="font-size:20px; font-weight:900; color:#92400e;">${suppCount}</span></div>
                    <div style="background:#fef2f2; padding:10px 14px; border-radius:8px; border:1px solid #fecaca;"><span style="font-size:12px; color:#e11d48; font-weight:bold;">🔴 垂直空間失準</span><br><span style="font-size:20px; font-weight:900; color:#9f1239;">${vertFail}</span></div>
                </div>
                <h3 style="font-size:15px; margin-bottom:10px; color:#1A365D; border-bottom:1.5px solid #e2e8f0; padding-bottom:6px; font-weight:900;">📋 毫秒級反應明細</h3>
                <table style="width:100%; border-collapse: collapse;"><thead><tr style="background:#f1f5f9; font-size:12px; color:#475569;"><th style="padding:8px; text-align:center;">時間</th><th style="padding:8px; text-align:center;">雙眼狀態</th><th style="padding:8px; text-align:center;">起始稜鏡</th><th style="padding:8px; text-align:center;">作答稜鏡</th><th style="padding:8px; text-align:center;">反應秒數</th></tr></thead><tbody>${tableRowsHTML || '<tr><td colspan="5" style="text-align:center; padding:14px; color:#94a3b8;">本次練習為自由視覺律動模式（未開啟 0 鍵方向測驗）</td></tr>'}</tbody></table>
            </div>
            <div style="padding: 15px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; text-align:center;">
                <button id="close-report-btn" style="background:#1A365D; color:#D4AF37; border:1px solid #D4AF37; padding:11px 28px; border-radius:8px; font-size:15px; cursor:pointer; font-weight:900; transition:0.2s;">完成並返回系統</button>
            </div>
        </div>
    `;
    document.body.appendChild(reportOverlay);
    document.getElementById('close-report-btn').addEventListener('click', () => { document.body.removeChild(reportOverlay); executeReset(); });
}

async function uploadToSupabase() {
    const finalTime = totalTimerSec; 
    const finalProtocol = activeProtocol ? PROTOCOL_NAMES[activeProtocol] : 'MANUAL_MODE';
    
    const payloadData = {
        patient_id: currentPatientCode,
        environmental_setup: {
            prism_base: document.getElementById('prism-slider')?.value || 0,
            anaglyph_balance: document.getElementById('balance-slider')?.value || 50,
            screen_spec: screenSpecSelect?.value || 'mbp16',
            distractor_count: currentDistractors
        },
        clinical_logs: [...sessionLogs]
    };

    isRunning = false; 
    cancelAnimationFrame(animationId); 
    if(startBtn) { startBtn.innerText = "▶ 啟動訓練 [ Space ]"; startBtn.classList.remove('active'); }
    if(statusText) { statusText.innerText = "SYNCING CLOUD REPORT..."; statusText.style.color = "#38bdf8"; }
    
    try {
        if (sessionLogs.length > 0) {
            await supabase.from('training_sessions').insert([{ 
                duration_sec: finalTime, 
                protocol_name: finalProtocol, 
                raw_data: payloadData,
                patient_code: currentPatientCode  
            }]);
        }
        if(statusText) { statusText.innerText = "REPORT GENERATED"; statusText.style.color = "#34d399"; }
        showClinicalReport(payloadData.clinical_logs, finalTime, finalProtocol);
        sessionLogs = []; 
    } catch (err) {
        console.warn("Cloud Sync Note:", err);
        showClinicalReport(payloadData.clinical_logs, finalTime, finalProtocol);
    }
}

function updateGlassesUI() {
    const lLabelText = document.getElementById('l-label-text');
    if (glassesSelect && glassesSelect.value === 'rb') {
        if(greenSlider) greenSlider.style.display = 'none'; if(blueSlider) blueSlider.style.display = 'block';
        if(lLabelText) lLabelText.innerText = '藍通道';
    } else {
        if(greenSlider) greenSlider.style.display = 'block'; if(blueSlider) blueSlider.style.display = 'none';
        if(lLabelText) lLabelText.innerText = '綠通道';
    }
    updateOpticsFromUI();
}

if(glassesSelect) glassesSelect.addEventListener('change', updateGlassesUI);
[redSlider, greenSlider, blueSlider].forEach(slider => { if(slider) slider.addEventListener('input', updateOpticsFromUI); });
if(prismSlider) prismSlider.addEventListener('input', updateOpticsFromUI);

function updateUIValues() {
    if(sizeLabel) sizeLabel.innerText = currentSize.toFixed(0) + 'px'; 
    if(speedLabel) speedLabel.innerText = currentSpeed.toFixed(0); 
    if(thickLabel) thickLabel.innerText = currentThick.toFixed(1);
    if(stereoLabel) stereoLabel.innerText = (currentStereo > 0 ? '+' : '') + currentStereo.toFixed(2);
    
    const hudStereoVal = document.getElementById('hud-stereo-val');
    if(hudStereoVal) hudStereoVal.innerText = currentStereo.toFixed(2);
    
    let balance = balanceSlider ? parseInt(balanceSlider.value) : 50; 
    if(balanceLabel) balanceLabel.innerText = balance === 50 ? "均衡 50/50" : (balance < 50 ? `強左 ${100-balance}%` : `強右 ${balance}%`);
    
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
    if(dynamicModeTag) { dynamicModeTag.innerText = "AXP FUSION DYNAMICS｜手動自由調控模式"; dynamicModeTag.style.color = '#f8fafc'; }
    if(stageIndicatorLabel) stageIndicatorLabel.innerText = "手動自由模式";
    document.querySelectorAll('.proto-btn[data-proto]').forEach(b => b.classList.remove('active-proto'));
    
    currentAxis = 'horizontal';
    currentMode = 'crossover';
    currentDistractors = 0; 
    buildTargets();
    
    siloPrompt.style.display = 'none'; 
    if(isAIRescueActive) endAIRescue();
}

function loadMatrixStage(protocol, stage) {
    const config = AIM_MATRIX[protocol][stage]; if (!config) return;
    
    document.querySelectorAll('.proto-btn[data-proto]').forEach(b => {
        b.classList.toggle('active-proto', b.getAttribute('data-proto') === protocol);
    });

    if(shapeSelect) {
        let optionExists = Array.from(shapeSelect.options).some(opt => opt.value === config.shape);
        if (!optionExists) { const newOpt = new Option(config.shape, config.shape); shapeSelect.add(newOpt); }
        shapeSelect.value = config.shape; 
    }
    
    currentAxis = config.axis || 'horizontal';
    currentMode = config.mode || 'crossover';
    currentDistractors = config.distractors || 0;

    if(fillCheckbox) fillCheckbox.checked = config.fill; isFilled = config.fill;
    
    currentStereo = Math.max(-0.15, Math.min(0.15, config.stereo)); 
    currentSize = config.size; currentSpeed = config.speed; currentThick = config.thick;
    isRotating = !config.anim.includes('none'); if(rotateCheckbox) rotateCheckbox.checked = isRotating; 
    
    if(prismSlider) { prismSlider.value = config.dist; }

    updateUIValues(); buildTargets();
    
    const stageMaxStr = AIM_MATRIX[protocol] ? AIM_MATRIX[protocol].length : 10;
    if(dynamicModeTag) {
        dynamicModeTag.innerText = `[ ${PROTOCOL_NAMES[protocol].split(' ')[0]} ] Stage ${stage + 1}/${stageMaxStr} : ${config.name}`;
        dynamicModeTag.style.color = '#D4AF37'; 
    }
    if(stageIndicatorLabel) {
        stageIndicatorLabel.innerText = `${protocol.replace('Key','')} 模組｜Stage ${stage + 1} / ${stageMaxStr}`;
    }
    protocolTime = 0; flipperTimer = 0; currentSaccadeX = 0; currentSaccadeY = 0; saccadeTimer = 0; currentRoamX = 0; currentRoamY = 0;
}

function toggleTestMode() {
    if (isAIRescueActive) return;
    isTestModeActive = !isTestModeActive;
    if (btnTestMode) {
        btnTestMode.innerHTML = isTestModeActive ? "<strong>0</strong> 互動測驗: 開 (按方向鍵)" : "<strong>0</strong> 互動測驗: 關";
        btnTestMode.classList.toggle('test-on', isTestModeActive);
    }
    if (!isTestModeActive) { 
        taskActive = false; cueGroupLeft.visible = false; cueGroupRight.visible = false; 
        if (isRunning && statusText) { statusText.innerText = "TRAINING ACTIVE"; statusText.style.color = '#38bdf8'; } 
    } else { 
        if (isRunning && statusText) { statusText.innerText = "INTERACTIVE TEST ON (請留意閃爍點並按方向鍵)"; statusText.style.color = '#D4AF37'; } 
    }
}

// 綁定右側面板新增之視覺化按鈕
document.querySelectorAll('.proto-btn[data-proto]').forEach(btn => {
    btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-proto');
        if (isAIRescueActive) return;
        if (aiToggle) aiToggle.checked = true;
        activeProtocol = code;
        protocolStage = 0;
        // 啟動模組時自動開啟方向鍵互動測驗，提升訓練趣味與數據記錄率
        if (!isTestModeActive) toggleTestMode();
        loadMatrixStage(activeProtocol, protocolStage);
        if (!isRunning) toggleTraining();
    });
});

if (btnTestMode) btnTestMode.addEventListener('click', toggleTestMode);
document.getElementById('btn-stage-prev')?.addEventListener('click', () => {
    if (activeProtocol && protocolStage > 0) { protocolStage--; loadMatrixStage(activeProtocol, protocolStage); }
});
document.getElementById('btn-stage-next')?.addEventListener('click', () => {
    if (activeProtocol) {
        const maxS = AIM_MATRIX[activeProtocol].length - 1;
        if (protocolStage < maxS) { protocolStage++; loadMatrixStage(activeProtocol, protocolStage); }
    }
});
if (reportBtn) reportBtn.addEventListener('click', uploadToSupabase);

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
// 🚀 動態動畫與 10 秒迷走神經呼吸同調迴圈
// ==========================================
let lastDichopticSwapTime = 0;

function animate(time) {
    if (!isRunning) return;
    if (!lastTime) lastTime = time; const dt = time - lastTime; lastTime = time;
    if (Math.floor(time / 1000) > Math.floor((time - dt) / 1000)) {
        totalTimerSec++; 
        if(timerDisplay) timerDisplay.innerText = Math.floor(totalTimerSec / 60).toString().padStart(2, '0') + ':' + (totalTimerSec % 60).toString().padStart(2, '0');
    }
    const speedFactor = 40000 / Math.max(1, currentSpeed); phase += dt / speedFactor; 

    // 🔬 迷走神經 10 秒呼吸光環律動 (4秒吸氣擴張，6秒吐氣收斂)
    const breathCycle = (time % 10000) / 1000;
    const isInhale = breathCycle < 4.0;
    const breathWave = isInhale ? (breathCycle / 4.0) : (1.0 - (breathCycle - 4.0) / 6.0);
    const haloScale = 0.85 + breathWave * 0.35;
    breathHaloMesh.scale.set(haloScale, haloScale, 1);
    breathHaloMat.opacity = 0.05 + breathWave * 0.12;
    if (breathIndicator && breathText) {
        breathIndicator.style.transform = `scale(${0.8 + breathWave * 0.6})`;
        breathIndicator.style.backgroundColor = isInhale ? '#38bdf8' : '#D4AF37';
        breathText.innerText = isInhale ? '🌬️ 請跟隨光環緩慢吸氣 (4秒)...' : '😮‍💨 請放鬆雙肩並深長吐氣 (6秒)...';
    }

    // 雙眼互補視標每 8 秒自動溫和互換左右眼組件，確保兩眼均衡鍛鍊
    if (time - lastDichopticSwapTime > 8000 && shapeSelect && shapeSelect.value.startsWith('dichoptic')) {
        lastDichopticSwapTime = time;
        dichopticSwapState = !dichopticSwapState;
        buildTargets();
    }

    if (isTestModeActive) {
        if (!taskActive) { timeSinceLastTask += dt; if (timeSinceLastTask > nextTaskInterval) spawnTask(); } 
        else { if (performance.now() - taskSpawnTime > 7500) handleTaskResult('miss'); }
    }

    if (isAIRescueActive) {
        const timeInRescue = performance.now() - aiRescueStartTime;
        if (timeInRescue > 12000) { endAIRescue(); } 
        else { const timeLeft = Math.ceil((12000 - timeInRescue) / 1000); if(dynamicModeTag) dynamicModeTag.innerText = `[ 視覺減壓緩衝 ${timeLeft}s ] 請深長吐氣並放鬆雙眼...`; }
    }

    let currentAnim = '';

    if (aiToggle && aiToggle.checked && activeProtocol && !isAIRescueActive) {
        protocolTime += dt; const config = AIM_MATRIX[activeProtocol][protocolStage]; currentAnim = config.anim || ''; 
        
        if (currentAnim.includes('breathing_fractal')) {
            const breathScale = currentSize + (currentSize * 0.16 * Math.sin(phase));
            updateScaleAndThickness(breathScale);
        }

        if (currentAnim.includes('silo_text')) {
            siloPrompt.style.display = 'block';
            let sineVal = Math.sin(phase);
            if (sineVal > 0) {
                siloPrompt.innerText = "SILO 空間引導：視標向內聚合靠近中，請配合緩慢長吐氣";
                siloPrompt.style.borderColor = "#D4AF37";
            } else {
                siloPrompt.innerText = "SILO 空間引導：視標向外展開遠離中，請配合平穩深吸氣";
                siloPrompt.style.borderColor = "#38bdf8";
            }
            updateScaleAndThickness(currentSize * (1 - sineVal * 0.22));
        } else {
            siloPrompt.style.display = 'none';
        }

        if (currentAnim.includes('balanceDrift')) {
            const drift = Math.sin(protocolTime / 1500) * 0.35 + 0.65; 
            targetLeft.traverse(c => { if(c.isMesh) { c.material.transparent = true; c.material.opacity = drift; } });
            targetRight.traverse(c => { if(c.isMesh) { c.material.transparent = true; c.material.opacity = 1.3 - drift; } });
        }
        if (currentAnim.includes('flicker')) {
            let flickerSpeed = 350;
            let isRedTurn = Math.floor(protocolTime / flickerSpeed) % 2 === 0;
            targetLeft.traverse(c => { if(c.isMesh) { c.material.transparent = true; c.material.opacity = isRedTurn ? 1 : 0.18; } });
            targetRight.traverse(c => { if(c.isMesh) { c.material.transparent = true; c.material.opacity = isRedTurn ? 0.18 : 1; } });
        } else if (!currentAnim.includes('balanceDrift')) {
            targetLeft.traverse(c => { if(c.isMesh) c.material.opacity = 1; });
            targetRight.traverse(c => { if(c.isMesh) c.material.opacity = 1; });
        }

        if (currentAnim.includes('flipper')) {
            let delay = currentAnim.includes('slow') ? 3000 : 1600;
            flipperTimer += dt;
            if (flipperTimer > delay) { flipperState = !flipperState; flipperTimer = 0; }
        }
        
        if (currentAnim.includes('text_') && shapeSelect && shapeSelect.value === 'text') {
            if (time - lastWordChangeTime > 3800) {
                lastWordChangeTime = time;
                currentWordIndex = (currentWordIndex + 1) % AXP_WORDS.length;
                if(customTextInput) customTextInput.value = AXP_WORDS[currentWordIndex];
                buildTargets(); 
            }
        }

        // 每階段優化為黃金 45 秒自動推進，防止視覺皮質單調疲乏
        const maxStages = AIM_MATRIX[activeProtocol] ? AIM_MATRIX[activeProtocol].length : 10;
        if (protocolTime > 45000) { protocolStage = (protocolStage + 1) % maxStages; loadMatrixStage(activeProtocol, protocolStage); }
    }

    const isRoamActive = currentAnim.includes('roam') || (!aiToggle.checked && currentAxis === 'roam');
    const isSaccadeActive = currentAnim.includes('saccade') || (!aiToggle.checked && currentAxis === 'saccade');

    if (isRoamActive) {
        currentRoamX = Math.sin(phase * 0.75) * 280;
        currentRoamY = Math.cos(phase * 0.55) * 190;
    } else {
        currentRoamX = 0; currentRoamY = 0;
    }

    if (isSaccadeActive) {
        saccadeTimer += dt; 
        if (saccadeTimer > 1600) { 
            saccadeTimer = 0; 
            currentSaccadeX = (Math.random() > 0.5 ? 1 : -1) * (120 + Math.random() * 170); 
            currentSaccadeY = (Math.random() > 0.5 ? 1 : -1) * (80 + Math.random() * 120); 
        }
    } else {
        currentSaccadeX = 0; currentSaccadeY = 0;
    }

    if(targetLeft && targetRight) {
        targetLeft.children.forEach((layer, index) => { 
            if (shapeSelect && (shapeSelect.value.includes('crystal') || shapeSelect.value.includes('sphere') || shapeSelect.value === 'nested_dodeca' || shapeSelect.value === 'torusKnot') && isRotating) { 
                layer.rotation.x += (index % 2 === 0 ? 0.009 : -0.009); 
                layer.rotation.y += 0.012; 
            } 
        });
        targetRight.children.forEach((layer, index) => { 
            if (shapeSelect && (shapeSelect.value.includes('crystal') || shapeSelect.value.includes('sphere') || shapeSelect.value === 'nested_dodeca' || shapeSelect.value === 'torusKnot') && isRotating) { 
                layer.rotation.x += (index % 2 === 0 ? 0.009 : -0.009); 
                layer.rotation.y += 0.012; 
            } 
        });
    }
    
    updatePositions(phase, currentAnim); 
    
    if (isRotating && shapeSelect?.value !== 'text' && shapeSelect?.value !== 'dichoptic_cross') { 
        targetLeft.rotation.z = phase * 0.4; 
        targetRight.rotation.z = phase * 0.4; 
    } else {
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
        if(startBtn) { startBtn.innerText = "⏸ 暫停訓練 [ Space ]"; startBtn.classList.add('active'); }
        if(statusText) { statusText.innerText = isAIRescueActive ? statusText.innerText : (isTestModeActive ? "INTERACTIVE TEST ON" : "TRAINING ACTIVE"); statusText.style.color = isAIRescueActive ? '#facc15' : (isTestModeActive ? "#D4AF37" : '#38bdf8'); }
        lastTime = performance.now(); animate(lastTime);
    } else {
        if(startBtn) { startBtn.innerText = "▶ 繼續訓練 [ Space ]"; startBtn.classList.remove('active'); }
        if(statusText) { statusText.innerText = "PAUSED"; statusText.style.color = '#D4AF37'; }
        cancelAnimationFrame(animationId);
        taskActive = false; cueGroupLeft.visible = false; cueGroupRight.visible = false;
        forceRenderFrame();
    }
}

function executeReset() {
    isRunning = false; cancelAnimationFrame(animationId); 
    if(startBtn) { startBtn.innerText = "▶ 啟動訓練 [ Space ]"; startBtn.classList.remove('active'); }
    if(statusText) { statusText.innerText = "IDLE"; statusText.style.color = '#f8fafc'; }
    totalTimerSec = 0; sessionScore = 0;
    if(timerDisplay) timerDisplay.innerText = "00:00"; 
    if(hudScoreVal) hudScoreVal.innerText = "0";
    disableAI();
    taskActive = false; isTestModeActive = false; cueGroupLeft.visible = false; cueGroupRight.visible = false;
    if (btnTestMode) { btnTestMode.innerHTML = "<strong>0</strong> 互動測驗: 關"; btnTestMode.classList.remove('test-on'); }
    consecutiveHits = 0; consecutiveMisses = 0;
    
    currentSize = 280; currentSpeed = 18; currentStereo = 0.02; currentThick = 8.0;
    currentDistractors = 0; 
    currentSaccadeX = 0; currentSaccadeY = 0; currentRoamX = 0; currentRoamY = 0; phase = 0;
    isRotating = true; isFilled = false; sessionLogs = []; isAIRescueActive = false;
    
    if(shapeSelect) shapeSelect.value = 'dichoptic_lock'; 
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

    const shortcuts = ['Space', 'Enter', 'KeyE', 'KeyW', 'KeyS', 'KeyD', 'KeyA', 'KeyF', 'KeyR', 'KeyG', 'KeyZ', 'Digit0', 'Numpad0', 'Digit1', 'Digit2', 'Numpad1', 'Numpad2', 'BracketLeft', 'BracketRight', 'Comma', 'Period', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'KeyQ', 'PageUp', 'PageDown'];
    
    if (shortcuts.includes(code)) {
        e.preventDefault(); if (document.activeElement) document.activeElement.blur(); 
        
        switch(code) {
            case 'PageUp':
                if (isAIRescueActive || !activeProtocol) break;
                if (protocolStage > 0) { protocolStage--; loadMatrixStage(activeProtocol, protocolStage); }
                break;
            case 'PageDown':
                if (isAIRescueActive || !activeProtocol) break;
                const maxStagesDown = AIM_MATRIX[activeProtocol] ? AIM_MATRIX[activeProtocol].length : 10;
                if (protocolStage < maxStagesDown - 1) { protocolStage++; loadMatrixStage(activeProtocol, protocolStage); }
                break;

            case 'Space': toggleTraining(); break; 
            case 'Enter': executeReset(); break; 
            case 'KeyE': if(controlPanel) { controlPanel.style.display = controlPanel.style.display === 'none' ? 'flex' : 'none'; setTimeout(onWindowResize, 50); } break;
            case 'KeyG': uploadToSupabase(); break; 
            case 'KeyZ': 
                if(aiToggle) { 
                    aiToggle.checked = !aiToggle.checked; 
                    if (!aiToggle.checked) { disableAI(); } 
                    else {
                        if (!activeProtocol) { activeProtocol = 'KeyY'; protocolStage = 0; }
                        if (!isTestModeActive) toggleTestMode();
                        loadMatrixStage(activeProtocol, protocolStage);
                        if (!isRunning) toggleTraining();
                    }
                } 
                break;
            case 'KeyQ': toggleFullScreen(); break; 
            case 'Digit0': case 'Numpad0': toggleTestMode(); break;
            
            case 'Digit1': case 'Numpad1': 
                if(prismSlider) { prismSlider.value = Math.max(parseFloat(prismSlider.min), parseFloat(prismSlider.value) - 0.5).toFixed(1); prismSlider.dispatchEvent(new Event('input')); }
                break;
            case 'Digit2': case 'Numpad2': 
                if(prismSlider) { prismSlider.value = Math.min(parseFloat(prismSlider.max), parseFloat(prismSlider.value) + 0.5).toFixed(1); prismSlider.dispatchEvent(new Event('input')); }
                break;
                
            case 'BracketRight': if(stereoSlider) { stereoSlider.value = Math.min(0.15, parseFloat(stereoSlider.value) + 0.01).toFixed(2); stereoSlider.dispatchEvent(new Event('input')); } break;
            case 'BracketLeft': if(stereoSlider) { stereoSlider.value = Math.max(-0.15, parseFloat(stereoSlider.value) - 0.01).toFixed(2); stereoSlider.dispatchEvent(new Event('input')); } break;
            case 'Period': if(speedSlider) { speedSlider.value = Math.min(60, parseFloat(speedSlider.value) + (e.shiftKey ? 5 : 1)); speedSlider.dispatchEvent(new Event('input')); } break;
            case 'Comma': if(speedSlider) { speedSlider.value = Math.max(1, parseFloat(speedSlider.value) - (e.shiftKey ? 5 : 1)); speedSlider.dispatchEvent(new Event('input')); } break;
            
            case 'KeyW': currentSize = Math.min(600, currentSize + 15); updateUIValues(); buildTargets(); if(!isAIRescueActive) disableAI(); break;
            case 'KeyS': currentSize = Math.max(150, currentSize - 15); updateUIValues(); buildTargets(); if(!isAIRescueActive) disableAI(); break;
            
            case 'KeyD': currentThick = Math.min(10, currentThick + 0.5); updateUIValues(); buildTargets(); if(!isAIRescueActive) disableAI(); break;
            case 'KeyA': currentThick = Math.max(2, currentThick - 0.5); updateUIValues(); buildTargets(); if(!isAIRescueActive) disableAI(); break;
            case 'KeyF': if(fillCheckbox) { fillCheckbox.checked = !fillCheckbox.checked; fillCheckbox.dispatchEvent(new Event('change')); } break;
            case 'KeyR': if(rotateCheckbox) { rotateCheckbox.checked = !rotateCheckbox.checked; rotateCheckbox.dispatchEvent(new Event('change')); } break;
            case 'KeyY': case 'KeyU': case 'KeyI': case 'KeyO': case 'KeyP':
                if (isAIRescueActive) break;
                if(aiToggle) aiToggle.checked = true; 
                const maxStages = AIM_MATRIX[code] ? AIM_MATRIX[code].length : 10;
                if (activeProtocol === code && isRunning) { protocolStage = (protocolStage + 1) % maxStages; } else { activeProtocol = code; protocolStage = 0; }
                if (!isTestModeActive) toggleTestMode();
                loadMatrixStage(activeProtocol, protocolStage);
                if (!isRunning) toggleTraining();
                break;
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
