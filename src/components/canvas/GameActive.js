import { Screen } from "./screen";
import { FrankEntity } from "./entity/impl/FrankEntity";

export class GameActive {

    constructor(canvas) {
        // States
        this.STATE = "START";
        this.t = 0;


        this.pokemon_cards = this.initializePokemonCards()

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


        // Debug
        this.entities.push(new FrankEntity(5, 5, 10, 10, "#FF0000"));

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
        this.entities.forEach(entity => {
            entity.update(this.t);
        });
    }

    handleClick(event) {
    }




    refillHand() {
        const HAND_SIZE = 8;
        while (this.hand_cards.length < HAND_SIZE) {
            this.addRandomCard();
        }
    }

    addRandomCard() {
        // { name: "Frank", value: 1, image: "images/Frank!.jpg" }
        const card = this.randomCard();
        this.hand_cards.push(card);
    }

    randomCard() {
        const names = [
            "Frank",
            "Jesse",
            "Walter",
            "Victor",
            "Tortuga",
            "Gretchen",
            "Elliot",
            "Bogdan",
            "Ken",
            "Ted"
        ]

        const card = {
            name: names[Math.floor(Math.random() * names.length)],
            value: Math.floor(Math.random() * 10) + 1,
            image: "images/Frank!.jpg",
            entity: null
        }

        return card;
    }

    initializePokemonCards() {
        return []
    }

}