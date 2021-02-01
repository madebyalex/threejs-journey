import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
// import typefaceFont from 'three/examples/fonts/helvetiker_regular.typeface.json';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Axes helper
const axesHelper = new THREE.AxesHelper();
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('textures/matcaps/1.png');
console.log(matcapTexture);

/**
 * Fonts
 */

const fontLoader = new THREE.FontLoader();
fontLoader.load('/fonts/Fira_Sans_ExtraBold_Regular.json', (font) => {
  const textGeometry = new THREE.TextGeometry('Three.js Journey', {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 5,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });

  textGeometry.computeBoundingBox();
  //   console.log(textGeometry.boundingBox.max.x / 2);

  //   const textMaterial = new THREE.MeshNormalMaterial();
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, textMaterial);

  //   text.position.x =
  //     -(textGeometry.boundingBox.max.x + textGeometry.boundingBox.min.x) / 2;
  //   text.position.y =
  //     -(textGeometry.boundingBox.max.y + textGeometry.boundingBox.min.y) / 2;
  //   text.position.z =
  //     -(textGeometry.boundingBox.max.z + textGeometry.boundingBox.min.z) / 2;

  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x + textGeometry.boundingBox.min.x) / 2,

  //     -(textGeometry.boundingBox.max.y + textGeometry.boundingBox.min.y) / 2,

  //     -(textGeometry.boundingBox.max.z + textGeometry.boundingBox.min.z) / 2
  //   );

  //   textGeometry.computeBoundingBox();
  //   console.log(textGeometry.boundingBox);

  textGeometry.center();

  scene.add(text);
});

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

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
