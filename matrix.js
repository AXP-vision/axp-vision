// matrix.js - AXP Fusion Dynamics 臨床視覺協同矩陣 (v24.0)
// 核心重構：
// 1. 徹底廢除過小字體與視標，所有階段尺寸鎖定於 200px ~ 520px 生理舒適範圍，杜絕瞇眼與烏龜頸代償
// 2. KeyY 全面導入 dichoptic_lock 與 dichoptic_cross 雙眼互補視標，專攻單眼抑制解除
// 3. 修正 KeyO 垂直微調之水平基底至舒適區 (6~12Δ)，修正 KeyP 調節解綁之大字體清晰度

export const PROTOCOL_NAMES = {
    'KeyY': 'Y. 雙眼訊號平衡與破除抑制 (Dichoptic Anti-Suppression)',
    'KeyU': 'U. 平滑追視與周邊空間穩定 (Smooth Pursuits & Peripheral Lock)',
    'KeyI': 'I. 立體景深融像與 SILO 感知 (Smooth Vergence & SILO)',
    'KeyO': 'O. 階躍跳視定位與垂直微調 (Saccadic Step & Vertical Tuning)',
    'KeyP': 'P. 對焦收放調節與聚散解綁 (Accommodative-Vergence Uncoupling)'
};

export const AIM_MATRIX = {
    // ========================================================================
    // 🟩 [ Y 鍵 ] 雙眼訊號平衡與破除抑制模組 (左框右核互補對位 + 對比度呼吸搖擺)
    // ========================================================================
    'KeyY': [
        { name: 'Y-01 雙眼互補喚醒 I (大尺寸左框右核對位)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.0, size: 500, dist: 1.5, speed: 6, thick: 9, anim: 'balanceDrift' },
        { name: 'Y-02 雙眼互補喚醒 II (十字準星分視校準)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.0, size: 460, dist: 3.0, speed: 8, thick: 8, anim: 'balanceDrift' },
        { name: 'Y-03 交替閃爍破抑制 (輕度頻閃喚醒休眠眼)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.01, size: 420, dist: 4.5, speed: 10, thick: 8, anim: 'flicker_light' },
        { name: 'Y-04 水平共視鎖定 (雙眼互補平滑移動)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 380, dist: 6.0, speed: 12, thick: 8, anim: 'slow_cross' },
        { name: 'Y-05 垂直共視鎖定 (上下視野雙眼同步)', shape: 'dichoptic_cross', axis: 'vertical', mode: 'crossover', fill: true, stereo: 0.02, size: 360, dist: 6.0, speed: 12, thick: 7, anim: 'slow_cross' },
        { name: 'Y-06 廣域對角共視 (全視野防抑制追蹤)', shape: 'dichoptic_lock', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.03, size: 340, dist: 8.0, speed: 14, thick: 7, anim: 'roam_smooth' },
        { name: 'Y-07 立體晶體共視 (雙層八面體深度融合)', shape: 'crystal8', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.04, size: 310, dist: 10.0, speed: 15, thick: 7, anim: 'roam_smooth' },
        { name: 'Y-08 立體景深建立 I (實體晶球立體浮現)', shape: 'glossysphere', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.05, size: 290, dist: 12.0, speed: 16, thick: 6, anim: 'none' },
        { name: 'Y-09 立體景深建立 II (五層同心圓立體鎖定)', shape: 'circle5', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.06, size: 270, dist: 14.0, speed: 18, thick: 6, anim: 'roam_smooth' },
        { name: 'Y-10 雙眼平衡穩定收操 (溫和開散放鬆)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'oneway_bi', fill: true, stereo: 0.02, size: 340, dist: -3.0, speed: 10, thick: 7, anim: 'breathing_fractal' }
    ],

    // ========================================================================
    // 🟦 [ U 鍵 ] 平滑追視與周邊空間穩定模組 (精簡干擾物為 1~4 顆，防止視覺擁擠)
    // ========================================================================
    'KeyU': [
        { name: 'U-01 水平平滑追視 (單目標頭頸分離練習)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.02, size: 340, dist: 3.0, speed: 12, thick: 8, anim: 'smooth_pursuit', distractors: 0 },
        { name: 'U-02 垂直平滑追視 (解除下巴上抬代償)', shape: 'sphere5', axis: 'vertical', mode: 'crossover', fill: false, stereo: 0.02, size: 320, dist: 4.0, speed: 12, thick: 7, anim: 'smooth_pursuit', distractors: 1 },
        { name: 'U-03 環狀軌跡追視 (360度眼外肌協調)', shape: 'torusKnot', axis: 'circular', mode: 'crossover', fill: false, stereo: 0.03, size: 300, dist: 6.0, speed: 14, thick: 7, anim: 'smooth_pursuit', distractors: 1 },
        { name: 'U-04 莫比烏斯 8 字追視 I (雙側腦半球整合)', shape: 'torusKnot', axis: 'lissajous', mode: 'crossover', fill: false, stereo: 0.04, size: 280, dist: 8.0, speed: 16, thick: 7, anim: 'smooth_pursuit', distractors: 2 },
        { name: 'U-05 莫比烏斯 8 字追視 II (周邊餘光抗干擾)', shape: 'crystal8', axis: 'lissajous', mode: 'crossover', fill: true, stereo: 0.05, size: 270, dist: 10.0, speed: 18, thick: 6, anim: 'smooth_pursuit', distractors: 2 },
        { name: 'U-06 廣域空間漫遊 I (軟視線周邊定錨)', shape: 'nested_dodeca', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.05, size: 260, dist: 12.0, speed: 18, thick: 6, anim: 'roam_smooth', distractors: 3 },
        { name: 'U-07 廣域空間漫遊 II (互補鎖動態追視)', shape: 'dichoptic_lock', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.06, size: 280, dist: 14.0, speed: 20, thick: 6, anim: 'roam_smooth', distractors: 3 },
        { name: 'U-08 動態周邊穩定 I (四目標空間維持)', shape: 'crystal8', axis: 'roam', mode: 'crossover', fill: false, stereo: 0.07, size: 250, dist: 16.0, speed: 20, thick: 6, anim: 'roam_smooth', distractors: 4 },
        { name: 'U-09 動態周邊穩定 II (立體星芒廣域追視)', shape: 'star5', axis: 'circular', mode: 'crossover', fill: false, stereo: 0.08, size: 260, dist: 18.0, speed: 20, thick: 6, anim: 'smooth_pursuit', distractors: 4 },
        { name: 'U-10 廣角視野放鬆收操 (慢速呼吸漫遊)', shape: 'circle5', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: 0.03, size: 320, dist: -3.0, speed: 10, thick: 7, anim: 'breathing_fractal', distractors: 0 }
    ],

    // ========================================================================
    // 🟪 [ I 鍵 ] 立體景深融像與 SILO 感知模組 (配合迷走神經呼吸光環)
    // ========================================================================
    'KeyI': [
        { name: 'I-01 基礎融像推拉 I (建立雙眼聚散彈性)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.02, size: 340, dist: 4.0, speed: 14, thick: 8, anim: 'trombone' },
        { name: 'I-02 基礎融像推拉 II (溫和擴大融像範圍)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.03, size: 320, dist: 7.0, speed: 16, thick: 7, anim: 'trombone' },
        { name: 'I-03 基礎融像推拉 III (立體星芒深度推拉)', shape: 'star5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.04, size: 300, dist: 10.0, speed: 18, thick: 7, anim: 'trombone' },
        { name: 'I-04 SILO 空間呼吸 I (高光晶球近小遠大感知)', shape: 'glossysphere', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.05, size: 280, dist: 12.0, speed: 16, thick: 6, anim: 'silo_text' },
        { name: 'I-05 SILO 空間呼吸 II (八面晶體呼吸同步)', shape: 'crystal8', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.06, size: 270, dist: 15.0, speed: 18, thick: 6, anim: 'silo_text' },
        { name: 'I-06 SILO 空間呼吸 III (十二面體深度擴展)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.08, size: 260, dist: 18.0, speed: 18, thick: 6, anim: 'silo_text' },
        { name: 'I-07 雙眼開散放鬆訓練 (BI 負融像儲備擴展)', shape: 'circle5', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.04, size: 300, dist: -6.0, speed: 14, thick: 7, anim: 'breathing_fractal' },
        { name: 'I-08 高階立體融像 I (雙眼互補鎖深度推拉)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.09, size: 280, dist: 22.0, speed: 18, thick: 6, anim: 'breathing_fractal' },
        { name: 'I-09 高階立體融像 II (深層內聚穩定維持)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.11, size: 250, dist: 26.0, speed: 18, thick: 6, anim: 'breathing_fractal' },
        { name: 'I-10 融像減壓冷卻收操 (回歸零位與開散舒緩)', shape: 'glossysphere', axis: 'horizontal', mode: 'oneway_bi', fill: true, stereo: 0.02, size: 320, dist: -4.0, speed: 10, thick: 7, anim: 'silo_text' }
    ],

    // ========================================================================
    // 🟧 [ O 鍵 ] 階躍跳視定位與垂直微調模組 (修正垂直微調水平基底為舒適之 6~12Δ)
    // ========================================================================
    'KeyO': [
        { name: 'O-01 慢速階躍合像 I (3秒規律聚散切換)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 320, dist: 4.0, speed: 0, thick: 7, anim: 'flipper_slow' },
        { name: 'O-02 慢速階躍合像 II (建立瞬間合像反射)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.03, size: 300, dist: 6.0, speed: 0, thick: 7, anim: 'flipper_slow' },
        { name: 'O-03 中速階躍合像 I (1.5秒敏捷聚散切換)', shape: 'crystal8', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.04, size: 280, dist: 8.0, speed: 0, thick: 6, anim: 'flipper_fast' },
        { name: 'O-04 中速階躍合像 II (十字準星瞬間鎖定)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.05, size: 280, dist: 10.0, speed: 0, thick: 6, anim: 'flipper_fast' },
        { name: 'O-05 定點跳視融像 I (改善閱讀跳行與過衝)', shape: 'circle5', axis: 'saccade', mode: 'crossover', fill: false, stereo: 0.04, size: 270, dist: 8.0, speed: 15, thick: 7, anim: 'saccade_vergence' },
        { name: 'O-06 定點跳視融像 II (廣域隨機方位鎖定)', shape: 'nested_dodeca', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.06, size: 250, dist: 12.0, speed: 18, thick: 6, anim: 'saccade_vergence' },
        { name: 'O-07 定點跳視融像 III (雙眼互補跳視對位)', shape: 'dichoptic_lock', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.06, size: 260, dist: 14.0, speed: 18, thick: 6, anim: 'saccade_vergence' },
        { name: 'O-08 垂直空間微調 I (輕度 0.5Δ 垂直平衡整合)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.04, size: 300, dist: 6.0, speed: 14, thick: 7, anim: 'vertical_tune_light' },
        { name: 'O-09 垂直空間微調 II (中度 0.9Δ 垂直儲備擴展)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.05, size: 280, dist: 8.0, speed: 16, thick: 6, anim: 'vertical_tune_medium' },
        { name: 'O-10 垂直空間微調 III (1.2Δ 垂直穩定與水平放鬆)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.06, size: 280, dist: 10.0, speed: 16, thick: 6, anim: 'vertical_tune_heavy' }
    ],

    // ========================================================================
    // 🟥 [ P 鍵 ] 對焦收放調節與聚散解綁模組 (全面採用 240~360px 清晰大視標)
    // ========================================================================
    'KeyP': [
        { name: 'P-01 清晰大視標調節喚醒 (雙眼同步對焦建立)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.02, size: 360, dist: 4.0, speed: 12, thick: 8, anim: 'text_bop' },
        { name: 'P-02 雙眼互補與文字交替 (破除中心窩抑制)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'oneway_bo', fill: true, stereo: 0.04, size: 320, dist: 6.0, speed: 14, thick: 7, anim: 'none' },
        { name: 'P-03 BOP 正融像解綁 I (內聚同時保持對焦放鬆)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.04, size: 330, dist: 10.0, speed: 14, thick: 8, anim: 'text_bop' },
        { name: 'P-04 BIM 負融像解綁 I (外展同時維持文字清晰)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.02, size: 300, dist: -4.0, speed: 12, thick: 7, anim: 'text_bim' },
        { name: 'P-05 動態環繞對焦鎖定 (移動中維持字體銳利)', shape: 'text', axis: 'circular', mode: 'crossover', fill: false, stereo: 0.05, size: 290, dist: 8.0, speed: 14, thick: 7, anim: 'text_trombone' },
        { name: 'P-06 BIM 負融像解綁 II (深層開散與對焦彈性)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.04, size: 280, dist: -6.0, speed: 14, thick: 7, anim: 'text_bim' },
        { name: 'P-07 BOP 正融像解綁 II (中高階內聚與呼吸放開)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.06, size: 310, dist: 16.0, speed: 16, thick: 7, anim: 'text_bop' },
        { name: 'P-08 定點跳視瞬間對焦 (快速掃視與合像鎖定)', shape: 'text', axis: 'saccade', mode: 'crossover', fill: false, stereo: 0.06, size: 270, dist: 12.0, speed: 15, thick: 7, anim: 'text_saccade' },
        { name: 'P-09 遠近推拉彈性整合 (平滑聚散與調節協調)', shape: 'text', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.08, size: 260, dist: 18.0, speed: 14, thick: 7, anim: 'text_trombone' },
        { name: 'P-10 虛擬翻轉鏡收操 (1.5秒規律對焦收放重置)', shape: 'text', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.04, size: 300, dist: 6.0, speed: 0, thick: 7, anim: 'text_flipper_fast' }
    ]
};
