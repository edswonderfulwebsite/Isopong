class Game {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");

    this.table = new Table(canvas);

    this.ball = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      z: 120,
      vx: 40,
      vy: 20,
      vz: 0,
      radius: 6
    };

    this.gravity = -1200;
    this.bounceLoss = 0.82;
    this.lastTime = performance.now();
  }

  update(dt) {
    const b = this.ball;

    // Integrate motion
    b.vz += this.gravity * dt;
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    b.z += b.vz * dt;

    // Bounce only if over table
    if (b.z <= 0 && this.table.contains(b.x, b.y)) {
      b.z = 0;
      b.vz = -b.vz * this.bounceLoss;
    }
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.table.draw(ctx);

    // Shadow (ONLY if over table)
    if (this.table.contains(this.ball.x, this.ball.y)) {
      ctx.fillStyle = "rgba(0,0,0,0.25)";
      ctx.beginPath();
      ctx.ellipse(
        this.ball.x,
        this.ball.y,
        8,
        4,
        0,
        0,
        Math.PI * 2
      );
      ctx.fill();
    }

    // Ball
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(
      this.ball.x,
      this.ball.y - this.ball.z * 0.25,
      this.ball.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  loop = (time) => {
    const dt = Math.min((time - this.lastTime) / 1000, 0.016);
    this.lastTime = time;

    this.update(dt);
    this.draw();

    requestAnimationFrame(this.loop);
  };
}
