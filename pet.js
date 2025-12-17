// NinjaCat Pet - High Fidelity Smooth Vector Style
// Renders the Ninja Cat on a Rearing Unicorn using Canvas 2D paths and gradients

class SmoothPet {
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
    this.scale = 0.8;

    // Animation
    this.frame = 0;
    this.idleTime = 0;
    this.lastInput = Date.now();

    this.init();
  }

  init() {
    // Create full screen canvas
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'smoothPet';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9999';

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // Events
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMove(e.clientX, e.clientY));
    window.addEventListener('touchstart', (e) => {
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
    // Idle Wander Logic
    if (Date.now() - this.lastInput > 3000) {
      this.idleTime += 0.01;
      // Orbit center slowly
      const cx = this.canvas.width / 2;
      const cy = this.canvas.height / 2;
      this.targetX = cx + Math.cos(this.idleTime) * 300;
      this.targetY = cy + Math.sin(this.idleTime * 0.7) * 150;
    }

    // Movement Physics
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;

    this.vx += dx * 0.005;
    this.vy += dy * 0.005;
    this.vx *= 0.92;
    this.vy *= 0.92;

    this.x += this.vx;
    this.y += this.vy;

    // Direction
    if (Math.abs(this.vx) > 0.5) {
      this.direction = this.vx > 0 ? 1 : -1;
    }

    this.frame++;
  }

  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    ctx.translate(this.x, this.y);

    // Flip if moving left
    if (this.direction === -1) {
      ctx.scale(-this.scale, this.scale);
    } else {
      ctx.scale(this.scale, this.scale);
    }

    // Bobbing Animation
    const bob = Math.sin(this.frame * 0.1) * 5;
    ctx.translate(0, bob);

    // === RENDER ORDER ===
    // 1. Back Legs (Far)
    // 2. Tail
    // 3. Body
    // 4. Fire Breath (Behind head?) No, usually in front.
    // 5. Neck/Head
    // 6. Cat (Rider)
    // 7. Flag
    // 8. Front Legs/Back Legs (Near)

    this.drawUnicornBody();
    this.drawNinjaCat();
    this.drawFireBreath();

    ctx.restore();
  }

  drawUnicornBody() {
    const ctx = this.ctx;

    // --- 1. Right Back Leg (Far) ---
    ctx.save();
    ctx.fillStyle = '#E0E0E0'; // Slightly darker
    ctx.translate(-40, 60);
    ctx.rotate(0.2);
    this.drawLegShape(ctx, 15, 60);
    ctx.restore();

    // --- 2. Tail (Flowing Golden) ---
    const tWave = Math.sin(this.frame * 0.15) * 10;
    ctx.beginPath();
    // Base of tail
    ctx.moveTo(-70, 20);
    // Curve down and back
    ctx.bezierCurveTo(-100, 30, -120 + tWave, 80, -140 + tWave, 100);
    // Curve width
    ctx.bezierCurveTo(-110 + tWave, 90, -90, 40, -60, 25);

    const tailGrad = ctx.createLinearGradient(-100, 20, -140, 100);
    tailGrad.addColorStop(0, '#FFE082'); // Gold Light
    tailGrad.addColorStop(1, '#FFB300'); // Gold Dark
    ctx.fillStyle = tailGrad;
    ctx.fill();
    ctx.strokeStyle = '#F57F17';
    ctx.lineWidth = 1;
    ctx.stroke();

    // --- 3. Body (Rearing) ---
    // Torso is angled ~60 degrees
    ctx.save();
    ctx.rotate(-Math.PI / 4.5); // Angled up

    // Main Body Oval
    ctx.beginPath();
    ctx.ellipse(0, 0, 45, 80, 0, 0, Math.PI * 2);

    // Gradient for 3D feel
    const bodyGrad = ctx.createRadialGradient(-10, -10, 10, 0, 0, 80);
    bodyGrad.addColorStop(0, '#FFFFFF');
    bodyGrad.addColorStop(0.5, '#F5F5F5');
    bodyGrad.addColorStop(1, '#E0E0E0');

    ctx.fillStyle = bodyGrad;
    ctx.fill();
    // ctx.stroke(); // No outline for body to merge with neck

    ctx.restore();

    // --- 4. Left Back Leg (Near/Weight Bearing) ---
    ctx.save();
    ctx.translate(-50, 75);
    ctx.rotate(0.1);
    ctx.scale(1.1, 1.1);
    this.drawLegShape(ctx, 16, 65, '#FFFFFF');
    ctx.restore();

    // --- 5. Neck & Head ---
    ctx.save();
    // Translate to top of body
    ctx.translate(20, -40);
    ctx.rotate(-0.2);

    // Neck 
    ctx.beginPath();
    ctx.moveTo(0, 20);
    ctx.quadraticCurveTo(10, -20, 25, -40); // Throat
    ctx.lineTo(55, -40); // Chin
    ctx.quadraticCurveTo(50, -10, 30, 30); // Back of neck
    ctx.closePath();
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Head
    ctx.translate(40, -45);
    ctx.beginPath();
    // Snout
    ctx.moveTo(0, 0);
    ctx.lineTo(25, 5);
    ctx.lineTo(24, 15);
    ctx.lineTo(0, 20); // Jaw
    // Cheek
    ctx.bezierCurveTo(-10, 25, -20, 15, -20, 0); // Back of head
    ctx.lineTo(0, 0);

    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    // Ear
    ctx.beginPath();
    ctx.moveTo(-15, 0);
    ctx.lineTo(-20, -15);
    ctx.lineTo(-10, -5);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();
    ctx.stroke();

    // Eye (Burning Red/Orange for NinjaCat Lore or Normal?) 
    // Reference has glowing red eye? Or plain? Let's do cool glowing eye.
    ctx.beginPath();
    ctx.ellipse(-5, 5, 4, 3, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#FF3D00';
    ctx.fill();

    // Horn (Spiral)
    ctx.beginPath();
    ctx.moveTo(-5, -5);
    ctx.lineTo(35, -35); // Long horn forward/up
    ctx.lineTo(0, 0);
    const hornGrad = ctx.createLinearGradient(0, 0, 35, -35);
    hornGrad.addColorStop(0, '#FFD54F');
    hornGrad.addColorStop(0.5, '#FFF176');
    hornGrad.addColorStop(1, '#FF6F00');
    ctx.fillStyle = hornGrad;
    ctx.fill();
    ctx.strokeStyle = '#FFA000';
    ctx.stroke();

    // Mane (Wild Fire Hair)
    ctx.beginPath();
    ctx.moveTo(-20, -10);

    // Spikes for mane
    for (let i = 0; i < 5; i++) {
      const wave = Math.sin(this.frame * 0.2 + i) * 5;
      ctx.lineTo(-35 - i * 5 + wave, 10 + i * 15);
      ctx.lineTo(-20 - i * 2, 20 + i * 15);
    }
    ctx.lineTo(-5, 0);

    ctx.fillStyle = tailGrad;
    ctx.fill();
    ctx.stroke();

    ctx.restore(); // End Head Context

    // --- 6. Front Legs (Flailing) ---
    const legWave = Math.sin(this.frame * 0.2) * 10;

    // Far Front Leg
    ctx.save();
    ctx.translate(20, -10);
    ctx.rotate(-0.5 + legWave * 0.01);
    this.drawLegShape(ctx, 12, 50, '#E0E0E0', true);
    ctx.restore();

    // Near Front Leg (Higher)
    ctx.save();
    ctx.translate(30, -20);
    ctx.rotate(-0.8 - legWave * 0.01);
    this.drawLegShape(ctx, 13, 50, '#FFFFFF', true);
    ctx.restore();
  }

  drawLegShape(ctx, w, h, color = '#FFFFFF', bent = false) {
    ctx.beginPath();
    if (bent) {
      // Front leg bent knee
      ctx.moveTo(0, 0);
      ctx.lineTo(w, -h / 2); // Knee up
      ctx.lineTo(w * 2, 0); // Hoof forward
    } else {
      // Back leg stand
      ctx.moveTo(0, 0);
      ctx.lineTo(-5, h / 2); // Knee
      ctx.lineTo(5, h); // Hoof
    }

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = w;
    ctx.strokeStyle = color;
    ctx.stroke();

    // Hoof
    ctx.lineWidth = 1;
    ctx.fillStyle = '#333';
    const hx = bent ? w * 2 : 5;
    const hy = bent ? 0 : h;
    ctx.beginPath();
    ctx.ellipse(hx, hy + 2, w / 2 + 2, w / 3, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  drawNinjaCat() {
    const ctx = this.ctx;

    // Cat Position: Back of the neck/shoulders
    const rideX = 10;
    const rideY = -35;

    ctx.save();
    ctx.translate(rideX, rideY);

    // Cat Body (Gray)
    ctx.beginPath();
    ctx.ellipse(0, 0, 15, 25, -0.2, 0, Math.PI * 2); // Torso
    ctx.fillStyle = '#616161';
    ctx.fill();

    // White Chest Patch
    ctx.beginPath();
    ctx.ellipse(5, -5, 8, 12, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = '#F5F5F5';
    ctx.fill();

    // Head
    ctx.translate(5, -25);
    ctx.beginPath();
    ctx.arc(0, 0, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#616161';
    ctx.fill();

    // Ears
    ctx.beginPath();
    ctx.moveTo(-10, -5); ctx.lineTo(-12, -22); ctx.lineTo(-2, -10);
    ctx.moveTo(2, -10); ctx.lineTo(12, -22); ctx.lineTo(10, -5);
    ctx.fill();

    // Red Bandana
    ctx.beginPath();
    ctx.rect(-14, -8, 28, 6);
    ctx.fillStyle = '#D50000';
    ctx.fill();

    // Bandana Tails (Flowing back)
    const wind = Math.sin(this.frame * 0.2) * 5;
    ctx.beginPath();
    ctx.moveTo(-14, -5);
    ctx.quadraticCurveTo(-30, -5 + wind, -40, -10 + wind);
    ctx.lineTo(-40, 0 + wind);
    ctx.quadraticCurveTo(-30, 5 + wind, -14, 0);
    ctx.fill();

    // Arms
    // Left Arm (Holding on)
    ctx.beginPath();
    ctx.moveTo(-5, 15);
    ctx.quadraticCurveTo(-15, 20, -10, 30);
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#616161';
    ctx.stroke();

    // Right Arm (Holding Flag)
    const armWave = Math.sin(this.frame * 0.1) * 2;
    ctx.beginPath();
    ctx.moveTo(5, 15);
    ctx.lineTo(20, 10 + armWave);
    ctx.stroke();

    // --- FLAG ---
    this.drawFlag(20, 10 + armWave);

    ctx.restore();
  }

  drawFlag(x, y) {
    const ctx = this.ctx;

    // Pole
    ctx.beginPath();
    ctx.moveTo(x, y + 10); // Hand
    ctx.lineTo(x, y - 80); // Top
    ctx.strokeStyle = '#795548'; // Brown wood
    ctx.lineWidth = 3;
    ctx.stroke();

    // Flag Waving Physics
    const topY = y - 80;
    const width = 60;
    const height = 40;

    // Waving shape
    const wave = (offset) => Math.sin(this.frame * 0.15 + offset) * 5;

    // Draw 4 Quadrants
    // MS Logo Colors:
    // Red | Green
    // Blue| Yellow
    // Flag direction: Flying BACKWARDS (Left)

    const drawQuad = (color, dx, dy) => {
      const qw = width / 2;
      const qh = height / 2;
      ctx.fillStyle = color;
      ctx.beginPath();

      // Top Edge
      ctx.moveTo(x - dx, topY + dy + wave(dx / 20));
      ctx.lineTo(x - dx - qw, topY + dy + wave((dx + qw) / 20));
      // Bottom Edge
      ctx.lineTo(x - dx - qw, topY + dy + qh + wave((dx + qw) / 20));
      ctx.lineTo(x - dx, topY + dy + qh + wave(dx / 20));
      ctx.fill();
    };

    // Red (Top Near) -> Actually Top Right in logo, but usually logo faces viewer.
    // Let's do standard MS logo layout relative to flag surface.
    // If flag flies left.
    // TL(Red)  TR(Green)
    // BL(Blue) BR(Yellow)

    drawQuad('#F25022', 0, 0); // Red (Closest to pole, Top)
    drawQuad('#7FBA00', width / 2, 0); // Green (Far, Top)
    drawQuad('#00A4EF', 0, height / 2); // Blue (Close, Bottom)
    drawQuad('#FFB900', width / 2, height / 2); // Yellow (Far, Bottom)
  }

  drawFireBreath() {
    const ctx = this.ctx;
    // Mouth position approx:
    // Unicorn head is at (20 + 40 + 25, -40 - 45 + 5) roughly?
    // Body center (0,0) -> Neck trans(20, -40) -> Head trans(40, -45) -> Snout line(25, 5).
    // Total offset approx: (85, -80).

    const mx = 85;
    const my = -80;

    ctx.save();
    ctx.translate(mx, my);
    ctx.rotate(0.3); // Downwards

    // Fire Particles
    for (let i = 0; i < 15; i++) {
      const fAge = (this.frame + i * 13) % 60; // 0 to 60
      const fProg = fAge / 60;

      const fx = fAge * 3; // Distance
      const fy = Math.sin(fAge * 0.2 + i) * fAge * 0.3; // Spread
      const fSize = 2 + fProg * 10;

      const alpha = 1 - fProg;

      ctx.beginPath();
      ctx.arc(fx, fy, fSize, 0, Math.PI * 2);

      // Fire Gradient
      const grad = ctx.createRadialGradient(fx, fy, 0, fx, fy, fSize);
      grad.addColorStop(0, `rgba(255, 255, 0, ${alpha})`); // Yellow core
      grad.addColorStop(0.5, `rgba(255, 100, 0, ${alpha})`); // Orange mid
      grad.addColorStop(1, `rgba(255, 0, 0, 0)`); // Red edge fade

      ctx.fillStyle = grad;
      ctx.fill();
    }

    ctx.restore();
  }
}

// Init
const initPet = () => {
  // Clean up NEW pet instance
  if (window.pet) {
    if (window.pet.canvas) window.pet.canvas.remove();
    window.pet.isActive = false;
    if (window.pet.animationId) cancelAnimationFrame(window.pet.animationId);
  }
  // Clean up OLD voxel pet instance (if remains from HMR)
  if (window.voxelPet) {
    if (window.voxelPet.canvas) window.voxelPet.canvas.remove();
    window.voxelPet.isActive = false;
    window.voxelPet = null;
  }

  console.log('🦄 Initializing SmoothPet...');
  window.pet = new SmoothPet();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPet);
} else {
  initPet();
}
