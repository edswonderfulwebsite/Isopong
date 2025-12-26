class Paddle {
    constructor(x, y, sprite, isAI=false, skill=0.5){
        this.pos = {x: x, y: y};
        this.vel = {x: 0, y: 0};
        this.speed = 200; // pixels/sec
        this.radius = 20; // collision radius
        this.sprite = sprite;
        this.isAI = isAI;
        this.skillFactor = skill; // how well AI hits ball / adds spin
        this.target = null; // ball reference for AI
    }

    update(dt) {
        if(this.isAI && this.target){
            // AI movement: follow ball with "human-like" error
            const dx = this.target.pos.x - this.pos.x;
            const dy = this.target.pos.y - this.pos.y;

            // Simple proportional controller with skill factor
            this.vel.x = dx * this.skillFactor;
            this.vel.y = dy * this.skillFactor;

            // Clamp speed
            const speed = Math.sqrt(this.vel.x**2 + this.vel.y**2);
            if(speed > this.speed) {
                this.vel.x = (this.vel.x / speed) * this.speed;
                this.vel.y = (this.vel.y / speed) * this.speed;
            }
        } else {
            // Player input
            this.vel.x = 0;
            this.vel.y = 0;
            if(keys['ArrowLeft']) this.vel.x = -this.speed;
            if(keys['ArrowRight']) this.vel.x = this.speed;
            if(keys['ArrowUp']) this.vel.y = -this.speed;
            if(keys['ArrowDown']) this.vel.y = this.speed;
        }

        // Update position
        this.pos.x += this.vel.x * dt;
        this.pos.y += this.vel.y * dt;

        // Clamp inside table
        this.pos.x = Math.max(tableBounds.xMin + this.radius, Math.min(tableBounds.xMax - this.radius, this.pos.x));
        this.pos.y = Math.max(tableBounds.yMin + this.radius, Math.min(tableBounds.yMax - this.radius, this.pos.y));
    }

    draw(ctx){
        ctx.drawImage(this.sprite, this.pos.x - this.radius, this.pos.y - this.radius, this.radius*2, this.radius*2);
    }
}
