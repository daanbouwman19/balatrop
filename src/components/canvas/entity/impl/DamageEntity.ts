import Entity from "../entity";
import { Screen } from "../../screen";

export class DamageEntity extends Entity {
  textColor: string;
  delta: number;
  movement: number;
  damage: number;

  constructor(x: number, y: number, damage: number) {
    super(x, y);
    this.textColor = "#FF0000";
    this.delta = 0;
    this.movement = 2;
    this.damage = damage;
  }

  draw(screen: Screen, _t: number) {
    screen.c().fillStyle = this.textColor;
    screen.c().font = "32px Arial";
    screen.c().textAlign = "center";
    screen.c().fillText(this.damage.toString(), this.x, this.y);
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
