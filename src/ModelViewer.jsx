import * as THREE from 'three'
import { GLTFLoader, FBXLoader } from 'three/examples/jsm/Addons.js'
import { VRMLoaderPlugin } from '@pixiv/three-vrm';
import { clipping } from 'three/src/nodes/accessors/ClippingNode.js';

export default function ModelViewer() {


  const canvas = document.getElementById("canvas");
  const width = window.innerWidth;
  const height = window.innerHeight - 160;

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color().setHex('0xC3EEFA');

  // Camera
  const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
  camera.position.set(0, 0.8, 2.4);
  camera.lookAt(0, 0.8, 0);

  // Lightings
  const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.7);
  const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 2);
  directionalLight.position.set(1, 5, 4);
  directionalLight.target.position.set(0, 1, 0);
  scene.add(ambientLight, directionalLight, directionalLight.target);
  
  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true });
  renderer.setSize(width, height);

  // Add plane to scene
  const planeGeo = new THREE.PlaneGeometry( 5, 5 );
  const planeMat = new THREE.MeshPhongMaterial( {
    color: 0xDDDDDD,
  } );
  const mesh = new THREE.Mesh( planeGeo, planeMat );
  mesh.rotation.x = Math.PI * - .5;
  scene.add( mesh );
  
  // Load VRM model as GLTF
  let obj;
  const loader = new GLTFLoader();
  loader.register((parser)=>new VRMLoaderPlugin(parser));
  loader.load('./assets/生駒ミル_私服.vrm', (gltf) => {
    obj = gltf.scene;
    obj.rotation.y = Math.PI; // turn back

    // Changes original material (MeshBasicMaterial) to Toon shader
    // obj.traverse((object)=>{
    //   if(object.type === 'SkinnedMesh'){
    //     object.material = new THREE.MeshToonMaterial({
    //       color:0xFFFFFF,
    //       map:object.material.map
    //     });
    //   }
    // })
    scene.add(obj);

    // requestAnimationFrame( render );
    renderer.render(scene, camera);
  }, (xhr)=>{
    // const p = xhr.loaded / xhr.total * 100;
  });

  function render( time ) {
    time *= 0.001;

    obj.rotation.y = time;
    renderer.render(scene, camera);

    requestAnimationFrame( render );
  }

  const animLoader = new FBXLoader();
  animLoader.load('./assets/Idle.fbx', (fbx)=>{
    const animationClip = fbx.animations[0];
    
    

  });

  return(
    <></>
  );
};