// NinjaCat Voxel Pet - 3D Isometric Pixel Art Style with Depth Sorting
class VoxelPet {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.x = 200;
    this.y = 200;
    this.targetX = 200;
    this.targetY = 200;
    this.vx = 0;
    this.vy = 0;
    this.direction = 1; // 1 = right, -1 = left
    this.lastMouseMove = Date.now();
    this.isActive = true;

    // Animation state
    this.frame = 0;
    this.walkCycle = 0;
    this.bobOffset = 0;
    this.rearAngle = 0;

    // Voxel settings
    this.scale = 3.5;
    this.modelScale = 1.0;

    this.wanderTarget = { x: 200, y: 200 };
    this.wanderTimer = 0;

    this.init();
  }

  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'voxelPet';
    this.canvas.style.position = 'fixed';
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '9998';

    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    this.x = 100 + Math.random() * (window.innerWidth - 200);
    this.y = 100 + Math.random() * (window.innerHeight - 200);
    this.wanderTarget = { x: this.x, y: this.y };

    this.resize();
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => this.onMouse(e));
    window.addEventListener('touchstart', (e) => this.onTouch(e), { passive: true });
    window.addEventListener('touchmove', (e) => this.onTouch(e), { passive: true });

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
    const isIdle = now - this.lastMouseMove > 3000;

    if (isIdle) {
      this.wanderTimer++;
      if (this.wanderTimer > 150) {
        this.wanderTimer = 0;
        this.wanderTarget = {
          x: 100 + Math.random() * (this.canvas.width - 200),
          y: 100 + Math.random() * (this.canvas.height - 200)
        };
      }
      this.targetX = this.wanderTarget.x;
      this.targetY = this.wanderTarget.y;
    }

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    const speed = isIdle ? 0.03 : 0.06;
    const stopDist = isIdle ? 10 : 60;

    if (dist > stopDist) {
      this.vx += dx * speed * 0.1;
      this.vy += dy * speed * 0.1;
      this.walkCycle += 0.2;
    } else {
      this.walkCycle += 0.05;
      if (this.walkCycle > Math.PI * 2) this.walkCycle -= Math.PI * 2;
    }

    this.vx *= 0.92;
    this.vy *= 0.92;
    this.x += this.vx;
    this.y += this.vy;

    const m = 50;
    this.x = Math.max(m, Math.min(this.canvas.width - m, this.x));
    this.y = Math.max(m, Math.min(this.canvas.height - m, this.y));

    if (Math.abs(this.vx) > 0.5) {
      this.direction = this.vx > 0 ? 1 : -1;
    }

    this.frame++;
    this.bobOffset = Math.sin(this.walkCycle * 2) * 2;
  }

  adjustColor(color, amount) {
    let usePound = false;
    if (color[0] == "#") { color = color.slice(1); usePound = true; }
    let num = parseInt(color, 16);
    let r = (num >> 16) + amount;
    if (r > 255) r = 255; else if (r < 0) r = 0;
    let b = ((num >> 8) & 0x00FF) + amount;
    if (b > 255) b = 255; else if (b < 0) b = 0;
    let g = (num & 0x0000FF) + amount;
    if (g > 255) g = 255; else if (g < 0) g = 0;
    return (usePound ? "#" : "") + (g | (b << 8) | (r << 16)).toString(16).padStart(6, '0');
  }

  drawIsoBox(ox, oy, w, d, h, color) {
    const ctx = this.ctx;
    const cTop = this.adjustColor(color, 30);
    const cRight = this.adjustColor(color, -10);
    const cLeft = this.adjustColor(color, -40);

    const cos30 = 0.866;
    const sin30 = 0.5;

    const wx = w * cos30;
    const wy = w * sin30;
    const dx = -d * cos30;
    const dy = d * sin30;
    const hx = 0;
    const hy = -h;

    // Left
    ctx.fillStyle = cLeft;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + dx, oy + dy);
    ctx.lineTo(ox + dx + hx, oy + dy + hy);
    ctx.lineTo(ox + hx, oy + hy);
    ctx.fill();
    ctx.stroke();

    // Right
    ctx.fillStyle = cRight;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + wx, oy + wy);
    ctx.lineTo(ox + wx + hx, oy + wy + hy);
    ctx.lineTo(ox + hx, oy + hy);
    ctx.fill();
    ctx.stroke();

    // Top
    ctx.fillStyle = cTop;
    ctx.beginPath();
    ctx.moveTo(ox + hx, oy + hy);
    ctx.lineTo(ox + hx + dx, oy + hy + dy);
    ctx.lineTo(ox + hx + dx + wx, oy + hy + dy + wy);
    ctx.lineTo(ox + hx + wx, oy + hy + wy);
    ctx.fill();
    ctx.stroke();
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.save();
    this.ctx.translate(this.x, this.y + this.bobOffset);

    this.ctx.lineWidth = 1;
    this.ctx.strokeStyle = 'rgba(0,0,0,0.2)';
    this.ctx.lineJoin = 'round';

    const parts = [];

    const addPart = (x, y, z, w, d, h, color) => {
      const tx = x * this.direction;
      const sortKey = (tx + y) * 10 + z * 0.1;
      parts.push({ x: tx, y, z, w, d, h, color, depth: sortKey });
    };

    // === MODEL DEFINITION ===
    // REARING POSE
    const hipX = -2;
    const headNod = Math.sin(this.frame * 0.1) * 0.5;
    const legMove = Math.sin(this.frame * 0.2) * 1;

    // Legs
    addPart(hipX - 1, -2, 0, 1.5, 1.5, 4, '#E0E0E0'); // BL
    addPart(hipX - 1, -2, -0.5, 1.8, 1.8, 0.5, '#333333');
    addPart(hipX - 1, 2, 0, 1.5, 1.5, 4, '#E0E0E0'); // BR
    addPart(hipX - 1, 2, -0.5, 1.8, 1.8, 0.5, '#333333');

    // Body (Angled stack)
    addPart(hipX, 0, 3.5, 3, 3, 3.5, '#FFFFFF');
    addPart(hipX + 2, 0, 6, 2.5, 2.8, 3.5, '#FFFFFF');
    addPart(hipX + 3.5, 0, 8, 3, 3, 4, '#FFFFFF');

    // Neck
    addPart(hipX + 4, 0, 11, 2, 2, 3, '#FFFFFF');
    addPart(hipX + 4.5, 0, 13, 2, 1.8, 2, '#FFFFFF');

    // Head
    addPart(hipX + 6, 0, 14.5 + headNod, 3, 2.2, 2.5, '#FFFFFF');
    addPart(hipX + 7.5, 0, 14 + headNod, 1.5, 1.8, 1.5, '#E0E0E0'); // Snout
    addPart(hipX + 7, 0, 16.5 + headNod, 0.5, 0.5, 4, '#FFD700'); // Horn

    // Mane
    for (let i = 0; i < 4; i++) {
      addPart(hipX + 4 - i * 0.5, 0, 13 - i * 1.2, 1, 0.6, 2, '#FFA500');
    }

    // Front Legs (Rearing)
    addPart(hipX + 5, -2, 9 + legMove, 1, 1, 3.5, '#E0E0E0');
    addPart(hipX + 5, -2, 8.5 + legMove, 1.2, 1.2, 0.5, '#333333');
    addPart(hipX + 5, 2, 10 - legMove, 1, 1, 3.5, '#E0E0E0');
    addPart(hipX + 5, 2, 9.5 - legMove, 1.2, 1.2, 0.5, '#333333');

    // Tail
    const tailWag = Math.sin(this.frame * 0.15) * 1.5;
    addPart(hipX - 2, 0 + tailWag, 3, 2, 1, 1, '#FF69B4');
    addPart(hipX - 3.5, 0 + tailWag / 2, 2, 2, 1, 1, '#FF4500');
    addPart(hipX - 4.5, 0, 1, 2, 1, 1, '#FFD700');

    // Ninja Cat
    const catX = hipX + 1.5;
    const catZ = 8.5;
    addPart(catX, 0, catZ, 2.2, 2.5, 3, '#666666'); // Body
    addPart(catX, 0, catZ + 1.5, 2, 2.2, 1, '#DDDDDD');
    addPart(catX, 0, catZ + 3, 2.5, 2.5, 2.2, '#666666'); // Head
    addPart(catX, -0.8, catZ + 4.5, 0.6, 0.6, 1, '#666666'); // Ears
    addPart(catX, 0.8, catZ + 4.5, 0.6, 0.6, 1, '#666666');
    addPart(catX + 0.2, 0, catZ + 3.5, 2.6, 2.6, 0.6, '#FF0000'); // Bandana

    // Arms + Flag
    addPart(catX + 1, -1.2, catZ + 1.5, 1, 0.8, 0.8, '#666666');
    addPart(catX + 1.2, 1.5, catZ + 2.5, 1.5, 0.8, 0.8, '#666666');

    const poleX = catX + 1.5;
    const poleY = 2.0;
    const poleZ = catZ + 2.5;
    addPart(poleX, poleY, poleZ + 6, 0.2, 0.2, 12, '#8B4513'); // Pole

    const fZ = poleZ + 11;
    const wave = Math.sin(this.frame * 0.2) * 0.5;
    const flagS = 1.5;
    addPart(poleX - flagS / 2, poleY + wave, fZ, flagS, 0.1, flagS, '#F25022');
    addPart(poleX - flagS * 1.5, poleY + wave * 1.2, fZ, flagS, 0.1, flagS, '#7FBA00');
    addPart(poleX - flagS / 2, poleY + wave, fZ - flagS, flagS, 0.1, flagS, '#00A4EF');
    addPart(poleX - flagS * 1.5, poleY + wave * 1.2, fZ - flagS, flagS, 0.1, flagS, '#FFB900');

    // Fire Breath
    const mouthX = hipX + 8.5;
    const mouthZ = 13.5 + headNod;
    for (let i = 0; i < 5; i++) {
      const fAge = (this.frame + i * 8) % 40;
      const fProg = fAge / 40;
      const fX = mouthX + fAge * 0.5;
      const fY = (Math.sin(fAge * 0.5) * fAge * 0.1);
      const fZ = (mouthZ - fAge * 0.3) + (Math.cos(fAge) * 0.5);
      const fS = 1 + fProg * 2;
      if (fS > 0) {
        const color = i % 2 == 0 ? '#FF4500' : '#FFFF00';
        addPart(fX, fY, fZ, fS, fS, fS, color);
      }
    }

    parts.sort((a, b) => a.depth - b.depth);

    const s = this.scale * this.modelScale * 4;
    parts.forEach(p => {
      const isoX = (p.x - p.y) * 0.866 * s;
      const isoY = (p.x + p.y) * 0.5 * s - (p.z * s);
      const bw = p.w * s;
      const bd = p.d * s;
      const bh = p.h * s;
      this.drawIsoBox(isoX, isoY, bw, bd, bh, p.color);
    });

    this.ctx.restore();
  }

  animate() {
    if (!this.isActive) return;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

const initVoxelPet = () => {
  if (window.voxelPet) {
    window.voxelPet.isActive = false;
    if (window.voxelPet.canvas) window.voxelPet.canvas.remove();
  }
  window.voxelPet = new VoxelPet();
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initVoxelPet);
} else {
  initVoxelPet();
}
