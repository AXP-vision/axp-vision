// ============================================================================
// 👑 FANTASTIC VISION LAB: AXP Vision 雙眼視覺協調矩陣 (matrix.js - V28.0 Standard Release)
// 🕒 最後優化日期與時間 (Last Optimized Timestamp)：2026-10-20 18:01 CST
// 核心戰略與帝國憲法升級：
// 1. 100% 正統雙眼視覺學名正名化：拔除全檔 22 處「定錨・解綁・瞬換・破抑制・胖圓球」等造詞與 5 處彩色 Emoji，全面採用正統視光學名（雙眼同時視・黃斑部中心固視・紅藍分視交替・立體球體視標・相對聚散協調）。
// 2. 策略 A（Standard 公開版安全舒適包絡線）：將公開體驗版之水平稜鏡負荷平滑收斂於 -6.0Δ (BI) ~ 18.0Δ (BO) 安全舒適範圍，垂直雙向微調收斂於 0.4Δ ~ 0.8Δ，消除居家無指導操作之複視頭暈風險，並將 22Δ~35Δ 極限儲備保留予 AXP Vision Pro 旗艦版。
// 3. 完整保留高視認性粗線條 (thick: 8.0 ~ 10.0) 與慢相適應時長 (一般階 60 秒 / 第 7 階舒緩站 90 秒)，並與官網 V2.3 及本機戰情室 V5.0 之模組分類 100% 無縫同步。
// ============================================================================

export const PROTOCOL_NAMES = {
    'KeyY': 'Y. 雙眼同時視與分視平衡 (Dichoptic Anti-Suppression)',
    'KeyU': 'U. 中心固視與周邊視野整合 (Central Fixation & Peripheral M-Pathway)',
    'KeyI': 'I. 平面融像儲備與 SILO 立體視 (BI/BO Fusional Vergence & SILO)',
    'KeyO': 'O. 精準跳視控制與垂直融像對齊 (Saccadic & Vertical Vergence)',
    'KeyP': 'P. 調節靈敏度與相對聚散協調 (Accommodative Facility & AC/A Synergy)'
};

export const AIM_MATRIX = {
    // ========================================================================
    // [ Y 鍵 ] 雙眼同時視與分視平衡 (Worth Grade I: Dichoptic Anti-Suppression)
    // Standard 公開版安全區間：水平 2.0Δ ~ 18.0Δ ｜ 垂直 0.4Δ ~ 0.5Δ
    // ========================================================================
    'KeyY': [
        { name: 'Y-01 初階同時視 I (十字視標紅藍分視對位與交替)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.0, size: 460, dist: 2.0, v_prism: 0, speed: 6, thick: 10, duration: 60, anim: 'balanceDrift,swap_flash' },
        { name: 'Y-02 初階同時視 II (外框與中心核紅藍分視交替)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.0, size: 420, dist: 3.5, v_prism: 0, speed: 8, thick: 9.5, duration: 60, anim: 'swap_flash' },
        { name: 'Y-03 初階同時視 III (立體球體視標頻閃感知喚醒)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.01, size: 390, dist: 5.0, v_prism: 0, speed: 10, thick: 9, duration: 60, anim: 'flicker_light' },
        { name: 'Y-04 中階水平同時視 (厚環十字視標平滑追蹤與紅藍交替)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 350, dist: 8.0, v_prism: 0, speed: 11, thick: 9, duration: 60, anim: 'slow_cross,swap_flash' },
        { name: 'Y-05 中階垂直雙向同時視 A (0.4Δ 慢速左右眼上下互調牽引)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 330, dist: 6.0, v_prism: 0.4, speed: 4, thick: 8.5, duration: 60, anim: 'vert_smooth_alt,swap_flash' },
        { name: 'Y-06 中階垂直雙向同時視 B (0.5Δ 左右眼上下階梯停留對齊)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.03, size: 310, dist: 6.0, v_prism: 0.5, speed: 4, thick: 8.5, duration: 60, anim: 'vert_step_alt,swap_flash' },
        { name: 'Y-07 [舒緩站] 90 秒全向眼外肌同步放鬆 (360 度同心圓與球體離心舒展)', shape: 'sphere5', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: 0.01, size: 380, dist: -2.5, v_prism: 0, speed: 6, thick: 8.5, duration: 90, anim: 'antagonist_relax' },
        { name: 'Y-08 進階黃斑部同時視 I (十字視標 12Δ 廣域漫遊與紅藍交替)', shape: 'dichoptic_cross', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.04, size: 280, dist: 12.0, v_prism: 0, speed: 13, thick: 8.5, duration: 60, anim: 'roam_smooth,swap_flash' },
        { name: 'Y-09 進階黃斑部同時視 II (分視對位視標 15Δ 穩定追蹤)', shape: 'dichoptic_lock', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.05, size: 260, dist: 15.0, v_prism: 0, speed: 14, thick: 8, duration: 60, anim: 'roam_smooth,swap_flash' },
        { name: 'Y-10 公開版雙眼分視整合 (厚十字視標 18Δ 穩定同時視維持)', shape: 'dichoptic_cross', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.06, size: 240, dist: 18.0, v_prism: 0, speed: 15, thick: 8, duration: 60, anim: 'roam_smooth,swap_flash_fast' }
    ],

    // ========================================================================
    // [ U 鍵 ] 中心固視與周邊視野整合 (Central Fixation & Peripheral M-Pathway)
    // Standard 公開版安全區間：水平 3.0Δ ~ 18.0Δ ｜ 周邊光點 2 ~ 5 顆
    // ========================================================================
    'KeyU': [
        { name: 'U-01 周邊視野整合 A1 (黃斑部中心十字固視 ／ 餘光覺察 2 顆周邊視標)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 360, dist: 3.0, v_prism: 0, speed: 10, thick: 9.5, duration: 60, anim: 'center_lock_peripheral,swap_flash', distractors: 2 },
        { name: 'U-02 周邊視野整合 B1 (立體球體視標環狀追視 ／ 2 顆周邊視標)', shape: 'sphere5', axis: 'circular', mode: 'crossover', fill: true, stereo: 0.03, size: 330, dist: 5.0, v_prism: 0, speed: 11, thick: 8.5, duration: 60, anim: 'peripheral_pursuit', distractors: 2 },
        { name: 'U-03 周邊視野整合 A2 (中心分視框固視穩定 ／ 餘光覺察 3 顆周邊視標)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.03, size: 310, dist: 7.0, v_prism: 0, speed: 12, thick: 9, duration: 60, anim: 'center_lock_peripheral,swap_flash', distractors: 3 },
        { name: 'U-04 周邊視野整合 B2 (雙環 8 字軌跡平滑追視 ／ 3 顆周邊視標協同)', shape: 'torusKnot', axis: 'lissajous', mode: 'crossover', fill: false, stereo: 0.04, size: 290, dist: 9.0, v_prism: 0, speed: 13, thick: 8, duration: 60, anim: 'peripheral_pursuit', distractors: 3 },
        { name: 'U-05 周邊視野整合 A3 (厚十字中心固視維持 ／ 4 顆廣角視標環繞)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.04, size: 275, dist: 11.0, v_prism: 0, speed: 14, thick: 8.5, duration: 60, anim: 'center_lock_peripheral,swap_flash', distractors: 4 },
        { name: 'U-06 周邊視野整合 B3 (十字視標大範圍平滑追視 ／ 4 顆廣角視標協同)', shape: 'dichoptic_cross', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.05, size: 260, dist: 13.0, v_prism: 0, speed: 14, thick: 8, duration: 60, anim: 'roam_smooth,peripheral_pursuit,swap_flash', distractors: 4 },
        { name: 'U-07 [舒緩站] 90 秒全向眼外肌同步放鬆 (五層同心圓無干擾全向水波舒展)', shape: 'circle5', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: 0.02, size: 380, dist: -3.0, v_prism: 0, speed: 6, thick: 8.5, duration: 90, anim: 'antagonist_relax', distractors: 0 },
        { name: 'U-08 進階中心周邊協同 A4 (十字中心固視 ／ 5 顆廣角餘光覺察)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.06, size: 250, dist: 15.0, v_prism: 0, speed: 15, thick: 8, duration: 60, anim: 'center_lock_peripheral,swap_flash', distractors: 5 },
        { name: 'U-09 進階中心周邊協同 B4 (立體多面晶體 8 字追視 ／ 5 顆周邊視標)', shape: 'crystal8', axis: 'lissajous', mode: 'crossover', fill: true, stereo: 0.07, size: 240, dist: 16.5, v_prism: 0, speed: 16, thick: 8, duration: 60, anim: 'peripheral_pursuit', distractors: 5 },
        { name: 'U-10 公開版全視場空間整合 (十字視標動態追視與 5 顆廣角視標穩定維持)', shape: 'dichoptic_cross', axis: 'roam', mode: 'crossover', fill: true, stereo: 0.08, size: 230, dist: 18.0, v_prism: 0, speed: 16, thick: 8, duration: 60, anim: 'roam_smooth,peripheral_pursuit,swap_flash', distractors: 5 }
    ],

    // ========================================================================
    // [ I 鍵 ] 平面融像儲備與 SILO 立體視 (BI/BO Fusional Vergence & SILO)
    // Standard 公開版安全區間：水平 -3.5Δ (BI) ~ 20.0Δ (BO)
    // ========================================================================
    'KeyI': [
        { name: 'I-01 初階融像緩衝 I (大十字視標建立聚散融像基準)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 370, dist: 4.0, v_prism: 0, speed: 11, thick: 9.5, duration: 60, anim: 'trombone' },
        { name: 'I-02 初階融像緩衝 II (五層同心圓視標溫和聚散擴展)', shape: 'circle5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.03, size: 340, dist: 6.5, v_prism: 0, speed: 12, thick: 9, duration: 60, anim: 'trombone' },
        { name: 'I-03 初階 SILO 立體感知 (立體網格球體視標前後景深推拉)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.04, size: 320, dist: 9.0, v_prism: 0, speed: 13, thick: 8.5, duration: 60, anim: 'silo_text' },
        { name: 'I-04 中階 SILO 景深協調 I (立體球體視標近小遠大空間感知)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.05, size: 300, dist: 11.5, v_prism: 0, speed: 14, thick: 8, duration: 60, anim: 'silo_text' },
        { name: 'I-05 中階 SILO 景深協調 II (立體球體視標 14Δ 平滑景深推拉)', shape: 'sphere5', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.06, size: 285, dist: 14.0, v_prism: 0, speed: 15, thick: 8, duration: 60, anim: 'silo_text' },
        { name: 'I-06 中階立體融像擴展 III (雙眼分視十字視標 16Δ 融像與紅藍交替)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.07, size: 270, dist: 16.0, v_prism: 0, speed: 15, thick: 8, duration: 60, anim: 'silo_text,swap_flash' },
        { name: 'I-07 [舒緩站] 90 秒全向眼外肌同步放鬆 (立體球體微開散 360 度離心呼吸放鬆)', shape: 'sphere5', axis: 'horizontal', mode: 'oneway_bi', fill: true, stereo: -0.02, size: 380, dist: -3.5, v_prism: 0, speed: 6, thick: 8.5, duration: 90, anim: 'antagonist_relax' },
        { name: 'I-08 進階融像儲備穩定 I (立體球體視標 17Δ 正融像內聚緩衝)', shape: 'sphere5', axis: 'horizontal', mode: 'oneway_bo', fill: true, stereo: 0.08, size: 255, dist: 17.0, v_prism: 0, speed: 16, thick: 8, duration: 60, anim: 'breathing_fractal' },
        { name: 'I-09 進階融像儲備穩定 II (厚環十字視標 18.5Δ 融像維持與紅藍交替)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.09, size: 245, dist: 18.5, v_prism: 0, speed: 16, thick: 8, duration: 60, anim: 'breathing_fractal,swap_flash' },
        { name: 'I-10 公開版立體融像儲備整合 (雙層十二面體 20Δ 立體景深穩定維持)', shape: 'nested_dodeca', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.10, size: 235, dist: 20.0, v_prism: 0, speed: 16, thick: 8, duration: 60, anim: 'breathing_fractal' }
    ],

    // ========================================================================
    // [ O 鍵 ] 精準跳視控制與垂直融像對齊 (Saccadic & Vertical Vergence)
    // Standard 公開版安全區間：水平 4.0Δ ~ 16.0Δ ｜ 垂直 0.4Δ ~ 0.8Δ
    // ========================================================================
    'KeyO': [
        { name: 'O-01 初階階躍融像 I (大十字視標 3 秒平滑聚散切換)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.02, size: 360, dist: 4.0, v_prism: 0, speed: 0, thick: 9.5, duration: 60, anim: 'flipper_slow' },
        { name: 'O-02 初階階躍融像 II (外框中心核 1.8 秒聚散切換與紅藍交替)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.03, size: 330, dist: 7.0, v_prism: 0, speed: 0, thick: 9, duration: 60, anim: 'flipper_fast,swap_flash' },
        { name: 'O-03 初中階垂直融像對齊 A (厚十字視標 0.4Δ 慢速左右眼上下平滑互調)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.03, size: 310, dist: 5.0, v_prism: 0.4, speed: 4, thick: 9, duration: 60, anim: 'vert_smooth_alt' },
        { name: 'O-04 初中階垂直融像對齊 B (厚十字視標 0.5Δ 左右眼上下階梯停留對齊)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.04, size: 295, dist: 5.0, v_prism: 0.5, speed: 4, thick: 9, duration: 60, anim: 'vert_step_alt,swap_flash' },
        { name: 'O-05 中階定點跳視控制 I (立體球體視標雙向定點跳視合像)', shape: 'sphere5', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.04, size: 280, dist: 10.0, v_prism: 0, speed: 13, thick: 8.5, duration: 60, anim: 'saccade_vergence' },
        { name: 'O-06 中階定點跳視控制 II (厚十字視標廣域定點跳視與紅藍交替)', shape: 'dichoptic_cross', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.05, size: 265, dist: 12.0, v_prism: 0, speed: 14, thick: 8, duration: 60, anim: 'saccade_vergence,swap_flash' },
        { name: 'O-07 [舒緩站] 90 秒全向眼外肌同步放鬆 (零垂直壓差同心圓全向水波放鬆)', shape: 'circle5', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: 0.02, size: 380, dist: -2.5, v_prism: 0, speed: 6, thick: 8.5, duration: 90, anim: 'antagonist_relax' },
        { name: 'O-08 進階垂直水平融像協調 A (厚十字視標 0.7Δ 慢速左右眼上下互調)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.06, size: 255, dist: 7.0, v_prism: 0.7, speed: 4, thick: 8, duration: 60, anim: 'vert_smooth_alt,swap_flash' },
        { name: 'O-09 進階垂直水平融像協調 B (分視對位視標 0.8Δ 上下階梯停留對齊)', shape: 'dichoptic_lock', axis: 'horizontal', mode: 'crossover', fill: true, stereo: 0.06, size: 245, dist: 8.0, v_prism: 0.8, speed: 4, thick: 8, duration: 60, anim: 'vert_step_alt,swap_flash' },
        { name: 'O-10 公開版三維跳視與融像整合 (厚十字視標 16Δ 定點跳視合像維持)', shape: 'dichoptic_cross', axis: 'saccade', mode: 'crossover', fill: true, stereo: 0.07, size: 235, dist: 16.0, v_prism: 0, speed: 15, thick: 8, duration: 60, anim: 'saccade_vergence,swap_flash' }
    ],

    // ========================================================================
    // [ P 鍵 ] 調節靈敏度與相對聚散協調 (Accommodative Facility & AC/A Synergy)
    // Standard 公開版安全區間：外展 -6.0Δ (BIM) ~ 內聚 18.0Δ (BOP)
    // ========================================================================
    'KeyP': [
        { name: 'P-01 初階調節靈敏度 I (清晰大字視標雙眼同步對焦與融像)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.02, size: 360, dist: 3.5, v_prism: 0, speed: 11, thick: 9, duration: 60, anim: 'text_bop' },
        { name: 'P-02 初階同時視對焦協調 (大十字視標紅藍分視交替與清晰對焦)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'oneway_bo', fill: true, stereo: 0.03, size: 340, dist: 6.5, v_prism: 0, speed: 11, thick: 9, duration: 60, anim: 'swap_flash' },
        { name: 'P-03 初階 BIM 負融像相對調節 (外展 -3.5Δ 同時維持字體清晰對焦)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.02, size: 320, dist: -3.5, v_prism: 0, speed: 11, thick: 8.5, duration: 60, anim: 'text_bim' },
        { name: 'P-04 中階 BOP 正融像相對調節 (內聚 10Δ 維持對焦放鬆與清晰度)', shape: 'text', axis: 'horizontal', mode: 'oneway_bo', fill: false, stereo: 0.04, size: 295, dist: 10.0, v_prism: 0, speed: 13, thick: 8, duration: 60, anim: 'text_bop' },
        { name: 'P-05 中階動態環繞調節協調 (圓形軌跡字體視標連續對焦維持)', shape: 'text', axis: 'circular', mode: 'crossover', fill: false, stereo: 0.05, size: 280, dist: 12.0, v_prism: 0, speed: 14, thick: 8, duration: 60, anim: 'text_trombone' },
        { name: 'P-06 中階 BIM 開散調節彈性 (外展 -6.0Δ 負融像與對焦鬆弛協調)', shape: 'text', axis: 'horizontal', mode: 'oneway_bi', fill: false, stereo: -0.04, size: 265, dist: -6.0, v_prism: 0, speed: 13, thick: 8, duration: 60, anim: 'text_bim' },
        { name: 'P-07 [舒緩站] 90 秒全向眼外肌同步放鬆 (立體球體與睫狀肌開散放鬆)', shape: 'sphere5', axis: 'horizontal', mode: 'oneway_bi', fill: true, stereo: 0.02, size: 380, dist: -3.5, v_prism: 0, speed: 6, thick: 8.5, duration: 90, anim: 'antagonist_relax' },
        { name: 'P-08 進階定點跳視對焦協調 (清晰字體視標 14Δ 定點跳視對焦)', shape: 'text', axis: 'saccade', mode: 'crossover', fill: false, stereo: 0.06, size: 255, dist: 14.0, v_prism: 0, speed: 14, thick: 8, duration: 60, anim: 'text_saccade' },
        { name: 'P-09 進階 BOP 相對聚散協調 (16Δ 內聚緩衝與厚十字紅藍分視交替)', shape: 'dichoptic_cross', axis: 'horizontal', mode: 'oneway_bo', fill: true, stereo: 0.07, size: 245, dist: 16.0, v_prism: 0, speed: 15, thick: 8, duration: 60, anim: 'swap_flash' },
        { name: 'P-10 公開版調節與聚散收放整合 (清晰字體視標 18Δ 階躍對焦協調)', shape: 'text', axis: 'horizontal', mode: 'crossover', fill: false, stereo: 0.08, size: 235, dist: 18.0, v_prism: 0, speed: 0, thick: 8, duration: 60, anim: 'text_flipper_fast' }
    ]
};
