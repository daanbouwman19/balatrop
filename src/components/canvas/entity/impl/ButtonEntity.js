import Entity from '../entity.js';

export class ButtonEntity extends Entity {

    constructor(x, y, width, height, text, color, onClick, isDisabled = () => false) {
        super(x, y);
        this.width = width;
        this.height = height;
        this.text = text;
        this.color = color;
        this.onClick = onClick;

        this.hovered = false;
        this.disabled = false; // Initialize disabled state
        this.isDisabled = isDisabled; // Function to determine if button is disabled
    }

    handleClick() {
        if (this.hovered && !this.disabled) {
            this.disabled = true; // Disable the button after click
            this.onClick();
        }
    }

    draw(screen, t) {
        // Update disabled state
        this.disabled = this.isDisabled();

        // Change appearance if disabled
        let buttonColor = this.disabled ? "#888888" : this.color;

        screen.drawRectangle(this.x, this.y, this.width, this.height, buttonColor, 10);

        if (this.hovered && !this.disabled) {
            screen.drawRectangle(this.x, this.y, this.width, this.height, "rgba(155,155,155,0.2)", 10);
        }

        // Adjust text color if disabled
        screen.c().fillStyle = this.disabled ? "#BBBBBB" : "black";
        screen.c().textAlign = "center";
        screen.c().font = "20px Arial";
        screen.c().fillText(this.text, this.x + this.width / 2, this.y + this.height / 2 + 5);
    }

    update(t) {
        // Update disabled state
        this.disabled = this.isDisabled();

        // Update hover state only if not disabled
        if (!this.disabled) {
            this.hovered = this.game.screen.mouse.x > this.x &&
                           this.game.screen.mouse.x < this.x + this.width &&
                           this.game.screen.mouse.y > this.y &&
                           this.game.screen.mouse.y < this.y + this.height;
        } else {
            this.hovered = false;
        }
    }
}
