import Entity from "../entity";
import { Screen } from "../../screen";

export class FrankEntity extends Entity {
  width: number;
  height: number;
  color: string;
  imageUri: string;
  image: HTMLImageElement;
  ready: boolean;
  z: number;
  isIntro: boolean;
  messages: string[];
  message: string | undefined;
  dispMessage: string;
  t: number;
  exitAt: number;
  charTimer: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
  ) {
    super(x, y);
    this.width = width;
    this.height = height;
    this.color = color;

    this.imageUri = "./images/Frank_icon.jpg";
    this.image = new Image(200, 200);
    this.image.src = this.imageUri;

    this.ready = false;

    this.image.addEventListener("load", () => {
      this.ready = true;
    });

    this.z = 0;

    this.isIntro = false;
    this.messages = [];
    this.message = "";
    this.dispMessage = "";
    this.t = 0;
    this.exitAt = 0;
    this.charTimer = 0;
  }

  intro() {
    this.isIntro = true;

    this.messages = [
      "Welcome to the game!",
      "I am Professor Frank.",
      "I want beer.",
      "You will get beer for me.",
      "Or else.",
      "You will die.",
      "Byeee",
    ];

    this.message = this.messages.shift();
    this.dispMessage = "";

    this.x = 0;
    this.y = 0;
  }

  draw(screen: Screen) {
    if (!this.ready) return;

    const size = Math.min(screen.height / 4, 200) * 2;

    if (this.isIntro) {
      screen.c().fillStyle = "black";
      screen.c().font = "20px Arial";
      screen.c().textAlign = "center";

      screen
        .c()
        .fillText(
          this.dispMessage,
          screen.width / 2,
          screen.height / 2 + size * 0.7,
        );
    }

    const x = this.x + screen.width / 2;
    const y = this.y + screen.height / 2;
    const width = this.image.width;
    const height = this.image.height;

    const translate = () => {
      screen.c().translate(x - this.z * 2, y - this.z * 10);
      screen.c().scale(1 + this.z / 50, 1 + this.z / 50);
      screen.c().scale(size / 200, size / 200);
      // screen.c().scale(s, 1);
      screen.c().translate(-width / 2, -height / 2);
    };

    if (this.z > 0) {
      screen.c().save();
      screen.c().translate(4 * this.z, 10 * this.z);
      translate();

      screen.drawRectangle(0, 0, width, height, "rgba(0, 0, 0, 0.5)", 0);

      screen.c().restore();
    }
    screen.c().save();
    translate();

    screen.c().drawImage(this.image, 0, 0);

    screen.c().font = "20px Arial";
    screen.c().textAlign = "center";
    screen.c().fillText("Frank!", width / 2, -10);

    screen.c().restore();
  }

  update(dt: number) {
    this.t += dt;
    if (this.isIntro) {
      if (this.messages.length == 0) {
        this.z += 1 * dt;
        this.y -= 10 * dt;

        if (this.t >= this.exitAt) {
          this.game?.enterState("FILLHAND");
          this.destroy();
        }
      } else {
        this.z = Math.sin(this.t * 0.1) + 2;
      }

      if (this.message && this.message.length > this.dispMessage.length) {
        this.charTimer += dt;
        if (this.charTimer >= 1) {
          this.dispMessage += this.message[this.dispMessage.length];
          this.charTimer = 0;
        }
      }
    }
  }

  handleClick() {
    this.go();
  }

  keydown() {
    this.go();
  }

  go() {
    if (this.isIntro) {
      if (
        this.messages.length > 0 &&
        this.message &&
        this.dispMessage.length == this.message.length
      ) {
        this.message = this.messages.shift();
        this.dispMessage = "";
        this.charTimer = 0;

        if (this.messages.length == 0) {
          this.exitAt = this.t + 60;
        }
      }
    }
  }
}
