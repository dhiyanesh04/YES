const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const successOverlay = document.getElementById('successOverlay');
const confettiCanvas = document.getElementById('confetti-canvas');

// CONFIGURATION
const BOTH_BUTTONS_EVADE = true;
const PADDING = 50;
const MIN_DISTANCE = 100; // Minimum distance from cursor to new position

/**
 * Moves a button away from the cursor position
 */
function moveButtonAway(btn, mouseX, mouseY) {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Calculate safe boundaries
    const minX = PADDING;
    const maxX = viewportWidth - btn.offsetWidth - PADDING;
    const minY = PADDING;
    const maxY = viewportHeight - btn.offsetHeight - PADDING;

    // Safety check
    if (maxX <= minX || maxY <= minY) {
        return;
    }

    let newX, newY, distance;
    let attempts = 0;
    const maxAttempts = 10;

    // Try to find a position far enough from the cursor
    do {
        newX = Math.random() * (maxX - minX) + minX;
        newY = Math.random() * (maxY - minY) + minY;

        // Calculate distance from cursor
        const dx = newX - mouseX;
        const dy = newY - mouseY;
        distance = Math.sqrt(dx * dx + dy * dy);

        attempts++;
    } while (distance < MIN_DISTANCE && attempts < maxAttempts);

    // Apply new position
    btn.style.position = 'fixed';
    btn.style.left = `${newX}px`;
    btn.style.top = `${newY}px`;
    btn.style.transition = 'all 0.3s ease';
}

// Event handler for button evasion
function handleButtonHover(e, btn) {
    e.preventDefault();
    const mouseX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const mouseY = e.clientY || (e.touches[0] && e.touches[0].clientY) || 0;
    moveButtonAway(btn, mouseX, mouseY);
}

// Attach listeners to No button
noBtn.addEventListener('mouseenter', (e) => handleButtonHover(e, noBtn));
noBtn.addEventListener('touchstart', (e) => handleButtonHover(e, noBtn));

// Attach listeners to Yes button if both should evade
if (BOTH_BUTTONS_EVADE) {
    yesBtn.addEventListener('mouseenter', (e) => handleButtonHover(e, yesBtn));
    yesBtn.addEventListener('touchstart', (e) => handleButtonHover(e, yesBtn));
} else {
    // Standard Behavior: Yes Button Leads to Success
    yesBtn.addEventListener('click', () => {
        launchConfetti();
        successOverlay.classList.remove('hidden');
        successOverlay.style.display = 'flex';
    });
}


function launchConfetti() {
    var duration = 15 * 1000;
    var animationEnd = Date.now() + duration;
    var defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    var interval = setInterval(function () {
        var timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
            return clearInterval(interval);
        }

        var particleCount = 50 * (timeLeft / duration);
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
        confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
}

// Timeout Logic
const timeoutOverlay = document.getElementById('timeoutOverlay');
const playNowBtn = document.getElementById('playNowBtn');
const timeoutTitle = document.getElementById('timeoutTitle');
const timeoutMessage = document.getElementById('timeoutMessage');

// 1. Show first popup after 10 seconds
setTimeout(() => {
    if (successOverlay.classList.contains('hidden')) {
        timeoutOverlay.classList.remove('hidden');
        timeoutOverlay.style.display = 'flex';
        timeoutTitle.style.display = 'block';
        timeoutMessage.style.display = 'none';
        timeoutMessage.classList.add('hidden-text');
        playNowBtn.textContent = 'Play Again 😜';
    }
}, 10000);

// 2. Update popup after 20 seconds
setTimeout(() => {
    if (successOverlay.classList.contains('hidden')) {
        timeoutOverlay.classList.remove('hidden');
        timeoutOverlay.style.display = 'flex';
        timeoutTitle.style.display = 'none';
        timeoutMessage.classList.remove('hidden-text');
        timeoutMessage.style.display = 'block';
        playNowBtn.textContent = 'Dont Play Again 😜';
    }
}, 20000);

// Play button click - hide popup AND Reset buttons
playNowBtn.addEventListener('click', () => {
    timeoutOverlay.classList.add('hidden');

    // Reset buttons to original position
    yesBtn.style.position = 'static';
    noBtn.style.position = 'static';
    yesBtn.style.transform = 'none';
    noBtn.style.transform = 'none';

    setTimeout(() => {
        timeoutOverlay.style.display = 'none';
    }, 500);
});
