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

    drawRectangle(x, y, width, height, color, radius = 0) {
        this.context.fillStyle = color;
        if (radius > 0) {
            this.context.beginPath();
            this.context.moveTo(x + radius, y);
            this.context.arcTo(x + width, y, x + width, y + height, radius);
            this.context.arcTo(x + width, y + height, x, y + height, radius);
            this.context.arcTo(x, y + height, x, y, radius);
            this.context.arcTo(x, y, x + width, y, radius);
            this.context.closePath();
            this.context.fill();
        } else {
            this.context.fillRect(x, y, width, height);
        }
    }

    drawImage(x, y, image) {
        this.context.drawImage(image, x, y);
    }

}