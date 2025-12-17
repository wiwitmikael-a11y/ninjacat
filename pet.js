```javascript
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
    this.bobOffset = 0;
    this.rearAngle = 0;
    
    // Voxel settings
    this.scale = 3.5; // Size of pixel
    this.modelScale = 1.0;
    
    this.wanderTarget = { x: 200, y: 200 };
    this.wanderTimer = 0;
    
    this.init();
  }
  
  init() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'voxelPet';
    this.canvas.style.cssText = `
position: fixed;
top: 0;
left: 0;
width: 100 %;
height: 100 %;
pointer - events: none;
z - index: 9998;
`;
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
    // Bobbing motion for flying/galloping feel
    this.bobOffset = Math.sin(this.frame * 0.1) * 3;
    // Rearing angle stability
    this.rearAngle = Math.sin(this.frame * 0.05) * 0.1; 
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
  
  // Renders a box at sorted position
  drawIsoBox(ox, oy, w, d, h, color) {
    const ctx = this.ctx;
    
    const cTop = this.adjustColor(color, 30);
    const cRight = this.adjustColor(color, -10);
    const cLeft = this.adjustColor(color, -40);
    
    // Isometric vectors
    const cos30 = 0.866;
    const sin30 = 0.5;
    
    const wx = w * cos30;
    const wy = w * sin30;
    
    const dx = -d * cos30;
    const dy = d * sin30;
    
    const hx = 0;
    const hy = -h;
    
    // Left Face
    ctx.fillStyle = cLeft;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + dx, oy + dy);
    ctx.lineTo(ox + dx + hx, oy + dy + hy);
    ctx.lineTo(ox + hx, oy + hy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke(); 
    
    // Right Face
    ctx.fillStyle = cRight;
    ctx.beginPath();
    ctx.moveTo(ox, oy);
    ctx.lineTo(ox + wx, oy + wy);
    ctx.lineTo(ox + wx + hx, oy + wy + hy);
    ctx.lineTo(ox + hx, oy + hy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    
    // Top Face
    ctx.fillStyle = cTop;
    ctx.beginPath();
    ctx.moveTo(ox + hx, oy + hy);
    ctx.lineTo(ox + hx + dx, oy + hy + dy);
    ctx.lineTo(ox + hx + dx + wx, oy + hy + dy + wy);
    ctx.lineTo(ox + hx + wx, oy + hy + wy);
    ctx.closePath();
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
    
    // Build Model Parts
    let parts = [];
    
    const addPart = (x, y, z, w, d, h, color) => {
        // Transform X based on direction
        const tx = x * this.direction;
        // Depth Sort Key
        // Facing Right (dir=1): +X is Closer, -X is Farther (Tail) -- NO.
        // Screen Y increases with (x+y). 
        // We want Painter's Algo: Smallest (x+y) drawn first.
        const sortKey = (tx + y) * 10 + z * 0.1; // Bias Z slightly to avoid flickering
        parts.push({ x: tx, y, z, w, d, h, color, depth: sortKey });
    };
    
    // === REARING UNICORN ANIMATION ===
    // Reference: Standing on back legs. Body angled up.
    
    const rearLift = 4; // Height body is lifted relative to hips
    const hipX = -2;   // Hips pushed back
    
    const legMove = Math.sin(this.frame * 0.2) * 1;
    const headNod = Math.sin(this.frame * 0.1) * 0.5;
    
    // 1. LEFT BACK LEG (On Ground)
    // Anchored at bottom
    addPart(hipX + -1, -2, 0, 1.5, 1.5, 4, '#E0E0E0');
    addPart(hipX + -1, -2, -0.5, 1.8, 1.8, 0.5, '#333333'); // Hoof
    
    // 2. RIGHT BACK LEG (On Ground)
    addPart(hipX + -1, 2, 0, 1.5, 1.5, 4, '#E0E0E0');
    addPart(hipX + -1, 2, -0.5, 1.8, 1.8, 0.5, '#333333'); // Hoof
    
    // 3. BODY (Angled Upwards)
    // Simulated diagonal by stacking blocks
    // Hips
    addPart(hipX, 0, 3.5, 3, 3, 3.5, '#FFFFFF');
    // Mid torso (Higher & Forward)
    addPart(hipX + 2, 0, 6, 2.5, 2.8, 3.5, '#FFFFFF');
    // Upper torso / Chest (Higher & Forward)
    addPart(hipX + 3.5, 0, 8, 3, 3, 4, '#FFFFFF');
    
    // 4. NECK (Vertical)
    addPart(hipX + 4, 0, 11, 2, 2, 3, '#FFFFFF');
    addPart(hipX + 4.5, 0, 13, 2, 1.8, 2, '#FFFFFF');
    
    // 5. HEAD
    addPart(hipX + 6, 0, 14.5 + headNod, 3, 2.2, 2.5, '#FFFFFF');
    // Snout
    addPart(hipX + 7.5, 0, 14 + headNod, 1.5, 1.8, 1.5, '#E0E0E0');
    
    // 6. HORN (Golden Spiral)
    addPart(hipX + 7, 0, 16.5 + headNod, 0.5, 0.5, 4, '#FFD700');
    
    // 7. MANE (Golden Fire)
    // Flowing backwards
    for(let i=0; i<4; i++) {
        addPart(hipX + 4 - i*0.5, 0, 13 - i*1.2, 1, 0.6, 2, '#FFA500');
    }
    
    // 8. FRONT LEGS (Waving in Air)
    // Front Left
    addPart(hipX + 5, -2, 9 + legMove, 1, 1, 3.5, '#E0E0E0');
    addPart(hipX + 5, -2, 8.5 + legMove, 1.2, 1.2, 0.5, '#333333'); // Hoof
    
    // Front Right
    addPart(hipX + 5, 2, 10 - legMove, 1, 1, 3.5, '#E0E0E0');
    addPart(hipX + 5, 2, 9.5 - legMove, 1.2, 1.2, 0.5, '#333333'); // Hoof
    
    // 9. TAIL (Flowing Groundward)
    const tailWag = Math.sin(this.frame * 0.15) * 1.5;
    addPart(hipX - 2, 0 + tailWag, 3, 2, 1, 1, '#FF69B4');
    addPart(hipX - 3.5, 0 + tailWag/2, 2, 2, 1, 1, '#FF4500');
    addPart(hipX - 4.5, 0, 1, 2, 1, 1, '#FFD700');
    
    // === NINJA CAT ===
    // Riding "piggyback" on the upper torso (approx x=2, z=9)
    const catX = hipX + 1.5;
    const catZ = 8.5;
    
    // Cat Body
    addPart(catX, 0, catZ, 2.2, 2.5, 3, '#666666'); // Dark Gray Body
    addPart(catX, 0, catZ + 1.5, 2, 2.2, 1, '#DDDDDD'); // White Chest Patch
    
    // Cat Head
    addPart(catX, 0, catZ + 3, 2.5, 2.5, 2.2, '#666666');
    // Ears
    addPart(catX, -0.8, catZ + 4.5, 0.6, 0.6, 1, '#666666');
    addPart(catX, 0.8, catZ + 4.5, 0.6, 0.6, 1, '#666666');
    
    // Red Bandana (Ninja)
    addPart(catX + 0.2, 0, catZ + 3.5, 2.6, 2.6, 0.6, '#FF0000');
    // Bandana Knot (Flowing back)
    const knotWag = Math.sin(this.frame * 0.3) * 0.5;
    addPart(catX - 1.5, 0 + knotWag, catZ + 3.5, 1.5, 0.5, 0.5, '#FF0000');
    
    // Arms
    // Left Arm (Holding on)
    addPart(catX + 1, -1.2, catZ + 1.5, 1, 0.8, 0.8, '#666666');
    // Right Arm (Holding Flag)
    addPart(catX + 1.2, 1.5, catZ + 2.5, 1.5, 0.8, 0.8, '#666666');
    
    // === FLAG ===
    // Held by Right Arm
    const poleX = catX + 1.5;
    const poleY = 2.0;
    const poleZ = catZ + 2.5;
    
    // Pole
    addPart(poleX, poleY, poleZ + 6, 0.2, 0.2, 12, '#8B4513');
    
    // MSFT Flag (Waving)
    // 4 Squares: Red (TL), Green (TR), Blue (BL), Yellow (BR)
    // Flag is attached to top of pole (z ~ poleZ + 10)
    const fZ = poleZ + 11;
    const wave = Math.sin(this.frame * 0.2) * 0.5;
    
    // The flag should fly "Backward" relative to motion
    // Assuming motion is forward (+X), flag flies -X.
    // Top-Left (Red)
    addPart(poleX - 1.5, poleY + wave, fZ, 3, 0.2, 2, '#F25022');
    // Top-Right (Green) -> Actually Bottom on flag? No:
    // MS Window Logo:
    // Red   Green
    // Blue  Yellow
    // Rendered flat-ish on Z plane? No, vertical flag.
    // Let's stack them Z and X.
    
    // Red (Top Back)
    addPart(poleX - 1.5, poleY + wave, fZ, 1.5, 0.1, 1.5, '#F25022');
    // Green (Top Front relative to simple square? No, usually side-by-side)
    // Let's make a 2x2 grid on the X/Z plane?
    // Reference shows flag flying back.
    // Red (Top Left), Green (Top Right).
    // Blue (Bottom Left), Yellow (Bottom Right).
    
    // Actually simpler:
    // Red | Green
    // -----------
    // Blue| Yellow
    
    const flagS = 1.5; // Size of quadrant
    // Red (Top, Near Pole)
    addPart(poleX - flagS/2, poleY + wave, fZ, flagS, 0.1, flagS, '#F25022');
    // Green (Top, Far)
    addPart(poleX - flagS*1.5, poleY + wave*1.2, fZ, flagS, 0.1, flagS, '#7FBA00');
    // Blue (Bottom, Near Pole)
    addPart(poleX - flagS/2, poleY + wave, fZ - flagS, flagS, 0.1, flagS, '#00A4EF');
    // Yellow (Bottom, Far)
    addPart(poleX - flagS*1.5, poleY + wave*1.2, fZ - flagS, flagS, 0.1, flagS, '#FFB900');
    
    // === FIRE BREATH ===
    // Emitted from Snout (hipX + 8, 0, 14)
    const mouthX = hipX + 8.5;
    const mouthZ = 13.5 + headNod;
    
    for(let i=0; i<5; i++) {
        const fAge = (this.frame + i*8) % 40;
        const fProg = fAge / 40;
        const fX = mouthX + fAge * 0.5; // Move forward
        const fY = (Math.sin(fAge * 0.5) * fAge * 0.1); // Spread Y
        const fZ = (mouthZ - fAge * 0.3) + (Math.cos(fAge)*0.5); // Drop slightly
        const fS = 1 + fProg * 2; // Grow
        
        if (fS > 0) {
            const color = i%2==0 ? '#FF4500' : '#FFFF00';
             addPart(fX, fY, fZ, fS, fS, fS, color);
        }
    }
    
    // === SORT & DRAW ===
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
    this.ctx.restore();
  }

  animate() {
    if (!this.isActive) return;
    this.update();
    this.draw();
    requestAnimationFrame(() => this.animate());
  }
}

document.addEventListener('DOMContentLoaded', () => { 
  if (window.voxelPet) {
      window.voxelPet.isActive = false;
      if (window.voxelPet.canvas) window.voxelPet.canvas.remove();
  }
  window.voxelPet = new VoxelPet(); 
});
