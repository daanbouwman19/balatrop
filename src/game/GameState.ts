import typeRelationsMap from "@/typeRelationsMap.json";

// Interfaces
export interface PokemonCard {
  name: string;
  value: number;
  image: string;
  evolvedFrom: string | null;
  evolvesTo: string[] | null;
  types: { type: { name: string } }[];
  id: string; // Unique ID for UI rendering
}

export interface EnemyData {
  pokemon: PokemonCard;
  hp: number;
  maxHp: number;
  damageTaken: number; // For visual effect
}

interface PokemonJsonData {
  name: string;
  order: number;
  sprite: string;
  evolvedFrom: string | null;
  evolvesTo: string[];
  types: { type: { name: string } }[];
}

interface DamageRelations {
  doubleDamageTo: string[];
  halfDamageTo: string[];
  noDamageTo: string[];
}

interface TypeRelations {
  [key: string]: DamageRelations;
}

export class GameState {
  // State
  state: "START" | "INTRO" | "FILLHAND" | "SELECT_CARDS" | "GAME_OVER" =
    "START";

  hand_cards: PokemonCard[] = [];
  player_deck: PokemonCard[] = [];
  drawed_this_round: PokemonCard[] = [];

  enemy: EnemyData | null = null;
  enemies_defeated = 0;

  score = 0;
  submitsRemaining = 0;
  discardsRemaining = 0;
  fightReward = 0;

  selectedCards: PokemonCard[] = [];

  pokemon_cards: PokemonCard[] = [];

  // Intro state
  introMessage = "";
  introMessages: string[] = [];

  lastSubmittedHand: {
    damage: number;
    cardCount: number;
    timestamp: number;
    cards: { damage: number; id: string }[];
  } | null = null;

  constructor() {
    this.pokemon_cards = this.initializePokemonCards();
    this.restartGame();
  }

  initializePokemonCards(): PokemonCard[] {
    const pokemonCards: PokemonCard[] = [];
    const modules: Record<string, unknown> = import.meta.glob(
      "@/pokemon/*.json",
      { eager: true },
    );
    for (const path in modules) {
      const pokemonData = modules[path] as PokemonJsonData;
      const card: PokemonCard = {
        name: pokemonData.name,
        value: (pokemonData.order % 5) + 1,
        image: pokemonData.sprite,
        evolvedFrom: pokemonData.evolvedFrom,
        evolvesTo: pokemonData.evolvesTo,
        types: pokemonData.types,
        id: crypto.randomUUID(), // Unique ID
      };
      pokemonCards.push(card);
    }
    return pokemonCards;
  }

  initializeDeck(): PokemonCard[] {
    const deck: PokemonCard[] = [];
    this.pokemon_cards.forEach((card) => {
      if (card.evolvedFrom === null && deck.length < 40) {
        // Create a copy to ensure unique IDs if we ever have duplicates,
        // though currently logic pushes same reference.
        // For safety in Vue v-for, we'll keep the reference but ensure IDs are unique if we generated them.
        deck.push(card);
      }
    });
    return deck;
  }

  restartGame() {
    this.state = "START";
    this.player_deck = this.initializeDeck();
    this.drawed_this_round = [];
    this.hand_cards = [];
    this.selectedCards = [];
    this.score = 0;
    this.enemies_defeated = 0;
    this.submitsRemaining = 4;
    this.discardsRemaining = 3;
    this.fightReward = 50;

    this.introMessages = [
      "Welcome to the game!",
      "I am your Rival.",
      "I want coins.",
      "You will get coins for me.",
      "Or else.",
      "You will lose.",
      "Smell ya later!",
    ];
    this.startIntro();
  }

  startIntro() {
    this.state = "INTRO";
    this.nextIntroMessage();
  }

  nextIntroMessage() {
    if (this.introMessages.length > 0) {
      this.introMessage = this.introMessages.shift() || "";
    } else {
      this.introMessage = "";
      this.spawnEnemy();
      this.fillHand();
    }
  }

  spawnEnemy() {
    const randomCard =
      this.pokemon_cards[Math.floor(Math.random() * this.pokemon_cards.length)];
    const difficulty = this.enemies_defeated;

    // New Scaling: BaseHp + (Diff * Scale) + (BaseHp * 1.2^Diff)
    // Less punishing exponential, but adds linear progression.
    const baseHp = 300;
    const linearGrowth = difficulty * 50;
    const exponentialGrowth = baseHp * Math.pow(1.2, difficulty);

    // For first enemy (difficulty=0): 0 + 300 = 300. Same as before.
    // difficulty=1: 50 + 360 = 410. (vs 450 old)
    // difficulty=5: 250 + 300*2.48 = 250 + 744 = 994. (vs 300*7.59 = 2277 old)
    // Much more reasonable scaling.

    const hp = Math.floor(linearGrowth + exponentialGrowth);

    this.enemy = {
      pokemon: randomCard,
      hp: hp,
      maxHp: hp,
      damageTaken: 0,
    };

    this.fightReward = randomCard.value * 10;
    this.submitsRemaining = 4;
    this.discardsRemaining = 3; // Reset discards per enemy
  }

  drawCardFromDeck(): PokemonCard | undefined {
    const availableCards = this.player_deck.filter(
      (card) => !this.drawed_this_round.includes(card),
    );

    if (availableCards.length === 0) {
      return undefined;
    }

    const card =
      availableCards[Math.floor(Math.random() * availableCards.length)];
    this.drawed_this_round.push(card);

    // Return a clone with a unique ID to allow duplicates in hand without selection bugs
    return {
      ...card,
      id: crypto.randomUUID(),
    };
  }

  fillHand() {
    this.state = "FILLHAND";
    this.drawed_this_round = [];

    const HAND_SIZE = 8;
    while (this.hand_cards.length < HAND_SIZE) {
      const card = this.drawCardFromDeck();
      if (card) {
        this.hand_cards.push(card);
      } else {
        break; // Deck exhausted
      }
    }
    this.state = "SELECT_CARDS";
  }

  discardSelected() {
    if (
      this.state !== "SELECT_CARDS" ||
      this.selectedCards.length === 0 ||
      this.discardsRemaining <= 0
    )
      return;

    this.discardsRemaining -= 1;

    // Remove selected cards from hand
    this.hand_cards = this.hand_cards.filter(
      (card) => !this.selectedCards.includes(card),
    );
    this.selectedCards = [];

    // Refill hand
    this.fillHand();
  }

  toggleSelectCard(card: PokemonCard) {
    if (this.state !== "SELECT_CARDS") return;

    const index = this.selectedCards.indexOf(card);
    if (index > -1) {
      this.selectedCards.splice(index, 1);
    } else {
      if (this.selectedCards.length < 5) {
        this.selectedCards.push(card);
      }
    }
  }

  getTypeEffectiveness(
    card: PokemonCard,
    targetTypes: { type: { name: string } }[],
  ): number {
    if (!card.types || !targetTypes) return 1;

    let maxMultiplier = 0;
    let hasValidType = false;
    const typedTypeRelationsMap = typeRelationsMap as TypeRelations;

    card.types.forEach((cardTypeObj) => {
      let currentTypeMultiplier = 1;
      const cardTypeName = cardTypeObj.type.name;

      if (!typedTypeRelationsMap[cardTypeName]) {
        return;
      }

      hasValidType = true;
      const damageRelations = typedTypeRelationsMap[cardTypeName];

      targetTypes.forEach((type) => {
        if (damageRelations.doubleDamageTo.includes(type.type.name)) {
          currentTypeMultiplier *= 2;
        } else if (damageRelations.halfDamageTo.includes(type.type.name)) {
          currentTypeMultiplier *= 0.5;
        } else if (damageRelations.noDamageTo.includes(type.type.name)) {
          currentTypeMultiplier *= 0;
        }
      });

      if (currentTypeMultiplier > maxMultiplier) {
        maxMultiplier = currentTypeMultiplier;
      }
    });

    return hasValidType ? maxMultiplier : 1;
  }

  evaluateHand(cards: PokemonCard[]): {
    name: string;
    chips: number;
    mult: number;
  } {
    if (cards.length === 0) return { name: "High Card", chips: 0, mult: 0 };

    const values = cards.map((c) => c.value).sort((a, b) => a - b);

    // Check Flush (All cards share at least one type)
    let isFlush = false;
    if (cards.length >= 5) {
      let commonTypes = cards[0].types.map((t) => t.type.name);
      for (let i = 1; i < cards.length; i++) {
        const nextTypes = cards[i].types.map((t) => t.type.name);
        commonTypes = commonTypes.filter((c) => nextTypes.includes(c));
      }
      isFlush = commonTypes.length > 0;
    }

    // Check Straight (Consecutive values)
    let isStraight = false;
    if (cards.length === 5) {
      isStraight = true;
      for (let i = 0; i < values.length - 1; i++) {
        if (values[i + 1] !== values[i] + 1) {
          isStraight = false;
          break;
        }
      }
    }

    // Check Counts
    const counts: Record<number, number> = {};
    values.forEach((v) => (counts[v] = (counts[v] || 0) + 1));
    const countValues = Object.values(counts).sort((a, b) => b - a);

    if (countValues[0] === 5)
      return { name: "Five of a Kind", chips: 120, mult: 12 };
    // Buffed straight flush
    if (isStraight && isFlush)
      return { name: "Straight Flush", chips: 120, mult: 10 };
    if (countValues[0] === 4)
      return { name: "Four of a Kind", chips: 60, mult: 7 };
    if (countValues[0] === 3 && countValues[1] === 2)
      return { name: "Full House", chips: 40, mult: 4 };
    // Buffed flush
    if (isFlush) return { name: "Flush", chips: 50, mult: 6 };
    // Buffed straight
    if (isStraight) return { name: "Straight", chips: 45, mult: 5 };
    if (countValues[0] === 3)
      return { name: "Three of a Kind", chips: 30, mult: 3 };
    if (countValues[0] === 2 && countValues[1] === 2)
      return { name: "Two Pair", chips: 20, mult: 2 };
    if (countValues[0] === 2) return { name: "Pair", chips: 10, mult: 2 };

    return { name: "High Card", chips: 5, mult: 1 };
  }

  calculateCurrentHandStats() {
    if (this.selectedCards.length === 0)
      return { multiplier: 0, damage: 0, handName: "None", cardDetails: [] };

    const handStats = this.evaluateHand(this.selectedCards);

    let totalChips = handStats.chips;
    const totalMult = handStats.mult;

    const cardDetails = this.selectedCards.map((card) => {
      // Card Chips
      const baseCardChips = card.value * 10;
      const typeEffectiveness = this.enemy
        ? this.getTypeEffectiveness(card, this.enemy.pokemon.types)
        : 1;

      const cardChips = Math.floor(baseCardChips * typeEffectiveness);
      totalChips += cardChips;

      return {
        id: card.id,
        damage: cardChips * totalMult, // Damage contributed by this card
      };
    });

    return {
      multiplier: totalMult,
      damage: totalChips,
      handName: handStats.name,
      cardDetails,
    };
  }

  submitHand() {
    if (
      this.state !== "SELECT_CARDS" ||
      this.selectedCards.length === 0 ||
      !this.enemy
    )
      return;

    this.submitsRemaining -= 1;

    const stats = this.calculateCurrentHandStats();
    const totalScore = stats.damage * stats.multiplier;

    // Capture number of cards for animation timing
    const cardCount = this.selectedCards.length;

    this.lastSubmittedHand = {
      damage: totalScore,
      cardCount,
      timestamp: Date.now(),
      cards: stats.cardDetails,
    };

    // Remove played cards (Starts animation)
    this.hand_cards = this.hand_cards.filter(
      (c) => !this.selectedCards.includes(c),
    );
    this.selectedCards = [];

    // Delay damage application to sync with stored animation (approx 300ms per card staggered)
    // Base delay 300ms + 100ms per card index
    const delay = 450 + (cardCount - 1) * 100;

    setTimeout(() => {
      // Apply Damage
      if (this.enemy) {
        this.enemy.hp -= totalScore;
        this.enemy.damageTaken += totalScore;

        // Check Death
        if (this.enemy.hp <= 0) {
          this.enemies_defeated += 1;
          this.score += this.fightReward;
          this.spawnEnemy();
          // Reset submits on kill
          this.submitsRemaining = 4;
          this.fillHand();
        } else {
          if (this.submitsRemaining <= 0) {
            this.state = "GAME_OVER";
          } else {
            this.fillHand();
          }
        }
      }
    }, delay);
  }
  get currentMultiplier() {
    return this.calculateCurrentHandStats().multiplier;
  }

  get currentDamage() {
    return this.calculateCurrentHandStats().damage;
  }

  get currentHandName() {
    return this.calculateCurrentHandStats().handName;
  }
}
