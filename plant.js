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
        const minSunlightForGrowth = 0.2; // Minimum sunlight intensity for growth
        const decayRate = 0.0005; // Rate of decay when sunlight is insufficient

        if (sunlightAmount > minSunlightForGrowth) {
            const growthRate = 0.001 * sunlightAmount; // Growth influenced by sunlight
            this.size += growthRate;
        } else {
            this.size -= decayRate; // Decay if not enough sunlight
        }

        // Ensure size doesn't go below a minimum or above a maximum
        this.size = Math.max(0.01, Math.min(2.0, this.size));

        // Update mesh scale and position
        this.mesh.scale.set(this.size / 0.1, this.size / 0.1, this.size / 0.1);
        this.mesh.position.y = this.size;

        // Update growth stage based on size
        if (this.size > 1.0) {
            this.growthStage = 'flowering';
        } else if (this.size > 0.5) {
            this.growthStage = 'mature';
        } else {
            this.growthStage = 'seedling';
        }

        // If plant shrinks to minimum size, it dies (will be handled in main.js later)
        if (this.size <= 0.01) {
            this.health = 0; // Mark as dead
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