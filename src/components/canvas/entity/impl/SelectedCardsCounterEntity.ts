import Entity from "../entity";
import { CardEntity } from "./cardEntity"; // Adjust the path as needed
import { GameActive } from "../../GameActive";
import { Screen } from "../../screen";

export class SelectedCardsCounterEntity extends Entity {
  constructor(game: GameActive) {
    super(0, 0);
    this.game = game;
  }

  draw(screen: Screen, _t: number) {
    if (!this.game) return;
    const selectedCardsCount = this.game.entities.filter(
      (entity: Entity) => entity instanceof CardEntity && entity.selected,
    ).length;
    const maxSelectedCards = 5;

    // Draw the counter at the top-left corner
    screen.c().fillStyle = "#FFFFFF";
    screen.c().font = "40px Arial";
    screen.c().textAlign = "left";
    screen
      .c()
      .fillText(`Selected: ${selectedCardsCount}/${maxSelectedCards}`, 10, 30);
  }

  update(_dt: number) {
    // No update logic needed
  }
}
