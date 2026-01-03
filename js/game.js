class Game {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");
    this.width = canvas.width;
    this.height = canvas.height;

    this.mouse = {
      x: this.width / 2,
      y: this.height / 2
    };

    this.paddle = new Paddle(
      this.width / 2 - 200,
      this.height / 2 + 80
    );

    this.ball = new Ball(this.paddle);

    // Table dimensions (real ratio ~1.8:1)
    this.table = {
      w: this.width * 0.65,
      h: this.width * 0.65 / 1.8,
      x: this.width / 2,
      y: this.height / 2 + 40
    };

    canvas.addEventListener("mousemove", e => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    window.addEventListener("keydown", e => {
      if (e.key.toLowerCase() === "s") {
        this.ball.serve();
      }
    });

    this.last = performance.now();
  }

  drawTable() {
    const ctx = this.ctx;
    const t = this.table;

    ctx.fillStyle = "#2e8b57";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.rect(
      t.x - t.w / 2,
      t.y - t.h / 2,
      t.w,
      t.h
    );
    ctx.fill();
    ctx.stroke();
  }

  loop = () => {
    const now = performance.now();
    const dt = (now - this.last) / 1000;
    this.last = now;

    this.paddle.update(this.mouse.x, this.mouse.y, dt);
    this.ball.update(dt, this.paddle);

    this.ctx.clearRect(0, 0, this.width, this.height);

    this.drawTable();
    this.ball.draw(this.ctx);
    this.paddle.draw(this.ctx);

    requestAnimationFrame(this.loop);
  };
}
