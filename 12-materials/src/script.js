import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Textures
 */

const imageLoader = new THREE.ImageLoader();
const doorColorTexture = imageLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = imageLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = imageLoader.load(
  '/textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = imageLoader.load('/textures/door/height.jpg');
const doorMetalnessTexture = imageLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = imageLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = imageLoader.load('/textures/door/roughness.jpg');

const gradientTexture = imageLoader.load('/textures/gradients/3.jpg');
const matcapTexture = imageLoader.load('/textures/matcaps/1.png');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

const material = new THREE.MeshBasicMaterial({
  // color: 0x00ff00,
  // side: THREE.DoubleSide,
  // map: doorColorTexture,
});
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.3, 16, 32), material);

sphere.position.x = -2;
torus.position.x = 3;

scene.add(sphere, plane, torus);

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

  // Update controls
  controls.update();

  // Update objects
  sphere.rotation.x = elapsedTime * 0.15;
  plane.rotation.x = elapsedTime * 0.15;
  torus.rotation.x = elapsedTime * 0.15;

  sphere.rotation.y = elapsedTime * 0.1;
  plane.rotation.y = elapsedTime * 0.1;
  torus.rotation.y = elapsedTime * 0.1;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
