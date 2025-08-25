import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';
import { Plant } from './plant.js';
import { Herbivore } from './herbivore.js';

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

// Sun (DirectionalLight and visual sphere)
const sunLight = new THREE.DirectionalLight(0xffffff, 1);
scene.add(sunLight);

const sunGeometry = new THREE.SphereGeometry(2, 32, 32);
const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

// Day/Night Cycle variables
const dayDuration = 60; // seconds for a full day
let currentTime = 0; // 0 to dayDuration

const clock = new THREE.Clock();
const timeMultiplier = 1; // 1 real second = 1 simulated second. Adjust for faster/slower simulation.

// Plants
const plants = [];
for (let i = 0; i < 10; i++) {
    const x = (Math.random() - 0.5) * 90;
    const z = (Math.random() - 0.5) * 90;
    const plant = new Plant(x, 0, z);
    scene.add(plant.getMesh());
    plants.push(plant);
}

// Obstacles
const obstacles = [];
const numObstacles = 15;
const minObstacleDistance = 5; // Minimum distance between obstacles

for (let i = 0; i < numObstacles; i++) {
    let obstaclePosition;
    let validPosition = false;
    let attempts = 0;

    while (!validPosition && attempts < 100) {
        obstaclePosition = new THREE.Vector3(
            (Math.random() - 0.5) * 90,
            0,
            (Math.random() - 0.5) * 90
        );
        validPosition = true;
        // Check for overlap with existing obstacles
        for (const existingObstacle of obstacles) {
            if (obstaclePosition.distanceTo(existingObstacle.position) < minObstacleDistance) {
                validPosition = false;
                break;
            }
        }
        attempts++;
    }

    if (validPosition) {
        const obstacleSize = Math.random() * 5 + 2; // Random size
        const obstacleGeometry = new THREE.BoxGeometry(obstacleSize, obstacleSize * 2, obstacleSize);
        const obstacleMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 }); // Grey color
        const obstacleMesh = new THREE.Mesh(obstacleGeometry, obstacleMaterial);
        obstacleMesh.position.copy(obstaclePosition);
        obstacleMesh.position.y = obstacleSize; // Place on the ground
        scene.add(obstacleMesh);
        obstacles.push({ position: obstaclePosition, size: obstacleSize, mesh: obstacleMesh });
    }
}

// Herbivores
const herbivores = [];
const numHerbivores = 5;
for (let i = 0; i < numHerbivores; i++) {
    const x = (Math.random() - 0.5) * 90;
    const z = (Math.random() - 0.5) * 90;
    const herbivore = new Herbivore(x, 0, z);
    scene.add(herbivore.getMesh());
    herbivores.push(herbivore);
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    currentTime += delta * timeMultiplier; // Advance time based on real delta and multiplier
    if (currentTime > dayDuration) {
        currentTime = 0; // Reset time for continuous cycle
    }

    const angle = (currentTime / dayDuration) * Math.PI * 2; // Full circle
    const sunDistance = 70; // Distance from the center

    sunLight.position.set(
        Math.sin(angle) * sunDistance,
        Math.cos(angle) * sunDistance,
        0
    );
    sunMesh.position.copy(sunLight.position);

    // Adjust light intensity and color based on time of day
    let lightIntensity = 1;
    let lightColor = new THREE.Color(0xffffff); // White for day

    if (currentTime < dayDuration * 0.25) { // Morning
        lightIntensity = Math.sin((currentTime / (dayDuration * 0.25)) * Math.PI / 2);
        lightColor.setRGB(1, lightIntensity, lightIntensity * 0.8); // Yellowish morning
    } else if (currentTime > dayDuration * 0.75) { // Evening
        lightIntensity = Math.sin(((dayDuration - currentTime) / (dayDuration * 0.25)) * Math.PI / 2);
        lightColor.setRGB(1, lightIntensity, lightIntensity * 0.8); // Orange/red evening
    } else if (currentTime > dayDuration * 0.5 && currentTime < dayDuration * 0.75) { // Night
        lightIntensity = 0.1; // Dim moonlight
        lightColor.setRGB(0.2, 0.2, 0.5); // Bluish night
    }

    sunLight.intensity = lightIntensity;
    sunLight.color.copy(lightColor);

    // Update plants
    plants.forEach(plant => {
        plant.grow(sunLight.intensity); // Pass sunlight intensity to plant growth
    });

    // Update herbivores
    herbivores.forEach(herbivore => {
        herbivore.move(delta); // Pass delta time for movement
    });

    renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});