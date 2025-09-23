import * as THREE from 'three'
import { GLTFLoader, VRMLLoader } from 'three/examples/jsm/Addons.js'

export default function ModelViewer() {

  const canvas = document.getElementById("canvas");
  const width = window.innerWidth;
  const height = window.innerHeight - 160;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('skyblue');

  const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
  camera.position.set(0, 0.8, -2.4);
  camera.lookAt(0, 0.8, 0);

  const light = new THREE.AmbientLight();
  light.color = 0xffff00;
  light.intensity = 5;
  
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(width, height);

  const loader = new GLTFLoader();
  loader.load('Gemini-custom/assets/生駒ミル_私服.vrm', (gltf) => {
    scene.add(gltf.scene);
    renderer.render(scene, camera);
  }, (xhr)=>{
    // const p = xhr.loaded / xhr.total * 100;
  }, undefined);

  return(
    <></>
  );
};