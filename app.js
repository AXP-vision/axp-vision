// ============================================================================
// 👑 FANTASTIC VISION LAB: AXP Vision 雙眼同時視與融像協調引擎 (app.js - Dual-Engine Release)
// 🕒 最後優化日期與時間 (Last Optimized Timestamp)：2026-10-23 14:38 CST
// 🗄️ 對應雲端資料表：Supabase (public.axp_vision)
// 核心戰略與瑞士無塵光學實驗室升級重點：
// 1. [對接全新 Supabase 資料表 public.axp_vision] 正式指向 from('axp_vision') 寫入練習時長・執行模組・環境參數與逐次反應明細，與本機端 AXP_Vision.html 戰情室 100% 同步。
// 2. [鍵盤／觸控雙棲調度引擎] 完整綁定「實體鍵盤模式 ／ 觸控螢幕模式」切換器與觸控裝置自動偵測；綁定舞台右下角「虛擬十字方向舵 (#touch-dpad-hud)」與「3D 畫布全螢幕直覺滑動手勢 (Swipe Up/Down/Left/Right)」，保護雙眼中央融像不因低頭看按鍵而中斷。
// 3. [黃金 6 檔螢幕物理尺寸與觀距聯動] 精準配置 11" 平板 (24cm/40cm)・12.9" iPad Pro (28cm/45cm)・16" 筆電 (34.5cm/50cm)・27" 桌機 (59.8cm/60cm)・32" 螢幕 (70.8cm/65cm) 與 43"~55" 立式觸控大螢幕 (105cm/80cm)。
// 4. [凡特錫色盤純化與黑盒子保護] 全面換裝凡特錫藍 (#1E75BB / #2988D6 / #7CC2F5) 與皇家香檳金 (#B88E28 / #D4B459)；徹底移除外顯版本號・體驗艙字眼並封裝呼吸秒數黑盒子。
// 5. 100% 繁體中文（嚴格零簡體字）・100% 零彩色 Emoji・零頓號・零反引號・Non-SaMD 合規聲明。
// ============================================================================

import { AIM_MATRIX, PROTOCOL_NAMES } from './matrix.js';
import { createTarget } from './shapes.js';
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// === 後端雲端遙測資料庫配置 (正式對接全新表名 public.axp_vision) ===
const supabaseUrl = 'https://wvholwcyrldixlsgoege.supabase.co';
const supabaseKey = 'sb_publishable_BozJ84tPQF-jBHGKtXKqgw_ELodM54e';
const supabase = createClient(supabaseUrl, supabaseKey);

// === 1. 瑞士無塵光學實驗室登入畫面 (鑲嵌最新 Cinzel 4K 無限雙環主標誌・無外顯版本號) ===
let currentPatientCode = 'FV-8888';
const loginOverlay = document.createElement('div');
loginOverlay.setAttribute('data-optimized-at', '2026-10-23 14:38 CST');
loginOverlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:linear-gradient(135deg, #ebf3f9 0%, #f8fafc 50%, #e2e8f0 100%); z-index:9999; display:flex; flex-direction:column; justify-content:center; align-items:center; font-family:'Noto Sans TC', -apple-system, sans-serif; transition: opacity 0.35s ease; user-select:none; -webkit-user-select:none;";
loginOverlay.innerHTML = [
    '<div style="background:#ffffff; padding:38px 36px; border-radius:20px; text-align:center; box-shadow: 0 20px 50px rgba(26, 54, 93, 0.10); border: 1.5px solid #cbd5e1; border-top: 5px solid #1E75BB; max-width: 450px; width: 92%;">',
    '    <img src="https://images.squarespace-cdn.com/content/v1/69d767c498eb19770e89b41e/26cfc8f0-0358-4bda-855f-ac689b38a1b2/Fantastic-Vision-Lab-Header-Logo-en-only-cinzel-4K.png?format=1500w" alt="Fantastic Vision Lab Logo" style="height: 50px; width: auto; margin: 0 auto 14px auto; display: block; object-fit: contain; pointer-events: none;">',
    '    <div style="display:inline-block; background:#ebf3f9; color:#1E75BB; border:1px solid rgba(30, 117, 187, 0.35); font-family:\'Montserrat\', sans-serif; font-size:11px; font-weight:800; letter-spacing:1.4px; padding:4px 14px; border-radius:20px; margin-bottom:12px;">FANTASTIC VISION LAB｜BINOCULAR SYNERGY</div>',
    '    <h1 style="color:#1A365D; font-size:24px; font-weight:900; letter-spacing:0.8px; margin:0 0 8px 0;">AXP Vision <span style="color:#1E75BB;">雙眼視覺協調系統</span></h1>',
    '    <p style="color:#475569; margin:0 0 22px 0; font-size:13.8px; font-weight:500; line-height:1.7;">請配戴專業級紅藍眼鏡並保持雙肩放鬆<br>支援電腦實體鍵盤・觸控螢幕虛擬方向舵與畫面滑動操作</p>',
    '    <label style="display:block; margin-bottom:8px; font-size:13.5px; font-weight:800; color:#1A365D; text-align:center;">請輸入您的體驗代號或稱呼</label>',
    '    <input type="text" id="patient-code-input" placeholder="例：FV-8888 ／ 凡特錫貴賓" style="background-color:#f8fafc; padding:13px 16px; width:100%; text-align:center; border-radius:10px; border:1.5px solid #cbd5e1; margin-bottom:18px; font-size:15.5px; font-weight:700; color:#1A365D; outline:none; transition:0.2s; box-sizing:border-box;">',
    '    <button type="button" id="login-btn" style="background:linear-gradient(135deg, #1A365D 0%, #1E75BB 100%); color:#FFF9DE; border:1px solid #B88E28; padding:14px 28px; width:100%; border-radius:10px; font-size:15.5px; cursor:pointer; font-weight:800; transition:0.25s; box-shadow: 0 8px 20px rgba(30, 117, 187, 0.24); letter-spacing:0.5px;">進入雙眼視覺協調空間</button>',
    '</div>'
].join('');
document.body.appendChild(loginOverlay);

function performLogin() {
    const codeInput = document.getElementById('patient-code-input');
    const code = codeInput ? codeInput.value.trim() : '';
    currentPatientCode = code || 'GUEST-VIP';
    loginOverlay.style.display = 'none';
    onWindowResize();
    forceRenderFrame();
}

document.getElementById('login-btn')?.addEventListener('click', performLogin);
const inputField = document.getElementById('patient-code-input');
if (inputField) {
    inputField.addEventListener('focus', () => { inputField.style.borderColor = '#1E75BB'; inputField.style.backgroundColor = '#ffffff'; inputField.style.boxShadow = '0 0 0 3px rgba(30,117,187,0.16)'; });
    inputField.addEventListener('blur', () => { inputField.style.borderColor = '#cbd5e1'; inputField.style.backgroundColor = '#f8fafc'; inputField.style.boxShadow = 'none'; });
    inputField.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); performLogin(); } });
}

// === DOM 元素綁定 ===
const arenaEl = document.getElementById('arena');
const container = document.getElementById('webgl-container');
const controlPanel = document.getElementById('main-control-panel') || document.querySelector('.control-panel');
const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const reportBtn = document.getElementById('report-btn');
const fullscreenBtn = document.getElementById('fullscreen-btn');
const btnArenaFs = document.getElementById('btn-arena-fs');
const btnTogglePanel = document.getElementById('btn-toggle-panel');
const togglePanelText = document.getElementById('toggle-panel-text');
const statusText = document.getElementById('status-text');
const hudScoreVal = document.getElementById('hud-score-val');

// 雙模切換與觸控方向舵元素
const modeBtnKeyboard = document.getElementById('mode-btn-keyboard');
const modeBtnTouch = document.getElementById('mode-btn-touch');
const touchDpadHud = document.getElementById('touch-dpad-hud');
const dpadSpaceBtn = document.getElementById('dpad-space-btn');
const dpadCenterLabel = document.getElementById('dpad-center-label');
const dpadDirBtns = document.querySelectorAll('.dpad-btn[data-dir]');

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

// 視覺空間導引膠囊 (100% 零 Emoji)
const siloPrompt = document.createElement('div');
siloPrompt.id = 'silo-prompt';
siloPrompt.style.cssText = "position:absolute; bottom:66px; left:50%; transform:translateX(-50%); font-size:14px; font-weight:800; letter-spacing:1px; background:rgba(15, 23, 42, 0.90); backdrop-filter:blur(8px); padding:10px 22px; border-radius:10px; border:1.5px solid #B88E28; color:#f8fafc; z-index:100; display:none; text-align:center; pointer-events:none; box-shadow:0 8px 25px rgba(0,0,0,0.45); max-width:88%;";
arenaEl.appendChild(siloPrompt);

// 切換下一階段前「最後 5 秒倒數計時膠囊」
const stageCountdownBadge = document.createElement('div');
stageCountdownBadge.id = 'stage-countdown-badge';
stageCountdownBadge.style.cssText = "position:absolute; top:68px; right:20px; font-size:13.5px; font-weight:900; letter-spacing:1px; background:rgba(26, 54, 93, 0.92); backdrop-filter:blur(10px); padding:10px 18px; border-radius:12px; border:1.5px solid #B88E28; color:#FFF9DE; z-index:110; display:none; text-align:center; pointer-events:none; box-shadow:0 10px 30px rgba(0,0,0,0.5); font-family:'Noto Sans TC', monospace;";
arenaEl.appendChild(stageCountdownBadge);

// === 核心狀態變數 ===
let isRunning = false, animationId;
let currentInputMode = 'keyboard';
let currentSize = 340, currentSpeed = 14, currentStereo = 0.02, currentThick = 8.5;
let currentVertPrism = 0;
let currentStageDurationMs = 60000;
let currentDistractors = 0;
let isRotating = true, isFilled = true;
let activeProtocol = null, protocolStage = 0, protocolTime = 0, totalTimerSec = 0, lastTime = 0, phase = 0;
let currentSaccadeX = 0, currentSaccadeY = 0, saccadeTimer = 0, currentRoamX = 0, currentRoamY = 0;

let dichopticSwapState = false;

let currentAxis = 'horizontal';
let currentMode = 'crossover';

let sessionLogs = [];
let sessionScore = 0;
let isTestModeActive = true;
let taskActive = false;
let taskDirection = '', taskEye = 'both', taskSpawnTime = 0, timeSinceLastTask = 0, nextTaskInterval = 2800, statusTimeout = null;
let taskInitialPrism = "";

let consecutiveHits = 0;
let consecutiveMisses = 0;
let isAIRescueActive = false;
let aiRescueStartTime = 0;
let originalSizeBeforeRescue = 340;
let originalPrismBeforeRescue = 0;

let flipperTimer = 0;
let flipperState = true;

const AXP_WORDS = ['H O T V', 'Z R K D', 'E M C W', 'S N E L', 'O S V D', 'N H Z O', 'A X 7 P', '9 Q 2 M'];
let currentWordIndex = 0;
let lastWordChangeTime = 0;

if (redSlider) redSlider.value = 90;
if (blueSlider) blueSlider.value = 100;
if (greenSlider) greenSlider.value = 90;

// ============================================================================
// ✨ 實體鍵盤 vs. 觸控螢幕 雙模切換與自動偵測中樞
// ============================================================================
function updateTestModeButtonLabel() {
    if (!btnTestMode) return;
    const hintStr = currentInputMode === 'touch' ? '(觸控或滑動)' : '(按方向鍵)';
    btnTestMode.innerHTML = isTestModeActive ? ('<strong>0</strong> 互動測驗: 開 ' + hintStr) : '<strong>0</strong> 互動測驗: 關';
    btnTestMode.classList.toggle('test-on', isTestModeActive);
}

function setInputMode(mode) {
    currentInputMode = (mode === 'touch') ? 'touch' : 'keyboard';
    document.body.classList.toggle('touch-mode-active', currentInputMode === 'touch');
    if (touchDpadHud) {
        touchDpadHud.classList.toggle('is-visible', currentInputMode === 'touch');
    }
    if (modeBtnKeyboard) modeBtnKeyboard.classList.toggle('active', currentInputMode === 'keyboard');
    if (modeBtnTouch) modeBtnTouch.classList.toggle('active', currentInputMode === 'touch');
    updateTestModeButtonLabel();
}

if (modeBtnKeyboard) modeBtnKeyboard.addEventListener('click', () => setInputMode('keyboard'));
if (modeBtnTouch) modeBtnTouch.addEventListener('click', () => setInputMode('touch'));

(function autoDetectTouchDevice() {
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    const screenW = Math.max(window.screen.width || 0, window.innerWidth || 0);
    if (isTouchDevice) {
        setInputMode('touch');
        if (screenSpecSelect) {
            if (screenW <= 1150) {
                screenSpecSelect.value = 'tablet11';
                if (viewDistInput) viewDistInput.value = 40;
            } else if (screenW <= 1400) {
                screenSpecSelect.value = 'tablet13';
                if (viewDistInput) viewDistInput.value = 45;
            }
        }
    } else {
        setInputMode('keyboard');
    }
})();

// ==========================================
// 核心圖學：Layer Masking 雙通道渲染引擎 (純紅純藍 100% 恆定高對比)
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

const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
ambientLight.layers.enable(1); ambientLight.layers.enable(2);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.85);
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
        "intensityRight": { value: 0.90 }
    },
    vertexShader: " varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); } ",
    fragmentShader: [
        "uniform sampler2D mapLeft;",
        "uniform sampler2D mapRight;",
        "uniform vec3 colorLeft;",
        "uniform vec3 colorRight;",
        "uniform float intensityLeft;",
        "uniform float intensityRight;",
        "varying vec2 vUv;",
        "void main() {",
        "    vec4 texelLeft = texture2D(mapLeft, vUv);",
        "    vec4 texelRight = texture2D(mapRight, vUv);",
        "    vec3 finalColor = (texelLeft.rgb * colorLeft * intensityLeft) + (texelRight.rgb * colorRight * intensityRight);",
        "    gl_FragColor = vec4(finalColor, 1.0);",
        "}"
    ].join("\n")
};

const postMaterial = new THREE.ShaderMaterial(anaglyphShader);
const postScene = new THREE.Scene();
const postCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const postQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), postMaterial);
postScene.add(postQuad);

// 第 7 階專屬：360 度全向同心水波漣漪群組
const antagonistRippleGroup = new THREE.Group();
const rippleRings = [];
for (let r = 0; r < 4; r++) {
    const rMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.0, depthWrite: false });
    const rMesh = new THREE.Mesh(new THREE.RingGeometry(95, 101, 64), rMat);
    rMesh.position.z = -40;
    rMesh.layers.set(r % 2 === 0 ? 1 : 2);
    antagonistRippleGroup.add(rMesh);
    rippleRings.push({ mesh: rMesh, mat: rMat, offset: r * 0.25 });
}
antagonistRippleGroup.visible = false;
scene.add(antagonistRippleGroup);

// 紅藍分層深空星點
const starCanvas = document.createElement('canvas');
starCanvas.width = 32; starCanvas.height = 32;
const starCtx = starCanvas.getContext('2d');
starCtx.beginPath(); starCtx.arc(16, 16, 12, 0, Math.PI * 2); starCtx.fillStyle = 'white'; starCtx.fill();
const starTexture = new THREE.CanvasTexture(starCanvas);

const starsCount = 45;
const posArrayL = new Float32Array(starsCount * 3);
const posArrayR = new Float32Array(starsCount * 3);
for (let i = 0; i < starsCount; i++) {
    posArrayL[i*3] = (Math.random() - 0.5) * 1500;
    posArrayL[i*3+1] = (Math.random() - 0.5) * 1200;
    posArrayL[i*3+2] = -300 - Math.random() * 500;

    posArrayR[i*3] = (Math.random() - 0.5) * 1500;
    posArrayR[i*3+1] = (Math.random() - 0.5) * 1200;
    posArrayR[i*3+2] = -300 - Math.random() * 500;
}
const starsGeoL = new THREE.BufferGeometry();
starsGeoL.setAttribute('position', new THREE.BufferAttribute(posArrayL, 3));
const starsGeoR = new THREE.BufferGeometry();
starsGeoR.setAttribute('position', new THREE.BufferAttribute(posArrayR, 3));

const starMat = new THREE.PointsMaterial({ size: 4.5, map: starTexture, transparent: true, opacity: 0.35, color: 0xffffff, depthWrite: false });
const starsLeft = new THREE.Points(starsGeoL, starMat);
const starsRight = new THREE.Points(starsGeoR, starMat);
starsLeft.layers.set(1);
starsRight.layers.set(2);
scene.add(starsLeft, starsRight);

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

// ============================================================================
// 📐 黃金 6 檔螢幕物理尺寸與觀看距離校準矩陣
// ============================================================================
const SCREEN_SPEC_CONFIG = {
    'tablet11':  { widthCm: 24.0, defaultDistCm: 40 },
    'tablet13':  { widthCm: 28.0, defaultDistCm: 45 },
    'mbp16':     { widthCm: 34.5, defaultDistCm: 50 },
    'desktop27': { widthCm: 59.8, defaultDistCm: 60 },
    'desktop32': { widthCm: 70.8, defaultDistCm: 65 },
    'touch55':   { widthCm: 105.0, defaultDistCm: 80 }
};

function getPhysicalScreenWidthCm() {
    const spec = screenSpecSelect ? screenSpecSelect.value : 'mbp16';
    return (SCREEN_SPEC_CONFIG[spec] && SCREEN_SPEC_CONFIG[spec].widthCm) ? SCREEN_SPEC_CONFIG[spec].widthCm : 34.5;
}

function getPhysicalPixelToCm() {
    const physicalWidthCm = getPhysicalScreenWidthCm();
    const logicalScreenPx = Math.max(768, window.screen.width || window.innerWidth);
    return physicalWidthCm / logicalScreenPx;
}

function getScreenSizeCompensationFactor() {
    const physicalWidthCm = getPhysicalScreenWidthCm();
    const baseMbp16Cm = 34.5;
    const rawRatio = baseMbp16Cm / physicalWidthCm;
    return Math.max(0.52, Math.min(1.22, rawRatio));
}

function updateOpticsFromUI() {
    const rVal = redSlider ? parseInt(redSlider.value) : 90;
    const gVal = greenSlider ? parseInt(greenSlider.value) : 90;
    const bVal = blueSlider ? parseInt(blueSlider.value) : 100;
    
    let balance = balanceSlider ? parseInt(balanceSlider.value) : 50;
    let opacityLeft = balance < 50 ? (balance / 50) : 1;
    let opacityRight = balance > 50 ? ((100 - balance) / 50) : 1;
    
    postMaterial.uniforms.intensityRight.value = (rVal / 100.0) * opacityRight;
    if (document.getElementById('r-val')) document.getElementById('r-val').innerText = rVal + '%';
    
    let primaryLeftColor = new THREE.Color();
    let primaryRightColor = new THREE.Color(1.0, 0.0, 0.0);

    if (glassesSelect && glassesSelect.value === 'rg') {
        if (document.getElementById('l-val')) document.getElementById('l-val').innerText = gVal + '%';
        primaryLeftColor.setRGB(0.0, 1.0, 0.0);
        postMaterial.uniforms.intensityLeft.value = (gVal / 100.0) * opacityLeft;
    } else {
        if (document.getElementById('l-val')) document.getElementById('l-val').innerText = bVal + '%';
        primaryLeftColor.setRGB(0.0, 0.0, 1.0);
        postMaterial.uniforms.intensityLeft.value = (bVal / 100.0) * opacityLeft;
    }

    postMaterial.uniforms.colorLeft.value.copy(primaryLeftColor);
    postMaterial.uniforms.colorRight.value.copy(primaryRightColor);

    if (prismSlider) {
        const prismVal = parseFloat(prismSlider.value);
        const pText = prismVal > 0 ? (prismVal.toFixed(1) + ' Δ (BO)') : prismVal < 0 ? (Math.abs(prismVal).toFixed(1) + ' Δ (BI)') : '0.0 Δ (平光)';
        if (prismLabel) prismLabel.innerText = pText;
        if (prismValHud && !isRunning) prismValHud.innerText = pText;
    }
    
    if (!isRunning) {
        updatePositions(phase, '');
    }
}

function clearTargets() {
    if (targetLeft) { targetLeft.traverse(child => { if (child.isMesh) { child.geometry?.dispose(); child.material?.dispose(); } }); scene.remove(targetLeft); }
    if (targetRight) { targetRight.traverse(child => { if (child.isMesh) { child.geometry?.dispose(); child.material?.dispose(); } }); scene.remove(targetRight); }
    
    while (distractorGroupLeft.children.length > 0) {
        const c = distractorGroupLeft.children[0]; c.geometry?.dispose(); c.material?.dispose(); distractorGroupLeft.remove(c);
    }
    while (distractorGroupRight.children.length > 0) {
        const c = distractorGroupRight.children[0]; c.geometry?.dispose(); c.material?.dispose(); distractorGroupRight.remove(c);
    }
    distractorData = [];
}

function buildTargets() {
    clearTargets();
    if (textInputGroup) textInputGroup.style.display = shapeSelect?.value === 'text' ? 'block' : 'none';
    const shapeVal = shapeSelect ? shapeSelect.value : 'dichoptic_lock';
    const txtVal = customTextInput ? customTextInput.value : 'H O T V';
    
    const leftRole = dichopticSwapState ? 'right' : 'left';
    const rightRole = dichopticSwapState ? 'left' : 'right';

    targetLeft = createTarget(shapeVal, 0xffffff, isFilled, txtVal, currentThick, leftRole);
    targetRight = createTarget(shapeVal, 0xffffff, isFilled, txtVal, currentThick, rightRole);
    targetLeft.traverse(c => { c.layers.set(1); if (c.isMesh) { c.material.blending = THREE.NormalBlending; c.material.color.setHex(0xffffff); } });
    targetRight.traverse(c => { c.layers.set(2); if (c.isMesh) { c.material.blending = THREE.NormalBlending; c.material.color.setHex(0xffffff); } });

    if (currentDistractors > 0) {
        const distMatLeft = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const distMatRight = new THREE.MeshBasicMaterial({ color: 0xffffff });
        
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
                speedMultiplier: 0.45 + (i % 3) * 0.22,
                orbitRadiusX: 250 + (i * 32),
                orbitRadiusY: 185 + (i * 26),
                zOffset: (i % 2 === 0 ? 1 : -1) * 60,
                baseSize: 40
            });
        }
    }

    updateScaleAndThickness();
    scene.add(targetLeft, targetRight);
    updateOpticsFromUI();
}

function updateScaleAndThickness(dynamicSize = currentSize) {
    const screenComp = getScreenSizeCompensationFactor();
    const scaleFactor = (dynamicSize / 200) * screenComp;
    
    if (targetLeft && targetRight) {
        targetLeft.scale.set(scaleFactor, scaleFactor, scaleFactor);
        targetRight.scale.set(scaleFactor, scaleFactor, scaleFactor);
    }

    for (let i = 0; i < currentDistractors; i++) {
        if (distractorGroupLeft.children[i]) {
            const dSize = distractorData[i].baseSize * scaleFactor * 0.68;
            distractorGroupLeft.children[i].scale.set(dSize, dSize, dSize);
            distractorGroupRight.children[i].scale.set(dSize, dSize, dSize);
        }
    }

    const cueScale = Math.max(14, dynamicSize * 0.05 * screenComp);
    cueGroupLeft.scale.set(cueScale, cueScale, 1);
    cueGroupRight.scale.set(cueScale, cueScale, 1);
    forceRenderFrame();
}

function updatePositions(phaseVal, currentAnim = '') {
    const maxPrismLoad = parseFloat(prismSlider ? prismSlider.value : 0);
    let targetPrismDemand = maxPrismLoad;

    if (isRunning) {
        if (currentAnim.includes('antagonist_relax') || currentAnim.includes('center_lock_peripheral') || currentAnim.includes('vert_')) {
            targetPrismDemand = maxPrismLoad * (0.85 + 0.15 * Math.sin(phaseVal));
        } else if (currentAnim.includes('flipper')) {
            targetPrismDemand = flipperState ? maxPrismLoad : -Math.min(5.5, Math.abs(maxPrismLoad) * 0.35);
        } else {
            const wave = (Math.sin(phaseVal - Math.PI/2) + 1) / 2;
            if (currentMode === 'oneway_bo') {
                targetPrismDemand = wave * Math.max(0, maxPrismLoad);
            } else if (currentMode === 'oneway_bi') {
                targetPrismDemand = wave * Math.max(-7.0, Math.min(0, maxPrismLoad));
            } else {
                const s = Math.sin(phaseVal);
                if (s >= 0) {
                    targetPrismDemand = s * Math.max(0, maxPrismLoad);
                } else {
                    const safeMaxBI = Math.min(6.0, Math.max(2.0, Math.abs(maxPrismLoad) * 0.25));
                    targetPrismDemand = s * safeMaxBI;
                }
            }
        }
    }

    const pixelToCm = getPhysicalPixelToCm();
    const viewDistM = (parseFloat(viewDistInput ? viewDistInput.value : 50) || 50) / 100;

    const requiredSeparationCm = targetPrismDemand * viewDistM;
    const totalSeparationPx = requiredSeparationCm / pixelToCm;
    let baseDispX = totalSeparationPx / 2;

    let pxLeftX = 0, pxRightX = 0, pxLeftY = 0, pxRightY = 0;

    if (currentAnim.includes('center_lock_peripheral') || currentAnim.includes('antagonist_relax')) {
        pxLeftX = baseDispX;
        pxRightX = -baseDispX;
        pxLeftY = 0;
        pxRightY = 0;
    }
    else if (currentAxis === 'lissajous') {
        pxLeftX = baseDispX + Math.sin(phaseVal) * 230;
        pxRightX = -baseDispX + Math.sin(phaseVal) * 230;
        pxLeftY = Math.sin(phaseVal * 2) * 150;
        pxRightY = pxLeftY;
    }
    else if (currentAxis === 'vertical') {
        pxLeftX = baseDispX; pxRightX = -baseDispX;
        pxLeftY = Math.sin(phaseVal) * 170; pxRightY = pxLeftY;
    }
    else if (currentAxis === 'circular') {
        const orbitX = Math.cos(phaseVal) * 185;
        const orbitY = Math.sin(phaseVal) * 185;
        pxLeftX = baseDispX + orbitX; pxRightX = -baseDispX + orbitX; pxLeftY = orbitY; pxRightY = orbitY;
    }
    else {
        pxLeftX = baseDispX; pxRightX = -baseDispX;
    }

    let finalLeftX = pxLeftX + currentRoamX + currentSaccadeX; let finalLeftY = pxLeftY + currentRoamY + currentSaccadeY;
    let finalRightX = pxRightX + currentRoamX + currentSaccadeX; let finalRightY = pxRightY + currentRoamY + currentSaccadeY;

    const targetVertPrism = currentVertPrism > 0 ? currentVertPrism : (currentAnim.includes('vert_') ? 0.6 : 0);
    if (targetVertPrism > 0 && isRunning) {
        const totalVertPx = (targetVertPrism * viewDistM) / pixelToCm;
        const halfVertPx = totalVertPx / 2;
        let vertFactor = 0;

        if (currentAnim.includes('vert_step_alt')) {
            const cycleSec = (protocolTime / 1000) % 14.0;
            if (cycleSec < 4.0) { vertFactor = 1.0; }
            else if (cycleSec < 7.0) { vertFactor = 0.0; }
            else if (cycleSec < 11.0) { vertFactor = -1.0; }
            else { vertFactor = 0.0; }
        } else {
            vertFactor = Math.sin((protocolTime / 14000) * Math.PI * 2);
        }

        finalLeftY += halfVertPx * vertFactor;
        finalRightY -= halfVertPx * vertFactor;
    }

    // 公開標準版安全邊界：BO 上限鎖定於 20.5Δ，BI 開散上限鎖定於 7.0Δ
    const maxBOPx = (20.5 * viewDistM) / pixelToCm;
    const maxBIPx = (7.0 * viewDistM) / pixelToCm;

    let dx = finalLeftX - finalRightX;
    if (dx > maxBOPx) { let scale = maxBOPx / dx; finalLeftX *= scale; finalRightX *= scale; }
    else if (dx < -maxBIPx) { let scale = -maxBIPx / dx; finalLeftX *= scale; finalRightX *= scale; }

    if (targetLeft && targetRight) {
        const layerCount = targetLeft.children.length;
        if (layerCount > 1) {
            targetLeft.children.forEach((layer, i) => { layer.position.x = -(i * 14) * currentStereo; });
            targetRight.children.forEach((layer, i) => { layer.position.x = (i * 14) * currentStereo; });
        } else if (layerCount === 1) {
            targetLeft.children[0].position.x = 0;
            targetRight.children[0].position.x = 0;
        }
        targetLeft.position.set(finalLeftX, finalLeftY, 0); targetRight.position.set(finalRightX, finalRightY, 0);
        
        const currentSepX = targetLeft.position.x - targetRight.position.x;
        const currentSepY = targetLeft.position.y - targetRight.position.y;
        
        const horizontalPrism = (Math.abs(currentSepX) * pixelToCm) / viewDistM;
        let hPrismDir = currentSepX >= 0 ? "BO" : "BI";
        const verticalPrism = (Math.abs(currentSepY) * pixelToCm) / viewDistM;
        
        if (prismValHud) {
            let hudText = horizontalPrism.toFixed(1) + ' Δ (' + hPrismDir + ')';
            if (verticalPrism >= 0.15) {
                const vDirStr = currentSepY > 0 ? "L↑ R↓" : "R↑ L↓";
                hudText += ' | ' + verticalPrism.toFixed(1) + ' Δ (' + vDirStr + ')';
            }
            prismValHud.innerText = hudText;
        }
    }

    for (let i = 0; i < currentDistractors; i++) {
        const dData = distractorData[i];
        const dPhase = (phase * dData.speedMultiplier * 1.4) + dData.phaseOffset;
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
        const screenComp = getScreenSizeCompensationFactor();
        const isPeripheralLock = currentAnim.includes('center_lock_peripheral');
        const offsetDist = isPeripheralLock ? (275 * screenComp) : Math.min(currentSize * 0.58 * screenComp, 195);
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

function submitDirectionAnswer(dirCode) {
    if (!taskActive || !isRunning || !isTestModeActive) return;
    const rt = ((performance.now() - taskSpawnTime) / 1000).toFixed(2);
    if (dirCode === taskDirection) {
        handleTaskResult('hit', rt);
    } else {
        handleTaskResult('wrong', rt);
    }
}

function handleTaskResult(result, rt = 0) {
    taskActive = false; cueGroupLeft.visible = false; cueGroupRight.visible = false; timeSinceLastTask = 0; nextTaskInterval = 2400 + Math.random() * 2200;
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
            logMsg = '● 雙眼同時視合像穩定 (' + rt + 's) | COMBO x' + consecutiveHits;
            statusLabel = "雙眼融像穩定(FUSION)";
            if (!isAIRescueActive && statusText) statusText.style.color = consecutiveHits >= 3 ? '#D4B459' : '#34d399';
        } else {
            let failType = ""; let reason = result === 'wrong' ? "方向誤差" : "反應逾時";
            if (Math.abs(dy) > 4) { failType = "垂直融像微偏"; statusLabel = "垂直微偏(VERT_FAIL)"; }
            else {
                if (dx < 0) { failType = "內聚緩衝臨界"; statusLabel = "內聚逾界(BO_FAIL)"; }
                else { failType = "開散緩衝臨界"; statusLabel = "開散逾界(BI_FAIL)"; }
            }
            logMsg = '▲ ' + failType + ' (' + reason + ')';
            consecutiveMisses++; consecutiveHits = 0;
            
            if (aiToggle && aiToggle.checked && consecutiveMisses >= 2 && !isAIRescueActive) {
                consecutiveMisses = 0;
                activateAIRescue(logMsg);
            } else {
                if (!isAIRescueActive && statusText) statusText.style.color = '#fb7185';
            }
        }
    } else {
        const eyeName = taskEye === 'left' ? '左眼通道' : '右眼通道';
        if (result === 'hit') {
            consecutiveHits++;
            logMsg = '● ' + eyeName + '同時視暢通 (' + rt + 's)';
            statusLabel = eyeName + '同時視(ANTI_SUPP_' + taskEye.toUpperCase() + ')';
            if (!isAIRescueActive && statusText) statusText.style.color = '#34d399';
        } else {
            let reason = result === 'wrong' ? "方向誤差" : "未察覺閃爍";
            logMsg = '■ ' + eyeName + '分視訊號短暫休眠 (' + reason + ')';
            statusLabel = eyeName + '休眠(SUPP_' + taskEye.toUpperCase() + ')';
            if (!isAIRescueActive && statusText) statusText.style.color = '#facc15';
        }
    }
    
    if (!isAIRescueActive && statusText) statusText.innerText = logMsg;
    
    sessionLogs.push({ time: totalTimerSec.toString(), initial_sep: "0", initial_prism: taskInitialPrism, response_sep: "0", response_prism: currentPrismStr, reaction_time: rt, stereo: currentStereo.toFixed(2), size: currentSize.toFixed(1), status: statusLabel, eye: taskEye, distractors: currentDistractors });

    if (!isAIRescueActive) {
        if (statusTimeout) clearTimeout(statusTimeout);
        statusTimeout = setTimeout(() => { if (isRunning && statusText) { statusText.innerText = isTestModeActive ? "INTERACTIVE TEST ON" : "PRACTICE ACTIVE"; statusText.style.color = isTestModeActive ? "#D4B459" : '#7CC2F5'; } }, 2200);
    }
}

let protocolTimeBeforeRescue = 0;

function activateAIRescue(reasonMsg) {
    if (loginOverlay.style.display !== 'none' || !isRunning || isAIRescueActive) return;
    isAIRescueActive = true; aiRescueStartTime = performance.now();
    originalSizeBeforeRescue = currentSize; originalPrismBeforeRescue = parseFloat(prismSlider ? prismSlider.value : 0);
    protocolTimeBeforeRescue = protocolTime;
    if (prismSlider) { prismSlider.value = (originalPrismBeforeRescue * 0.45).toFixed(1); updateOpticsFromUI(); }
    updateScaleAndThickness(Math.min(550, currentSize * 1.3)); updateUIValues();
    if (statusText) { statusText.innerText = '[ 視覺減壓緩衝中 ] ' + reasonMsg; statusText.style.color = '#facc15'; }
    if (dynamicModeTag) { dynamicModeTag.innerText = '[ 視覺減壓緩衝 10s ] 正在溫和釋放雙眼融像負荷...'; dynamicModeTag.style.color = '#facc15'; }
}

function endAIRescue() {
    if (!isAIRescueActive) return;
    isAIRescueActive = false; protocolTime = protocolTimeBeforeRescue; currentSize = originalSizeBeforeRescue;
    if (prismSlider) { prismSlider.value = originalPrismBeforeRescue.toFixed(1); updateOpticsFromUI(); }
    updateScaleAndThickness(); updateUIValues();
    if (statusText) { statusText.innerText = isTestModeActive ? "INTERACTIVE TEST ON" : "PRACTICE ACTIVE"; statusText.style.color = isTestModeActive ? "#D4B459" : '#7CC2F5'; }
    if (activeProtocol && dynamicModeTag) {
        const config = AIM_MATRIX[activeProtocol][protocolStage];
        const stageMaxStr = AIM_MATRIX[activeProtocol] ? AIM_MATRIX[activeProtocol].length : 10;
        const durSec = config.duration || 60;
        dynamicModeTag.innerText = '[ ' + PROTOCOL_NAMES[activeProtocol].split(' ')[0] + ' ] Stage ' + (protocolStage + 1) + '/' + stageMaxStr + ' (' + durSec + 's) : ' + config.name;
        dynamicModeTag.style.color = '#D4B459';
    }
}

function showClinicalReport(logs, totalTime, protocolName) {
    let fusionCount = 0, suppCount = 0, antiSuppCount = 0, boFail = 0, biFail = 0, vertFail = 0;
    let tableRowsHTML = "";
    logs.forEach(log => {
        if (log.status.includes('FUSION')) fusionCount++;
        if (log.status.includes('SUPP_') && !log.status.includes('ANTI')) suppCount++;
        if (log.status.includes('ANTI_SUPP')) antiSuppCount++;
        if (log.status.includes('BO_FAIL')) boFail++;
        if (log.status.includes('BI_FAIL')) biFail++;
        if (log.status.includes('VERT_FAIL')) vertFail++;
        let statusColor = log.status.includes('FUSION') || log.status.includes('ANTI') ? '#1E75BB' : (log.status.includes('SUPP') ? '#B88E28' : '#BE123C');
        tableRowsHTML += '<tr style="border-bottom: 1px solid #e2e8f0; font-size:13px; text-align:center;"><td style="padding: 8px;">' + log.time + 's</td><td style="padding: 8px; font-weight:bold; color:' + statusColor + ';">' + log.status.split('(')[0] + '</td><td style="padding: 8px; font-size:12px; color:#64748b;">' + log.initial_prism + '</td><td style="padding: 8px; font-weight:bold; color:#0f172a;">' + log.response_prism + '</td><td style="padding: 8px; font-family:monospace;">' + log.reaction_time + 's</td></tr>';
    });

    const reportOverlay = document.createElement('div');
    reportOverlay.style.cssText = "position:fixed; top:0; left:0; width:100vw; height:100vh; background:rgba(15, 23, 42, 0.84); backdrop-filter:blur(6px); z-index:10000; display:flex; justify-content:center; align-items:center; font-family:'Noto Sans TC', sans-serif; user-select:none; -webkit-user-select:none;";
    reportOverlay.innerHTML = [
        '<div style="background:#ffffff; width: 680px; max-width:94vw; max-height: 88vh; border-radius:16px; box-shadow: 0 25px 50px rgba(0,0,0,0.45); display:flex; flex-direction:column; overflow:hidden; border-top: 5px solid #1E75BB;">',
        '    <div style="background:linear-gradient(135deg, #1A365D 0%, #1E75BB 100%); color:white; padding: 20px; text-align:center; border-bottom: 2px solid #B88E28;">',
        '        <h2 style="margin:0; font-size:21px; font-weight:900; letter-spacing:1px; color:#FFF9DE;">AXP Vision 雙眼同時視與融像協調練習摘要</h2>',
        '        <p style="margin:6px 0 0 0; color:#E2E8F0; font-size:13.5px; font-weight:700;">體驗代號: ' + currentPatientCode + ' ｜ 練習積分: ' + sessionScore + '</p>',
        '    </div>',
        '    <div style="padding: 20px 24px; overflow-y:auto; flex-grow:1; color:#334155;">',
        '        <div style="display:flex; justify-content:space-between; margin-bottom: 18px; background:#f8fafc; padding:14px 18px; border-radius:10px; border:1px solid #cbd5e1;">',
        '            <div><p style="margin:0 0 4px 0; font-size:12px; color:#64748b; font-weight:bold;">本次練習時長</p><p style="margin:0; font-size:18px; font-weight:900; color:#1A365D;">' + Math.floor(totalTime / 60) + ' 分 ' + (totalTime % 60) + ' 秒</p></div>',
        '            <div style="text-align:right;"><p style="margin:0 0 4px 0; font-size:12px; color:#64748b; font-weight:bold;">執行視覺模組</p><p style="margin:0; font-size:14px; font-weight:800; color:#1E75BB;">' + protocolName.split('(')[0] + '</p></div>',
        '        </div>',
        '        <h3 style="font-size:14.5px; margin-bottom:10px; color:#1A365D; border-bottom:1.5px solid #e2e8f0; padding-bottom:6px; font-weight:900;">■ 雙眼同時視與融像表現統計</h3>',
        '        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:10px; margin-bottom:20px;">',
        '            <div style="background:#ebf3f9; padding:10px 14px; border-radius:8px; border:1px solid rgba(30,117,187,0.35);"><span style="font-size:12px; color:#1E75BB; font-weight:800;">● 雙眼同時視合像穩定</span><br><span style="font-size:20px; font-weight:900; color:#1A365D;">' + fusionCount + '</span></div>',
        '            <div style="background:#f0f9ff; padding:10px 14px; border-radius:8px; border:1px solid #bae6fd;"><span style="font-size:12px; color:#1E75BB; font-weight:800;">● 單側分視平衡回應 (Anti-Suppression)</span><br><span style="font-size:20px; font-weight:900; color:#1A365D;">' + antiSuppCount + '</span></div>',
        '            <div style="background:#fef2f2; padding:10px 14px; border-radius:8px; border:1px solid #fecaca;"><span style="font-size:12px; color:#BE123C; font-weight:800;">▲ 正融像內聚逾界 (BO)</span><br><span style="font-size:20px; font-weight:900; color:#9f1239;">' + boFail + '</span></div>',
        '            <div style="background:#fef2f2; padding:10px 14px; border-radius:8px; border:1px solid #fecaca;"><span style="font-size:12px; color:#BE123C; font-weight:800;">▲ 負融像開散逾界 (BI)</span><br><span style="font-size:20px; font-weight:900; color:#9f1239;">' + biFail + '</span></div>',
        '            <div style="background:#fffbeb; padding:10px 14px; border-radius:8px; border:1px solid #fde68a;"><span style="font-size:12px; color:#B88E28; font-weight:800;">■ 單側分視訊號短暫休眠</span><br><span style="font-size:20px; font-weight:900; color:#92400e;">' + suppCount + '</span></div>',
        '            <div style="background:#fef2f2; padding:10px 14px; border-radius:8px; border:1px solid #fecaca;"><span style="font-size:12px; color:#BE123C; font-weight:800;">▲ 垂直融像對齊微偏</span><br><span style="font-size:20px; font-weight:900; color:#9f1239;">' + vertFail + '</span></div>',
        '        </div>',
        '        <h3 style="font-size:14.5px; margin-bottom:10px; color:#1A365D; border-bottom:1.5px solid #e2e8f0; padding-bottom:6px; font-weight:900;">■ 逐次互動反應明細</h3>',
        '        <table style="width:100%; border-collapse: collapse; margin-bottom: 14px;"><thead><tr style="background:#f1f5f9; font-size:12px; color:#475569;"><th style="padding:8px; text-align:center;">時間</th><th style="padding:8px; text-align:center;">雙眼狀態</th><th style="padding:8px; text-align:center;">起始稜鏡</th><th style="padding:8px; text-align:center;">回應稜鏡</th><th style="padding:8px; text-align:center;">反應秒數</th></tr></thead><tbody>' + (tableRowsHTML || '<tr><td colspan="5" style="text-align:center; padding:14px; color:#94a3b8;">本次練習為純視覺跟隨模式（未觸發方向作答）</td></tr>') + '</tbody></table>',
        '        <div style="font-size:11.5px; color:#64748b; background:#f8fafc; padding:10px 14px; border-radius:8px; border:1px solid #e2e8f0; line-height:1.65;">',
        '            * 系統聲明（Non-SaMD Compliance）：本摘要為日常雙眼視覺協調與空間放鬆練習紀錄，遵循衛福部「非屬醫療器材軟體指引」與《驗光人員法》規範，非屬醫療診斷或醫療處方。',
        '        </div>',
        '    </div>',
        '    <div style="padding: 15px 20px; background:#f8fafc; border-top:1px solid #e2e8f0; text-align:center;">',
        '        <button type="button" id="close-report-btn" style="background:linear-gradient(135deg, #1A365D 0%, #1E75BB 100%); color:#FFF9DE; border:1px solid #B88E28; padding:12px 32px; border-radius:8px; font-size:14.5px; cursor:pointer; font-weight:800; transition:0.2s; box-shadow:0 4px 12px rgba(26,54,93,0.2);">關閉摘要並重置畫面</button>',
        '    </div>',
        '</div>'
    ].join('');
    document.body.appendChild(reportOverlay);
    document.getElementById('close-report-btn').addEventListener('click', () => {
        document.body.removeChild(reportOverlay);
        executeReset();
    });
}

// 寫入 Supabase 獨立欄位 (正式指向全新表名 public.axp_vision)
async function uploadToSupabase() {
    const finalTime = Math.max(5, totalTimerSec);
    const finalProtocol = activeProtocol ? PROTOCOL_NAMES[activeProtocol] : 'I. 平面融像儲備與 SILO 立體視 (Manual Mode)';
    
    const payloadData = {
        patient_id: currentPatientCode,
        environmental_setup: {
            prism_base: document.getElementById('prism-slider')?.value || 0,
            anaglyph_balance: document.getElementById('balance-slider')?.value || 50,
            screen_spec: screenSpecSelect?.value || 'mbp16',
            view_dist_cm: viewDistInput?.value || 50,
            input_mode: currentInputMode,
            distractor_count: currentDistractors
        },
        clinical_logs: [...sessionLogs]
    };

    isRunning = false;
    cancelAnimationFrame(animationId);
    if (startBtn) { startBtn.innerText = "▶ 啟動練習 [ Space ]"; startBtn.classList.remove('active'); }
    if (dpadCenterLabel) dpadCenterLabel.innerText = "START";
    if (statusText) { statusText.innerText = "SYNCING CLOUD REPORT..."; statusText.style.color = "#7CC2F5"; }
    
    try {
        if (totalTimerSec >= 5 || sessionLogs.length > 0) {
            await supabase.from('axp_vision').insert([{
                duration_sec: finalTime,
                protocol_name: finalProtocol,
                raw_data: payloadData,
                patient_code: currentPatientCode
            }]);
        }
        if (statusText) { statusText.innerText = "REPORT GENERATED"; statusText.style.color = "#34d399"; }
        showClinicalReport(payloadData.clinical_logs, totalTimerSec, finalProtocol);
        sessionLogs = [];
    } catch (err) {
        console.warn("Cloud Sync Note:", err);
        showClinicalReport(payloadData.clinical_logs, totalTimerSec, finalProtocol);
    }
}

function updateGlassesUI() {
    const lLabelText = document.getElementById('l-label-text');
    if (glassesSelect && glassesSelect.value === 'rb') {
        if (greenSlider) greenSlider.style.display = 'none'; if (blueSlider) blueSlider.style.display = 'block';
        if (lLabelText) lLabelText.innerText = '藍通道';
    } else {
        if (greenSlider) greenSlider.style.display = 'block'; if (blueSlider) blueSlider.style.display = 'none';
        if (lLabelText) lLabelText.innerText = '綠通道';
    }
    updateOpticsFromUI();
}

if (glassesSelect) glassesSelect.addEventListener('change', updateGlassesUI);
[redSlider, greenSlider, blueSlider].forEach(slider => { if (slider) slider.addEventListener('input', updateOpticsFromUI); });
if (prismSlider) prismSlider.addEventListener('input', () => { protocolTime = 0; updateOpticsFromUI(); });

function updateUIValues() {
    if (sizeLabel) sizeLabel.innerText = currentSize.toFixed(0) + 'px';
    if (speedLabel) speedLabel.innerText = currentSpeed.toFixed(0);
    if (thickLabel) thickLabel.innerText = currentThick.toFixed(1);
    if (stereoLabel) stereoLabel.innerText = (currentStereo > 0 ? '+' : '') + currentStereo.toFixed(2);
    
    const hudStereoVal = document.getElementById('hud-stereo-val');
    if (hudStereoVal) hudStereoVal.innerText = currentStereo.toFixed(2);
    
    let balance = balanceSlider ? parseInt(balanceSlider.value) : 50;
    if (balanceLabel) balanceLabel.innerText = balance === 50 ? "均衡 50/50" : (balance < 50 ? ('強左 ' + (100 - balance) + '%') : ('強右 ' + balance + '%'));
    
    if (sizeSlider) sizeSlider.value = currentSize;
    if (speedSlider) speedSlider.value = currentSpeed; if (thickSlider) thickSlider.value = currentThick;
    if (stereoSlider) stereoSlider.value = currentStereo;
}

if (screenSpecSelect) screenSpecSelect.addEventListener('change', () => {
    const spec = screenSpecSelect.value;
    if (SCREEN_SPEC_CONFIG[spec] && viewDistInput) {
        viewDistInput.value = SCREEN_SPEC_CONFIG[spec].defaultDistCm;
    }
    if (spec === 'tablet11' || spec === 'tablet13' || spec === 'touch55') {
        setInputMode('touch');
    }
    updateScaleAndThickness();
    updateOpticsFromUI();
    updatePositions(phase, '');
});
if (viewDistInput) viewDistInput.addEventListener('input', () => {
    updateOpticsFromUI();
    updatePositions(phase, '');
});

if (sizeSlider) sizeSlider.addEventListener('input', (e) => { currentSize = parseFloat(e.target.value); protocolTime = 0; updateUIValues(); updateScaleAndThickness(); disableAI(); });
if (speedSlider) speedSlider.addEventListener('input', (e) => { currentSpeed = parseFloat(e.target.value); protocolTime = 0; updateUIValues(); disableAI(); });
if (thickSlider) thickSlider.addEventListener('input', (e) => { currentThick = parseFloat(e.target.value); protocolTime = 0; updateUIValues(); buildTargets(); disableAI(); });
if (stereoSlider) stereoSlider.addEventListener('input', (e) => { currentStereo = Math.max(-0.15, Math.min(0.15, parseFloat(e.target.value))); e.target.value = currentStereo; protocolTime = 0; updateUIValues(); if (!isRunning) updatePositions(0, ''); disableAI(); });

if (balanceSlider) balanceSlider.addEventListener('input', () => { updateUIValues(); updateOpticsFromUI(); });
if (rotateCheckbox) rotateCheckbox.addEventListener('change', (e) => { isRotating = e.target.checked; protocolTime = 0; });
if (shapeSelect) shapeSelect.addEventListener('change', () => { protocolTime = 0; buildTargets(); });
if (customTextInput) customTextInput.addEventListener('input', buildTargets);
if (fillCheckbox) fillCheckbox.addEventListener('change', (e) => { isFilled = e.target.checked; protocolTime = 0; buildTargets(); });

function disableAI() {
    if (aiToggle && aiToggle.checked) { aiToggle.checked = false; }
    if (dynamicModeTag) { dynamicModeTag.innerText = "AXP VISION｜手動自由調控模式"; dynamicModeTag.style.color = '#f8fafc'; }
    if (stageIndicatorLabel) stageIndicatorLabel.innerText = "手動自由模式";
    document.querySelectorAll('.proto-btn[data-proto]').forEach(b => b.classList.remove('active-proto'));
    
    currentAxis = 'horizontal';
    currentMode = 'crossover';
    currentVertPrism = 0;
    currentDistractors = 0;
    protocolTime = 0;
    dichopticSwapState = false;
    antagonistRippleGroup.visible = false;
    stageCountdownBadge.style.display = 'none';
    buildTargets();
    
    siloPrompt.style.display = 'none';
    if (isAIRescueActive) endAIRescue();
}

function loadMatrixStage(protocol, stage) {
    const config = AIM_MATRIX[protocol][stage]; if (!config) return;
    
    protocolTime = 0;
    flipperTimer = 0;
    saccadeTimer = 0;
    timeSinceLastTask = 0;
    taskActive = false;
    dichopticSwapState = false;
    cueGroupLeft.visible = false;
    cueGroupRight.visible = false;
    stageCountdownBadge.style.display = 'none';
    lastTime = performance.now();

    document.querySelectorAll('.proto-btn[data-proto]').forEach(b => {
        b.classList.toggle('active-proto', b.getAttribute('data-proto') === protocol);
    });

    if (shapeSelect) {
        let optionExists = Array.from(shapeSelect.options).some(opt => opt.value === config.shape);
        if (!optionExists) { const newOpt = new Option(config.shape, config.shape); shapeSelect.add(newOpt); }
        shapeSelect.value = config.shape;
    }
    
    currentAxis = config.axis || 'horizontal';
    currentMode = config.mode || 'crossover';
    currentVertPrism = config.v_prism || 0;
    currentStageDurationMs = (config.duration || 60) * 1000;
    currentDistractors = config.distractors || 0;

    if (fillCheckbox) fillCheckbox.checked = config.fill; isFilled = config.fill;
    
    currentStereo = Math.max(-0.15, Math.min(0.15, config.stereo));
    currentSize = config.size; currentSpeed = config.speed; currentThick = config.thick;
    isRotating = !config.anim.includes('none'); if (rotateCheckbox) rotateCheckbox.checked = isRotating;
    
    if (prismSlider) { prismSlider.value = config.dist; }

    updateUIValues(); buildTargets();
    
    const stageMaxStr = AIM_MATRIX[protocol] ? AIM_MATRIX[protocol].length : 10;
    const durSec = config.duration || 60;
    if (dynamicModeTag) {
        dynamicModeTag.innerText = '[ ' + PROTOCOL_NAMES[protocol].split(' ')[0] + ' ] Stage ' + (stage + 1) + '/' + stageMaxStr + ' (' + durSec + 's) : ' + config.name;
        dynamicModeTag.style.color = config.anim.includes('antagonist_relax') ? '#34d399' : '#D4B459';
    }
    if (stageIndicatorLabel) {
        stageIndicatorLabel.innerText = protocol.replace('Key','') + ' 模組｜Stage ' + (stage + 1) + ' / ' + stageMaxStr + ' (' + durSec + 's)';
    }
    currentSaccadeX = 0; currentSaccadeY = 0; currentRoamX = 0; currentRoamY = 0;
}

function toggleTestMode() {
    if (isAIRescueActive) return;
    isTestModeActive = !isTestModeActive;
    updateTestModeButtonLabel();
    if (!isTestModeActive) {
        taskActive = false; cueGroupLeft.visible = false; cueGroupRight.visible = false;
        if (isRunning && statusText) { statusText.innerText = "PRACTICE ACTIVE (測驗已關閉)"; statusText.style.color = '#7CC2F5'; }
    } else {
        timeSinceLastTask = 0;
        if (isRunning && statusText) { statusText.innerText = "INTERACTIVE TEST ON"; statusText.style.color = '#D4B459'; }
    }
}

document.querySelectorAll('.proto-btn[data-proto]').forEach(btn => {
    btn.addEventListener('click', () => {
        const code = btn.getAttribute('data-proto');
        if (isAIRescueActive) return;
        if (aiToggle) aiToggle.checked = true;
        const maxStages = AIM_MATRIX[code] ? AIM_MATRIX[code].length : 10;
        if (activeProtocol === code && isRunning) {
            protocolStage = (protocolStage + 1) % maxStages;
        } else {
            activeProtocol = code;
            protocolStage = 0;
        }
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

function toggleControlPanel() {
    if (!controlPanel) return;
    const isHidden = controlPanel.style.display === 'none';
    controlPanel.style.display = isHidden ? 'flex' : 'none';
    if (togglePanelText) {
        togglePanelText.innerText = isHidden ? '收合面板 [E]' : '展開面板 [E]';
    }
    setTimeout(onWindowResize, 50);
}
if (btnTogglePanel) btnTogglePanel.addEventListener('click', toggleControlPanel);

function toggleFullScreen() {
    const elem = document.getElementById('fv-fusion-app');
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (elem.requestFullscreen) { elem.requestFullscreen(); } else if (elem.webkitRequestFullscreen) { elem.webkitRequestFullscreen(); }
    } else {
        if (document.exitFullscreen) { document.exitFullscreen(); } else if (document.webkitExitFullscreen) { document.webkitExitFullscreen(); }
    }
}
if (fullscreenBtn) fullscreenBtn.addEventListener('click', toggleFullScreen);
if (btnArenaFs) btnArenaFs.addEventListener('click', toggleFullScreen);

// ============================================================================
// 🎮 虛擬十字方向舵 (Touch D-Pad) ＆ 3D 畫布滑動手勢 (Canvas Swipe) 綁定
// ============================================================================
dpadDirBtns.forEach(btn => {
    const triggerDir = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const dir = btn.getAttribute('data-dir');
        btn.classList.add('dpad-pressed');
        setTimeout(() => btn.classList.remove('dpad-pressed'), 140);
        submitDirectionAnswer(dir);
    };
    btn.addEventListener('pointerdown', triggerDir);
});

if (dpadSpaceBtn) {
    dpadSpaceBtn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleTraining();
    });
}

let touchStartX = 0, touchStartY = 0, touchStartTime = 0;
if (container) {
    container.addEventListener('touchstart', (e) => {
        if (!e.touches || e.touches.length === 0) return;
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
        touchStartTime = performance.now();
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
        if (!e.changedTouches || e.changedTouches.length === 0) return;
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        const dt = performance.now() - touchStartTime;
        const absDx = Math.abs(dx);
        const absDy = Math.abs(dy);

        if (Math.max(absDx, absDy) >= 24 && dt <= 650) {
            const swipeDir = absDx > absDy ? (dx > 0 ? 'ArrowRight' : 'ArrowLeft') : (dy > 0 ? 'ArrowDown' : 'ArrowUp');
            submitDirectionAnswer(swipeDir);
        }
    }, { passive: true });
}

// ==========================================
// 動態動畫與階段計時迴圈 (100% 封裝呼吸秒數黑盒子)
// ==========================================
function animate(time) {
    if (!isRunning) return;
    if (!lastTime) lastTime = time;
    const dt = Math.min(100, time - lastTime);
    lastTime = time;

    if (Math.floor(time / 1000) > Math.floor((time - dt) / 1000)) {
        totalTimerSec++;
        if (timerDisplay) timerDisplay.innerText = Math.floor(totalTimerSec / 60).toString().padStart(2, '0') + ':' + (totalTimerSec % 60).toString().padStart(2, '0');
    }
    const speedFactor = 40000 / Math.max(1, currentSpeed); phase += dt / speedFactor;

    // 自主神經呼吸指示燈律動（黑盒子封裝黃金比例相位波，不暴露具體秒數）
    const phaseNorm = (time % 10500) / 10500;
    const isInhale = phaseNorm < 0.382;
    const breathWave = isInhale ? (phaseNorm / 0.382) : (1.0 - (phaseNorm - 0.382) / 0.618);
    if (breathIndicator && breathText) {
        breathIndicator.style.transform = 'scale(' + (0.8 + breathWave * 0.6).toFixed(2) + ')';
        breathIndicator.style.backgroundColor = isInhale ? '#2988D6' : '#D4B459';
        breathText.innerText = isInhale ? '[ 呼吸節律導引 ] 請跟隨光點擴張・保持平穩深吸氣...' : '[ 呼吸節律導引 ] 請跟隨光點收斂・放鬆雙肩並深長慢吐...';
    }

    if (isAIRescueActive) {
        const timeInRescue = performance.now() - aiRescueStartTime;
        if (timeInRescue > 10000) { endAIRescue(); }
        else { const timeLeft = Math.ceil((10000 - timeInRescue) / 1000); if (dynamicModeTag) dynamicModeTag.innerText = '[ 視覺減壓緩衝 ' + timeLeft + 's ] 請深長慢吐並放鬆雙眼...'; }
    }

    let currentAnim = '';

    if (aiToggle && aiToggle.checked && activeProtocol && !isAIRescueActive) {
        protocolTime += dt;
        const config = AIM_MATRIX[activeProtocol][protocolStage];
        currentAnim = config.anim || '';
        
        const secLeft = Math.max(0, Math.ceil((currentStageDurationMs - protocolTime) / 1000));
        const stageMaxStr = AIM_MATRIX[activeProtocol] ? AIM_MATRIX[activeProtocol].length : 10;
        if (stageIndicatorLabel) {
            stageIndicatorLabel.innerText = activeProtocol.replace('Key','') + ' 模組｜Stage ' + (protocolStage + 1) + '/' + stageMaxStr + ' (剩餘 ' + secLeft + 's)';
        }

        if (secLeft <= 5 && secLeft > 0) {
            const nextStageIdx = (protocolStage + 1) % stageMaxStr;
            stageCountdownBadge.style.display = 'block';
            stageCountdownBadge.innerText = '即將切換至 Stage ' + (nextStageIdx + 1) + '：倒數 ' + secLeft + ' 秒（請自然眨眼慢吐）';
        } else {
            stageCountdownBadge.style.display = 'none';
        }

        if (currentAnim.includes('swap_flash')) {
            const swapPeriod = currentAnim.includes('swap_flash_fast') ? 5000 : 7000;
            const cyclePos = protocolTime % swapPeriod;
            const shouldSwapRole = (cyclePos > (swapPeriod - 1800));
            if (shouldSwapRole !== dichopticSwapState) {
                dichopticSwapState = shouldSwapRole;
                buildTargets();
            }
        } else if (dichopticSwapState) {
            dichopticSwapState = false;
            buildTargets();
        }

        if (currentAnim.includes('flicker')) {
            const isLeftTurn = Math.floor(protocolTime / 450) % 2 === 0;
            if (targetLeft) targetLeft.visible = isLeftTurn;
            if (targetRight) targetRight.visible = !isLeftTurn;
        } else {
            if (targetLeft) targetLeft.visible = true;
            if (targetRight) targetRight.visible = true;
        }

        if (currentAnim.includes('antagonist_relax')) {
            antagonistRippleGroup.visible = true;
            taskActive = false; cueGroupLeft.visible = false; cueGroupRight.visible = false;
            rippleRings.forEach(r => {
                const prog = ((time / 5500) + r.offset) % 1.0;
                const s = 0.5 + prog * 3.8;
                r.mesh.scale.set(s, s, 1);
                r.mat.opacity = Math.sin(prog * Math.PI) * 0.45;
            });
            const gentleBreathSize = currentSize * (0.88 + 0.22 * breathWave);
            updateScaleAndThickness(gentleBreathSize);
            siloPrompt.style.display = 'block';
            siloPrompt.innerText = '[ 第 7 階・全向眼外肌同步舒緩 ] (剩餘 ' + secLeft + 's)：請凝視中央同心水波向外舒展並深長慢吐';
            siloPrompt.style.borderColor = "#34d399";
        } else {
            antagonistRippleGroup.visible = false;

            if (currentAnim.includes('breathing_fractal')) {
                const breathScale = currentSize + (currentSize * 0.16 * Math.sin(phase));
                updateScaleAndThickness(breathScale);
            }

            if (currentAnim.includes('silo_text')) {
                siloPrompt.style.display = 'block';
                let sineVal = Math.sin(phase);
                if (sineVal > 0) {
                    siloPrompt.innerText = "SILO 立體景深引導：立體球體視標向內聚合靠近中，請配合深長慢吐";
                    siloPrompt.style.borderColor = "#D4B459";
                } else {
                    siloPrompt.innerText = "SILO 立體景深引導：立體球體視標向外展開遠離中，請配合平穩深吸氣";
                    siloPrompt.style.borderColor = "#2988D6";
                }
                updateScaleAndThickness(currentSize * (1 - sineVal * 0.25));
            } else if (currentAnim.includes('center_lock_peripheral')) {
                siloPrompt.style.display = 'block';
                siloPrompt.innerText = "[ 黃斑部中心固視與周邊視野整合 ] 請維持中央十字視標單一合像，同時以周邊餘光覺察外圍閃爍點方向";
                siloPrompt.style.borderColor = "#2988D6";
            } else if (currentAnim.includes('vert_step_alt')) {
                siloPrompt.style.display = 'block';
                const cSec = (protocolTime / 1000) % 14.0;
                const vStateStr = cSec < 4.0 ? "左眼上 ／ 右眼下 對齊維持" : (cSec < 7.0 ? "回歸水平零位放鬆" : (cSec < 11.0 ? "右眼上 ／ 左眼下 對齊維持" : "回歸水平零位放鬆"));
                siloPrompt.innerText = "[ 垂直雙向融像階梯對齊 ] " + vStateStr;
                siloPrompt.style.borderColor = "#D4B459";
            } else if (currentAnim.includes('vert_smooth_alt')) {
                siloPrompt.style.display = 'block';
                siloPrompt.innerText = "[ 垂直雙向慢速融像牽引 ] 請保持頭頸端正不歪頭，讓雙眼平滑對齊十字橫線";
                siloPrompt.style.borderColor = "#2988D6";
            } else {
                siloPrompt.style.display = 'none';
            }
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
                if (customTextInput) customTextInput.value = AXP_WORDS[currentWordIndex];
                buildTargets();
            }
        }

        if (protocolTime >= currentStageDurationMs) {
            protocolStage = (protocolStage + 1) % stageMaxStr;
            loadMatrixStage(activeProtocol, protocolStage);
        }
    }

    if (isTestModeActive && !currentAnim.includes('antagonist_relax')) {
        if (!taskActive) { timeSinceLastTask += dt; if (timeSinceLastTask > nextTaskInterval) spawnTask(); }
        else { if (performance.now() - taskSpawnTime > 7500) handleTaskResult('miss'); }
    }

    const isRoamActive = (currentAnim.includes('roam') || (!aiToggle.checked && currentAxis === 'roam')) && !currentAnim.includes('center_lock_peripheral') && !currentAnim.includes('antagonist_relax');
    const isSaccadeActive = (currentAnim.includes('saccade') || (!aiToggle.checked && currentAxis === 'saccade')) && !currentAnim.includes('center_lock_peripheral') && !currentAnim.includes('antagonist_relax');

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

    if (targetLeft && targetRight) {
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
    if (loginOverlay.style.display !== 'none') return;
    isRunning = !isRunning;
    if (isRunning) {
        if (startBtn) { startBtn.innerText = "⏸ 暫停練習 [ Space ]"; startBtn.classList.add('active'); }
        if (dpadCenterLabel) dpadCenterLabel.innerText = "PAUSE";
        if (statusText) { statusText.innerText = isAIRescueActive ? statusText.innerText : (isTestModeActive ? "INTERACTIVE TEST ON" : "PRACTICE ACTIVE"); statusText.style.color = isAIRescueActive ? '#facc15' : (isTestModeActive ? "#D4B459" : '#7CC2F5'); }
        lastTime = performance.now(); animate(lastTime);
    } else {
        if (startBtn) { startBtn.innerText = "▶ 繼續練習 [ Space ]"; startBtn.classList.remove('active'); }
        if (dpadCenterLabel) dpadCenterLabel.innerText = "START";
        if (statusText) { statusText.innerText = "PAUSED"; statusText.style.color = '#D4B459'; }
        cancelAnimationFrame(animationId);
        taskActive = false; cueGroupLeft.visible = false; cueGroupRight.visible = false;
        stageCountdownBadge.style.display = 'none';
        forceRenderFrame();
    }
}

function executeReset() {
    isRunning = false; cancelAnimationFrame(animationId);
    if (startBtn) { startBtn.innerText = "▶ 啟動練習 [ Space ]"; startBtn.classList.remove('active'); }
    if (dpadCenterLabel) dpadCenterLabel.innerText = "START";
    if (statusText) { statusText.innerText = "IDLE (待命狀態)"; statusText.style.color = '#f8fafc'; }
    totalTimerSec = 0; sessionScore = 0; protocolTime = 0;
    if (timerDisplay) timerDisplay.innerText = "00:00";
    if (hudScoreVal) hudScoreVal.innerText = "0";
    
    activeProtocol = null; protocolStage = 0;
    disableAI();
    
    taskActive = false;
    isTestModeActive = true;
    dichopticSwapState = false;
    antagonistRippleGroup.visible = false;
    stageCountdownBadge.style.display = 'none';
    cueGroupLeft.visible = false; cueGroupRight.visible = false;
    updateTestModeButtonLabel();
    consecutiveHits = 0; consecutiveMisses = 0;
    
    currentSize = 340; currentSpeed = 14; currentStereo = 0.02; currentThick = 8.5;
    currentVertPrism = 0;
    currentDistractors = 0;
    currentSaccadeX = 0; currentSaccadeY = 0; currentRoamX = 0; currentRoamY = 0; phase = 0;
    isRotating = true; isFilled = true; sessionLogs = []; isAIRescueActive = false;
    
    if (shapeSelect) shapeSelect.value = 'dichoptic_lock';
    if (rotateCheckbox) rotateCheckbox.checked = true;
    if (fillCheckbox) fillCheckbox.checked = true;
    if (balanceSlider) balanceSlider.value = 50;
    if (prismSlider) prismSlider.value = 0;
    if (prismValHud) prismValHud.innerText = "0.0 Δ (平光)";
    
    if (redSlider) redSlider.value = 90;
    if (greenSlider) greenSlider.value = 90;
    if (blueSlider) blueSlider.value = 100;
    
    updateUIValues(); buildTargets(); updatePositions(0, '');
    forceRenderFrame();
}

if (startBtn) startBtn.addEventListener('click', toggleTraining);
if (resetBtn) resetBtn.addEventListener('click', executeReset);

function handleKeyCommand(code, shiftKey = false) {
    if (loginOverlay.style.display !== 'none') return;

    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(code)) {
        submitDirectionAnswer(code);
        return;
    }

    switch (code) {
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
        case 'KeyE': toggleControlPanel(); break;
        case 'KeyG': uploadToSupabase(); break;
        case 'KeyZ':
            if (aiToggle) {
                aiToggle.checked = !aiToggle.checked;
                if (!aiToggle.checked) { disableAI(); }
                else {
                    if (!activeProtocol) { activeProtocol = 'KeyY'; protocolStage = 0; }
                    loadMatrixStage(activeProtocol, protocolStage);
                    if (!isRunning) toggleTraining();
                }
            }
            break;
        case 'KeyQ': toggleFullScreen(); break;
        case 'Digit0': case 'Numpad0': toggleTestMode(); break;
        
        case 'Digit1': case 'Numpad1':
            protocolTime = 0;
            if (prismSlider) { prismSlider.value = Math.max(parseFloat(prismSlider.min), parseFloat(prismSlider.value) - 0.5).toFixed(1); prismSlider.dispatchEvent(new Event('input')); }
            break;
        case 'Digit2': case 'Numpad2':
            protocolTime = 0;
            if (prismSlider) { prismSlider.value = Math.min(parseFloat(prismSlider.max), parseFloat(prismSlider.value) + 0.5).toFixed(1); prismSlider.dispatchEvent(new Event('input')); }
            break;
            
        case 'BracketRight': protocolTime = 0; if (stereoSlider) { stereoSlider.value = Math.min(0.15, parseFloat(stereoSlider.value) + 0.01).toFixed(2); stereoSlider.dispatchEvent(new Event('input')); } break;
        case 'BracketLeft': protocolTime = 0; if (stereoSlider) { stereoSlider.value = Math.max(-0.15, parseFloat(stereoSlider.value) - 0.01).toFixed(2); stereoSlider.dispatchEvent(new Event('input')); } break;
        case 'Period': protocolTime = 0; if (speedSlider) { speedSlider.value = Math.min(60, parseFloat(speedSlider.value) + (shiftKey ? 5 : 1)); speedSlider.dispatchEvent(new Event('input')); } break;
        case 'Comma': protocolTime = 0; if (speedSlider) { speedSlider.value = Math.max(1, parseFloat(speedSlider.value) - (shiftKey ? 5 : 1)); speedSlider.dispatchEvent(new Event('input')); } break;
        
        case 'KeyW': protocolTime = 0; currentSize = Math.min(600, currentSize + 15); updateUIValues(); updateScaleAndThickness(); if (!isAIRescueActive) disableAI(); break;
        case 'KeyS': protocolTime = 0; currentSize = Math.max(150, currentSize - 15); updateUIValues(); updateScaleAndThickness(); if (!isAIRescueActive) disableAI(); break;
        
        case 'KeyD': protocolTime = 0; currentThick = Math.min(10, currentThick + 0.5); updateUIValues(); buildTargets(); if (!isAIRescueActive) disableAI(); break;
        case 'KeyA': protocolTime = 0; currentThick = Math.max(2, currentThick - 0.5); updateUIValues(); buildTargets(); if (!isAIRescueActive) disableAI(); break;
        case 'KeyF': protocolTime = 0; if (fillCheckbox) { fillCheckbox.checked = !fillCheckbox.checked; fillCheckbox.dispatchEvent(new Event('change')); } break;
        case 'KeyR': protocolTime = 0; if (rotateCheckbox) { rotateCheckbox.checked = !rotateCheckbox.checked; rotateCheckbox.dispatchEvent(new Event('change')); } break;
        case 'KeyY': case 'KeyU': case 'KeyI': case 'KeyO': case 'KeyP':
            if (isAIRescueActive) break;
            if (aiToggle) aiToggle.checked = true;
            const maxStages = AIM_MATRIX[code] ? AIM_MATRIX[code].length : 10;
            if (activeProtocol === code && isRunning) { protocolStage = (protocolStage + 1) % maxStages; } else { activeProtocol = code; protocolStage = 0; }
            loadMatrixStage(activeProtocol, protocolStage);
            if (!isRunning) toggleTraining();
            break;
    }
}

document.addEventListener('keydown', (e) => {
    if (loginOverlay.style.display !== 'none') return;

    const activeTag = document.activeElement ? document.activeElement.tagName : '';
    const activeType = document.activeElement ? document.activeElement.type : '';
    if (activeTag === 'INPUT' && (activeType === 'text' || activeType === 'number')) {
        return;
    }

    const code = e.code;
    const shortcuts = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', 'Enter', 'KeyE', 'KeyW', 'KeyS', 'KeyD', 'KeyA', 'KeyF', 'KeyR', 'KeyG', 'KeyZ', 'Digit0', 'Numpad0', 'Digit1', 'Digit2', 'Numpad1', 'Numpad2', 'BracketLeft', 'BracketRight', 'Comma', 'Period', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'KeyQ', 'PageUp', 'PageDown'];
    
    if (shortcuts.includes(code)) {
        e.preventDefault();
        if (document.activeElement) document.activeElement.blur();
        handleKeyCommand(code, e.shiftKey);
    }
});

// 支援接收來自外部 Squarespace 外殼之 postMessage 遙控指令
window.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'AXP_KEY' && e.data.code) {
        handleKeyCommand(e.data.code, false);
    }
});

updateGlassesUI(); updateUIValues(); buildTargets();

function onWindowResize() {
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;
    camera.left = -d * (width / height); camera.right = d * (width / height); camera.updateProjectionMatrix();
    renderer.setSize(width, height); rtLeft.setSize(width, height); rtRight.setSize(width, height);
    updateScaleAndThickness();
    forceRenderFrame();
}
window.addEventListener('resize', onWindowResize); setTimeout(onWindowResize, 100);
