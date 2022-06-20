The aim of this guide is to walk you through creating a minimal scene using the `CharacterController` package.

First of all, we need to set up our devlopment environment. I'm going to use the Parcel bundler for this guide, as it's based as fuck and requires zero configuration.

Let's install it.
```npm
npm install --save-dev parcel
```

Next, we need to install the `charactercontroller` package.
```npm
npm install charactercontroller
```

Once we have all our packages installed, we can go ahead and start the parcel development server. This will give us a port on localhost to view our page, as well as automatically reloading the page when we make a change in the code.
```
npx parcel index.html
```

---

First, make sure you set your script tag's type to `module`. This is needed for dynamic imports (ie `import { foo } from "bar"`).

To get rid of the border around the canvas, you might like to set the margin on it to zero and make it full-width. Here's my `index.html`;
```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width">
		<title>CharacterController</title>
		<style>
			html, body, canvas {
				margin: 0;
				height: 100%;
				width: 100%;
			}
		</style>
	</head>
	
	<body>
		<script type="module" src="script.js"></script>
	</body>
</html>
```

Let's initialise a basic Three.js scene.

> This guide isn't intended to teach you about the very basics of Three.js; if you don't know what the below code does, then [go and learn it](https://threejs.org/docs/index.html#manual/en/introduction/Creating-a-scene).

```javascript
import * as THREE from "three";

const scene = new THREE.Scene();

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    
    renderer.render(scene, /* We need a camera! */);
};

animate();
```

Notice how we haven't added a camera. This is because our character controller will contain the camera that is used to render the scene. Let's add the character now.

```javascript
import * as THREE from "three";
import CharacterController from "charactercontroller";

const scene = new THREE.Scene();
const controller = new CharacterController(scene, {});
scene.add(controller);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
	
    renderer.render(scene, controller.camera);
};

animate();
```

Here, we are importing then initialising our character controller. As arguments, it takes both our scene and an obect containing settings and configuration. Let's leave that settings object blank for now; it will use the default values. Then we can add the character to our scene.
Now that we have a camera (`controller.camera`), we can use that to renderer the scene in the `animate` method too.

There's only one more thing we have to do before our character is ready to go.
Every frame, we need to tell the controller that it's time to do new calculations ready for the frame to be rendered. Some of these calculations include moving the character around if the player presses the movement keys, and moving the camera in response to the player's mouse inputs.

The `CharacterController` package makes this piss-easy. Simply call `controller.update()` in your update method.
```javascript
/// ...

function animate() {
    requestAnimationFrame(animate);

	controller.update();

    renderer.render(scene, controller.camera);
};

animate();
```


Awesome stuff. You can't see it right now because there's no frame of reference, but our character is actually plummeting down, and will do forever, because we didn't add a floor for the poor sod to stand on.
Let's fix that.

```javascript
// ...

const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
scene.add(floorMesh);

function animate() {
// ..
```


You'll notice that we can't actually see the floor we just made until we jump. When we spawn, we are actually intersecting with the floor, as we are being spawned at z level 0, but so is the floor. Let's make sure we spawn on the ground, not in it.
I'm placing the character at z level 1 because that's the height of the player (the default `floorDistance` value is 1).
```javascript
let controller = new CharacterController(scene, {});
controller.player.position.z = 1;
scene.add(controller.player);
```

> You want to know what's actually happening? You've come to the right guy.
> When the character controller is initialised, a Three.js `Group` is created, which the camera is then added to. Neither the `Group` or the camera have any inherent volume or height to them, but the player's apparent height is actually created by an invisible ray being sent out pointing down from the `Group`'s location. That ray is `floorDistance` long (an option you can pass into the character controller options object), and if the ray intersects with an object in the scene, the character stops falling. You can change the character's "height" by adjusting this value, because the character will stop being pulled down and "stand" closer/further away from the ground. Neat stuff, I know.
> When the character spawns inside the floor plane, you can't see it because the camera is perfectly aligned with the infinitely thin floor. The camera doesn't see any geometry, so doesn't render pixels to the screen. The player doesn't fall down as the ray is still technically intersecting with the floor, even if it is only 0 units away.

To wrap up, we can add some quality of life changes. Firstly, we'll resize the renderer when the window is resized. Then, we'll lock the pointer in place when the player is moving their mouse.

We will implement both of these in event listeners. I like to put event listeners at the bottom of my scripts to keep things organised, but you can put them anywhere you like as long as the values referenced within them are initialised and in scope at the point you choose.

Here's the pointer locking:
```javascript
document.addEventListener("click", () => {
    const canvas = renderer.domElement;
    canvas.requestPointerLock =
        canvas.requestPointerLock ||
        canvas.mozRequestPointerLock;
    canvas.requestPointerLock()
});
```

And the canvas resizing:
```javascript
window.addEventListener("resize", () => {
    controller.player.children[0].aspect = window.innerWidth / window.innerHeight;
    controller.player.children[0].updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
```

That's everything working now. You have a minimal Three.js scene with a `CharacterController` character moving around in your scene! Go forth and create cool shit. I'm interested to see what people will make with this, so shoot me a DM on [Twitter](https://twitter.com/ma1ted) if you make something half-decent.

Here's the full code for reference;
```javascript
import * as THREE from "three";
import CharacterController from "charactercontroller";

const scene = new THREE.Scene();
const controller = new CharacterController(scene, {});
scene.add(controller);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x00FF00 });
const floorGeometry = new THREE.PlaneGeometry(10, 10);
const floorMesh = new THREE.Mesh(floorGeometry, floorMaterial);
scene.add(floorMesh);

function animate() {
    requestAnimationFrame(animate);
    
	controller.update();
	
    renderer.render(scene, controller.camera);
};
animate();

document.addEventListener("click", () => {
    const canvas = renderer.domElement;
    canvas.requestPointerLock =
        canvas.requestPointerLock ||
        canvas.mozRequestPointerLock;
    canvas.requestPointerLock()
});

window.addEventListener("resize", () => {
    controller.camera.aspect = window.innerWidth / window.innerHeight;
    controller.camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}, false);
```
