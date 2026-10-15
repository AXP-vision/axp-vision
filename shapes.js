// shapes.js - AXP Fusion Dynamics: WebGL 3D 臨床視覺幾何工廠 (v28.0 - 黃金粗細比例 × 紅圓圈/藍十字結構互換 × 零零件錯位版)
// 核心升級：
// 1. 十字靶 (dichoptic_cross) 線條調回黃金適中粗細 (約 7~8px)，徹底解決過細難融像與過粗笨重之問題
// 2. 實作真正的「紅圓圈 / 藍十字 <-> 紅十字 / 藍圓圈」結構分流：一側主導同心圓環，另一側主導中心十字準星，交換時視覺張力極佳
// 3. 將雙眼互補視標封裝於單一不可拆解之 unitGroup 內，防止立體視差迴圈將內部零件拆歪產生獨立紫色殘影

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

function createWireframeTubes(geometry, thickness) {
    const edges = new THREE.EdgesGeometry(geometry);
    const pos = edges.attributes.position;
    const group = new THREE.Group();
    
    const size = Math.max(1.0, thickness * 0.20); 
    const boxGeo = new THREE.BoxGeometry(size, 1, size); 
    const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const v1 = new THREE.Vector3();
    const v2 = new THREE.Vector3();
    const mid = new THREE.Vector3();

    for (let i = 0; i < pos.count; i += 2) {
        v1.fromBufferAttribute(pos, i);
        v2.fromBufferAttribute(pos, i + 1);

        const dist = v1.distanceTo(v2);
        if(dist < 0.001) continue;

        mid.addVectors(v1, v2).multiplyScalar(0.5);

        const mesh = new THREE.Mesh(boxGeo, mat);
        mesh.position.copy(mid);
        mesh.scale.set(1, dist, 1); 
        
        const dir = new THREE.Vector3().subVectors(v2, v1).normalize();
        mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        group.add(mesh);
    }
    return group;
}

export function createTarget(shapeType, colorHex, isFilled, textStr, thickness, eyeSide = 'both') {
    const rootGroup = new THREE.Group();
    
    let layers = 1;
    if (shapeType.includes('5')) layers = 5;
    if (shapeType.includes('3')) layers = 3;

    const solidMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0.45, 
        metalness: 0.2,
        side: THREE.DoubleSide
    });

    const pureFlatMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide
    });

    // =========================================================================
    // 🔬 升級一：黃金比例「圓圈 vs. 十字」雙眼互補靶 (dichoptic_cross)
    // 支援「紅圓圈 / 藍十字 <-> 紅十字 / 藍圓圈」瞬態交換！
    // 封裝於單一 unitGroup 中，確保內部零件絕對不會被 stereo 視差拆歪！
    // =========================================================================
    if (shapeType === 'dichoptic_cross') {
        const unitGroup = new THREE.Group();
        const barW = Math.max(6.5, thickness * 1.05);   // 黃金適中線條粗細 (不再過粗或過細)
        const ringW = Math.max(5.5, thickness * 0.90);  // 黃金適中圓環粗細

        // 最外圍保留一圈極細微的雙眼共視鎖定環，確保高稜鏡度下雙眼有共同基準可抓回融像
        const lockRing = new THREE.Mesh(new THREE.RingGeometry(132 - ringW * 0.6, 132 + ringW * 0.6, 64), pureFlatMaterial);
        unitGroup.add(lockRing);

        if (eyeSide === 'left') {
            // 【圓圈通道】：主導雙層同心圓環 + 四向短刻度 (當 eyeSide 交換時，即與另一眼對調)
            const mainCircle = new THREE.Mesh(new THREE.RingGeometry(82 - ringW, 82 + ringW, 64), pureFlatMaterial);
            const innerCircle = new THREE.Mesh(new THREE.RingGeometry(36 - ringW * 0.7, 36 + ringW * 0.7, 48), pureFlatMaterial);
            unitGroup.add(mainCircle, innerCircle);
        } else if (eyeSide === 'right') {
            // 【十字通道】：主導完整水平與垂直十字準星 + 精緻中心圓點
            const hLine = new THREE.Mesh(new THREE.BoxGeometry(210, barW, 2), pureFlatMaterial);
            const vLine = new THREE.Mesh(new THREE.BoxGeometry(barW, 210, 2), pureFlatMaterial);
            const centerDot = new THREE.Mesh(new THREE.CircleGeometry(Math.max(11, barW * 1.3), 32), pureFlatMaterial);
            centerDot.position.set(0, 0, 1);
            unitGroup.add(hLine, vLine, centerDot);
        }
        rootGroup.add(unitGroup);
    }
    // =========================================================================
    // 🔬 升級二：黃金比例「八角外框 vs. 晶體核心」對位鎖 (dichoptic_lock)
    // =========================================================================
    else if (shapeType === 'dichoptic_lock') {
        const unitGroup = new THREE.Group();
        const barThick = Math.max(6.0, thickness * 0.95);

        const commonBaseRing = new THREE.Mesh(new THREE.RingGeometry(132 - barThick * 0.6, 132 + barThick * 0.6, 8), pureFlatMaterial);
        commonBaseRing.rotation.z = Math.PI / 8;
        unitGroup.add(commonBaseRing);

        if (eyeSide === 'left') {
            // 【外框通道】：圓環 + 上下垂直定位線
            const midRing = new THREE.Mesh(new THREE.RingGeometry(84 - barThick * 0.8, 84 + barThick * 0.8, 64), pureFlatMaterial);
            const topTick = new THREE.Mesh(new THREE.BoxGeometry(barThick, 46, 2), pureFlatMaterial);
            const botTick = new THREE.Mesh(new THREE.BoxGeometry(barThick, 46, 2), pureFlatMaterial);
            topTick.position.set(0, 108, 0);
            botTick.position.set(0, -108, 0);
            unitGroup.add(midRing, topTick, botTick);
        } else if (eyeSide === 'right') {
            // 【核心通道】：中央菱形晶核 + 左右水平定位線
            const coreGeo = new THREE.OctahedronGeometry(46, 0);
            const coreMesh = isFilled ? new THREE.Mesh(coreGeo, pureFlatMaterial) : createWireframeTubes(coreGeo, thickness);
            const leftTick = new THREE.Mesh(new THREE.BoxGeometry(46, barThick, 2), pureFlatMaterial);
            const rightTick = new THREE.Mesh(new THREE.BoxGeometry(46, barThick, 2), pureFlatMaterial);
            leftTick.position.set(-108, 0, 0);
            rightTick.position.set(108, 0, 0);
            unitGroup.add(coreMesh, leftTick, rightTick);
        }
        rootGroup.add(unitGroup);
    }
    else if (shapeType.startsWith('circle')) {
        for (let i = 0; i < layers; i++) {
            const radius = 32 + i * 28;
            let mesh;
            if (isFilled) {
                const geo = new THREE.CircleGeometry(radius, 64);
                mesh = new THREE.Mesh(geo, solidMaterial);
            } else {
                const tubeW = Math.max(3.0, thickness * 0.75);
                const geo = new THREE.RingGeometry(radius - tubeW, radius + tubeW, 64);
                mesh = new THREE.Mesh(geo, pureFlatMaterial);
            }
            mesh.position.z = i * 0.1;
            rootGroup.add(mesh);
        }
    }
    else if (shapeType.startsWith('star')) {
        for (let i = 0; i < layers; i++) {
            const outer = 42 + i * 28;
            const inner = outer * 0.48;
            const starShape = new THREE.Shape();
            for (let j = 0; j < 10; j++) {
                const r = (j % 2 === 0) ? outer : inner;
                const a = (j / 10) * Math.PI * 2 + Math.PI / 2;
                if (j === 0) starShape.moveTo(Math.cos(a) * r, Math.sin(a) * r);
                else starShape.lineTo(Math.cos(a) * r, Math.sin(a) * r);
            }
            starShape.closePath();

            if (isFilled) {
                const geo = new THREE.ShapeGeometry(starShape);
                const mesh = new THREE.Mesh(geo, solidMaterial);
                mesh.position.z = i * 0.1;
                rootGroup.add(mesh);
            } else {
                const geo = new THREE.ExtrudeGeometry(starShape, { depth: 0.1, bevelEnabled: false });
                const wireframe = createWireframeTubes(geo, thickness * 1.1);
                wireframe.position.z = i * 0.1;
                rootGroup.add(wireframe);
            }
        }
    }
    else if (shapeType.startsWith('sphere')) {
        for (let i = 0; i < layers; i++) {
            const radius = 40 + i * 28;
            const geo = new THREE.SphereGeometry(radius, 24, 18);
            let layerMesh = isFilled ? new THREE.Mesh(geo, solidMaterial) : createWireframeTubes(geo, thickness * 1.1);
            layerMesh.rotation.set(0.6, 0.4, 0); 
            rootGroup.add(layerMesh);
        }
    }
    else if (shapeType === 'crystal8') {
        const geoOuter = new THREE.OctahedronGeometry(95, 0);
        const geoInner = new THREE.OctahedronGeometry(50, 0);

        let layerOuter = isFilled ? new THREE.Mesh(geoOuter, solidMaterial) : createWireframeTubes(geoOuter, thickness * 1.1);
        let layerInner = isFilled ? new THREE.Mesh(geoInner, pureFlatMaterial) : createWireframeTubes(geoInner, Math.max(2.0, thickness * 0.9));

        layerOuter.rotation.set(Math.PI / 4, 0, Math.PI / 4);
        layerInner.rotation.set(Math.PI / 4, 0, Math.PI / 4);

        rootGroup.add(layerOuter, layerInner);
    }
    else if (shapeType === 'torusKnot') {
        const geoKnot = new THREE.TorusKnotGeometry(55, 15, 128, 16);
        let meshKnot = isFilled ? new THREE.Mesh(geoKnot, solidMaterial) : createWireframeTubes(geoKnot, thickness * 1.1);
        rootGroup.add(meshKnot);
    }
    else if (shapeType === 'nested_dodeca') {
        const geoOuter = new THREE.DodecahedronGeometry(88, 0);
        const geoInner = new THREE.DodecahedronGeometry(46, 0);

        let layerOuter = isFilled ? new THREE.Mesh(geoOuter, solidMaterial) : createWireframeTubes(geoOuter, thickness * 1.1);
        let layerInner = isFilled ? new THREE.Mesh(geoInner, pureFlatMaterial) : createWireframeTubes(geoInner, Math.max(2.0, thickness * 0.9));

        layerOuter.rotation.set(0.2, 0.3, 0);
        layerInner.rotation.set(-0.2, -0.3, 0);

        rootGroup.add(layerOuter, layerInner);
    }
    else if (shapeType === 'text') {
        const unitGroup = new THREE.Group();
        const canvas = document.createElement('canvas');
        canvas.width = 512; 
        canvas.height = 160; 
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 512, 160);
        ctx.fillStyle = 'white'; 
        ctx.font = '900 88px "Montserrat", monospace';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        
        ctx.fillText((textStr || 'H O T V').substring(0, 9), 256, 80); 
        
        const imgData = ctx.getImageData(0, 0, 512, 160).data;
        const voxelSize = Math.max(2.0, thickness * 0.35);
        const boxGeo = new THREE.BoxGeometry(voxelSize * 1.4, voxelSize * 1.4, voxelSize * 2.5); 

        for (let y = 0; y < 160; y += 3) {
            for (let x = 0; x < 512; x += 3) {
                const i = (y * 512 + x) * 4;
                if (imgData[i] > 140) {
                    const mesh = new THREE.Mesh(boxGeo, pureFlatMaterial);
                    mesh.position.set((x - 256) * 0.72, (80 - y) * 0.72, 0);
                    unitGroup.add(mesh);
                }
            }
        }
        rootGroup.add(unitGroup);
    }

    return rootGroup;
}
