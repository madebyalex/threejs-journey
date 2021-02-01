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
// const axesHelper = new THREE.AxesHelper();
// scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load('textures/matcaps/1.png');
// console.log(matcapTexture);

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

  const textMaterial = new THREE.MeshNormalMaterial();
  //   const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, textMaterial);

  //   textGeometry.translate(
  //     -(textGeometry.boundingBox.max.x + textGeometry.boundingBox.min.x) / 2,
  //     -(textGeometry.boundingBox.max.y + textGeometry.boundingBox.min.y) / 2,
  //     -(textGeometry.boundingBox.max.z + textGeometry.boundingBox.min.z) / 2
  //   );
  //   textGeometry.computeBoundingBox();
  //   console.log(textGeometry.boundingBox);

  textGeometry.center();
  scene.add(text);

  console.time('donuts');

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });

  for (let i = 0; i < 500; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);

    // No-Intersections – Attempt #1

    // donut.position.x =
    //   (Math.random() - 0.5) * 10 +
    //   textGeometry.boundingBox.max.x * Math.random(-1, 1);
    // donut.position.y =
    //   (Math.random() - 0.5) * 10 +
    //   textGeometry.boundingBox.max.y * Math.random(-1, 1);
    // donut.position.z =
    //   (Math.random() - 0.5) * 10 +
    //   textGeometry.boundingBox.max.z * Math.random(-1, 1);

    // No-Intersections – Attempt #2
    // var plusOrMinus = Math.random() < 0.5 ? -1 : 1;

    // donut.position.x =
    //   Math.random() * 10 * plusOrMinus +
    //   textGeometry.boundingBox.max.x * plusOrMinus;
    // donut.position.y =
    //   Math.random() * 10 * plusOrMinus +
    //   textGeometry.boundingBox.max.y * plusOrMinus;
    // donut.position.z =
    //   Math.random() * 10 * plusOrMinus +
    //   textGeometry.boundingBox.max.z * plusOrMinus;

    // No-Intersections – Attempt #3
    const plusOrMinusX = Math.random() < 0.5 ? -1 : 1;
    const plusOrMinusY = Math.random() < 0.5 ? -1 : 1;
    const plusOrMinusZ = Math.random() < 0.5 ? -1 : 1;

    donut.position.x =
      Math.random() * 8 * plusOrMinusX +
      (textGeometry.boundingBox.max.x * plusOrMinusX) / 4;
    donut.position.y =
      Math.random() * 8 * plusOrMinusY +
      (textGeometry.boundingBox.max.y * plusOrMinusY) / 1.5;
    donut.position.z =
      Math.random() * 8 * plusOrMinusZ +
      (textGeometry.boundingBox.max.z * plusOrMinusZ) / 1.5;

    // donut.position.x = (Math.random() - 0.5) * 10;
    // donut.position.y = (Math.random() - 0.5) * 10;
    // donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    const scale = (Math.random() + 0.5) * 0.5;
    donut.scale.set(scale, scale, scale);

    scene.add(donut);
  }

  console.timeEnd('donuts');
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
