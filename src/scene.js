import * as THREE from "three";

let boxMesh;
let sphereMesh;
let torusKnotMesh;

export function arrangeScene(scene) {
    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xF8C8DC });
    const normalMaterial = new THREE.MeshNormalMaterial();
    
    const floorGeometry = new THREE.PlaneGeometry(15, 15);
    const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
    scene.add(floorMesh);
    
    const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
    boxMesh = new THREE.Mesh(boxGeometry, normalMaterial);
    scene.add(boxMesh)
    boxMesh.position.set(-3, 3, 1)
    
    const torusGeometry = new THREE.TorusGeometry(0.75, 0.15, 16, 100);
    const torusMesh = new THREE.Mesh(torusGeometry, normalMaterial);
    scene.add(torusMesh);
    torusMesh.position.set(3, -3, 0.5);

    const sphereGeometry = new THREE.SphereGeometry(0.6, 64, 32);
    sphereMesh = new THREE.Mesh(sphereGeometry, normalMaterial);
    scene.add(sphereMesh);
    sphereMesh.position.set(3, 3, 1);

    const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 100, 16);
    torusKnotMesh = new THREE.Mesh(torusKnotGeometry, normalMaterial);
    scene.add(torusKnotMesh);
    torusKnotMesh.position.set(-3, -3, 0.8);
}

export function animateScene(time) {
    boxMesh.rotation.x = boxMesh.rotation.y = boxMesh.rotation.z = time;

    sphereMesh.scale.setScalar(Math.sin(time) * 0.5 + 1);

    torusKnotMesh.position.z = Math.sin(time) * 0.5 + 1;
}
