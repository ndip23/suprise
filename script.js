/* ==========================================================================
   FOR BLESSING - INTERACTIVE JAVASCRIPT & AUDIO ENGINE
   Created with Love by Samuel
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // 1. INITIALIZE CONFIG & UI DATA
    initPersonalizedData();

    // 2. START FLOATING HEARTS CANVAS
    initHeartCanvas();

    // 3. START LIVE TIMER
    startRelationshipTimer();

    // 4. SETUP ENVELOPE INTERACTION
    initEnvelope();

    // 5. SETUP REASONS & GALLERY
    renderReasons();
    renderGallery();

    // 6. SETUP COUPONS
    renderCoupons();

    // 7. SETUP LOVE SLIDER & PLAYFUL DODGING BUTTON
    initLoveMeter();
    initDodgingNoButton();

    // 8. SETUP WEB AUDIO ROMANTIC SYNTH
    initMusicSynth();

    // 9. SETUP QUICK KISS BUTTON
    initKissButton();
});


/* --------------------------------------------------------------------------
   1. PERSONALIZATION SETUP
   -------------------------------------------------------------------------- */
function initPersonalizedData() {
    if (typeof CONFIG === 'undefined') return;

    // Set Header & Names
    const herNameHeading = document.getElementById('herNameHeading');
    const heroSubtitle = document.getElementById('heroSubtitle');
    const footerBoyfriend = document.getElementById('footerBoyfriend');
    const footerGirlfriend = document.getElementById('footerGirlfriend');

    if (herNameHeading) herNameHeading.textContent = CONFIG.girlfriendName;
    if (heroSubtitle) heroSubtitle.textContent = CONFIG.heroSubtitle;
    if (footerBoyfriend) footerBoyfriend.textContent = CONFIG.boyfriendName;
    if (footerGirlfriend) footerGirlfriend.textContent = CONFIG.girlfriendName;

    // Love Letter Text
    document.getElementById('letterSalutation').textContent = CONFIG.loveLetter.salutation;
    document.getElementById('letterP1').textContent = CONFIG.loveLetter.paragraph1;
    document.getElementById('letterP2').textContent = CONFIG.loveLetter.paragraph2;
    document.getElementById('letterP3').textContent = CONFIG.loveLetter.paragraph3;
    document.getElementById('letterValediction').textContent = CONFIG.loveLetter.valediction;
    document.getElementById('letterSignature').textContent = CONFIG.loveLetter.signature;

    // Current Date string
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('currentDateStr').textContent = new Date().toLocaleDateString('en-US', options);

    // Quiz Question
    document.getElementById('quizQuestion').textContent = CONFIG.quiz.question;
}


/* --------------------------------------------------------------------------
   2. FLOATING HEARTS & SPARKLES CANVAS
   -------------------------------------------------------------------------- */
function initHeartCanvas() {
    const canvas = document.getElementById('heartCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 35;
    const colors = ['#ff4b72', '#ff758c', '#ff7eb3', '#ffd700', '#ffffff'];

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = height + Math.random() * 100;
            this.size = Math.random() * 14 + 8;
            this.speedY = Math.random() * 1.5 + 0.5;
            this.speedX = Math.sin(Math.random() * Math.PI) * 0.8;
            this.opacity = Math.random() * 0.6 + 0.2;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.rotation = Math.random() * Math.PI * 2;
            this.rotSpeed = (Math.random() - 0.5) * 0.03;
            this.type = Math.random() > 0.3 ? 'heart' : 'sparkle';
        }

        update() {
            this.y -= this.speedY;
            this.x += Math.sin(this.y * 0.01) * 0.5;
            this.rotation += this.rotSpeed;

            if (this.y < -20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotation);
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;

            if (this.type === 'heart') {
                ctx.beginPath();
                const topCurveHeight = this.size * 0.3;
                ctx.moveTo(0, topCurveHeight);
                ctx.bezierCurveTo(0, 0, -this.size / 2, 0, -this.size / 2, topCurveHeight);
                ctx.bezierCurveTo(-this.size / 2, (this.size + topCurveHeight) / 2, 0, this.size, 0, this.size);
                ctx.bezierCurveTo(0, this.size, this.size / 2, (this.size + topCurveHeight) / 2, this.size / 2, topCurveHeight);
                ctx.bezierCurveTo(this.size / 2, 0, 0, 0, 0, topCurveHeight);
                ctx.closePath();
                ctx.fill();
            } else {
                // Sparkle
                ctx.beginPath();
                ctx.arc(0, 0, this.size / 3, 0, Math.PI * 2);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();
}


/* --------------------------------------------------------------------------
   3. LIVE RELATIONSHIP TIMER
   -------------------------------------------------------------------------- */
function startRelationshipTimer() {
    const startDate = new Date(CONFIG.startDate || '2024-01-01T00:00:00');
    
    function updateTimer() {
        const now = new Date();
        const diff = Math.max(0, now - startDate);

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        document.getElementById('timerDays').textContent = String(days).padStart(2, '0');
        document.getElementById('timerHours').textContent = String(hours).padStart(2, '0');
        document.getElementById('timerMinutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('timerSeconds').textContent = String(seconds).padStart(2, '0');
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}


/* --------------------------------------------------------------------------
   4. ENVELOPE OPENING LOGIC
   -------------------------------------------------------------------------- */
function initEnvelope() {
    const envelope = document.getElementById('envelopeCard');
    const seal = document.getElementById('envelopeSeal');

    if (!envelope) return;

    function toggleEnvelope() {
        envelope.classList.toggle('open');
        if (envelope.classList.contains('open') && typeof confetti === 'function') {
            confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
            });
        }
    }

    envelope.addEventListener('click', (e) => {
        // Toggle if clicked on flap or seal
        if (e.target.closest('#envelopeSeal') || !envelope.classList.contains('open')) {
            toggleEnvelope();
        }
    });
}


/* --------------------------------------------------------------------------
   5. REASONS & GALLERY RENDERING
   -------------------------------------------------------------------------- */
function renderReasons() {
    const grid = document.getElementById('reasonsGrid');
    if (!grid || !CONFIG.reasons) return;

    grid.innerHTML = CONFIG.reasons.map(r => `
        <div class="flip-card">
            <div class="flip-card-inner">
                <div class="flip-card-front">
                    <div class="card-icon">${r.icon}</div>
                    <h3>${r.title}</h3>
                    <span class="card-hint">Hover or tap to reveal 💖</span>
                </div>
                <div class="flip-card-back">
                    <p>${r.text}</p>
                </div>
            </div>
        </div>
    `).join('');

    // Touch click support for mobile
    document.querySelectorAll('.flip-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
}

function renderGallery() {
    const grid = document.getElementById('galleryGrid');
    if (!grid || !CONFIG.gallery) return;

    grid.innerHTML = CONFIG.gallery.map((item, index) => `
        <div class="polaroid-card" onclick="openPhotoModal('${item.url}', '${item.title.replace(/'/g, "\\'")}', '${item.caption.replace(/'/g, "\\'")}')">
            <div class="polaroid-img-wrapper">
                <img src="${item.url}" alt="${item.title}" loading="lazy">
            </div>
            <div class="polaroid-caption">
                <h4>${item.title}</h4>
                <p>${item.caption}</p>
            </div>
        </div>
    `).join('');
}

function openPhotoModal(url, title, caption) {
    const modal = document.getElementById('photoModal');
    document.getElementById('modalImage').src = url;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalCaption').textContent = caption;
    modal.classList.add('active');
}

document.getElementById('modalClose')?.addEventListener('click', () => {
    document.getElementById('photoModal').classList.remove('active');
});

document.getElementById('photoModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'photoModal') {
        document.getElementById('photoModal').classList.remove('active');
    }
});


/* --------------------------------------------------------------------------
   6. LOVE COUPONS REDEMPTION
   -------------------------------------------------------------------------- */
function renderCoupons() {
    const grid = document.getElementById('couponsGrid');
    if (!grid || !CONFIG.coupons) return;

    grid.innerHTML = CONFIG.coupons.map(c => `
        <div class="coupon-card" id="coupon-${c.id}">
            <span class="coupon-badge">${c.badge}</span>
            <h3>${c.title}</h3>
            <p>${c.desc}</p>
            <button class="redeem-btn" onclick="redeemCoupon(${c.id})">
                <i class="fas fa-gift"></i> Redeem Coupon
            </button>
            <div class="redeemed-stamp">REDEEMED FOR SAMUEL</div>
        </div>
    `).join('');
}

function redeemCoupon(id) {
    const card = document.getElementById(`coupon-${id}`);
    if (card && !card.classList.contains('redeemed')) {
        card.classList.add('redeemed');
        
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }
}


/* --------------------------------------------------------------------------
   7. LOVE SLIDER & DODGING "NO" BUTTON
   -------------------------------------------------------------------------- */
function initLoveMeter() {
    const slider = document.getElementById('loveSlider');
    const percentText = document.getElementById('lovePercentage');
    const reactionText = document.getElementById('meterReaction');

    if (!slider) return;

    slider.addEventListener('input', (e) => {
        const val = e.target.value;
        percentText.textContent = val === '100' ? '100,000' : val * 100;

        if (val > 80) {
            reactionText.textContent = "Warning: Excess love detected! 💕🔥";
        } else if (val > 50) {
            reactionText.textContent = "Growing warmer and sweeter every second! 🥰";
        } else {
            reactionText.textContent = "Nice try! But Samuel knows you love him 1000%! 😜";
        }
    });
}

function initDodgingNoButton() {
    const noBtn = document.getElementById('noBtn');
    const yesBtn = document.getElementById('yesBtn');
    const card = document.getElementById('proposalCard');
    const yesModal = document.getElementById('yesModal');
    const yesModalClose = document.getElementById('yesModalClose');

    if (!noBtn || !card) return;

    let dodgeCount = 0;

    function moveNoBtn() {
        dodgeCount++;
        const cardRect = card.getBoundingClientRect();
        const btnRect = noBtn.getBoundingClientRect();

        const maxX = cardRect.width - btnRect.width - 40;
        const maxY = cardRect.height - btnRect.height - 40;

        const randomX = Math.floor(Math.random() * maxX) - (maxX / 2);
        const randomY = Math.floor(Math.random() * maxY) - (maxY / 2);

        noBtn.style.position = 'relative';
        noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;

        if (dodgeCount > 3) {
            noBtn.textContent = "You can't click me! 😜";
        }
        if (dodgeCount > 6) {
            noBtn.textContent = "Just click YES! 💕";
        }
    }

    noBtn.addEventListener('mouseover', moveNoBtn);
    noBtn.addEventListener('click', moveNoBtn);

    yesBtn?.addEventListener('click', () => {
        yesModal.classList.add('active');
        document.getElementById('yesModalTitle').textContent = CONFIG.quiz.yesResponseTitle || "YAYYY!";
        document.getElementById('yesModalText').textContent = CONFIG.quiz.yesResponseText || "Samuel loves you!";

        if (typeof confetti === 'function') {
            const count = 200;
            const defaults = { origin: { y: 0.7 } };

            function fire(particleRatio, opts) {
                confetti(Object.assign({}, defaults, opts, {
                    particleCount: Math.floor(count * particleRatio)
                }));
            }

            fire(0.25, { spread: 26, startVelocity: 55 });
            fire(0.2, { spread: 60 });
            fire(0.35, { spread: 100, decay: 0.91, scalar: 0.8 });
            fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
            fire(0.1, { spread: 120, startVelocity: 45 });
        }
    });

    yesModalClose?.addEventListener('click', () => {
        yesModal.classList.remove('active');
    });
}


/* --------------------------------------------------------------------------
   8. ROMANTIC MUSIC SYNTH (WEB AUDIO API)
   -------------------------------------------------------------------------- */
function initMusicSynth() {
    const btn = document.getElementById('musicToggleBtn');
    const status = document.getElementById('musicStatus');
    let audioCtx = null;
    let isPlaying = false;
    let intervalId = null;

    // Romantic Chords (Frequency arrays in Hz)
    const chords = [
        [261.63, 329.63, 392.00, 493.88], // Cmaj7
        [220.00, 261.63, 329.63, 392.00], // Am7
        [174.61, 220.00, 261.63, 349.23], // Fmaj7
        [196.00, 246.94, 293.66, 392.00]  // G7
    ];

    function playRomanticChord(chordIndex) {
        if (!audioCtx) return;

        const chord = chords[chordIndex % chords.length];
        chord.forEach((freq, i) => {
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            const filter = audioCtx.createBiquadFilter();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(600, audioCtx.currentTime);

            gain.gain.setValueAtTime(0.001, audioCtx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.08, audioCtx.currentTime + 0.8);
            gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 3.8);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(audioCtx.currentTime + (i * 0.15));
            osc.stop(audioCtx.currentTime + 4.0);
        });
    }

    btn?.addEventListener('click', () => {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }

        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }

        isPlaying = !isPlaying;

        if (isPlaying) {
            status.textContent = "Playing Melody 💖";
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            let step = 0;
            playRomanticChord(step);
            intervalId = setInterval(() => {
                step++;
                playRomanticChord(step);
            }, 3500);
        } else {
            status.textContent = "Music Paused 🌙";
            btn.style.background = 'linear-gradient(135deg, #ff4b72, #ff7eb3)';
            if (intervalId) clearInterval(intervalId);
        }
    });
}


/* --------------------------------------------------------------------------
   9. QUICK KISS BUTTON
   -------------------------------------------------------------------------- */
function initKissButton() {
    const btn = document.getElementById('randomLoveBtn');
    btn?.addEventListener('click', () => {
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 40,
                spread: 50,
                origin: { y: 0.7 },
                shapes: ['circle']
            });
        }

        const kiss = document.createElement('div');
        kiss.textContent = '💋';
        kiss.style.position = 'fixed';
        kiss.style.left = (Math.random() * 80 + 10) + 'vw';
        kiss.style.top = '70vh';
        kiss.style.fontSize = '3.5rem';
        kiss.style.zIndex = '9999';
        kiss.style.transition = 'all 1.5s ease-out';
        document.body.appendChild(kiss);

        setTimeout(() => {
            kiss.style.transform = 'translateY(-200px) scale(1.5)';
            kiss.style.opacity = '0';
        }, 50);

        setTimeout(() => {
            kiss.remove();
        }, 1600);
    });
}
