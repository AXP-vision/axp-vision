// matrix.js - AXP Fusion Dynamics 臨床視覺協同矩陣 (v26.0 - 垂直雙向互調 A+B × 周邊雙軌 × 第7階90秒拮抗肌同步放鬆版)
// 核心臨床架構：
// 1. 垂直稜鏡雙向互調 (左右眼上下交替)：採連續雙階段設計 -> 先跑 A (vert_smooth_alt 超慢速 speed:4 平滑牽引) 再跑 B (vert_step_alt 階梯停留鎖定)
// 2. 周邊視野雙軌整合 (KeyU)：結合 A (center_lock_peripheral 中心十字定錨+廣角餘光捕捉) 與 B (peripheral_pursuit 大範圍追視+周邊抗干擾)
// 3. 第 7 階 90 秒全向拮抗肌同步放鬆 (antagonist_relax)：零垂直視差與微開散休息眼位 (-2.5Δ ~ -3.5Δ BI)，360度對稱離心呼吸擴張，同步卸載六條眼外肌張力
// 4. 去抑制強化：大量部署雙眼互補十字靶 (dichoptic_cross) 與左右紅藍瞬態交換 (swap_flash)

export const PROTOCOL_NAMES = {
    'KeyY': 'Y. 雙眼去抑制與紅藍瞬換鎖定 (Dichoptic Anti-Suppression)',
    'KeyU': 'U. 周邊視野擴張與中心十字定錨 (Peripheral Awareness & Pursuits)',
    'KeyI': 'I. 立體景深融像與 SILO 胖圓球 (Smooth Vergence & SILO)',
    'KeyO': 'O. 階躍跳視與垂直雙向微調 (Saccadic Step & Vertical Alignment)',
    'KeyP': 'P. 對焦收放調節與聚散解綁 (Accommodative-Vergence Uncoupling)'
};

export const AIM_MATRIX = {
    // ========================================================================
    // 🟩 [ Y 鍵 ] 雙眼去抑制與紅藍瞬換鎖定 (含連續兩階垂直雙向破抑制 Y-05 A + Y-06 B)
    // ========================================================================
    'KeyY': [
        { name: 'Y-01 初階破抑制 I (大十字靶紅藍對位與瞬換)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.0, size: 460, dist: 2.0, v_prism: 0, speed: 6, thick: 9, duration: 60, anim: 'balanceDrift,swap_flash' },
        { name: 'Y-02 初階破抑制 II (左框右核紅藍瞬態交換)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.0, size: 420, dist: 4.0, v_prism: 0, speed: 8, thick: 8, duration: 60, anim: 'swap_flash' },
        { name: 'Y-03 初階破抑制 III (立體胖圓球頻閃喚醒)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.01, size: 380, dist: 6.0, v_prism: 0, speed: 10, thick: 8, duration: 60, anim: 'flicker_light' },
        { name: 'Y-04 中階水平共視 (十字靶平滑追蹤與紅藍交換)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 310, dist: 10.0, v_prism: 0, speed: 12, thick: 7, duration: 60, anim: 'slow_cross,swap_flash' },
        { name: 'Y-05 中階垂直雙向破抑制 A (0.6Δ 超慢速左右眼上下互調牽引)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 280, dist: 6.0, v_prism: 0.6, speed: 4, thick: 7, duration: 60, anim: 'vert_smooth_alt,swap_flash' },
        { name: 'Y-06 中階垂直雙向破抑制 B (0.6Δ 左右眼上下階梯停留鎖定)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.03, size: 260, dist: 6.0, v_prism: 0.6, speed: 4, thick: 7, duration: 60, anim: 'vert_step_alt,swap_flash' },
        { name: 'Y-07 🌿 90秒全向拮抗肌同步放鬆 (360度同心圓與胖球離心舒展)', shape: 'sphere5', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: 0.01, size: 380, dist: -2.5, v_prism: 0, speed: 6, thick: 8, duration: 90, anim: 'antagonist_relax' },
        { name: 'Y-08 高階中心窩破抑制 I (小十字靶廣域漫遊紅藍瞬換)', shape: 'dichoptic_cross', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.05, size: 175, dist: 22.0, v_prism: 0, speed: 16, thick: 5, duration: 60, anim: 'roam_smooth,swap_flash_fast' },
        { name: 'Y-09 高階中心窩破抑制 II (微細對位鎖高稜鏡追蹤)', shape: 'dichoptic_lock', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.07, size: 150, dist: 28.0, v_prism: 0, speed: 18, thick: 5, duration: 60, anim: 'roam_smooth,swap_flash_fast' },
        { name: 'Y-10 巔峰中心窩共視 III (精緻十字靶 34Δ 極限防抑制鎖定)', shape: 'dichoptic_cross', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.09, size: 130, dist: 34.0, v_prism: 0, speed: 20, thick: 4, duration: 60, anim: 'roam_smooth,swap_flash_fast' }
    ],

    // ========================================================================
    // 🟦 [ U 鍵 ] 周邊視野擴張與中心十字定錨模組 (完美融合 A 中心定錨餘光尋寶 + B 大範圍追視)
    // ========================================================================
    'KeyU': [
        { name: 'U-01 周邊訓練 A1 (中心十字定錨不動 / 餘光感知 2 顆廣角外圍星)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 350, dist: 3.0, v_prism: 0, speed: 10, thick: 8, duration: 60, anim: 'center_lock_peripheral,swap_flash', distractors: 2 },
        { name: 'U-02 周邊訓練 B1 (立體胖圓球大範圍環狀追視 / 2 顆外圍星)', shape: 'sphere5', axis: 'circular', mode: 'crossover', fill: true, stereo: 0.03, size: 320, dist: 6.0, v_prism: 0, speed: 12, thick: 7, duration: 60, anim: 'peripheral_pursuit', distractors: 2 },
        { name: 'U-03 周邊訓練 A2 (中心對位鎖定錨 / 餘光捕捉 3 顆廣角外圍目標)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.03, size: 300, dist: 8.0, v_prism: 0, speed: 12, thick: 7, duration: 60, anim: 'center_lock_peripheral,swap_flash', distractors: 3 },
        { name: 'U-04 周邊訓練 B2 (莫比烏斯 8 字廣域追視 / 3 顆外圍星抗擾)', shape: 'torusKnot', axis: 'lissajous', mode: 'crossover', fill: false, stereo: 0.04, size: 260, dist: 12.0, v_prism: 0, speed: 15, thick: 6, duration: 60, anim: 'peripheral_pursuit', distractors: 3 },
        { name: 'U-05 周邊訓練 A3 (中型十字靶中心鎖定 / 4 顆廣角星高速環繞)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.05, size: 230, dist: 16.0, v_prism: 0, speed: 16, thick: 6, duration: 60, anim: 'center_lock_peripheral,swap_flash', distractors: 4 },
        { name: 'U-06 周邊訓練 B3 (十字靶大範圍漫遊追視 / 4 顆廣角星抗干擾)', shape: 'dichoptic_cross', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.06, size: 210, dist: 20.0, v_prism: 0, speed: 18, thick: 6, duration: 60, anim: 'roam_smooth,peripheral_pursuit,swap_flash', distractors: 4 },
        { name: 'U-07 🌿 90秒全向拮抗肌同步放鬆 (五層同心圓無干擾全向水波舒展)', shape: 'circle5', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: 0.02, size: 380, dist: -3.0, v_prism: 0, speed: 6, thick: 8, duration: 90, anim: 'antagonist_relax', distractors: 0 },
        { name: 'U-08 高階周邊極限 A4 (小十字靶中心定錨 / 5 顆極廣角餘光挑戰)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.07, size: 170, dist: 24.0, v_prism: 0, speed: 20, thick: 5, duration: 60, anim: 'center_lock_peripheral,swap_flash_fast', distractors: 5 },
        { name: 'U-09 高階周邊極限 B4 (八面晶體廣域 8 字追視 / 5 顆外圍星)', shape: 'crystal8', axis: 'lissajous', mode: 'crossover', fill: true, stereo: 0.09, size: 150, dist: 28.0, v_prism: 0, speed: 20, thick: 5, duration: 60, anim: 'peripheral_pursuit', distractors: 5 },
        { name: 'U-10 巔峰全視場整合 (精緻十字靶動態漫遊與 6 顆廣角星極限鎖定)', shape: 'dichoptic_cross', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.10, size: 135, dist: 32.0, v_prism: 0, speed: 22, thick: 4, duration: 60, anim: 'roam_smooth,peripheral_pursuit,swap_flash_fast', distractors: 6 }
    ],

    // ========================================================================
    // 🟪 [ I 鍵 ] 立體景深融像與 SILO 胖圓球模組 (棱鏡最高推升至 38Δ，第7階90秒拮抗肌放鬆)
    // ========================================================================
    'KeyI': [
        { name: 'I-01 初階融像推拉 I (大十字靶建立聚散基準)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 360, dist: 4.0, v_prism: 0, speed: 12, thick: 8, duration: 60, anim: 'trombone' },
        { name: 'I-02 初階融像推拉 II (五層同心圓溫和擴展)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.03, size: 330, dist: 8.0, v_prism: 0, speed: 14, thick: 7, duration: 60, anim: 'trombone' },
        { name: 'I-03 初階 SILO 建立 (立體網格胖圓球深度推拉)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.04, size: 310, dist: 12.0, v_prism: 0, speed: 16, thick: 7, duration: 60, anim: 'silo_text' },
        { name: 'I-04 中階 SILO 強化 I (實體胖圓球近小遠大感知)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.06, size: 280, dist: 18.0, v_prism: 0, speed: 18, thick: 6, duration: 60, anim: 'silo_text' },
        { name: 'I-05 中階 SILO 強化 II (實體胖圓球 24Δ 深度推拉)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.08, size: 240, dist: 24.0, v_prism: 0, speed: 18, thick: 6, duration: 60, anim: 'silo_text' },
        { name: 'I-06 中階立體擴展 III (雙眼互補十字靶深度融像與瞬換)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.09, size: 210, dist: 28.0, v_prism: 0, speed: 20, thick: 5, duration: 60, anim: 'silo_text,swap_flash' },
        { name: 'I-07 🌿 90秒全向拮抗肌同步放鬆 (大胖圓球微開散 360 度離心呼吸卸載)', shape: 'sphere5', axis: 'horizontal', mode: 'oneway_bi', fill: true, stereo: -0.02, size: 380, dist: -3.5, v_prism: 0, speed: 6, thick: 7, duration: 90, anim: 'antagonist_relax' },
        { name: 'I-08 高階融像衝刺 I (精緻胖圓球 32Δ 強效內聚)', shape: 'sphere5', axis: 'horizontal', mode: 'oneway_bo', fill: true, stereo: 0.11, size: 170, dist: 32.0, v_prism: 0, speed: 20, thick: 5, duration: 60, anim: 'breathing_fractal' },
        { name: 'I-09 高階融像衝刺 II (小十字靶 35Δ 深度鎖定與紅藍瞬換)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.13, size: 145, dist: 35.0, v_prism: 0, speed: 22, thick: 4, duration: 60, anim: 'breathing_fractal,swap_flash' },
        { name: 'I-10 巔峰物理融像極限 (雙層十二面體 38Δ 極限儲備挑戰)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.15, size: 120, dist: 38.0, v_prism: 0, speed: 24, thick: 4, duration: 60, anim: 'breathing_fractal' }
    ],

    // ========================================================================
    // 🟧 [ O 鍵 ] 階躍跳視與垂直雙向微調模組 (配備兩組連續 A+B 垂直雙向互調：O-03/04 與 O-08/09)
    // ========================================================================
    'KeyO': [
        { name: 'O-01 初階階躍合像 I (大十字靶 3秒聚散翻轉)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 350, dist: 5.0, v_prism: 0, speed: 0, thick: 8, duration: 60, anim: 'flipper_slow' },
        { name: 'O-02 初階階躍合像 II (左框右核 1.8秒敏捷切換與紅藍瞬換)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.03, size: 310, dist: 10.0, v_prism: 0, speed: 0, thick: 7, duration: 60, anim: 'flipper_fast,swap_flash' },
        { name: 'O-03 初中階垂直雙向訓練 A (十字靶 0.7Δ 超慢速左右眼上下平滑互調)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.04, size: 280, dist: 6.0, v_prism: 0.7, speed: 4, thick: 7, duration: 60, anim: 'vert_smooth_alt' },
        { name: 'O-04 初中階垂直雙向訓練 B (十字靶 0.8Δ 左右眼上下階梯停留 4 秒鎖定)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.04, size: 260, dist: 6.0, v_prism: 0.8, speed: 4, thick: 7, duration: 60, anim: 'vert_step_alt,swap_flash' },
        { name: 'O-05 中階定點跳視 I (胖圓球雙向急跳合像)', shape: 'sphere5', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.05, size: 230, dist: 14.0, v_prism: 0, speed: 16, thick: 6, duration: 60, anim: 'saccade_vergence' },
        { name: 'O-06 中階定點跳視 II (十字靶廣域跳視與紅藍瞬換)', shape: 'dichoptic_cross', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.06, size: 200, dist: 18.0, v_prism: 0, speed: 18, thick: 6, duration: 60, anim: 'saccade_vergence,swap_flash' },
        { name: 'O-07 🌿 90秒全向拮抗肌同步放鬆 (零垂直壓差同心圓全向水波卸載)', shape: 'circle5', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: 0.02, size: 380, dist: -2.5, v_prism: 0, speed: 6, thick: 8, duration: 90, anim: 'antagonist_relax' },
        { name: 'O-08 高階垂直雙向極限 A (十字靶 1.2Δ 超慢速左右眼上下深度互調)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.07, size: 175, dist: 8.0, v_prism: 1.2, speed: 4, thick: 5, duration: 60, anim: 'vert_smooth_alt,swap_flash' },
        { name: 'O-09 高階垂直雙向極限 B (對位鎖 1.4Δ 左右眼上下階梯停留鎖定)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.08, size: 160, dist: 10.0, v_prism: 1.4, speed: 4, thick: 5, duration: 60, anim: 'vert_step_alt,swap_flash' },
        { name: 'O-10 巔峰三維跳視整合 (小十字靶 26Δ 隨機方位瞬時鎖定)', shape: 'dichoptic_cross', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.10, size: 135, dist: 26.0, v_prism: 0, speed: 20, thick: 4, duration: 60, anim: 'saccade_vergence,swap_flash_fast' }
    ],

    // ========================================================================
    // 🟥 [ P 鍵 ] 對焦收放調節與聚散解綁模組 (清晰字體與十字靶交替解綁，第7階90秒放鬆)
    // ========================================================================
    'KeyP': [
        { name: 'P-01 初階調節喚醒 (清晰大視標雙眼同步對焦)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.02, size: 360, dist: 4.0, v_prism: 0, speed: 12, thick: 8, duration: 60, anim: 'text_bop' },
        { name: 'P-02 初階中心窩破抑制 (大十字靶紅藍瞬換對焦)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'oneway_bo', fill: true, stereo: 0.03, size: 330, dist: 8.0, v_prism: 0, speed: 12, thick: 7, duration: 60, anim: 'swap_flash' },
        { name: 'P-03 初階 BIM 開散解綁 (外展 -4Δ 同時維持字體銳利)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.02, size: 310, dist: -4.0, v_prism: 0, speed: 12, thick: 7, duration: 60, anim: 'text_bim' },
        { name: 'P-04 中階 BOP 內聚解綁 I (內聚 16Δ 保持對焦放鬆)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.05, size: 260, dist: 16.0, v_prism: 0, speed: 14, thick: 7, duration: 60, anim: 'text_bop' },
        { name: 'P-05 中階動態環繞對焦 (圓形軌跡字體鎖定)', shape: 'text', axis: 'circular', mode: 'crossover', fill: false, stereo: 0.06, size: 240, dist: 18.0, v_prism: 0, speed: 15, thick: 6, duration: 60, anim: 'text_trombone' },
        { name: 'P-06 中階 BIM 深層開散 (外展 -9Δ 極限負融像對焦)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.05, size: 220, dist: -9.0, v_prism: 0, speed: 14, thick: 6, duration: 60, anim: 'text_bim' },
        { name: 'P-07 🌿 90秒全向拮抗肌同步放鬆 (立體胖圓球與睫狀肌深層開散卸載)', shape: 'sphere5', axis: 'horizontal', mode: 'oneway_bi', fill: true, stereo: 0.02, size: 380, dist: -3.5, v_prism: 0, speed: 6, thick: 7, duration: 90, anim: 'antagonist_relax' },
        { name: 'P-08 高階定點跳視對焦 (中細字體 24Δ 快速跳躍鎖定)', shape: 'text', axis: 'saccade', mode: 'crossover', fill: false, stereo: 0.08, size: 195, dist: 24.0, v_prism: 0, speed: 16, thick: 6, duration: 60, anim: 'text_saccade' },
        { name: 'P-09 高階 BOP 十字極限解綁 (30Δ 強內聚與小十字靶紅藍瞬換)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'oneway_bo', fill: true, stereo: 0.10, size: 160, dist: 30.0, v_prism: 0, speed: 16, thick: 5, duration: 60, anim: 'swap_flash_fast' },
        { name: 'P-10 巔峰虛擬翻轉鏡挑戰 (精緻字體 34Δ 階躍收放)', shape: 'text', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.12, size: 175, dist: 34.0, v_prism: 0, speed: 0, thick: 5, duration: 60, anim: 'text_flipper_fast' }
    ]
};
