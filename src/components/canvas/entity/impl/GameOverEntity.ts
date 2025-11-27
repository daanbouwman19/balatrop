import Entity from "../entity";
import { Screen } from "../../screen";

export class GameOverEntity extends Entity {
  width: number;
  height: number;
  message: string;
  fontSize: number;
  fontFamily: string;

  constructor(x: number, y: number) {
    super(x, y);
    this.width = 400;
    this.height = 200;
    this.message = "Game Over!";
    this.fontSize = 48;
    this.fontFamily = "Arial";
  }

  draw(screen: Screen) {
    // Draw semi-transparent background over the entire screen
    screen.c().fillStyle = "rgba(0, 0, 0, 0.7)";
    screen.c().fillRect(0, 0, screen.width, screen.height);

    // Draw Game Over text
    screen.c().fillStyle = "#FFFFFF";
    screen.c().font = `${this.fontSize}px ${this.fontFamily}`;
    screen.c().textAlign = "center";
    screen.c().textBaseline = "middle";
    screen.c().fillText(this.message, this.x, this.y);
  }

  update() {
    // No update logic needed for static display
  }
}
