class Game {
  constructor(canvas) {
    this.ctx = canvas.getContext("2d");

    this.mouse = { x: canvas.width / 2, y: canvas.height / 2 };

    this.paddle = new Paddle(this.mouse.x, this.mouse.y);
    this.ball = new Ball(this.paddle);

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

  loop = () => {
    const now = performance.now();
    const dt = (now - this.last) / 1000;
    this.last = now;

    this.paddle.update(this.mouse.x, this.mouse.y, dt);
    this.ball.update(dt, this.paddle);

    this.ctx.clearRect(0, 0, 960, 540);
    this.ball.draw(this.ctx);
    this.paddle.draw(this.ctx);

    requestAnimationFrame(this.loop);
  };
}
