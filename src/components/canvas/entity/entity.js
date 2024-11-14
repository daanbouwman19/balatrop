
export default class Entity {

    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.game = null;
    }

    setGame(game) {
        this.game = game;
    }

    draw(screen, t) {
        
    }

    update(t) {

    }

    destroy() {
        this.game.removeEntity(this);
    }

}
