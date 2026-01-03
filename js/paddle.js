class Paddle {
  constructor(x, y) {
    this.x = x;
    this.y = y;

    this.vx = 0;
    this.vy = 0;

    this.prevX = x;
    this.prevY = y;

    this.width = 14;
    this.height = 70;

    this.stiffness = 80;   // spring strength
    this.damping = 0.85;   // velocity decay

    this.sprite = new Image();
    this.sprite.src = "assets/sprites/paddle.png";
  }

  update(cursorX, cursorY, dt) {
    this.prevX = this.x;
    this.prevY = this.y;

    // spring force
    const fx = (cursorX - this.x) * this.stiffness;
    const fy = (cursorY - this.y) * this.stiffness;

    this.vx += fx * dt;
    this.vy += fy * dt;

    this.vx *= this.damping;
    this.vy *= this.damping;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw(ctx) {
    ctx.drawImage(
      this.sprite,
      this.x - this.width / 2,
      this.y - this.height / 2,
      this.width,
      this.height
    );
  }

  getHitbox() {
    return {
      x: this.x,
      y: this.y,
      w: this.width,
      h: this.height
    };
  }
}
