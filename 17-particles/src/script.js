import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

const parameters = {
  phiLength: 4.3,
  color: '#FF88CC',
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const objectTexture = textureLoader.load('/textures/particles/2.png');

/**
 * Object
 */

//  Geometry
const geometry = new THREE.SphereGeometry(1, 32, 32, 0, parameters.phiLength);

// Material
const material = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  color: parameters.color,
  alphaMap: objectTexture,
  transparent: true,
  depthWrite: false,
});

// Points
const particles = new THREE.Points(geometry, material);
scene.add(particles);

const updateObject = () => {
  console.log('phiLength changed!');
};

// Tweaks
gui.addColor(parameters, 'color').onChange(() => {
  material.color.set(parameters.color);
});

gui
  .add(parameters, 'phiLength')
  // .onChange(updateObject)
  .onFinishChange(() => {
    if (particles !== null) {
      geometry.dispose();
      scene.remove(particles);
    }

    geometry = new THREE.SphereGeometry(1, 32, 32, 0, parameters.phiLength);
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
  })
  .min(0)
  .max(6.3)
  .step(0.01);

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
camera.position.z = 3;
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
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
