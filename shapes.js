// shapes.js - AXP Fusion Dynamics: 3D 真實物理鋼管架構 (v4.0 終極美學版)

let loadedFont = null;
const loader = new THREE.FontLoader();
loader.load('https://cdn.jsdelivr.net/npm/three@0.128.0/examples/fonts/helvetiker_bold.typeface.json', function (font) {
    loadedFont = font;
});

// 💡 核心黑科技：將 1px 線框轉化為「真實 3D 物理圓柱鋼管」
function createThickWireframe(geometry, material, thickness) {
    const edgeGroup = new THREE.Group();
    // 抓取幾何體的所有邊緣
    const edges = new THREE.EdgesGeometry(geometry, 1); 
    const pos = edges.attributes.position;
    if (!pos) return edgeGroup;

    // 將 UI 的粗細數值轉換為鋼管半徑
    const radius = thickness * 0.15; 

    // 建立一根基礎鋼管 (節省 GPU 記憶體)
    const cylinderGeo = new THREE.CylinderGeometry(radius, radius, 1, 6);
    cylinderGeo.translate(0, 0.5, 0); 
    cylinderGeo.rotateX(Math.PI / 2);

    for (let i = 0; i < pos.count; i += 2) {
        const v1 = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
        const v2 = new THREE.Vector3(pos.getX(i+1), pos.getY(i+1), pos.getZ(i+1));
        
        const distance = v1.distanceTo(v2);
        if(distance === 0) continue;

        // 生成實體鋼管並對齊端點
        const cylinder = new THREE.Mesh(cylinderGeo, material);
        cylinder.position.copy(v1);
        cylinder.scale.z = distance; 
        cylinder.lookAt(v2);         

        edgeGroup.add(cylinder);
    }
    return edgeGroup;
}

export function createTarget(type, colorHex, isFilled = false, customText = 'Dodge', thickness = 9.0) {
    const group = new THREE.Group();
    
    // WebGL 物理反光材質
    const material = new THREE.MeshLambertMaterial({
        color: colorHex,
        emissive: colorHex,
        emissiveIntensity: 0.4, // 高科技微發光
        transparent: true,
        opacity: 1.0,
        side: THREE.DoubleSide
    });

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

    let layers = 1;
    if (type.includes('3')) layers = 3;
    if (type.includes('5')) layers = 5;

    for (let i = 0; i < layers; i++) {
        let geometry;
        const scale = 1 - (i * 0.15); 
        const zPos = -(i * 50); 

        if (type.includes('circle')) {
            // 適度減少分段數以確保鋼管架構的效能
            geometry = new THREE.TorusGeometry(60 * scale, 15 * scale, isFilled ? 16 : 6, isFilled ? 64 : 24);
        } 
        else if (type.includes('star')) {
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
            geometry = new THREE.ExtrudeGeometry(starShape, { depth: isFilled ? 10 : 8, bevelEnabled: false });
        }
        else {
            geometry = new THREE.OctahedronGeometry(60 * scale, 0); 
            if (!isFilled) {
                geometry = new THREE.IcosahedronGeometry(60 * scale, 1);
            }
        }

        let mesh;
        if (isFilled) {
            // 實心模式：正常渲染 3D 幾何塊
            mesh = new THREE.Mesh(geometry, material);
        } else {
            // 空心模式：觸發黑科技，生成「可調粗細的實體鋼管」
            mesh = createThickWireframe(geometry, material, thickness * scale);
        }
        
        mesh.position.z = zPos;
        group.add(mesh);
    }

    return group;
}