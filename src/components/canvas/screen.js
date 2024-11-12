export class Screen {

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.width = canvas.width;
        this.height = canvas.height;
    }

    clear() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    background(color) {
        this.context.fillStyle = color;
        this.context.fillRect(0, 0, this.width, this.height);
    }

    drawRectangle(x, y, width, height, color) {
        this.context.fillStyle = color;
        this.context.fillRect(x, y, width, height);
    }

}