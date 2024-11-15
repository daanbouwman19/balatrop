
import Entity from '../entity.js';

export function blood(x, y) {
    return new Particle(x, y, 0, 0, () => {
        const batch = []
        for (let i = 0; i < 20; i++) {
            batch.push({
                dx: Math.random() * 20 - 10,
                dy: Math.random() * 20 - 10,
                s: Math.random() * 10 + 10,
                life: Math.random() * 20 + 10
            });
        }
        return batch;
    }, (particle, t) => {
        particle.dy += 0.1;

        particle.x += particle.dx;
        particle.y += particle.dy;
        
        if (particle.life < 10) {
            particle.s = Math.lerp(particle.s, 0, 0.1);
        }

        particle.life -= 1;
    }, (particle, screen) => {
        screen.drawCircle(particle.x, particle.y, particle.s, "red");
    });
}

export class Particle extends Entity {

    example() {
        const blood = new Particle(100, 100, 0, 0, () => {
            const batch = []
            for (let i = 0; i < 20; i++) {
                batch.push({});
            }
            return batch;
        }, (particle, t) => {
            particle.dy += 0.1;

            particle.x += particle.dx;
            particle.y += particle.dy;
            
            particle.life -= 1;
        }, (particle, screen) => {
            screen.drawCircle(particle.x, particle.y, 2, "red");
        });

        const smoke = new Particle(100, 100, 0, 0, () => {
            const batch = []
            for (let i = 0; i < 10; i++) {
                batch.push({});
            }
            return batch;
        }, (particle, t) => {
            particle.dy -= 0.1;

            particle.x += particle.dx;
            particle.y += particle.dy;
            
            particle.life -= 1;
        }, (particle, screen) => {
            screen.drawCircle(particle.x, particle.y, 2, "grey");
        });


        /*
        create a new particle entity with the following parameters:
            - x: 100
            - y: 100
            - dx: 0
            - dy: 0
            - life: 100 (upon reaching 0, the particle will be destroyed)
            - batch: a function that returns an array particle objects (return batch)
            - instr: a function that updates the particle (particle, t)
            - disp: a function that draws the particle (screen, t)
        
        Js is slow so gotta be batched lol
        */
    }

    constructor(x, y, dx, dy, batch, instr, disp) {
        super(x, y);
        this.batch = batch();

        this.batch.forEach(particle => {
            particle.alive = true;
            particle.x = particle.x || x;
            particle.y = particle.y || y;
            particle.dx = particle.dx || dx;
            particle.dy = particle.dy || dy;
            particle.life = particle.life || 100;
        });

        this.instr = instr;
        this.disp = disp;

    }

    update(t) {
        this.batch.forEach(particle => {
            this.instr(particle, t);
        });

        this.batch = this.batch.filter(particle => particle.life > 0);

        if (this.batch.length == 0) {
            this.destroy();
        }
    }

    draw(screen, t) {
        this.batch.forEach(particle => {
            this.disp(particle, screen);
        });
    }
}
