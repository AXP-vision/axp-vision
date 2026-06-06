// matrix.js - AXP Fusion Dynamics 臨床視覺訓練協議矩陣 (v16.0 - 50 Stages)
// 包含 Y, U, I, O, P 五大臨床模組

export const PROTOCOL_NAMES = {
    'KeyY': 'Y. 去抑制與感覺整合 (Sensory & Anti-Suppression)',
    'KeyU': 'U. 動眼神經與空間迷向 (Oculomotor & Spatial Awareness)',
    'KeyI': 'I. 平滑融像與 SILO 空間感知 (Smooth Vergence & SILO)',
    'KeyO': 'O. 階躍融像與垂直微調 (Step Vergence & Vertical Tuning)',
    'KeyP': 'P. 調節與聚合極限解綁 (Accommodative-Vergence Uncoupling)'
};

export const AIM_MATRIX = {
    // ========================================================================
    // 🟩 [ Y 鍵 ] 感覺整合與去抑制模組 (Sensory & Anti-Suppression)
    // 目標：破除抑制、建立共視、誘發基礎立體視
    // ========================================================================
    'KeyY': [
        // 初期：無稜鏡負載、超大目標、強烈閃爍與亮度飄移
        { name: '深空喚醒 I (強烈雙眼競爭)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.0, size: 500, dist: 0, speed: 5, thick: 12, anim: 'flicker_heavy,balanceDrift' },
        { name: '深空喚醒 II (中度雙眼競爭)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.0, size: 450, dist: 0, speed: 8, thick: 10, anim: 'flicker_medium,balanceDrift' },
        { name: '深空喚醒 III (輕度雙眼競爭)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.0, size: 400, dist: 0, speed: 10, thick: 9, anim: 'flicker_light' },
        
        // 中期：閃爍減緩，十字對角緩慢移動，建立共視
        { name: '共視鎖定 I (平移追蹤)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.0, size: 350, dist: 50, speed: 10, thick: 8, anim: 'slow_cross' },
        { name: '共視鎖定 II (垂直追蹤)', shape: 'circle5', axis: 'vertical', mode: 'crossover', fill: false, stereo: 0.0, size: 300, dist: 60, speed: 12, thick: 7, anim: 'slow_cross' },
        { name: '共視鎖定 III (對角追蹤)', shape: 'circle5', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.0, size: 280, dist: 70, speed: 15, thick: 7, anim: 'slow_cross' },
        { name: '共視鎖定 IV (全境追蹤)', shape: 'rock3', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.0, size: 250, dist: 80, speed: 15, thick: 6, anim: 'slow_cross' },
        
        // 後期：閃爍停止，引入微弱 3D 立體視與微量 Prism
        { name: '立體萌芽 I (微負載)', shape: 'rock3', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.02, size: 200, dist: 100, speed: 20, thick: 6, anim: 'none' },
        { name: '立體萌芽 II (淺景深)', shape: 'sphere5', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.04, size: 180, dist: 120, speed: 20, thick: 5, anim: 'none' },
        { name: '立體萌芽 III (穩定共視)', shape: 'sphere5', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.05, size: 150, dist: 150, speed: 25, thick: 5, anim: 'none' }
    ],

    // ========================================================================
    // 🟦 [ U 鍵 ] 動眼神經與空間迷向模組 (Oculomotor & Spatial Awareness)
    // 目標：強化眼外肌延展、解開肩頸代償、訓練周邊視野
    // ========================================================================
    'KeyU': [
        // 初期：規律休止點訓練 (眼震友善)
        { name: '中樞穩定 I (水平節律)', shape: 'circle3', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 250, dist: 150, speed: 15, thick: 7, anim: 'smooth_pursuit' },
        { name: '中樞穩定 II (垂直節律)', shape: 'circle3', axis: 'vertical', mode: 'crossover', fill: true, stereo: 0.02, size: 250, dist: 150, speed: 15, thick: 7, anim: 'smooth_pursuit' },
        { name: '中樞穩定 III (基礎環形)', shape: 'sphere5', axis: 'circular', mode: 'crossover', fill: false, stereo: 0.03, size: 200, dist: 200, speed: 20, thick: 6, anim: 'smooth_pursuit' },
        
        // 中期：無限大軌跡 (Lissajous) 延展眼外肌四角
        { name: '無限大延展 I (窄域)', shape: 'sphere5', axis: 'lissajous', mode: 'crossover', fill: false, stereo: 0.03, size: 180, dist: 250, speed: 25, thick: 6, anim: 'smooth_pursuit' },
        { name: '無限大延展 II (中域)', shape: 'sphere5', axis: 'lissajous', mode: 'crossover', fill: false, stereo: 0.04, size: 150, dist: 350, speed: 30, thick: 5, anim: 'smooth_pursuit' },
        { name: '無限大延展 III (廣域邊緣)', shape: 'rock3', axis: 'lissajous', mode: 'crossover', fill: true, stereo: 0.05, size: 120, dist: 450, speed: 35, thick: 5, anim: 'smooth_pursuit' },
        { name: '無限大延展 IV (廣域 + 深度)', shape: 'rock3', axis: 'lissajous', mode: 'crossover', fill: true, stereo: 0.08, size: 100, dist: 500, speed: 40, thick: 4, anim: 'smooth_pursuit' },
        
        // 後期：全螢幕隨機漫遊 + 背景干擾
        { name: '全境鎖定 I (隨機漫遊)', shape: 'startunnel5', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.05, size: 250, dist: 300, speed: 40, thick: 5, anim: 'roam_smooth' },
        { name: '全境鎖定 II (星空干擾)', shape: 'startunnel5', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.08, size: 200, dist: 400, speed: 50, thick: 4, anim: 'roam_starfield' },
        { name: '全境鎖定 III (動眼極限)', shape: 'startunnel5', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.10, size: 150, dist: 500, speed: 60, thick: 3, anim: 'roam_starfield_fast' }
    ],

    // ========================================================================
    // 🟪 [ I 鍵 ] 平滑融像與 SILO 空間感知模組 (Smooth Vergence & SILO)
    // 目標：強化融像寬容度、重建「小=近，大=遠」距離感知
    // ========================================================================
    'KeyI': [
        // 初期：基礎 Trombone 平滑推拉
        { name: '基礎推拉 I (微量負載)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.0, size: 200, dist: 150, speed: 20, thick: 8, anim: 'trombone' },
        { name: '基礎推拉 II (中度負載)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.02, size: 180, dist: 250, speed: 25, thick: 7, anim: 'trombone' },
        { name: '基礎推拉 III (高度負載)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.04, size: 150, dist: 350, speed: 30, thick: 6, anim: 'trombone' },
        
        // 中期：導入 SILO 認知字幕與物理縮放
        { name: 'SILO 認知重建 I (輕度)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.05, size: 200, dist: 200, speed: 20, thick: 6, anim: 'silo_text' },
        { name: 'SILO 認知重建 II (中度)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.08, size: 200, dist: 300, speed: 25, thick: 5, anim: 'silo_text' },
        { name: 'SILO 認知重建 III (重度)', shape: 'rock3', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.10, size: 200, dist: 400, speed: 30, thick: 4, anim: 'silo_text' },
        { name: 'SILO 認知重建 IV (極限)', shape: 'rock3', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.12, size: 200, dist: 500, speed: 35, thick: 4, anim: 'silo_text' },
        
        // 後期：高階幾何呼吸 (Breathing Fractal)
        { name: '高階幾何呼吸 I (3D 變異)', shape: 'rock3', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.05, size: 220, dist: 300, speed: 20, thick: 5, anim: 'breathing_fractal' },
        { name: '高階幾何呼吸 II (深度變異)', shape: 'startunnel5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.10, size: 250, dist: 400, speed: 25, thick: 4, anim: 'breathing_fractal' },
        { name: '高階幾何呼吸 III (極限空間)', shape: 'startunnel5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.15, size: 280, dist: 500, speed: 30, thick: 3, anim: 'breathing_fractal' }
    ],

    // ========================================================================
    // 🟧 [ O 鍵 ] 階躍融像與垂直微調模組 (Step Vergence & Vertical Tuning)
    // 目標：訓練融像反應速度、擴充垂直融像儲備量
    // ========================================================================
    'KeyO': [
        // 初期：模擬虛擬翻轉鏡 (提供充足潛伏期)
        { name: '慢速階躍翻轉 I (3秒潛伏)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 180, dist: 150, speed: 0, thick: 6, anim: 'flipper_slow' },
        { name: '慢速階躍翻轉 II (2.5秒)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.04, size: 150, dist: 250, speed: 0, thick: 5, anim: 'flipper_slow' },
        { name: '中速階躍翻轉 I (2秒)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.06, size: 120, dist: 350, speed: 0, thick: 5, anim: 'flipper_fast' },
        { name: '中速階躍翻轉 II (1.5秒)', shape: 'rock3', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.08, size: 100, dist: 450, speed: 0, thick: 4, anim: 'flipper_fast' },
        
        // 中期：動態跳視融像 (Saccadic Vergence)
        { name: '動態跳視融像 I (窄域)', shape: 'sphere5', axis: 'saccade', mode: 'crossover', fill: false, stereo: 0.05, size: 150, dist: 200, speed: 0, thick: 5, anim: 'saccade_vergence' },
        { name: '動態跳視融像 II (廣域)', shape: 'rock3', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.08, size: 120, dist: 300, speed: 0, thick: 4, anim: 'saccade_vergence' },
        { name: '動態跳視融像 III (極限)', shape: 'rock3', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.12, size: 80, dist: 400, speed: 0, thick: 3, anim: 'saccade_vergence' },
        
        // 後期：導入垂直 Prism 微調
        { name: '垂直極限微調 I (微量)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.05, size: 150, dist: 250, speed: 20, thick: 5, anim: 'vertical_tune_light' },
        { name: '垂直極限微調 II (中量)', shape: 'rock3', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.08, size: 120, dist: 350, speed: 30, thick: 4, anim: 'vertical_tune_medium' },
        { name: '垂直極限微調 III (高量)', shape: 'rock3', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.12, size: 100, dist: 450, speed: 40, thick: 3, anim: 'vertical_tune_heavy' }
    ],

    // ========================================================================
    // 🟥 [ P 鍵 ] 調節與聚合極限解綁模組 (Accommodative-Vergence Uncoupling)
    // 目標：打破 ACA 連動機制、挑戰雙眼視覺極限 (大魔王關卡)
    // ========================================================================
    'KeyP': [
        // 初期：BOP 模擬 (高聚合 + 放鬆調節)
        { name: 'BOP 模擬 I (文字辨識)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.05, size: 250, dist: 300, speed: 15, thick: 8, anim: 'text_bop' },
        { name: 'BOP 模擬 II (細微文字)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.08, size: 200, dist: 450, speed: 20, thick: 6, anim: 'text_bop' },
        { name: 'BOP 模擬 III (極端聚合)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.12, size: 150, dist: 600, speed: 25, thick: 4, anim: 'text_bop' },
        { name: 'BOP 模擬 IV (動態跳視)', shape: 'text', axis: 'saccade', mode: 'oneway_bo', fill: false, stereo: 0.12, size: 120, dist: 500, speed: 0, thick: 4, anim: 'text_bop_saccade' },
        
        // 中期：BIM 模擬 (高散開 + 刺激調節)
        { name: 'BIM 模擬 I (文字辨識)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.05, size: 200, dist: 150, speed: 15, thick: 8, anim: 'text_bim' },
        { name: 'BIM 模擬 II (細微文字)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.08, size: 150, dist: 200, speed: 20, thick: 6, anim: 'text_bim' },
        { name: 'BIM 模擬 III (極端散開)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.12, size: 100, dist: 250, speed: 25, thick: 4, anim: 'text_bim' },
        
        // 後期：全境負荷 (高階運動視覺)
        { name: '全境負荷 I (階躍解綁)', shape: 'text', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.10, size: 150, dist: 400, speed: 0, thick: 5, anim: 'ultimate_uncouple_step' },
        { name: '全境負荷 II (深空解綁)', shape: 'startunnel5', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.15, size: 120, dist: 500, speed: 40, thick: 3, anim: 'ultimate_uncouple_roam' },
        { name: '全境負荷 III (極致視覺)', shape: 'rock3', axis: 'lissajous', mode: 'crossover', fill: true, stereo: 0.15, size: 80, dist: 600, speed: 50, thick: 2, anim: 'ultimate_uncouple_extreme' }
    ]
};