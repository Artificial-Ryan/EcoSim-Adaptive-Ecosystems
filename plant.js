import * as THREE from 'https://unpkg.com/three@0.128.0/build/three.module.js';

class Plant {
    constructor(x, y, z) {
        this.position = new THREE.Vector3(x, y, z);
        this.size = 0.1; // Initial size
        this.growthStage = 'seedling'; // seedling, mature, flowering
        this.health = 100; // Health points

        // Visual representation (simple green box for now)
        const geometry = new THREE.BoxGeometry(this.size, this.size * 2, this.size);
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.mesh = new THREE.Mesh(geometry, material);
        this.mesh.position.copy(this.position);
        this.mesh.position.y = this.size; // Place on the ground
    }

    grow(sunlightAmount) {
        const growthRate = 0.001 * sunlightAmount; // Growth influenced by sunlight
        this.size += growthRate;
        this.mesh.scale.set(this.size / 0.1, this.size / 0.1, this.size / 0.1); // Scale the mesh
        this.mesh.position.y = this.size; // Adjust position to stay on ground

        // Update growth stage based on size
        if (this.size > 0.5) {
            this.growthStage = 'flowering';
        } else if (this.size > 0.2) {
            this.growthStage = 'mature';
        }
    }

    // Placeholder for reproduction logic
    reproduce() {
        // Implement reproduction (e.g., dropping seeds)
    }

    // Placeholder for health updates
    updateHealth(amount) {
        this.health += amount;
        if (this.health > 100) this.health = 100;
        if (this.health < 0) this.health = 0;
    }

    // Get the mesh for adding to the scene
    getMesh() {
        return this.mesh;
    }
}

export { Plant };