import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import CANNON, { Vec3 } from 'cannon';

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {};

const shuffleArray = (array) => {
  array.sort(() => Math.random() - 0.5);
};

debugObject.createSphere = () => {
  createSphere(Math.random() * 0.5 + 0.1, {
    x: (Math.random() - 0.5) * 3,
    y: (Math.random() + 2) * 2,
    z: (Math.random() - 0.5) * 3,
  });

  // createSphere(Math.random() * 0.5 + 0.1, {
  //   x: 0,
  //   y: 0,
  //   z: 0,
  // });
};

gui.add(debugObject, 'createSphere');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.png',
  '/textures/environmentMaps/0/nx.png',
  '/textures/environmentMaps/0/py.png',
  '/textures/environmentMaps/0/ny.png',
  '/textures/environmentMaps/0/pz.png',
  '/textures/environmentMaps/0/nz.png',
]);

/**
 * Physics
 */
// World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Materials
const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.15,
    restitution: 0.6,
  }
);
world.addContactMaterial(defaultContactMaterial);
world.defaultContactMaterial = defaultContactMaterial;

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0; // Mass equal zero means that this object is static
floorBody.addShape(floorShape);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
// floorBody.material = defaultMaterial;
world.addBody(floorBody);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#777777',
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight('#FFFFFF', 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xfef3e1, 0.5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-3, 3, 5);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
const objectsToUpdate = [];
const colors = [
  '#1abc9c',
  '#2ecc71',
  '#3498db',
  '#9b59b6',
  '#34495e',
  '#16a085',
  '#27ae60',
  '#2980b9',
  '#8e44ad',
  '#2c3e50',
  '#f1c40f',
  '#e67e22',
  '#e74c3c',
  '#ecf0f1',
  '#95a5a6',
  '#f39c12',
  '#d35400',
  '#c0392b',
  '#bdc3c7',
  '#7f8c8d',
];

const sphereGeometry = new THREE.SphereGeometry(1, 24, 24);

const createSphere = (radius, position) => {
  // Get random color
  const randomIndex = Math.floor(Math.random() * colors.length);
  const randomColor = colors[randomIndex];

  // Three.js mesh
  const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    color: randomColor,
  });

  const mesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  mesh.scale.set(radius, radius, radius);

  mesh.castShadow = true;
  mesh.position.copy(position);
  scene.add(mesh);

  // Cannon.js body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape: shape,
    material: defaultMaterial,
  });
  body.position.copy(position);
  world.addBody(body);

  // Save in objects to update
  objectsToUpdate.push({ mesh, body });
};

createSphere(0.5, { x: 0, y: 3, z: 0.5 });

console.log(objectsToUpdate);

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update physics world
  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);

  world.step(1 / 60, deltaTime, 3);

  // sphere.position.copy(sphereBody.position);
  for (const object of objectsToUpdate) {
    object.mesh.position.copy(object.body.position);
  }

  floor.position.copy(floorBody.position);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
