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
scene.background = new THREE.Color(0x191429);

// Fog
function addFog() {
  scene.fog = new THREE.Fog(0x191429, 0.015, 20);
}

addFog();

/**
 * Water
 */
// Geometry
const waterGeometry = new THREE.PlaneGeometry(5, 5, 512, 512);

// Settings
// debugObject.uBigWavesElevation = 0.753;
// debugObject.uBigWavesFrequencyX = 9.687;
// debugObject.uBigWavesFrequencyY = 7.993;
// debugObject.uBigWavesSpeed = 0.735;
// debugObject.depthColor = '#f554c1';
// debugObject.surfaceColor = '#f25ab1';

debugObject.uBigWavesElevation = 0.06;
debugObject.uBigWavesFrequencyX = 4;
debugObject.uBigWavesFrequencyY = 1.5;
debugObject.uBigWavesSpeed = 1;

debugObject.uSmallWavesElevation = 0.15;
debugObject.uSmallWavesFrequency = 3;
debugObject.uSmallWavesSpeed = 0.2;
debugObject.uSmallWavesIterations = 3;

// debugObject.depthColor = '#3a1bd7';
// debugObject.surfaceColor = '#ed51ed';
debugObject.depthColor = '#186691';
debugObject.surfaceColor = '#9bd8ff';
debugObject.colorOffset = 0.08;
debugObject.colorMultiplier = 7.8;

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

    uSmallWavesElevation: { value: debugObject.uSmallWavesElevation },
    uSmallWavesFrequency: { value: debugObject.uSmallWavesFrequency },
    uSmallWavesSpeed: { value: debugObject.uSmallWavesSpeed },
    uSmallWavesIterations: { value: debugObject.uSmallWavesIterations },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: debugObject.colorOffset },
    uColorMultiplier: { value: debugObject.colorMultiplier },
  },
});

// Debug

// Big waves
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

// Small waves
gui
  .add(waterMaterial.uniforms.uSmallWavesElevation, 'value')
  .min(0)
  .max(1)
  .step(0.001)
  .name('uSmallWavesElevation');
gui
  .add(waterMaterial.uniforms.uSmallWavesFrequency, 'value')
  .min(0)
  .max(30)
  .step(0.01)
  .name('uSmallWavesFrequency');
gui
  .add(waterMaterial.uniforms.uSmallWavesSpeed, 'value')
  .min(0)
  .max(4)
  .step(0.01)
  .name('uSmallWavesSpeed');
gui
  .add(waterMaterial.uniforms.uSmallWavesIterations, 'value')
  .min(0)
  .max(4)
  .step(1)
  .name('uSmallWavesIterations');

// Colors
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
