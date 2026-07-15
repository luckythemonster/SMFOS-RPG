import { stateManager } from './stateManager.js';
import { keyWasPressed, time } from 'littlejsengine';

// Audio/ZZFX for the rhythm kick/snare
// zzfx() - ZzFX - Zuper Zmall Zound Zynth
function playKick() {
    // Basic synthesized kick drum using zzfx params or playSound from littlejs
    // For now, we'll use a placeholder or littlejs sound generator if available.
    // LittleJS has Sound object, but we'll stick to a simple fallback or just emit event.
}

let activeNotes = [];
let noteSpeed = 300; // pixels per second moving left
let targetTimeOffset = 1.5; // How many seconds ahead notes spawn
let rhythmTargetX = 0; // Set dynamically based on HUD
let lastNoteSpawnTime = 0;
const BPM = 120;
const SECONDS_PER_BEAT = 60 / BPM;

let suspicion = 0;
const MAX_SUSPICION = 100;
let gameStartTime = 0;
const GALA_DURATION = 60; // 60 seconds

let uiContainer = null;
let meterBar = null;
let highway = null;
let isClimax = false;
let isGameOver = false;

// The available keys
const KEYS = ['Y', 'M', 'C', 'A'];

export function initGalaMinigame() {
    const hudOverlay = document.getElementById('hud-overlay');

    uiContainer = document.createElement('div');
    uiContainer.className = 'gala-ui-container';

    // Suspicion Meter
    const meterContainer = document.createElement('div');
    meterContainer.className = 'suspicion-container';

    const meterLabel = document.createElement('div');
    meterLabel.className = 'suspicion-label';
    meterLabel.textContent = 'Laserstein Suspicion Meter';
    meterContainer.appendChild(meterLabel);

    meterBar = document.createElement('div');
    meterBar.className = 'suspicion-bar';
    meterContainer.appendChild(meterBar);

    uiContainer.appendChild(meterContainer);

    // Rhythm Highway
    highway = document.createElement('div');
    highway.className = 'rhythm-highway';

    const targetZone = document.createElement('div');
    targetZone.className = 'rhythm-target';
    highway.appendChild(targetZone);

    uiContainer.appendChild(highway);

    hudOverlay.appendChild(uiContainer);

    // Reset State
    suspicion = 0;
    activeNotes = [];
    isClimax = false;
    isGameOver = false;
    gameStartTime = time;
    lastNoteSpawnTime = time;

    updateSuspicionMeter();
}

export function teardownGalaMinigame() {
    const hudOverlay = document.getElementById('hud-overlay');
    if (uiContainer && hudOverlay.contains(uiContainer)) {
        hudOverlay.removeChild(uiContainer);
    }
    uiContainer = null;
    meterBar = null;
    highway = null;
    activeNotes = [];
}

function spawnNote() {
    const noteKey = KEYS[Math.floor(Math.random() * KEYS.length)];
    const noteEl = document.createElement('div');
    noteEl.className = 'rhythm-note';
    noteEl.textContent = noteKey;

    // Spawn notes on the right side of the highway
    noteEl.style.transform = `translate3d(100vw, 0, 0)`;
    highway.appendChild(noteEl);

    // Note object
    activeNotes.push({
        element: noteEl,
        key: noteKey,
        targetTime: time + targetTimeOffset,
        hit: false,
        missed: false
    });
}

function showFeedback(type) {
    const feedbackEl = document.createElement('div');
    feedbackEl.className = `feedback-popup ${type === 'miss' ? 'feedback-miss' : ''}`;

    if (type === 'perfect') {
        feedbackEl.textContent = "Perfect!";
    } else if (type === 'good') {
        feedbackEl.textContent = "Good!";
    } else {
        const missTexts = ["Slime Splat!", "Off-Beat 13/8 Drum Solo!", "Yikes!"];
        feedbackEl.textContent = missTexts[Math.floor(Math.random() * missTexts.length)];
    }

    highway.appendChild(feedbackEl);

    setTimeout(() => {
        if (highway && highway.contains(feedbackEl)) {
            highway.removeChild(feedbackEl);
        }
    }, 500);
}

function updateSuspicionMeter() {
    if (meterBar) {
        meterBar.style.width = `${Math.min(100, Math.max(0, suspicion))}%`;
    }
}

function triggerClimax() {
    isClimax = true;
    activeNotes.forEach(note => {
        if (highway.contains(note.element)) {
            highway.removeChild(note.element);
        }
    });
    activeNotes = [];

    const climaxBtn = document.createElement('button');
    climaxBtn.className = 'climax-button';
    climaxBtn.textContent = 'THROW PUNK SKULL';
    climaxBtn.onclick = () => {
        if (isGameOver) return;
        isGameOver = true;
        stateManager.emit('THROW_SKULL', null);
        climaxBtn.remove();
    };

    uiContainer.appendChild(climaxBtn);
}

export function galaUpdate() {
    if (isClimax) return;

    const currentTime = time;

    // Check end condition
    if (currentTime - gameStartTime >= GALA_DURATION || suspicion >= MAX_SUSPICION) {
        triggerClimax();
        return;
    }

    // Spawn notes at BPM
    if (currentTime - lastNoteSpawnTime >= SECONDS_PER_BEAT) {
        spawnNote();
        lastNoteSpawnTime = currentTime;

        // Synthesized beat (fallback to random noise or basic beep if ZzFX not directly exposed)
        // A full ZzFX integration requires zzfx array, skipping for brevity but placeholder logic is here.
    }

    // Update notes positions and check misses
    const targetX = highway ? highway.offsetWidth * 0.1 : 50; // target is at 10% left
    const startX = highway ? highway.offsetWidth : 800; // spawn at right edge

    // We want note to be at targetX exactly when currentTime == note.targetTime
    // Time remaining = note.targetTime - currentTime

    for (let i = activeNotes.length - 1; i >= 0; i--) {
        const note = activeNotes[i];

        if (note.hit || note.missed) continue;

        const timeDiff = note.targetTime - currentTime;

        // Calculate position based on time remaining to hit the target
        // Speed = (startX - targetX) / targetTimeOffset
        const speed = (startX - targetX) / targetTimeOffset;
        const currentX = targetX + (timeDiff * speed);

        note.element.style.transform = `translate3d(${currentX}px, 0, 0)`;

        // Check if missed (past the target zone entirely)
        if (timeDiff < -0.3) {
            note.missed = true;
            suspicion += 10;
            updateSuspicionMeter();
            showFeedback('miss');
            note.element.remove();
            activeNotes.splice(i, 1);
        }
    }

    // Input handling
    KEYS.forEach((key) => {
        if (keyWasPressed(key)) {
            // Find the earliest unhit note matching the key
            const noteIndex = activeNotes.findIndex(n => !n.hit && !n.missed && n.key === key);

            if (noteIndex !== -1) {
                const note = activeNotes[noteIndex];
                const timeDiff = Math.abs(note.targetTime - currentTime);

                if (timeDiff <= 0.3) { // hit window
                    note.hit = true;
                    if (timeDiff <= 0.1) {
                        // Perfect
                        suspicion -= 2;
                        showFeedback('perfect');
                        stateManager.emit('HIT_NOTE', { quality: 'perfect', key: key });
                    } else {
                        // Good
                        showFeedback('good');
                        stateManager.emit('HIT_NOTE', { quality: 'good', key: key });
                    }

                    updateSuspicionMeter();
                    note.element.remove();
                    activeNotes.splice(noteIndex, 1);
                }
            } else {
                // Pressed a key but no matching note in zone
                // Optional: punish random mashing?
            }
        }
    });
}
