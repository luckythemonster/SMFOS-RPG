import { EngineObject, vec2, Color, time, Timer } from 'littlejsengine';
import { stateManager } from './stateManager.js';

let phoenix;
const entities = [];

class PhoenixGala extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1, 2));
        this.color = new Color(1, 0, 1);
        this.setCollision(false, false);
        this.mass = 0; // Not affected by physics

        // Sprite setup (assuming tilesheet index)
        this.tileIndex = 0; // Idle
        this.animTimer = new Timer();
    }

    update() {
        super.update();
        if (this.animTimer.active() && this.animTimer.elapsed()) {
            this.animTimer.unset();
            this.tileIndex = 0; // Return to idle
        }
    }

    render() {
        // Draw the current sprite index. LittleJS will use the main tilesheet.
        // We'll pass tileIndex as the tile frame.
        super.render();
    }
}

class SkullProjectile extends EngineObject {
    constructor(pos, targetPos) {
        super(pos, vec2(1, 1)); // Small square
        this.color = new Color(1, 1, 1);
        this.tileIndex = 5;
        this.setCollision(false, false);
        this.velocity = targetPos.subtract(pos).normalize().scale(20); // Move fast towards target
        this.targetPos = targetPos;
        this.hasHit = false;
    }

    update() {
        super.update();

        if (!this.hasHit) {
            // Check if close to target
            if (this.pos.distanceSquared(this.targetPos) < 1) {
                this.hasHit = true;
                this.velocity = vec2(0, 0); // Stop

                // Explode!
                // cameraShake(0.5); // Needs implementation or import if available in custom engine build // 0.5 sec, magnitude 20 approx (littlejs shake handles it)

                // Spawn particles
                // particleEmission(pos, emitCount, emitRate, emitTime, color, ... )
                // LittleJS provides default particle systems or we can just make a quick burst
                // Using a generic burst for now.
                for (let i=0; i<30; i++) {
                     let p = new EngineObject(this.pos, vec2(0.2));
                     p.color = new Color(0, 1, 0); // Green slime/smoke
                     p.velocity = vec2(Math.random()-0.5, Math.random()-0.5).scale(10);
                     p.damping = 0.9;
                     p.lifeTime = 1;
                     entities.push(p);
                }

                // Delay 1.2s then transition
                setTimeout(() => {
                    stateManager.transitionTo('RAFTERS');
                }, 1200);
            }
        }
    }

    unset() { this.time = undefined; }
    active() { return this.time !== undefined; }
    elapsed() { return time >= this.time; }
}

export function initGalaCanvas() {
    phoenix = new PhoenixGala(vec2(0, 0));
    entities.push(phoenix);

    // Listen to rhythm events
    stateManager.on('HIT_NOTE', (data) => {
        if (!phoenix) return;
        // Map key to sprite index
        switch (data.key) {
            case 'Y': phoenix.tileIndex = 1; break;
            case 'M': phoenix.tileIndex = 2; break;
            case 'C': phoenix.tileIndex = 3; break;
            case 'A': phoenix.tileIndex = 4; break;
        }
        phoenix.animTimer.set(0.3); // Pose for 0.3 seconds
    });

    // Listen to climax event
    stateManager.on('THROW_SKULL', () => {
        const skull = new SkullProjectile(vec2(0, 0), vec2(10, 10)); // From Phoenix to top-right (Laserstein)
        entities.push(skull);
    });
}

export function teardownGalaCanvas() {
    entities.forEach(e => e.destroy());
    entities.length = 0;
    phoenix = null;
}

export function galaCanvasUpdate() {
    entities.forEach(e => {
        if (!e.destroyed) e.update();
    });
}

export function galaCanvasRender() {
    entities.forEach(e => {
        if (!e.destroyed) e.render();
    });
}
