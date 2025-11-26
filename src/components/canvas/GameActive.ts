import { Screen } from "./screen";
import Entity from "./entity/entity";
import { FrankEntity } from "./entity/impl/FrankEntity";
import { CardEntity, PokemonCard } from "./entity/impl/cardEntity";
import { EnemyEntity } from "./entity/impl/EnemyEntity";
import { ButtonEntity } from "./entity/impl/ButtonEntity";
import { MultiplierEntity } from "./entity/impl/MultiplierEntity";
import { DamageEntity } from "./entity/impl/DamageEntity";
import { GameOverEntity } from "./entity/impl/GameOverEntity";
import { SubmitsRemainingEntity } from "./entity/impl/SubmitsRemainingEntity";
import { SelectedCardsCounterEntity } from "./entity/impl/SelectedCardsCounterEntity";

interface AttackLog {
    card: {
        name: string;
        type: { type: { name: string } }[];
    };
    damage: number;
}

export class GameActive {
    STATE: string;
    t: number;
    anim: number;
    selectedCardsCounter: SelectedCardsCounterEntity | null;
    entities: Entity[];
    pokemon_cards: PokemonCard[];
    player_deck: PokemonCard[];
    drawed_this_round: PokemonCard[];
    hand_cards: PokemonCard[];
    submitsRemainingEntity: SubmitsRemainingEntity | null;
    enemies_defeated: number;
    canvas: HTMLCanvasElement;
    screen: Screen;
    totalCardsMultiplier: number;
    totalCardsDamage: number;
    score: number;
    fightReward: number;
    enemy: EnemyEntity;
    submitsRemaining: number;
    attack_queue: CardEntity[];
    cardTypes: { [key: string]: number };
    attack_history: AttackLog[];

    constructor(canvas: HTMLCanvasElement) {
        this.pokemon_cards = this.initializePokemonCards();
        this.enemy = new EnemyEntity(0, 0, 0, 0, this.pokemon_cards[0], 0);
        this.submitsRemaining = 0;
        this.attack_queue = [];
        this.attack_history = [];
        // States
        this.STATE = "START";
        this.t = 0;
        this.anim = 0;

        this.selectedCardsCounter = null;

        // Initialize entities before adding any entities
        this.entities = [];

        this.player_deck = this.initializeDeck();
        this.drawed_this_round = [];

        // Game
        this.hand_cards = [];

        // Now it's safe to add entities
        this.submitsRemainingEntity = new SubmitsRemainingEntity(this);
        this.addEntity(this.submitsRemainingEntity);
        this.enemies_defeated = 0;

        // Rendering
        this.canvas = canvas;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.screen = new Screen(canvas);

        // Visual damage rendering
        this.totalCardsMultiplier = 1;
        this.totalCardsDamage = 1;

        this.score = 0;
        this.fightReward = 5;

        this.screen.clear();
        this.canvas.addEventListener("mousemove", (event: MouseEvent) => {
            this.screen.updateMousePosition(event);
        });
        window.addEventListener("resize", () => {
            this.screen.resize(this.canvas.clientWidth, this.canvas.clientHeight);
        });
        this.canvas.addEventListener("click", (event: MouseEvent) => {
            this.handleClick(event);
        });
        this.canvas.addEventListener("touchstart", (event: TouchEvent) => {
            this.handleClick(event);
        });
        window.addEventListener("keydown", (event: KeyboardEvent) => {
            this.entities.forEach(entity => {
                if ('keydown' in entity && typeof (entity as any).keydown === 'function') {
                    (entity as any).keydown(event);
                }
            });
        });

        // Start the intro sequence
        this.startIntro();
    }

    startIntro(): void {
        const frank = new FrankEntity(100, 100, 200, 200, "#FF0000");
        frank.intro();
        this.addEntity(frank);

        this.enterState("INTRO");
    }

    spawnEnemy(): void {
        const width = this.screen.width/4;
        const height = this.screen.height/4;
        const x = this.screen.width/2 - width/2;
        const y = this.screen.height/2 -height/2;
        this.enemy = new EnemyEntity(x, y, width, height, this.pokemon_cards[Math.floor(Math.random() * this.pokemon_cards.length)], this.enemies_defeated);
        
        this.addEntity(this.enemy);

        this.fightReward = this.enemy.pokemon.value;
        this.submitsRemaining = 3; // Reset submitsRemaining for new enemy

        // Ensure SubmitsRemainingEntity is updated
        if (!this.submitsRemainingEntity) {
            this.submitsRemainingEntity = new SubmitsRemainingEntity(this);
            this.addEntity(this.submitsRemainingEntity);
        }
    }

    enterState(state: string): void {
        if (this.STATE === "INTRO" && state === "FILLHAND") {
            this.spawnEnemy();
            window.dispatchEvent(new Event('resize'));
        }

        this.STATE = state;
        this.anim = 0;

        if (state === "FILLHAND") {
            this.drawed_this_round = [];
            this.t = 0;
        }

        if (state === "SELECT_CARDS") {
            if (this.submitsRemaining > 0) {
                // Remove any existing submit buttons to prevent duplicates
                this.entities = this.entities.filter(entity => !(entity instanceof ButtonEntity));

                const button = new ButtonEntity(
                    this.screen.width / 2 - 100,
                    this.screen.height - 80,
                    200,
                    50,
                    "Submit",
                    "#22AA22",
                    () => {
                        this.removeEntity(button);
                        this.submitsRemaining -= 1;
                        this.enterState("ADD_DAMAGE");
                    },
                    () => {
                        const selectedCards = this.entities.filter(
                            (entity): entity is CardEntity => entity instanceof CardEntity && entity.selected
                        );
                        return selectedCards.length === 0;
                    }
                );
                this.addEntity(button);

                this.selectedCardsCounter = new SelectedCardsCounterEntity(this);
                this.addEntity(this.selectedCardsCounter);
            }
        } else {
            if (this.selectedCardsCounter) {
                this.removeEntity(this.selectedCardsCounter);
                this.selectedCardsCounter = null;
            }
        }

        if (state === "ADD_DAMAGE") {
            this.attack_queue = this.entities.filter((entity): entity is CardEntity => entity instanceof CardEntity && entity.selected);
            this.cardTypes = {};
        }

        if (state === "ATTACK") {
            this.attack_queue = this.entities.filter((entity): entity is CardEntity => entity instanceof CardEntity && entity.selected);
            this.attack_history = [];
        }

        if (state === "POST_ROUND") {
            // Reset game variables
            this.totalCardsMultiplier = 1;
            this.totalCardsDamage = 1;

            if (this.enemy.deathCheck()) {
                this.removeEntity(this.enemy);
                this.enemies_defeated += 1;

                this.score += this.fightReward;

                this.spawnEnemy();

                this.fightReward = this.enemy.pokemon.value;
            }

            if (this.submitsRemaining > 0) {
                this.enterState("FILLHAND");
            } else {
                this.enterState("GAME_OVER");
            }
        }

        if (state === "GAME_OVER") {
            this.entities = [];
            this.submitsRemainingEntity = null;

            const gameOverEntity = new GameOverEntity(this.screen.width / 2, this.screen.height / 2);
            this.addEntity(gameOverEntity);

            const restartButton = new ButtonEntity(
                this.screen.width / 2 - 100,
                this.screen.height / 2 + 100,
                200,
                50,
                "Restart",
                "#22AA22",
                () => {
                    this.removeEntity(restartButton);
                    this.removeEntity(gameOverEntity);
                    this.restartGame();
                }
            );
            this.addEntity(restartButton);
        }
    }

    restartGame(): void {
        this.STATE = "START";
        this.t = 0;
        this.anim = 0;
        this.player_deck = this.initializeDeck();
        this.drawed_this_round = [];
        this.hand_cards = [];
        this.entities = [];
        this.totalCardsMultiplier = 1;
        this.totalCardsDamage = 1;
        this.submitsRemaining = 3;
        this.score = 0;
        this.fightReward = 5;

        this.submitsRemainingEntity = new SubmitsRemainingEntity(this);
        this.addEntity(this.submitsRemainingEntity);

        this.startIntro();
    }
    
    draw(): void {
        this.screen.clear();
        // this.screen.background("#dddddd");

        const drawOrder: { [key: string]: Entity[] } = {
            other: [],
            enemy: [],
            top: []
        }
        this.entities.forEach(entity => {
            if (entity instanceof EnemyEntity) {
                drawOrder.enemy.push(entity);
            }
            else if (entity instanceof CardEntity) {
                drawOrder.other.push(entity);
            }
            else {
                drawOrder.top.push(entity);
            }
        });

        drawOrder.other.forEach(entity => {
            entity.draw(this.screen, this.t);
        });
        drawOrder.enemy.forEach(entity => {
            entity.draw(this.screen, this.t);
        });
        drawOrder.top.forEach(entity => {
            entity.draw(this.screen, this.t);
        });

    }

    update(): void {
        this.t += 1;
        this.anim += 1;
    
        // Ensure hand_cards are updated
        if (this.hand_cards.length > 0) {
            for (let i = 0; i < this.hand_cards.length; i++) {
                const card = this.hand_cards[i];
                if (card.entity) {
                    card.entity.index = i;
                } else {
                    console.warn(`Card at index ${i} has no entity.`);
                }
            }
        }

        if (this.STATE === "SELECT_CARDS") {
            // pass
        }

        if (this.STATE === "FILLHAND") {
            const HAND_SIZE = 8;
    
            if (this.t % 10 == 0) {
                if (this.hand_cards.length < HAND_SIZE) {
                    this.addDeckCardToMakeEntityJeMoeder();
                } else {
                    this.enterState("SELECT_CARDS");
                }
            }
        }

        if (this.STATE === "ADD_DAMAGE") {
            if (this.anim % 10 == 0) {
                if (this.anim % 20 == 0) {
                    const currentCard = this.attack_queue.shift()?.card;
                    if (!currentCard || !currentCard.entity) return;

                    let multiplier = 0;

                    currentCard.types.forEach((type: { type: { name: string } }) => {
                        if (this.cardTypes[type.type.name]) {
                            multiplier += 1.5;
                            this.cardTypes[type.type.name] += 1;
                        } else {
                            this.cardTypes[type.type.name] = 1;
                        }
                    })

                    if (multiplier) {
                        this.totalCardsMultiplier += multiplier

                        this.addEntity(
                            new MultiplierEntity(
                                currentCard.entity.x,
                                currentCard.entity.y - currentCard.entity.height / 2,
                                multiplier
                            )
                        )
                    }

                } else if (this.attack_queue.length > 0) {
                    const currentCard = this.attack_queue[0].card;
                    if (!currentCard.entity) return;
                    const damage = currentCard.value * this.attack_queue[0].calculateTypeMultiplier(this.enemy.pokemon.types);
                    this.totalCardsDamage += damage

                    this.addEntity(
                        new DamageEntity(
                            currentCard.entity.x - currentCard.entity.width / 2,
                            currentCard.entity.y - currentCard.entity.height / 2,
                            damage
                        )
                    )
                    
                } else {
                    this.enterState("ATTACK");
                }
            }
        }

        if (this.STATE === "ATTACK") {
            if (this.anim % 10 == 0) {

                if (this.attack_queue.length > 0) {
                    const attacker = this.attack_queue[0];
                    attacker.attack(this.enemy, this.totalCardsMultiplier, this.attack_history);
                    this.attack_queue = this.attack_queue.slice(1);

                    this.hand_cards = this.hand_cards.filter(card => card !== attacker.card);
                } else {
                    // End of round
                    this.enterState("POST_ROUND");
                }
            }
        }

        this.entities.forEach(entity => {
            entity.update(this.t);
        });
    }

    handleClick(event: MouseEvent | TouchEvent): void {
        this.entities.forEach(entity => {
            if (this.isClickable(entity)) {
                entity.handleClick(event);
            }
        });
    }


    addEntity(entity: Entity): void {
        entity.setGame(this);
        this.entities.push(entity);
    }
    addEntities(entities: Entity[]): void {
        entities.forEach(entity => {
            this.addEntity(entity);
        });
    }
    removeEntity(entity: Entity): void {
        this.entities = this.entities.filter(e => e !== entity);
    }
    
    drawCardFromDeck(): PokemonCard {
        let card: PokemonCard;
        do {
            card = this.player_deck[Math.floor(Math.random() * this.player_deck.length)];
        } while (this.drawed_this_round.includes(card));

        this.drawed_this_round.push(card);
        return card
    }


    refillHand(): void {
        this.enterState("FILLHAND");
    }

    addDeckCardToMakeEntityJeMoeder(): void {
        const card = this.drawCardFromDeck();

        const cardEntity = new CardEntity(this.screen.width / 2, -500, card); 
        this.addEntity(cardEntity);
    
        card.entity = cardEntity; // Ensure card.entity is set
        this.hand_cards.push(card);
    }
        

    initializePokemonCards(): PokemonCard[] {
        const pokemonCards: PokemonCard[] = [];
        const modules: Record<string, unknown> = import.meta.glob('@/pokemon/*.json', { eager: true });
        for (const path in modules) {
            const pokemonData = modules[path] as { [key: string]: any };
            const card: PokemonCard = {
                name: pokemonData.name,
                value: pokemonData.order % 5+1,   
                image: pokemonData.sprite,
                evolvedFrom: pokemonData.evolvedFrom,
                evolvesTo: pokemonData.evolvesTo,
                types: pokemonData.types,
                entity: null
            };
            pokemonCards.push(card);
        }
        return pokemonCards;
    }

    initializeDeck(): PokemonCard[] {
        const deck: PokemonCard[] = [];
        this.pokemon_cards.forEach(card => {
            if (card.evolvedFrom === null && deck.length < 40) {
                deck.push(card);
            }
        });
        return deck;
    }

    isClickable(entity: Entity): entity is Entity & { handleClick: (event: MouseEvent | TouchEvent) => void } {
        return 'handleClick' in entity && typeof (entity as any).handleClick === 'function';
    }

}
