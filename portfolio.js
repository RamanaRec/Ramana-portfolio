document.addEventListener('DOMContentLoaded', () => {
    // 1. Mobile Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    const toggleIcon = mobileToggle.querySelector('i');

    mobileToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        if (navLinks.classList.contains('active')) {
            toggleIcon.classList.replace('ph-list', 'ph-x');
        } else {
            toggleIcon.classList.replace('ph-x', 'ph-list');
        }
    });

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggleIcon.classList.replace('ph-x', 'ph-list');
        });
    });

    // 2. Sticky Navbar on Scroll
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 3. Scroll Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealOnScroll = new IntersectionObserver(function (entries, observer) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // 3b. Horizontal Parallax Scrolling for floating shapes
    const handleParallaxScroll = () => {
        const viewportHeight = window.innerHeight;
        document.querySelectorAll('.parallax-container').forEach(container => {
            const rect = container.getBoundingClientRect();
            if (rect.top < viewportHeight && rect.bottom > 0) {
                const centerDiff = (rect.top + rect.height / 2) - (viewportHeight / 2);

                container.querySelectorAll('.parallax-left').forEach(el => {
                    el.style.transform = `translateX(${centerDiff * -0.07}px)`;
                });
                container.querySelectorAll('.parallax-right').forEach(el => {
                    el.style.transform = `translateX(${centerDiff * 0.07}px)`;
                });
            }
        });
    };

    window.addEventListener('scroll', handleParallaxScroll);
    window.addEventListener('resize', handleParallaxScroll);
    handleParallaxScroll();

    // 4. Form Submission Simulation
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Basic validation
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name && email && message) {
                // Simulate button loading state
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i class="ph ph-spinner-gap ph-spin"></i> <span>Sending...</span>';
                submitBtn.disabled = true;

                try {
                    // Save contact to Firestore
                    await window.saveContact({ name, email, message });
                    formStatus.style.display = 'block';
                    formStatus.textContent = "Thanks! Your message has been sent successfully.";
                    formStatus.className = "form-status success";
                    contactForm.reset();
                } catch (err) {
                    formStatus.style.display = 'block';
                    formStatus.textContent = err.message || 'Error sending message.';
                    formStatus.className = "form-status error";
                } finally {
                    // Restore button state
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;

                    // Hide success/error message after 5 seconds
                    setTimeout(() => {
                        formStatus.style.display = '';
                        formStatus.className = "form-status";
                    }, 5000);
                }
            } else {
                formStatus.textContent = "Please fill in all fields.";
                formStatus.className = "form-status error";
                formStatus.style.display = 'block';
            }
        });
    }

    // 5. Scroll-Linked Code Editor & Retro Space Shooter Game
    const GAME_CODE = `// Retro Galaxy Runner 2D Game Loop
class GalaxyRunner {
    constructor() {
        this.canvas = document.getElementById("game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.player = { x: 50, y: 150, size: 20, color: "#06b6d4" };
        this.asteroids = [];
        this.score = 0;
        this.running = false;
        this.speed = 3;
    }

    start() {
        this.running = true;
        this.score = 0;
        this.asteroids = [];
        this.loop();
    }

    update() {
        // Spawn asteroids
        if (Math.random() < 0.035) {
            this.asteroids.push({
                x: this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: 10 + Math.random() * 20,
                speed: this.speed + Math.random() * 2
            });
        }

        // Move asteroids
        this.asteroids.forEach(a => a.x -= a.speed);

        // Check collisions
        this.asteroids = this.asteroids.filter(a => {
            if (this.checkCollision(this.player, a)) {
                this.score = Math.max(0, this.score - 10);
                return false;
            }
            return a.x > -a.size;
        });

        this.score += 1;
    }

    draw() {
        this.ctx.fillStyle = "rgba(10, 10, 15, 0.25)";
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw player spaceship
        this.ctx.fillStyle = this.player.color;
        this.ctx.beginPath();
        this.ctx.moveTo(this.player.x, this.player.y);
        this.ctx.lineTo(this.player.x - 15, this.player.y - 8);
        this.ctx.lineTo(this.player.x - 15, this.player.y + 8);
        this.ctx.fill();

        // Draw asteroids
        this.ctx.fillStyle = "#8b5cf6";
        this.asteroids.forEach(a => {
            this.ctx.beginPath();
            this.ctx.arc(a.x, a.y, a.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }
}`;

    // Elements
    const aboutSection = document.getElementById('about');
    const codeContent = document.getElementById('code-content');
    const lineNumbersEl = document.getElementById('line-numbers');
    const editorPanel = document.querySelector('.ide-editor-panel');
    const terminalScreen = document.getElementById('terminal-screen');
    const gameOverlay = document.getElementById('game-overlay');
    const gameCanvas = document.getElementById('game-canvas');

    // Game loop variables
    let isCompiled = false;
    let isCompiling = false;
    let targetProgress = 0;
    let currentProgress = 0;
    let gameLoopId = null;
    let starfield = [];
    let asteroids = [];
    let lasers = [];
    let particles = [];
    let gameScore = 0;
    let mousePos = { x: 50, y: 150 };
    let lastShotTime = 0;
    let canvasWidth = 320;
    let canvasHeight = 240;

    // Setup canvas bounds
    if (gameCanvas) {
        const resizeCanvas = () => {
            const container = gameCanvas.parentElement;
            if (container) {
                gameCanvas.width = container.clientWidth || 320;
                gameCanvas.height = container.clientHeight || 240;
                canvasWidth = gameCanvas.width;
                canvasHeight = gameCanvas.height;
            }
        };
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Focus mouse hover on Canvas to guide spaceship
        gameCanvas.addEventListener('mousemove', (e) => {
            const rect = gameCanvas.getBoundingClientRect();
            mousePos.y = e.clientY - rect.top;
            mousePos.x = e.clientX - rect.left;
        });

        // Touch supports for mobile viewports
        gameCanvas.addEventListener('touchmove', (e) => {
            if (e.touches.length > 0) {
                const rect = gameCanvas.getBoundingClientRect();
                mousePos.y = e.touches[0].clientY - rect.top;
                mousePos.x = e.touches[0].clientX - rect.left;
                e.preventDefault();
            }
        }, { passive: false });
    }

    // Highlighting dynamic javascript
    function highlightJS(code) {
        const keywords = ['class', 'constructor', 'this', 'let', 'const', 'new', 'return', 'if', 'else', 'typeof'];
        const builtins = ['Math', 'document', 'window', 'canvas', 'ctx'];
        const booleans = ['true', 'false'];

        let result = '';
        let i = 0;
        const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

        while (i < code.length) {
            // Comments
            if (code.startsWith('//', i)) {
                let end = code.indexOf('\n', i);
                if (end === -1) end = code.length;
                result += `<span class="token-comment">${escapeHtml(code.slice(i, end))}</span>`;
                i = end;
                continue;
            }

            // Strings
            if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
                let char = code[i];
                let end = code.indexOf(char, i + 1);
                if (end === -1) end = code.length;
                result += `<span class="token-string">${escapeHtml(code.slice(i, end + 1))}</span>`;
                i = end + 1;
                continue;
            }

            // Numbers
            if (/\d/.test(code[i]) && (i === 0 || !/[a-zA-Z0-9_$]/.test(code[i - 1]))) {
                let num = '';
                while (i < code.length && /[0-9.]/.test(code[i])) {
                    num += code[i];
                    i++;
                }
                result += `<span class="token-number">${num}</span>`;
                continue;
            }

            // Words
            if (/[a-zA-Z_$]/.test(code[i])) {
                let word = '';
                while (i < code.length && /[a-zA-Z0-9_$]/.test(code[i])) {
                    word += code[i];
                    i++;
                }

                if (keywords.includes(word)) {
                    result += `<span class="token-keyword">${word}</span>`;
                } else if (builtins.includes(word)) {
                    result += `<span class="token-builtin">${word}</span>`;
                } else if (booleans.includes(word)) {
                    result += `<span class="token-boolean">${word}</span>`;
                } else if (i < code.length && code[i] === '(') {
                    result += `<span class="token-function">${word}</span>`;
                } else if (word[0] === word[0].toUpperCase() && word !== 'Math') {
                    result += `<span class="token-class">${word}</span>`;
                } else {
                    result += escapeHtml(word);
                }
                continue;
            }

            // Operators
            if (/[-+*/%=<>!&|^~]/.test(code[i])) {
                result += `<span class="token-operator">${escapeHtml(code[i])}</span>`;
                i++;
                continue;
            }

            result += escapeHtml(code[i]);
            i++;
        }
        return result;
    }

    function updateLineNumbers(code) {
        if (!lineNumbersEl) return;
        const lineCount = code.split('\n').length;
        let linesHtml = '';
        for (let i = 1; i <= Math.max(lineCount, 1); i++) {
            linesHtml += `<div>${i}</div>`;
        }
        lineNumbersEl.innerHTML = linesHtml;
    }

    // Starfield Particle Factory
    function setupStarfield() {
        starfield = [];
        for (let i = 0; i < 40; i++) {
            starfield.push({
                x: Math.random() * canvasWidth,
                y: Math.random() * canvasHeight,
                size: 0.5 + Math.random() * 1.5,
                speed: 0.15 + Math.random() * 0.8
            });
        }
    }

    // Spawn exploding particle sparks
    function spawnExplosion(x, y, color, count) {
        for (let i = 0; i < count; i++) {
            let angle = Math.random() * Math.PI * 2;
            let speed = 1 + Math.random() * 2.5;
            particles.push({
                x: x,
                y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                size: 1.5 + Math.random() * 2,
                color: color,
                alpha: 1.0
            });
        }
    }

    // Space Game Engine loop (Light Editorial Theme)
    function runRetroGame() {
        if (!isCompiled || !gameCanvas) return;
        const ctx = gameCanvas.getContext('2d');
        if (!ctx) return;

        // Warm off-white canvas backdrop clearing
        ctx.fillStyle = 'rgba(250, 249, 246, 0.35)';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Faint dark starfield parallax movement
        ctx.fillStyle = 'rgba(26, 25, 23, 0.12)';
        starfield.forEach(star => {
            star.x -= star.speed;
            if (star.x < 0) {
                star.x = canvasWidth;
                star.y = Math.random() * canvasHeight;
            }
            ctx.fillRect(star.x, star.y, star.size, star.size);
        });

        // Track spaceship smoothly
        const pY = mousePos.y;
        const pX = Math.min(80, Math.max(30, mousePos.x)); // bounded

        // Draw Player Spaceship (Charcoal triangular wing)
        ctx.fillStyle = '#1a1917';
        ctx.beginPath();
        ctx.moveTo(pX + 14, pY);
        ctx.lineTo(pX - 10, pY - 7);
        ctx.lineTo(pX - 10, pY + 7);
        ctx.closePath();
        ctx.fill();

        // Auto Fire Laser guns
        const now = Date.now();
        if (now - lastShotTime > 250) {
            lasers.push({ x: pX + 14, y: pY, speed: 6.5 });
            lastShotTime = now;
        }

        // Draw Lasers (Deep crimson)
        ctx.fillStyle = '#cf222e';
        lasers = lasers.filter(laser => {
            laser.x += laser.speed;
            ctx.fillRect(laser.x, laser.y - 1, 8, 2);
            return laser.x < canvasWidth;
        });

        // Spawn Asteroids
        if (Math.random() < 0.04) {
            asteroids.push({
                x: canvasWidth + 20,
                y: Math.random() * canvasHeight,
                size: 6 + Math.random() * 11,
                speed: 1.5 + Math.random() * 2.0,
                angle: 0,
                spinSpeed: (Math.random() - 0.5) * 0.04
            });
        }

        // Draw Asteroids (Blueprint vector style outlines)
        asteroids = asteroids.filter(ast => {
            ast.x -= ast.speed;
            ast.angle += ast.spinSpeed;

            ctx.fillStyle = '#eae5db';
            ctx.strokeStyle = '#1a1917';
            ctx.lineWidth = 1.5;

            ctx.beginPath();
            for (let j = 0; j < 6; j++) {
                let rAngle = (j * Math.PI) / 3 + ast.angle;
                let curX = ast.x + Math.cos(rAngle) * ast.size;
                let curY = ast.y + Math.sin(rAngle) * ast.size;
                if (j === 0) ctx.moveTo(curX, curY);
                else ctx.lineTo(curX, curY);
            }
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Collision check ship
            let distance = Math.hypot(pX - ast.x, pY - ast.y);
            if (distance < ast.size + 8) {
                gameScore = Math.max(0, gameScore - 15);
                spawnExplosion(ast.x, ast.y, '#cf222e', 8);
                return false; // destroy asteroid
            }
            return ast.x > -40;
        });

        // Laser Asteroids Collision Check
        lasers.forEach((l, lIdx) => {
            asteroids.forEach((a, aIdx) => {
                let dist = Math.hypot(l.x - a.x, l.y - a.y);
                if (dist < a.size + 4) {
                    spawnExplosion(a.x, a.y, '#1a1917', 8); // dark smoke soot
                    spawnExplosion(a.x, a.y, '#cf222e', 4); // red spark flame
                    asteroids.splice(aIdx, 1);
                    lasers.splice(lIdx, 1);
                    gameScore += 10;
                }
            });
        });

        // Explosive spark animation
        particles = particles.filter(part => {
            part.x += part.vx;
            part.y += part.vy;
            part.alpha -= 0.025;
            ctx.fillStyle = part.color;
            ctx.globalAlpha = part.alpha;
            ctx.fillRect(part.x, part.y, part.size, part.size);
            ctx.globalAlpha = 1.0;
            return part.alpha > 0;
        });

        // Draw Score Board (Minimalist Monospaced)
        ctx.fillStyle = '#1a1917';
        ctx.font = '700 11px "Space Mono", monospace';
        ctx.fillText(`SCORE: ${gameScore}`, 15, 25);

        gameLoopId = requestAnimationFrame(runRetroGame);
    }

    // Trigger code compilations
    function triggerGameCompile() {
        if (isCompiled || isCompiling) return;
        isCompiling = true;

        if (terminalScreen) {
            terminalScreen.innerHTML = '';
        }

        const lines = [
            { text: '> npm run compile', delay: 100, class: '' },
            { text: '✓ Scanning entrypoint galaxy_runner.js...', delay: 250, class: 'text-muted' },
            { text: '✓ Loading shaders and audio systems...', delay: 400, class: 'text-muted' },
            { text: '✓ Build succeeded. Output saved to /dist.', delay: 550, class: 'text-muted' },
            { text: '> node dist/game.js', delay: 700, class: '' },
            { text: '[SYSTEM] Initializing 2D canvas device...', delay: 850, class: 'success' },
            { text: '[SYSTEM] Game loop running. Move mouse to pilot ship!', delay: 1000, class: 'success' }
        ];

        if (gameOverlay) {
            gameOverlay.innerHTML = `
                <div class="overlay-text compiling">
                    <i class="ph ph-cpu ph-spin"></i>
                    <span>COMPILING SOURCE...</span>
                </div>
            `;
        }

        lines.forEach(lineItem => {
            setTimeout(() => {
                if (!isCompiling) return;

                if (terminalScreen) {
                    const div = document.createElement('div');
                    div.className = 'terminal-line ' + lineItem.class;
                    div.textContent = lineItem.text;
                    terminalScreen.appendChild(div);
                    terminalScreen.scrollTop = terminalScreen.scrollHeight;
                }

                if (lineItem.text.includes('Game loop running')) {
                    isCompiling = false;
                    isCompiled = true;

                    if (gameOverlay) {
                        gameOverlay.innerHTML = `
                            <div class="overlay-text success">
                                <i class="ph ph-check-circle"></i>
                                <span>BUILD COMPLETE</span>
                            </div>
                        `;
                    }

                    setTimeout(() => {
                        if (isCompiled && gameOverlay) {
                            gameOverlay.classList.add('compiled');
                            if (!gameLoopId) {
                                gameScore = 0;
                                asteroids = [];
                                lasers = [];
                                particles = [];
                                setupStarfield();
                                runRetroGame();
                            }
                        }
                    }, 500);
                }
            }, lineItem.delay);
        });
    }

    // Reset simulator
    function stopGameAndReset() {
        isCompiled = false;
        isCompiling = false;
        if (gameLoopId) {
            cancelAnimationFrame(gameLoopId);
            gameLoopId = null;
        }
        if (gameOverlay) {
            gameOverlay.classList.remove('compiled');
            gameOverlay.innerHTML = `
                <div class="overlay-text">
                    <i class="ph ph-power"></i>
                    <span>SYSTEM OFFLINE</span>
                </div>
            `;
        }
        if (terminalScreen) {
            terminalScreen.innerHTML = '<div class="terminal-line text-muted">> Waiting for code compiling...</div>';
        }
    }

    // Scroll calculations and triggers
    const handleScrollIDE = () => {
        if (!aboutSection || !codeContent) return;
        const rect = aboutSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        // Start typing when top of About reaches 75% height, complete at 25% height
        const startScroll = rect.top - viewportHeight * 0.75;
        const scrollRange = viewportHeight * 0.5;

        let progress = -startScroll / scrollRange;
        targetProgress = Math.max(0, Math.min(1, progress));
    };

    window.addEventListener('scroll', handleScrollIDE);
    window.addEventListener('resize', handleScrollIDE);
    handleScrollIDE(); // init

    // Smooth lerp frame ticker
    let lastLength = 0;
    function animateIDE() {
        if (codeContent) {
            currentProgress += (targetProgress - currentProgress) * 0.12;

            if (Math.abs(targetProgress - currentProgress) > 0.001 || currentProgress === 0 || currentProgress === 1) {
                const charCount = Math.floor(currentProgress * GAME_CODE.length);
                if (charCount !== lastLength) {
                    const slicedCode = GAME_CODE.slice(0, charCount);
                    codeContent.innerHTML = highlightJS(slicedCode);
                    updateLineNumbers(slicedCode);

                    if (editorPanel) {
                        editorPanel.scrollTop = editorPanel.scrollHeight;
                    }
                    lastLength = charCount;
                }
            }

            if (currentProgress > 0.96) {
                triggerGameCompile();
            } else {
                stopGameAndReset();
            }
        }
        requestAnimationFrame(animateIDE);
    }
    animateIDE();

    // Count-up animation for hero stats
    const animateStat = (el, target, duration = 2000) => {
        let start = null;
        const initial = 0;
        const step = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percent = Math.min(progress / duration, 1);
            const value = Math.floor(initial + (target - initial) * percent);
            el.textContent = el.dataset.suffix ? `${value}${el.dataset.suffix}` : `${value}`;
            if (percent < 1) {
                requestAnimationFrame(step);
            }
        };
        requestAnimationFrame(step);
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-number');
                statNumbers.forEach(numEl => {
                    const target = parseInt(numEl.dataset.target, 10);
                    if (!isNaN(target)) {
                        animateStat(numEl, target);
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) statsObserver.observe(heroStats);
});