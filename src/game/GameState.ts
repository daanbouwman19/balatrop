
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
  state: "START" | "INTRO" | "FILLHAND" | "SELECT_CARDS" | "GAME_OVER" = "START";

  hand_cards: PokemonCard[] = [];
  player_deck: PokemonCard[] = [];
  drawed_this_round: PokemonCard[] = [];

  enemy: EnemyData | null = null;
  enemies_defeated = 0;

  score = 0;
  submitsRemaining = 0;
  fightReward = 0;

  selectedCards: PokemonCard[] = [];

  pokemon_cards: PokemonCard[] = [];

  // Intro state
  introMessage = "";
  introMessages = [
    "Welcome to the game!",
    "I am Professor Frank.",
    "I want beer.",
    "You will get beer for me.",
    "Or else.",
    "You will die.",
    "Byeee",
  ];

  constructor() {
    this.pokemon_cards = this.initializePokemonCards();
    this.restartGame();
  }

  initializePokemonCards(): PokemonCard[] {
    const pokemonCards: PokemonCard[] = [];
    const modules: Record<string, unknown> = import.meta.glob(
      "@/pokemon/*.json",
      { eager: true }
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
        id: Math.random().toString(36).substring(7), // Simple unique ID
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
        // Actually, initializePokemonCards generates one ID per card definition.
        // If we want multiple copies in deck, we should clone.
        // But original logic just pushed the card reference.
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
    this.submitsRemaining = 3;
    this.fightReward = 5;

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
    const hp = randomCard.value * 10 * (difficulty + 1);

    this.enemy = {
      pokemon: randomCard,
      hp: hp,
      maxHp: hp,
      damageTaken: 0,
    };

    this.fightReward = randomCard.value;
    this.submitsRemaining = 3;
  }

  drawCardFromDeck(): PokemonCard | undefined {
    const availableCards = this.player_deck.filter(
      (card) => !this.drawed_this_round.includes(card)
    );

    if (availableCards.length === 0) {
      return undefined;
    }

    const card =
      availableCards[Math.floor(Math.random() * availableCards.length)];
    this.drawed_this_round.push(card);
    return card;
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

  calculateTypeMultiplier(
    card: PokemonCard,
    targetTypes: { type: { name: string } }[]
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

  submitHand() {
    if (
      this.state !== "SELECT_CARDS" ||
      this.selectedCards.length === 0 ||
      !this.enemy
    )
      return;

    this.submitsRemaining -= 1;

    // Calculate Multiplier Logic
    let totalCardsMultiplier = 1;
    const cardTypesCount: { [key: string]: number } = {};

    // First pass: Calculate combo multiplier
    this.selectedCards.forEach((card) => {
      card.types.forEach((type) => {
        const typeName = type.type.name;
        if (cardTypesCount[typeName]) {
          totalCardsMultiplier += 1.5;
          cardTypesCount[typeName]++;
        } else {
          cardTypesCount[typeName] = 1;
        }
      });
    });

    // Second pass: Calculate Damage
    let totalDamage = 0;
    const attackHistory: any[] = [];

    this.selectedCards.forEach((card) => {
      const baseDamage = card.value;
      const typeMultiplier = this.calculateTypeMultiplier(
        card,
        this.enemy!.pokemon.types
      );
      const damage = baseDamage * typeMultiplier * totalCardsMultiplier;

      totalDamage += damage;

      attackHistory.push({
        cardName: card.name,
        damage: damage,
      });
    });

    // Remove played cards (Starts animation)
    this.hand_cards = this.hand_cards.filter(
      (c) => !this.selectedCards.includes(c)
    );
    this.selectedCards = [];

    // Delay damage application to sync with animation
    setTimeout(() => {
        // Apply Damage
        if (this.enemy) {
            this.enemy.hp -= totalDamage;
            this.enemy.damageTaken += totalDamage; // Could be used for animation
            
            // Check Death
            if (this.enemy.hp <= 0) {
              this.enemies_defeated += 1;
              this.score += this.fightReward;
              this.spawnEnemy();
              // If submits remaining > 0, refill hand?
              // Old logic: if submits > 0 -> FILLHAND.
              if (this.submitsRemaining > 0) {
                this.fillHand();
              } else {
                // If enemy died but no submits left?
                // Wait, if enemy dies, we get new enemy and resets submits?
                // Old logic: spawnEnemy() resets submits to 3.
                // So yes.
                this.fillHand();
              }
            } else {
              if (this.submitsRemaining <= 0) {
                this.state = 'GAME_OVER';
              }
            }
        }
    }, 300);
  }

  get currentMultiplier() {
    let multiplier = 1;
    const cardTypesCount: { [key: string]: number } = {};
    this.selectedCards.forEach(card => {
       card.types.forEach(type => {
         const typeName = type.type.name;
         if (cardTypesCount[typeName]) {
           multiplier += 1.5;
           cardTypesCount[typeName]++;
         } else {
           cardTypesCount[typeName] = 1;
         }
       });
    });
    return multiplier;
  }

  get currentDamage() {
    let damage = 0;
    const multiplier = this.currentMultiplier;
    this.selectedCards.forEach(card => {
      const typeMult = this.calculateTypeMultiplier(card, this.enemy?.pokemon.types || []);
      damage += card.value * typeMult * multiplier;
    });
    return damage;
  }
}
