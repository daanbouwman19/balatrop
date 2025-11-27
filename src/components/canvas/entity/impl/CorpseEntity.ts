import Entity from "../entity.js";
import { Screen } from "../../screen.js";

export class CorpseEntity extends Entity {
  entity: Entity;
  dx: number;
  dy: number;
  life: number;
  rotation: number;
  dRotation: number;
  scale: number;

  constructor(entity: Entity) {
    super(entity.x, entity.y);
    this.entity = entity;
    entity.destroy();

    this.dx = Math.random() * 10 - 5;
    this.dy = Math.random() * 10 - 5;
    this.life = 100;

    this.rotation = Math.random() * Math.PI * 2;
    this.dRotation = Math.random() * 0.1 - 0.05;

    this.scale = 1;

    this.entity.x = 0;
    this.entity.y = 0;
  }

  update(_dt: number) {
    this.dy += 0.1;

    this.x += this.dx;
    this.y += this.dy;
    this.rotation += this.dRotation;

    this.life -= 1;

    if (this.scale > 0) {
      this.scale -= 0.01;
    }

    if (this.life < 0) {
      this.destroy();
    }
  }

  draw(screen: Screen, t: number) {
    screen.c().save();
    screen.c().translate(this.x, this.y);
    screen.c().rotate(this.rotation);
    screen.c().scale(this.scale, this.scale);
    this.entity.draw(screen, t);
    screen.c().restore();
  }
}
