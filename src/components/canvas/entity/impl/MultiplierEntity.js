import Entity from '../entity.js';

export class MultiplierEntity extends Entity {
    constructor(x, y, multiplier) {
        super(x, y);
        this.textColor = "#0000FF"
        this.delta = 0;
        this.movement = 2;
        this.multiplier = multiplier;
    }

    draw(screen, t) {
        screen.c().fillStyle = this.textColor;
        screen.c().font = '32px Arial';
        screen.c().textAlign = 'center';
        screen.c().fillText(this.multiplier, this.x, this.y);
    }

    update(t) {
        this.delta += 1;
        this.y -= 2 * this.multiplier;
        this.x += 1 * this.multiplier

        if (this.delta == 10) {
            this.destroy()
        }
    }

    destroy() {
        this.game.removeEntity(this);
    }
}