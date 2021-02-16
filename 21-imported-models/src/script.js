import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Stats from 'three/examples/jsm/libs/stats.module.js';
import * as dat from 'dat.gui';

/**
 * Base
 */

let stats, container, gui, model, mixer, actions, activeAction, previousAction;
const api = { state: 'Survey' };

// Canvas & Container
const canvas = document.querySelector('canvas.webgl');
container = document.createElement('div');
document.body.appendChild(container);

// Stats
stats = new Stats();
container.appendChild(stats.dom);

/**
 * GUI
 */
const parameters = {
  speed: 1,
};

// Scene
const path = 'textures/cube/01/';
const format = '.png';
const urls = [
  path + 'px' + format,
  path + 'nx' + format,
  path + 'py' + format,
  path + 'ny' + format,
  path + 'pz' + format,
  path + 'nz' + format,
];

const textureCube = new THREE.CubeTextureLoader().load(urls);

const scene = new THREE.Scene();
scene.background = textureCube;

// Model

const gltfLoader = new GLTFLoader();

gltfLoader.load(
  '/models/Fox/glTF/Fox.gltf',

  (gltf) => {
    model = gltf.scene;
    // console.log(gltf.animations);

    model.scale.set(0.02, 0.02, 0.02);
    model.castShadow = true;
    scene.add(model);

    createGUI(model, gltf.animations);
  },
  undefined,
  (e) => {
    console.log(e);
  }
);

/**
 * GUI
 */

function createGUI(model, animations) {
  const states = ['Survey', 'Walk', 'Run'];

  gui = new dat.GUI();

  mixer = new THREE.AnimationMixer(model);
  actions = {};

  for (let i = 0; i < animations.length; i++) {
    const clip = animations[i];
    const action = mixer.clipAction(clip);
    actions[clip.name] = action;
    if (states.indexOf(clip.name) >= 3) {
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
    }
  }

  const statesFolder = gui.addFolder('States');
  const clipControl = statesFolder
    .add(api, 'state')
    .options(states)
    .name('State');

  clipControl.onChange(function () {
    fadeToAction(api.state, 0.5);
  });
  statesFolder.open();

  gui
    .add(parameters, 'speed')
    .min(0.1)
    .max(5)
    .step(0.1)
    .onFinishChange(() => {
      activeAction.timeScale = parameters.speed;
    });

  activeAction = actions['Survey'];
  activeAction.play();
}

function fadeToAction(name, duration) {
  previousAction = activeAction;
  activeAction = actions[name];

  if (previousAction !== activeAction) {
    previousAction.fadeOut(duration);
  }

  activeAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play();
}

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: '#444444',
    transparent: true,
    opacity: 0,
    // metalness: 0,
    // roughness: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
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
camera.position.set(1.8, 0.8, 2);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.target.set(0, 0.75, 0);
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
 * Animate
 */
const clock = new THREE.Clock();
let previousTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - previousTime;
  previousTime = elapsedTime;

  // Model animation
  if (mixer) {
    mixer.update(deltaTime);
  }

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);

  // Update stats
  stats.update();
};

tick();
