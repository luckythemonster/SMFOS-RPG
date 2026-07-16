import { vec2, drawRect, rgb, keyWasPressed, zzfx, setCameraPos, hsl, rand } from 'littlejsengine';
import { stateManager } from './stateManager.js';

// ZzFX procedural sound string for chiptune air-guitar squeal
const GUITAR_SQUEAL = [, , 400, .1, .2, .3, 1, 1.5, , , , , , 2, , .5, .2, .8, .1];

let phase = 0;
/*
Phases:
0: Init, wait a bit, show dialogue 1
1: Waiting for dialogue 1 to complete typing
2: Waiting for user to click next
3: Show dialogue 2
4: Waiting for dialogue 2 to complete typing
5: Waiting for user to click next
6: Show Space Prompt
7: Space Prompt active, waiting for SPACE
8: Leaping through ceiling animation & Fade
9: Complete
*/

let timer = 0;
let typingFinished = false;
let billyPos = vec2(0, -50);
let particles = [];

export function initEscape() {
    phase = 0;
    timer = 0;
    typingFinished = false;
    billyPos = vec2(0, -50);
    particles = [];

    setCameraPos(vec2(0, 0));
    stateManager.emit('showLetterbox');

    // Subscribe to dialogue events
    stateManager.on('dialogueTypingDone', onTypingDone);
    stateManager.on('dialogueNext', onDialogueNext);
}

function onTypingDone() {
    typingFinished = true;
}

function onDialogueNext() {
    if (typingFinished) {
        if (phase === 2) {
            phase = 3;
            typingFinished = false;
        } else if (phase === 5) {
            phase = 6;
            typingFinished = false;
            stateManager.emit('hideDialogue');
        }
    }
}

export function teardownEscape() {
    // Note: State Manager's .on doesn't have an easy .off without keeping track of refs in this simple implementation,
    // but in this demo, ESCAPE is the final state.
}

export function updateEscape() {
    timer++;

    if (phase === 0 && timer > 60) {
        // Show Jeffrey's dialogue
        stateManager.emit('showDialogue', {
            sender: 'Jeffrey Laserstein',
            text: "You're... a giant space-booger!"
        });
        phase = 1;
    } else if (phase === 1 && typingFinished) {
        phase = 2; // wait for click
    } else if (phase === 3) {
        stateManager.emit('showDialogue', {
            sender: 'Phoenix',
            text: "And you're a suit with a terrible airship. Let's take the wheel!"
        });
        phase = 4;
    } else if (phase === 4 && typingFinished) {
        phase = 5; // wait for click
    } else if (phase === 6) {
        stateManager.emit('showSpacePrompt');
        phase = 7;
    } else if (phase === 7) {
        if (keyWasPressed('Space')) {
            stateManager.emit('hideSpacePrompt');
            zzfx(...GUITAR_SQUEAL);
            phase = 8;
            timer = 0;
            // Spawn glass particles
            for(let i=0; i<50; i++) {
                particles.push({
                    pos: vec2(rand(-100, 100), 100),
                    vel: vec2(rand(-2, 2), rand(-5, 0)),
                    life: rand(30, 90),
                    maxLife: 90
                });
            }
        }
    } else if (phase === 8) {
        billyPos.y += 5; // Leap upwards

        // Update particles
        for (let p of particles) {
            p.pos.x += p.vel.x;
            p.pos.y += p.vel.y;
            p.vel.y -= 0.1; // gravity
            p.life--;
        }
        particles = particles.filter(p => p.life > 0);

        if (timer === 30) {
            stateManager.emit('showFade');
        }
        if (timer > 150) {
            phase = 9;
        }
    }
}

export function renderEscape() {
    // Draw background
    drawRect(vec2(0, 0), vec2(480, 270), rgb(0.1, 0.1, 0.15));

    // Draw Billy
    if (phase >= 8) {
        drawRect(billyPos, vec2(20, 20), rgb(1, 0.8, 0.2)); // Billy's color
    }

    // Draw Glass Particles
    for (let p of particles) {
        drawRect(p.pos, vec2(3, 3), rgb(0.8, 0.9, 1, p.life/p.maxLife));
    }
}
