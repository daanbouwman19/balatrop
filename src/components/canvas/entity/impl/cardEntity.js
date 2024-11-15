
import { HighlightSpanKind } from 'typescript';
import Entity from '../entity.js';

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

        this.hovered = false;
        this.z = 0;

        this.selected = false;

        this.lt = 0;

        const handSize = 8;
        this.animation = (screen, t, lt) => {
            // Idle animation & Selected animation
            const handSpan = screen.width - 200;
            
            const targetX = screen.width/2 - handSpan/2 + handSpan / handSize * this.index + 100;
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
        
    }

    handleClick() {
        if (this.hovered) {
            this.selected = !this.selected;
        }
    }

    attack(target, attackHistory) {
        let damage = 2;

        attackHistory.push({
            card: {
                name: this.card.name,
                type: "none"  /// Element type or something
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

            if (lt > 50) {
                // End of attack logic
                this.destroy();
            }

        }
    }

    draw(screen, t) {
            // screen.drawRectangle(this.x, this.y, this.width, this.height, this.color);

        if (!this.ready) return;


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

            screen.drawRectangle(0, 0, this.width, this.height, 'rgba(0, 0, 0, 0.5)');

            screen.c().restore();
        }
        screen.c().save();
        translate();


        screen.drawRectangle(0, 0, this.width, this.height, 'red');
        screen.c().drawImage(this.image, 0, 0)

        screen.c().fillStyle = 'black';
        screen.c().font = '20px Arial';
        screen.c().textAlign = 'center';
        screen.c().fillText(this.card.name, this.width/2, -10);

        screen.c().restore();
    }

    update(t) {

        if (this.game.STATE == "SELECT_CARDS") {
            const mouse = this.game.screen.mouse;

            this.hovered = (mouse.x > this.x - this.width/2 && mouse.x < this.x + this.width/2 && mouse.y > this.y - this.height/2 && mouse.y < this.y + this.height/2);
            if (this.hovered) {
                this.z = Math.lerp(this.z, 2, 0.4);
            } else {
                this.z = Math.lerp(this.z, 0, 0.4);
            }
        }

    }

}
