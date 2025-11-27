import Entity from '../entity.js';
import { CardEntity } from './cardEntity.js'; // Adjust the path as needed

export class SelectedCardsCounterEntity extends Entity {
    constructor(game) {
        super(0, 0);
        this.game = game;
    }

    draw(screen, t) {
        const selectedCardsCount = this.game.entities.filter(
            entity => entity instanceof CardEntity && entity.selected
        ).length;
        const maxSelectedCards = 5;

        // Draw the counter at the top-left corner
        screen.c().fillStyle = "#FFFFFF";
        screen.c().font = "40px Arial";
        screen.c().textAlign = "left";
        screen.c().fillText(`Selected: ${selectedCardsCount}/${maxSelectedCards}`, 10, 30);
    }

    update(t) {
        // No update logic needed
    }
}
