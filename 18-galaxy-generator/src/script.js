import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import { PointsMaterial } from 'three';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 320 });

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {};
parameters.count = 100000;
parameters.size = 0.01;
// parameters.color = '#FF5588';
parameters.radius = 5;
parameters.branches = 3;
parameters.spin = 1;
parameters.randomness = 0.2;
parameters.randomnessPower = 3;
parameters.insideColor = '#FF6030';
parameters.outsideColor = '#197eff';

// gui.addColor(parameters, 'color').onChange(() => {
//   galaxyMaterial.color.set(parameters.color);
// });

let galaxyGeometry = null;
let galaxyMaterial = null;
let galaxyPoints = null;

const generateGalaxy = () => {
  /**
   * Destroy old galaxy
   */
  if (galaxyPoints !== null) {
    galaxyGeometry.dispose();
    galaxyMaterial.dispose();
    scene.remove(galaxyPoints);
  }

  /**
   * Geometry
   */
  galaxyGeometry = new THREE.BufferGeometry();

  const positionsArray = new Float32Array(parameters.count * 3);
  const colorsArray = new Float32Array(parameters.count * 3);

  const colorInside = new THREE.Color(parameters.insideColor);
  const colorOutside = new THREE.Color(parameters.outsideColor);

  // Filling the position's array with random positions
  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    // Position
    const radius = Math.random() * parameters.radius;
    const spinAngle = radius * parameters.spin;
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1);

    positionsArray[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
    positionsArray[i3 + 1] = randomY;
    positionsArray[i3 + 2] =
      Math.sin(branchAngle + spinAngle) * radius + randomZ;

    // Color
    const mixedColor = colorInside.clone();
    mixedColor.lerp(colorOutside, radius / parameters.radius);

    colorsArray[i3] = mixedColor.r;
    colorsArray[i3 + 1] = mixedColor.g;
    colorsArray[i3 + 2] = mixedColor.b;
  }

  galaxyGeometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positionsArray, 3)
  );

  galaxyGeometry.setAttribute(
    'color',
    new THREE.BufferAttribute(colorsArray, 3)
  );

  /**
   * Material
   */
  galaxyMaterial = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    // color: parameters.color,
    vertexColors: true,
  });

  /**
   * Points
   */
  galaxyPoints = new THREE.Points(galaxyGeometry, galaxyMaterial);
  scene.add(galaxyPoints);
};

generateGalaxy();

gui
  .add(parameters, 'count')
  .step(100)
  .min(100)
  .max(1000000)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, 'size')
  .step(0.001)
  .min(0.001)
  .max(0.1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, 'radius')
  .step(0.01)
  .min(0.01)
  .max(20)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, 'branches')
  .step(1)
  .min(2)
  .max(12)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, 'spin')
  .step(0.1)
  .min(-5)
  .max(5)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, 'randomness')
  .step(0.001)
  .min(0)
  .max(2)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, 'randomnessPower')
  .step(0.001)
  .min(1)
  .max(10)
  .onFinishChange(generateGalaxy);

gui.addColor(parameters, 'insideColor').onFinishChange(generateGalaxy);

gui.addColor(parameters, 'outsideColor').onFinishChange(generateGalaxy);

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
  controls.autoRotate = true;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
