class Game {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        this.tableImg = new Image();
        this.tableImg.src = 'assets/sprites/table.png';

        this.ballImg = new Image();
        this.ballImg.src = 'assets/sprites/ball.png';

        this.shadowImg = new Image();
        this.shadowImg.src = 'assets/sprites/shadow.png';

        this.paddleImg = new Image();
        this.paddleImg.src = 'assets/sprites/paddle.png';

        this.bounds = {
            left: 120,
            right: canvas.width - 120,
            top: 80,
            bottom: canvas.height - 80
        };
    }

    init() {
        const cx = this.canvas.width / 2;
        const cy = this.canvas.height / 2;

        this.ball = new Ball(cx, cy, this.ballImg, this.shadowImg, this.bounds);

        // left = player, right = AI
        this.player = new Paddle(this.bounds.left, cy, this.paddleImg, false);
        this.ai = new Paddle(this.bounds.right, cy, this.paddleImg, true, 0.85);
        this.ai.target = this.ball;

        this.camera = new Camera(this.canvas);
        this.camera.target = this.ball;
    }

    update(dt) {
        this.ball.update(dt);

        this.player.update(dt);
        this.ai.update(dt);

        this.ball.hitByPaddle(this.player);
        this.ball.hitByPaddle(this.ai);

        this.camera.update();
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();

        this.camera.apply(ctx);

        ctx.drawImage(
            this.tableImg,
            this.bounds.left,
            this.bounds.top,
            this.bounds.right - this.bounds.left,
            this.bounds.bottom - this.bounds.top
        );

        this.player.draw(ctx);
        this.ai.draw(ctx);
        this.ball.draw(ctx);

        ctx.restore();
    }
}
