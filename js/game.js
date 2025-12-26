class Game {
    constructor(ctx) {
        this.ctx = ctx;
        this.tableTiles = [];
        this.tileSize = 64;
        this.tileMapWidth = 8;
        this.tileMapHeight = 6;

        this.tableImg = new Image();
        this.tableImg.src = 'assets/sprites/tableTile.png';

        this.ballImg = new Image();
        this.ballImg.src = 'assets/sprites/ball.png';

        this.shadowImg = new Image();
        this.shadowImg.src = 'assets/sprites/shadow.png';

        this.paddleImg = new Image();
        this.paddleFrames = ['assets/sprites/paddle1.png','assets/sprites/paddle2.png'];
        this.currentFrame = 0;
        this.frameTimer = 0;
        this.frameInterval = 0.2;

        this.ball = null;
        this.player = null;
        this.ai = null;
        this.camera = null;
        this.score = { player: 0, ai: 0 };
    }

    init(canvas) {
        // Tilemap setup
        for (let y = 0; y < this.tileMapHeight; y++) {
            this.tableTiles[y] = [];
            for (let x = 0; x < this.tileMapWidth; x++) {
                this.tableTiles[y][x] = { x: x * this.tileSize, y: y * this.tileSize };
            }
        }

        window.tableBounds = { xMin: 0, xMax: this.tileMapWidth * this.tileSize, yMin: 0, yMax: this.tileMapHeight * this.tileSize };

        this.ball = new Ball(this.tileMapWidth * this.tileSize / 2, this.tileMapHeight * this.tileSize / 2, this.ballImg, this.shadowImg, tableBounds);

        this.player = new Paddle(this.tileMapWidth * this.tileSize / 2, this.tileMapHeight * this.tileSize - 30, this.paddleImg, false, 0.8);
        this.ai = new Paddle(this.tileMapWidth * this.tileSize / 2, 30, this.paddleImg, true, 0.7);
        this.ai.target = this.ball;

        this.camera = new Camera(canvas);
        this.camera.target = this.ball;
    }

    update(dt) {
        this.ball.update(dt);
        this.player.update(dt);
        this.ai.update(dt);

        this.ball.hitByPaddle(this.player);
        this.ball.hitByPaddle(this.ai);

        this.camera.update();

        this.frameTimer += dt;
        if (this.frameTimer > this.frameInterval) {
            this.currentFrame = (this.currentFrame + 1) % this.paddleFrames.length;
            this.paddleImg.src = this.paddleFrames[this.currentFrame];
            this.frameTimer = 0;
        }

        if (this.ball.pos.y < tableBounds.yMin) { this.score.player++; this.ballReset(); }
        if (this.ball.pos.y > tableBounds.yMax) { this.score.ai++; this.ballReset(); }
    }

    ballReset() {
        this.ball.pos = { x: this.tileMapWidth * this.tileSize / 2, y: this.tileMapHeight * this.tileSize / 2 };
        this.ball.z = 0;
        this.ball.vel = { x: (Math.random() - 0.5) * 8, y: (Math.random() - 0.5) * 8 };
        this.ball.zVel = 0;
        this.ball.spin = { x: 0, y: 0 };
    }

    draw() {
        const ctx = this.ctx;
        ctx.save();
        this.camera.apply(ctx);

        // Draw tilemap table
        for (let y = 0; y < this.tileMapHeight; y++) {
            for (let x = 0; x < this.tileMapWidth; x++) {
                const tile = this.tableTiles[y][x];
                ctx.drawImage(this.tableImg, tile.x, tile.y, this.tileSize, this.tileSize);
            }
        }

        this.player.draw(ctx);
        this.ai.draw(ctx);

        this.drawBallTrail(ctx);
        this.ball.draw(ctx);

        ctx.restore();

        ctx.fillStyle = "white";
        ctx.font = "24px sans-serif";
        ctx.fillText(`Player: ${this.score.player}`, 20, 30);
        ctx.fillText(`AI: ${this.score.ai}`, canvas.width - 120, 30);
    }

    drawBallTrail(ctx) {
        const trailCount = 5;
        for (let i = trailCount; i > 0; i--) {
            const alpha = i / trailCount * 0.3;
            ctx.globalAlpha = alpha;
            const offsetX = this.ball.vel.x * i * 0.05;
            const offsetY = this.ball.vel.y * i * 0.05;
            ctx.drawImage(this.ball.sprite, this.ball.pos.x - this.ball.radius - offsetX, this.ball.pos.y - this.ball.radius - this.ball.z - offsetY, this.ball.radius * 2, this.ball.radius * 2);
        }
        ctx.globalAlpha = 1;
    }
}
