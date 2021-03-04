import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import waterVertexShader from './shaders/water/vertex.glsl';
import waterFragmentShader from './shaders/water/fragment.glsl';
import { DoubleSide } from 'three';

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
scene.fog = new THREE.Fog(0x191429, 0.015, 3);

/**
 * Water
 */
// Geometry
// const waterGeometry = new THREE.PlaneGeometry(10, 10, 1024, 1024);
const waterGeometry = new THREE.SphereGeometry(1, 1024, 1024);

// Settings
// debugObject.uBigWavesElevation = 0.753;
// debugObject.uBigWavesFrequencyX = 9.687;
// debugObject.uBigWavesFrequencyY = 7.993;
// debugObject.uBigWavesSpeed = 0.735;
// debugObject.depthColor = '#f554c1';
// debugObject.surfaceColor = '#f25ab1';

debugObject.uBigWavesElevation = 0.037;
debugObject.uBigWavesFrequencyX = 6.453;
debugObject.uBigWavesFrequencyY = 2.988;
debugObject.uBigWavesSpeed = 1.104;

debugObject.uSmallWavesElevation = 0.137;
debugObject.uSmallWavesFrequency = 10.35;
debugObject.uSmallWavesSpeed = 0.21;
debugObject.uSmallWavesIterations = 3;

// debugObject.depthColor = '#3a1bd7';
// debugObject.surfaceColor = '#ed51ed';
// debugObject.depthColor = '#186691';
// debugObject.surfaceColor = '#9bd8ff';
debugObject.depthColor = '#cd7008';
debugObject.surfaceColor = '#edff9b';
debugObject.colorOffset = 0.08;
debugObject.colorMultiplier = 7.3;

// Material
const waterMaterial = new THREE.ShaderMaterial({
  vertexShader: waterVertexShader,
  fragmentShader: waterFragmentShader,
  //   blending: THREE.AdditiveBlending,
  //   transparent: true,
  //   fog: true,
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

    // fogC: {
    //   type: 'c',
    //   value: new THREE.Color(0x000000),
    // },
    // viewVector: {
    //   type: 'v3',
    //   value: {
    //     x: 0,
    //     y: 0,
    //     z: 400,
    //   },
    // },
    // fogColor: {
    //   type: 'c',
    //   value: 0x000000,
    // },
    // fogFar: {
    //   type: 'f',
    //   value: 3000,
    // },
    // fogNear: {
    //   type: 'f',
    //   value: 0.015,
    // },
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
 * Lights
 */
const directionalLight = new THREE.DirectionalLight(
  '#FFFFFF',
  debugObject.lightIntensity
);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024 * 2, 1024 * 2);
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);

// const directionalLightHelper = new THREE.CameraHelper(
//   directionalLight.shadow.camera
// );
// scene.add(directionalLightHelper);

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

// Hemisphere
const hemisphereLight = new THREE.HemisphereLight(0xffde3e, 0x311304, 0.3);
scene.add(hemisphereLight);

// Test plane

const testPlaneGeometry = new THREE.BoxGeometry(0.5, 0.08, 20, 4, 4, 40);
const testPlaneMaterial = new THREE.MeshStandardMaterial({
  color: 0xff00ff,
  side: DoubleSide,
  wireframe: true,
});
const testPlane = new THREE.Mesh(testPlaneGeometry, testPlaneMaterial);
testPlane.position.set(0, 0.5, 0);
// testPlane.rotation.set(30, 20, 0);
testPlane.rotation.x = Math.PI;
scene.add(testPlane);

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
camera.position.set(1, 0.5, 1);
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
