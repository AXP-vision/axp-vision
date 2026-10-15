// shapes.js - AXP Fusion Dynamics: WebGL 3D 臨床視覺幾何工廠 (v27.0 - 十字靶加粗 300% 強效融像鎖 × 零鬼影純色版)
// 核心升級：
// 1. 徹底解決十字靶 (dichoptic_cross) 與對位鎖 (dichoptic_lock) 線條過細無法在高稜鏡下融像之問題：線條加粗 300% 並採用雙層厚環周邊鎖
// 2. 雙眼互補視標全面改用無漸層漫反射之純淨材質 (MeshBasicMaterial)，消除邊緣半透明高光引發的濾鏡鬼影

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';

function createWireframeTubes(geometry, thickness) {
    const edges = new THREE.EdgesGeometry(geometry);
    const pos = edges.attributes.position;
    const group = new THREE.Group();
    
    // 提升線框管基礎物理粗細，確保高稜鏡度下依然具備足夠的視網膜捕捉面積
    const size = Math.max(1.2, thickness * 0.24); 
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

    // 零鬼影高對比純白材質 (專供十字靶與線條使用，避免半透明陰影造成紅藍疊影)
    const pureFlatMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide
    });

    // =========================================================================
    // 🔬 升級一：加粗 300% 雙眼互補十字靶 (Dichoptic Crosshair - 高稜鏡強效融像版)
    // 採用「雙層厚實同心圓環 (雙眼共視周邊鎖) + 超粗水平與垂直十字靶 + 加大中心鎖定圓盤」
    // =========================================================================
    if (shapeType === 'dichoptic_cross') {
        const barW = Math.max(12, thickness * 2.2); // 線條直接加粗 3 倍以上
        const ringTube = Math.max(9, thickness * 1.5);

        // 1. 雙眼共視之雙層厚實外環 (提供強大的低空間頻率周邊融像拉力，高稜鏡下也能輕鬆吸住合像)
        const outerLockRing = new THREE.Mesh(new THREE.RingGeometry(130 - ringTube, 130 + ringTube, 64), pureFlatMaterial);
        const innerLockRing = new THREE.Mesh(new THREE.RingGeometry(72 - ringTube * 0.6, 72 + ringTube * 0.6, 64), pureFlatMaterial);
        rootGroup.add(outerLockRing, innerLockRing);

        if (eyeSide === 'left') {
            // 左眼通道：超粗垂直中軸柱 + 上下定位端點塊
            const vLine = new THREE.Mesh(new THREE.BoxGeometry(barW, 210, 4), pureFlatMaterial);
            const topCap = new THREE.Mesh(new THREE.BoxGeometry(barW * 2.2, barW * 0.8, 4), pureFlatMaterial);
            const botCap = new THREE.Mesh(new THREE.BoxGeometry(barW * 2.2, barW * 0.8, 4), pureFlatMaterial);
            topCap.position.set(0, 105, 0);
            botCap.position.set(0, -105, 0);
            rootGroup.add(vLine, topCap, botCap);
        } else if (eyeSide === 'right') {
            // 右眼通道：超粗水平橫軸柱 + 左右定位端點塊 + 加大實心中央圓盤
            const hLine = new THREE.Mesh(new THREE.BoxGeometry(210, barW, 4), pureFlatMaterial);
            const leftCap = new THREE.Mesh(new THREE.BoxGeometry(barW * 0.8, barW * 2.2, 4), pureFlatMaterial);
            const rightCap = new THREE.Mesh(new THREE.BoxGeometry(barW * 0.8, barW * 2.2, 4), pureFlatMaterial);
            leftCap.position.set(-105, 0, 0);
            rightCap.position.set(105, 0, 0);
            const centerDisc = new THREE.Mesh(new THREE.CircleGeometry(Math.max(22, barW * 1.6), 48), pureFlatMaterial);
            centerDisc.position.set(0, 0, 2);
            rootGroup.add(hLine, leftCap, rightCap, centerDisc);
        }
    }
    // =========================================================================
    // 🔬 升級二：加粗 300% 雙眼互補對位鎖 (Dichoptic Ring & Core Lock)
    // =========================================================================
    else if (shapeType === 'dichoptic_lock') {
        const barThick = Math.max(11, thickness * 2.0);
        // 雙眼共視之最外層穩定八角厚環 (協助高稜鏡度下快速抓回中心對位)
        const commonBaseRing = new THREE.Mesh(new THREE.RingGeometry(135 - barThick * 0.6, 135 + barThick * 0.6, 8), pureFlatMaterial);
        commonBaseRing.rotation.z = Math.PI / 8;
        rootGroup.add(commonBaseRing);

        if (eyeSide === 'left') {
            // 左眼：厚實內圓框 + 上下粗定位柱
            const midRing = new THREE.Mesh(new THREE.RingGeometry(88 - barThick * 0.7, 88 + barThick * 0.7, 64), pureFlatMaterial);
            const topTick = new THREE.Mesh(new THREE.BoxGeometry(barThick * 1.2, 52, 4), pureFlatMaterial);
            const botTick = new THREE.Mesh(new THREE.BoxGeometry(barThick * 1.2, 52, 4), pureFlatMaterial);
            topTick.position.set(0, 112, 0);
            botTick.position.set(0, -112, 0);
            rootGroup.add(midRing, topTick, botTick);
        } else if (eyeSide === 'right') {
            // 右眼：中央厚實八面晶核 + 左右粗定位柱
            const coreGeo = new THREE.OctahedronGeometry(58, 0);
            const coreMesh = isFilled ? new THREE.Mesh(coreGeo, pureFlatMaterial) : createWireframeTubes(coreGeo, thickness * 1.5);
            const leftTick = new THREE.Mesh(new THREE.BoxGeometry(52, barThick * 1.2, 4), pureFlatMaterial);
            const rightTick = new THREE.Mesh(new THREE.BoxGeometry(52, barThick * 1.2, 4), pureFlatMaterial);
            leftTick.position.set(-112, 0, 0);
            rightTick.position.set(112, 0, 0);
            rootGroup.add(coreMesh, leftTick, rightTick);
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
                const tubeW = Math.max(3.5, thickness * 0.85);
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
                const wireframe = createWireframeTubes(geo, thickness * 1.3);
                wireframe.position.z = i * 0.1;
                rootGroup.add(wireframe);
            }
        }
    }
    else if (shapeType.startsWith('sphere')) {
        for (let i = 0; i < layers; i++) {
            const radius = 40 + i * 28;
            const geo = new THREE.SphereGeometry(radius, 24, 18);
            let layerMesh = isFilled ? new THREE.Mesh(geo, solidMaterial) : createWireframeTubes(geo, thickness * 1.2);
            layerMesh.rotation.set(0.6, 0.4, 0); 
            rootGroup.add(layerMesh);
        }
    }
    else if (shapeType === 'crystal8') {
        const geoOuter = new THREE.OctahedronGeometry(95, 0);
        const geoInner = new THREE.OctahedronGeometry(50, 0);

        let layerOuter = isFilled ? new THREE.Mesh(geoOuter, solidMaterial) : createWireframeTubes(geoOuter, thickness * 1.3);
        let layerInner = isFilled ? new THREE.Mesh(geoInner, pureFlatMaterial) : createWireframeTubes(geoInner, Math.max(2.5, thickness * 1.0));

        layerOuter.rotation.set(Math.PI / 4, 0, Math.PI / 4);
        layerInner.rotation.set(Math.PI / 4, 0, Math.PI / 4);

        rootGroup.add(layerOuter, layerInner);
    }
    else if (shapeType === 'torusKnot') {
        const geoKnot = new THREE.TorusKnotGeometry(55, 15, 128, 16);
        let meshKnot = isFilled ? new THREE.Mesh(geoKnot, solidMaterial) : createWireframeTubes(geoKnot, thickness * 1.2);
        rootGroup.add(meshKnot);
    }
    else if (shapeType === 'nested_dodeca') {
        const geoOuter = new THREE.DodecahedronGeometry(88, 0);
        const geoInner = new THREE.DodecahedronGeometry(46, 0);

        let layerOuter = isFilled ? new THREE.Mesh(geoOuter, solidMaterial) : createWireframeTubes(geoOuter, thickness * 1.3);
        let layerInner = isFilled ? new THREE.Mesh(geoInner, pureFlatMaterial) : createWireframeTubes(geoInner, Math.max(2.5, thickness * 1.0));

        layerOuter.rotation.set(0.2, 0.3, 0);
        layerInner.rotation.set(-0.2, -0.3, 0);

        rootGroup.add(layerOuter, layerInner);
    }
    else if (shapeType === 'text') {
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
        const voxelSize = Math.max(2.2, thickness * 0.38);
        const boxGeo = new THREE.BoxGeometry(voxelSize * 1.5, voxelSize * 1.5, voxelSize * 3.0); 

        const textGroup = new THREE.Group(); 
        for (let y = 0; y < 160; y += 3) {
            for (let x = 0; x < 512; x += 3) {
                const i = (y * 512 + x) * 4;
                if (imgData[i] > 140) {
                    const mesh = new THREE.Mesh(boxGeo, pureFlatMaterial);
                    mesh.position.set((x - 256) * 0.72, (80 - y) * 0.72, 0);
                    textGroup.add(mesh);
                }
            }
        }
        rootGroup.add(textGroup);
    }

    return rootGroup;
}
