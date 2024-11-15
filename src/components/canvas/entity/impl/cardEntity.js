import Entity from '../entity.js';
import * as Particle from './Particle.js';
import typeRelationsMap from "../../../../../public/typeRelationsMap.json"

export class CardEntity extends Entity {

    constructor(x, y, card) {
        super(x, y);
        this.rotation = 0;
        this.index = 0;
        card.entity = this;
        this.card = card;

        this.image = new Image(200, 200);
        this.image.src = this.card.image;
        
        this.ready = false;
        this.image.addEventListener("load", () => {
            this.ready = true;
        })

        this.width = 150;
        this.height = 200;

        this.background = new Image(this.width, this.height);
        this.background.src = "images/back.png"
        this.background.z = -1

        this.typeImages = []

        card.types.forEach((type) => {
            const image = new Image(48, 16)
            image.src = `images/${type.type.name}.png`
            this.typeImages.push(image)
        })

        this.hovered = false;
        this.z = 0;

        this.selected = false;

        this.lt = 0;

        const handSize = 8;
        this.animation = (screen, t, lt) => {
            // Idle animation & Selected animation
            const handSpan = screen.width - this.width;

            // Map (0, handSize * this.width) (this.width/2, handSpan)

            
            const targetX = Math.lerp(this.width, handSpan, this.index / (handSize - 1));
            const targetY = screen.height - 200 + Math.sin(t * 0.01 + this.index) * 10;

            this.x = Math.lerp(this.x, targetX, 0.1);
            this.y = Math.lerp(this.y, targetY, 0.1);


            if (!this.selected) {
                this.lt = 0;
                this.rotation = Math.sin(t * 0.01 + this.index) * 0.005;
            }
            if (this.selected) {
                if (this.rotation < 4) this.rotation = 4;
                this.y = Math.lerp(this.y, screen.height - 400, 0.1);
                this.rotation = Math.lerp(this.rotation, 6.5, 0.1);
            }
        }
        
        this.width = 0;
    }


    resize(screen) {
        const size = Math.min(screen.height/10, 96);
        console.log(size);

        this.width = size;
        this.height = size;

        this.image.width = this.width;
        this.image.height = this.height;

        this.typeImages.forEach((image) => {
            image.width = size / 5;
            image.height = size / 15;
        });
    }


    handleClick() {
        if (this.hovered) {
            this.selected = !this.selected;
        }
    }

    calculateTypeMultiplier(targetTypes) {
        if (!this.card.types || !targetTypes || !Array.isArray(this.card.types) || !Array.isArray(targetTypes)) {
            console.error("Invalid types provided.");
            return 1; // Default multiplier
        }

        // Initialize the multiplier to 1
        let multiplier = 1;

        // Iterate over the card's types
        this.card.types.forEach((cardTypeObj) => {
            const cardTypeName = cardTypeObj.type.name; // Get the name of the type (e.g., "water")

            // Ensure the card type exists in the type relations map
            if (!typeRelationsMap[cardTypeName]) {
                console.warn(`Type "${cardTypeName}" not found in typeRelationsMap.`);
                return;
            }

            // Get the damage relations for this card type
            const damageRelations = typeRelationsMap[cardTypeName];

            // Check each target type against this card type's damage relations
            targetTypes.forEach((type) => {
                if (damageRelations.doubleDamageTo.includes(type.type.name)) {
                    multiplier *= 2; // Double damage
                } else if (damageRelations.halfDamageTo.includes(type.type.name)) {
                    multiplier *= 0.5; // Half damage
                } else if (damageRelations.noDamageTo.includes(type.type.name)) {
                    multiplier *= 0; // No damage
                }
            });
        });
        return multiplier;
    }
    
    attack(target, attackMultiplier, attackHistory) {
        let baseDamage = this.card.value
        let markiplier = this.calculateTypeMultiplier(target.pokemon.types)
        let damage = baseDamage * markiplier * attackMultiplier

        attackHistory.push({
            card: {
                name: this.card.name,
                type: this.card.types  /// Element type or something
            },
            damage: damage
        });
        target.damage(damage);


        this.selected = false;

        const targetX = target.x + 150;
        const targetY = target.y + 150;
        const angle = Math.atan2(targetY - this.y, targetX - this.x);

        this.lt = 0;
        this.animation = (screen, t, lt) => {
            // Attack animation

            this.x += Math.cos(angle) * 50 * (1 - lt/20);
            this.y += Math.sin(angle) * 50 * (1 - lt/20);

            this.rotation = angle + Math.PI/2;

            if (lt == 20) {
                const part = Particle.blood(targetX, targetY);
                this.game.addEntity(part);
            }

            if (lt > 50) {
                // End of attack logic
                this.destroy();
            }

        }
    }

    draw(screen, t) {
            // screen.drawRectangle(this.x, this.y, this.width, this.height, this.color);

        if (!this.ready) return;

        if (this.width == 0) this.resize(screen);


        this.lt++;
        this.animation(screen, t, this.lt);


        const translate = () => {
            screen.c().translate(this.x - this.z * 2, this.y - this.z * 10);
            // screen.c().scale(s, 1);
            screen.c().rotate(this.rotation);
            screen.c().translate(-this.width/2, -this.height/2);
        }

        // this.z = Math.abs(s) * 10;
        if (this.z > 0) {
            screen.c().save();
            screen.c().translate(4 * this.z, 10 * this.z);
            translate();

            screen.drawRectangle(0, 0, this.width, this.height, 'rgba(0, 0, 0, 0.5)', 30);

            screen.c().restore();
        }
        screen.c().save();
        translate();

        const halfWidth = this.width / 2 - 24
        const halfHeight = this.height / 2 - 16

        screen.drawRectangle(0, 0, this.width, this.height, "#FFFFFFC8", 30)
        screen.c().drawImage(this.image, 0, 0)

        this.typeImages.forEach((image, index) => {
            screen.c().drawImage(image, halfWidth, this.height + index * image.height * 3.5);
        })

        //draw the pokemon name
        screen.c().fillStyle = "#FFCB00"
        screen.c().font = "20px pokemon";
        screen.c().strokeStyle = "#335FAB";
        screen.c().textAlign = "center";
        screen.c().lineWidth = 6;   

        screen.c().strokeText(this.card.name, this.width/2, 0);
        screen.c().fillText(this.card.name, this.width/2, 0);
        
        screen.c().restore();


        // Hitbox for debugging
        // const mouse = this.game.screen.mouse;
        // screen.drawRectangle(this.x - this.width / 2, this.y - this.height / 2, this.width, this.height, '#ff0000');
        // screen.drawRectangle(mouse.x, mouse.y, 20, 20, '#00ff00');
    }

    update(t) {

        if (this.game.STATE == "SELECT_CARDS") {
            const mouse = this.game.screen.mouse;

            this.hovered = (mouse.x > this.x - this.width/2 && mouse.x < this.x + this.width/2 && mouse.y > this.y - this.height/2 && mouse.y < this.y + this.height/2);
            if (this.hovered) {
                this.z = Math.lerp(this.z, 2, 0.4);
            } else {
                this.z = Math.lerp(this.z, 0, 0.4);
                if (this.z < 0.08) this.z = 0;
            }
        }

    }

}
