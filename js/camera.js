class Camera {
    constructor(canvas) {
        this.pos = { x: 0, y: 0 };
        this.zoom = 1;
        this.canvas = canvas;
        this.easing = 0.05;
        this.target = null;
    }

    update() {
        if (!this.target) return;
        this.pos.x += (this.target.pos.x - this.pos.x) * this.easing;
        this.pos.y += (this.target.pos.y - this.pos.y) * this.easing;

        const targetZoom = 1 - (this.target.z / this.target.maxZ) * 0.1;
        this.zoom += (targetZoom - this.zoom) * this.easing;
    }

    apply(ctx) {
        ctx.setTransform(this.zoom, 0, 0, this.zoom, this.canvas.width / 2 - this.pos.x * this.zoom, this.canvas.height / 2 - this.pos.y * this.zoom);
    }
}
