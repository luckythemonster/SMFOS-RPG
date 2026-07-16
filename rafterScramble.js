import { vec2, EngineObject, keyIsDown, tile, drawTile, drawRect, setCameraPos, ParticleEmitter, Timer, randColor, Color, Sound } from 'littlejsengine';
import { stateManager } from './stateManager.js';

// Configuration
const TILE_SIZE = 16;
const SPRITE_BILLY = 7;
const SPRITE_BILLY_CROUCH = 8;
const SPRITE_STICKY = 9;
const SPRITE_STICKY_CAN = 10;
const SPRITE_ASSASSIN = 11;
const SPRITE_PLATFORM = 12;

const sound_click = new Sound([1,,1e4,,.03,,1,1,1,,,,,1]);

let rafTimer = 60;
let rafTimerObject = null;
let lastSafePos = vec2(0, 0);

let billy = null;
let sticky = null;
let assassin = null;
let spotlights = [];
let platforms = [];

let climaxSequence = false;
let climaxTimer = null;

// A simple platform object
class RafterPlatform extends EngineObject {
    constructor(pos, size) {
        super(pos, size, tile(SPRITE_PLATFORM));
        this.setCollision(true, true);
        this.mass = 0; // Static
    }
}

// Billy Ruben
class Billy extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1, 1), tile(SPRITE_BILLY));
        this.setCollision(true, true);
        this.gravityScale = 1;
        this.damping = 0.9;
        this.isStealth = false;
        this.moveSpeed = 0.1;
        this.jumpForce = 0.3;
    }

    update() {
        super.update();
        if (climaxSequence) return;

        // Input
        let holdingDown = keyIsDown('ArrowDown') || keyIsDown('KeyS');
        this.isStealth = holdingDown;

        if (this.isStealth) {
            this.tileIndex = tile(SPRITE_BILLY_CROUCH);
            this.velocity.x = 0; // Stop moving
        } else {
            this.tileIndex = tile(SPRITE_BILLY);
            let move = 0;
            if (keyIsDown('ArrowLeft') || keyIsDown('KeyA')) move -= 1;
            if (keyIsDown('ArrowRight') || keyIsDown('KeyD')) move += 1;

            this.velocity.x += move * this.moveSpeed;

            // Simple jump if on ground (velocity.y ~ 0)
            if ((keyIsDown('ArrowUp') || keyIsDown('KeyW') || keyIsDown('Space')) && Math.abs(this.velocity.y) < 0.01) {
                this.velocity.y = this.jumpForce;
                // sound_jump.play();
            }
        }

        // Check falling
        if (this.pos.y < -5) {
            stageTumble();
        } else if (Math.abs(this.velocity.y) < 0.01 && !this.isStealth) {
             // Save safe pos if grounded
             lastSafePos = this.pos.copy();
        }

        // Camera follow
        setCameraPos(this.pos.copy().add(vec2(0, 2))); // Offset slightly up
    }
}

// Sticky
class StickyCompanion extends EngineObject {
    constructor(pos, leader) {
        super(pos, vec2(1, 1), tile(SPRITE_STICKY));
        this.setCollision(false, false); // Ignore physics collision for companion to avoid pushing Billy
        this.leader = leader;
        this.isStealth = false;
        this.followDist = 1.5;
    }

    update() {
        super.update();
        if (climaxSequence) return;

        this.isStealth = this.leader.isStealth;

        if (this.isStealth) {
            this.tileIndex = tile(SPRITE_STICKY_CAN);
        } else {
            this.tileIndex = tile(SPRITE_STICKY);

            // Follow logic
            let diff = this.leader.pos.subtract(this.pos);
            if (diff.length() > this.followDist) {
                let dir = diff.normalize();
                this.pos = this.pos.add(dir.scale(0.05));
            }
        }
    }
}

// Spotlight Hazard
class Spotlight extends EngineObject {
    constructor(pos, startAngle, scanSpeed) {
        super(pos, vec2(1,1));
        this.angle = startAngle;
        this.scanSpeed = scanSpeed;
        this.coneLength = 10;
        this.coneWidth = 2; // Angle width roughly
    }

    update() {
        super.update();
        if (climaxSequence) return;

        this.angle += this.scanSpeed;
        if (this.angle > Math.PI / 2 || this.angle < -Math.PI / 2) {
            this.scanSpeed *= -1; // Sweep back and forth
        }

        // Detection logic
        if (billy && !billy.isStealth) {
            let toBilly = billy.pos.subtract(this.pos);
            let dist = toBilly.length();
            if (dist < this.coneLength) {
                let dirAngle = toBilly.angle();
                // Simple cone check (downwards pointing)
                let baseAngle = -Math.PI/2 + this.angle; // -PI/2 is straight down
                let angleDiff = Math.abs(dirAngle - baseAngle);
                // Wrap angle diff
                while(angleDiff > Math.PI) angleDiff -= Math.PI*2;
                angleDiff = Math.abs(angleDiff);

                if (angleDiff < 0.2) { // Detection wedge
                    stageTumble(10); // Spotlight penalty
                }
            }
        }
    }

    render() {
        // Draw spotlight cone for visualization
        let dir = vec2(Math.cos(-Math.PI/2 + this.angle), Math.sin(-Math.PI/2 + this.angle));
        let end = this.pos.add(dir.scale(this.coneLength));

        // Very basic line render for the cone
        // In a real game, maybe use drawPolygon or a custom shader
        let c = new Color(1, 0, 0, 0.3);
        drawRect(this.pos.add(dir.scale(this.coneLength/2)), vec2(0.5, this.coneLength), c, this.angle);
    }
}

// Assassin (Goal)
class Assassin extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1,1), tile(SPRITE_ASSASSIN));
    }

    update() {
        super.update();
        if (climaxSequence) return;

        // Check distance to Billy for climax trigger
        if (billy && billy.pos.distance(this.pos) < 2) {
            triggerClimax();
        }
    }
}

export function initRafters() {
    console.log("Init RAFTERS");
    rafTimer = 60;
    rafTimerObject = new Timer();
    rafTimerObject.set(60);
    climaxSequence = false;

    buildLevel();

    // UI publish
    stateManager.emit('rafterTimerShow');
}

function buildLevel() {
    // Clear old
    if (billy) billy.destroy();
    if (sticky) sticky.destroy();
    if (assassin) assassin.destroy();
    spotlights.forEach(s => s.destroy());
    platforms.forEach(p => p.destroy());

    billy = null;
    sticky = null;
    assassin = null;
    spotlights = [];
    platforms = [];

    // Hardcoded layout
    // Start platform
    platforms.push(new RafterPlatform(vec2(0, 0), vec2(5, 1)));

    // Gaps and platforms
    platforms.push(new RafterPlatform(vec2(8, 2), vec2(3, 1)));
    platforms.push(new RafterPlatform(vec2(14, 0), vec2(4, 1)));
    platforms.push(new RafterPlatform(vec2(22, 3), vec2(2, 1)));
    platforms.push(new RafterPlatform(vec2(28, 1), vec2(5, 1))); // Goal platform

    lastSafePos = vec2(0, 1);
    billy = new Billy(vec2(0, 1));
    sticky = new StickyCompanion(vec2(-2, 1), billy);

    // Spotlights
    spotlights.push(new Spotlight(vec2(8, 10), 0, 0.02));
    spotlights.push(new Spotlight(vec2(22, 10), 0.5, -0.015));

    // Assassin
    assassin = new Assassin(vec2(30, 2));
}

function stageTumble(penalty = 5) {
    console.log("Stage Tumble! Penalty:", penalty);

    // Penalty
    rafTimer -= penalty;
    if (rafTimer <= 0) {
        hardReset();
        return;
    }

    // Reset positions
    if (billy) {
        billy.pos = lastSafePos.copy().add(vec2(0, 2));
        billy.velocity = vec2(0,0);
    }
    if (sticky) {
        sticky.pos = lastSafePos.copy().add(vec2(-1, 2));
    }

    // Ouch particles
    new ParticleEmitter(
        billy.pos, 0, 1, 0.1, 10, Math.PI, // pos, angle, emitSize, emitTime, emitRate, emiteCone
        tile(0), // default tile
        new Color(1,0,0), new Color(1,0,0,0), // colorStartA, colorStartB
        new Color(1,0,0,0), new Color(1,0,0,0), // colorEndA, colorEndB
        0.5, 1, 0.1, 0.1, 0.05, // particleTime, sizeStart, sizeEnd, speed, angleSpeed
        0.99, 1, 1, Math.PI, 0.1 // damping, gravityScale, particleCone, fadeRate, randomness
    );
    if (sound_click) sound_click.play(); // Generic sound
}

function hardReset() {
    console.log("Hard Reset RAFTERS");
    // Fades/sounds handled in main/stateManager ideally, but we reset here
    buildLevel();
    rafTimer = 60;
}

function triggerClimax() {
    console.log("Climax sequence triggered!");
    climaxSequence = true;
    climaxTimer = new Timer();
    climaxTimer.set(2); // 2 seconds of falling

    // Make platforms fall
    platforms.forEach(p => {
        p.mass = 1; // Unfix them
        p.gravityScale = 1;
    });

    // Hide UI
    stateManager.emit('rafterTimerHide');
}

export function updateRafters() {
    if (climaxSequence) {
        if (climaxTimer.elapsed()) {
            stateManager.transitionTo('SHOWDOWN');
        }
        return; // Physics keeps running, so things fall
    }

    // Timer Logic
    if (rafTimerObject) {
        // Since LittleJS Timer measures real time elapsed, we track our own float
        // or just decrement per frame. Better to decrement based on time delta,
        // but simple 60fps decrement works for a slice.
        // Actually, rafTimer is our explicit state, let's just decrement it roughly
        rafTimer -= 1 / 60;

        if (rafTimer <= 0) {
            hardReset();
        } else {
            stateManager.emit('rafterTimerUpdate', { time: Math.ceil(rafTimer) });
        }
    }
}

export function renderRafters() {
    // LittleJS handles rendering EngineObjects automatically if they have tiles
}

export function teardownRafters() {
    console.log("Teardown RAFTERS");
    stateManager.emit('rafterTimerHide');

    // Destroy objects
    if (billy) billy.destroy();
    if (sticky) sticky.destroy();
    if (assassin) assassin.destroy();
    spotlights.forEach(s => s.destroy());
    platforms.forEach(p => p.destroy());

    billy = null;
    sticky = null;
    assassin = null;
    spotlights = [];
    platforms = [];
}
