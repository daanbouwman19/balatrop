import Entity from "../entity";

export class EnemyEntity extends Entity {

    constructor(x, y, width, height, pokemon) {
        super(x, y);    
        this.width = width;
        this.height = height;

        console.log(pokemon);

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

        screen.c().save();  

        screen.c().scale(3,3);
        screen.c().shadowColor = "black";
        screen.c().shadowBlur = 20;

        screen.c().drawImage(this.image, this.x, this.y, this.width, this.height);
        screen.c().restore();
    }

}