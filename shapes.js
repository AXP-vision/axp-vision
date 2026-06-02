// shapes.js - AXP Fusion Dynamics: 3D 實體幾何工廠 (v3.0 黑科技版)

// 非同步預先載入字體庫
let loadedFont = null;
const loader = new THREE.FontLoader();
loader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', function (font) {
    loadedFont = font;
});

// 幾何定義：3D 稜鏡晶體 (Prismatic Crystal) 頂點定義
const CRYSTAL_RADIUS = 10;
const CRYSTAL_HEIGHT = 20;

/**
 * 建立具備高度空間特徵的 3D 實體目標
 * @param {string} type - 項目種類 (circle, star, crystal, text)
 * @param {number} colorHex - 頻譜顏色
 * @param {boolean} isFilled - 是否填滿實體
 * @param {string} customText - 客製文字
 * @param {number} thickness - 實體線條粗細 (2.0 - 25.0)
 */
export function createTarget(type, colorHex, isFilled = false, customText = 'Dodge', thickness = 9.0) {
    const group = new THREE.Group();
    
    // 高階物理質感材質 (MeshStandardMaterial 需要光源，這裡使用 MeshLambert 兼顧效能與陰影)
    const material = new THREE.MeshLambertMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.3, // 微弱自發光，增加科技質感
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide,
        wireframe: !isFilled // 依據 F 鍵切換「實體切割」或「線框網格」
    });

    // 換算物理半徑：讓滑桿真正控制 3D 物體的「胖瘦」
    const tubeRadius = (thickness / 9.0) * 2.5;

    // === 1. 處理 3D 浮雕文字 (Text) ===
    if (type === 'text') {
        if (!loadedFont) return group;
        const textGeo = new THREE.TextGeometry(customText || ' ', {
            font: loadedFont, size: 40, height: isFilled ? 12 : 3, curveSegments: 12,
        });
        textGeo.computeBoundingBox();
        const centerOffset = - 0.5 * ( textGeo.boundingBox.max.x - textGeo.boundingBox.min.x );
        const yOffset = - 0.5 * ( textGeo.boundingBox.max.y - textGeo.boundingBox.min.y );
        textGeo.translate(centerOffset, yOffset, 0);
        group.add(new THREE.Mesh(textGeo, material));
        return group;
    }

    // === 2. 處理 3D 多層實體幾何 (Circle / Star / Crystal) ===
    let layers = 1;
    if (type.includes('3')) layers = 3;
    if (type.includes('5')) layers = 5;

    for (let i = 0; i < layers; i++) {
        let geometry;
        const scale = 1 - (i * 0.15); 
        const zPos = -(i * 50); // 增加層級間距，強化漏斗隧道感

        if (type.includes('circle')) {
            // 從平面 Ring 進化為立體 Torus (圓環管)
            const radius = 60 * scale;
            geometry = new THREE.TorusGeometry(radius, tubeRadius, 16, 64);
        } 
        else if (type.includes('star')) {
            // 星形進化：具有擠壓厚度的實體五角星
            const starShape = new THREE.Shape();
            const outer = 60 * scale;
            const inner = 30 * scale;
            for (let j = 0; j < 10; j++) {
                const rad = (j % 2 === 0) ? outer : inner;
                const angle = (Math.PI * 2 * j) / 10 - Math.PI / 2;
                if (j === 0) starShape.moveTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
                else starShape.lineTo(Math.cos(angle) * rad, Math.sin(angle) * rad);
            }
            starShape.closePath();
            geometry = new THREE.ExtrudeGeometry(starShape, { depth: isFilled ? 10 : tubeRadius * 1.5, bevelEnabled: false });
        }
        else {
            // 🆕 旗艦款：3D 稜鏡晶體 (Prismatic Crystal)
            // 取代原本的十字與卍字，具備多面反射特性
            geometry = new THREE.OctahedronGeometry(60 * scale, 0); // 八面晶體，最具空間感
            if (!isFilled) {
                // 如果是空心模式，將晶體改為管狀框架 (使用抽象連線)
                geometry = new THREE.IcosahedronGeometry(60 * scale, 1);
            }
        }

        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.z = zPos;
        group.add(mesh);
    }

    return group;
}