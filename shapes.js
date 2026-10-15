// shapes.js - AXP Fusion Dynamics: WebGL 3D 臨床視覺幾何工廠 (v24.0)
// 核心升級：1. 新增雙眼互補破抑制視標 (dichoptic_lock / dichoptic_cross) ｜ 2. 清晰大尺寸立體文字 (512x160 無深度雜訊)

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

function createWireframeTubes(geometry, thickness) {
    const edges = new THREE.EdgesGeometry(geometry);
    const pos = edges.attributes.position;
    const group = new THREE.Group();
    
    const size = Math.max(0.6, thickness * 0.16); 
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

// eyeSide: 'left' | 'right' | 'both'，用於生成左右眼互補之破抑制視標
export function createTarget(shapeType, colorHex, isFilled, textStr, thickness, eyeSide = 'both') {
    const rootGroup = new THREE.Group();
    
    let layers = 1;
    if (shapeType.includes('5')) layers = 5;
    if (shapeType.includes('3')) layers = 3;

    const solidMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0.45, 
        metalness: 0.25,
        side: THREE.DoubleSide
    });
    
    const glossyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.08,
        metalness: 0.85,
        side: THREE.DoubleSide
    });

    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // =========================================================================
    // 🔬 黑科技一：雙眼互補對位鎖 (Dichoptic Anti-Suppression Lock)
    // 左眼僅見「外圍八角準星環＋上下垂直定位線」；右眼僅見「中央立體晶核＋左右水平定位線」
    // 唯有雙眼同時不抑制且融像對位，才能拼出完整準星鎖定畫面！
    // =========================================================================
    if (shapeType === 'dichoptic_lock') {
        const barThick = Math.max(3, thickness * 0.7);
        if (eyeSide === 'left') {
            // 左眼：外圍雙層準星環 + 上下垂直對位錨點
            const outerRing = new THREE.Mesh(new THREE.TorusGeometry(115, barThick * 0.7, 16, 8), solidMaterial);
            const midRing = new THREE.Mesh(new THREE.TorusGeometry(85, barThick * 0.45, 16, 64), solidMaterial);
            const topTick = new THREE.Mesh(new THREE.BoxGeometry(barThick, 38, barThick), lineMaterial);
            const botTick = new THREE.Mesh(new THREE.BoxGeometry(barThick, 38, barThick), lineMaterial);
            topTick.position.set(0, 115, 0);
            botTick.position.set(0, -115, 0);
            rootGroup.add(outerRing, midRing, topTick, botTick);
        } else if (eyeSide === 'right') {
            // 右眼：中央立體八面晶核 + 左右水平對位錨點
            const coreGeo = new THREE.OctahedronGeometry(52, 0);
            const coreMesh = isFilled ? new THREE.Mesh(coreGeo, glossyMaterial) : createWireframeTubes(coreGeo, thickness);
            const leftTick = new THREE.Mesh(new THREE.BoxGeometry(38, barThick, barThick), lineMaterial);
            const rightTick = new THREE.Mesh(new THREE.BoxGeometry(38, barThick, barThick), lineMaterial);
            leftTick.position.set(-115, 0, 0);
            rightTick.position.set(115, 0, 0);
            rootGroup.add(coreMesh, leftTick, rightTick);
        }
    }
    // 🔬 黑科技二：雙眼互補十字準星 (Dichoptic Crosshair)
    else if (shapeType === 'dichoptic_cross') {
        const barW = Math.max(4, thickness * 0.8);
        // 雙眼共視之最外圍穩定圓環 (Peripheral Lock)
        const commonRing = new THREE.Mesh(new THREE.TorusGeometry(125, barW * 0.5, 16, 64), solidMaterial);
        rootGroup.add(commonRing);

        if (eyeSide === 'left') {
            // 左眼負責垂直軸線與內圈方框
            const vLine = new THREE.Mesh(new THREE.BoxGeometry(barW, 180, barW), lineMaterial);
            rootGroup.add(vLine);
        } else if (eyeSide === 'right') {
            // 右眼負責水平軸線與中心圓點
            const hLine = new THREE.Mesh(new THREE.BoxGeometry(180, barW, barW), lineMaterial);
            const centerDot = new THREE.Mesh(new THREE.SphereGeometry(16, 24, 24), glossyMaterial);
            rootGroup.add(hLine, centerDot);
        }
    }
    else if (shapeType.startsWith('circle')) {
        for (let i = 0; i < layers; i++) {
            const radius = 32 + i * 28;
            let mesh;
            if (isFilled) {
                const geo = new THREE.CircleGeometry(radius, 64);
                mesh = new THREE.Mesh(geo, solidMaterial);
            } else {
                const geo = new THREE.TorusGeometry(radius, Math.max(1.5, thickness * 0.55), 16, 64);
                mesh = new THREE.Mesh(geo, solidMaterial);
            }
            mesh.position.z = i * 0.1;
            rootGroup.add(mesh);
        }
    }
    else if (shapeType === 'glossysphere') {
        const radius = 85;
        const geo = new THREE.SphereGeometry(radius, 64, 64);
        const mesh = new THREE.Mesh(geo, glossyMaterial);
        mesh.rotation.set(0.5, 0.5, 0);
        rootGroup.add(mesh);
    }
    else if (shapeType.startsWith('star')) {
        for (let i = 0; i < layers; i++) {
            const outer = 42 + i * 28;
            const inner = outer * 0.45;
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
                const wireframe = createWireframeTubes(geo, thickness);
                wireframe.position.z = i * 0.1;
                rootGroup.add(wireframe);
            }
        }
    }
    else if (shapeType.startsWith('sphere')) {
        for (let i = 0; i < layers; i++) {
            const radius = 38 + i * 28;
            const geo = new THREE.SphereGeometry(radius, 24, 18);
            let layerMesh = isFilled ? new THREE.Mesh(geo, solidMaterial) : createWireframeTubes(geo, thickness);
            layerMesh.rotation.set(0.6, 0.4, 0); 
            rootGroup.add(layerMesh);
        }
    }
    else if (shapeType === 'crystal8') {
        const geoOuter = new THREE.OctahedronGeometry(95, 0);
        const geoInner = new THREE.OctahedronGeometry(48, 0);

        let layerOuter = isFilled ? new THREE.Mesh(geoOuter, solidMaterial) : createWireframeTubes(geoOuter, thickness);
        let layerInner = isFilled ? new THREE.Mesh(geoInner, glossyMaterial) : createWireframeTubes(geoInner, Math.max(1.5, thickness * 0.75));

        layerOuter.rotation.set(Math.PI / 4, 0, Math.PI / 4);
        layerInner.rotation.set(Math.PI / 4, 0, Math.PI / 4);

        rootGroup.add(layerOuter, layerInner);
    }
    else if (shapeType === 'torusKnot') {
        const geoKnot = new THREE.TorusKnotGeometry(55, 14, 128, 16);
        let meshKnot = isFilled ? new THREE.Mesh(geoKnot, solidMaterial) : createWireframeTubes(geoKnot, thickness);
        rootGroup.add(meshKnot);
    }
    else if (shapeType === 'nested_dodeca') {
        const geoOuter = new THREE.DodecahedronGeometry(88, 0);
        const geoInner = new THREE.DodecahedronGeometry(44, 0);

        let layerOuter = isFilled ? new THREE.Mesh(geoOuter, solidMaterial) : createWireframeTubes(geoOuter, thickness);
        let layerInner = isFilled ? new THREE.Mesh(geoInner, glossyMaterial) : createWireframeTubes(geoInner, Math.max(1.5, thickness * 0.8));

        layerOuter.rotation.set(0.2, 0.3, 0);
        layerInner.rotation.set(-0.2, -0.3, 0);

        rootGroup.add(layerOuter, layerInner);
    }
    else if (shapeType === 'text') {
        // 🚀 全面升級：清晰大尺寸立體視標文字 (512x160 畫布，消除隨機深度毛刺，字體放大 3.5 倍)
        const canvas = document.createElement('canvas');
        canvas.width = 512; 
        canvas.height = 160; 
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, 512, 160);
        ctx.fillStyle = 'white'; 
        ctx.font = '900 84px "Montserrat", monospace';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        
        ctx.fillText((textStr || 'H O T V').substring(0, 9), 256, 80); 
        
        const imgData = ctx.getImageData(0, 0, 512, 160).data;
        const voxelSize = Math.max(1.8, thickness * 0.32);
        const boxGeo = new THREE.BoxGeometry(voxelSize * 1.4, voxelSize * 1.4, voxelSize * 3.0); 

        const textGroup = new THREE.Group(); 
        for (let y = 0; y < 160; y += 3) {
            for (let x = 0; x < 512; x += 3) {
                const i = (y * 512 + x) * 4;
                if (imgData[i] > 140) {
                    const mesh = new THREE.Mesh(boxGeo, lineMaterial);
                    // 移除舊版會弄糊字體的隨機 Z 軸雜訊，改為平整銳利的立體字塊
                    mesh.position.set((x - 256) * 0.72, (80 - y) * 0.72, 0);
                    textGroup.add(mesh);
                }
            }
        }
        rootGroup.add(textGroup);
    }

    return rootGroup;
}
