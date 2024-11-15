import Entity from '../entity.js';

export class SubmitsRemainingEntity extends Entity {
    constructor(game) {
        super(0, 0);
        this.game = game;
        this.lastSubmitsRemaining = this.game.submitsRemaining;
    }

    draw(screen, t) {
        const submitsRemaining = this.game.submitsRemaining;

        // Draw the submits remaining at the top-right corner
        screen.c().fillStyle = "#FFFFFF";
        screen.c().font = "24px Arial";
        screen.c().textAlign = "right";
        screen.c().fillText(`Submits Remaining: ${submitsRemaining}`, screen.width - 10, 30);
    }

    update(t) {
        // Check if submitsRemaining has changed
        if (this.lastSubmitsRemaining !== this.game.submitsRemaining) {
            this.lastSubmitsRemaining = this.game.submitsRemaining;
            // If needed, perform any additional updates
        }
    }
}
