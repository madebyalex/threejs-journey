import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DoubleSide } from 'three';
import * as dat from 'dat.gui';

/**
 * Debug
 */

const gui = new dat.GUI({ width: 400 });
// const parameters = {
//   ambientLightColor: 0x0000ff,
//   pointLightColor: 0xffffff,
// };

const parameters = {
  ambientLightColor: 0xffffff,
  pointLightColor: 0xffffff,
};

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
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg');
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg');
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg');

const gradientTexture = textureLoader.load('/textures/gradients/5.jpg');
const matcapTexture = textureLoader.load('/textures/matcaps/8.png');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */

// const material = new THREE.MeshBasicMaterial();
// material.color.set('#ff00ff');
// material.color = new THREE.Color('salmon');
// material.color = new THREE.Color(0xff00ff);
// material.wireframe = true;

// To have objects semitransparent it's required to set the transparent property to true
// material.opacity = 0.5;
// material.transparent = true;
// material.map = doorColorTexture;
// material.alphaMap = doorAlphaTexture;
// material.transparent = true;
// material.side = THREE.DoubleSide

// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;
// material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// const material = new THREE.MeshDepthMaterial();

// const material = new THREE.MeshLambertMaterial();

// const material = new THREE.MeshPhongMaterial();
// material.shininess = 200;
// material.specular = new THREE.Color(0x1188ff);

// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;
// gradientTexture.generateMipmaps = false;
// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter = THREE.NearestFilter;

const material = new THREE.MeshStandardMaterial();
material.side = THREE.DoubleSide;
material.metalness = 0.45;
material.roughness = 0.65;
material.map = doorColorTexture;
material.aoMap = doorAmbientOcclusionTexture;
material.aoMapIntensity = 1;

gui.add(material, 'metalness').min(0).max(1).step(0.0001).name('Metalness');
gui.add(material, 'roughness').min(0).max(1).step(0.0001).name('Roughness');
gui
  .add(material, 'aoMapIntensity')
  .min(0)
  .max(10)
  .step(0.05)
  .name('AO map intensity');

// material.roughnessMap = doorRoughnessTexture;

const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 24, 24), material);
const plane = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material);
const torus = new THREE.Mesh(new THREE.TorusGeometry(1, 0.3, 24, 32), material);

sphere.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

plane.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

torus.geometry.setAttribute(
  'uv2',
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);

sphere.position.x = -2;
torus.position.x = 3;

scene.add(sphere, plane, torus);

/**
 * Lights
 */

const ambientLight = new THREE.AmbientLight(parameters.ambientLightColor, 0.5);

gui
  .addColor(parameters, 'ambientLightColor')
  .onChange(() => {
    ambientLight.color.set(parameters.ambientLightColor);
  })
  .name('Ambient light color');

scene.add(ambientLight);

const pointLight = new THREE.PointLight(parameters.pointLightColor, 0.6);

gui
  .addColor(parameters, 'pointLightColor')
  .onChange(() => {
    pointLight.color.set(parameters.pointLightColor);
  })
  .name('Point light color');

pointLight.position.x = 2;
pointLight.position.y = 3;
pointLight.position.z = 4;
scene.add(pointLight);

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
camera.position.z = 4;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.autoRotate = true;

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

  // Update objects
  sphere.rotation.x = elapsedTime * 0.15;
  plane.rotation.x = elapsedTime * 0.15;
  torus.rotation.x = elapsedTime * 0.15;

  sphere.rotation.y = elapsedTime * 0.1;
  plane.rotation.y = elapsedTime * 0.1;
  torus.rotation.y = elapsedTime * 0.1;

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
