// app.js - AXP Fusion Dynamics: 雲端大腦串接版 (v11.6 立體視精準鎖定版)
import { AIM_MATRIX, PROTOCOL_NAMES } from './matrix.js';
import { createTarget } from './shapes.js';
// 🚀 1. 引入 Supabase 官方模組
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// 🚀 2. 設定您的雲端大腦鑰匙
const supabaseUrl = 'https://wvholwcyrldixlsgoege.supabase.co';
const supabaseKey = 'sb_publishable_BozJ84tPQF-jBHGKtXKqgw_ELodM54e';
const supabase = createClient(supabaseUrl, supabaseKey);

// === 🚀 3. 動態生成 SaaS 強制登入介面 ===
let currentPatientCode = 'GUEST';
const loginOverlay = document.createElement('div');
loginOverlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(243, 244, 246, 0.95); z-index:9999; display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:sans-serif;";
loginOverlay.innerHTML = `
    <h1 style="color:#0f172a; letter-spacing:2px; margin-bottom:10px;">AXP FUSION DYNAMICS</h1>
    <p style="color:#475569; margin-bottom:30px; font-weight:bold;">企業級雙眼視覺雲端診療系統</p>
    <div style="background:#ffffff; padding:40px; border-radius:12px; text-align:center; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border: 1px solid #e5e7eb;">
        <p style="margin-bottom:15px; font-size:14px; font-weight:bold; color:#64748b;">請輸入驗光師配發的病患代碼</p>
        <input type="text" id="patient-code-input" placeholder="例如: AXP-001" style="background-color:#f1f5f9; padding:12px; width:220px; text-align:center; border-radius:6px; border:1px solid #cbd5e1; margin-bottom:25px; font-size:16px; font-weight:bold; color:#475569; outline:none; transition:0.2s;">
        <br>
        <button id="login-btn" style="background:#2563eb; color:white; border:none; padding:12px 30px; border-radius:6px; font-size:16px; cursor:pointer; font-weight:bold; transition:0.3s; box-shadow: 0 4px 6px rgba(37,99,235,0.2);">登入並開始訓練</button>
    </div>
`;
document.body.appendChild(loginOverlay);

function performLogin() {
    const code = document.getElementById('patient-code-input').value.trim();
    if(!code) return alert("請輸入病患代碼！");
    currentPatientCode = code; 
    loginOverlay.style.display = 'none'; 
}

document.getElementById('login-btn').addEventListener('click', performLogin);

const inputField = document.getElementById('patient-code-input');
inputField.addEventListener('focus', () => { inputField.style.borderColor = '#2563eb'; inputField.style.backgroundColor = '#ffffff'; });
inputField.addEventListener('blur', () => { inputField.style.borderColor = '#cbd5e1'; inputField.style.backgroundColor = '#f1f5f9'; });
inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        performLogin();
    }
});

// === DOM 元素綁定 ===
const container = document.getElementById('webgl-container');
const controlPanel = document.querySelector('.control-panel'); 
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const statusText = document.getElementById('status-text');

// UI - 控制面板
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
const distSlider = document.getElementById('dist-slider');
const distLabel = document.getElementById('dist-label');
const speedSlider = document.getElementById('speed-slider');
const speedLabel = document.getElementById('speed-label');
const axisSelect = document.getElementById('axis-select');
const modeSelect = document.getElementById('mode-select');
const stereoSlider = document.getElementById('stereo-slider');
const stereoLabel = document.getElementById('stereo-label');
const sepVal = document.getElementById('sep-val');
const prismValEl = document.getElementById('prism-val'); 

const screenSpecSelect = document.getElementById('screen-spec');
const viewDistInput = document.getElementById('view-dist');

// 🚀 強制將立體視拉桿鎖定在 -0.1 到 0.1
stereoSlider.min = "-0.1"; stereoSlider.max = "0.1"; 

const glassesSelect = document.getElementById('glasses-select');
const balanceSlider = document.getElementById('balance-slider');
const balanceLabel = document.getElementById('balance-label');
const redSlider = document.getElementById('red-slider');
const greenSlider = document.getElementById('green-slider');
const blueSlider = document.getElementById('blue-slider');
const blueChannelBox = document.getElementById('blue-channel-box');
const ghostingLabelDisplay = redSlider.previousElementSibling.querySelector('.val-display');

const timerDisplay = document.getElementById('timer-val');
const dynamicModeTag = document.getElementById('dynamic-mode-tag');

// 引擎與狀態變數
let isRunning = false;
let animationId;
let currentSize = 200, currentDist = 120, currentSpeed = 20, currentStereo = 0, currentThick = 9.0;
let isRotating = true, isFilled = false;
let activeProtocol = null, protocolStage = 0, protocolTime = 0, totalTimerSec = 0, lastTime = 0, phase = 0;
let currentSaccadeX = 0, currentSaccadeY = 0, saccadeTimer = 0, currentRoamX = 0, currentRoamY = 0, aiChaosTimer = 0;

let sessionLogs = [];
let isTestModeAllowed = true; 
let isTestModeActive = false; 
let taskActive = false;
let taskDirection = ''; 
let taskEye = 'both';
let taskSpawnTime = 0;
let timeSinceLastTask = 0;
let nextTaskInterval = 3000; 
let statusTimeout = null;

// 🚀 $T_0$ 計量級追蹤變數
let taskInitialSep = "";
let taskInitialPrism = "";

// Three.js 初始化
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
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9); 
directionalLight.position.set(0, 0, 200);
scene.add(directionalLight);

// === 🌌 精緻深度立體星空背景 (放大4.5 + 同步非交叉視差) ===
const starCanvas = document.createElement('canvas');
starCanvas.width = 32; starCanvas.height = 32;
const starCtx = starCanvas.getContext('2d');
starCtx.beginPath();
starCtx.arc(16, 16, 14, 0, Math.PI * 2);
starCtx.fillStyle = 'white';
starCtx.fill();
const starTexture = new THREE.CanvasTexture(starCanvas);

const starsCount = 200; 
const posArrayLeft = new Float32Array(starsCount * 3);
const posArrayRight = new Float32Array(starsCount * 3);

for(let i=0; i < starsCount; i++) {
    const baseX = (Math.random() - 0.5) * 1600; 
    const baseY = (Math.random() - 0.5) * 1400; 
    const depthFactor = Math.random(); 
    const baseZ = -200 - depthFactor * 800; 
    const parallax = 3 + depthFactor * 25; 
    
    // 非交叉視差：左眼(-)往左，右眼(+)往右，星空陷進螢幕內
    posArrayLeft[i*3] = baseX - parallax; posArrayLeft[i*3+1] = baseY; posArrayLeft[i*3+2] = baseZ;
    posArrayRight[i*3] = baseX + parallax; posArrayRight[i*3+1] = baseY; posArrayRight[i*3+2] = baseZ;
}

const starsGeoLeft = new THREE.BufferGeometry();
starsGeoLeft.setAttribute('position', new THREE.BufferAttribute(posArrayLeft, 3));
const starsGeoRight = new THREE.BufferGeometry();
starsGeoRight.setAttribute('position', new THREE.BufferAttribute(posArrayRight, 3));

const starMatLeft = new THREE.PointsMaterial({ size: 4.5, map: starTexture, transparent: true, alphaTest: 0.1, sizeAttenuation: true, blending: THREE.NormalBlending, depthWrite: false });
const starMatRight = new THREE.PointsMaterial({ size: 4.5, map: starTexture, transparent: true, alphaTest: 0.1, sizeAttenuation: true, blending: THREE.NormalBlending, depthWrite: false });

const starsLeft = new THREE.Points(starsGeoLeft, starMatLeft);
const starsRight = new THREE.Points(starsGeoRight, starMatRight);

scene.add(starsLeft); scene.add(starsRight);

let targetLeft, targetRight;

const cueGeo = new THREE.CircleGeometry(1, 32); 
const cueMatLeft = new THREE.MeshBasicMaterial({ color: 0xffffff });
const cueMatRight = new THREE.MeshBasicMaterial({ color: 0xffffff });
const cueLeft = new THREE.Mesh(cueGeo, cueMatLeft);
const cueRight = new THREE.Mesh(cueGeo, cueMatRight);
cueLeft.visible = false; cueRight.visible = false;
scene.add(cueLeft); scene.add(cueRight);

function getColorsAndOpacity() {
    const r = Math.floor((parseInt(redSlider.value) / 100) * 255);
    const g = Math.floor((parseInt(greenSlider.value) / 100) * 255);
    const b = Math.floor((parseInt(blueSlider.value) / 100) * 255);
    const colorLeft = glassesSelect.value === 'rc' ? ((0 << 16) | (0 << 8) | b) : (g << 8); // 修正藍色通道
    const colorRight = (r << 16); 
    let balance = parseInt(balanceSlider.value);
    let opacityLeft = balance < 50 ? (balance / 50) : 1;
    let opacityRight = balance > 50 ? ((100 - balance) / 50) : 1;
    return { left: colorLeft, right: colorRight, opLeft: opacityLeft, opRight: opacityRight };
}

function clearTargets() {
    if (targetLeft) { targetLeft.traverse(child => { if(child.isMesh) { child.geometry.dispose(); child.material.dispose(); }}); scene.remove(targetLeft); }
    if (targetRight) { targetRight.traverse(child => { if(child.isMesh) { child.geometry.dispose(); child.material.dispose(); }}); scene.remove(targetRight); }
}

function updateColorsFromUI() {
    if (document.getElementById('r-val')) document.getElementById('r-val').innerText = redSlider.value + '%';
    if (document.getElementById('g-val')) document.getElementById('g-val').innerText = greenSlider.value + '%';
    if (document.getElementById('b-val')) document.getElementById('b-val').innerText = blueSlider.value + '%';
    
    const visualConfig = getColorsAndOpacity();
    
    if (targetLeft) {
        targetLeft.traverse(child => { 
            if(child.isMesh) { 
                child.material = new THREE.MeshBasicMaterial({
                    color: visualConfig.left,
                    transparent: true,
                    opacity: visualConfig.opLeft,
                    blending: THREE.NormalBlending, 
                    depthWrite: false
                });
            } 
        });
    }
    if (targetRight) {
        targetRight.traverse(child => { 
            if(child.isMesh) { 
                child.material = new THREE.MeshBasicMaterial({
                    color: visualConfig.right,
                    transparent: true,
                    opacity: visualConfig.opRight,
                    blending: THREE.NormalBlending,
                    depthWrite: false
                });
            } 
        });
    }
    
    starMatLeft.color.setHex(visualConfig.left);
    starMatLeft.opacity = visualConfig.opLeft; 
    starMatRight.color.setHex(visualConfig.right);
    starMatRight.opacity = visualConfig.opRight; 

    cueLeft.material.color.setHex(visualConfig.left); 
    cueRight.material.color.setHex(visualConfig.right);
    
    if (!isRunning) renderer.render(scene, camera);
}

function buildTargets() {
    clearTargets(); 
    textInputGroup.style.display = shapeSelect.value === 'text' ? 'block' : 'none';
    
    targetLeft = createTarget(shapeSelect.value, 0xffffff, isFilled, customTextInput.value, currentThick);
    targetRight = createTarget(shapeSelect.value, 0xffffff, isFilled, customTextInput.value, currentThick);
    
    updateScaleAndThickness(); 
    scene.add(targetLeft); scene.add(targetRight);
    
    updateColorsFromUI(); 
}

function updateScaleAndThickness(dynamicSize = currentSize) {
    const scaleFactor = dynamicSize / 200;
    
    if(targetLeft && targetRight) { 
        targetLeft.scale.set(scaleFactor, scaleFactor, scaleFactor); 
        targetRight.scale.set(scaleFactor, scaleFactor, scaleFactor); 
        
        const thicknessScale = 1 + (scaleFactor - 1) * 0.35; 
        const correctionScale = thicknessScale / scaleFactor;

        targetLeft.traverse(child => {
            if(child.isMesh && child.geometry.type === 'CylinderGeometry') {
                child.scale.x = correctionScale;
                child.scale.y = correctionScale;
            }
        });
        targetRight.traverse(child => {
            if(child.isMesh && child.geometry.type === 'CylinderGeometry') {
                child.scale.x = correctionScale;
                child.scale.y = correctionScale;
            }
        });
    }
    // 提示球脫鉤 (最小 15px)
    const cueScale = Math.max(15, dynamicSize * 0.05); 
    cueLeft.scale.set(cueScale, cueScale, 1); 
    cueRight.scale.set(cueScale, cueScale, 1);
}

function updatePositions(phaseVal) {
    let pxLeftX = 0, pxRightX = 0, pxLeftY = 0, pxRightY = 0;
    const mode = modeSelect.value, axis = axisSelect.value;
    
    let disp = 0;
    if (mode === 'oneway_bo') disp = ((Math.sin(phaseVal - Math.PI/2) + 1) / 2) * currentDist; 
    else if (mode === 'oneway_bi') disp = -((Math.sin(phaseVal - Math.PI/2) + 1) / 2) * currentDist; 
    else disp = Math.sin(phaseVal) * currentDist; 

    const spec = screenSpecSelect ? screenSpecSelect.value : 'generic';
    let pixelToCm = 2.54 / 96; 
    if (spec === 'retina16') pixelToCm = 34.5 / window.screen.width; 
    else if (spec === 'ipad13') pixelToCm = 2.54 / 132; 
    const viewDistM = (parseFloat(viewDistInput ? viewDistInput.value : 40) || 40) / 100;

    // 開散鎖定 2.0 Δ
    const maxBIPx = (2.0 * viewDistM) / pixelToCm;
    if (disp < 0 && Math.abs(disp * 2) > maxBIPx) {
        disp = -(maxBIPx / 2);
    }

    // 完美物理方向 (BO = 紅左綠右)
    if (axis === 'horizontal') { 
        pxLeftX = disp; pxRightX = -disp; 
    } 
    else if (axis === 'vertical') { 
        pxLeftY = disp; pxRightY = -disp; 
    } 
    else if (axis === 'circular') {
        const orbitX = Math.cos(phaseVal) * Math.abs(currentDist * 0.5);
        const orbitY = Math.sin(phaseVal) * Math.abs(currentDist * 0.5);
        pxLeftX = disp + orbitX; pxRightX = -disp + orbitX;
        pxLeftY = orbitY; pxRightY = orbitY;
    } 
    else {
        pxLeftX = disp; pxRightX = -disp;
    }

    let finalLeftX = pxLeftX + currentRoamX + currentSaccadeX; 
    let finalLeftY = pxLeftY + currentRoamY + currentSaccadeY;
    let finalRightX = pxRightX + currentRoamX + currentSaccadeX; 
    let finalRightY = pxRightY + currentRoamY + currentSaccadeY;

    // 垂直鉗制 (1.5Δ / 5.0Δ)
    const maxVerticalPrism = isTestModeActive ? 1.5 : 5.0;
    const maxVerticalPx = (maxVerticalPrism * viewDistM) / pixelToCm;
    let currentVerticalSep = Math.abs(finalLeftY - finalRightY);
    if (currentVerticalSep > maxVerticalPx) {
        const scale = maxVerticalPx / currentVerticalSep;
        finalLeftY *= scale; finalRightY *= scale;
    }

    if(targetLeft && targetRight) {
        targetLeft.children.forEach((layer, i) => { layer.position.x = -(i * 15) * currentStereo; });
        targetRight.children.forEach((layer, i) => { layer.position.x = (i * 15) * currentStereo; });
        
        targetLeft.position.set(finalLeftX, finalLeftY, 0); 
        targetRight.position.set(finalRightX, finalRightY, 0);
        
        const sepPx = Math.abs(targetLeft.position.x - targetRight.position.x);
        sepVal.innerText = sepPx.toFixed(1) + 'px';

        const sepCm = sepPx * pixelToCm;
        const prismDiopter = sepCm / viewDistM;
        
        let prismDir = "";
        if (sepPx > 0.1) prismDir = targetRight.position.x < targetLeft.position.x ? " BO" : " BI"; 
        prismValEl.innerText = prismDiopter.toFixed(1) + ' Δ' + prismDir;
    }

    if (taskActive && isTestModeActive) {
        const offsetDist = currentSize * 0.65; let dx = 0, dy = 0;
        if (taskDirection === 'ArrowUp') dy = offsetDist; if (taskDirection === 'ArrowDown') dy = -offsetDist;
        if (taskDirection === 'ArrowLeft') dx = -offsetDist; if (taskDirection === 'ArrowRight') dx = offsetDist;
        cueLeft.position.set(finalLeftX + dx, finalLeftY + dy, 20); cueRight.position.set(finalRightX + dx, finalRightY + dy, 20);
    }
}

function spawnTask() {
    if (!isTestModeActive || !isTestModeAllowed) return;
    taskActive = true; taskSpawnTime = performance.now();
    
    taskInitialSep = sepVal.innerText.replace('px', '');
    taskInitialPrism = prismValEl.innerText;

    const dirs = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']; taskDirection = dirs[Math.floor(Math.random() * dirs.length)];
    const eyes = ['both', 'both', 'left', 'right']; taskEye = eyes[Math.floor(Math.random() * eyes.length)];
    cueLeft.visible = (taskEye === 'both' || taskEye === 'left'); cueRight.visible = (taskEye === 'both' || taskEye === 'right');
}

function handleTaskResult(result, rt = 0) {
    taskActive = false; cueLeft.visible = false; cueRight.visible = false; timeSinceLastTask = 0; nextTaskInterval = 2000 + Math.random() * 3000; 
    let logMsg = "", statusLabel = ""; 
    
    const currentSepStr = sepVal.innerText.replace('px', '');
    const currentPrismStr = prismValEl.innerText;
    const dx = targetRight.position.x - targetLeft.position.x; 
    const dy = targetRight.position.y - targetLeft.position.y;

    if (taskEye === 'both') {
        if (result === 'hit') { 
            logMsg = `🟢 完美融像 (反應 ${rt}s) | 稜鏡: ${currentPrismStr}`; 
            statusLabel = "完美融像(FUSION)"; 
            statusText.style.color = '#4ade80'; 
        } else {
            let failType = "";
            let reason = result === 'wrong' ? "按錯方向" : "超時未答";
            if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 5) {
                failType = "垂直融像破裂"; statusLabel = "垂直破裂(VERT_FAIL)";
            } else {
                if (dx < 0) { failType = "聚合不足"; statusLabel = "聚合不足(BO_FAIL)"; } 
                else { failType = "開散不足"; statusLabel = "開散不足(BI_FAIL)"; }
            }
            logMsg = `🔴 ${failType} (${reason}) | 稜鏡: ${currentPrismStr}`; 
            statusText.style.color = '#f87171';
        }
    } else {
        const eyeName = taskEye === 'left' ? '左眼' : '右眼';
        if (result === 'hit') {
            logMsg = `🟢 ${eyeName}去抑制 (反應 ${rt}s)`; statusLabel = `${eyeName}去抑制(ANTI_SUPP_${taskEye.toUpperCase()})`; statusText.style.color = '#4ade80';
        } else {
            let reason = result === 'wrong' ? "按錯方向" : "超時未答";
            logMsg = `⚫ ${eyeName}抑制 (${reason})`; statusLabel = `${eyeName}抑制(SUPP_${taskEye.toUpperCase()})`; statusText.style.color = '#facc15';
        }
    }
    statusText.innerText = logMsg;

    sessionLogs.push({ 
        time: totalTimerSec.toString(), initial_sep: taskInitialSep, initial_prism: taskInitialPrism, 
        response_sep: currentSepStr, response_prism: currentPrismStr, reaction_time: rt,
        stereo: currentStereo.toFixed(2), size: currentSize.toFixed(1), status: statusLabel, eye: taskEye 
    });

    if(statusTimeout) clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
        if (isRunning) { statusText.innerText = isTestModeActive ? "TEST MODE ACTIVE" : "TRAINING"; statusText.style.color = isTestModeActive ? "#deff9a" : '#e11d48'; }
    }, 2000);
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
        
        tableRowsHTML += `
            <tr style="border-bottom: 1px solid #e2e8f0; font-size:13px; text-align:center;">
                <td style="padding: 8px;">${log.time}s</td>
                <td style="padding: 8px; font-weight:bold; color:${statusColor};">${log.status.split('(')[0]}</td>
                <td style="padding: 8px; font-size:12px; color:#64748b;">${log.initial_prism}</td>
                <td style="padding: 8px; font-weight:bold; color:#0f172a;">${log.response_prism}</td>
                <td style="padding: 8px; font-family:monospace;">${log.reaction_time}s</td>
            </tr>
        `;
    });

    const reportOverlay = document.createElement('div');
    reportOverlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15, 23, 42, 0.8); backdrop-filter:blur(5px); z-index:10000; display:flex; justify-content:center; align-items:center; font-family:sans-serif;";
    
    reportOverlay.innerHTML = `
        <div style="background:#ffffff; width: 650px; max-height: 85vh; border-radius:12px; box-shadow: 0 20px 40px rgba(0,0,0,0.3); display:flex; flex-direction:column; overflow:hidden;">
            <div style="background:#4A90E2; color:white; padding: 20px; text-align:center;">
                <h2 style="margin:0; font-size:22px; letter-spacing:1px;">AXP 臨床視覺診療報告</h2>
                <p style="margin:5px 0 0 0; opacity:0.8; font-size:14px;">病患代碼: ${currentPatientCode}</p>
            </div>
            
            <div style="padding: 20px; overflow-y:auto; flex-grow:1; color:#334155;">
                <div style="display:flex; justify-content:space-between; margin-bottom: 20px; background:#f8fafc; padding:15px; border-radius:8px; border:1px solid #e2e8f0;">
                    <div>
                        <p style="margin:0 0 5px 0; font-size:12px; color:#64748b; font-weight:bold;">訓練總時長</p>
                        <p style="margin:0; font-size:18px; font-weight:bold; color:#0f172a;">${Math.floor(totalTime / 60)}分 ${totalTime % 60}秒</p>
                    </div>
                    <div style="text-align:right;">
                        <p style="margin:0 0 5px 0; font-size:12px; color:#64748b; font-weight:bold;">訓練模組</p>
                        <p style="margin:0; font-size:14px; font-weight:bold; color:#0f172a;">${protocolName.split(' ')[0]}</p>
                    </div>
                </div>

                <h3 style="font-size:15px; margin-bottom:10px; color:#4A90E2; border-bottom:1px solid #e2e8f0; padding-bottom:5px;">📊 綜合表現分析</h3>
                <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">
                    <div style="background:#ecfdf5; padding:10px; border-radius:6px; border:1px solid #a7f3d0;">
                        <span style="font-size:12px; color:#059669; font-weight:bold;">🟢 完美融像次數</span><br><span style="font-size:20px; font-weight:bold; color:#065f46;">${fusionCount}</span>
                    </div>
                    <div style="background:#ecfdf5; padding:10px; border-radius:6px; border:1px solid #a7f3d0;">
                        <span style="font-size:12px; color:#059669; font-weight:bold;">🟢 去抑制成功</span><br><span style="font-size:20px; font-weight:bold; color:#065f46;">${antiSuppCount}</span>
                    </div>
                    <div style="background:#fef2f2; padding:10px; border-radius:6px; border:1px solid #fecaca;">
                        <span style="font-size:12px; color:#dc2626; font-weight:bold;">🔴 聚合不足 (BO 破裂)</span><br><span style="font-size:20px; font-weight:bold; color:#991b1b;">${boFail}</span>
                    </div>
                    <div style="background:#fef2f2; padding:10px; border-radius:6px; border:1px solid #fecaca;">
                        <span style="font-size:12px; color:#dc2626; font-weight:bold;">🔴 開散不足 (BI 破裂)</span><br><span style="font-size:20px; font-weight:bold; color:#991b1b;">${biFail}</span>
                    </div>
                    <div style="background:#fffbeb; padding:10px; border-radius:6px; border:1px solid #fde68a;">
                        <span style="font-size:12px; color:#d97706; font-weight:bold;">⚫ 單眼抑制發生</span><br><span style="font-size:20px; font-weight:bold; color:#b45309;">${suppCount}</span>
                    </div>
                    <div style="background:#fef2f2; padding:10px; border-radius:6px; border:1px solid #fecaca;">
                        <span style="font-size:12px; color:#dc2626; font-weight:bold;">🔴 垂直融像破裂</span><br><span style="font-size:20px; font-weight:bold; color:#991b1b;">${vertFail}</span>
                    </div>
                </div>

                <h3 style="font-size:15px; margin-bottom:10px; color:#4A90E2; border-bottom:1px solid #e2e8f0; padding-bottom:5px;">📋 計量級測驗明細</h3>
                <table style="width:100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background:#f1f5f9; font-size:12px; color:#64748b;">
                            <th style="padding:8px; text-align:center;">時間點</th>
                            <th style="padding:8px; text-align:center;">判定狀態</th>
                            <th style="padding:8px; text-align:center;">出現時稜鏡($T_0$)</th>
                            <th style="padding:8px; text-align:center;">按下時稜鏡($T_{resp}$)</th>
                            <th style="padding:8px; text-align:center;">反應時間</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHTML || '<tr><td colspan="5" style="text-align:center; padding:10px; color:#94a3b8;">無測驗紀錄</td></tr>'}
                    </tbody>
                </table>
            </div>

            <div style="padding: 15px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; text-align:center;">
                <button id="close-report-btn" style="background:#D4AF37; color:white; border:none; padding:10px 25px; border-radius:6px; font-size:15px; cursor:pointer; font-weight:bold; transition:0.2s;">關閉並初始化系統</button>
            </div>
        </div>
    `;

    document.body.appendChild(reportOverlay);
    document.getElementById('close-report-btn').addEventListener('click', () => { document.body.removeChild(reportOverlay); executeReset(); });
}

async function uploadToSupabase() {
    if (sessionLogs.length === 0) return alert("尚無測驗數據可供上傳與產生報告！");
    
    const logsCopy = [...sessionLogs]; 
    const finalTime = totalTimerSec;
    const finalProtocol = activeProtocol ? PROTOCOL_NAMES[activeProtocol] : 'MANUAL_MODE';

    isRunning = false; cancelAnimationFrame(animationId); startBtn.innerText = "開始 [ Space ]"; startBtn.classList.remove('active');
    statusText.innerText = "UPLOADING TO SUPABASE..."; statusText.style.color = "#38bdf8";
    
    try {
        const { data, error } = await supabase.from('training_sessions').insert([{ duration_sec: finalTime, protocol_name: finalProtocol, raw_data: logsCopy }]);
        if (error) throw error;
        
        statusText.innerText = "UPLOAD SUCCESSFUL"; statusText.style.color = "#4ade80";
        showClinicalReport(logsCopy, finalTime, finalProtocol);
        sessionLogs = []; 

    } catch (err) {
        console.error("Supabase 上傳錯誤:", err); alert("資料上傳失敗。\n錯誤訊息: " + err.message);
        statusText.innerText = "UPLOAD FAILED"; statusText.style.color = "#f87171";
    }
}

function checkProtocolTestAllowance(code) {
    if (['KeyO', 'KeyP'].includes(code)) { isTestModeAllowed = false; isTestModeActive = false; cueLeft.visible = false; cueRight.visible = false; taskActive = false; } 
    else { isTestModeAllowed = true; }
}

function updateGlassesUI() {
    if (glassesSelect.value === 'rc') {
        greenSlider.style.display = 'none'; blueChannelBox.style.display = 'block';
        ghostingLabelDisplay.innerHTML = `B (左): <span id="b-val">${blueSlider.value}%</span> | R (右): <span id="r-val">${redSlider.value}%</span>`;
    } else {
        greenSlider.style.display = 'block'; blueChannelBox.style.display = 'none';
        ghostingLabelDisplay.innerHTML = `G (左): <span id="g-val">${greenSlider.value}%</span> | R (右): <span id="r-val">${redSlider.value}%</span>`;
    }
    buildTargets();
}

glassesSelect.addEventListener('change', updateGlassesUI);
[redSlider, greenSlider, blueSlider].forEach(slider => slider.addEventListener('input', updateColorsFromUI));

function updateUIValues() {
    sizeLabel.innerText = currentSize.toFixed(1) + 'px'; distLabel.innerText = currentDist.toFixed(1) + 'px';
    speedLabel.innerText = currentSpeed.toFixed(1); thickLabel.innerText = currentThick.toFixed(1);
    stereoLabel.innerText = (currentStereo > 0 ? '+' : '') + currentStereo.toFixed(2);
    document.getElementById('hud-stereo-val').innerText = currentStereo.toFixed(2);
    let balance = parseInt(balanceSlider.value); balanceLabel.innerText = balance === 50 ? "均衡 50/50" : (balance < 50 ? `L弱 ${balance}%` : `R弱 ${100-balance}%`);
    sizeSlider.value = currentSize; distSlider.value = currentDist; speedSlider.value = currentSpeed; thickSlider.value = currentThick; stereoSlider.value = currentStereo;
}

if (screenSpecSelect) screenSpecSelect.addEventListener('change', () => { if (!isRunning) updatePositions(phase); });
if (viewDistInput) viewDistInput.addEventListener('input', () => { if (!isRunning) updatePositions(phase); });

sizeSlider.addEventListener('input', (e) => { currentSize = parseFloat(e.target.value); updateUIValues(); updateScaleAndThickness(); if (!isRunning) renderer.render(scene, camera); disableAI(); });
distSlider.addEventListener('input', (e) => { currentDist = parseFloat(e.target.value); updateUIValues(); if (!isRunning) updatePositions(0); disableAI(); });
speedSlider.addEventListener('input', (e) => { currentSpeed = parseFloat(e.target.value); updateUIValues(); disableAI(); });
thickSlider.addEventListener('input', (e) => { currentThick = parseFloat(e.target.value); updateUIValues(); buildTargets(); disableAI(); });

// 🚀 強制將手動調整限制在 -0.1 到 0.1
stereoSlider.addEventListener('input', (e) => { currentStereo = Math.max(-0.1, Math.min(0.1, parseFloat(e.target.value))); e.target.value = currentStereo; updateUIValues(); if (!isRunning) updatePositions(0); disableAI(); });

balanceSlider.addEventListener('input', () => { updateUIValues(); updateColorsFromUI(); disableAI(); });
rotateCheckbox.addEventListener('change', (e) => { isRotating = e.target.checked; disableAI(); });
shapeSelect.addEventListener('change', buildTargets); customTextInput.addEventListener('input', buildTargets); 
fillCheckbox.addEventListener('change', (e) => { isFilled = e.target.checked; buildTargets(); });

function disableAI() {
    if (aiToggle.checked) { 
        aiToggle.checked = false; dynamicModeTag.innerText = "AXP FUSION DYNAMICS (手動模式)"; dynamicModeTag.style.color = '#f8fafc'; 
        activeProtocol = null; isTestModeAllowed = true; 
    }
}

// 🚀 1~6 階循環隔離保護
function loadMatrixStage(protocol, stage) {
    const config = AIM_MATRIX[protocol][stage]; if (!config) return;
    shapeSelect.value = config.shape; axisSelect.value = config.axis; modeSelect.value = config.mode; fillCheckbox.checked = config.fill; isFilled = config.fill;
    
    // 🚀 強制將矩陣載入的立體視限制在 0.1 內
    currentStereo = Math.max(-0.1, Math.min(0.1, config.stereo)); 
    currentSize = config.size; currentDist = config.dist * 0.3; currentSpeed = config.speed; currentThick = config.thick;
    isRotating = !config.anim.includes('none'); rotateCheckbox.checked = isRotating; updateUIValues(); buildTargets();
    
    const stageMaxStr = isTestModeActive ? '6 (TEST)' : '10';
    dynamicModeTag.innerText = `[ ${PROTOCOL_NAMES[protocol].split(' ')[0]} ] Stage ${stage + 1}/${stageMaxStr} : ${config.name}`;
    dynamicModeTag.style.color = '#deff9a'; protocolTime = 0; aiChaosTimer = 0; currentSaccadeX = 0; currentSaccadeY = 0; saccadeTimer = 0; currentRoamX = 0; currentRoamY = 0;
}

function animate(time) {
    if (!isRunning) return;
    if (!lastTime) lastTime = time; const dt = time - lastTime; lastTime = time;
    if (Math.floor(time / 1000) > Math.floor((time - dt) / 1000)) {
        totalTimerSec++; timerDisplay.innerText = Math.floor(totalTimerSec / 60).toString().padStart(2, '0') + ':' + (totalTimerSec % 60).toString().padStart(2, '0');
    }
    const speedFactor = 40000 / Math.max(1, currentSpeed); phase += dt / speedFactor; 

    if (isTestModeActive && isTestModeAllowed) {
        if (!taskActive) { timeSinceLastTask += dt; if (timeSinceLastTask > nextTaskInterval) spawnTask(); } 
        // 🚀 延長超時判定至 8 秒
        else { if (performance.now() - taskSpawnTime > 8000) handleTaskResult('miss'); }
    }

    if (aiToggle.checked && activeProtocol) {
        protocolTime += dt; const config = AIM_MATRIX[activeProtocol][protocolStage]; const anim = config.anim || ''; const progress = protocolTime / 60000;
        currentDist = config.dist * (0.3 + 0.7 * Math.sin(progress * (Math.PI / 2))); distSlider.value = currentDist; distLabel.innerText = currentDist.toFixed(1) + 'px';
        
        if (anim.includes('roam') || config.axis === 'roam') { currentRoamX = Math.sin(protocolTime / 3000) * 200; currentRoamY = Math.cos(protocolTime / 2100) * 120; }
        if (anim.includes('saccade') || config.axis === 'saccade') { saccadeTimer += dt; if (saccadeTimer > 1500) { saccadeTimer = 0; currentSaccadeX = (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 150); currentSaccadeY = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 100); }}
        
        // 🚀 AI 運行中的立體視動畫強制鎖定在 0.1 內
        if (anim.includes('breathSize')) updateScaleAndThickness(currentSize + (currentSize * 0.15 * Math.sin(protocolTime / 1500)));
        if (anim.includes('pulseZ_in')) currentStereo = Math.max(-0.1, Math.min(0.1, config.stereo + (Math.sin(protocolTime / 1000) + 1) / 2 * 0.2));
        if (anim.includes('pulseZ_out')) currentStereo = Math.max(-0.1, Math.min(0.1, config.stereo - (Math.sin(protocolTime / 1000) + 1) / 2 * 0.2));
        if (anim.includes('flipStereo_hard')) currentStereo = Math.max(-0.1, Math.min(0.1, Math.sin(protocolTime / 1000) * 0.3));
        
        if (anim.includes('chaos')) {
            aiChaosTimer += dt;
            if (aiChaosTimer > 2000) {
                aiChaosTimer = 0; currentSpeed = Math.max(10, Math.min(100, config.speed + (Math.random() * 60 - 30))); speedSlider.value = currentSpeed; speedLabel.innerText = currentSpeed.toFixed(1);
                currentThick = Math.max(2, Math.min(20, config.thick + (Math.random() * 10 - 5))); thickSlider.value = currentThick; thickLabel.innerText = currentThick.toFixed(1); buildTargets();
            }
            currentStereo = Math.max(-0.1, Math.min(0.1, Math.sin(protocolTime / 500) * 0.3)); updateScaleAndThickness(currentSize + (currentSize * 0.3 * Math.sin(protocolTime / 200)));
        }

        if (anim.includes('balanceDrift')) {
            const drift = Math.sin(protocolTime / 1000) * 0.4 + 0.6; 
            targetLeft.traverse(c => { if(c.isMesh) c.material.opacity = drift; }); targetRight.traverse(c => { if(c.isMesh) c.material.opacity = 1.2 - drift; });
        }
        if (anim.includes('sensoryOverload')) {
            const flash = Math.floor(protocolTime / 150) % 2 === 0;
            targetLeft.traverse(c => { if(c.isMesh) c.material.opacity = flash ? 1 : 0.1; }); targetRight.traverse(c => { if(c.isMesh) c.material.opacity = flash ? 0.1 : 1; });
            updateScaleAndThickness(currentSize + (Math.random() * 40 - 20));
        }

        stereoSlider.value = currentStereo; stereoLabel.innerText = currentStereo.toFixed(2);
        
        if (anim.includes('rivalry') || anim.includes('flicker')) {
            let isRedTurn = Math.floor(protocolTime / (anim.includes('flicker') ? 100 : 500)) % 2 === 0;
            targetLeft.traverse(c => { if(c.isMesh) c.material.opacity = isRedTurn ? 1 : 0.05; });
            targetRight.traverse(c => { if(c.isMesh) c.material.opacity = isRedTurn ? 0.05 : 1; });
        }
        
        const maxStages = isTestModeActive ? 6 : 10;
        if (protocolTime > 60000) { protocolStage = (protocolStage + 1) % maxStages; loadMatrixStage(activeProtocol, protocolStage); }
    }

    if(targetLeft && targetRight) {
        targetLeft.children.forEach((layer, index) => { if (shapeSelect.value.includes('crystal') && isRotating) { layer.rotation.x += (index % 2 === 0 ? 0.01 : -0.01); layer.rotation.y += 0.015; } });
        targetRight.children.forEach((layer, index) => { if (shapeSelect.value.includes('crystal') && isRotating) { layer.rotation.x += (index % 2 === 0 ? 0.01 : -0.01); layer.rotation.y += 0.015; } });
    }
    updatePositions(phase); if (isRotating) { targetLeft.rotation.z = phase * 0.5; targetRight.rotation.z = phase * 0.5; }
    renderer.render(scene, camera); animationId = requestAnimationFrame(animate);
}

function toggleTraining() {
    if(loginOverlay.style.display !== 'none') return; 
    isRunning = !isRunning;
    if (isRunning) {
        startBtn.innerText = "暫停 [ Space ]"; startBtn.classList.add('active'); statusText.innerText = isTestModeActive ? "TEST MODE ACTIVE" : "TRAINING"; statusText.style.color = isTestModeActive ? "#deff9a" : '#e11d48';
        lastTime = performance.now(); animate(lastTime);
    } else {
        startBtn.innerText = "繼續 [ Space ]"; startBtn.classList.remove('active'); statusText.innerText = "PAUSED"; statusText.style.color = '#FCE473'; cancelAnimationFrame(animationId);
        taskActive = false; cueLeft.visible = false; cueRight.visible = false;
    }
}

function executeReset() {
    isRunning = false; cancelAnimationFrame(animationId); startBtn.innerText = "開始 [ Space ]"; startBtn.classList.remove('active');
    statusText.innerText = "IDLE"; statusText.style.color = '#f8fafc'; totalTimerSec = 0; timerDisplay.innerText = "00:00"; disableAI();
    taskActive = false; isTestModeActive = false; cueLeft.visible = false; cueRight.visible = false;
    
    currentSize = 200; currentDist = 120; currentSpeed = 20; currentStereo = 0; currentThick = 9.0;
    currentSaccadeX = 0; currentSaccadeY = 0; currentRoamX = 0; currentRoamY = 0; phase = 0;
    isRotating = true; isFilled = false; sessionLogs = [];
    
    shapeSelect.value = 'star5'; axisSelect.value = 'horizontal'; modeSelect.value = 'crossover';
    rotateCheckbox.checked = true; fillCheckbox.checked = false; balanceSlider.value = 50;
    
    // 初始化時 RGB 滑桿歸位 50%
    redSlider.value = 50; greenSlider.value = 50; blueSlider.value = 50;
    
    updateUIValues(); updateColorsFromUI(); buildTargets(); updatePositions(0);
}

startBtn.addEventListener('click', toggleTraining); resetBtn.addEventListener('click', executeReset);

fullscreenBtn.addEventListener('click', () => {
    const elem = document.getElementById('fv-fusion-app');
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (elem.requestFullscreen) { elem.requestFullscreen(); } else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); } 
    } else {
        if (document.exitFullscreen) { document.exitFullscreen(); } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
    }
});

document.addEventListener('keydown', (e) => {
    if(loginOverlay.style.display !== 'none') return; 
    if (document.activeElement.tagName === 'INPUT' && document.activeElement.type !== 'range' && document.activeElement.type !== 'checkbox') return;
    const code = e.code;
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
        e.preventDefault();
        if (taskActive && isRunning && isTestModeActive) { const rt = ((performance.now() - taskSpawnTime) / 1000).toFixed(2); if (code === taskDirection) handleTaskResult('hit', rt); else handleTaskResult('wrong', rt); }
        return;
    }

    const shortcuts = ['Space', 'Enter', 'KeyE', 'KeyW', 'KeyS', 'KeyD', 'KeyA', 'KeyF', 'KeyR', 'KeyG', 'KeyZ', 'Digit0', 'Numpad0', 'BracketLeft', 'BracketRight', 'Comma', 'Period', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'];
    if (shortcuts.includes(code)) {
        e.preventDefault(); if (document.activeElement) document.activeElement.blur(); 
        switch(code) {
            case 'Space': toggleTraining(); break; 
            case 'Enter': executeReset(); break; 
            case 'KeyE': controlPanel.style.display = controlPanel.style.display === 'none' ? 'flex' : 'none'; setTimeout(onWindowResize, 50); break;
            case 'KeyG': uploadToSupabase(); break; 
            case 'KeyZ': aiToggle.checked = !aiToggle.checked; if (!aiToggle.checked) disableAI(); break;
            case 'Digit0': case 'Numpad0':
                if (!isTestModeAllowed) { alert("當前訓練 Program 限制進行測驗。"); break; }
                isTestModeActive = !isTestModeActive;
                if (!isTestModeActive) { taskActive = false; cueLeft.visible = false; cueRight.visible = false; if (isRunning) { statusText.innerText = "TRAINING"; statusText.style.color = '#e11d48'; } } 
                else { if (isRunning) { statusText.innerText = "TEST MODE ACTIVE"; statusText.style.color = '#deff9a'; } }
                break;
            // 🚀 快捷鍵調整立體視也嚴格限制在 0.1 內
            case 'BracketRight': stereoSlider.value = Math.min(0.1, parseFloat(stereoSlider.value) + 0.01).toFixed(2); stereoSlider.dispatchEvent(new Event('input')); break;
            case 'BracketLeft': stereoSlider.value = Math.max(-0.1, parseFloat(stereoSlider.value) - 0.01).toFixed(2); stereoSlider.dispatchEvent(new Event('input')); break;
            case 'Period': speedSlider.value = Math.min(100, parseFloat(speedSlider.value) + (e.shiftKey ? 10 : 1)); speedSlider.dispatchEvent(new Event('input')); break;
            case 'Comma': speedSlider.value = Math.max(1, parseFloat(speedSlider.value) - (e.shiftKey ? 10 : 1)); speedSlider.dispatchEvent(new Event('input')); break;
            case 'KeyW': currentSize = Math.min(600, currentSize + 10); currentThick = Math.min(25, currentThick + 0.5); updateUIValues(); buildTargets(); disableAI(); break;
            case 'KeyS': currentSize = Math.max(50, currentSize - 10); currentThick = Math.max(2, currentThick - 0.5); updateUIValues(); buildTargets(); disableAI(); break;
            case 'KeyD': currentThick = Math.min(25, currentThick + 1.0); updateUIValues(); buildTargets(); disableAI(); break;
            case 'KeyA': currentThick = Math.max(2, currentThick - 1.0); updateUIValues(); buildTargets(); disableAI(); break;
            case 'KeyF': fillCheckbox.checked = !fillCheckbox.checked; fillCheckbox.dispatchEvent(new Event('change')); break;
            case 'KeyR': rotateCheckbox.checked = !rotateCheckbox.checked; rotateCheckbox.dispatchEvent(new Event('change')); break;
            case 'KeyY': case 'KeyU': case 'KeyI': case 'KeyO': case 'KeyP':
                aiToggle.checked = true; checkProtocolTestAllowance(code); 
                const maxStages = isTestModeActive ? 6 : 10;
                if (activeProtocol === code && isRunning) { protocolStage = (protocolStage + 1) % maxStages; } else { activeProtocol = code; protocolStage = 0; }
                loadMatrixStage(activeProtocol, protocolStage); if (!isRunning) toggleTraining(); break;
        }
    }
});

// 強制初始化色彩滑桿為 50%
redSlider.value = 50; greenSlider.value = 50; blueSlider.value = 50;

updateGlassesUI(); 
updateUIValues();
updateColorsFromUI(); 

function onWindowResize() {
    const width = container.clientWidth; const height = container.clientHeight;
    camera.left = -d * (width / height); camera.right = d * (width / height); camera.updateProjectionMatrix();
    renderer.setSize(width, height); if (!isRunning) renderer.render(scene, camera);
}
window.addEventListener('resize', onWindowResize); setTimeout(onWindowResize, 100);