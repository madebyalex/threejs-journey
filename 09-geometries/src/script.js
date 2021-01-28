import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Object
const geometry = new THREE.BoxBufferGeometry(1, 1, 1, 2, 2, 2);

// Custom geometry
// const customGeometry = new THREE.Geometry();

// // const vertex1 = new THREE.Vector3(0, 0, 0);
// // customGeometry.vertices.push(vertex1);

// // const vertex2 = new THREE.Vector3(0, 1, 0);
// // customGeometry.vertices.push(vertex2);

// // const vertex3 = new THREE.Vector3(1, 0, 0);
// // customGeometry.vertices.push(vertex3);

// // const face = new THREE.Face3(0, 1, 2);
// // customGeometry.faces.push(face);

// for (let i = 0; i < 50; i++) {
//   for (let j = 0; j < 3; j++) {
//     customGeometry.vertices.push(
//       new THREE.Vector3(
//         (Math.random() - 0.5) * 4,
//         (Math.random() - 0.5) * 4,
//         (Math.random() - 0.5) * 4
//       )
//     );
//   }

//   const verticesIndex = i * 3;
//   customGeometry.faces.push(
//     new THREE.Face3(verticesIndex, verticesIndex + 1, verticesIndex * 2)
//   );

//   // customGeometry.position.x = (Math.random() - 0.5) * 4;
//   // customGeometry.position.y = (Math.random() - 0.5) * 4;
//   // customGeometry.position.z = (Math.random() - 0.5) * 4;
// }

// Custom Buffer geometry

// Explicit version
// const positionsArray = new Float32Array(9);

// positionsArray[0] = 0;
// positionsArray[1] = 0;
// positionsArray[2] = 0;

// positionsArray[3] = 0;
// positionsArray[4] = 1;
// positionsArray[5] = 0;

// positionsArray[6] = 1;
// positionsArray[7] = 0;
// positionsArray[8] = 0;

// Shorter version
const positionsArray = new Float32Array([0, 0, 0, 0, 1, 0, 1, 0, 0]);

const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
const bufferGeometry = new THREE.BufferGeometry();
bufferGeometry.setAttribute('position', positionsAttribute);

const material = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: true,
});
const mesh = new THREE.Mesh(bufferGeometry, material);
scene.add(mesh);

// Sizes
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

// Camera
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

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Animate
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
