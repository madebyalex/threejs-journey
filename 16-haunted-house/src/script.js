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
  fogColor: '#232541',
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog(parameters.fogColor, 1, 15);
scene.fog = fog;

gui.addColor(parameters, 'fogColor').onChange(() => {
  fog.color.set(parameters.fogColor);
  renderer.setClearColor(parameters.fogColor);
});

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load('/textures/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load(
  '/textures/door/ambientOcclusion.jpg'
);
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const bricksColorTexture = textureLoader.load('/textures/bricks/color.jpg');
const bricksAmbientOcclusionTexture = textureLoader.load(
  '/textures/bricks/ambientOcclusion.jpg'
);
const bricksNormalTexture = textureLoader.load('/textures/bricks/normal.jpg');
const bricksRoughnessTexture = textureLoader.load(
  '/textures/bricks/roughness.jpg'
);

const grassColorTexture = textureLoader.load('/textures/grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load(
  '/textures/grass/ambientOcclusion.jpg'
);
const grassNormalTexture = textureLoader.load('/textures/grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load(
  '/textures/grass/roughness.jpg'
);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */

const house = new THREE.Group();
scene.add(house);

const houseHeight = 2.5;

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, houseHeight, 4),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
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
  new THREE.PlaneGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);

door.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);

door.position.y = 1.8 / 2;
door.position.z = 2 + 0.01;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: '#89C854',
});

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
  grave.castShadow = true;
  graves.add(grave);
}

// bush.position.set(3, 0.15, 3);

house.add(bush1, bush2);

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  'uv2',
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
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
doorLight.position.set(0, 2, 2.5);
house.add(doorLight);

/**
 * Ghosts
 */

const ghost1 = new THREE.PointLight('#FF00FF', 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight('#00FFFF', 2, 3);
scene.add(ghost2);

const ghost3 = new THREE.PointLight('#FFFF00', 2, 3);
scene.add(ghost3);

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
renderer.setClearColor(parameters.fogColor);

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
doorLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
bushPart1.castShadow = true;
bushPart2.castShadow = true;
floor.receiveShadow = true;
// walls.receiveShadow = true;
// door.receiveShadow = true;

// Optimize the shadow maps
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Update ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.sin(-ghost1Angle) * 5 + 1;
  ghost1.position.z = Math.cos(-ghost1Angle) * 5 + 1;
  ghost1.position.y = Math.cos(ghost1Angle * 2);

  const ghost2Angle = -elapsedTime * 0.35;
  ghost2.position.x = Math.cos(ghost2Angle) * 4 + 1;
  ghost2.position.z = Math.sin(ghost2Angle) * 4 + 1;
  ghost2.position.y = Math.sin(ghost2Angle * 3) + Math.sin(ghost2Angle * 2.5);

  const ghost3Angle = elapsedTime * 0.24;
  ghost3.position.x =
    Math.sin(-ghost3Angle) * (7 + Math.cos(elapsedTime * 0.32));
  ghost3.position.z =
    Math.cos(-ghost3Angle) * (7 + Math.cos(elapsedTime * 0.5));
  ghost3.position.y = Math.cos(ghost3Angle * 4) - Math.cos(ghost3Angle * 2.5);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
