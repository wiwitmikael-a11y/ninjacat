// NinjaCat Pet - Reference-Matched High Fidelity Version
// Accurately recreates the iconic NinjaCat on Fire-Breathing Unicorn

class NinjaCatPet {
  constructor() {
    this.canvas = null;
    this.ctx = null;

    // Position
    this.x = window.innerWidth / 2;
    this.y = window.innerHeight / 2;
    this.targetX = this.x;
    this.targetY = this.y;

    // Physics
    this.vx = 0;
    this.vy = 0;
    this.direction = 1; // 1 = right, -1 = left
    this.scale = 0.5;

    // Animation
    this.frame = 0;
    this.idleTime = 0;
    this.lastInput = Date.now();

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
      z-index: 9999;
    `;
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMove(e.clientX, e.clientY));
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) this.onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });

    this.resize();
    this.animate();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  onMove(x, y) {
    this.targetX = x;
    this.targetY = y;
    this.lastInput = Date.now();
  }

  update() {
    // Idle wander
    if (Date.now() - this.lastInput > 3000) {
      this.idleTime += 0.008;
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      this.targetX = cx + Math.cos(this.idleTime) * 250;
      this.targetY = cy + Math.sin(this.idleTime * 0.7) * 120;
    }

    // Smooth follow physics
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    this.vx += dx * 0.003;
    this.vy += dy * 0.003;
    this.vx *= 0.95;
    this.vy *= 0.95;
    this.x += this.vx;
    this.y += this.vy;

    // Direction based on velocity
    if (Math.abs(this.vx) > 0.3) {
      this.direction = this.vx > 0 ? 1 : -1;
    }

    this.frame++;
  }

  animate() {
    if (!this.canvas) return;
    this.update();
    this.draw();
    this.animationId = requestAnimationFrame(() => this.animate());
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(this.x, this.y);

    // Flip horizontally if moving left
    if (this.direction === -1) {
      ctx.scale(-this.scale, this.scale);
    } else {
      ctx.scale(this.scale, this.scale);
    }

    // Gentle bobbing
    const bob = Math.sin(this.frame * 0.08) * 3;
    ctx.translate(0, bob);

    // Draw in correct order (back to front)
    this.drawFireBreath();
    this.drawTail();
    this.drawBackLegs();
    this.drawBody();
    this.drawMane();
    this.drawNeck();
    this.drawHead();
    this.drawFrontLegs();
    this.drawCat();
    this.drawFlag();

    ctx.restore();
  }

  // === UNICORN BODY ===
  drawBody() {
    const ctx = this.ctx;
    ctx.save();

    // Body is tilted back (rearing pose) - about 50 degrees
    ctx.rotate(-0.9);

    // Main body - horse torso shape
    ctx.beginPath();
    ctx.moveTo(-50, 0);
    ctx.bezierCurveTo(-60, -30, -30, -50, 20, -45); // Back curve
    ctx.bezierCurveTo(50, -40, 60, -20, 55, 10);    // Chest
    ctx.bezierCurveTo(50, 40, 20, 50, -20, 45);     // Belly
    ctx.bezierCurveTo(-45, 40, -55, 20, -50, 0);    // Hindquarters
    ctx.closePath();

    // White body with subtle gradient
    const bodyGrad = ctx.createRadialGradient(0, -10, 5, 0, 0, 60);
    bodyGrad.addColorStop(0, '#FFFFFF');
    bodyGrad.addColorStop(0.7, '#F8F8F8');
    bodyGrad.addColorStop(1, '#E8E8E8');
    ctx.fillStyle = bodyGrad;
    ctx.fill();

    ctx.restore();
  }

  drawNeck() {
    const ctx = this.ctx;
    ctx.save();

    // Neck extends from chest area upward
    ctx.translate(30, -70);
    ctx.rotate(-0.3);

    ctx.beginPath();
    ctx.moveTo(0, 40);
    ctx.bezierCurveTo(-15, 20, -15, -20, 0, -50);   // Back of neck
    ctx.bezierCurveTo(15, -55, 30, -45, 35, -30);   // Top curve to head
    ctx.bezierCurveTo(40, -10, 35, 20, 25, 40);     // Front of neck (throat)
    ctx.closePath();

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.restore();
  }

  drawHead() {
    const ctx = this.ctx;
    ctx.save();

    // Position head at end of neck
    ctx.translate(60, -115);
    ctx.rotate(-0.2);

    // Horse head shape
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.bezierCurveTo(-20, -5, -25, 5, -20, 20);     // Back of head
    ctx.bezierCurveTo(-15, 35, 10, 45, 30, 40);      // Jaw
    ctx.bezierCurveTo(45, 35, 55, 25, 55, 15);       // Snout
    ctx.bezierCurveTo(55, 5, 45, -5, 30, -8);        // Nose bridge
    ctx.bezierCurveTo(15, -10, 5, -5, 0, 0);         // Forehead
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Ear
    ctx.beginPath();
    ctx.moveTo(-5, -5);
    ctx.lineTo(-15, -25);
    ctx.lineTo(5, -10);
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.strokeStyle = '#DDD';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Eye - simple black dot
    ctx.beginPath();
    ctx.arc(15, 10, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#222';
    ctx.fill();

    // Horn - long golden spiral
    this.drawHorn(ctx, 5, -15);

    ctx.restore();
  }

  drawHorn(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.8); // Point forward and up

    // Long spiral horn
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(8, -60);
    ctx.lineTo(-5, 0);
    ctx.closePath();

    const hornGrad = ctx.createLinearGradient(0, 0, 5, -60);
    hornGrad.addColorStop(0, '#FFD54F');
    hornGrad.addColorStop(0.5, '#FFECB3');
    hornGrad.addColorStop(1, '#FFC107');
    ctx.fillStyle = hornGrad;
    ctx.fill();
    ctx.strokeStyle = '#FFA000';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Spiral lines on horn
    ctx.strokeStyle = '#FFB300';
    ctx.lineWidth = 0.5;
    for (let i = 0; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(-2, -10 - i * 10);
      ctx.lineTo(5, -15 - i * 10);
      ctx.stroke();
    }

    ctx.restore();
  }

  // === MANE - Flowing golden hair ===
  drawMane() {
    const ctx = this.ctx;
    const wave = Math.sin(this.frame * 0.1);

    ctx.save();
    ctx.translate(20, -100);

    // Large flowing mane with multiple strands
    const maneGrad = ctx.createLinearGradient(-30, -20, -80, 80);
    maneGrad.addColorStop(0, '#FFD54F');
    maneGrad.addColorStop(0.3, '#FFAB00');
    maneGrad.addColorStop(0.7, '#FF8F00');
    maneGrad.addColorStop(1, '#E65100');

    ctx.fillStyle = maneGrad;

    // Multiple flowing strands
    for (let strand = 0; strand < 5; strand++) {
      const offset = strand * 8;
      const waveOff = wave * (5 + strand * 2);

      ctx.beginPath();
      ctx.moveTo(-5 - offset, -10 + strand * 5);
      ctx.bezierCurveTo(
        -30 - offset + waveOff, 20 + strand * 10,
        -50 - offset + waveOff * 1.5, 60 + strand * 15,
        -40 - offset + waveOff * 2, 100 + strand * 20
      );
      ctx.bezierCurveTo(
        -30 - offset + waveOff * 1.5, 90 + strand * 18,
        -20 - offset + waveOff, 50 + strand * 12,
        0 - offset, 10 + strand * 8
      );
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  // === TAIL - Long flowing golden tail ===
  drawTail() {
    const ctx = this.ctx;
    const wave = Math.sin(this.frame * 0.12);

    ctx.save();
    ctx.translate(-70, 30);

    const tailGrad = ctx.createLinearGradient(0, 0, -80, 60);
    tailGrad.addColorStop(0, '#FFD54F');
    tailGrad.addColorStop(0.4, '#FFAB00');
    tailGrad.addColorStop(1, '#E65100');

    ctx.fillStyle = tailGrad;

    // Main tail body
    ctx.beginPath();
    ctx.moveTo(0, -10);
    ctx.bezierCurveTo(
      -40 + wave * 8, 10,
      -80 + wave * 15, 50,
      -100 + wave * 20, 100
    );
    ctx.bezierCurveTo(
      -70 + wave * 15, 90,
      -40 + wave * 8, 50,
      -10, 20
    );
    ctx.closePath();
    ctx.fill();

    // Additional tail strands
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      const yOff = i * 8;
      ctx.moveTo(-5, yOff);
      ctx.bezierCurveTo(
        -50 + wave * 10, 30 + yOff,
        -90 + wave * 18, 80 + yOff,
        -110 + wave * 22, 120 + yOff
      );
      ctx.bezierCurveTo(
        -85 + wave * 16, 100 + yOff,
        -45 + wave * 8, 50 + yOff,
        -15, 15 + yOff
      );
      ctx.closePath();
      ctx.fill();
    }

    ctx.restore();
  }

  // === LEGS ===
  drawBackLegs() {
    const ctx = this.ctx;
    const legWave = Math.sin(this.frame * 0.12) * 0.05;

    // Far back leg (slightly darker) - adjusted position to connect with body
    ctx.save();
    ctx.translate(-35, 35);
    ctx.rotate(-0.9 + legWave); // Match body rotation
    this.drawLeg(ctx, '#E8E8E8', 0.15 + legWave);
    ctx.restore();

    // Near back leg (supporting weight) - adjusted position
    ctx.save();
    ctx.translate(-20, 45);
    ctx.rotate(-0.9 - legWave); // Match body rotation
    this.drawLeg(ctx, '#FFFFFF', 0.1 - legWave);
    ctx.restore();
  }

  drawFrontLegs() {
    const ctx = this.ctx;
    const legWave = Math.sin(this.frame * 0.15) * 0.15;

    // Far front leg (raised) - adjusted to connect with chest area
    ctx.save();
    ctx.translate(25, -5);
    ctx.rotate(-0.6 + legWave);
    this.drawRaisedLeg(ctx, '#E8E8E8');
    ctx.restore();

    // Near front leg (more raised) - adjusted position
    ctx.save();
    ctx.translate(40, -15);
    ctx.rotate(-0.8 - legWave);
    this.drawRaisedLeg(ctx, '#FFFFFF');
    ctx.restore();
  }

  drawLeg(ctx, color, angle) {
    ctx.save();
    ctx.rotate(angle);

    // Upper leg
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(-10, 40);
    ctx.lineTo(10, 40);
    ctx.lineTo(8, 0);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Lower leg
    ctx.beginPath();
    ctx.moveTo(-8, 40);
    ctx.lineTo(-6, 80);
    ctx.lineTo(6, 80);
    ctx.lineTo(8, 40);
    ctx.closePath();
    ctx.fill();

    // Hoof
    ctx.beginPath();
    ctx.ellipse(0, 85, 10, 6, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();

    ctx.restore();
  }

  drawRaisedLeg(ctx, color) {
    // Front leg bent at knee (rearing)
    ctx.beginPath();
    ctx.moveTo(-6, 0);
    ctx.lineTo(-8, 25);
    ctx.lineTo(8, 25);
    ctx.lineTo(6, 0);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();

    // Lower portion bent forward
    ctx.save();
    ctx.translate(0, 25);
    ctx.rotate(0.6);
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(-4, 30);
    ctx.lineTo(4, 30);
    ctx.lineTo(5, 0);
    ctx.closePath();
    ctx.fill();

    // Hoof
    ctx.beginPath();
    ctx.ellipse(0, 33, 7, 5, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#333';
    ctx.fill();
    ctx.restore();
  }

  // === FIRE BREATH ===
  drawFireBreath() {
    const ctx = this.ctx;
    ctx.save();

    // Position at mouth
    ctx.translate(100, -90);
    ctx.rotate(0.4);

    // Create flame shape with gradient
    const flameGrad = ctx.createLinearGradient(0, 0, 150, 0);
    flameGrad.addColorStop(0, '#FFEB3B');
    flameGrad.addColorStop(0.3, '#FF9800');
    flameGrad.addColorStop(0.6, '#FF5722');
    flameGrad.addColorStop(1, 'rgba(255, 87, 34, 0)');

    // Main flame body
    const flameWave = Math.sin(this.frame * 0.2) * 5;

    ctx.beginPath();
    ctx.moveTo(0, -15);

    // Top edge of flame with jagged edges
    for (let i = 0; i < 8; i++) {
      const x = 20 + i * 18;
      const y = -20 + Math.sin(this.frame * 0.3 + i) * (8 + i * 2);
      ctx.lineTo(x, y + flameWave);
    }

    // Tip of flame
    ctx.lineTo(180, flameWave);

    // Bottom edge
    for (let i = 7; i >= 0; i--) {
      const x = 20 + i * 18;
      const y = 20 - Math.sin(this.frame * 0.3 + i + 1) * (8 + i * 2);
      ctx.lineTo(x, y + flameWave);
    }

    ctx.lineTo(0, 15);
    ctx.closePath();

    ctx.fillStyle = flameGrad;
    ctx.fill();

    // Inner bright core
    const coreGrad = ctx.createLinearGradient(0, 0, 80, 0);
    coreGrad.addColorStop(0, '#FFF9C4');
    coreGrad.addColorStop(0.5, '#FFEB3B');
    coreGrad.addColorStop(1, 'rgba(255, 235, 59, 0)');

    ctx.beginPath();
    ctx.moveTo(0, -8);
    ctx.bezierCurveTo(30, -10 + flameWave, 60, -5 + flameWave, 100, flameWave);
    ctx.bezierCurveTo(60, 5 + flameWave, 30, 10 + flameWave, 0, 8);
    ctx.closePath();
    ctx.fillStyle = coreGrad;
    ctx.fill();

    ctx.restore();
  }

  // === NINJA CAT ===
  drawCat() {
    const ctx = this.ctx;
    ctx.save();

    // Position cat on unicorn's back
    ctx.translate(-10, -85);
    ctx.rotate(-0.2);

    // Cat body (dark gray/brown)
    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 28, -0.3, 0, Math.PI * 2);
    ctx.fillStyle = '#5D4037';
    ctx.fill();

    // Cat head
    ctx.save();
    ctx.translate(8, -30);

    // Head circle
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fillStyle = '#5D4037';
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.moveTo(-12, -8);
    ctx.lineTo(-14, -26);
    ctx.lineTo(-4, -12);
    ctx.closePath();
    ctx.moveTo(4, -12);
    ctx.lineTo(14, -26);
    ctx.lineTo(12, -8);
    ctx.closePath();
    ctx.fill();

    // Inner ears (pink)
    ctx.beginPath();
    ctx.moveTo(-10, -10);
    ctx.lineTo(-12, -22);
    ctx.lineTo(-6, -12);
    ctx.closePath();
    ctx.moveTo(6, -12);
    ctx.lineTo(12, -22);
    ctx.lineTo(10, -10);
    ctx.closePath();
    ctx.fillStyle = '#FFAB91';
    ctx.fill();

    // Red bandana (over eyes, ninja style)
    ctx.beginPath();
    ctx.rect(-16, -6, 32, 10);
    ctx.fillStyle = '#D32F2F';
    ctx.fill();

    // Bandana tails flowing back
    const bandanaWave = Math.sin(this.frame * 0.15) * 4;
    ctx.beginPath();
    ctx.moveTo(-16, -3);
    ctx.bezierCurveTo(-30, -5 + bandanaWave, -45, 0 + bandanaWave, -55, -8 + bandanaWave);
    ctx.lineTo(-55, 2 + bandanaWave);
    ctx.bezierCurveTo(-45, 10 + bandanaWave, -30, 5 + bandanaWave, -16, 4);
    ctx.closePath();
    ctx.fill();

    // Nose
    ctx.beginPath();
    ctx.ellipse(5, 8, 3, 2, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FF8A80';
    ctx.fill();

    // Whiskers
    ctx.strokeStyle = '#8D6E63';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-5, 10); ctx.lineTo(-20, 8);
    ctx.moveTo(-5, 12); ctx.lineTo(-20, 14);
    ctx.moveTo(10, 10); ctx.lineTo(25, 8);
    ctx.moveTo(10, 12); ctx.lineTo(25, 14);
    ctx.stroke();

    ctx.restore();

    // Cat arms
    // Left arm (holding mane)
    ctx.beginPath();
    ctx.moveTo(-8, 10);
    ctx.quadraticCurveTo(-20, 15, -15, 30);
    ctx.lineWidth = 7;
    ctx.strokeStyle = '#5D4037';
    ctx.lineCap = 'round';
    ctx.stroke();

    // Right arm (raised holding flag)
    ctx.beginPath();
    ctx.moveTo(8, 5);
    ctx.quadraticCurveTo(25, -10, 30, -30);
    ctx.stroke();

    ctx.restore();
  }

  // === MICROSOFT FLAG ===
  drawFlag() {
    const ctx = this.ctx;
    ctx.save();

    // Position flag from cat's raised arm
    ctx.translate(20, -145);

    // Flag pole
    ctx.beginPath();
    ctx.moveTo(0, 60);
    ctx.lineTo(0, -50);
    ctx.strokeStyle = '#795548';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Flag wave animation
    const wave = (x) => Math.sin(this.frame * 0.12 + x * 0.05) * 4;

    // Flag dimensions
    const flagW = 55;
    const flagH = 40;
    const halfW = flagW / 2;
    const halfH = flagH / 2;

    // Draw 4 quadrants with proper MS colors:
    // Top-Left: Green (Xbox)
    // Top-Right: Red  
    // Bottom-Left: Blue
    // Bottom-Right: Yellow

    const drawQuadrant = (startX, startY, w, h, color) => {
      ctx.fillStyle = color;
      ctx.beginPath();

      const x1 = startX, y1 = startY + wave(startX);
      const x2 = startX + w, y2 = startY + wave(startX + w);
      const x3 = startX + w, y3 = startY + h + wave(startX + w);
      const x4 = startX, y4 = startY + h + wave(startX);

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.lineTo(x3, y3);
      ctx.lineTo(x4, y4);
      ctx.closePath();
      ctx.fill();
    };

    // Flag flies to the left (negative X from pole)
    // Green - Top Left (Xbox logo quadrant)
    drawQuadrant(-flagW, -50, halfW - 1, halfH - 1, '#7FBA00');
    // Red - Top Right
    drawQuadrant(-halfW - 1, -50, halfW - 1, halfH - 1, '#F25022');
    // Blue - Bottom Left
    drawQuadrant(-flagW, -50 + halfH + 1, halfW - 1, halfH - 1, '#00A4EF');
    // Yellow - Bottom Right
    drawQuadrant(-halfW - 1, -50 + halfH + 1, halfW - 1, halfH - 1, '#FFB900');

    ctx.restore();
  }
}

// Initialize
const initPet = () => {
  // Cleanup any existing instances
  if (window.pet) {
    if (window.pet.canvas) window.pet.canvas.remove();
    if (window.pet.animationId) cancelAnimationFrame(window.pet.animationId);
  }
  if (window.voxelPet) {
    if (window.voxelPet.canvas) window.voxelPet.canvas.remove();
    window.voxelPet = null;
  }

  console.log('🐱‍👤🦄 Initializing NinjaCat Pet...');
  window.pet = new NinjaCatPet();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPet);
} else {
  initPet();
}
