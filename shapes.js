// shapes.js - AXP Fusion Dynamics: WebGL 3D 淨化版 (v15.1 移除十字版)

function createWireframeTubes(geometry, thickness) {
    const edges = new THREE.EdgesGeometry(geometry);
    const pos = edges.attributes.position;
    const group = new THREE.Group();
    
    const size = Math.max(0.5, thickness * 0.15); 
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

    if (shapeType.startsWith('circle')) {
        for (let i = 0; i < layers; i++) {
            const radius = 30 + i * 30;
            let mesh;
            if (isFilled) {
                const geo = new THREE.CircleGeometry(radius, 64);
                mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
            } else {
                const geo = new THREE.TorusGeometry(radius, Math.max(1, thickness * 0.5), 16, 64);
                mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
            }
            mesh.position.z = i * 0.1;
            rootGroup.add(mesh);
        }
    }
    else if (shapeType.startsWith('star') && !shapeType.includes('tunnel')) {
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
                const mesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
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
            const geo = new THREE.SphereGeometry(radius, 16, 12);
            let layerMesh;
            
            if (isFilled) layerMesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
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
            if (isFilled) layerMesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
            else layerMesh = createWireframeTubes(geo, thickness);
            
            layerMesh.rotation.set(Math.random() * 2, Math.random() * 2, 0);
            rootGroup.add(layerMesh);
        }
    }
    else if (shapeType.startsWith('startunnel')) {
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
            
            const geo = new THREE.ExtrudeGeometry(starShape, { depth: 15, bevelEnabled: false });
            geo.center();
            
            const pos = geo.attributes.position;
            for (let v = 0; v < pos.count; v++) {
                const x = pos.getX(v), y = pos.getY(v), z = pos.getZ(v);
                const angle = z * 0.02; 
                const nx = x * Math.cos(angle) - y * Math.sin(angle);
                const ny = x * Math.sin(angle) + y * Math.cos(angle);
                pos.setXY(v, nx, ny);
            }
            geo.computeVertexNormals();

            let layerMesh;
            if (isFilled) layerMesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial());
            else layerMesh = createWireframeTubes(geo, thickness);
            
            layerMesh.position.z = -i * 25; 
            rootGroup.add(layerMesh);
        }
    }
    else if (shapeType === 'text') {
        const canvas = document.createElement('canvas');
        canvas.width = 64; canvas.height = 32;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = 'black'; ctx.fillRect(0, 0, 64, 32);
        ctx.fillStyle = 'white'; 
        ctx.font = 'bold 22px monospace';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText((textStr || 'AXP').substring(0, 4), 32, 16); 
        
        const imgData = ctx.getImageData(0, 0, 64, 32).data;
        const radius = Math.max(1.0, thickness * 0.25);
        const boxGeo = new THREE.BoxGeometry(radius*2, radius*2, radius*5); 
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });

        const textGroup = new THREE.Group(); 
        for (let y = 0; y < 32; y += 2) {
            for (let x = 0; x < 64; x += 2) {
                const i = (y * 64 + x) * 4;
                if (imgData[i] > 128) {
                    const mesh = new THREE.Mesh(boxGeo, mat);
                    const depth = (Math.random() - 0.5) * 15; 
                    mesh.position.set((x - 32) * 2.5, (16 - y) * 2.5, depth);
                    textGroup.add(mesh);
                }
            }
        }
        textGroup.scale.set(1.5, 1.5, 1.5);
        rootGroup.add(textGroup);
    }

    return rootGroup;
}