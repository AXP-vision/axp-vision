// matrix.js - AXP Fusion Dynamics 臨床視覺協同矩陣 (v27.0 - 粗線條強效融像鎖 × 嚴格 60s/90s 慢相神經適應版)
// 核心升級：
// 1. 徹底解決高稜鏡度下因線條過細無法融像之問題：全矩陣線條粗細 (thick) 提升至 7.5 ~ 10.0，高階尺寸維持於 200px ~ 250px 最佳捕捉區
// 2. 嚴格鎖定慢相融像適應時間：一般階段固定 60 秒 (duration: 60)，第 7 階全向拮抗肌放鬆站固定 90 秒 (duration: 90)
// 3. 垂直雙向互調 (左右眼上下交替)：採 A (vert_smooth_alt 14秒超慢速牽引) + B (vert_step_alt 4秒階梯停留鎖定) 連續雙階段配置

export const PROTOCOL_NAMES = {
    'KeyY': 'Y. 雙眼去抑制與紅藍瞬換鎖定 (Dichoptic Anti-Suppression)',
    'KeyU': 'U. 周邊視野擴張與中心十字定錨 (Peripheral Awareness & Pursuits)',
    'KeyI': 'I. 立體景深融像與 SILO 胖圓球 (Smooth Vergence & SILO)',
    'KeyO': 'O. 階躍跳視與垂直雙向微調 (Saccadic Step & Vertical Alignment)',
    'KeyP': 'P. 對焦收放調節與聚散解綁 (Accommodative-Vergence Uncoupling)'
};

export const AIM_MATRIX = {
    // ========================================================================
    // 🟩 [ Y 鍵 ] 雙眼去抑制與紅藍瞬換鎖定 (加粗十字靶與厚實外環，高稜鏡下穩固合像)
    // ========================================================================
    'KeyY': [
        { name: 'Y-01 初階破抑制 I (大十字靶紅藍對位與瞬換)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.0, size: 460, dist: 2.0, v_prism: 0, speed: 6, thick: 10, duration: 60, anim: 'balanceDrift,swap_flash' },
        { name: 'Y-02 初階破抑制 II (左框右核紅藍瞬態交換)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.0, size: 420, dist: 4.0, v_prism: 0, speed: 8, thick: 9.5, duration: 60, anim: 'swap_flash' },
        { name: 'Y-03 初階破抑制 III (立體胖圓球頻閃喚醒)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.01, size: 390, dist: 6.0, v_prism: 0, speed: 10, thick: 9, duration: 60, anim: 'flicker_light' },
        { name: 'Y-04 中階水平共視 (厚環十字靶平滑追蹤與紅藍交換)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 340, dist: 10.0, v_prism: 0, speed: 12, thick: 9, duration: 60, anim: 'slow_cross,swap_flash' },
        { name: 'Y-05 中階垂直雙向破抑制 A (0.6Δ 超慢速左右眼上下互調牽引)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 320, dist: 6.0, v_prism: 0.6, speed: 4, thick: 8.5, duration: 60, anim: 'vert_smooth_alt,swap_flash' },
        { name: 'Y-06 中階垂直雙向破抑制 B (0.6Δ 左右眼上下階梯停留鎖定)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.03, size: 300, dist: 6.0, v_prism: 0.6, speed: 4, thick: 8.5, duration: 60, anim: 'vert_step_alt,swap_flash' },
        { name: 'Y-07 🌿 90秒全向拮抗肌同步放鬆 (360度同心圓與胖球離心舒展)', shape: 'sphere5', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: 0.01, size: 380, dist: -2.5, v_prism: 0, speed: 6, thick: 8.5, duration: 90, anim: 'antagonist_relax' },
        { name: 'Y-08 高階中心窩破抑制 I (厚十字靶 18Δ 廣域漫遊紅藍瞬換)', shape: 'dichoptic_cross', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.05, size: 260, dist: 18.0, v_prism: 0, speed: 15, thick: 8, duration: 60, anim: 'roam_smooth,swap_flash_fast' },
        { name: 'Y-09 高階中心窩破抑制 II (對位鎖 24Δ 高稜鏡穩定追蹤)', shape: 'dichoptic_lock', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.07, size: 235, dist: 24.0, v_prism: 0, speed: 16, thick: 8, duration: 60, anim: 'roam_smooth,swap_flash_fast' },
        { name: 'Y-10 巔峰中心窩共視 III (強效十字靶 28Δ 極限防抑制鎖定)', shape: 'dichoptic_cross', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.09, size: 215, dist: 28.0, v_prism: 0, speed: 18, thick: 7.5, duration: 60, anim: 'roam_smooth,swap_flash_fast' }
    ],

    // ========================================================================
    // 🟦 [ U 鍵 ] 周邊視野擴張與中心十字定錨模組 (A 中心定錨餘光尋寶 + B 大範圍追視)
    // ========================================================================
    'KeyU': [
        { name: 'U-01 周邊訓練 A1 (中心十字定錨不動 / 餘光感知 2 顆廣角外圍星)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 360, dist: 3.0, v_prism: 0, speed: 10, thick: 9.5, duration: 60, anim: 'center_lock_peripheral,swap_flash', distractors: 2 },
        { name: 'U-02 周邊訓練 B1 (立體胖圓球大範圍環狀追視 / 2 顆外圍星)', shape: 'sphere5', axis: 'circular', mode: 'crossover', fill: true, stereo: 0.03, size: 330, dist: 6.0, v_prism: 0, speed: 12, thick: 8.5, duration: 60, anim: 'peripheral_pursuit', distractors: 2 },
        { name: 'U-03 周邊訓練 A2 (中心對位鎖定錨 / 餘光捕捉 3 顆廣角外圍目標)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.03, size: 310, dist: 8.0, v_prism: 0, speed: 12, thick: 9, duration: 60, anim: 'center_lock_peripheral,swap_flash', distractors: 3 },
        { name: 'U-04 周邊訓練 B2 (莫比烏斯 8 字廣域追視 / 3 顆外圍星抗擾)', shape: 'torusKnot', axis: 'lissajous', mode: 'crossover', fill: false, stereo: 0.04, size: 290, dist: 12.0, v_prism: 0, speed: 14, thick: 8, duration: 60, anim: 'peripheral_pursuit', distractors: 3 },
        { name: 'U-05 周邊訓練 A3 (厚十字靶中心鎖定 / 4 顆廣角星環繞)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.05, size: 270, dist: 15.0, v_prism: 0, speed: 15, thick: 8.5, duration: 60, anim: 'center_lock_peripheral,swap_flash', distractors: 4 },
        { name: 'U-06 周邊訓練 B3 (十字靶大範圍漫遊追視 / 4 顆廣角星抗干擾)', shape: 'dichoptic_cross', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.06, size: 250, dist: 18.0, v_prism: 0, speed: 16, thick: 8, duration: 60, anim: 'roam_smooth,peripheral_pursuit,swap_flash', distractors: 4 },
        { name: 'U-07 🌿 90秒全向拮抗肌同步放鬆 (五層同心圓無干擾全向水波舒展)', shape: 'circle5', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: 0.02, size: 380, dist: -3.0, v_prism: 0, speed: 6, thick: 8.5, duration: 90, anim: 'antagonist_relax', distractors: 0 },
        { name: 'U-08 高階周邊極限 A4 (十字靶中心定錨 / 5 顆極廣角餘光挑戰)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.07, size: 235, dist: 22.0, v_prism: 0, speed: 18, thick: 8, duration: 60, anim: 'center_lock_peripheral,swap_flash_fast', distractors: 5 },
        { name: 'U-09 高階周邊極限 B4 (八面晶體廣域 8 字追視 / 5 顆外圍星)', shape: 'crystal8', axis: 'lissajous', mode: 'crossover', fill: true, stereo: 0.09, size: 220, dist: 25.0, v_prism: 0, speed: 18, thick: 7.5, duration: 60, anim: 'peripheral_pursuit', distractors: 5 },
        { name: 'U-10 巔峰全視場整合 (強效十字靶動態漫遊與 6 顆廣角星極限鎖定)', shape: 'dichoptic_cross', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.10, size: 205, dist: 28.0, v_prism: 0, speed: 20, thick: 7.5, duration: 60, anim: 'roam_smooth,peripheral_pursuit,swap_flash_fast', distractors: 6 }
    ],

    // ========================================================================
    // 🟪 [ I 鍵 ] 立體景深融像與 SILO 胖圓球模組 (厚實外環與立體胖圓球，高稜鏡穩固牽引)
    // ========================================================================
    'KeyI': [
        { name: 'I-01 初階融像推拉 I (大十字靶建立聚散基準)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 370, dist: 4.0, v_prism: 0, speed: 12, thick: 9.5, duration: 60, anim: 'trombone' },
        { name: 'I-02 初階融像推拉 II (五層厚實同心圓溫和擴展)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.03, size: 340, dist: 8.0, v_prism: 0, speed: 14, thick: 9, duration: 60, anim: 'trombone' },
        { name: 'I-03 初階 SILO 建立 (立體網格胖圓球深度推拉)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.04, size: 320, dist: 12.0, v_prism: 0, speed: 15, thick: 8.5, duration: 60, anim: 'silo_text' },
        { name: 'I-04 中階 SILO 強化 I (實體胖圓球近小遠大感知)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.06, size: 300, dist: 16.0, v_prism: 0, speed: 16, thick: 8, duration: 60, anim: 'silo_text' },
        { name: 'I-05 中階 SILO 強化 II (實體胖圓球 22Δ 深度推拉)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.08, size: 280, dist: 22.0, v_prism: 0, speed: 18, thick: 8, duration: 60, anim: 'silo_text' },
        { name: 'I-06 中階立體擴展 III (雙眼互補十字靶 26Δ 深度融像與瞬換)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.09, size: 260, dist: 26.0, v_prism: 0, speed: 18, thick: 8, duration: 60, anim: 'silo_text,swap_flash' },
        { name: 'I-07 🌿 90秒全向拮抗肌同步放鬆 (大胖圓球微開散 360 度離心呼吸卸載)', shape: 'sphere5', axis: 'horizontal', mode: 'oneway_bi', fill: true, stereo: -0.02, size: 380, dist: -3.5, v_prism: 0, speed: 6, thick: 8.5, duration: 90, anim: 'antagonist_relax' },
        { name: 'I-08 高階融像衝刺 I (實體胖圓球 30Δ 強效內聚)', shape: 'sphere5', axis: 'horizontal', mode: 'oneway_bo', fill: true, stereo: 0.11, size: 245, dist: 30.0, v_prism: 0, speed: 18, thick: 7.5, duration: 60, anim: 'breathing_fractal' },
        { name: 'I-09 高階融像衝刺 II (厚環十字靶 32Δ 深度鎖定與紅藍瞬換)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.13, size: 230, dist: 32.0, v_prism: 0, speed: 20, thick: 7.5, duration: 60, anim: 'breathing_fractal,swap_flash' },
        { name: 'I-10 巔峰物理融像極限 (雙層十二面體 35Δ 極限儲備挑戰)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.15, size: 215, dist: 35.0, v_prism: 0, speed: 20, thick: 7.5, duration: 60, anim: 'breathing_fractal' }
    ],

    // ========================================================================
    // 🟧 [ O 鍵 ] 階躍跳視與垂直雙向微調模組 (配備兩組連續 A+B 垂直雙向互調：O-03/04 與 O-08/09)
    // ========================================================================
    'KeyO': [
        { name: 'O-01 初階階躍合像 I (大十字靶 3秒聚散翻轉)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 360, dist: 5.0, v_prism: 0, speed: 0, thick: 9.5, duration: 60, anim: 'flipper_slow' },
        { name: 'O-02 初階階躍合像 II (左框右核 1.8秒敏捷切換與紅藍瞬換)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.03, size: 330, dist: 10.0, v_prism: 0, speed: 0, thick: 9, duration: 60, anim: 'flipper_fast,swap_flash' },
        { name: 'O-03 初中階垂直雙向訓練 A (厚十字靶 0.7Δ 超慢速左右眼上下平滑互調)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.04, size: 310, dist: 6.0, v_prism: 0.7, speed: 4, thick: 9, duration: 60, anim: 'vert_smooth_alt' },
        { name: 'O-04 初中階垂直雙向訓練 B (厚十字靶 0.8Δ 左右眼上下階梯停留 4 秒鎖定)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.04, size: 295, dist: 6.0, v_prism: 0.8, speed: 4, thick: 9, duration: 60, anim: 'vert_step_alt,swap_flash' },
        { name: 'O-05 中階定點跳視 I (胖圓球雙向急跳合像)', shape: 'sphere5', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.05, size: 275, dist: 14.0, v_prism: 0, speed: 15, thick: 8, duration: 60, anim: 'saccade_vergence' },
        { name: 'O-06 中階定點跳視 II (厚十字靶廣域跳視與紅藍瞬換)', shape: 'dichoptic_cross', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.06, size: 255, dist: 18.0, v_prism: 0, speed: 16, thick: 8, duration: 60, anim: 'saccade_vergence,swap_flash' },
        { name: 'O-07 🌿 90秒全向拮抗肌同步放鬆 (零垂直壓差同心圓全向水波卸載)', shape: 'circle5', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: 0.02, size: 380, dist: -2.5, v_prism: 0, speed: 6, thick: 8.5, duration: 90, anim: 'antagonist_relax' },
        { name: 'O-08 高階垂直雙向極限 A (厚十字靶 1.2Δ 超慢速左右眼上下深度互調)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.07, size: 250, dist: 8.0, v_prism: 1.2, speed: 4, thick: 8, duration: 60, anim: 'vert_smooth_alt,swap_flash' },
        { name: 'O-09 高階垂直雙向極限 B (對位鎖 1.4Δ 左右眼上下階梯停留鎖定)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.08, size: 235, dist: 10.0, v_prism: 1.4, speed: 4, thick: 8, duration: 60, anim: 'vert_step_alt,swap_flash' },
        { name: 'O-10 巔峰三維跳視整合 (厚十字靶 24Δ 隨機方位瞬時鎖定)', shape: 'dichoptic_cross', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.10, size: 220, dist: 24.0, v_prism: 0, speed: 18, thick: 7.5, duration: 60, anim: 'saccade_vergence,swap_flash_fast' }
    ],

    // ========================================================================
    // 🟥 [ P 鍵 ] 對焦收放調節與聚散解綁模組 (清晰大字體與加粗十字靶交替解綁)
    // ========================================================================
    'KeyP': [
        { name: 'P-01 初階調節喚醒 (清晰大視標雙眼同步對焦)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.02, size: 360, dist: 4.0, v_prism: 0, speed: 12, thick: 9, duration: 60, anim: 'text_bop' },
        { name: 'P-02 初階中心窩破抑制 (大十字靶紅藍瞬換對焦)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'oneway_bo', fill: true, stereo: 0.03, size: 340, dist: 8.0, v_prism: 0, speed: 12, thick: 9, duration: 60, anim: 'swap_flash' },
        { name: 'P-03 初階 BIM 開散解綁 (外展 -4Δ 同時維持字體銳利)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.02, size: 320, dist: -4.0, v_prism: 0, speed: 12, thick: 8.5, duration: 60, anim: 'text_bim' },
        { name: 'P-04 中階 BOP 內聚解綁 I (內聚 14Δ 保持對焦放鬆)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.05, size: 290, dist: 14.0, v_prism: 0, speed: 14, thick: 8, duration: 60, anim: 'text_bop' },
        { name: 'P-05 中階動態環繞對焦 (圓形軌跡字體鎖定)', shape: 'text', axis: 'circular', mode: 'crossover', fill: false, stereo: 0.06, size: 275, dist: 16.0, v_prism: 0, speed: 15, thick: 8, duration: 60, anim: 'text_trombone' },
        { name: 'P-06 中階 BIM 深層開散 (外展 -8Δ 負融像對焦彈性)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.05, size: 260, dist: -8.0, v_prism: 0, speed: 14, thick: 8, duration: 60, anim: 'text_bim' },
        { name: 'P-07 🌿 90秒全向拮抗肌同步放鬆 (立體胖圓球與睫狀肌深層開散卸載)', shape: 'sphere5', axis: 'horizontal', mode: 'oneway_bi', fill: true, stereo: 0.02, size: 380, dist: -3.5, v_prism: 0, speed: 6, thick: 8.5, duration: 90, anim: 'antagonist_relax' },
        { name: 'P-08 高階定點跳視對焦 (清晰字體 22Δ 快速跳躍鎖定)', shape: 'text', axis: 'saccade', mode: 'crossover', fill: false, stereo: 0.08, size: 250, dist: 22.0, v_prism: 0, speed: 16, thick: 7.5, duration: 60, anim: 'text_saccade' },
        { name: 'P-09 高階 BOP 十字極限解綁 (26Δ 強內聚與厚十字靶紅藍瞬換)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'oneway_bo', fill: true, stereo: 0.10, size: 235, dist: 26.0, v_prism: 0, speed: 16, thick: 8, duration: 60, anim: 'swap_flash_fast' },
        { name: 'P-10 巔峰虛擬翻轉鏡挑戰 (清晰字體 28Δ 階躍收放)', shape: 'text', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.12, size: 230, dist: 28.0, v_prism: 0, speed: 0, thick: 7.5, duration: 60, anim: 'text_flipper_fast' }
    ]
};
