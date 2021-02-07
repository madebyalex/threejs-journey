import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI({ width: 400 });
const parameters = {
  // ambLightColor: '#b9d5ff',
  // ambLightColor: '#73a4f0',
  ambLightColor: '#1853e3',
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

const houseHeight = 2.5;

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, houseHeight, 4),
  new THREE.MeshStandardMaterial({ color: '#ac8e82' })
);
walls.position.y = houseHeight / 2;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.6, 1.2, 4, 1, false),
  new THREE.MeshStandardMaterial({ color: '#B35F45' })
);
roof.position.y = houseHeight + 1.2 / 2;
roof.rotation.y = Math.PI / 4;
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(1.2, 1.8),
  new THREE.MeshStandardMaterial({ color: '#6F5951' })
);
door.position.y = 1.8 / 2;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89C854' });

// Trying to randomize bushes

// const bush1 = new THREE.Group();
// const randomBushPartsQty = Math.floor(Math.random() * 3 + 2);

// for (let i = 0; i < randomBushPartsQty; i++) {
//   const bushPart = new THREE.Mesh(bushGeometry, bushMaterial);
//   const randomScale = Math.random().toPrecision(2) + 1;
//   bushPart.position.set(
//     -randomScale * i,
//     randomScale / 4,
//     randomScale * i - i / 4
//   );

//   //   const rand = randomScale * i + 0.5;

//   //   bushPart.scale.set(rand, rand, rand);
//   bush1.add(bushPart);
//   console.log(i);
//   console.log(randomScale * i + 0.5);
// }

const bushPart1 = new THREE.Mesh(bushGeometry, bushMaterial);
bushPart1.scale.set(0.5, 0.5, 0.5);

const bushPart2 = new THREE.Mesh(bushGeometry, bushMaterial);
bushPart2.scale.set(0.25, 0.25, 0.25);
bushPart2.position.set(0.55, -0.1, -0.1);

const bush1 = new THREE.Group();

bush1.add(bushPart1, bushPart2);
bush1.position.set(1.2, 0.2, 2.2);

const bush2 = bush1.clone();
bush2.position.set(-1.2, 0.1, 2.4);
bush2.scale.set(0.9, 0.9, 0.9);
bush2.rotation.x = -Math.PI * 0.1;
bush2.rotation.y = Math.PI * 1.1;

// Graves
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#B2b6b1' });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 4 + Math.random() * 5;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, 0.3, z);
  grave.rotation.y = Math.random() - 0.5;
  grave.rotation.z = Math.random() - 0.5;
  graves.add(grave);
}

// bush.position.set(3, 0.15, 3);

house.add(bush1, bush2);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({ color: '#a9c388' })
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(parameters.ambLightColor, 0.12);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

gui
  .addColor(parameters, 'ambLightColor')
  .onChange(() => {
    ambientLight.color.set(parameters.ambLightColor);
  })
  .name('Ambient light color');

// Directional light
const moonLight = new THREE.DirectionalLight('#ffffff', 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
const doorLight = new THREE.PointLight('#FF7D46', 1, 7);
doorLight.position.set(0, 2, 2.1);
house.add(doorLight);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
