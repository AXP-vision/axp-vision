// matrix.js - AXP Fusion Dynamics: 50-Program 臨床矩陣資料庫 (v3.0 垂直雙軌與 BI 限額版)

export const PROTOCOL_NAMES = {
    'KeyY': '感覺與融像喚醒 (Y) - 打破單眼抑制',
    'KeyU': '內聚力與近點重塑 (U) - 強化看近聚焦',
    'KeyI': '開散力與遠距釋放 (I) - 釋放看遠壓力',
    'KeyO': '眼動追蹤與靈活度 (O) - 提升閱讀穩定',
    'KeyP': '神經抗壓與混沌 (P) - 視覺疲勞抵抗'
};

export const AIM_MATRIX = {
    // ==========================================
    // [ Y ] 感覺與融像喚醒矩陣 (Yield / Awaken)
    // ==========================================
    'KeyY': [ 
        { name: 'Y-01 中央凹知覺破冰 (基礎同步)', shape: 'crystal1', size: 250, dist: 20, speed: 10, thick: 12.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: 0.0, anim: 'breathSize' },
        { name: 'Y-02 雙眼交替閃爍 (破除抑制)', shape: 'circle3', size: 300, dist: 40, speed: 15, thick: 10.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: 0.0, anim: 'rivalry' },
        { name: 'Y-03 3D 文字解碼 (立體字元)', shape: 'text', size: 280, dist: 50, speed: 12, thick: 5.0, fill: true, axis: 'horizontal', mode: 'crossover', stereo: 0.1, anim: 'breathSize' },
        { name: 'Y-04 垂直微調對齊 (Fine Fusion)', shape: 'crystal3', size: 200, dist: 20, speed: 5, thick: 6.0, fill: false, axis: 'vertical', mode: 'crossover', stereo: 0.05, anim: 'rotate' }, // 軌道 A：極小垂直距離，極慢速
        { name: 'Y-05 主眼視覺平衡 (動態漂移)', shape: 'circle5', size: 350, dist: 80, speed: 15, thick: 5.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: 0.0, anim: 'balanceDrift' },
        { name: 'Y-06 周邊輪廓誘發 (大視野)', shape: 'star5', size: 500, dist: 100, speed: 18, thick: 3.0, fill: false, axis: 'roam', mode: 'crossover', stereo: 0.1, anim: 'roam' },
        { name: 'Y-07 晶體高頻鎖定 (多面反射)', shape: 'crystal3', size: 180, dist: 70, speed: 25, thick: 4.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: -0.1, anim: 'none' },
        { name: 'Y-08 空間知覺整合 (多軸運動)', shape: 'circle3', size: 250, dist: 90, speed: 22, thick: 8.0, fill: false, axis: 'roam', mode: 'crossover', stereo: 0.15, anim: 'roam_pulseZ_rotate' },
        { name: 'Y-09 突發跳視喚醒 (神經警覺)', shape: 'crystal5', size: 150, dist: 100, speed: 30, thick: 3.0, fill: false, axis: 'saccade', mode: 'crossover', stereo: 0.0, anim: 'saccade' },
        { name: 'Y-10 全視野覺醒 (綜合聯覺)', shape: 'star5', size: 400, dist: 120, speed: 35, thick: 2.0, fill: false, axis: 'circular', mode: 'crossover', stereo: 0.25, anim: 'balanceDrift_rotate' }
    ],

    // ==========================================
    // [ U ] 內聚力與近點重塑矩陣 (Union / Convergence)
    // ==========================================
    'KeyU': [ 
        { name: 'U-01 基礎內聚力建立 (向內對焦)', shape: 'circle3', size: 300, dist: 80, speed: 15, thick: 9.0, fill: false, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.1, anim: 'none' },
        { name: 'U-02 近點重力井 (深度吸附)', shape: 'star3', size: 250, dist: 120, speed: 18, thick: 8.0, fill: false, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.2, anim: 'pulseZ_in' },
        { name: 'U-03 空間壓縮感應 (SILO 效應)', shape: 'star5', size: 280, dist: 150, speed: 20, thick: 5.0, fill: false, axis: 'vertical', mode: 'oneway_bo', stereo: 0.3, anim: 'breathSize' },
        { name: 'U-04 3D 字母逼近 (近點閱讀)', shape: 'text', size: 200, dist: 160, speed: 15, thick: 5.0, fill: true, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.25, anim: 'pulseZ_in' },
        { name: 'U-05 深淵隧道鎖定 (高階隧道)', shape: 'circle5', size: 350, dist: 180, speed: 25, thick: 4.0, fill: false, axis: 'circular', mode: 'oneway_bo', stereo: 0.35, anim: 'rotate' },
        { name: 'U-06 晶體精準對位 (微距內聚)', shape: 'crystal3', size: 120, dist: 200, speed: 28, thick: 3.0, fill: false, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.2, anim: 'none' },
        { name: 'U-07 睫狀肌向心收縮 (動態調焦)', shape: 'crystal5', size: 220, dist: 220, speed: 30, thick: 2.0, fill: false, axis: 'roam', mode: 'oneway_bo', stereo: 0.3, anim: 'roam_pulseZ_in' },
        { name: 'U-08 雙眼磁吸效應 (強制內聚)', shape: 'circle3', size: 180, dist: 250, speed: 35, thick: 6.0, fill: true, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.4, anim: 'none' },
        { name: 'U-09 極限 BO 耐力 (抗疲勞)', shape: 'star5', size: 250, dist: 300, speed: 20, thick: 3.0, fill: false, axis: 'horizontal', mode: 'oneway_bo', stereo: 0.45, anim: 'u05_endurance' },
        { name: 'U-10 終極內聚聯覺 (全方位壓縮)', shape: 'star5', size: 300, dist: 350, speed: 40, thick: 2.0, fill: false, axis: 'circular', mode: 'oneway_bo', stereo: 0.5, anim: 'rotate' }
    ],

    // ==========================================
    // [ I ] 開散力與遠距釋放矩陣 (Infinity / Divergence)
    // * 核心防護機制：BI 距離嚴格壓制在 40px - 120px 內，並降低移動速度
    // ==========================================
    'KeyI': [ 
        { name: 'I-01 基礎開散放鬆 (向外遠眺)', shape: 'circle3', size: 300, dist: 40, speed: 8, thick: 9.0, fill: false, axis: 'horizontal', mode: 'oneway_bi', stereo: -0.1, anim: 'none' },
        { name: 'I-02 遠距地平線漂移 (舒緩擴張)', shape: 'text', size: 250, dist: 50, speed: 8, thick: 5.0, fill: false, axis: 'horizontal', mode: 'oneway_bi', stereo: -0.15, anim: 'breathSize' },
        { name: 'I-03 空間無限擴張 (反向 SILO)', shape: 'star3', size: 250, dist: 60, speed: 10, thick: 8.0, fill: false, axis: 'vertical', mode: 'oneway_bi', stereo: -0.2, anim: 'pulseZ_out' },
        { name: 'I-04 天幕深度解鎖 (退行隧道)', shape: 'circle5', size: 400, dist: 70, speed: 12, thick: 4.0, fill: false, axis: 'circular', mode: 'oneway_bi', stereo: -0.25, anim: 'rotate' },
        { name: 'I-05 睫狀肌深度釋放 (晶體退行)', shape: 'crystal3', size: 200, dist: 80, speed: 12, thick: 4.0, fill: false, axis: 'horizontal', mode: 'oneway_bi', stereo: -0.2, anim: 'none' },
        { name: 'I-06 視覺退行誘導 (放鬆漫遊)', shape: 'crystal5', size: 300, dist: 90, speed: 15, thick: 3.0, fill: false, axis: 'roam', mode: 'oneway_bi', stereo: -0.3, anim: 'roam' },
        { name: 'I-07 虛空光流擴散 (深度沉浸)', shape: 'star5', size: 450, dist: 100, speed: 10, thick: 3.0, fill: false, axis: 'circular', mode: 'oneway_bi', stereo: -0.35, anim: 'pulseZ_out' },
        { name: 'I-08 雙眼發散穩定 (對比邊緣)', shape: 'crystal1', size: 150, dist: 110, speed: 18, thick: 8.0, fill: false, axis: 'vertical', mode: 'oneway_bi', stereo: -0.2, anim: 'none' },
        { name: 'I-09 極限 BI 耐力 (安全遠點)', shape: 'circle5', size: 350, dist: 115, speed: 20, thick: 3.0, fill: false, axis: 'horizontal', mode: 'oneway_bi', stereo: -0.4, anim: 'none' },
        { name: 'I-10 視覺禪定流動 (終極放鬆)', shape: 'star5', size: 500, dist: 120, speed: 8, thick: 2.0, fill: true, axis: 'circular', mode: 'oneway_bi', stereo: -0.45, anim: 'rotate' }
    ],

    // ==========================================
    // [ O ] 眼動追蹤與靈活度矩陣 (Oculomotor / Tracking)
    // ==========================================
    'KeyO': [ 
        { name: 'O-01 平滑追視軌跡 (水平穩眼)', shape: 'circle3', size: 250, dist: 150, speed: 30, thick: 8.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: 0.0, anim: 'none' },
        { name: 'O-02 空間跳躍注視 (水平跳視)', shape: 'crystal1', size: 200, dist: 120, speed: 35, thick: 10.0, fill: true, axis: 'saccade', mode: 'crossover', stereo: 0.0, anim: 'saccade' },
        { name: 'O-03 上下直肌重訓 (垂直大振幅)', shape: 'circle3', size: 220, dist: 180, speed: 50, thick: 7.0, fill: false, axis: 'vertical', mode: 'crossover', stereo: 0.1, anim: 'none' }, // 軌道 B：垂直肌肉施力模式 (大振幅/高流速)
        { name: 'O-04 3D 語音跳視 (文字解碼)', shape: 'text', size: 180, dist: 150, speed: 35, thick: 5.0, fill: true, axis: 'saccade', mode: 'crossover', stereo: 0.15, anim: 'saccade' },
        { name: 'O-05 周邊巡視雷達 (環形追蹤)', shape: 'star3', size: 250, dist: 180, speed: 45, thick: 6.0, fill: false, axis: 'circular', mode: 'crossover', stereo: 0.0, anim: 'rotate' },
        { name: 'O-06 多軸交錯追蹤 (全螢幕漫遊)', shape: 'crystal3', size: 150, dist: 200, speed: 35, thick: 5.0, fill: false, axis: 'roam', mode: 'crossover', stereo: 0.2, anim: 'roam' },
        { name: 'O-07 垂直極限跳視 (抗地心引力)', shape: 'star5', size: 300, dist: 220, speed: 60, thick: 3.0, fill: false, axis: 'vertical', mode: 'crossover', stereo: -0.2, anim: 'saccade_chaos' }, // 軌道 B：垂直極端跳躍
        { name: 'O-08 視覺節奏發條 (極速水平)', shape: 'circle5', size: 200, dist: 220, speed: 60, thick: 4.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: 0.0, anim: 'none' },
        { name: 'O-09 全視野光流 (晶體巡航)', shape: 'crystal5', size: 350, dist: 180, speed: 45, thick: 2.0, fill: false, axis: 'roam', mode: 'crossover', stereo: 0.3, anim: 'roam_pulseZ_rotate' },
        { name: 'O-10 終極眼動協調 (無重力跳視)', shape: 'star5', size: 180, dist: 250, speed: 65, thick: 2.0, fill: false, axis: 'saccade', mode: 'crossover', stereo: 0.0, anim: 'saccade' }
    ],

    // ==========================================
    // [ P ] 神經抗壓與混沌矩陣 (Pressure / Chaos)
    // ==========================================
    'KeyP': [ 
        { name: 'P-01 輕度視覺壓力 (亮度漂移)', shape: 'circle3', size: 280, dist: 100, speed: 25, thick: 8.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: 0.0, anim: 'balanceDrift' },
        { name: 'P-02 頻閃神經干擾 (跳視抗壓)', shape: 'crystal1', size: 250, dist: 120, speed: 30, thick: 12.0, fill: false, axis: 'saccade', mode: 'oneway_bi', stereo: -0.2, anim: 'saccade_flicker' },
        { name: 'P-03 空間深度反轉 (立體視錯亂)', shape: 'star3', size: 300, dist: 140, speed: 35, thick: 6.0, fill: false, axis: 'circular', mode: 'crossover', stereo: 0.0, anim: 'roam_flipStereo_hard' },
        { name: 'P-04 3D 認知干擾 (閱讀雜訊)', shape: 'text', size: 220, dist: 150, speed: 40, thick: 5.0, fill: false, axis: 'roam', mode: 'crossover', stereo: 0.2, anim: 'balanceDrift' },
        { name: 'P-05 動態亮度雜訊 (深度漂移)', shape: 'circle5', size: 350, dist: 130, speed: 45, thick: 4.0, fill: false, axis: 'vertical', mode: 'crossover', stereo: 0.0, anim: 'sensoryOverload' },
        { name: 'P-06 融像韌性網格 (極速交錯)', shape: 'crystal3', size: 200, dist: 180, speed: 60, thick: 4.0, fill: false, axis: 'horizontal', mode: 'crossover', stereo: -0.3, anim: 'none' },
        { name: 'P-07 不對稱對比干擾 (極端漂移)', shape: 'star5', size: 400, dist: 160, speed: 50, thick: 3.0, fill: false, axis: 'circular', mode: 'crossover', stereo: 0.3, anim: 'balanceDrift_rotate' },
        { name: 'P-08 劇烈眼動風暴 (晶體突變)', shape: 'crystal5', size: 250, dist: 200, speed: 70, thick: 2.0, fill: false, axis: 'roam', mode: 'crossover', stereo: 0.0, anim: 'roam_flipStereo_hard' },
        { name: 'P-09 絕對壓力頂點 (黑洞效應)', shape: 'circle5', size: 500, dist: 80, speed: 80, thick: 2.0, fill: false, axis: 'roam', mode: 'oneway_bo', stereo: 0.4, anim: 'roam_pulseZ_in' },
        { name: 'P-10 混沌神經引擎 (終極防禦)', shape: 'star5', size: 300, dist: 250, speed: 90, thick: 1.0, fill: true, axis: 'saccade', mode: 'crossover', stereo: 0.0, anim: 'chaos' }
    ]
};