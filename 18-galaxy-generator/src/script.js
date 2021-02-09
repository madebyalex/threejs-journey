import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { PointsMaterial } from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {};
parameters.count = 10000;
parameters.size = 0.02;

const generateGalaxy = () => {
  /**
   * Geometry
   */
  const galaxyGeometry = new THREE.BufferGeometry();

  const positionsArray = new Float32Array(parameters.count * 3);

  // Filling the position's array with random positions
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    positionsArray[i3] = (Math.random() - 0.5) * 10;
    positionsArray[i3 + 1] = (Math.random() - 0.5) * 10;
    positionsArray[i3 + 2] = (Math.random() - 0.5) * 10;
  }

  galaxyGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positionsArray, 3)
  );

  /**
   * Material
   */
  const galaxyMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: true,
    blending: THREE.AdditiveBlending,
    // color: '#FFFFFF',
  });

  /**
   * Points
   */
  const points = new THREE.Points(galaxyGeometry, galaxyMaterial);
  scene.add(points);
};

generateGalaxy();

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
camera.position.x = 3;
camera.position.y = 3;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
