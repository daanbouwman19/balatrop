export class Screen {

    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.imageSmoothingEnabled = false;

        this.width = canvas.width;
        this.height = canvas.height;

        this.c = () => this.context;

        this.mouse = {
            x: 0,
            y: 0
        };
    }

    resize(width, height) {
        this.width = this.canvas.width = width;
        this.height = this.canvas.height = height;
    }

    updateMousePosition(event) {
        const rect = this.canvas.getBoundingClientRect();
        this.mouse.x = event.clientX - rect.left;
        this.mouse.y = event.clientY - rect.top;
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

    drawImage(x, y, image) {
        this.context.drawImage(image, x, y);
    }

}