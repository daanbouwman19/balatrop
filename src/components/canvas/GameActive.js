import { Screen } from "./screen";
import { FrankEntity } from "./entity/impl/FrankEntity";
import { CardEntity } from "./entity/impl/cardEntity";
import { EnemyEntity } from "./entity/impl/EnemyEntity";

export class GameActive {

    constructor(canvas) {
        // States
        this.STATE = "START";
        this.t = 0;


        this.pokemon_cards = this.initializePokemonCards()
        this.player_deck = this.initializeDeck()
        this.drawed_this_round = []

        // Game
        this.hand_cards = [];
        this.entities = [];


        // Rendering
        this.canvas = canvas;
        this.canvas.width = this.canvas.clientWidth;
        this.canvas.height = this.canvas.clientHeight;
        this.screen = new Screen(canvas);

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
        window.addEventListener("keydown", (event) => {
            this.entities.forEach(entity => {
                if (entity.keydown) entity.keydown(event);
            });
        });


        // this.startIntro();
        this.STATE = "FILLHAND"
        // Debug
        
        // this.entities.push(new FrankEntity(5, 5, 10, 10, "#FF0000"));
        
        let random_card = this.pokemon_cards[Math.floor(Math.random() * this.pokemon_cards.length)];
        this.entities.push(new FrankEntity(5, 5, 10, 10, "#FF0000"));
        this.entities.push(new EnemyEntity(100, 0, 96, 96, random_card));

    }

    startIntro() {
        const frank = new FrankEntity(100, 100, 200, 200, "#FF0000");
        frank.intro();
        this.addEntity(frank);

        this.STATE = "INTRO";
    }


    draw() {
        this.screen.clear();
        this.screen.background("#dddddd");

        this.entities.forEach(entity => {
            entity.draw(this.screen, this.t);
        });
    }

    update() {
        this.t += 1;

        if (this.hand_cards.length > 0) {
            for (let i = 0; i < this.hand_cards.length; i++) {
                this.hand_cards[i].entity.index = i;
            }
        }

        if (this.STATE === "FILLHAND") {
            const HAND_SIZE = 8;

            this.t = 0;
            if (this.t % 10 == 0) {
                if (this.hand_cards.length < HAND_SIZE) {
                    this.addDeckCardToMakeEntityJeMoeder();
                } else {
                    this.STATE = "IDLE";
                }
            }
        }

        this.entities.forEach(entity => {
            entity.update(this.t);
        });
    }

    handleClick(event) {
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
        this.entities = this.entities.this.pokemon_cards[Math.floor(Math.random() * this.pokemon_cards.length)];filter(e => e !== entity);
    }
    
    drawCardFromDeck() {
        let card;
        do {
            card = this.player_deck[Math.floor(Math.random() * this.player_deck.length)];
        } while (this.drawed_this_round.includes(card));

        this.drawed_this_round.push(card);
        this.hand_cards.push(card)
        return card
    }


    refillHand() {
        this.STATE = "FILLHAND";
    }

    addDeckCardToMakeEntityJeMoeder() {
        const card = this.drawCardFromDeck();

        const cardEntity = new CardEntity(this.screen.width/2, -500, card);
        this.addEntity(cardEntity);

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