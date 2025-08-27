### Fullstack Architecture Document - DRAFT v1

### 1. Introduction

This document outlines the complete fullstack architecture for the EcoSim project. It serves as the single source of truth for AI-driven development, ensuring consistency across the entire technology stack. Since this is a monolithic desktop application, "backend" will refer to the core simulation logic and "frontend" will refer to the Pygame-based rendering engine.

*   **Starter Template or Existing Project:** N/A - Greenfield project.

**Change Log**

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2025-08-27 | 1.1 | Implemented Save/Load, Simple Evolution, Water Sources, Carnivores, and updated rendering for emojis. | Sol (AI IDE Agent) |
| 2025-08-26 | 1.0 | Initial draft generated from PRD v1.0. | Winston (Architect) |

---
### 2. High-Level Architecture

**Technical Summary**
The architecture for EcoSim will be a monolithic desktop application developed in Python, using the Pygame library for rendering. It will be built upon an Entity-Component-System (ECS) pattern to promote modularity and scalability. The core design principle is a strict separation between the simulation logic (the "model") and the rendering engine (the "view"), which will enable headless operation and simplified testing. The simulation's progression is driven by a "WorldClock" module that is synchronized to the host machine's real-world time.

**Platform and Infrastructure Choice**
*   **Platform:** Local Desktop (Linux, Windows, macOS).
*   **Key Services:** N/A (No cloud or external services required for MVP).
*   **Deployment Host and Regions:** N/A.

**Repository Structure**
*   **Structure:** Monorepo. A single repository will contain all code for the project.
*   **Monorepo Tool:** N/A (Simple directory structure is sufficient).

**High-Level Architecture Diagram**
```mermaid
graph TD
    subgraph User's Machine
        subgraph EcoSim Application
            A[Main Loop] --> B{WorldClock};
            B --> C{Event Bus};
            C --> D[Movement System];
            C --> E[Growth System];
            C --> F[Foraging System];
            C --> G[Reproduction System];
            C --> N[Thirst System];
            C --> O[Hunting System];
            C --> P[Save/Load System];

            subgraph Simulation State (Model)
                H[Entity Manager]
                I[Component Data (Position, Energy, AIState, Traits, Thirst, WaterSource, Carnivore)]
            end

            subgraph Rendering Engine (View)
                J[Render System]
            end

            D & E & F & G & N & O & P --> H;
            H --> I;
            J --> H;
            A --> J;
        end
    end

    K[System Clock] --> B;
    L[User Input] --> A;
    J --> M[Display];

```

**Architectural Patterns**
*   **Entity-Component-System (ECS):** The core of our architecture. Entities (like Plants, Herbivores) will be simple IDs. Components (like Position, Energy, AIState) will be plain data classes. Systems (like MovementSystem, RenderSystem) will contain all the logic and operate on entities that have a specific set of components. *Rationale: This provides maximum flexibility and decouples logic from data, making it easy to add new behaviors and entity types later.*
*   **Model-View-Controller (MVC) - Adapted:** We will use an adapted version of MVC where the simulation logic (Model) is completely separate from the Pygame rendering (View). The main loop will act as the Controller, processing inputs and orchestrating updates between the Model and the View. *Rationale: This enforces separation of concerns, which is critical for testing and potential headless operation.*
*   **Observer:** A simple event bus will be used to broadcast system-wide events (e.g., `TICK`, `DAY_START`). Systems can subscribe to these events to trigger their logic. *Rationale: This avoids tight coupling between systems.*

---
### 3. Tech Stack

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| Backend Language | Python | 3.10+ | Core simulation logic | User preference, excellent for scripting and prototyping. |
| Frontend Framework | Pygame | 2.5+ | 2D Rendering & Windowing | User preference, simple and effective for 2D graphics. |
| Backend Testing | pytest | latest | Unit & Integration testing | Industry standard, powerful and flexible test runner. |
| Build Tool | N/A | | | Not required for MVP. |
| CI/CD | GitHub Actions | | Automated testing | Standard, free for open-source projects. |

---
### 4. Data Models (Components)

**Position Component**
*   **Purpose:** To store an entity's x,y coordinates in the world.
*   **Python Equivalent:**
    ```python
    from dataclasses import dataclass

    @dataclass
    class Position:
        x: float
        y: float
    ```

**Energy Component**
*   **Purpose:** To store an entity's current energy level and maximum capacity.
*   **Python Equivalent:**
    ```python
    from dataclasses import dataclass

    @dataclass
    class Energy:
        current: float
        max: float
    ```

**Renderable Component**
*   **Purpose:** To define how an entity should be drawn on the screen, now using emojis.
*   **Python Equivalent:**
    ```python
    from dataclasses import dataclass

    @dataclass
    class Renderable:
        emoji_char: str
        color: tuple
    ```

**AIState Component**
*   **Purpose:** To manage the current behavior of an AI-controlled entity, with new states for water seeking and hunting.
*   **Python Equivalent:**
    ```python
    from dataclasses import dataclass
    from enum import Enum, auto

    class AIStateEnum(Enum):
        WANDERING = auto()
        FORAGING = auto()
        MATING = auto()
        IDLE = auto()
        READY_TO_MATE = auto()
        RESTING = auto()
        EXPLORING = auto()
        SEEKING_WATER = auto()
        HUNTING = auto()

    @dataclass
    class AIState:
        current_state: AIStateEnum
    ```

**Traits Component**
*   **Purpose:** Defines mutable traits for an entity, subject to evolution.
*   **Python Equivalent:**
    ```python
    from dataclasses import dataclass

    @dataclass
    class Traits:
        speed: float = 1.0
        energy_efficiency: float = 1.0
        size_multiplier: float = 1.0
    ```

**Thirst Component**
*   **Purpose:** Represents the thirst level of an entity.
*   **Python Equivalent:**
    ```python
    from dataclasses import dataclass

    @dataclass
    class Thirst:
        current: float
        max: float
    ```

**WaterSource Component**
*   **Purpose:** A tag component to identify an entity as a water source.
*   **Python Equivalent:**
    ```python
    from dataclasses import dataclass

    @dataclass
    class WaterSource:
        pass
    ```

**Carnivore Component**
*   **Purpose:** A tag component to identify an entity as a carnivore.
*   **Python Equivalent:**
    ```python
    from dataclasses import dataclass

    @dataclass
    class Carnivore:
        pass
    ```

---
### 5. Unified Project Structure

```
EcoSim/
├── .github/
│   └── workflows/
│       └── test.yaml           # CI workflow for pytest
├── docs/
│   ├── brief.md
│   ├── prd.md
│   └── architecture.md
├── src/
│   ├── components/             # All data components (position.py, energy.py, traits.py, thirst.py, water_source.py, carnivore.py)
│   ├── ecs/                    # Entity-Component-System core (entity_manager.py)
│   ├── entities/               # Entity factory functions (plant.py, herbivore.py, water_source.py, carnivore.py)
│   ├── systems/                # All logic systems (render_system.py, growth_system.py, movement_system.py, energy_depletion_system.py, foraging_system.py, reproduction_system.py, cooldown_system.py, ai_control_system.py, camera_system.py, save_load_system.py, thirst_system.py, hunting_system.py)
│   ├── config.py               # Global configuration (screen size, simulation params)
│   └── main.py                 # Main application loop and entry point
├── assets/                     # Sprites, images
│   ├── plant.png
│   └── herbivore.png
├── tests/
│   ├── test_systems.py
│   └── test_components.py
├── .gitignore
├── README.md
└── requirements.txt            # Project dependencies (pygame, pytest)
```

---
### 6. Development Workflow

**Local Development Setup**
*   **Prerequisites:** `python3 -m venv .venv && source .venv/bin/activate`
*   **Initial Setup:** `pip install -r requirements.txt`
*   **Development Commands:** `python src/main.py`
*   **Run tests:** `pytest`

---
### 7. Coding Standards

*   **Style Guide:** All Python code must adhere to PEP 8.
*   **Type Hinting:** All function signatures and variables should include type hints.
*   **Component Data:** Components must only contain data, no logic.
*   **System Logic:** Systems must not store state; all state should be in components.

---