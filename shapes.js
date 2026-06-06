// shapes.js - AXP Fusion Dynamics: WebGL 3D 臨床高階醫療版 (v20.0 - Performance Optimized)
// 徹底移除不必要的複雜干擾圖形，極致優化 3D 幾何記憶體佔用與粒子文字共用材質

import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js';
// 備註：若使用 CDN r128，全域已有 THREE，此處的 import 在模組化環境中可確保相容性
// 在你的 index.html 中已經透過 <script> 引入了 THREE，因此也可以直接使用全域的 THREE。

// 🚀 建立具有物理粗細的實體線框管 (突破 WebGL 1px 限制，確保濾光鏡下的最高對比度)
function createWireframeTubes(geometry, thickness) {
    const edges = new THREE.EdgesGeometry(geometry);
    const pos = edges.attributes.position;
    const group = new THREE.Group();
    
    const size = Math.max(0.5, thickness * 0.15); 
    // 共用 Geometry 與 Material，大幅減少 WebGL Draw Calls 與記憶體負擔
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

export function createTarget(shapeType, colorHex, isFilled, textStr, thickness) {
    const rootGroup = new THREE.Group();
    
    let layers = 1;
    if (shapeType.includes('5')) layers = 5;
    if (shapeType.includes('3')) layers = 3;

    // 🚀 標準 PBR 物理材質：產生自然的立體陰影漸層
    const solidMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff, 
        roughness: 0.5, 
        metalness: 0.2,
        side: THREE.DoubleSide
    });
    
    // 🚀 SILO 專用高光晶球材質：超低粗糙、超高反射，創造極度銳利的反光點
    const glossyMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        roughness: 0.08,  // 鏡面反光
        metalness: 0.85,  // 金屬核心質感
        side: THREE.DoubleSide
    });

    const lineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });

    if (shapeType.startsWith('circle')) {
        for (let i = 0; i < layers; i++) {
            const radius = 30 + i * 30;
            let mesh;
            if (isFilled) {
                const geo = new THREE.CircleGeometry(radius, 64);
                mesh = new THREE.Mesh(geo, solidMaterial);
            } else {
                const geo = new THREE.TorusGeometry(radius, Math.max(1, thickness * 0.5), 16, 64);
                mesh = new THREE.Mesh(geo, solidMaterial);
            }
            mesh.position.z = i * 0.1;
            rootGroup.add(mesh);
        }
    }
    else if (shapeType === 'glossysphere') {
        // 🚀 執行長專屬：SILO 專用高光實體晶球 (單層、極高面數、完美光滑)
        const radius = 70;
        const geo = new THREE.SphereGeometry(radius, 64, 64); // 超高網格面數
        const mesh = new THREE.Mesh(geo, glossyMaterial);
        mesh.rotation.set(0.5, 0.5, 0);
        rootGroup.add(mesh);
    }
    else if (shapeType.startsWith('star')) {
        for (let i = 0; i < layers; i++) {
            const outer = 40 + i * 30;
            const inner = outer * 0.4;
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
            const radius = 40 + i * 30;
            const geo = new THREE.SphereGeometry(radius, 24, 18);
            let layerMesh;
            
            if (isFilled) layerMesh = new THREE.Mesh(geo, solidMaterial);
            else layerMesh = createWireframeTubes(geo, thickness);
            
            layerMesh.rotation.set(0.6, 0.4, 0); 
            rootGroup.add(layerMesh);
        }
    }
    else if (shapeType.startsWith('rock')) {
        const rockLayers = Math.min(layers, 3); 
        for (let i = 0; i < rockLayers; i++) {
            const radius = 50 + i * 45;
            const geo = new THREE.IcosahedronGeometry(radius, 1);
            
            const pos = geo.attributes.position;
            const vec = new THREE.Vector3();
            for (let v = 0; v < pos.count; v++) {
                vec.fromBufferAttribute(pos, v);
                const noise = 1 + (Math.random() - 0.5) * 0.35; 
                vec.normalize().multiplyScalar(radius * noise);
                pos.setXYZ(v, vec.x, vec.y, vec.z);
            }
            geo.computeVertexNormals();

            let layerMesh;
            if (isFilled) layerMesh = new THREE.Mesh(geo, solidMaterial);
            else layerMesh = createWireframeTubes(geo, thickness);
            
            layerMesh.rotation.set(Math.random() * 2, Math.random() * 2, 0);
            rootGroup.add(layerMesh);
        }
    }
    else if (shapeType === 'text') {
        // 🚀 高解析度立體文字 (256x64)：支援 12 字元長字串渲染與隨機動態字庫
        const canvas = document.createElement('canvas');
        canvas.width = 256; 
        canvas.height = 64; 
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black'; ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = 'white'; 
        ctx.font = 'bold 36px monospace';
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';
        
        ctx.fillText((textStr || 'AXP').substring(0, 12), 128, 32); 
        
        const imgData = ctx.getImageData(0, 0, 256, 64).data;
        const radius = Math.max(1.0, thickness * 0.25);
        
        // 粒子共用幾何與材質，避免 Memory Leak
        const boxGeo = new THREE.BoxGeometry(radius*2, radius*2, radius*5); 

        const textGroup = new THREE.Group(); 
        for (let y = 0; y < 64; y += 2) {
            for (let x = 0; x < 256; x += 2) {
                const i = (y * 256 + x) * 4;
                if (imgData[i] > 128) {
                    const mesh = new THREE.Mesh(boxGeo, lineMaterial);
                    const depth = (Math.random() - 0.5) * 15; 
                    // 粒子原點置中對齊
                    mesh.position.set((x - 128) * 1.2, (32 - y) * 1.2, depth);
                    textGroup.add(mesh);
                }
            }
        }
        textGroup.scale.set(1.0, 1.0, 1.0);
        rootGroup.add(textGroup);
    }

    return rootGroup;
}