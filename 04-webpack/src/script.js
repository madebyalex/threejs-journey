import './style.css';
import * as THREE from 'three';

const scene = new THREE.Scene();

/*
 *** Single object
 */

// const geometry = new THREE.BoxGeometry(1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const mesh = new THREE.Mesh(geometry, material);

// // *** 1. Position objects
// // mesh.position.x = 0.7;
// // mesh.position.y = -0.6;
// // mesh.position.z = 1;
// mesh.position.set(0.7, 0.1, 1);

// // *** 2. Scale objects
// // mesh.scale.x = 0.8;
// // mesh.scale.y = 0.25;
// // mesh.scale.z = 2;
// mesh.scale.set(0.8, 0.25, 2);

// // *** 3. Rotating objects
// // mesh.rotation.reorder('yxz');
// mesh.rotation.x = Math.PI * 0.25;
// mesh.rotation.y = Math.PI * 0.25;

// scene.add(mesh);

/*
 *** Grouped objects
 */

const group = new THREE.Group();
group.position.set(0, -1.5, 0);
group.scale.y = 3;
group.rotation.y = 1;

scene.add(group);

const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 })
);

group.add(cube1);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);

cube2.position.set(2, 1.5, 0.5);

group.add(cube2);

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff })
);

cube3.position.set(-1.5, 1.3, -0.5);

group.add(cube3);

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

// camera.lookAt(mesh.position);

scene.add(camera);

// console.log(mesh.position.length());
// console.log(mesh.position.distanceTo(new THREE.Vector3(-2, 1, -3)));

// mesh.position.normalize();
// console.log(mesh.position.length());
// console.log(mesh.position.distanceTo(camera.position));

// Canvas
const canvas = document.querySelector('canvas.webgl');
console.log(canvas);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
