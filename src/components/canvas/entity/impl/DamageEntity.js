import Entity from '../entity.js';

export class DamageEntity extends Entity {
    constructor(x, y, damage) {
        super(x, y)
        this.textColor = "#FF0000"
        this.delta = 0;
        this.movementMultiplier = 1;
        this.damage = damage;
    }

    draw(screen, t) {
        screen.c().fillStyle = this.textColor;
        screen.c().font = '32px Arial';
        screen.c().textAlign = 'center';
        screen.c().fillText(this.damage, this.x, this.y);
    }

    update(t) {
        this.delta += 1;
        this.y -= 2 * this.multiplier;
        this.x -= 1 * this.multiplier

        if (this.delta == 10) {
            this.destroy()
        }
    }

    destroy() {
        this.game.removeEntity(this);
    }
}