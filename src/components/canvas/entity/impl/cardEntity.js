
import Entity from '../entity.js';

export class CardEntity extends Entity {

    constructor(x, y, width, height, color) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.color = color;

        this.imageUri = "./images/Frank!.jpg"
        this.image = new Image(200, 200);
        this.image.src = this.imageUri;
        
        this.ready = false;
        
        this.image.addEventListener("load", () => {
            this.ready = true;
        })

        this.z = 0;

    }

        draw(screen, t) {
            // screen.drawRectangle(this.x, this.y, this.width, this.height, this.color);

        if (!this.ready) return;


        let x = screen.mouse.x;
        let y = screen.mouse.y;
        let width = this.image.width;
        let height = this.image.height;

        const s = Math.sin(t * 0.05)

        const translate = () => {
            screen.c().translate(x - this.z * 2, y - this.z * 10);
            // screen.c().scale(s, 1);
            screen.c().rotate(t * 0.01);
            screen.c().translate(-width/2, -height/2);
        }

        this.z = Math.abs(s) * 10;
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

        screen.c().fillStyle = 'white';
        screen.c().font = '20px Arial';
        screen.c().textAlign = 'center';
        screen.c().fillText('Frank!', width/2, -10);


            screen.c().restore();

        }

    update(t) {
    }

}
