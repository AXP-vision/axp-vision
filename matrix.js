// matrix.js - AXP Fusion Dynamics: 50-Program 臨床矩陣資料庫 (v12.0 臨床計量分軌版)
// 設計原則: Stage 1~6 為平滑測試區 (安全、遞增、穩定)；Stage 7~10 為高強度訓練區 (極端、抗壓)

export const PROTOCOL_NAMES = {
    'KeyY': '感覺與融像喚醒 (Y) - 打破單眼抑制',
    'KeyU': '內聚力與近點重塑 (U) - 強化看近聚焦',
    'KeyI': '開散力與遠距釋放 (I) - 釋放看遠壓力',
    'KeyO': '眼動追蹤與靈活度 (O) - 提升閱讀穩定',
    'KeyP': '神經抗壓與混沌 (P) - 視覺疲勞抵抗'
};

export const AIM_MATRIX = {
    // =========================================================================
    // [ Y ] 感覺與融像喚醒矩陣 (Yield / Awaken)
    // 臨床目標：打破抑制，建立雙眼同時知覺。
    // =========================================================================
    'KeyY': [ 
        // --- 測驗區 (Stage 1~6)：平緩遞進 ---
        { name: 'Y-01 巨幅視野喚醒', shape: 'circle5', size: 550, dist: 20, speed: 8, thick: 14.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: 0.0, anim: 'breathSize' },
        { name: 'Y-02 五層星芒鎖定', shape: 'star5', size: 480, dist: 35, speed: 10, thick: 12.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: 0.05, anim: 'rotate' },
        { name: 'Y-03 立體認知介入', shape: 'text', size: 400, dist: 50, speed: 12, thick: 8.0, fill: true, axis: 'horizontal', mode: 'crossover', stereo: 0.1, anim: 'breathSize' },
        { name: 'Y-04 三層同心視界', shape: 'circle3', size: 320, dist: 65, speed: 15, thick: 10.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: 0.12, anim: 'rotate' },
        { name: 'Y-05 星體微幅漫遊', shape: 'star3', size: 250, dist: 80, speed: 18, thick: 8.0, fill: false, axis: 'roam', mode: 'crossover', stereo: 0.15, anim: 'roam' },
        { name: 'Y-06 基礎跳視對齊', shape: 'wan3', size: 180, dist: 100, speed: 20, thick: 7.0, fill: false, axis: 'saccade', mode: 'crossover', stereo: 0.05, anim: 'saccade' },
        // --- 訓練區 (Stage 7~10)：高壓榨乾 ---
        { name: 'Y-07 頻閃交互感應', shape: 'wan5', size: 150, dist: 120, speed: 25, thick: 6.0, fill: false, axis: 'circular', mode: 'crossover', stereo: 0.2, anim: 'rivalry' },
        { name: 'Y-08 微距動態漂移', shape: 'circle3', size: 120, dist: 140, speed: 28, thick: 5.0, fill: false, axis: 'roam', mode: 'crossover', stereo: 0.25, anim: 'balanceDrift' },
        { name: 'Y-09 高敏度立體視', shape: 'star3', size: 90, dist: 160, speed: 32, thick: 4.5, fill: true, axis: 'horizontal', mode: 'crossover', stereo: 0.3, anim: 'rotate' },
        { name: 'Y-10 中央凹極限鎖定', shape: 'wan1', size: 60, dist: 180, speed: 40, thick: 3.5, fill: false, axis: 'circular', mode: 'crossover', stereo: 0.0, anim: 'rotate' }
    ],

    // =========================================================================
    // [ U ] 內聚力與近點重塑矩陣 (Union / Convergence) 
    // 臨床目標：強化定位 (Centering)，對抗外斜位。BO 負載。
    // =========================================================================
    'KeyU': [ 
        // --- 測驗區 (Stage 1~6)：平緩遞增 BO 距離，抓取破裂點 ---
        { name: 'U-01 巨型重力牽引', shape: 'circle5', size: 500, dist: 40, speed: 10, thick: 14.0, fill: false, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.1, anim: 'none' },
        { name: 'U-02 空間初階吸附', shape: 'star5', size: 440, dist: 80, speed: 12, thick: 12.0, fill: false, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.15, anim: 'pulseZ_in' },
        { name: 'U-03 網格中度逼近', shape: 'wan5', size: 360, dist: 130, speed: 15, thick: 10.0, fill: false, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.2, anim: 'breathSize' },
        { name: 'U-04 實心認知內聚', shape: 'text', size: 280, dist: 180, speed: 18, thick: 8.0, fill: true, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.25, anim: 'pulseZ_in' },
        { name: 'U-05 環形軌跡逼近', shape: 'circle3', size: 220, dist: 240, speed: 20, thick: 7.0, fill: false, axis: 'circular', mode: 'oneway_bo', stereo: 0.3, anim: 'rotate' },
        { name: 'U-06 晶體深層對位', shape: 'star3', size: 160, dist: 300, speed: 22, thick: 6.0, fill: false, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.35, anim: 'none' },
        // --- 訓練區 (Stage 7~10)：高距、高難度睫狀肌增壓 ---
        { name: 'U-07 漫遊追蹤內聚', shape: 'wan3', size: 130, dist: 360, speed: 28, thick: 5.0, fill: false, axis: 'roam', mode: 'oneway_bo', stereo: 0.4, anim: 'roam_pulseZ_in' },
        { name: 'U-08 強制內聚磁吸', shape: 'circle3', size: 100, dist: 420, speed: 32, thick: 4.5, fill: true, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.45, anim: 'none' },
        { name: 'U-09 極限無輔助重訓', shape: 'star3', size: 75, dist: 480, speed: 35, thick: 4.0, fill: false, axis: 'circular', mode: 'oneway_bo', stereo: 0.5, anim: 'breathSize' },
        { name: 'U-10 終極針尖內聚', shape: 'wan1', size: 50, dist: 550, speed: 45, thick: 3.0, fill: false, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.5, anim: 'rotate' }
    ],

    // =========================================================================
    // [ I ] 開散力與遠距釋放矩陣 (Infinity / Divergence)
    // 臨床目標：釋放看近壓力，視覺空間退行。嚴格限制 BI 分離量。
    // =========================================================================
    'KeyI': [ 
        // --- 測驗區 (Stage 1~6)：微幅開散，安全極限內平滑測試 ---
        { name: 'I-01 天幕舒緩擴張', shape: 'circle5', size: 550, dist: 15, speed: 6, thick: 14.0, fill: false, axis: 'horizontal', mode: 'oneway_bi', stereo: -0.1, anim: 'none' },
        { name: 'I-02 地平線淺流動', shape: 'star5', size: 480, dist: 25, speed: 7, thick: 12.0, fill: false, axis: 'horizontal', mode: 'oneway_bi', stereo: -0.15, anim: 'breathSize' },
        { name: 'I-03 禪定退行初階', shape: 'text', size: 400, dist: 35, speed: 8, thick: 8.0, fill: false, axis: 'horizontal', mode: 'oneway_bi', stereo: -0.2, anim: 'pulseZ_out' },
        { name: 'I-04 網格輕度發散', shape: 'wan5', size: 320, dist: 45, speed: 9, thick: 10.0, fill: false, axis: 'circular', mode: 'oneway_bi', stereo: -0.25, anim: 'rotate' },
        { name: 'I-05 睫狀肌深度釋放', shape: 'circle3', size: 250, dist: 55, speed: 10, thick: 7.0, fill: false, axis: 'horizontal', mode: 'oneway_bi', stereo: -0.2, anim: 'none' },
        { name: 'I-06 星體動態放鬆', shape: 'star3', size: 190, dist: 65, speed: 12, thick: 6.0, fill: false, axis: 'roam', mode: 'oneway_bi', stereo: -0.3, anim: 'roam' },
        // --- 訓練區 (Stage 7~10)：維持安全 BI，縮小圖形考驗精細控制 ---
        { name: 'I-07 光流退行解鎖', shape: 'wan3', size: 140, dist: 75, speed: 14, thick: 5.5, fill: false, axis: 'circular', mode: 'oneway_bi', stereo: -0.35, anim: 'pulseZ_out' },
        { name: 'I-08 精細邊緣發散', shape: 'circle3', size: 100, dist: 85, speed: 16, thick: 4.5, fill: false, axis: 'horizontal', mode: 'oneway_bi', stereo: -0.2, anim: 'none' },
        { name: 'I-09 安全遠點韌性', shape: 'star3', size: 75, dist: 95, speed: 18, thick: 4.0, fill: true, axis: 'roam', mode: 'oneway_bi', stereo: -0.4, anim: 'none' },
        { name: 'I-10 虛空微距禪定', shape: 'wan1', size: 50, dist: 105, speed: 20, thick: 3.5, fill: false, axis: 'horizontal', mode: 'oneway_bi', stereo: -0.45, anim: 'rotate' }
    ],

    // =========================================================================
    // [ O ] 眼動追蹤與靈活度矩陣 (Oculomotor / Tracking)
    // 臨床目標：強化閱讀平滑追視 (Pursuits) 與跳視 (Saccades)。避免純垂直分離。
    // =========================================================================
    'KeyO': [ 
        // --- 測驗區 (Stage 1~6)：平緩、規則的軌跡追蹤 ---
        { name: 'O-01 平滑巨幅擺盪', shape: 'circle5', size: 500, dist: 80, speed: 15, thick: 14.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: 0.0, anim: 'none' },
        { name: 'O-02 雷達環形巡航', shape: 'star5', size: 420, dist: 110, speed: 18, thick: 12.0, fill: false, axis: 'circular', mode: 'crossover', stereo: 0.0, anim: 'rotate' },
        { name: 'O-03 空間中距跳躍', shape: 'wan5', size: 340, dist: 140, speed: 22, thick: 10.0, fill: false, axis: 'saccade', mode: 'crossover', stereo: 0.1, anim: 'saccade' },
        { name: 'O-04 認知圖形掃描', shape: 'text', size: 260, dist: 170, speed: 26, thick: 7.0, fill: true, axis: 'horizontal', mode: 'crossover', stereo: 0.15, anim: 'none' },
        { name: 'O-05 精準控眼追視', shape: 'circle3', size: 190, dist: 200, speed: 30, thick: 8.0, fill: false, axis: 'circular', mode: 'crossover', stereo: 0.0, anim: 'none' },
        { name: 'O-06 星域平滑漫遊', shape: 'star3', size: 140, dist: 230, speed: 35, thick: 6.0, fill: false, axis: 'roam', mode: 'crossover', stereo: 0.2, anim: 'roam' },
        // --- 訓練區 (Stage 7~10)：高頻跳視與不規則軌跡，攻克跳行 ---
        { name: 'O-07 混合動態協調', shape: 'wan3', size: 100, dist: 260, speed: 45, thick: 5.0, fill: false, axis: 'saccade', mode: 'crossover', stereo: -0.2, anim: 'saccade_chaos' },
        { name: 'O-08 高頻星流追緝', shape: 'star3', size: 80, dist: 290, speed: 55, thick: 4.5, fill: true, axis: 'roam', mode: 'crossover', stereo: 0.3, anim: 'roam_pulseZ_rotate' },
        { name: 'O-09 隨機高速煞車', shape: 'circle3', size: 60, dist: 320, speed: 65, thick: 4.0, fill: false, axis: 'saccade', mode: 'crossover', stereo: 0.0, anim: 'saccade' },
        { name: 'O-10 無重力微跳視', shape: 'wan1', size: 45, dist: 350, speed: 75, thick: 3.5, fill: false, axis: 'saccade', mode: 'crossover', stereo: 0.0, anim: 'saccade' }
    ],

    // =========================================================================
    // [ P ] 神經抗壓與混沌矩陣 (Pressure / Chaos)
    // 臨床目標：皮層視覺韌性鍛鍊，融合所有高壓環境因素。
    // =========================================================================
    'KeyP': [ 
        // --- 測驗區 (Stage 1~6)：基礎干擾，評估神經穩定度 ---
        { name: 'P-01 基礎對比失衡', shape: 'circle5', size: 480, dist: 70, speed: 15, thick: 13.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: 0.0, anim: 'balanceDrift' },
        { name: 'P-02 頻閃視覺重組', shape: 'star5', size: 400, dist: 100, speed: 20, thick: 11.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: -0.1, anim: 'flicker' },
        { name: 'P-03 網格深度反轉', shape: 'wan5', size: 320, dist: 130, speed: 25, thick: 9.0, fill: false, axis: 'circular', mode: 'crossover', stereo: 0.0, anim: 'flipStereo_hard' },
        { name: 'P-04 認知解碼干擾', shape: 'text', size: 250, dist: 160, speed: 30, thick: 7.0, fill: true, axis: 'roam', mode: 'crossover', stereo: 0.2, anim: 'balanceDrift' },
        { name: 'P-05 亮度突變超載', shape: 'circle3', size: 190, dist: 190, speed: 35, thick: 8.0, fill: false, axis: 'saccade', mode: 'crossover', stereo: 0.0, anim: 'sensoryOverload' },
        { name: 'P-06 融像韌性穿透', shape: 'wan3', size: 140, dist: 220, speed: 45, thick: 6.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: -0.3, anim: 'flicker' },
        // --- 訓練區 (Stage 7~10)：終極抗壓，模擬高階 3C 疲勞環境 ---
        { name: 'P-07 非對稱混亂旋轉', shape: 'star3', size: 100, dist: 250, speed: 55, thick: 5.0, fill: false, axis: 'circular', mode: 'crossover', stereo: 0.3, anim: 'balanceDrift_rotate' },
        { name: 'P-08 晶體突變風暴', shape: 'circle3', size: 75, dist: 280, speed: 65, thick: 4.5, fill: false, axis: 'roam', mode: 'crossover', stereo: 0.0, anim: 'roam_flipStereo_hard' },
        { name: 'P-09 絕對向心壓力', shape: 'star3', size: 55, dist: 310, speed: 75, thick: 4.0, fill: true, axis: 'saccade', mode: 'oneway_bo', stereo: 0.4, anim: 'pulseZ_in' },
        { name: 'P-10 終極混沌引擎', shape: 'wan1', size: 40, dist: 350, speed: 90, thick: 3.5, fill: false, axis: 'saccade', mode: 'crossover', stereo: 0.0, anim: 'chaos' }
    ]
};