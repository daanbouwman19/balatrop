
import Entity from '../entity.js';

export class ButtonEntity extends Entity {

    constructor(x, y, width, height, text, color, onClick) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.text = text;
        this.color = color;
        this.onClick = onClick;
        
        this.hovered = false;
    }

    handleClick() {
        if (this.hovered) {
            this.onClick();
        }
    }

    draw(screen, t) {

        screen.drawRectangle(this.x, this.y, this.width, this.height, this.color, 10);

        if (this.hovered) {
            screen.drawRectangle(this.x, this.y, this.width, this.height, "rgba(155,155,155,0.2)", 10);
        }

        screen.c().fillStyle = "black";
        screen.c().textAlign = "center";
        screen.c().font = "20px Arial";
        screen.c().fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 + 5);
    }

    update(t) {
        this.hovered = this.game.screen.mouse.x > this.x && this.game.screen.mouse.x < this.x + this.width && this.game.screen.mouse.y > this.y && this.game.screen.mouse.y < this.y + this.height;
    }

}
