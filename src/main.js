import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

console.log("🚀 Initializing scene...");

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(2, 2, 5);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('three-container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;


const light = new THREE.DirectionalLight(0xffffff, 2);
light.position.set(5, 10, 7.5);
scene.add(light);


const fallbackCube = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
fallbackCube.position.set(-2, 0, 0);
scene.add(fallbackCube);

const loader = new GLTFLoader();
let mixer;

console.log("🔄 Attempting to load GLB...");

loader.load(
  '/BOSMcricketAnim1.glb',
  (gltf) => {
    console.log("✅ GLB loaded successfully:", gltf);

    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(1, 1, 1);
    scene.add(model);

    if (gltf.animations && gltf.animations.length > 0) {
      console.log("🎬 Animations found:", gltf.animations);
      mixer = new THREE.AnimationMixer(model);
      gltf.animations.forEach((clip) => {
        const action = mixer.clipAction(clip);
        action.play();
      });
    } else {
      console.warn("⚠️ No animations found in this GLB.");
    }
  },
  undefined,
  (error) => {
    console.error("❌ GLB load error:", error);
  }
);


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function animate() {
  requestAnimationFrame(animate);
  if (mixer) mixer.update(0.016);
  controls.update();
  renderer.render(scene, camera);
}
animate();

console.log("✅ Scene setup complete.");
