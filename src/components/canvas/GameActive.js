import { Screen } from "./screen";
import { FrankEntity } from "./entity/impl/FrankEntity";
import { CardEntity } from "./entity/impl/cardEntity";
import { EnemyEntity } from "./entity/impl/EnemyEntity";
import { ButtonEntity } from "./entity/impl/ButtonEntity";
import { MultiplierEntity } from "./entity/impl/MultiplierEntity";
import { DamageEntity } from "./entity/impl/DamageEntity";
import { GameOverEntity } from "./entity/impl/GameOverEntity";
import { SubmitsRemainingEntity } from "./entity/impl/SubmitsRemainingEntity";
import { SelectedCardsCounterEntity } from "./entity/impl/SelectedCardsCounterEntity";

export class GameActive {

    constructor(canvas) {
        // States
        this.STATE = "START";
        this.t = 0;
        this.anim = 0;

        this.selectedCardsCounter = null;

        // Initialize entities before adding any entities
        this.entities = [];

        this.pokemon_cards = this.initializePokemonCards();
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
        this.canvas.addEventListener("mousemove", (event) => {
            this.screen.updateMousePosition(event);
        });
        window.addEventListener("resize", () => {
            this.screen.resize(this.canvas.clientWidth, this.canvas.clientHeight);
        });
        this.canvas.addEventListener("click", (event) => {
            this.handleClick(event);
        });
        this.canvas.addEventListener("touchstart", (event) => {
            this.handleClick(event);
        });
        window.addEventListener("keydown", (event) => {
            this.entities.forEach(entity => {
                if (entity.keydown) entity.keydown(event);
            });
        });

        // Start the intro sequence
        this.startIntro();
    }

    startIntro() {
        const frank = new FrankEntity(100, 100, 200, 200, "#FF0000");
        frank.intro();
        this.addEntity(frank);

        this.enterState("INTRO");
    }

    spawnEnemy() {
        var width = this.screen.width/4;
        var height = this.screen.height/4;
        var x = this.screen.width/2 - width/2;
        var y = this.screen.height/2 -height/2;
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

    enterState(state) {
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
                        console.log("Submit button clicked");
                        this.removeEntity(button);
                        this.submitsRemaining -= 1;
                        this.enterState("ADD_DAMAGE");
                    },
                    // isDisabled function
                    () => {
                        const selectedCards = this.entities.filter(
                            entity => entity instanceof CardEntity && entity.selected
                        );
                        return selectedCards.length === 0; // Disable if no cards selected
                    }
                );
                this.addEntity(button);

                // Add the SelectedCardsCounterEntity
                this.selectedCardsCounter = new SelectedCardsCounterEntity(this);
                this.addEntity(this.selectedCardsCounter);
            } else {
                console.log("No submits remaining for this enemy.");
                // Optionally, you can transition to the next state or provide feedback
            }
        } else {
            // Remove the counter entity when leaving SELECT_CARDS state
            if (this.selectedCardsCounter) {
                this.removeEntity(this.selectedCardsCounter);
                this.selectedCardsCounter = null;
            }
        }

        if (state === "ADD_DAMAGE") {
            this.attack_queue = this.entities.filter(entity => entity instanceof CardEntity && entity.selected);
            this.cardTypes = {};
        }

        if (state === "ATTACK") {
            this.attack_queue = this.entities.filter(entity => entity instanceof CardEntity && entity.selected);
            this.attack_history = [];
        }

        if (state === "POST_ROUND") {
            // Reset game variables
            this.totalCardsMultiplier = 1;
            this.totalCardsDamage = 1;

            if (this.enemy.deathCheck()) {
                console.log(`Enemy has died!`);
                this.removeEntity(this.enemy);
                this.enemies_defeated += 1;

                // Update the score
                this.score += this.fightReward;

                // Spawn a new enemy
                this.spawnEnemy();

                // Set new fight reward
                this.fightReward = this.enemy.pokemon.value;
            }

            if (this.submitsRemaining > 0) {
                this.enterState("FILLHAND");
            } else {
                console.log("No more submits remaining. Game Over!");
                this.enterState("GAME_OVER");
            }
        }

        if (state === "GAME_OVER") {
            // Clear existing entities
            this.entities = [];

            // Remove reference to SubmitsRemainingEntity
            this.submitsRemainingEntity = null;

            // Add GameOverEntity
            const gameOverEntity = new GameOverEntity(this.screen.width / 2, this.screen.height / 2);
            this.addEntity(gameOverEntity);

            // Optionally, add a Restart button
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

    restartGame() {
        // Reset game variables
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

        // Re-add the SubmitsRemainingEntity
        this.submitsRemainingEntity = new SubmitsRemainingEntity(this);
        this.addEntity(this.submitsRemainingEntity);

        // Start the intro sequence again
        this.startIntro();
    }
    


    draw() {
        this.screen.clear();
        // this.screen.background("#dddddd");

        const drawOrder = {
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

    update() {
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
                    const currentCardEntity = this.attack_queue.shift().card;

                    var multiplier = 0;

                    currentCardEntity.types.forEach((type) => {
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
                                currentCardEntity.entity.x, 
                                currentCardEntity.entity.y - currentCardEntity.entity.height / 2,
                                multiplier
                            )
                        )
                    }

                } else if (this.attack_queue.length > 0) {
                    const currentCardEntity = this.attack_queue[0].card;
                    var damage = currentCardEntity.value * currentCardEntity.entity.calculateTypeMultiplier(this.enemy.pokemon.types);
                    this.totalCardsDamage += damage

                    this.addEntity(
                        new DamageEntity(
                            currentCardEntity.entity.x - currentCardEntity.entity.width / 2, 
                            currentCardEntity.entity.y - currentCardEntity.entity.height / 2,
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

    handleClick(event) {
        this.entities.forEach(entity => {
            if (entity.handleClick) entity.handleClick(event);
        });
    }


    addEntity(entity) {
        entity.setGame(this);
        this.entities.push(entity);
    }
    addEntities(entities) {
        entities.forEach(entity => {
            this.addEntity(entity);
        });
    }
    removeEntity(entity) {
        this.entities = this.entities.filter(e => e !== entity);
        this.entities = this.entities.filter(e => e !== entity);
    }
    
    drawCardFromDeck() {
        let card;
        do {
            card = this.player_deck[Math.floor(Math.random() * this.player_deck.length)];
        } while (this.drawed_this_round.includes(card));

        this.drawed_this_round.push(card);
        return card
    }


    refillHand() {
        this.enterState("FILLHAND");
    }

    addDeckCardToMakeEntityJeMoeder() {
        const card = this.drawCardFromDeck();

        const cardEntity = new CardEntity(this.screen.width / 2, -500, card); 
        this.addEntity(cardEntity);
    
        card.entity = cardEntity; // Ensure card.entity is set
        this.hand_cards.push(card);
    }
        

    initializePokemonCards() {
        const pokemonCards = [];
        const context = require.context('../../../public/pokemon', false, /\.json$/);

        context.keys().forEach((key) => {
            const pokemonData = context(key);
            const card = {
                name: pokemonData.name,
                value: pokemonData.order % 5+1,   
                image: pokemonData.sprite,
                evolvedFrom: pokemonData.evolvedFrom,
                evolvesTo: pokemonData.evolvesTo,
                types: pokemonData.types,
                entity: null
            };
            pokemonCards.push(card);
        });
        return pokemonCards;
    }

    initializeDeck() {
        const deck = [];
        this.pokemon_cards.forEach(card => {
            if (card.evolvedFrom === null && deck.length < 40) {
                deck.push(card);
            }
        });
        console.log(deck)
        return deck;
    }

}