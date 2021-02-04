import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 400 });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */

// Ambient light
const ambientLight = new THREE.AmbientLight(0xff00ff, 0.4);
// const ambientLight = new THREE.AmbientLight();
// ambientLight.color = new THREE.Color(0xff00ff);
// ambientLight.intensity = 0.5;
// scene.add(ambientLight);

gui
  .add(ambientLight, 'intensity')
  .min(0)
  .max(1)
  .step(0.05)
  .name('Ambient light: Intensity');

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffff00, 0.55);
directionalLight.position.set(1, 0.25, 0);
// scene.add(directionalLight);

// Hemisphere
const hemisphereLight = new THREE.HemisphereLight(0xffff00, 0x0000ff, 0.3);
// scene.add(hemisphereLight);

// Point light
const pointLight = new THREE.PointLight(0xff9000, 0.5, 3);
pointLight.position.set(0, 0.3, 0.8);
// scene.add(pointLight);

// Rect area light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 3, 1);
// rectAreaLight.position.set(0, 1, 0);
rectAreaLight.position.set(1, -0.5, 1);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

const spotLight = new THREE.SpotLight(
  0xff00ff,
  0.6,
  10,
  Math.PI * 0.01,
  0.2,
  1
);
spotLight.position.set(0, 2, 3);
scene.add(spotLight);

spotLight.target.position.x = -1.5;
scene.add(spotLight.target);

gui
  .add(rectAreaLight, 'intensity')
  .min(0)
  .max(20)
  .step(0.05)
  .name('Rect area light: Intensity');

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Objects
const sphere = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.5, 32, 32),
  material
);
sphere.position.x = -1.5;

const cube = new THREE.Mesh(
  new THREE.BoxBufferGeometry(0.75, 0.75, 0.75),
  material
);

const torus = new THREE.Mesh(
  new THREE.TorusBufferGeometry(0.3, 0.15, 32, 64),
  material
);
torus.position.x = 1.5;

const plane = new THREE.Mesh(new THREE.PlaneBufferGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update objects
  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
