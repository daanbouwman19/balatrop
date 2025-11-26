import { lerp } from "@/utils/math";
import Entity from '../entity';
import { Screen } from "../../screen";

interface ParticleData {
    dx: number;
    dy: number;
    s: number;
    life: number;
    x?: number;
    y?: number;
    alive?: boolean;
}

export function blood(x: number, y: number): Particle {
    return new Particle(x, y, 0, 0, () => {
        const batch: Partial<ParticleData>[] = []
        for (let i = 0; i < 20; i++) {
            batch.push({
                dx: Math.random() * 20 - 10,
                dy: Math.random() * 20 - 10,
                s: Math.random() * 10 + 10,
                life: Math.random() * 20 + 10
            });
        }
        return batch;
    }, (particle) => {
        if (particle.dy !== undefined) {
            particle.dy += 0.1;
        }

        if (particle.x !== undefined && particle.dx !== undefined) {
            particle.x += particle.dx;
        }
        if (particle.y !== undefined && particle.dy !== undefined) {
            particle.y += particle.dy;
        }

        if (particle.life !== undefined && particle.life < 10 && particle.s !== undefined) {
            particle.s = lerp(particle.s, 0, 0.1);
        }

        if (particle.life !== undefined) {
            particle.life -= 1;
        }
    }, (particle, screen) => {
        if (particle.x !== undefined && particle.y !== undefined && particle.s !== undefined) {
            screen.drawCircle(particle.x, particle.y, particle.s, "red");
        }
    });
}

export class Particle extends Entity {
    batch: Partial<ParticleData>[];
    instr: (particle: Partial<ParticleData>) => void;
    disp: (particle: Partial<ParticleData>, screen: Screen) => void;

    constructor(x: number, y: number, dx: number, dy: number, batch: () => Partial<ParticleData>[], instr: (particle: Partial<ParticleData>) => void, disp: (particle: Partial<ParticleData>, screen: Screen) => void) {
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

    update() {
        this.batch.forEach(particle => {
            this.instr(particle);
        });

        this.batch = this.batch.filter(particle => (particle.life || 0) > 0);

        if (this.batch.length == 0) {
            this.destroy();
        }
    }

    draw(screen: Screen) {
        this.batch.forEach(particle => {
            this.disp(particle, screen);
        });
    }
}
