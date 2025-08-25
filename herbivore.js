import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

class Herbivore {
    constructor(x, y, z) {
        this.position = new THREE.Vector3(x, y, z);
        this.energy = 100; // Initial energy
        this.hunger = 0; // Initial hunger
        this.speed = 0.5; // Movement speed

        // Visual representation (simple colored capsule for now)
        const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8); // radius, length, capSegments, radialSegments
        const material = new THREE.MeshBasicMaterial({ color: 0xff0000 }); // Red color
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.mesh.position.y = 0.5; // Place on the ground
    }

    // Placeholder for movement logic (will be implemented in next task)
    move() {
        // Implement movement logic
    }

    // Placeholder for eating logic
    eat(plant) {
        // Implement eating plant and gaining energy
    }

    // Placeholder for reproduction logic
    reproduce() {
        // Implement reproduction
    }

    // Get the mesh for adding to the scene
    getMesh() {
        return this.mesh;
    }
}

export { Herbivore };