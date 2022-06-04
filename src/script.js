import * as THREE from "three";
import SceneManager from "./scenemanager.js";
import CharacterController from "charactercontroller";

const fpsDisplay = document.getElementById("fps");
let elapsedTime;
let deltaTime;

const scene = new THREE.Scene();

const sceneManager = new SceneManager(scene);

let controller = new CharacterController(scene, {});

scene.add(controller.player);
controller.player.position.z = 10;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement)

document.addEventListener("click", () => {
    const canvas = renderer.domElement;

    canvas.requestPointerLock =
        canvas.requestPointerLock ||
        canvas.mozRequestPointerLock;

    canvas.requestPointerLock()
})

function updateFps(delta) {
    fpsDisplay.innerHTML = `${parseInt(1 / delta)} FPS`;
    setTimeout(() => updateFps(deltaTime), 100);
}
updateFps(deltaTime)

function animate() {
    requestAnimationFrame(animate);

    const t = controller.update();
    elapsedTime = t.elapsed;
    deltaTime = t.delta

    sceneManager.animateScene(elapsedTime);
    
    renderer.render(scene, controller.player.children[0]);
};

animate();

window.addEventListener("resize", () => {
    controller.player.children[0].aspect = window.innerWidth / window.innerHeight;
    controller.player.children[0].updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
