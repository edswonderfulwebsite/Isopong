class Ball {
    constructor(x, y, sprite, shadowSprite, table) {
        this.pos = { x: x, y: y };   // X/Y on table
        this.z = 0;                  // height above table
        this.vel = { x: 0, y: 0 };   // horizontal velocity
        this.zVel = 0;               // vertical speed
        this.radius = 10;            // visual radius
        this.spin = { x: 0, y: 0 };  // spin vector
        this.speed = 8;
        this.maxZ = 50;
        this.bounceDamping = 0.9;
        this.friction = 0.995;
        this.table = table;          // table bounds {xMin,xMax,yMin,yMax}
        this.sprite = sprite;
        this.shadowSprite = shadowSprite;
    }

    update(dt) {
        // Apply spin-induced curve (Magnus effect)
        this.vel.x += this.spin.y * 0.05;
        this.vel.y -= this.spin.x * 0.05;

        // Apply horizontal friction
        this.vel.x *= this.friction;
        this.vel.y *= this.friction;

        // Update X/Y
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;

        // Vertical physics
        this.zVel += -9.8 * dt; // gravity
        this.z += this.zVel * dt;

        // Bounce off table
        if(this.z < 0){
            this.z = 0;
            this.zVel = -this.zVel * this.bounceDamping;

            // Random spin on bounce
            this.spin.x += (Math.random() - 0.5) * 2;
            this.spin.y += (Math.random() - 0.5) * 2;
        }

        // Table bounds collision
        if(this.pos.x < this.table.xMin) { this.pos.x = this.table.xMin; this.vel.x = -this.vel.x; }
        if(this.pos.x > this.table.xMax) { this.pos.x = this.table.xMax; this.vel.x = -this.vel.x; }
        if(this.pos.y < this.table.yMin) { this.pos.y = this.table.yMin; this.vel.y = -this.vel.y; }
        if(this.pos.y > this.table.yMax) { this.pos.y = this.table.yMax; this.vel.y = -this.vel.y; }

    }

    draw(ctx) {
        // Draw shadow
        const shadowOffset = this.z * 0.5;
        const scale = 1 - (this.z / this.maxZ) * 0.5;
        ctx.drawImage(this.shadowSprite, this.pos.x - this.radius, this.pos.y + shadowOffset - this.radius, this.radius*2*scale, this.radius*2*scale);

        // Draw ball
        ctx.drawImage(this.sprite, this.pos.x - this.radius, this.pos.y - this.radius - this.z, this.radius*2, this.radius*2);
    }

    hitByPaddle(paddle) {
        // Advanced physics: add velocity based on paddle movement + spin
        const dx = this.pos.x - paddle.pos.x;
        const dy = this.pos.y - paddle.pos.y;

        const dist = Math.sqrt(dx*dx + dy*dy);
        if(dist < this.radius + paddle.radius){
            // Bounce off
            const normX = dx / dist;
            const normY = dy / dist;
            const speed = Math.sqrt(this.vel.x**2 + this.vel.y**2);

            // Reflect
            this.vel.x = normX * speed + paddle.vel.x * 0.5;
            this.vel.y = normY * speed + paddle.vel.y * 0.5;

            // Add spin based on where it hits paddle
            this.spin.x += (dy/dist) * paddle.skillFactor;
            this.spin.y += (dx/dist) * paddle.skillFactor;

            // Kick vertical velocity
            this.zVel = this.speed * 0.5 + Math.random() * 2;
        }
    }
}
