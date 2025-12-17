// NinjaCat Token Website - Rainbow Internet Chaos Edition 🌈
// With SFX & BGM using Web Audio API

const CONTRACT_ADDRESS = 'E4FDbGBgFmk8BRkmfkGK5wUr4YzSqUyfmFHtgdVvpump';

// Gallery images
const galleryImages = [
    'ninjacat-hero.jpg',
    'G8Wzx0zbIAA10Q_.png',
    'G8XBzvTbcAAQztq.png',
    'CKd3z0zWsAAl77D.png',
    'CKg38WaVAAA-49O.png',
    'DSoC1wQX0AAU6X1.jpg',
    'DDf_3RvXoAAfCRZ.jpg',
    'G8W8G8RbMAAWimA.jpg',
    'G8W95ySa4AcWGhY.jpg',
    'G8XERuWbAAABr2F.png',
    'G8XFvArXEAYATHc.png',
    'G8XHGFla4AQATco.png',
    'G8XLdqia4AQWa7F.jpg',
    'G8XLutsXEAAnSUw.jpg',
    'G8XNGLnWUAEc1VB.jpg',
    'G8XObKCaoAAkM3x.jpg',
    'G8XQcxKa4Ao54vt.jpg',
    'G8XUWwGaQAAEmk7.jpg',
    'G8XWYxYa8AAYNIQ.jpg',
    'G8XXY7nWAAEkEJP.jpg',
    'G8Xe3hPXQAIMLXW.jpg',
    'G8XgpXva4AA8dfq.jpg',
    'G8XjjuVaIAA7NXf.jpg',
    'G8XtszNXQAIzVqz.png',
    'G8XweNDaEAACeCe.jpg',
    'G8Xy8s-WgAETflF.png',
    'G8XzvfKXYAUPEAQ.jpg',
    'G8YGtpzW8AER8xN.png',
    'G8YMEH9XoAEHxpX.jpg',
    'G8YNec-bMAAIWG7.jpg',
    'G8YNve0XcAAExBx.jpg',
    'mLKpBikZ.jpg'
];

// Rainbow colors
const rainbowColors = [
    '#FF6B9D', '#E040FB', '#A855F7', '#38BDF8',
    '#22D3EE', '#4ADE80', '#FACC15', '#FB923C', '#F43F5E'
];

// ===== AUDIO SYSTEM =====
class NinjaCatAudio {
    constructor() {
        this.audioContext = null;
        this.isMuted = false;
        this.bgmGain = null;
        this.sfxGain = null;
        this.bgmOscillators = [];
        this.isPlaying = false;
    }

    init() {
        if (this.audioContext) return;

        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Master gain nodes
            this.bgmGain = this.audioContext.createGain();
            this.bgmGain.gain.value = 0.15; // Low BGM volume
            this.bgmGain.connect(this.audioContext.destination);

            this.sfxGain = this.audioContext.createGain();
            this.sfxGain.gain.value = 0.3;
            this.sfxGain.connect(this.audioContext.destination);

            console.log('🎵 Audio system initialized!');
        } catch (e) {
            console.log('Audio not supported:', e);
        }
    }

    // Cheerful chiptune-style BGM
    startBGM() {
        if (!this.audioContext || this.isPlaying) return;
        this.isPlaying = true;

        // Cheerful melody notes (pentatonic scale for happy vibes)
        const melody = [
            { note: 392, duration: 0.2 },  // G4
            { note: 440, duration: 0.2 },  // A4
            { note: 523, duration: 0.2 },  // C5
            { note: 587, duration: 0.2 },  // D5
            { note: 659, duration: 0.4 },  // E5
            { note: 587, duration: 0.2 },  // D5
            { note: 523, duration: 0.2 },  // C5
            { note: 440, duration: 0.4 },  // A4
            { note: 392, duration: 0.2 },  // G4
            { note: 523, duration: 0.2 },  // C5
            { note: 659, duration: 0.3 },  // E5
            { note: 784, duration: 0.5 },  // G5
        ];

        const playMelody = () => {
            if (!this.isPlaying || this.isMuted) {
                setTimeout(() => playMelody(), 1000);
                return;
            }

            let time = this.audioContext.currentTime;

            melody.forEach((note, i) => {
                const osc = this.audioContext.createOscillator();
                const gain = this.audioContext.createGain();

                osc.type = 'square'; // Chiptune sound
                osc.frequency.value = note.note;

                gain.gain.setValueAtTime(0, time);
                gain.gain.linearRampToValueAtTime(0.08, time + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, time + note.duration * 0.9);
                gain.gain.linearRampToValueAtTime(0, time + note.duration);

                osc.connect(gain);
                gain.connect(this.bgmGain);

                osc.start(time);
                osc.stop(time + note.duration);

                time += note.duration;
            });

            // Add bass line
            const bassNotes = [196, 220, 262, 294]; // G3, A3, C4, D4
            let bassTime = this.audioContext.currentTime;

            for (let i = 0; i < 4; i++) {
                const bassOsc = this.audioContext.createOscillator();
                const bassGain = this.audioContext.createGain();

                bassOsc.type = 'triangle';
                bassOsc.frequency.value = bassNotes[i % 4];

                bassGain.gain.setValueAtTime(0.05, bassTime);
                bassGain.gain.exponentialRampToValueAtTime(0.01, bassTime + 0.8);

                bassOsc.connect(bassGain);
                bassGain.connect(this.bgmGain);

                bassOsc.start(bassTime);
                bassOsc.stop(bassTime + 0.8);

                bassTime += 0.8;
            }

            // Loop every 3.2 seconds
            setTimeout(() => playMelody(), 3200);
        };

        playMelody();
    }

    stopBGM() {
        this.isPlaying = false;
    }

    // SFX: Hover sound (quick blip)
    playHover() {
        if (!this.audioContext || this.isMuted) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sine';
        osc.frequency.value = 800 + Math.random() * 400;

        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.1);
    }

    // SFX: Click sound (pop)
    playClick() {
        if (!this.audioContext || this.isMuted) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'square';
        osc.frequency.setValueAtTime(600, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(200, this.audioContext.currentTime + 0.15);

        gain.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.15);
    }

    // SFX: Success/Copy sound (happy arpeggio)
    playSuccess() {
        if (!this.audioContext || this.isMuted) return;

        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        let time = this.audioContext.currentTime;

        notes.forEach((freq, i) => {
            const osc = this.audioContext.createOscillator();
            const gain = this.audioContext.createGain();

            osc.type = 'square';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, time);
            gain.gain.linearRampToValueAtTime(0.15, time + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);

            osc.connect(gain);
            gain.connect(this.sfxGain);

            osc.start(time);
            osc.stop(time + 0.2);

            time += 0.08;
        });
    }

    // SFX: Rainbow magic sound (sweep)
    playRainbow() {
        if (!this.audioContext || this.isMuted) return;

        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, this.audioContext.currentTime);
        osc.frequency.exponentialRampToValueAtTime(2000, this.audioContext.currentTime + 0.3);
        osc.frequency.exponentialRampToValueAtTime(500, this.audioContext.currentTime + 0.5);

        gain.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start();
        osc.stop(this.audioContext.currentTime + 0.5);
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.bgmGain) {
            this.bgmGain.gain.value = this.isMuted ? 0 : 0.15;
        }
        if (this.sfxGain) {
            this.sfxGain.gain.value = this.isMuted ? 0 : 0.3;
        }
        return this.isMuted;
    }
}

// Global audio instance
const audio = new NinjaCatAudio();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    createRainbowStars();
    populateGallery();
    setupCopyButtons();
    setupScrollAnimations();
    setupMobileMenu();
    setupAudioControls();
    setupInteractiveSounds();
    setupPriceTicker();

    // Create audio toggle button
    createAudioToggle();
});

// Animate price ticker with random fluctuations
// Animate price ticker with real data from DexScreener
function setupPriceTicker() {
    const priceEl = document.getElementById('tickerPrice');
    const changeEl = document.getElementById('tickerChange');
    const changeWrap = document.getElementById('tickerChangeWrap');
    const mcapEl = document.getElementById('tickerMcap');
    const volumeEl = document.getElementById('tickerVolume');

    if (!priceEl) return;

    async function updateTicker() {
        try {
            const response = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${CONTRACT_ADDRESS}`);
            const data = await response.json();

            if (!data.pairs || data.pairs.length === 0) return;

            // Get the most liquid pair (usually the first one)
            const pair = data.pairs[0];

            // Price
            const price = parseFloat(pair.priceUsd);
            priceEl.textContent = '$' + price.toFixed(8); // 8 decimals for meme coins

            // 24h Change
            const change24h = pair.priceChange.h24;
            const isPositive = change24h >= 0;
            changeEl.textContent = (isPositive ? '+' : '') + change24h.toFixed(2) + '%';
            changeWrap.className = 'ticker-item ticker-change ' + (isPositive ? 'positive' : 'negative');

            // Market Cap (FDV)
            if (mcapEl) {
                const mcap = pair.fdv;
                if (mcap >= 1000000) {
                    mcapEl.textContent = '$' + (mcap / 1000000).toFixed(2) + 'M';
                } else if (mcap >= 1000) {
                    mcapEl.textContent = '$' + (mcap / 1000).toFixed(2) + 'K';
                } else {
                    mcapEl.textContent = '$' + mcap.toFixed(2);
                }
            }

            // 24h Volume
            if (volumeEl) {
                const volume = pair.volume.h24;
                if (volume >= 1000000) {
                    volumeEl.textContent = '$' + (volume / 1000000).toFixed(2) + 'M';
                } else if (volume >= 1000) {
                    volumeEl.textContent = '$' + (volume / 1000).toFixed(2) + 'K';
                } else {
                    volumeEl.textContent = '$' + volume.toFixed(2);
                }
            }

        } catch (error) {
            console.warn('Failed to fetch price data:', error);
            // Keep existing values or show placeholders if error
        }
    }

    // Initial update
    updateTicker();
    // Update every 30 seconds
    setInterval(updateTicker, 30000);
}

// Create audio toggle button
function createAudioToggle() {
    const btn = document.createElement('button');
    btn.id = 'audioToggle';
    btn.innerHTML = '🔊';
    btn.title = 'Click to enable audio, then toggle mute';
    btn.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: linear-gradient(135deg, #A855F7, #38BDF8);
    border: 3px solid #FF6B9D;
    color: white;
    font-size: 1.5rem;
    cursor: pointer;
    z-index: 1000;
    box-shadow: 0 0 20px rgba(168, 85, 247, 0.5);
    transition: all 0.3s;
  `;

    btn.addEventListener('click', () => {
        if (!audio.audioContext) {
            audio.init();
            audio.startBGM();
            audio.playSuccess();
            btn.innerHTML = '🔊';
            btn.title = 'Mute audio';
        } else {
            const muted = audio.toggleMute();
            btn.innerHTML = muted ? '🔇' : '🔊';
            btn.title = muted ? 'Unmute audio' : 'Mute audio';
        }
    });

    btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.1)';
    });

    btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
    });

    document.body.appendChild(btn);
}

// Setup audio on first interaction
function setupAudioControls() {
    const initAudioOnce = () => {
        if (!audio.audioContext) {
            audio.init();
        }
        document.removeEventListener('click', initAudioOnce);
    };
    document.addEventListener('click', initAudioOnce);
}

// Setup interactive sounds for UI elements
function setupInteractiveSounds() {
    // Hover sounds for interactive elements
    const hoverElements = document.querySelectorAll('.btn, .community-card, .token-card, .gallery-item, .lore-item, .nav-links a, .copy-btn');

    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            audio.playHover();
        });
    });

    // Click sounds for buttons
    const clickElements = document.querySelectorAll('.btn, .community-card, .copy-btn, .mobile-menu-btn');

    clickElements.forEach(el => {
        el.addEventListener('click', () => {
            audio.playClick();
        });
    });
}

// Create rainbow-colored stars background
function createRainbowStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;

    const starCount = 120;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.className = 'star';

        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';

        const size = Math.random() * 3 + 1;
        star.style.width = size + 'px';
        star.style.height = size + 'px';

        if (Math.random() > 0.6) {
            star.classList.add('rainbow');
            const color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
            star.style.background = color;
            star.style.boxShadow = `0 0 ${size * 3}px ${color}`;
        }

        star.style.animationDelay = Math.random() * 3 + 's';
        star.style.animationDuration = (Math.random() * 2 + 1.5) + 's';

        starsContainer.appendChild(star);
    }
}

// Setup mobile menu
function setupMobileMenu() {
    const btn = document.getElementById('mobileMenuBtn');
    const menu = document.getElementById('mobileMenu');

    if (!btn || !menu) return;

    btn.addEventListener('click', () => {
        menu.classList.toggle('active');
        btn.textContent = menu.classList.contains('active') ? '✕' : '☰';
        audio.playClick();
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            menu.classList.remove('active');
            btn.textContent = '☰';
        });
    });
}

// Populate gallery
function populateGallery() {
    const galleryGrid = document.getElementById('galleryGrid');
    if (!galleryGrid) return;

    galleryImages.forEach((imageName, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.style.animationDelay = (index * 0.05) + 's';

        const img = document.createElement('img');
        img.src = '/' + imageName;
        img.alt = 'NinjaCat meme ' + (index + 1);
        img.loading = 'lazy';

        item.addEventListener('click', () => {
            audio.playClick();
            openLightbox(imageName);
        });

        item.appendChild(img);
        galleryGrid.appendChild(item);
    });
}

// Rainbow lightbox
function openLightbox(imageName) {
    audio.playRainbow();

    const lightbox = document.createElement('div');
    lightbox.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(15, 8, 32, 0.95);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 3000;
    cursor: pointer;
    animation: fadeIn 0.3s ease;
    backdrop-filter: blur(10px);
  `;

    const container = document.createElement('div');
    container.style.cssText = `
    position: relative;
    padding: 8px;
    background: linear-gradient(90deg, #FF6B9D, #A855F7, #38BDF8, #4ADE80, #FACC15, #FB923C, #F43F5E);
    background-size: 400% 400%;
    animation: rainbow-move 3s linear infinite;
    border-radius: 20px;
  `;

    const img = document.createElement('img');
    img.src = '/' + imageName;
    img.style.cssText = `
    max-width: 85vw;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 16px;
    display: block;
  `;

    container.appendChild(img);
    lightbox.appendChild(container);
    document.body.appendChild(lightbox);
    document.body.style.overflow = 'hidden';

    lightbox.addEventListener('click', () => {
        audio.playClick();
        lightbox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            lightbox.remove();
            document.body.style.overflow = '';
        }, 300);
    });

    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            lightbox.click();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Rainbow confetti RAIN from top of screen
function createRainbowConfetti() {
    const confettiContainer = document.getElementById('confetti');
    if (!confettiContainer) return;

    const confettiCount = 80; // More pieces for rain effect

    for (let i = 0; i < confettiCount; i++) {
        // Stagger the creation for rain effect
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti-piece';

            const color = rainbowColors[Math.floor(Math.random() * rainbowColors.length)];
            const size = Math.random() * 12 + 6;
            const startX = Math.random() * window.innerWidth; // Random X across screen
            const drift = (Math.random() - 0.5) * 100; // Slight horizontal drift
            const rotation = Math.random() * 720;
            const duration = 2 + Math.random() * 2; // 2-4 seconds to fall

            // Different shapes: circles, squares, rectangles
            const shapes = ['50%', '0', '0'];
            const shape = shapes[Math.floor(Math.random() * shapes.length)];
            const aspectRatio = Math.random() > 0.5 ? 1 : 0.5;

            confetti.style.cssText = `
                position: fixed;
                left: ${startX}px;
                top: -20px;
                width: ${size}px;
                height: ${size * aspectRatio}px;
                background: ${color};
                border-radius: ${shape};
                box-shadow: 0 0 ${size}px ${color};
                pointer-events: none;
                z-index: 9999;
            `;

            confettiContainer.appendChild(confetti);

            // Animate falling with physics
            const startTime = performance.now();
            const fallSpeed = 400 + Math.random() * 300; // pixels per second

            function animateRain(currentTime) {
                const elapsed = (currentTime - startTime) / 1000;

                // Calculate position
                const posY = elapsed * fallSpeed;
                const posX = Math.sin(elapsed * 3) * drift; // Wavy horizontal movement
                const rot = rotation * elapsed;

                // Fade out near bottom
                const opacity = Math.max(0, 1 - (posY / window.innerHeight) * 0.8);

                confetti.style.transform = `translate(${posX}px, ${posY}px) rotate(${rot}deg)`;
                confetti.style.opacity = opacity;

                // Continue until off screen
                if (posY < window.innerHeight + 50 && opacity > 0) {
                    requestAnimationFrame(animateRain);
                } else {
                    confetti.remove();
                }
            }

            requestAnimationFrame(animateRain);
        }, i * 25); // Stagger each piece by 25ms for rain effect
    }
}


// Setup copy buttons with confetti
function setupCopyButtons() {
    const caBox = document.getElementById('caBox');
    const footerCopyBtn = document.getElementById('footerCopyBtn');

    const copyWithConfetti = async (e) => {
        try {
            await navigator.clipboard.writeText(CONTRACT_ADDRESS);

            // Play success sound
            audio.playSuccess();
            audio.playRainbow();

            // Create rainbow confetti rain from top
            createRainbowConfetti();

            // Show toast
            showToast();

        } catch (err) {
            const textarea = document.createElement('textarea');
            textarea.value = CONTRACT_ADDRESS;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);

            audio.playSuccess();
            createRainbowConfetti();
            showToast();
        }
    };

    if (caBox) {
        caBox.addEventListener('click', copyWithConfetti);
    }

    if (footerCopyBtn) {
        footerCopyBtn.addEventListener('click', copyWithConfetti);
    }
}


// Show rainbow toast
function showToast() {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 2500);
}

// Scroll animations
function setupScrollAnimations() {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
    
    .animate-on-scroll {
      opacity: 0;
      transform: translateY(30px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .animate-on-scroll.visible {
      opacity: 1;
      transform: translateY(0);
    }
  `;
    document.head.appendChild(style);

    const animatedElements = document.querySelectorAll(
        '.lore-item, .token-card, .community-card, .gallery-item'
    );

    animatedElements.forEach((el, index) => {
        el.classList.add('animate-on-scroll');
        el.style.transitionDelay = (index % 6) * 0.1 + 's';
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    animatedElements.forEach(el => observer.observe(el));
}

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        audio.playClick();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

console.log('🐱‍👤 NinjaCat loaded! Welcome to the Internet! 🌈🦄🔥');
console.log('🎵 Click the sound button to enable audio!');
