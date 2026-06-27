# Balatrop Agent Guidelines & Rules

This file defines style guidelines, behavioral constraints, and project rules for AI agents working on the **Balatrop** codebase.

---

## 🏗️ Project Architecture Rules

1. **State Separation**:
   - Keep game logic, deck state, scoring calculations, and type effectiveness rules encapsulated within `src/game/GameState.ts`.
   - Vue components (under `src/components/` and `src/App.vue`) should be presentation-focused, utilizing properties and methods exposed by the reactive `GameState` class.

2. **Pokémon Data**:
   - Do not hardcode Pokémon stats, evolutions, or types. Use the JSON definitions located in `src/pokemon/*.json`.
   - If modification or generation of Pokemon data is required, utilize or modify the `trustme.py` compilation script.

3. **Type Effectiveness**:
   - Refer to `src/typeRelationsMap.json` for calculating type matchups and damage multipliers. Do not invent custom type relationships.

---

## 🎨 Styling & Component Guidelines

1. **Tailwind CSS**:
   - Use Tailwind CSS v4 utility classes for layout, typography, and colors.
   - Design with a rich, dark-mode/arcade aesthetic matching the Balatro pixel-art feel.

2. **Vue Composition API**:
   - Use `<script setup lang="ts">` for all Vue component logic.
   - Use strict TypeScript typing for component props and events.

---

## 🧪 Testing & Formatting

1. **Unit Testing**:
   - Write tests for any new game logic, hand evaluations, or utility functions using **Vitest**.
   - Unit tests are located in `__tests__` subdirectories relative to the module they test (e.g., `src/game/__tests__/`).

2. **End-to-End (E2E) Testing**:
   - Write or update E2E integration tests in the `tests/` directory using **Playwright** to cover full game loops and failure states.

3. **Formatting & Linting**:
   - Always run Prettier formatting (`npm run format`) and ESLint checks (`npm run lint`) before finishing tasks to keep the codebase clean.
