import Entity from '../entity';
import { GameActive } from '../../GameActive';
import { Screen } from '../../screen';

export class SubmitsRemainingEntity extends Entity {
    lastSubmitsRemaining: number;

    constructor(game: GameActive) {
        super(0, 0);
        this.game = game;
        this.lastSubmitsRemaining = this.game.submitsRemaining;
    }

    draw(screen: Screen) {
        const submitsRemaining = this.game.submitsRemaining;

        // Draw the submits remaining at the top-right corner
        screen.c().fillStyle = "#FFFFFF";
        screen.c().font = "24px Arial";
        screen.c().textAlign = "right";
        screen.c().fillText(`Submits Remaining: ${submitsRemaining}`, screen.width - 10, 30);
    }

    update() {
        // Check if submitsRemaining has changed
        if (this.lastSubmitsRemaining !== this.game.submitsRemaining) {
            this.lastSubmitsRemaining = this.game.submitsRemaining;
            // If needed, perform any additional updates
        }
    }
}
