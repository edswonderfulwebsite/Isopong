class Ball {
  constructor(paddle) {
    this.radius = 6;

    this.sprite = new Image();
    this.sprite.src = "assets/sprites/ball.png";

    this.shadow = new Image();
    this.shadow.src = "assets/sprites/shadow.png";

    this.gravity = -1200;

    this.reset(paddle);
  }

  reset(paddle) {
    this.x = paddle.x + 40;
    this.y = paddle.y;
    this.z = 12;

    this.vx = 0;
    this.vy = 0;
    this.vz = 0;

    this.active = false;
    this.bounceTimer = 0;
  }

  serve() {
    if (this.active) return;

    this.active = true;
    this.vx = 420;
    this.vy = 0;
    this.vz = 420;
  }

  update(dt, paddle) {
    if (!this.active) {
      // Pre-serve bounce
      this.bounceTimer += dt * 6;
      this.z = Math.abs(Math.sin(this.bounceTimer)) * 10;
      this.x = paddle.x + 40;
      this.y = paddle.y;
      return;
    }

    // Physics
    this.vz += this.gravity * dt;

    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.z += this.vz * dt;

    // Table bounce
    if (this.z <= 0) {
      this.z = 0;
      this.vz *= -0.75;
    }

    // Paddle collision
    if (
      this.x + this.radius > paddle.x - paddle.width / 2 &&
      this.x - this.radius < paddle.x + paddle.width / 2 &&
      this.y + this.radius > paddle.y - paddle.height / 2 &&
      this.y - this.radius < paddle.y + paddle.height / 2 &&
      this.z < 12
    ) {
      // Reflect forward
      this.vx = Math.abs(this.vx) + Math.abs(paddle.vx) * 0.4;

      // Add directional control from paddle motion
      this.vy += paddle.vy * 0.35;

      // Add lift from upward motion
      this.vz = Math.max(this.vz, Math.abs(paddle.vy) * 0.2 + 300);
    }
  }

  draw(ctx) {
    // Shadow (only on table)
    ctx.globalAlpha = 0.5;
    ctx.drawImage(
      this.shadow,
      this.x - 10,
      this.y - 4,
      20,
      8
    );
    ctx.globalAlpha = 1;

    ctx.drawImage(
      this.sprite,
      this.x - this.radius,
      this.y - this.z - this.radius,
      this.radius * 2,
      this.radius * 2
    );
  }
}
