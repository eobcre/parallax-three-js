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
async function loadTexture(url) {
  const loader = new THREE.TextureLoader();
  const texture = await loader.loadAsync(url);
  return texture;
}

// mouse position to shader

const geometry = new THREE.PlaneGeometry(2, 1);
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTex: { value: await loadTex('img/img.jpg') },
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
  void main() {
    vec4 color = vec4(vUv, 0.0, 1.0);
    gl_FragColor = color;
  }
  `,
});

const plane = new THREE.Mesh(geometry, material);
scene.add(plane);

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);

  //   cube.rotation.x += 0.01;
  //   cube.rotation.y += 0.01;

  renderer.render(scene, camera);
}

animate();
