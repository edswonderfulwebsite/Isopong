class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d");

        this.ctx.imageSmoothingEnabled = false;

        // Table: only playable surface
        this.table = { x:160, y:120, width:480, height:240 };

        this.ball = new Ball(this.table);
        this.leftPaddle = new Paddle("left", this.table);
        this.rightPaddle = new Paddle("right", this.table);

        this.camera = new Camera(this.table);

        this.lastTime = performance.now();

        window.game = this; // global reference for paddle AI
    }

    update(dt) {
        this.leftPaddle.update(dt);
        this.rightPaddle.update(dt);
        this.ball.update(dt);

        // Paddle collisions
        this.ball.checkPaddleCollision(this.leftPaddle);
        this.ball.checkPaddleCollision(this.rightPaddle);

        // Net collision
        if (
            this.ball.z > 0.49 &&
            this.ball.z < 0.51 &&
            this.ball.y < this.table.y + 8
        ) {
            this.ball.vz *= -0.3;
            this.ball.vy *= 0.6;
        }

        // Ball leaves table
        if (!this.ball.isOverTable()) this.ball.leaveTable();

        this.camera.update(this.ball);
    }

    draw() {
        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.camera.apply(ctx);

        // Draw table
        ctx.fillStyle = "#228B22";
        ctx.fillRect(this.table.x, this.table.y, this.table.width, this.table.height);

        // Draw shadow if over table
        this.ball.drawShadow(ctx);

        this.leftPaddle.draw(ctx);
        this.rightPaddle.draw(ctx);
        this.ball.draw(ctx);

        this.camera.reset(ctx);
    }

    loop() {
        const now = performance.now();
        const dt = Math.min((now - this.lastTime)/1000, 0.016);
        this.lastTime = now;

        this.update(dt);
        this.draw();

        requestAnimationFrame(()=>this.loop());
    }
}
