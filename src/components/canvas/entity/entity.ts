
import { GameActive } from "../GameActive";
export default class Entity {
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

    draw(): void {
        // to be implemented by subclasses
    }

    update(): void {
        // to be implemented by subclasses
    }

    destroy() {
      if (this.game) {
        this.game.removeEntity(this);
      }
    }

}
