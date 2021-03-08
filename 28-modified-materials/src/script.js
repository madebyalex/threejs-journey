import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import * as dat from 'dat.gui';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

const debugObject = {
  envMapIntensity: 2.04,
  lightIntensity: 1.28,
  toneMappingExposure: 1.822,
};

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Loaders
 */
const textureLoader = new THREE.TextureLoader();
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('/draco/');
gltfLoader.setDRACOLoader(dracoLoader);

/**
 * Update all materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      child.material.envMapIntensity = 5;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
  '/textures/environmentMaps/0/px.jpg',
  '/textures/environmentMaps/0/nx.jpg',
  '/textures/environmentMaps/0/py.jpg',
  '/textures/environmentMaps/0/ny.jpg',
  '/textures/environmentMaps/0/pz.jpg',
  '/textures/environmentMaps/0/nz.jpg',
]);
environmentMap.encoding = THREE.sRGBEncoding;

scene.background = environmentMap;
scene.environment = environmentMap;

/**
 * Material
 */

// Textures
const mapTexture = textureLoader.load('/models/LeePerrySmith/color.jpg');
mapTexture.encoding = THREE.sRGBEncoding;

const normalTexture = textureLoader.load('/models/LeePerrySmith/normal.jpg');

// Material
const material = new THREE.MeshStandardMaterial({
  map: mapTexture,
  normalMap: normalTexture,
  //   wireframe: true,
});

const depthMaterial = new THREE.MeshDepthMaterial({
  depthPacking: THREE.RGBADepthPacking,
});

const customUniforms = {
  uTime: { value: 0 },
};

material.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime;
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
        #include <common>

        uniform float uTime;

        mat2 get2dRotateMatrix(float _angle) {
            return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
        }
    `
  );

  shader.vertexShader = shader.vertexShader.replace(
    '#include <beginnormal_vertex>',
    `
        #include <beginnormal_vertex>

        float angle = sin(position.z + uTime) * 0.5;
        mat2 rotateMatrix = get2dRotateMatrix(angle);

        objectNormal.xz = rotateMatrix * objectNormal.xz;
    `
  );

  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
        #include <begin_vertex>

        transformed.xz = rotateMatrix * transformed.xz;
    `
  );
};

depthMaterial.onBeforeCompile = (shader) => {
  shader.uniforms.uTime = customUniforms.uTime;
  shader.vertexShader = shader.vertexShader.replace(
    '#include <common>',
    `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
        `
  );

  shader.vertexShader = shader.vertexShader.replace(
    '#include <begin_vertex>',
    `
        #include <begin_vertex>

        float angle = sin(position.z + uTime) * 0.5;
        mat2 rotateMatrix2 = get2dRotateMatrix(angle);

        transformed.xz = rotateMatrix2 * transformed.xz;
    `
  );
};

/**
 * Models
 */
// gltfLoader.load('/models/LeePerrySmith/LeePerrySmith.glb', (gltf) => {
//   // Model
//   const mesh = gltf.scene.children[0];
//   mesh.rotation.y = Math.PI * 0.5;
//   mesh.material = material;
//   mesh.customDepthMaterial = depthMaterial;
//   scene.add(mesh);

//   // Update materials
//   updateAllMaterials();
// });

let model = null;

// gltfLoader.load('/models/FlightHelmet/glTF/FlightHelmet.gltf', (gltf) => {
// gltfLoader.load('/models/hamburger.glb', (gltf) => {
gltfLoader.load('/models/hamburger-draco3.glb', (gltf) => {
  // console.log(gltf);
  // gltf.scene.scale.set(7, 7, 7);
  gltf.scene.scale.set(0.25, 0.25, 0.25);
  gltf.scene.position.set(0, -2.2, 0);
  gltf.scene.rotation.y = Math.PI * 0.5;
  scene.add(gltf.scene);
  model = gltf.scene;

  gui
    .add(gltf.scene.rotation, 'y')
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name('rotation');

  updateAllMaterials();
});

/**
 * Plane
 */

// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(15, 15, 15),
//   new THREE.MeshStandardMaterial()
// );
// plane.rotation.y = Math.PI;
// plane.position.y = -5;
// plane.position.z = 5;
// scene.add(plane);

/**
 * Lights
 */
// const directionalLight = new THREE.DirectionalLight('#ffffff', 3);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.normalBias = 0.05;
// directionalLight.position.set(0.25, 2, -2.25);
// scene.add(directionalLight);

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
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// controls.minPolarAngle = Math.PI / 3;
// controls.maxPolarAngle = Math.PI / 2;

// controls.minAzimuthAngle = -Math.PI;
// controls.maxAzimuthAngle = Math.PI;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update material
  customUniforms.uTime.value = elapsedTime;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
