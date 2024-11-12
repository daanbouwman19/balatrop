
import Entity from '../entity.js';

export class CardEntity extends Entity {

    constructor(x, y, width, height, color) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw(screen) {
        screen.drawRectangle(this.x, this.y, this.width, this.height, this.color);
    }

    update() {
        this.x += 1;
    }

}
