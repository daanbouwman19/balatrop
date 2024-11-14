import Entity from "../entity";

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
    }

    draw(screen, t) {
        if (!this.ready) return;

        const targetY = Math.sin(t * 0.01) * 10;
        
        this.y = Math.lerp(this.y, targetY, 0.1);

        screen.c().save();  

        screen.c().translate(this.x, this.y);
        screen.c().scale(3,3);
        screen.c().shadowColor = "black";
        screen.c().shadowBlur = 20;

        screen.c().drawImage(this.image, 0,0);
        screen.c().restore();
    }

}