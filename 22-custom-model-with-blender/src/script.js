import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
// import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as dat from 'dat.gui';

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Test sphere
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial()
);
scene.add(sphere);

/**
 * Models
 */
gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
  //   console.log(gltf);
  gltf.scene.scale.set(10, 10, 10);
  gltf.scene.position.set(0, -4, 0);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);

  gui
    .add(gltf.scene.rotation, 'y')
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name('rotation');
});

/**
 * Lights
 */
const directionalLight = new THREE.DirectionalLight('#FFFFFF', 1);
directionalLight.position.set(0.25, 3, -2.25);
scene.add(directionalLight);

gui
  .add(directionalLight, 'intensity')
  .min(0)
  .max(10)
  .step(0.001)
  .name('lightIntensity');

gui
  .add(directionalLight.position, 'x')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('lightX');
gui
  .add(directionalLight.position, 'y')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('lightY');
gui
  .add(directionalLight.position, 'z')
  .min(-5)
  .max(5)
  .step(0.001)
  .name('lightZ');

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 1, 0);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// renderer.physicallyCorrectLights = true;

/**
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
