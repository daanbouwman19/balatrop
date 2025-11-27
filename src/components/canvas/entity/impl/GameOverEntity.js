import Entity from '../entity.js';

export class GameOverEntity extends Entity {
    constructor(x, y) {
        super(x, y);
        this.width = 400;
        this.height = 200;
        this.message = "Game Over!";
        this.fontSize = 48;
        this.fontFamily = "Arial";
    }

    draw(screen, t) {
        // Draw semi-transparent background over the entire screen
        screen.c().fillStyle = "rgba(0, 0, 0, 0.7)";
        screen.c().fillRect(0, 0, screen.width, screen.height);

        // Draw Game Over text
        screen.c().fillStyle = "#FFFFFF";
        screen.c().font = `${this.fontSize}px ${this.fontFamily}`;
        screen.c().textAlign = "center";
        screen.c().textBaseline = "middle";
        screen.c().fillText(this.message, this.x, this.y);
    }

    update(t) {
        // No update logic needed for static display
    }
}
