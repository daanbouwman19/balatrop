import { lerp } from "@/utils/math";
import Entity from "../entity";
import { CorpseEntity } from "./CorpseEntity";
import { Screen } from "../../screen";
import { PokemonCard } from "./cardEntity";

export class EnemyEntity extends Entity {
  resizeHelpMe: number;
  width: number;
  height: number;
  imageUri: string;
  image: HTMLImageElement;
  ready: boolean;
  pokemon: PokemonCard;
  typeImages: HTMLImageElement[];
  hp: number;
  maxHp: number;
  damageTaken: number;
  damageTakenDisplayDelay: number;

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    pokemon: PokemonCard,
    difficulty: number,
  ) {
    super(x, y);
    this.resizeHelpMe = width / 96;
    this.width = width;
    this.height = height;

    this.imageUri = pokemon.image;
    this.image = new Image(96, 96);
    this.image.src = this.imageUri;

    this.ready = false;

    this.image.addEventListener("load", () => {
      this.ready = true;
    });

    this.pokemon = pokemon;

    this.typeImages = [];

    pokemon.types.forEach((type) => {
      const image = new Image(48, 16);
      image.src = `images/${type.type.name}.png`;
      this.typeImages.push(image);
    });

    this.hp = pokemon.value * 10 * (difficulty + 1);
    this.maxHp = this.hp;
    this.damageTaken = 0;
    this.damageTakenDisplayDelay = 0;
  }

  draw(screen: Screen, _t: number) {
    if (!this.ready) return;

    screen.c().save();

    screen.c().imageSmoothingEnabled = false;
    screen.c().translate(this.x, this.y);
    screen.c().scale(this.resizeHelpMe, this.resizeHelpMe);
    screen.c().shadowColor = "black";
    screen.c().shadowBlur = 20;

    screen.c().drawImage(this.image, 0, 0);

    this.typeImages.forEach((image, index) => {
      screen.c().drawImage(image, 75, 20 + index * image.height);
    });

    const hpPercent = this.hp / this.maxHp;
    const damagePercent = this.damageTaken / this.maxHp;
    screen.c().fillStyle = "green";
    screen.c().fillRect(0, 10, 96 * hpPercent, 5);
    screen.c().fillStyle = "red";
    screen.c().fillRect(96 * hpPercent, 10, 96 * (1 - hpPercent), 5);
    screen.c().fillStyle = "white";
    screen.c().shadowBlur = 0;
    screen.c().fillRect(96 * hpPercent, 10, damagePercent * 96, 5);

    screen.c().restore();
  }

  damage(amount: number) {
    this.hp -= amount;
    this.damageTaken += amount;
    this.damageTakenDisplayDelay = 5;
  }

  deathCheck() {
    // Only do this at the end of a round; punching the dead is tolerated
    const dead = this.hp <= 0;

    if (dead) {
      const corpse = new CorpseEntity(this);
      this.game?.addEntity(corpse);
    }

    return dead;
  }

  update(dt: number) {
    if (!this.game) return;
    const t = this.game.t;
    const targetY = Math.sin(t * 0.01) * 10;

    this.y = lerp(this.y, targetY, 1 - Math.pow(1 - 0.1, dt));
    if (this.damageTakenDisplayDelay > 0) this.damageTakenDisplayDelay -= dt;
    else this.damageTaken = lerp(this.damageTaken, 0, 1 - Math.pow(1 - 0.1, dt));
  }
}
