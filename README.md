# 🃏 Balatrop

A thrilling rogue-like poker-inspired deckbuilding game set in the Pokémon universe, built using **Vue 3**, **Vite**, and **Tailwind CSS**.

Balatrop combines the additive strategy of *Balatro* (submitting poker hands to score points/damage) with the deep type relations and evolution dynamics of *Pokémon*. Battle active enemy Pokémon by selecting hands from your deck, leveraging type advantages, and surviving scaling difficulty levels.

---

## 🎮 Game Concept & Rules

In **Balatrop**, you start with a deck of basic (non-evolved) Gen 1 Pokémon. Each round, you are confronted by a random enemy Pokémon with a specific HP pool.

### The Objective
Submit hands of up to **5 Pokémon cards** from your hand to deal damage to the enemy. Defeat the enemy before running out of submissions (hands remaining).

### Key Mechanics

1. **Poker Hands (Pokémon Hands)**
   Similar to poker, the cards you select are evaluated based on their values (based on Pokémon order) and types:
   * **High Card**: Chips 5, Mult 1
   * **Pair**: Chips 10, Mult 2
   * **Two Pair**: Chips 20, Mult 2
   * **Three of a Kind**: Chips 30, Mult 3
   * **Straight**: 5 cards with consecutive values. Chips 45, Mult 5
   * **Flush**: 5 cards that all share at least one common type. Chips 50, Mult 6
   * **Full House**: Three of a Kind + Pair. Chips 40, Mult 4
   * **Four of a Kind**: Chips 60, Mult 7
   * **Straight Flush**: Straight + Flush. Chips 120, Mult 10
   * **Five of a Kind**: Chips 120, Mult 12

2. **Damage Calculation**
   * Each Pokémon card has a base value (1 to 5), representing `Value * 10` chips.
   * Total Hand Chips = `Hand Type Base Chips` + sum of (`Card Base Chips` * `Type Effectiveness Multiplier`).
   * Total Hand Multiplier = `Hand Type Base Mult`.
   * **Total Damage Dealt = Total Hand Chips * Total Hand Multiplier**.

3. **Type Effectiveness**
   * Every card in Balatrop has one or more types (e.g., Grass, Poison, Fire, Flying).
   * When attacking the enemy, each card's chip contribution is multiplied by its type effectiveness against the active enemy's types:
     * **Double Damage (2x)**: e.g., Water against Fire.
     * **Half Damage (0.5x)**: e.g., Fire against Water.
     * **No Damage (0x)**: e.g., Normal against Ghost.
     * **Neutral (1x)**: Default.
   * If a card has multiple types, the maximum effectiveness multiplier is used.

4. **Resource Management**
   * **Submissions**: You start with 4 submits per fight. If you run out of submissions and the enemy is still standing, it's **Game Over**.
   * **Discards**: You start with 3 discards per fight. Use them to discard unwanted cards and draw replacements from your deck.
   * **Enemy Scaling**: Defeating an enemy awards coin rewards and spawns a new, stronger enemy. The enemy HP scales exponentially with each defeated opponent:
     $$\text{HP} = \lfloor(\text{Difficulty} \times 50) + (\text{Base HP} \times 1.2^{\text{Difficulty}})\rfloor$$

---

## 🛠️ Technology Stack

Balatrop utilizes modern frontend frameworks and developer tooling:

* **Framework**: [Vue 3](https://vuejs.org/) (Composition API, `<script setup lang="ts">`, reactive state management).
* **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) (utility-first CSS with native Vite integration).
* **Build Tooling**: [Vite](https://vitejs.dev/) (fast hot-reloads and optimized production bundling).
* **Language**: [TypeScript](https://www.typescriptlang.org/) (strictly-typed game interfaces and components).
* **Testing**:
  * Unit/Component Tests: [Vitest](https://vitest.dev/) & [@vue/test-utils](https://test-utils.vuejs.org/).
  * End-to-End Tests: [Playwright](https://playwright.dev/).
* **Linting & Formatting**: [ESLint](https://eslint.org/) & [Prettier](https://prettier.io/).

---

## 📂 Project Structure

```text
├── .devcontainer/             # Dev container settings
├── .github/                   # GitHub action workflows
├── public/                    # Static assets
│   ├── images/                # Backgrounds, icons, etc.
│   └── pokemon/               # Dynamically generated individual Pokémon data
├── src/
│   ├── assets/                # Global styles and assets
│   ├── components/            # Vue UI components
│   │   ├── score-bar/         # Left sidebar with score, enemy stats, and hand info
│   │   ├── PokemonCard.vue    # Interactive individual card component
│   │   └── CurrentMoney.vue   # Display of player's coins
│   ├── game/
│   │   └── GameState.ts       # Core game engine (deck, drawing, evaluation, states)
│   ├── pokemon/               # JSON assets for all Gen 1 Pokémon
│   ├── tests/                 # Test suites
│   ├── utils/                 # Utility functions
│   ├── App.vue                # Main application wrapper and animations
│   ├── main.ts                # App bootstrapper
│   └── typeRelationsMap.json  # Complete Pokémon type effectiveness matrix
├── trustme.py                 # Python script to build evolution relationships
├── vite.config.ts             # Vite configuration
└── package.json               # Node dependencies and scripts
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) installed (version 18+ recommended).

### Installation

Install all project dependencies:
```bash
npm install
```

### Development Server

Run the local development server with hot-reloads:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to play the game!

### Build for Production

Compile TypeScript and build a minified production bundle to the `dist` directory:
```bash
npm run build
```

To preview the production build locally:
```bash
npm run preview
```

---

## 🧪 Testing and Quality Control

Balatrop includes a robust suite of tests:

### Running Unit Tests (Vitest)
```bash
# Run tests once
npm run test

# Run tests in watch mode for development
npm run test:watch

# Generate code coverage reports
npm run test:coverage
```

### Running E2E Tests (Playwright)
```bash
# Run integration/E2E tests
npm run test:e2e
```

### Linting & Formatting
```bash
# Check formatting and style rules
npm run lint

# Format codebase with Prettier
npm run format
```

---

## 🔮 Future Roadmap / Gameplay Enhancements

* **Evolution Mechanics**: Evolve Pokémon during the run to increase their base values and unlock powerful type combinations.
* **Held Items / TMs**: Acquire items (Joker-equivalents) that grant passive bonuses, multiplier upgrades, or change Pokémon types.
* **Boss Blinds / Gym Leaders**: Face special gym leaders with custom rulesets (e.g. "Only Fire-type hands deal damage" or "No Discards allowed").
* **Deck Customization**: Draft new Pokémon cards into your deck after defeating bosses.

