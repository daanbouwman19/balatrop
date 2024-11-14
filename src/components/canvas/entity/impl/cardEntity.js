
import Entity from '../entity.js';

export class CardEntity extends Entity {

    constructor(x, y, card) {
        super(x, y);
        this.index = 0;
        card.entity = this;
        this.card = card;

        this.image = new Image(200, 200);
        this.image.src = this.card.image;
        
        this.ready = false;
        this.image.addEventListener("load", () => {
            this.ready = true;
        })

        this.z = 0;
    }

    draw(screen, t) {
            // screen.drawRectangle(this.x, this.y, this.width, this.height, this.color);

        if (!this.ready) return;


        const targetX = this.index * 100 + 500;
        const targetY = screen.height - 200 + Math.sin(t * 0.01 + this.index) * 10;

        this.x = Math.lerp(this.x, targetX, 0.1);
        this.y = Math.lerp(this.y, targetY, 0.1);
        const width = 200;
        const height = 200;


        const x = this.x;
        const y = this.y;

        const s = Math.sin(t * 0.05)

        const translate = () => {
            screen.c().translate(x - this.z * 2, y - this.z * 10);
            // screen.c().scale(s, 1);
            screen.c().translate(-width/2, -height/2);
        }

        // this.z = Math.abs(s) * 10;
        if (this.z > 0) {
            screen.c().save();
            screen.c().translate(4 * this.z, 10 * this.z);
            translate();

            screen.drawRectangle(0, 0, width, height, 'rgba(0, 0, 0, 0.5)');

            screen.c().restore();
        }
        screen.c().save();
        translate();


        // if (s > 0) screen.drawRectangle(0, 0, width, height, 'red');
        screen.c().drawImage(this.image, 0, 0)

        screen.c().fillStyle = 'black';
        screen.c().font = '20px Arial';
        screen.c().textAlign = 'center';
        screen.c().fillText(this.card.name, width/2, -10);


            screen.c().restore();

        }

    update(t) {
    }

}
