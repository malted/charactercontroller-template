import * as THREE from "three";

export default class SceneManager {
    constructor(scene) {
        const floorMaterial = new THREE.MeshBasicMaterial({ color: 0xF8C8DC });
        const normalMaterial = new THREE.MeshNormalMaterial();
        
        const floorGeometry = new THREE.PlaneGeometry(15, 15);
        this.floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
        scene.add(this.floorMesh);
        
        const boxGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        this.boxMesh = new THREE.Mesh(boxGeometry, normalMaterial);
        scene.add(this.boxMesh)
        this.boxMesh.position.set(-3, 3, 1)
        
        const torusGeometry = new THREE.TorusGeometry(0.75, 0.15, 16, 100);
        this.torusMesh = new THREE.Mesh(torusGeometry, normalMaterial);
        scene.add(this.torusMesh);
        this.torusMesh.position.set(3, -3, 0.5);
    
        const sphereGeometry = new THREE.SphereGeometry(0.6, 64, 32);
        this.sphereMesh = new THREE.Mesh(sphereGeometry, normalMaterial);
        scene.add(this.sphereMesh);
        this.sphereMesh.position.set(3, 3, 1);
    
        const torusKnotGeometry = new THREE.TorusKnotGeometry(0.5, 0.1, 100, 16);
        this.torusKnotMesh = new THREE.Mesh(torusKnotGeometry, normalMaterial);
        scene.add(this.torusKnotMesh);
        this.torusKnotMesh.position.set(-3, -3, 0.8);
    }

    animateScene(time) {
        this.boxMesh.rotation.x = this.boxMesh.rotation.y = this.boxMesh.rotation.z = time;
        this.sphereMesh.scale.setScalar(Math.sin(time) * 0.5 + 1);
        this.torusKnotMesh.position.z = Math.sin(time) * 0.5 + 1;
    }
}