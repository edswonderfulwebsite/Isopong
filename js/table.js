class Table {
  constructor(canvas) {
    this.canvas = canvas;

    // Scale factor for screen
    this.scale = 140;

    this.width = 1.525 * this.scale;
    this.height = 2.74 * this.scale;

    this.x = (canvas.width - this.width) / 2;
    this.y = (canvas.height - this.height) / 2;
  }

  draw(ctx) {
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(this.x, this.y, this.width, this.height);

    // Net
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y + this.height / 2);
    ctx.lineTo(this.x + this.width, this.y + this.height / 2);
    ctx.stroke();
  }

  contains(x, y) {
    return (
      x >= this.x &&
      x <= this.x + this.width &&
      y >= this.y &&
      y <= this.y + this.height
    );
  }
}
