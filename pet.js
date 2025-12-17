// NinjaCat Pet - Smooth Canvas Drawing
// Based on reference: gray cat with red bandana riding white unicorn with golden mane

class NinjaCatPet {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.x = 200;
        this.y = 200;
        this.targetX = 200;
        this.targetY = 200;
        this.vx = 0;
        this.vy = 0;
        this.direction = 1;
        this.lastMouseMove = Date.now();
        this.bobOffset = 0;
        this.fireFrame = 0;
        this.legFrame = 0;
        this.maneWave = 0;
        this.isActive = true;
        this.scale = 0.6;

        this.wanderTarget = { x: 200, y: 200 };
        this.wanderTimer = 0;

        this.init();
    }

    init() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'ninjaCatPet';
        this.canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 9998;
    `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');

        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => this.onMouse(e));
        window.addEventListener('touchstart', (e) => this.onTouch(e), { passive: true });
        window.addEventListener('touchmove', (e) => this.onTouch(e), { passive: true });

        this.x = 100 + Math.random() * (window.innerWidth - 200);
        this.y = 150 + Math.random() * (window.innerHeight - 350);
        this.wanderTarget = { x: this.x, y: this.y };

        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    onMouse(e) {
        this.targetX = e.clientX;
        this.targetY = e.clientY;
        this.lastMouseMove = Date.now();
    }

    onTouch(e) {
        if (e.touches.length > 0) {
            this.targetX = e.touches[0].clientX;
            this.targetY = e.touches[0].clientY;
            this.lastMouseMove = Date.now();
        }
    }

    update() {
        const now = Date.now();
        const idle = now - this.lastMouseMove > 3000;

        if (idle) {
            this.wanderTimer++;
            if (this.wanderTimer > 180) {
                this.wanderTimer = 0;
                this.wanderTarget = {
                    x: 100 + Math.random() * (this.canvas.width - 200),
                    y: 100 + Math.random() * (this.canvas.height - 250)
                };
            }
            this.targetX = this.wanderTarget.x;
            this.targetY = this.wanderTarget.y;
        }

        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const speed = idle ? 0.02 : 0.05;
        const stopDist = idle ? 20 : 70;

        if (dist > stopDist) {
            this.vx += dx * speed * 0.08;
            this.vy += dy * speed * 0.08;
        }

        this.vx *= 0.93;
        this.vy *= 0.93;
        this.x += this.vx;
        this.y += this.vy;

        // Bounds
        const m = 80;
        this.x = Math.max(m, Math.min(this.canvas.width - m, this.x));
        this.y = Math.max(m, Math.min(this.canvas.height - m, this.y));

        // Direction
        if (Math.abs(this.vx) > 0.3) {
            this.direction = this.vx > 0 ? 1 : -1;
        }

        // Animation
        this.bobOffset = Math.sin(now / 200) * 3;
        this.fireFrame = now / 60;
        this.legFrame = Math.sin(now / 120) * 8;
        this.maneWave = now / 100;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.x, this.y + this.bobOffset);
        this.ctx.scale(this.direction * this.scale, this.scale);

        this.drawFire();
        this.drawUnicorn();
        this.drawCat();
        this.drawFlag();

        this.ctx.restore();
    }

    drawUnicorn() {
        const ctx = this.ctx;

        // === UNICORN BODY (White, rearing pose) ===

        // Back legs (on ground)
        ctx.fillStyle = '#F0F0F0';
        ctx.strokeStyle = '#DDD';
        ctx.lineWidth = 2;

        // Left back leg
        ctx.beginPath();
        ctx.moveTo(-30, 40);
        ctx.quadraticCurveTo(-40, 70, -35, 100 + this.legFrame);
        ctx.quadraticCurveTo(-30, 105, -25, 100 + this.legFrame);
        ctx.quadraticCurveTo(-20, 70, -20, 40);
        ctx.fillStyle = '#F0F0F0';
        ctx.fill();
        ctx.stroke();

        // Right back leg
        ctx.beginPath();
        ctx.moveTo(-50, 35);
        ctx.quadraticCurveTo(-65, 65, -60, 95 - this.legFrame);
        ctx.quadraticCurveTo(-55, 100, -50, 95 - this.legFrame);
        ctx.quadraticCurveTo(-40, 65, -40, 35);
        ctx.fill();
        ctx.stroke();

        // Body (oval, tilted up for rearing)
        ctx.beginPath();
        ctx.ellipse(0, 20, 45, 30, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#FAFAFA';
        ctx.fill();
        ctx.strokeStyle = '#E5E5E5';
        ctx.stroke();

        // Tail (flowing golden)
        const tailColors = ['#FFD700', '#FFA500', '#FF8C00'];
        for (let i = 0; i < 5; i++) {
            const wave = Math.sin(this.maneWave + i * 0.5) * 8;
            ctx.beginPath();
            ctx.moveTo(-45, 30);
            ctx.quadraticCurveTo(-70 + wave, 40 + i * 8, -85 + wave, 50 + i * 12);
            ctx.strokeStyle = tailColors[i % 3];
            ctx.lineWidth = 6 - i * 0.8;
            ctx.lineCap = 'round';
            ctx.stroke();
        }

        // Front legs (raised in rearing pose) - MAKE MORE VISIBLE
        ctx.fillStyle = '#FAFAFA';
        ctx.strokeStyle = '#DDD';
        ctx.lineWidth = 2;

        // Left front leg (raised high)
        ctx.beginPath();
        ctx.moveTo(15, 5);
        ctx.quadraticCurveTo(5, -25, 0 + this.legFrame * 0.5, -55);
        ctx.lineTo(8 + this.legFrame * 0.5, -55);
        ctx.quadraticCurveTo(15, -25, 22, 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Left front hoof
        ctx.beginPath();
        ctx.ellipse(4 + this.legFrame * 0.5, -58, 6, 4, -0.3, 0, Math.PI * 2);
        ctx.fillStyle = '#444';
        ctx.fill();

        // Right front leg (raised high)
        ctx.fillStyle = '#F0F0F0';
        ctx.beginPath();
        ctx.moveTo(25, 0);
        ctx.quadraticCurveTo(30, -30, 35 - this.legFrame * 0.5, -65);
        ctx.lineTo(42 - this.legFrame * 0.5, -62);
        ctx.quadraticCurveTo(38, -25, 32, 0);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#DDD';
        ctx.stroke();

        // Right front hoof
        ctx.beginPath();
        ctx.ellipse(38 - this.legFrame * 0.5, -67, 6, 4, 0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#444';
        ctx.fill();

        // Neck (curved up)
        ctx.beginPath();
        ctx.moveTo(30, -5);
        ctx.quadraticCurveTo(45, -30, 50, -55);
        ctx.quadraticCurveTo(55, -60, 55, -55);
        ctx.quadraticCurveTo(60, -25, 45, -5);
        ctx.closePath();
        ctx.fillStyle = '#FAFAFA';
        ctx.fill();
        ctx.strokeStyle = '#E5E5E5';
        ctx.stroke();

        // Head
        ctx.beginPath();
        ctx.ellipse(60, -70, 22, 18, 0.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Snout
        ctx.beginPath();
        ctx.ellipse(80, -60, 12, 8, 0.3, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Eye
        ctx.beginPath();
        ctx.ellipse(55, -75, 4, 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#333';
        ctx.fill();

        // Ear
        ctx.beginPath();
        ctx.moveTo(48, -85);
        ctx.lineTo(42, -100);
        ctx.lineTo(55, -90);
        ctx.closePath();
        ctx.fillStyle = '#F0F0F0';
        ctx.fill();
        ctx.strokeStyle = '#DDD';
        ctx.stroke();

        // Golden Horn (spiral)
        const hornGrad = ctx.createLinearGradient(70, -110, 90, -70);
        hornGrad.addColorStop(0, '#FFD700');
        hornGrad.addColorStop(0.5, '#FFF8DC');
        hornGrad.addColorStop(1, '#DAA520');

        ctx.beginPath();
        ctx.moveTo(70, -75);
        ctx.lineTo(85, -115);
        ctx.lineTo(75, -75);
        ctx.closePath();
        ctx.fillStyle = hornGrad;
        ctx.fill();
        ctx.strokeStyle = '#B8860B';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Mane (golden, flowing)
        for (let i = 0; i < 7; i++) {
            const wave = Math.sin(this.maneWave + i * 0.4) * 6;
            ctx.beginPath();
            ctx.moveTo(45 - i * 3, -60 + i * 8);
            ctx.quadraticCurveTo(25 + wave, -55 + i * 10, 15 + wave, -45 + i * 12);
            ctx.strokeStyle = tailColors[i % 3];
            ctx.lineWidth = 5 - i * 0.4;
            ctx.lineCap = 'round';
            ctx.stroke();
        }
    }

    drawCat() {
        const ctx = this.ctx;

        // === NINJA CAT (sitting on unicorn's back) ===

        // Cat body (gray-brown)
        ctx.beginPath();
        ctx.ellipse(0, -10, 18, 14, -0.2, 0, Math.PI * 2);
        ctx.fillStyle = '#5D4E40';
        ctx.fill();
        ctx.strokeStyle = '#4A3F35';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Cat head
        ctx.beginPath();
        ctx.arc(15, -35, 16, 0, Math.PI * 2);
        ctx.fillStyle = '#5D4E40';
        ctx.fill();
        ctx.stroke();

        // Cat ears
        ctx.beginPath();
        ctx.moveTo(5, -48);
        ctx.lineTo(0, -65);
        ctx.lineTo(12, -52);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(22, -50);
        ctx.lineTo(30, -65);
        ctx.lineTo(28, -48);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Inner ears (pink)
        ctx.beginPath();
        ctx.moveTo(6, -50);
        ctx.lineTo(4, -60);
        ctx.lineTo(10, -52);
        ctx.closePath();
        ctx.fillStyle = '#FFB6C1';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(23, -51);
        ctx.lineTo(28, -60);
        ctx.lineTo(26, -49);
        ctx.closePath();
        ctx.fill();

        // Ninja mask (red bandana)
        ctx.beginPath();
        ctx.ellipse(15, -38, 14, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#CC2222';
        ctx.fill();

        // Bandana tails (flowing)
        const bandanaWave = Math.sin(this.maneWave) * 5;
        ctx.beginPath();
        ctx.moveTo(0, -38);
        ctx.quadraticCurveTo(-15 + bandanaWave, -35, -25 + bandanaWave, -30);
        ctx.strokeStyle = '#CC2222';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(-2, -36);
        ctx.quadraticCurveTo(-18 + bandanaWave, -30, -30 + bandanaWave, -22);
        ctx.lineWidth = 3;
        ctx.stroke();

        // Cat eyes (white with black pupils, peeking over mask)
        ctx.beginPath();
        ctx.ellipse(8, -42, 5, 4, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(22, -42, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Pupils
        ctx.beginPath();
        ctx.arc(9, -42, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#111';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(21, -42, 2.5, 0, Math.PI * 2);
        ctx.fill();

        // Eye highlights
        ctx.beginPath();
        ctx.arc(10, -43, 1, 0, Math.PI * 2);
        ctx.fillStyle = '#FFF';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(22, -43, 1, 0, Math.PI * 2);
        ctx.fill();

        // Cat paws (holding on)
        ctx.beginPath();
        ctx.ellipse(-12, 8, 8, 6, -0.5, 0, Math.PI * 2);
        ctx.fillStyle = '#5D4E40';
        ctx.fill();
        ctx.strokeStyle = '#4A3F35';
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(12, 10, 8, 6, 0.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Cat tail (curving up)
        ctx.beginPath();
        ctx.moveTo(-15, -5);
        ctx.quadraticCurveTo(-30, -15, -35 + Math.sin(this.maneWave * 1.5) * 5, -30);
        ctx.strokeStyle = '#5D4E40';
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.stroke();
    }

    drawFlag() {
        const ctx = this.ctx;
        const wave = Math.sin(this.maneWave * 0.8) * 3;

        // Flag pole (cat is holding it)
        ctx.beginPath();
        ctx.moveTo(-8, -20);
        ctx.lineTo(-5 + wave, -90);
        ctx.strokeStyle = '#8B4513';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Microsoft flag (4 colored squares)
        const flagX = -5 + wave;
        const flagY = -90;
        const flagW = 24;
        const flagH = 18;

        // Red
        ctx.fillStyle = '#F25022';
        ctx.fillRect(flagX, flagY, flagW / 2 - 1, flagH / 2 - 1);

        // Green
        ctx.fillStyle = '#7FBA00';
        ctx.fillRect(flagX + flagW / 2, flagY, flagW / 2 - 1, flagH / 2 - 1);

        // Blue
        ctx.fillStyle = '#00A4EF';
        ctx.fillRect(flagX, flagY + flagH / 2, flagW / 2 - 1, flagH / 2 - 1);

        // Yellow
        ctx.fillStyle = '#FFB900';
        ctx.fillRect(flagX + flagW / 2, flagY + flagH / 2, flagW / 2 - 1, flagH / 2 - 1);
    }

    drawFire() {
        const ctx = this.ctx;

        // Fire from unicorn's mouth
        const fireColors = ['#FFE500', '#FF9500', '#FF4500', '#FF2200'];

        for (let layer = 0; layer < 4; layer++) {
            const flicker = Math.sin(this.fireFrame + layer) * 5;
            const size = 1 - layer * 0.15;

            ctx.beginPath();
            ctx.moveTo(90, -58);
            ctx.quadraticCurveTo(
                110 + flicker * 2, -55 + flicker,
                130 + layer * 8 + flicker * 3, -50 + flicker * 2
            );
            ctx.quadraticCurveTo(
                120 + flicker, -60 + flicker,
                130 + layer * 10 + flicker * 2, -65 + flicker
            );
            ctx.quadraticCurveTo(
                110 + flicker, -62 - flicker,
                90, -60
            );
            ctx.closePath();

            ctx.fillStyle = fireColors[layer];
            ctx.globalAlpha = 0.9 - layer * 0.15;
            ctx.fill();

            // Glow
            ctx.shadowColor = fireColors[layer];
            ctx.shadowBlur = 15 - layer * 3;
            ctx.fill();
            ctx.shadowBlur = 0;
        }

        ctx.globalAlpha = 1;
    }

    animate() {
        if (!this.isActive) return;
        this.update();
        this.draw();
        requestAnimationFrame(() => this.animate());
    }

    destroy() {
        this.isActive = false;
        if (this.canvas?.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

// Initialize after page load
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        window.ninjaCatPet = new NinjaCatPet();
    }, 800);
});

export { NinjaCatPet };
