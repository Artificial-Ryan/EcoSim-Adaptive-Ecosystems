import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

// Scene, Camera, Renderer setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Terrain
const planeGeometry = new THREE.PlaneGeometry(100, 100); // Large plane
const planeMaterial = new THREE.MeshBasicMaterial({ color: 0x8FBC8F, side: THREE.DoubleSide }); // Green color
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = Math.PI / 2; // Rotate to be flat on the ground
scene.add(plane);

camera.position.set(0, 50, 0); // Position camera above the plane
camera.lookAt(0, 0, 0); // Look down at the center of the plane

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // No animation for now, will be added later

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});