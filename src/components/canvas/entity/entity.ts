import { GameActive } from "../GameActive";
import { Screen } from "../screen";

export default abstract class Entity {
  x: number;
  y: number;
  game: GameActive | null;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;

    this.game = null;
  }

  setGame(game: GameActive) {
    this.game = game;
  }

  abstract draw(screen: Screen, t: number): void;

  abstract update(dt: number): void;

  destroy() {
    if (this.game) {
      this.game.removeEntity(this);
    }
  }
}
