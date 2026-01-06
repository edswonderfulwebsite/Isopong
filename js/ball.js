class Table {
    constructor(canvas) {
        const PPM = 100;

        this.length = 2.74 * PPM;   // X axis
        this.width  = 1.525 * PPM;  // Y axis

        this.centerX = canvas.width / 2;
        this.centerY = canvas.height / 2;

        this.minX = this.centerX - this.length / 2;
        this.maxX = this.centerX + this.length / 2;
        this.minY = this.centerY - this.width / 2;
        this.maxY = this.centerY + this.width / 2;

        this.surfaceZ = 0;
    }

    contains(x, y) {
        return (
            x >= this.minX &&
            x <= this.maxX &&
            y >= this.minY &&
            y <= this.maxY
        );
    }

    draw(ctx) {
        ctx.fillStyle = "#1f6b4f"; // dark table tennis green
        ctx.fillRect(
            this.minX,
            this.minY,
            this.length,
            this.width
        );
    }
}
