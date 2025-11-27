import Entity from "../entity";
import { Screen } from "../../screen";

export class MultiplierEntity extends Entity {
  textColor: string;
  delta: number;
  movement: number;
  multiplier: number;

  constructor(x: number, y: number, multiplier: number) {
    super(x, y);
    this.textColor = "#0000FF";
    this.delta = 0;
    this.movement = 2;
    this.multiplier = multiplier;
  }

  draw(screen: Screen, _t: number) {
    screen.c().fillStyle = this.textColor;
    screen.c().font = "32px Arial";
    screen.c().textAlign = "center";
    screen.c().fillText(`x${this.multiplier}`, this.x, this.y);
  }

  update(dt: number) {
    this.delta += dt;
    this.y -= 2 * this.movement * dt;

    if (this.delta >= 20) {
      this.destroy();
    }
  }

  destroy() {
    if (this.game) {
      this.game.removeEntity(this);
    }
  }
}
