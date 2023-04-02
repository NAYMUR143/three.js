import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";
import { GUI } from "dat.gui";
/**
 *  gui
 */
const gui = new GUI();
// base
const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

// sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// camera
const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = 5;
scene.add(camera);

// test cube
// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 1);
// const cubeMaterial = new THREE.MeshPhongMaterial({
//   color: 0xff00000,
// });
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// scene.add(cube);

// light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 2, 0);
scene.add(directionalLight);

// scroll

// gltf loader
let computer;
const gltfLoader = new GLTFLoader();
gltfLoader.load("./scene.gltf", (gltf) => {
  computer = gltf.scene;
  //   tv.scale.set(0.1, 0.1, 0.1);
  computer.scale.multiplyScalar(0.08);
  gui.add(computer.position, "x", -33, 2).name("position X axis");
  gui.add(computer.position, "y", -33, 4).name("position Y axis");
  gui.add(computer.position, "z", -33, 4).name("position Z axis");
  gui.add(computer.rotation, "x", -12, 4).name("rotation X axis");
  gui.add(computer.rotation, "y", -12, 4).name("rotation Y axis");
  gui.add(computer.rotation, "z", -12, 4).name("rotation Z axis");
  gui.add(computer.scale, "x", -32, 3).name("scale X axis");
  gui.add(computer.scale, "y", -32, 3).name("scale Y axis");
  gui.add(computer.scale, "z", -32, 3).name("scale Z axis");
  const box = new THREE.Box3().setFromObject(computer);
  const center = box.getCenter(new THREE.Vector3());
  computer.position.x += computer.position.x - center.x;
  computer.position.y += computer.position.y - center.y;
  computer.position.z += computer.position.z - center.z;
  computer.position.x = 1;
  computer.position.y = 1;
  scene.add(computer);
});

// scrollPart
const transformComputer = [
  {
    rotationZ: 0,
    positionX: 1,
    rotationY: 0,
    rotationX: 0,
  },
  {
    rotationZ: -0.3,
    positionX: -2,
    rotationY: -0.2,
    rotationX: 1,
  },
  { rotationZ: 0, positionX: 0, rotationY: -2, rotationX: 0.4 },
  { rotationZ: 0, positionX: 1.1, rotationY: -5, rotationX: 0.1 },
  {
    rotationZ: -1,
    positionX: 1.1,
    rotationY: -2,
    rotationX: 0.3,
  },
];

let scrollY = window.scrollY;
let currentSection = 0;

window.addEventListener("scroll", () => {
  scrollY = window.scrollY;
  // console.log("scrollY:", scrollY);
  const newSection = Math.round(scrollY / sizes.height);
  console.log("newSection:", sizes.height);

  if (newSection != currentSection) {
    currentSection = newSection;
    console.log("currentSection:", currentSection);
    if (!!computer) {
      gsap.to(computer.rotation, {
        duration: 1.5,
        ease: "power2.inOut",
        z: transformComputer[currentSection].rotationZ,
        y: transformComputer[currentSection].rotationY,
        x: transformComputer[currentSection].rotationX,
      });
      gsap.to(computer.position, {
        duration: 1.5,
        ease: "power2.inOut",
        x: transformComputer[currentSection].positionX,
      });
    }
  }
});

// renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.render(scene, camera);

// animation
const clock = new THREE.Clock();
let lastElapsedTime = 0;
const animation = () => {
  const elapsedTime = clock.getElapsedTime();
  lastElapsedTime = elapsedTime;
  // cube.rotation.y = Math.sin(elapsedTime);
  if (!!computer) {
    computer.position.y = Math.sin(elapsedTime * 1) * 0.1 - 0.3;
  }
  renderer.render(scene, camera);
  window.requestAnimationFrame(animation);
};
animation();

// resizing
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}
