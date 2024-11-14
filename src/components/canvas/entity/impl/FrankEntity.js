
import Entity from '../entity.js';

export class FrankEntity extends Entity {

    constructor(x, y, width, height, color) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.color = color;

        this.imageUri = "./images/Frank_icon.jpg"
        this.image = new Image(200, 200);
        this.image.src = this.imageUri;
        
        this.ready = false;
        
        this.image.addEventListener("load", () => {
            this.ready = true;
        })

        this.z = 0;

        this.isIntro = false;
    }

    intro() {
        this.isIntro = true;

        this.messages = [
            "Welcome to the game!",
            "I am Professor Frank.",
            "I want beer.",
            "You will get beer for me.",
            "Or else.",
            "You will die.",
            "Byeee"
        ]

        this.message = this.messages.shift();

        this.x = 0;
        this.y = 0;

    }


    draw(screen, t) {
        if (!this.ready) return;


        if (this.isIntro) {
            screen.c().fillStyle = 'black';
            screen.c().font = '20px Arial';
            screen.c().textAlign = 'center';
            screen.c().fillText(this.message, screen.width/2, screen.height/2);

        }

        let x = this.x + screen.width/2;
        let y = this.y + screen.height/2-150;
        let width = this.image.width;
        let height = this.image.height;

        const translate = () => {
            screen.c().translate(x - this.z * 2, y - this.z * 10);
            screen.c().scale(1+this.z/50, 1+this.z/50);
        // screen.c().scale(s, 1);
            screen.c().translate(-width/2, -height/2);
        }

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

        screen.c().font = '20px Arial';
        screen.c().textAlign = 'center';
        screen.c().fillText('Frank!', width/2, -10);


        screen.c().restore();

    }

    update(t) {
        this.t = t;
        if (this.isIntro) {
            if (this.messages.length == 0) {
                this.z += 1;
                this.y -= 10;

                if (t == this.exitAt) {
                    this.game.STATE = "FILLHAND";
                    this.destroy();
                }

            } else {
                this.z = Math.sin(t*0.1) + 2;
            }
        }
    }

    keydown(event) {
        if (this.isIntro) {
            if (this.messages.length > 0) {
                this.message = this.messages.shift();

                if (this.messages.length == 0) {
                    this.exitAt = this.t + 60;
                }
            }
        }
    }

}
