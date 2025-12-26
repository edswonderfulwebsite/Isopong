class Ball {
    constructor(x, y, sprite, shadowSprite, table) {
        this.pos = { x: x, y: y };
        this.z = 0;
        this.vel = { x: 0, y: 0 };
        this.zVel = 0;
        this.radius = 12;
        this.spin = { x: 0, y: 0 };
        this.speed = 10;
        this.maxZ = 60;
        this.bounceDamping = 0.92;
        this.friction = 0.997;
        this.table = table;
        this.sprite = sprite;
        this.shadowSprite = shadowSprite;
        this.trail = [];
    }

    update(dt) {
        // Spin-induced curve
        this.vel.x += this.spin.y * 0.06;
        this.vel.y -= this.spin.x * 0.06;

        // Friction
        this.vel.x *= this.friction;
        this.vel.y *= this.friction;

        // Update position
        this.pos.x += this.vel.x * dt * 60;
        this.pos.y += this.vel.y * dt * 60;

        // Vertical physics
        this.zVel += -9.8 * dt;
        this.z += this.zVel * dt * 60;

        // Bounce on table
        if (this.z < 0) {
            this.z = 0;
            this.zVel = -this.zVel * this.bounceDamping;

            // Random spin
            this.spin.x += (Math.random() - 0.5) * 3;
            this.spin.y += (Math.random() - 0.5) * 3;
        }

        // Table bounds
        if (this.pos.x < this.table.xMin) { this.pos.x = this.table.xMin; this.vel.x = -this.vel.x; }
        if (this.pos.x > this.table.xMax) { this.pos.x = this.table.xMax; this.vel.x = -this.vel.x; }
        if (this.pos.y < this.table.yMin) { this.pos.y = this.table.yMin; this.vel.y = -this.vel.y; }
        if (this.pos.y > this.table.yMax) { this.pos.y = this.table.yMax; this.vel.y = -this.vel.y; }

        // Record trail
        this.trail.push({ x: this.pos.x, y: this.pos.y, z: this.z });
        if (this.trail.length > 10) this.trail.shift();
    }

    draw(ctx) {
        // Shadow
        const shadowOffset = this.z * 0.5;
        const scale = 1 - (this.z / this.maxZ) * 0.5;
        ctx.drawImage(this.shadowSprite, this.pos.x - this.radius, this.pos.y + shadowOffset - this.radius, this.radius * 2 * scale, this.radius * 2 * scale);

        // Ball
        ctx.drawImage(this.sprite, this.pos.x - this.radius, this.pos.y - this.radius - this.z, this.radius * 2, this.radius * 2);
    }

    hitByPaddle(paddle) {
        const dx = this.pos.x - paddle.pos.x;
        const dy = this.pos.y - paddle.pos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < this.radius + paddle.radius) {
            const normX = dx / dist;
            const normY = dy / dist;
            const speed = Math.sqrt(this.vel.x ** 2 + this.vel.y ** 2);

            this.vel.x = normX * speed + paddle.vel.x * 0.5;
            this.vel.y = normY * speed + paddle.vel.y * 0.5;

            this.spin.x += (dy / dist) * paddle.skillFactor * 2;
            this.spin.y += (dx / dist) * paddle.skillFactor * 2;

            this.zVel = this.speed * 0.6 + Math.random() * 2;
        }
    }
}
