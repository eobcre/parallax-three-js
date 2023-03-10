import * as THREE from 'https://unpkg.com/three/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// load img, pass texture to shader
async function loadTex(url) {
  const loader = new THREE.TextureLoader();
  const texture = await loader.loadAsync(url);
  return texture;
}

// mouse position to shader
const canvas = document.querySelector('canvas');
canvas.addEventListener('mousemove', mouseHandler);
const mouse = new THREE.Vector2();

// mouse function
function mouseHandler(event) {
  const el = event.currentTarget;

  const x = event.clientX;
  const y = event.clientY;
  const w = el.offsetWidth;
  const h = el.offsetHeight;

  mouse.x = x / w;
  mouse.y = 1 - y / h;
}

const geometry = new THREE.PlaneGeometry(9, 5);
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTex: { value: await loadTex('img/img.jpg') },
    uTexDepth: { value: await loadTex('img/img-map.jpg') },
    uMouse: { value: mouse },
  },

  vertexShader: `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,

  fragmentShader: `
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform sampler2D uTexDepth;
  uniform vec2 uMouse;

  void main() {
    vec4 texDepth = texture2D(uTexDepth, vUv);
    vec4 color = texture2D(uTex, vUv + (uMouse -vec2(0.5)) * 0.02 * texDepth.r);
    gl_FragColor = color;
  }
  `,
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  // cube.rotation.x += 0.01;
  // cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
