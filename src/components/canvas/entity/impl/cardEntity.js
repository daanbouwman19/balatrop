
import Entity from '../entity.js';

export class CardEntity extends Entity {

    constructor(x, y, width, height, color) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.color = color;
    }

        draw(screen, t) {
            // screen.drawRectangle(this.x, this.y, this.width, this.height, this.color);

            screen.c().save();

            let x = screen.mouse.x;
            let y = screen.mouse.y;
            let width = 63 * 3;
            let height = 88 * 3;

            const s = Math.sin(t * 0.01)
            const color = s > 0 ? 'red' : 'blue';
            screen.c().translate(x, y);
            
            screen.c().scale(s, 1);
            screen.c().rotate(0, t * 0.01, 0);
            screen.c().translate(-width/2, -height/2);

            screen.drawRectangle(0, 0, width, height, color);

            screen.c().fillText('Hello World', 50, 40);

            screen.c().restore();

        }

    update(t) {
    }

}
