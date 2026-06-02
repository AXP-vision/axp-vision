// app.js - AXP Fusion Dynamics: 雲端大腦串接版 (v5.0 Supabase SaaS MVP)
import { AIM_MATRIX, PROTOCOL_NAMES } from './matrix.js';
import { createTarget } from './shapes.js';
// 🚀 1. 引入 Supabase 官方模組
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// 🚀 2. 設定您的雲端大腦鑰匙 (請替換下方金鑰)
const supabaseUrl = 'https://wvholwcyrldixlsgoege.supabase.co';
const supabaseKey = 'sb_publishable_BozJ84tPQF-jBHGKtXKqgw_ELodM54e'; // <--- ⚠️ 執行長，請把您的 sb_publishable... 金鑰貼在這裡！
const supabase = createClient(supabaseUrl, supabaseKey);

// === 🚀 3. 動態生成 SaaS 強制登入介面 ===
let currentPatientCode = 'GUEST'; // 預設訪客
const loginOverlay = document.createElement('div');
loginOverlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(0,0,0,0.95); z-index:9999; display:flex; flex-direction:column; justify-content:center; align-items:center; color:white; font-family:sans-serif;";
loginOverlay.innerHTML = `
    <h1 style="color:#deff9a; letter-spacing:2px; margin-bottom:10px;">AXP FUSION DYNAMICS</h1>
    <p style="color:#94a3b8; margin-bottom:30px;">企業級雙眼視覺雲端診療系統</p>
    <div style="background:#1e293b; padding:30px; border-radius:12px; text-align:center; border:1px solid #334155;">
        <p style="margin-bottom:15px; font-size:14px; color:#cbd5e1;">請輸入驗光師配發的病患代碼</p>
        <input type="text" id="patient-code-input" placeholder="例如: AXP-001" style="padding:10px; width:200px; text-align:center; border-radius:6px; border:none; margin-bottom:20px; font-size:16px; font-weight:bold; color:#0f172a;">
        <br>
        <button id="login-btn" style="background:#2563eb; color:white; border:none; padding:12px 30px; border-radius:6px; font-size:16px; cursor:pointer; font-weight:bold; transition:0.3s;">登入並開始訓練</button>
    </div>
`;
document.body.appendChild(loginOverlay);

// 登入按鈕邏輯
document.getElementById('login-btn').addEventListener('click', () => {
    const code = document.getElementById('patient-code-input').value.trim();
    if(!code) return alert("請輸入病患代碼！");
    currentPatientCode = code; // 記住登入的病患代碼
    loginOverlay.style.display = 'none'; // 隱藏登入畫面，進入 3D 訓練
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

stereoSlider.min = "-0.3"; stereoSlider.max = "0.3"; // 絕對深度鎖定

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
    const colorLeft = glassesSelect.value === 'rc' ? ((b << 8) | b) : (g << 8); // 左眼藍綠
    const colorRight = (r << 16); // 右眼紅
    let balance = parseInt(balanceSlider.value);
    let opacityLeft = balance < 50 ? (balance / 50) : 1;
    let opacityRight = balance > 50 ? ((100 - balance) / 50) : 1;
    return { left: colorLeft, right: colorRight, opLeft: opacityLeft, opRight: opacityRight };
}

function clearTargets() {
    if (targetLeft) { targetLeft.traverse(child => { if(child.isMesh) { child.geometry.dispose(); child.material.dispose(); }}); scene.remove(targetLeft); }
    if (targetRight) { targetRight.traverse(child => { if(child.isMesh) { child.geometry.dispose(); child.material.dispose(); }}); scene.remove(targetRight); }
}

function buildTargets() {
    clearTargets(); 
    textInputGroup.style.display = shapeSelect.value === 'text' ? 'block' : 'none';
    const visualConfig = getColorsAndOpacity();
    targetLeft = createTarget(shapeSelect.value, visualConfig.left, isFilled, customTextInput.value, currentThick);
    targetRight = createTarget(shapeSelect.value, visualConfig.right, isFilled, customTextInput.value, currentThick);
    targetLeft.traverse(child => { if(child.isMesh) { child.material.opacity = visualConfig.opLeft; child.material.transparent = true; } });
    targetRight.traverse(child => { if(child.isMesh) { child.material.opacity = visualConfig.opRight; child.material.transparent = true; } });
    cueLeft.material.color.setHex(visualConfig.left); cueRight.material.color.setHex(visualConfig.right);
    updateScaleAndThickness(); scene.add(targetLeft); scene.add(targetRight);
    if (!isRunning) renderer.render(scene, camera);
}

function updateScaleAndThickness(dynamicSize = currentSize) {
    const scaleFactor = dynamicSize / 200;
    if(targetLeft && targetRight) { targetLeft.scale.set(scaleFactor, scaleFactor, scaleFactor); targetRight.scale.set(scaleFactor, scaleFactor, scaleFactor); }
    const cueScale = dynamicSize * 0.05; cueLeft.scale.set(cueScale, cueScale, 1); cueRight.scale.set(cueScale, cueScale, 1);
}

function updatePositions(phaseVal) {
    let pxLeftX = 0, pxRightX = 0, pxLeftY = 0, pxRightY = 0;
    const mode = modeSelect.value, axis = axisSelect.value;
    let distance = 0;
    if (mode === 'oneway_bo') distance = (Math.sin(phaseVal - Math.PI/2) + 1) / 2 * currentDist; 
    else if (mode === 'oneway_bi') distance = -(Math.sin(phaseVal - Math.PI/2) + 1) / 2 * currentDist; 
    else distance = Math.sin(phaseVal) * currentDist; 

    if (axis === 'horizontal') { pxLeftX = -distance; pxRightX = distance; } 
    else if (axis === 'vertical') { pxLeftY = -distance; pxRightY = distance; } 
    else if (axis === 'circular') {
        pxLeftX = -Math.cos(phaseVal) * Math.abs(distance); pxRightX = Math.cos(phaseVal) * Math.abs(distance);
        pxLeftY = -Math.sin(phaseVal) * Math.abs(distance); pxRightY = Math.sin(phaseVal) * Math.abs(distance);
    }
    const finalLeftX = pxLeftX + currentRoamX + currentSaccadeX; const finalLeftY = pxLeftY + currentRoamY + currentSaccadeY;
    const finalRightX = pxRightX + currentRoamX + currentSaccadeX; const finalRightY = pxRightY + currentRoamY + currentSaccadeY;

    if(targetLeft && targetRight) {
        targetLeft.children.forEach((layer, i) => { layer.position.x = -(i * 15) * currentStereo; });
        targetRight.children.forEach((layer, i) => { layer.position.x = (i * 15) * currentStereo; });
    }
    targetLeft.position.set(finalLeftX, finalLeftY, 0); targetRight.position.set(finalRightX, finalRightY, 0);
    sepVal.innerText = (Math.abs(targetLeft.position.x - targetRight.position.x)).toFixed(1) + 'px';

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
    const dirs = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']; taskDirection = dirs[Math.floor(Math.random() * dirs.length)];
    const eyes = ['both', 'both', 'left', 'right']; taskEye = eyes[Math.floor(Math.random() * eyes.length)];
    cueLeft.visible = (taskEye === 'both' || taskEye === 'left'); cueRight.visible = (taskEye === 'both' || taskEye === 'right');
}

function handleTaskResult(result, rt = 0) {
    taskActive = false; cueLeft.visible = false; cueRight.visible = false; timeSinceLastTask = 0; nextTaskInterval = 2000 + Math.random() * 3000; 
    let logMsg = "", statusLabel = ""; const currentSepStr = sepVal.innerText.replace('px', '');

    if (result === 'hit') { logMsg = `🟢 完美融像 (反應 ${rt}s) | SEP: ${sepVal.innerText}`; statusLabel = "融像穩定(FUSION)"; statusText.style.color = '#4ade80'; } 
    else if (result === 'wrong') { logMsg = `🔴 複視破裂 (按錯) | SEP: ${sepVal.innerText}`; statusLabel = "複視破裂(BREAK_WRONG)"; statusText.style.color = '#f87171'; } 
    else if (result === 'miss') {
        if (taskEye === 'both') { logMsg = `🔴 複視破裂 (超時) | SEP: ${sepVal.innerText}`; statusLabel = "複視破裂(BREAK_TIMEOUT)"; } 
        else { logMsg = `⚫ 單眼抑制 (${taskEye === 'left' ? '左眼' : '右眼'}) | SEP: ${sepVal.innerText}`; statusLabel = `單眼抑制(SUPPRESSION_${taskEye.toUpperCase()})`; }
        statusText.style.color = '#facc15';
    }
    statusText.innerText = logMsg;

    sessionLogs.push({ time: totalTimerSec.toString(), sep: currentSepStr, stereo: currentStereo.toFixed(2), size: currentSize.toFixed(1), status: statusLabel, eye: taskEye });

    if(statusTimeout) clearTimeout(statusTimeout);
    statusTimeout = setTimeout(() => {
        if (isRunning) { statusText.innerText = isTestModeActive ? "TEST MODE ACTIVE" : "TRAINING"; statusText.style.color = isTestModeActive ? "#deff9a" : '#e11d48'; }
    }, 2000);
}

// === 🚀 4. API 雲端資料回傳函數 (取代原本的下載 CSV) ===
async function uploadToSupabase() {
    if (sessionLogs.length === 0) return alert("尚無測驗數據可供上傳！");
    statusText.innerText = "UPLOADING TO SUPABASE...";
    statusText.style.color = "#38bdf8";
    
    try {
        // 使用 Supabase client 將記憶體陣列直接 POST 到資料表
        const { data, error } = await supabase
            .from('training_sessions')
            .insert([
                {
                    duration_sec: totalTimerSec,
                    protocol_name: activeProtocol ? PROTOCOL_NAMES[activeProtocol] : 'MANUAL_MODE',
                    raw_data: sessionLogs,
                    // 為了初期快速 MVP，clinic_id 和 patient_id 允許為 null。
                    // 未來這裡會接上真實的患者 UUID。
                }
            ]);

        if (error) throw error;
        
        alert(`上傳成功！\n病患 [${currentPatientCode}] 的訓練紀錄已寫入雲端資料庫。`);
        statusText.innerText = "UPLOAD SUCCESSFUL";
        statusText.style.color = "#4ade80";
        sessionLogs = []; // 上傳成功後清空陣列

    } catch (err) {
        console.error("Supabase 上傳錯誤:", err);
        alert("資料上傳失敗，請檢查金鑰或網路連線。\n錯誤訊息: " + err.message);
        statusText.innerText = "UPLOAD FAILED";
        statusText.style.color = "#f87171";
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

function updateColorsFromUI() {
    if (document.getElementById('r-val')) document.getElementById('r-val').innerText = redSlider.value + '%';
    if (document.getElementById('g-val')) document.getElementById('g-val').innerText = greenSlider.value + '%';
    if (document.getElementById('b-val')) document.getElementById('b-val').innerText = blueSlider.value + '%';
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

sizeSlider.addEventListener('input', (e) => { currentSize = parseFloat(e.target.value); updateUIValues(); updateScaleAndThickness(); if (!isRunning) renderer.render(scene, camera); disableAI(); });
distSlider.addEventListener('input', (e) => { currentDist = parseFloat(e.target.value); updateUIValues(); if (!isRunning) updatePositions(0); disableAI(); });
speedSlider.addEventListener('input', (e) => { currentSpeed = parseFloat(e.target.value); updateUIValues(); disableAI(); });
thickSlider.addEventListener('input', (e) => { currentThick = parseFloat(e.target.value); updateUIValues(); buildTargets(); disableAI(); });
stereoSlider.addEventListener('input', (e) => { currentStereo = Math.max(-0.3, Math.min(0.3, parseFloat(e.target.value))); e.target.value = currentStereo; updateUIValues(); if (!isRunning) updatePositions(0); disableAI(); });
balanceSlider.addEventListener('input', () => { updateUIValues(); buildTargets(); disableAI(); });
rotateCheckbox.addEventListener('change', (e) => { isRotating = e.target.checked; disableAI(); });
shapeSelect.addEventListener('change', buildTargets);
customTextInput.addEventListener('input', buildTargets); 
fillCheckbox.addEventListener('change', (e) => { isFilled = e.target.checked; buildTargets(); });

function disableAI() {
    if (aiToggle.checked) { aiToggle.checked = false; dynamicModeTag.innerText = "AXP FUSION DYNAMICS (手動模式)"; dynamicModeTag.style.color = '#f8fafc'; activeProtocol = null; isTestModeAllowed = true; }
}

function loadMatrixStage(protocol, stage) {
    const config = AIM_MATRIX[protocol][stage]; if (!config) return;
    shapeSelect.value = config.shape; axisSelect.value = config.axis; modeSelect.value = config.mode; fillCheckbox.checked = config.fill; isFilled = config.fill;
    currentStereo = Math.max(-0.3, Math.min(0.3, config.stereo)); 
    currentSize = config.size; currentDist = config.dist * 0.3; currentSpeed = config.speed; currentThick = config.thick;
    isRotating = !config.anim.includes('none'); rotateCheckbox.checked = isRotating; updateUIValues(); buildTargets();
    dynamicModeTag.innerText = `[ ${PROTOCOL_NAMES[protocol].split(' ')[0]} ] Stage ${stage + 1}/10 : ${config.name}`;
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
        else { if (performance.now() - taskSpawnTime > 2500) handleTaskResult('miss'); }
    }

    if (aiToggle.checked && activeProtocol) {
        protocolTime += dt; const config = AIM_MATRIX[activeProtocol][protocolStage]; const anim = config.anim; const progress = protocolTime / 60000;
        currentDist = config.dist * (0.3 + 0.7 * Math.sin(progress * (Math.PI / 2))); distSlider.value = currentDist; distLabel.innerText = currentDist.toFixed(1) + 'px';
        if (anim.includes('roam') || config.axis === 'roam') { currentRoamX = Math.sin(protocolTime / 3000) * 200; currentRoamY = Math.cos(protocolTime / 2100) * 120; }
        if (anim.includes('saccade') || config.axis === 'saccade') { saccadeTimer += dt; if (saccadeTimer > 1500) { saccadeTimer = 0; currentSaccadeX = (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 150); currentSaccadeY = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 100); }}
        if (anim.includes('breathSize')) updateScaleAndThickness(currentSize + (currentSize * 0.15 * Math.sin(protocolTime / 1500)));
        if (anim.includes('pulseZ_in')) currentStereo = Math.max(-0.3, Math.min(0.3, config.stereo + (Math.sin(protocolTime / 1000) + 1) / 2 * 0.2));
        if (anim.includes('pulseZ_out')) currentStereo = Math.max(-0.3, Math.min(0.3, config.stereo - (Math.sin(protocolTime / 1000) + 1) / 2 * 0.2));
        if (anim.includes('flipStereo_hard')) currentStereo = Math.max(-0.3, Math.min(0.3, Math.sin(protocolTime / 1000) * 0.3));
        if (anim === 'chaos') {
            aiChaosTimer += dt;
            if (aiChaosTimer > 2000) {
                aiChaosTimer = 0; currentSpeed = Math.max(10, Math.min(100, config.speed + (Math.random() * 60 - 30))); speedSlider.value = currentSpeed; speedLabel.innerText = currentSpeed.toFixed(1);
                currentThick = Math.max(2, Math.min(20, config.thick + (Math.random() * 10 - 5))); thickSlider.value = currentThick; thickLabel.innerText = currentThick.toFixed(1); buildTargets();
            }
            currentStereo = Math.max(-0.3, Math.min(0.3, Math.sin(protocolTime / 500) * 0.3)); updateScaleAndThickness(currentSize + (currentSize * 0.3 * Math.sin(protocolTime / 200)));
        }
        stereoSlider.value = currentStereo; stereoLabel.innerText = currentStereo.toFixed(2);
        if (anim.includes('rivalry') || anim.includes('flicker')) {
            let isRedTurn = Math.floor(protocolTime / (anim.includes('flicker') ? 100 : 500)) % 2 === 0;
            targetLeft.traverse(c => { if(c.isMesh) c.material.opacity = isRedTurn ? 1 : 0.05; });
            targetRight.traverse(c => { if(c.isMesh) c.material.opacity = isRedTurn ? 0.05 : 1; });
        }
        if (protocolTime > 60000) { protocolStage = (protocolStage + 1) % 10; loadMatrixStage(activeProtocol, protocolStage); }
    }

    if(targetLeft && targetRight) {
        targetLeft.children.forEach((layer, index) => { if (shapeSelect.value.includes('crystal') && isRotating) { layer.rotation.x += (index % 2 === 0 ? 0.01 : -0.01); layer.rotation.y += 0.015; } });
        targetRight.children.forEach((layer, index) => { if (shapeSelect.value.includes('crystal') && isRotating) { layer.rotation.x += (index % 2 === 0 ? 0.01 : -0.01); layer.rotation.y += 0.015; } });
    }
    updatePositions(phase); if (isRotating) { targetLeft.rotation.z = phase * 0.5; targetRight.rotation.z = phase * 0.5; }
    renderer.render(scene, camera); animationId = requestAnimationFrame(animate);
}

function toggleTraining() {
    if(loginOverlay.style.display !== 'none') return; // 如果登入畫面還在，禁止開始
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
    currentSaccadeX = 0; currentSaccadeY = 0; currentRoamX = 0; currentRoamY = 0; currentDist = 120; currentSize = 200; currentSpeed = 20; currentStereo = 0; currentThick = 9.0;
    sessionLogs = []; updateUIValues(); updatePositions(0);
}

startBtn.addEventListener('click', toggleTraining); resetBtn.addEventListener('click', executeReset);

fullscreenBtn.addEventListener('click', () => {
    const elem = document.getElementById('fv-fusion-app');
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) { elem.requestFullscreen(); } else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); } else if (elem.mozRequestFullScreen) { elem.mozRequestFullScreen(); } else if (elem.msRequestFullscreen) { elem.msRequestFullscreen(); } 
    } else {
        if (document.exitFullscreen) { document.exitFullscreen(); } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); } else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); } else if (document.msExitFullscreen) { document.msExitFullscreen(); }
    }
});

document.addEventListener('keydown', (e) => {
    if(loginOverlay.style.display !== 'none') return; // 登入畫面還在時，封鎖所有快捷鍵
    if (document.activeElement.tagName === 'INPUT' && document.activeElement.type !== 'range' && document.activeElement.type !== 'checkbox') return;
    const code = e.code;
    
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
        e.preventDefault();
        if (taskActive && isRunning && isTestModeActive) { const rt = ((performance.now() - taskSpawnTime) / 1000).toFixed(2); if (code === taskDirection) handleTaskResult('hit', rt); else handleTaskResult('wrong', rt); }
        return;
    }

    const shortcuts = ['Space', 'Enter', 'KeyE', 'KeyW', 'KeyS', 'KeyD', 'KeyA', 'KeyF', 'KeyR', 'KeyG', 'Digit0', 'Numpad0', 'BracketLeft', 'BracketRight', 'Comma', 'Period', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'];
    if (shortcuts.includes(code)) {
        e.preventDefault(); if (document.activeElement) document.activeElement.blur(); 
        switch(code) {
            case 'Space': toggleTraining(); break; case 'Enter': executeReset(); break; 
            case 'KeyE': controlPanel.style.display = controlPanel.style.display === 'none' ? 'flex' : 'none'; setTimeout(onWindowResize, 50); break;
            
            // 🚀 改寫原本的 [ G ] 鍵：不再下載，改為將資料 POST 上傳！
            case 'KeyG': uploadToSupabase(); break; 

            case 'Digit0': case 'Numpad0':
                if (!isTestModeAllowed) { alert("當前訓練 Program 限制進行測驗。"); break; }
                isTestModeActive = !isTestModeActive;
                if (!isTestModeActive) { taskActive = false; cueLeft.visible = false; cueRight.visible = false; if (isRunning) { statusText.innerText = "TRAINING"; statusText.style.color = '#e11d48'; } } 
                else { if (isRunning) { statusText.innerText = "TEST MODE ACTIVE"; statusText.style.color = '#deff9a'; } }
                break;
            case 'BracketRight': stereoSlider.value = Math.min(0.3, parseFloat(stereoSlider.value) + 0.01).toFixed(2); stereoSlider.dispatchEvent(new Event('input')); break;
            case 'BracketLeft': stereoSlider.value = Math.max(-0.3, parseFloat(stereoSlider.value) - 0.01).toFixed(2); stereoSlider.dispatchEvent(new Event('input')); break;
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
                if (activeProtocol === code && isRunning) { protocolStage = (protocolStage + 1) % 10; } else { activeProtocol = code; protocolStage = 0; }
                loadMatrixStage(activeProtocol, protocolStage); if (!isRunning) toggleTraining(); break;
        }
    }
});

updateGlassesUI(); updateUIValues();
function onWindowResize() {
    const width = container.clientWidth; const height = container.clientHeight;
    camera.left = -d * (width / height); camera.right = d * (width / height); camera.updateProjectionMatrix();
    renderer.setSize(width, height); if (!isRunning) renderer.render(scene, camera);
}
window.addEventListener('resize', onWindowResize); setTimeout(onWindowResize, 100);