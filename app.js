import { AIM_MATRIX, PROTOCOL_NAMES } from './matrix.js';
import { createTarget } from './shapes.js';

// === DOM 元素綁定 ===
const container = document.getElementById('webgl-container');
const controlPanel = document.querySelector('.control-panel'); 
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const statusText = document.getElementById('status-text');

// UI - 視覺與形體
const shapeSelect = document.getElementById('shape-select');
const customTextInput = document.getElementById('custom-text'); 
const textInputGroup = document.getElementById('text-input-group'); 
const sizeSlider = document.getElementById('size-slider');
const sizeLabel = document.getElementById('size-label');
const thickSlider = document.getElementById('thick-slider');
const thickLabel = document.getElementById('thick-label');
const fillCheckbox = document.getElementById('fill-checkbox');
const rotateCheckbox = document.getElementById('rotate-checkbox');

// UI - 空間動態
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

// UI - 數位光學
const glassesSelect = document.getElementById('glasses-select');
const balanceSlider = document.getElementById('balance-slider');
const balanceLabel = document.getElementById('balance-label');
const redSlider = document.getElementById('red-slider');
const greenSlider = document.getElementById('green-slider');
const blueSlider = document.getElementById('blue-slider');
const blueChannelBox = document.getElementById('blue-channel-box');
const ghostingLabelDisplay = redSlider.previousElementSibling.querySelector('.val-display');

// HUD 顯示
const timerDisplay = document.getElementById('timer-val');
const dynamicModeTag = document.getElementById('dynamic-mode-tag');

// 引擎與 AI 狀態變數
let isRunning = false;
let animationId;
let currentSize = 200, currentDist = 120, currentSpeed = 20, currentStereo = 0, currentThick = 9.0;
let isRotating = true, isFilled = false;
let activeProtocol = null, protocolStage = 0, protocolTime = 0, totalTimerSec = 0, lastTime = 0, phase = 0;
let currentSaccadeX = 0, currentSaccadeY = 0, saccadeTimer = 0, currentRoamX = 0, currentRoamY = 0, aiChaosTimer = 0;

// === Three.js 初始化 ===
const scene = new THREE.Scene();
scene.background = new THREE.Color('#000000');
const aspect = container.clientWidth / container.clientHeight;
const d = 500; 
const camera = new THREE.OrthographicCamera(-d * aspect, d * aspect, d, -d, 1, 1000);
camera.position.set(0, 0, 100);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio); // 自動適應 1080P 至 4K Retina
container.appendChild(renderer.domElement);

// 💡 核心升級：加入高階光影系統，點亮 3D 實體晶體
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4); // 基礎環境光
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9); // 主光源，製造立體陰影與反光
directionalLight.position.set(0, 0, 200);
scene.add(directionalLight);

let targetLeft, targetRight;

// === 1. 顏色與平衡 ===
function getColorsAndOpacity() {
    const r = Math.floor((parseInt(redSlider.value) / 100) * 255);
    const g = Math.floor((parseInt(greenSlider.value) / 100) * 255);
    const b = Math.floor((parseInt(blueSlider.value) / 100) * 255);
    const colorLeft = (r << 16); 
    const colorRight = glassesSelect.value === 'rc' ? ((b << 8) | b) : (g << 8);
    let balance = parseInt(balanceSlider.value);
    let opacityLeft = balance < 50 ? (balance / 50) : 1;
    let opacityRight = balance > 50 ? ((100 - balance) / 50) : 1;
    return { left: colorLeft, right: colorRight, opLeft: opacityLeft, opRight: opacityRight };
}

// === 2. 幾何重建 ===
function buildTargets() {
    if (targetLeft) scene.remove(targetLeft);
    if (targetRight) scene.remove(targetRight);

    textInputGroup.style.display = shapeSelect.value === 'text' ? 'block' : 'none';
    const visualConfig = getColorsAndOpacity();
    
    targetLeft = createTarget(shapeSelect.value, visualConfig.left, isFilled, customTextInput.value, currentThick);
    targetRight = createTarget(shapeSelect.value, visualConfig.right, isFilled, customTextInput.value, currentThick);
    
    targetLeft.children.forEach(mesh => { mesh.material.opacity = visualConfig.opLeft; mesh.material.transparent = true; });
    targetRight.children.forEach(mesh => { mesh.material.opacity = visualConfig.opRight; mesh.material.transparent = true; });

    updateScaleAndThickness();
    scene.add(targetLeft); scene.add(targetRight);
    
    if (!isRunning) renderer.render(scene, camera);
}

function updateScaleAndThickness(dynamicSize = currentSize) {
    const scaleFactor = dynamicSize / 200;
    if(targetLeft && targetRight) {
        targetLeft.scale.set(scaleFactor, scaleFactor, 1);
        targetRight.scale.set(scaleFactor, scaleFactor, 1);
    }
}

// === 3. 空間動態與真實立體視 ===
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

    const finalLeftX = pxLeftX + currentRoamX + currentSaccadeX;
    const finalLeftY = pxLeftY + currentRoamY + currentSaccadeY;
    const finalRightX = pxRightX + currentRoamX + currentSaccadeX;
    const finalRightY = pxRightY + currentRoamY + currentSaccadeY;

    if(targetLeft && targetRight) {
        targetLeft.children.forEach((mesh, i) => { mesh.position.x = -(i * 15) * currentStereo; });
        targetRight.children.forEach((mesh, i) => { mesh.position.x = (i * 15) * currentStereo; });
    }

    targetLeft.position.set(finalLeftX, finalLeftY, 0); targetRight.position.set(finalRightX, finalRightY, 0);
    sepVal.innerText = (Math.abs(targetLeft.position.x - targetRight.position.x)).toFixed(1) + 'px';
}

// === 4. UI 邏輯與滑桿綁定 ===
function updateGlassesUI() {
    if (glassesSelect.value === 'rc') {
        greenSlider.style.display = 'none'; blueChannelBox.style.display = 'block';
        ghostingLabelDisplay.innerHTML = `R (左): <span id="r-val">${redSlider.value}%</span> | B (右): <span id="b-val">${blueSlider.value}%</span>`;
    } else {
        greenSlider.style.display = 'block'; blueChannelBox.style.display = 'none';
        ghostingLabelDisplay.innerHTML = `R (左): <span id="r-val">${redSlider.value}%</span> | G (右): <span id="g-val">${greenSlider.value}%</span>`;
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
    sizeLabel.innerText = currentSize.toFixed(1) + 'px';
    distLabel.innerText = currentDist.toFixed(1) + 'px';
    speedLabel.innerText = currentSpeed.toFixed(1);
    thickLabel.innerText = currentThick.toFixed(1);
    stereoLabel.innerText = (currentStereo > 0 ? '+' : '') + currentStereo.toFixed(2);
    document.getElementById('hud-stereo-val').innerText = currentStereo.toFixed(2);
    let balance = parseInt(balanceSlider.value);
    balanceLabel.innerText = balance === 50 ? "均衡 50/50" : (balance < 50 ? `R弱 ${balance}%` : `L弱 ${100-balance}%`);
    sizeSlider.value = currentSize; distSlider.value = currentDist; speedSlider.value = currentSpeed;
    thickSlider.value = currentThick; stereoSlider.value = currentStereo;
}

sizeSlider.addEventListener('input', (e) => { currentSize = parseFloat(e.target.value); updateUIValues(); updateScaleAndThickness(); if (!isRunning) renderer.render(scene, camera); disableAI(); });
distSlider.addEventListener('input', (e) => { currentDist = parseFloat(e.target.value); updateUIValues(); if (!isRunning) updatePositions(0); disableAI(); });
speedSlider.addEventListener('input', (e) => { currentSpeed = parseFloat(e.target.value); updateUIValues(); disableAI(); });
thickSlider.addEventListener('input', (e) => { currentThick = parseFloat(e.target.value); updateUIValues(); buildTargets(); disableAI(); });
stereoSlider.addEventListener('input', (e) => { currentStereo = parseFloat(e.target.value); updateUIValues(); if (!isRunning) updatePositions(0); disableAI(); });
balanceSlider.addEventListener('input', () => { updateUIValues(); buildTargets(); disableAI(); });
rotateCheckbox.addEventListener('change', (e) => { isRotating = e.target.checked; disableAI(); });
shapeSelect.addEventListener('change', buildTargets);
customTextInput.addEventListener('input', buildTargets); 
fillCheckbox.addEventListener('change', (e) => { isFilled = e.target.checked; buildTargets(); });

function disableAI() {
    if (aiToggle.checked) {
        aiToggle.checked = false; dynamicModeTag.innerText = "AXP FUSION DYNAMICS (手動模式)";
        dynamicModeTag.style.color = '#f8fafc'; activeProtocol = null;
    }
}

function loadMatrixStage(protocol, stage) {
    const config = AIM_MATRIX[protocol][stage]; if (!config) return;
    shapeSelect.value = config.shape; axisSelect.value = config.axis; modeSelect.value = config.mode;
    fillCheckbox.checked = config.fill; isFilled = config.fill;
    currentSize = config.size; currentDist = config.dist * 0.3; 
    currentSpeed = config.speed; currentStereo = config.stereo; currentThick = config.thick;
    isRotating = !config.anim.includes('none'); rotateCheckbox.checked = isRotating;
    updateUIValues(); buildTargets();
    dynamicModeTag.innerText = `[ ${PROTOCOL_NAMES[protocol].split(' ')[0]} ] Stage ${stage + 1}/10 : ${config.name}`;
    dynamicModeTag.style.color = '#deff9a'; 
    protocolTime = 0; aiChaosTimer = 0;
    currentSaccadeX = 0; currentSaccadeY = 0; saccadeTimer = 0; currentRoamX = 0; currentRoamY = 0;
}

// === 5. 核心渲染微循環 ===
function animate(time) {
    if (!isRunning) return;
    if (!lastTime) lastTime = time;
    const dt = time - lastTime; lastTime = time;

    if (Math.floor(time / 1000) > Math.floor((time - dt) / 1000)) {
        totalTimerSec++; timerDisplay.innerText = Math.floor(totalTimerSec / 60).toString().padStart(2, '0') + ':' + (totalTimerSec % 60).toString().padStart(2, '0');
    }

    const speedFactor = 40000 / Math.max(1, currentSpeed); phase += dt / speedFactor; 

    if (aiToggle.checked && activeProtocol) {
        protocolTime += dt; const config = AIM_MATRIX[activeProtocol][protocolStage]; const anim = config.anim;
        const progress = protocolTime / 60000;
        let targetDist = config.dist;
        currentDist = targetDist * (0.3 + 0.7 * Math.sin(progress * (Math.PI / 2)));
        distSlider.value = currentDist; distLabel.innerText = currentDist.toFixed(1) + 'px';

        if (anim.includes('roam') || config.axis === 'roam') { currentRoamX = Math.sin(protocolTime / 3000) * 200; currentRoamY = Math.cos(protocolTime / 2100) * 120; }
        if (anim.includes('saccade') || config.axis === 'saccade') {
            saccadeTimer += dt; if (saccadeTimer > 1500) { saccadeTimer = 0; currentSaccadeX = (Math.random() > 0.5 ? 1 : -1) * (50 + Math.random() * 150); currentSaccadeY = (Math.random() > 0.5 ? 1 : -1) * (30 + Math.random() * 100); }}
        if (anim.includes('breathSize')) updateScaleAndThickness(currentSize + (currentSize * 0.15 * Math.sin(protocolTime / 1500)));
        if (anim.includes('pulseZ_in')) { currentStereo = config.stereo + (Math.sin(protocolTime / 1000) + 1) / 2 * 0.2; stereoSlider.value = currentStereo; stereoLabel.innerText = currentStereo.toFixed(2); }
        if (anim.includes('pulseZ_out')) { currentStereo = config.stereo - (Math.sin(protocolTime / 1000) + 1) / 2 * 0.2; stereoSlider.value = currentStereo; stereoLabel.innerText = currentStereo.toFixed(2); }
        if (anim.includes('flipStereo_hard')) { currentStereo = Math.sin(protocolTime / 1000) * 0.4; stereoSlider.value = currentStereo; stereoLabel.innerText = currentStereo.toFixed(2); }
        if (anim.includes('rivalry') || anim.includes('flicker')) {
            let isRedTurn = Math.floor(protocolTime / (anim.includes('flicker') ? 100 : 500)) % 2 === 0;
            targetLeft.children.forEach(c => c.material.opacity = isRedTurn ? 1 : 0.05); targetRight.children.forEach(c => c.material.opacity = isRedTurn ? 0.05 : 1);
        }
        if (anim === 'chaos') {
            aiChaosTimer += dt;
            if (aiChaosTimer > 2000) {
                aiChaosTimer = 0; currentSpeed = Math.max(10, Math.min(100, config.speed + (Math.random() * 60 - 30)));
                speedSlider.value = currentSpeed; speedLabel.innerText = currentSpeed.toFixed(1);
                currentThick = Math.max(2, Math.min(20, config.thick + (Math.random() * 10 - 5)));
                thickSlider.value = currentThick; thickLabel.innerText = currentThick.toFixed(1); buildTargets();
            }
            currentStereo = Math.sin(protocolTime / 500) * 0.5; stereoSlider.value = currentStereo; stereoLabel.innerText = currentStereo.toFixed(2);
            updateScaleAndThickness(currentSize + (currentSize * 0.3 * Math.sin(protocolTime / 200)));
        }
        if (protocolTime > 60000) { protocolStage = (protocolStage + 1) % 10; loadMatrixStage(activeProtocol, protocolStage); }
    }

    // 將晶體加入自體三維旋轉，立體感爆棚
    if(targetLeft && targetRight) {
        targetLeft.children.forEach((mesh, index) => {
            if (shapeSelect.value.includes('crystal') && isRotating) {
                mesh.rotation.x += (index % 2 === 0 ? 0.01 : -0.01);
                mesh.rotation.y += 0.015;
            }
        });
        targetRight.children.forEach((mesh, index) => {
            if (shapeSelect.value.includes('crystal') && isRotating) {
                mesh.rotation.x += (index % 2 === 0 ? 0.01 : -0.01);
                mesh.rotation.y += 0.015;
            }
        });
    }

    updatePositions(phase);
    if (isRotating) { targetLeft.rotation.z = phase * 0.5; targetRight.rotation.z = phase * 0.5; }
    renderer.render(scene, camera);
    animationId = requestAnimationFrame(animate);
}

// === 6. 重置與全螢幕 API 跨瀏覽器修復 ===
function toggleTraining() {
    isRunning = !isRunning;
    if (isRunning) {
        startBtn.innerText = "暫停 [ Space ]"; startBtn.classList.add('active');
        statusText.innerText = "TRAINING"; statusText.style.color = '#e11d48';
        lastTime = performance.now(); animate(lastTime);
    } else {
        startBtn.innerText = "繼續 [ Space ]"; startBtn.classList.remove('active');
        statusText.innerText = "PAUSED"; statusText.style.color = '#FCE473'; cancelAnimationFrame(animationId);
    }
}
function executeReset() {
    isRunning = false; cancelAnimationFrame(animationId);
    startBtn.innerText = "開始 [ Space ]"; startBtn.classList.remove('active');
    statusText.innerText = "IDLE"; statusText.style.color = '#f8fafc';
    totalTimerSec = 0; timerDisplay.innerText = "00:00"; disableAI();
    currentSaccadeX = 0; currentSaccadeY = 0; currentRoamX = 0; currentRoamY = 0;
    currentDist = 120; currentSize = 200; currentSpeed = 20; currentStereo = 0; currentThick = 9.0;
    if(targetLeft && targetRight) { 
        targetLeft.rotation.set(0,0,0); targetRight.rotation.set(0,0,0); 
        targetLeft.children.forEach(m => m.rotation.set(0,0,0)); targetRight.children.forEach(m => m.rotation.set(0,0,0));
    }
    balanceSlider.value = 50; redSlider.value = 100; greenSlider.value = 100; blueSlider.value = 100;
    updateUIValues(); updateGlassesUI(); updatePositions(0);
}
startBtn.addEventListener('click', toggleTraining);
resetBtn.addEventListener('click', executeReset);

// 💡 跨瀏覽器全螢幕修復
fullscreenBtn.addEventListener('click', () => {
    const elem = document.getElementById('fv-fusion-app');
    if (!document.fullscreenElement && !document.webkitFullscreenElement && !document.mozFullScreenElement && !document.msFullscreenElement) {
        if (elem.requestFullscreen) { elem.requestFullscreen(); }
        else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); } // Safari
        else if (elem.mozRequestFullScreen) { elem.mozRequestFullScreen(); } // Firefox
        else if (elem.msRequestFullscreen) { elem.msRequestFullscreen(); } // IE/Edge
    } else {
        if (document.exitFullscreen) { document.exitFullscreen(); }
        else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
        else if (document.mozCancelFullScreen) { document.mozCancelFullScreen(); }
        else if (document.msExitFullscreen) { document.msExitFullscreen(); }
    }
});

// 🕹️ 全域快捷鍵監聽 
document.addEventListener('keydown', (e) => {
    if (document.activeElement.tagName === 'INPUT' && document.activeElement.type !== 'range' && document.activeElement.type !== 'checkbox') return;
    const code = e.code;
    const shortcuts = ['Space', 'Enter', 'KeyE', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'KeyW', 'KeyS', 'KeyF', 'KeyR', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP'];
    
    if (shortcuts.includes(code)) {
        e.preventDefault(); if (document.activeElement) document.activeElement.blur(); 
        switch(code) {
            case 'Space': toggleTraining(); break;
            case 'Enter': executeReset(); break; 
            case 'KeyE': controlPanel.style.display = controlPanel.style.display === 'none' ? 'flex' : 'none'; setTimeout(onWindowResize, 50); break;
            case 'ArrowUp': stereoSlider.value = Math.min(0.5, parseFloat(stereoSlider.value) + 0.01).toFixed(2); stereoSlider.dispatchEvent(new Event('input')); break;
            case 'ArrowDown': stereoSlider.value = Math.max(-0.5, parseFloat(stereoSlider.value) - 0.01).toFixed(2); stereoSlider.dispatchEvent(new Event('input')); break;
            case 'ArrowLeft': speedSlider.value = Math.max(1, parseFloat(speedSlider.value) - (e.shiftKey ? 10 : 1)); speedSlider.dispatchEvent(new Event('input')); break;
            case 'ArrowRight': speedSlider.value = Math.min(100, parseFloat(speedSlider.value) + (e.shiftKey ? 10 : 1)); speedSlider.dispatchEvent(new Event('input')); break;
            case 'KeyW': sizeSlider.value = Math.min(600, parseFloat(sizeSlider.value) + 10); sizeSlider.dispatchEvent(new Event('input')); break;
            case 'KeyS': sizeSlider.value = Math.max(50, parseFloat(sizeSlider.value) - 10); sizeSlider.dispatchEvent(new Event('input')); break;
            case 'KeyF': fillCheckbox.checked = !fillCheckbox.checked; fillCheckbox.dispatchEvent(new Event('change')); break;
            case 'KeyR': rotateCheckbox.checked = !rotateCheckbox.checked; rotateCheckbox.dispatchEvent(new Event('change')); break;
            case 'KeyY': case 'KeyU': case 'KeyI': case 'KeyO': case 'KeyP':
                aiToggle.checked = true; if (activeProtocol === code && isRunning) { protocolStage = (protocolStage + 1) % 10; } else { activeProtocol = code; protocolStage = 0; }
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