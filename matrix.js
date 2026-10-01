// matrix.js - AXP Fusion Dynamics 臨床視覺訓練協議矩陣 (v23.1 - 終極 MOT 升級與物理限速版)
// 結構規範：嚴格遵循 1-3初級(低劑量) / 4-7中級(擴張期) / 8-10高級(極限重塑) 臨床分級
// 參數校準：U鍵高階模組已將 speed 限縮於 20-25 之間，徹底避免視網膜滑動，專注於認知超載。

export const PROTOCOL_NAMES = {
    'KeyY': 'Y. 感覺整合與去抑制模組 (Sensory & Anti-Suppression)',
    'KeyU': 'U. 宏觀空間與多目標感知模組 (Macro-Spatial & Multiple Object Tracking)',
    'KeyI': 'I. 平滑融像與 SILO 空間感知 (Smooth Vergence & SILO)',
    'KeyO': 'O. 階躍融像與垂直微調 (Step Vergence & Vertical Tuning)',
    'KeyP': 'P. 調節與聚合極限解綁 (Accommodative-Vergence Uncoupling)'
};

export const AIM_MATRIX = {
    // ========================================================================
    // 🟩 [ Y 鍵 ] 感覺整合與去抑制模組 (主要對接：單眼抑制解除、視覺感知不對稱、立體視弱化)
    // ========================================================================
    'KeyY': [
        { name: 'Y-01 深空喚醒 I (強烈雙眼競爭)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.0, size: 550, dist: 1.5, speed: 5, thick: 10, anim: 'flicker_heavy,balanceDrift' },
        { name: 'Y-02 深空喚醒 II (中度雙眼競爭)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.0, size: 500, dist: 3.0, speed: 7, thick: 9, anim: 'flicker_medium,balanceDrift' },
        { name: 'Y-03 深空喚醒 III (輕度雙眼競爭)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.0, size: 450, dist: 4.5, speed: 10, thick: 8, anim: 'flicker_light' },
        { name: 'Y-04 共視鎖定 I (水平平移追蹤)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.0, size: 380, dist: 6.0, speed: 12, thick: 8, anim: 'slow_cross' },
        { name: 'Y-05 共視鎖定 II (垂直平移追蹤)', shape: 'circle5', axis: 'vertical', mode: 'crossover', fill: false, stereo: 0.0, size: 340, dist: 8.0, speed: 12, thick: 7, anim: 'slow_cross' },
        { name: 'Y-06 共視鎖定 III (全境對角追蹤)', shape: 'circle5', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.0, size: 300, dist: 10.0, speed: 15, thick: 7, anim: 'slow_cross' },
        { name: 'Y-07 共視鎖定 IV (神經晶體動態追蹤)', shape: 'crystal8', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.0, size: 260, dist: 12.0, speed: 15, thick: 6, anim: 'slow_cross' },
        { name: 'Y-08 立體萌芽 I (微弱立體視差)', shape: 'crystal8', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.02, size: 200, dist: 14.0, speed: 20, thick: 6, anim: 'none' },
        { name: 'Y-09 立體萌芽 II (淺景深神經融合)', shape: 'sphere5', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.04, size: 160, dist: 16.0, speed: 20, thick: 5, anim: 'none' },
        { name: 'Y-10 立體萌芽 III (穩定中心窩共視)', shape: 'sphere5', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.06, size: 120, dist: 18.0, speed: 25, thick: 5, anim: 'none' }
    ],

    // ========================================================================
    // 🟦 [ U 鍵 ] 宏觀空間與多目標感知模組 (主要對接：多目標抗干擾、周邊視野優化、空間迷向解除)
    // ========================================================================
    'KeyU': [
        { name: 'U-01 基礎定錨 I (單目標/無干擾)', shape: 'circle3', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.01, size: 260, dist: 2.0, speed: 10, thick: 7, anim: 'smooth_pursuit', distractors: 0 },
        { name: 'U-02 空間感知 I (2對視標/平滑追視)', shape: 'sphere5', axis: 'vertical', mode: 'crossover', fill: true, stereo: 0.01, size: 220, dist: 4.0, speed: 12, thick: 6, anim: 'smooth_pursuit', distractors: 1 },
        { name: 'U-03 空間感知 II (3對視標/環形軌跡)', shape: 'torusKnot', axis: 'circular', mode: 'crossover', fill: false, stereo: 0.02, size: 180, dist: 6.0, speed: 15, thick: 6, anim: 'smooth_pursuit', distractors: 2 },
        { name: 'U-04 雜訊抗擾 I (4對視標/紐結拉伸)', shape: 'torusKnot', axis: 'lissajous', mode: 'crossover', fill: false, stereo: 0.03, size: 160, dist: 8.0, speed: 20, thick: 6, anim: 'smooth_pursuit', distractors: 3 },
        { name: 'U-05 雜訊抗擾 II (5對視標/廣域擴張)', shape: 'crystal8', axis: 'lissajous', mode: 'crossover', fill: true, stereo: 0.04, size: 140, dist: 10.0, speed: 25, thick: 5, anim: 'smooth_pursuit', distractors: 4 },
        { name: 'U-06 空間解壓縮 I (6對視標/隨機漫遊)', shape: 'nested_dodeca', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.05, size: 130, dist: 12.0, speed: 30, thick: 5, anim: 'roam_smooth', distractors: 5 },
        { name: 'U-07 空間解壓縮 II (7對視標/極致牽引)', shape: 'torusKnot', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.06, size: 120, dist: 14.0, speed: 35, thick: 4, anim: 'roam_smooth', distractors: 6 },
        { name: 'U-08 認知超載 I (8對視標/高頻漫遊)', shape: 'crystal8', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.06, size: 130, dist: 16.0, speed: 20, thick: 5, anim: 'roam_smooth', distractors: 7 },
        { name: 'U-09 認知超載 II (9對視標/逆旋星空)', shape: 'nested_dodeca', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.08, size: 110, dist: 18.0, speed: 22, thick: 4, anim: 'roam_starfield_ccw', distractors: 8 },
        { name: 'U-10 認知超載 III (10對滿載/順旋星空)', shape: 'torusKnot', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.10, size: 100, dist: 20.0, speed: 25, thick: 4, anim: 'roam_starfield_cw', distractors: 9 }
    ],

    // ========================================================================
    // 🟪 [ I 鍵 ] 平滑融像與 SILO 空間感知模組 (主要對接：內/外隱斜張力量化、融像極限擴展、SILO空間認知重建)
    // ========================================================================
    'KeyI': [
        { name: 'I-01 基礎推拉 I (入門融像建立)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.0, size: 220, dist: 3.0, speed: 15, thick: 8, anim: 'trombone' },
        { name: 'I-02 基礎推拉 II (溫和融像負載)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.01, size: 200, dist: 5.0, speed: 20, thick: 7, anim: 'trombone' },
        { name: 'I-03 基礎推拉 III (中度平滑增壓)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.02, size: 180, dist: 8.0, speed: 25, thick: 6, anim: 'trombone' },
        { name: 'I-04 SILO 認知重建 I (輕度呼吸連動)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.04, size: 200, dist: 12.0, speed: 20, thick: 6, anim: 'silo_text' },
        { name: 'I-05 SILO 認知重建 II (中度空間適應)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.06, size: 180, dist: 16.0, speed: 22, thick: 5, anim: 'silo_text' },
        { name: 'I-06 SILO 認知重建 III (量子核重度修正)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.08, size: 160, dist: 20.0, speed: 25, thick: 4, anim: 'silo_text' },
        { name: 'I-07 SILO 認知重建 IV (量子核幾何擴張)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.10, size: 140, dist: 24.0, speed: 28, thick: 4, anim: 'silo_text' },
        { name: 'I-08 高階幾何呼吸 I (量子核空間來回)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.08, size: 120, dist: 28.0, speed: 20, thick: 5, anim: 'breathing_fractal' },
        { name: 'I-09 高階幾何呼吸 II (量子核深度變異)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.12, size: 100, dist: 34.0, speed: 25, thick: 4, anim: 'breathing_fractal' },
        { name: 'I-10 高階幾何呼吸 III (極致物理融像衝刺)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.15, size: 80, dist: 40.0, speed: 30, thick: 3, anim: 'breathing_fractal' }
    ],

    // ========================================================================
    // 🟧 [ O 鍵 ] 階躍融像與垂直微調模組 (主要對接：雙眼協調性優化、瞬時融像加速、垂直空間代償校準)
    // ========================================================================
    'KeyO': [
        { name: 'O-01 慢速階躍翻轉 I (3.0秒潛伏切換)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 180, dist: 4.0, speed: 0, thick: 6, anim: 'flipper_slow' },
        { name: 'O-02 慢速階躍翻轉 II (2.5秒切換)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.03, size: 160, dist: 6.0, speed: 0, thick: 5, anim: 'flipper_slow' },
        { name: 'O-03 中速階躍翻轉 I (2.0秒切換)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.04, size: 140, dist: 8.0, speed: 0, thick: 5, anim: 'flipper_fast' },
        { name: 'O-04 中速階躍翻轉 II (1.5秒瞬間切換)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.05, size: 120, dist: 12.0, speed: 0, thick: 4, anim: 'flipper_fast' },
        { name: 'O-05 動態跳視融像 I (窄域雙向急跳)', shape: 'sphere5', axis: 'saccade', mode: 'crossover', fill: false, stereo: 0.04, size: 150, dist: 16.0, speed: 15, thick: 5, anim: 'saccade_vergence' },
        { name: 'O-06 動態跳視融像 II (廣域多向急跳)', shape: 'nested_dodeca', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.06, size: 130, dist: 20.0, speed: 20, thick: 4, anim: 'saccade_vergence' },
        { name: 'O-07 動態跳視融像 III (高頻隨機急跳)', shape: 'nested_dodeca', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.08, size: 110, dist: 24.0, speed: 25, thick: 3, anim: 'saccade_vergence' },
        { name: 'O-08 垂直極限微調 I (輕度 0.3Δ 垂直微擾)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.05, size: 140, dist: 28.0, speed: 20, thick: 5, anim: 'vertical_tune_light' },
        { name: 'O-09 垂直極限微調 II (中度 0.7Δ 垂直加壓)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.08, size: 120, dist: 34.0, speed: 25, thick: 4, anim: 'vertical_tune_medium' },
        { name: 'O-10 垂直極限微調 III (高級 1.2Δ 垂直極限挑戰)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.10, size: 100, dist: 40.0, speed: 30, thick: 3, anim: 'vertical_tune_heavy' }
    ],

    // ========================================================================
    // 🟥 [ P 鍵 ] 調節與聚合極限解綁模組 (主要對接：調節機能優化、解除睫狀肌高張力緊鎖、AC/A 柔性解綁)
    // ========================================================================
    'KeyP': [
        { name: 'P-01 BOP 模擬 I (高頻視標動態錨點)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.02, size: 260, dist: 4.0, speed: 12, thick: 8, anim: 'text_bop' },
        { name: 'P-02 感覺交替 I (高對比晶體跳視)', shape: 'nested_dodeca', axis: 'saccade', mode: 'oneway_bo', fill: true, stereo: 0.04, size: 220, dist: 6.0, speed: 15, thick: 5, anim: 'none' },
        { name: 'P-03 BOP 模擬 II (視標中等字級對焦)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.04, size: 200, dist: 8.0, speed: 15, thick: 7, anim: 'text_bop' },
        { name: 'P-04 BIM 模擬 I (反向開散放鬆調節)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.02, size: 180, dist: -2.0, speed: 12, thick: 7, anim: 'text_bim' },
        { name: 'P-05 感覺交替 II (廣域同心圓漫遊)', shape: 'circle5', axis: 'roam', mode: 'oneway_bo', fill: false, stereo: 0.06, size: 160, dist: 14.0, speed: 20, thick: 5, anim: 'none' },
        { name: 'P-06 BIM 模擬 II (細微視標反向增壓)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.04, size: 140, dist: -4.0, speed: 16, thick: 6, anim: 'text_bim' },
        { name: 'P-07 綜合活化 (幾何反向呼吸與解綁)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.06, size: 180, dist: 20.0, speed: 20, thick: 5, anim: 'breathing_fractal' },
        { name: 'P-08 全境負荷 I (跳視定錨瞬間對焦)', shape: 'text', axis: 'saccade', mode: 'crossover', fill: false, stereo: 0.10, size: 130, dist: 28.0, speed: 15, thick: 5, anim: 'text_saccade' },
        { name: 'P-09 全境負荷 II (3D 緩速追視推拉)', shape: 'text', axis: 'circular', mode: 'crossover', fill: false, stereo: 0.12, size: 110, dist: 34.0, speed: 10, thick: 4, anim: 'text_trombone' },
        { name: 'P-10 全境負荷 III (虛擬翻轉鏡極限解綁)', shape: 'text', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.15, size: 90, dist: 40.0, speed: 0, thick: 3, anim: 'text_flipper_fast' }
    ]
};
