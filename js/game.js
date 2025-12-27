class Game {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        // Images
        this.tableImg = new Image();
        this.tableImg.src = 'assets/sprites/table.png';

        this.ballImg = new Image();
        this.ballImg.src = 'assets/sprites/ball.png';

        this.shadowImg = new Image();
        this.shadowImg.src = 'assets/sprites/shadow.png';

        this.paddleImg = new Image();
        this.paddleImg.src = 'assets/sprites/paddle.png';

        // Table bounds (playable surface)
        this.bounds = {
            left: 140,
            right: canvas.width - 140,
            top: 90,
            bottom: canvas.height - 90
        };

        // Net
        this.net = {
            x: (this.bounds.left + this.bounds.right) / 2,
            height: 12
        };

        // Game objects (created in init)
        this.ball = null;
        this.player = null;
        this.ai = null;
        this.camera = null;
    }

    init() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        // Ball
        this.ball = new Ball(
            cx,
            cy,
            this.ballImg,
            this.shadowImg,
            this.bounds
        );

        // Paddles
        this.player = new Paddle(
            this.bounds.left,
            cy,
            this.paddleImg,
            false
        );

        this.ai = new Paddle(
            this.bounds.right,
            cy,
            this.paddleImg,
            true,
            0.85
        );
        this.ai.target = this.ball;

        // Camera
        this.camera = new Camera(this.canvas);
        this.camera.target = this.ball;
    }

    update(dt) {
        this.ball.update(dt);

        this.player.update(dt);
        this.ai.update(dt);

        // Paddle collisions
        this.ball.hitByPaddle(this.player);
        this.ball.hitByPaddle(this.ai);

        // Camera update (subtle horizontal pan)
        this.camera.update();

        // Reset if ball fully leaves play area
        if (
            this.ball.pos.x < this.bounds.left - 120 ||
            this.ball.pos.x > this.bounds.right + 120 ||
            this.ball.pos.y < this.bounds.top - 120 ||
            this.ball.pos.y > this.bounds.bottom + 120
        ) {
            this.resetBall();
        }
    }

    resetBall() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        this.ball.pos.x = cx;
        this.ball.pos.y = cy;
        this.ball.z = 14;

        this.ball.vel.x = Math.random() > 0.5 ? 7 : -7;
        this.ball.vel.y = 0;

        this.ball.zVel = 6;
        this.ball.spin.side = 0;
        this.ball.spin.top = 0;
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();

        // Camera transform
        this.camera.apply(ctx);

        // Draw table
        ctx.drawImage(
            this.tableImg,
            this.bounds.left,
            this.bounds.top,
            this.bounds.right - this.bounds.left,
            this.bounds.bottom - this.bounds.top
        );

        // Draw net (visual only — physics handled in Ball)
        ctx.fillStyle = 'rgba(255,255,255,0.65)';
        ctx.fillRect(
            this.net.x - 1,
            this.bounds.top,
            2,
            this.bounds.bottom - this.bounds.top
        );

        // Draw paddles
        this.player.draw(ctx);
        this.ai.draw(ctx);

        // Draw ball + shadow
        this.ball.draw(ctx);

        ctx.restore();
    }
}
