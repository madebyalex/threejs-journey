import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 340 });
const debugObject = {};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(2, 2, 128, 128);

// Settings
// debugObject.uBigWavesElevation = 0.753;
// debugObject.uBigWavesFrequencyX = 9.687;
// debugObject.uBigWavesFrequencyY = 7.993;
// debugObject.uBigWavesSpeed = 0.735;
// debugObject.depthColor = '#f554c1';
// debugObject.surfaceColor = '#f25ab1';

debugObject.uBigWavesElevation = 0.2;
debugObject.uBigWavesFrequencyX = 4;
debugObject.uBigWavesFrequencyY = 1.5;
debugObject.uBigWavesSpeed = 0.75;
// debugObject.depthColor = '#3a1bd7';
// debugObject.surfaceColor = '#ed51ed';
debugObject.depthColor = '#186691';
debugObject.surfaceColor = '#9bd8ff';
debugObject.colorOffset = 0.122;
debugObject.colorMultiplier = 0.756;

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesElevation: { value: debugObject.uBigWavesElevation },
    uBigWavesFrequency: {
      value: new THREE.Vector2(
        debugObject.uBigWavesFrequencyX,
        debugObject.uBigWavesFrequencyY
      ),
    },
    uBigWavesSpeed: { value: debugObject.uBigWavesSpeed },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: debugObject.colorOffset },
    uColorMultiplier: { value: debugObject.colorMultiplier },
  },
});

// Debug
gui
  .add(waterMaterial.uniforms.uBigWavesElevation, 'value')
  .min(0)
  .max(1)
  .step(0.001)
  .name('uBigWavesElevation');
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, 'x')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uBigWavesFrequencyX');
gui
  .add(waterMaterial.uniforms.uBigWavesFrequency.value, 'y')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uBigWavesFrequencyY');
gui
  .add(waterMaterial.uniforms.uBigWavesSpeed, 'value')
  .min(0)
  .max(3)
  .step(0.001)
  .name('uBigWavesSpeed');
gui
  .addColor(debugObject, 'depthColor')
  .onChange((color) => {
    waterMaterial.uniforms.uDepthColor.value.set(color);
  })
  .name('depthColor');
gui
  .addColor(debugObject, 'surfaceColor')
  .onChange((color) => {
    waterMaterial.uniforms.uSurfaceColor.value.set(color);
  })
  .name('surfaceColor');
gui
  .add(waterMaterial.uniforms.uColorOffset, 'value')
  .min(0)
  .max(1)
  .step(0.001)
  .name('uColorOffset');
gui
  .add(waterMaterial.uniforms.uColorMultiplier, 'value')
  .min(0)
  .max(10)
  .step(0.001)
  .name('uColorMultiplier');

// Mesh
const water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI * 0.5;
scene.add(water);

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
camera.position.set(1, 1, 1);
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

  // Update time
  waterMaterial.uniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
