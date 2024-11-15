import Entity from '../entity.js';

export class SubmitsRemainingEntity extends Entity {
    constructor(game) {
        super(0, 0);
        this.game = game;
    }

    draw(screen, t) {
        const submitsRemaining = this.game.submitsRemaining;

        // Draw the submits remaining at the top-right corner
        screen.c().fillStyle = "#FFFFFF";
        screen.c().font = "40px Arial";
        screen.c().textAlign = "right";
        screen.c().fillText(`Submits Remaining: ${submitsRemaining}`, screen.width - 10, 30);
    }

    update(t) {
        // No update logic needed
    }
}
