import Entity from "../entity";
import { CorpseEntity } from "./CorpseEntity";

export class EnemyEntity extends Entity {

    constructor(x, y, width, height, pokemon) {
        super(x, y);    
        this.width = width;
        this.height = height;

        this.imageUri = pokemon.image;
        this.image = new Image(96, 96);
        this.image.src = this.imageUri;

        this.ready = false;

        console.log(this.imageUri);
        this.image.addEventListener("load", () => {
            this.ready = true;
        })

        this.pokemon = pokemon

        this.hp = pokemon.value * 10;
        this.maxHp = this.hp;
        this.damageTaken = 0;
        this.damageTakenDisplayDelay = 0;
    }

    draw(screen, t) {
        if (!this.ready) return;

        const targetY = Math.sin(t * 0.01) * 10;
        
        this.y = Math.lerp(this.y, targetY, 0.1);
        if (this.damageTakenDisplayDelay > 0) this.damageTakenDisplayDelay--;
        else this.damageTaken = Math.lerp(this.damageTaken, 0, 0.1);

        screen.c().save();  

        screen.c().translate(this.x, this.y);
        screen.c().scale(3,3);
        screen.c().shadowColor = "black";
        screen.c().shadowBlur = 20;

        screen.c().drawImage(this.image, 0, 0);

        //TODO draw health bar
        const hpPercent = this.hp / this.maxHp;
        const damagePercent = this.damageTaken / this.maxHp;
        screen.c().fillStyle = "green";
        screen.c().fillRect(0, 10, 96 * hpPercent, 5);
        screen.c().fillStyle = "red";
        screen.c().fillRect(96 * hpPercent, 10, 96 * (1 - hpPercent), 5);
        screen.c().fillStyle = "white";
        screen.c().fillRect(96 * hpPercent, 10, (damagePercent * 96), 5);

        screen.c().restore();
    }

    damage(amount) {
        this.hp -= amount;
        this.damageTaken += amount;
        this.damageTakenDisplayDelay = 5;
    }

    deathCheck() {
        // Only do this at the end of a round; punching the dead is tolerated
        const dead = this.hp <= 0;

        if (dead) {
            const corpse = new CorpseEntity(this);
            this.game.addEntity(corpse);
        }

        return dead;
    }

}