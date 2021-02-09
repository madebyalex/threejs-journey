import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const particlesTexture = textureLoader.load('/textures/particles/2.png');

/**
 * Particles
 */

//  Geometry
const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
  // color: '#FF88CC',
  //   map: particlesTexture,
  alphaMap: particlesTexture,
  transparent: true,
});

// Multiple ways to fix issues with transparency in particles

// #1 – .alphaTest: Kind of works but particles have dark pixels outside the colored part
// particlesMaterial.alphaTest = 0.001;

// #2 – .depthTest: Works fine but only with particles with the the same color and without other objects
// particlesMaterial.depthTest = false;

// #3 – .depthWrite: Works the best (at least in this test ;) )
particlesMaterial.depthWrite = false;

// #4 – Blending: Makes overlapped pixels brighter but affects performance if there are too much particles
particlesMaterial.blending = THREE.AdditiveBlending;

const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 1000;

const positionsArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount * 3; i++) {
  positionsArray[i] = (Math.random() - 0.5) * 10;
  colorsArray[i] = Math.random();
}

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
const colorsAttribute = new THREE.BufferAttribute(colorsArray, 3);

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

const parameters = {
  phiLength: 6.3,
};

const maxPhiLength = particlesGeometry.parameters.phiLength;

console.log(particlesGeometry.parameters.phiLength);

gui
  .add(parameters, 'phiLength')
  .onChange((e) => {
    particlesGeometry.parameters.phiLength = parameters.phiLength;
    console.log(e);
  })
  .min(0)
  .max(6.3)
  .step(0.01);
particlesGeometry.setAttribute('position', positionsAttribute);
particlesGeometry.setAttribute('color', colorsAttribute);
// particlesMaterial.color.set(particlesGeometry.color);

particlesMaterial.vertexColors = true;

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial);

scene.add(particles);

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

  // Update particles
  particles.rotation.y = elapsedTime * 0.07;

  for (let i = 0; i < particlesCount; i++) {
    const i3 = i * 3;

    const x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    ); // Moving particles on the axis Y
  }

  particlesGeometry.attributes.position.needsUpdate = true;
  // console.log(particlesGeometry.attributes.position.array);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
