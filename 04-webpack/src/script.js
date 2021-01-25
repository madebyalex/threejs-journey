import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();

// Objects
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

// mesh.position.x = 0.7;
// mesh.position.y = -0.6;
// mesh.position.z = 1;

mesh.position.set(0.7, -0.6, 1);

scene.add(mesh);

// Axes helper
const axesHelper = new THREE.AxesHelper(2);
scene.add(axesHelper);

// Sizes
const sizes = {
  width: 800,
  height: 600,
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.x = 1;
camera.position.y = 0.5;
camera.position.z = 3;
scene.add(camera);

// console.log(mesh.position.length());
// console.log(mesh.position.distanceTo(new THREE.Vector3(-2, 1, -3)));

// mesh.position.normalize();
console.log(mesh.position.length());
console.log(mesh.position.distanceTo(camera.position));

// Canvas
const canvas = document.querySelector('canvas.webgl');
console.log(canvas);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
