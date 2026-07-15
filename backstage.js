import { EngineObject, vec2, Color, keyIsDown, keyWasPressed, setCameraPos, ParticleEmitter } from 'littlejsengine';
import { stateManager } from './stateManager.js';

// --- Global variables for Backstage ---
let phoenix;
const props = [];
const npcs = [];
let poster;
let stageDoor;

// --- Phoenix (Player) Class ---
class Phoenix extends EngineObject {
    constructor(pos) {
        // Size: 1 width, 2 height for a vertical capsule look
        super(pos, vec2(1, 2));

        // Neon-pink color
        this.color = new Color(1, 0, 1);

        // Physics settings
        this.setCollision(1, 1); // Solid, moving
        this.mass = 1;
        this.damping = 0.8;

        // Custom properties
        this.baseSpeed = 0.1;
        this.dashSpeed = 0.25;
        this.isDashing = false;

        // For visual squashing
        this.renderScale = vec2(1, 1);
    }

    update() {
        super.update();

        // Movement Input
        let moveInput = vec2(0, 0);
        if (keyIsDown('ArrowUp') || keyIsDown('KeyW')) moveInput.y += 1;
        if (keyIsDown('ArrowDown') || keyIsDown('KeyS')) moveInput.y -= 1;
        if (keyIsDown('ArrowRight') || keyIsDown('KeyD')) moveInput.x += 1;
        if (keyIsDown('ArrowLeft') || keyIsDown('KeyA')) moveInput.x -= 1;

        // Dash input
        this.isDashing = keyIsDown('ShiftLeft') || keyIsDown('ShiftRight') || keyIsDown('Space');
        const currentSpeed = this.isDashing ? this.dashSpeed : this.baseSpeed;

        // Apply movement if there's input
        if (moveInput.lengthSquared() > 0) {
            moveInput = moveInput.normalize(); // Ensure diagonal movement isn't faster

            // Directly modify velocity to keep physics consistent
            this.velocity.x += moveInput.x * currentSpeed;
            this.velocity.y += moveInput.y * currentSpeed;

            // Squash and stretch effect based on speed
            const stretch = this.isDashing ? 0.2 : 0.05;
            // Stretch along movement axis, squash along perpendicular
            if (Math.abs(moveInput.x) > Math.abs(moveInput.y)) {
                this.renderScale = vec2(1 + stretch, 1 - stretch);
            } else {
                this.renderScale = vec2(1 - stretch, 1 + stretch);
            }
        } else {
            // Return to normal shape
            this.renderScale = this.renderScale.lerp(vec2(1, 1), 0.2);
        }

        // Update camera to follow player
        setCameraPos(this.pos);
    }

    render() {
        // We override render to apply the squash/stretch visually
        const size = this.size.multiply(this.renderScale);
        this.drawColor = this.color;
        super.render();
    }
}

// --- Prop Class ---
class Prop extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1, 1));

        // Yellow-orange color
        this.color = new Color(1, 0.5, 0);

        // Physics settings
        this.setCollision(1, 1); // Solid, moving (so they can be pushed)
        this.mass = 2; // Heavier than player
        this.damping = 0.9; // Stop sliding quickly
        this.elasticity = 0.5; // Bouncy
    }

    collideWithObject(o) {
        if (o === phoenix) {
            // Check if Phoenix is dashing
            if (phoenix.isDashing) {
                // Apply impulse
                const pushDir = this.pos.subtract(phoenix.pos).normalize();
                this.velocity = this.velocity.add(pushDir.multiply(0.5));

                // Spawn retro particles
                const emitter = new ParticleEmitter(
                    this.pos,
                    0, // emitRate (0 means burst)
                    1, // emitConeAngle
                    0, // emitDirection
                    new Color(1,1,0), new Color(1,0.5,0), // start colors
                    new Color(1,0,0,0), new Color(0,0,0,0), // end colors
                    0.5, // particleTime
                    0.5, 0.1, // sizeStart, sizeEnd
                    0.2, // speed
                    0.1, // angleSpeed
                    0.99, // damping
                    1, // gravityScale
                    Math.PI, // particleConeAngle
                    0, // renderOrder
                    1 // size parameters
                );
                emitter.emitRate = 100;
                // Stop emitting almost immediately to create a burst
                setTimeout(() => emitter.destroy(), 100);
            }
        }
        return super.collideWithObject(o);
    }

    render() {
        this.drawColor = this.color;
        super.render();
    }
}

// --- Stagehand (NPC) Class ---
class Stagehand extends EngineObject {
    constructor(pos, patrolDistance) {
        super(pos, vec2(1, 1));

        // Cyan color
        this.color = new Color(0, 1, 1);

        // Physics settings
        this.setCollision(1, 1);
        this.mass = 0; // Infinite mass so player doesn't push them easily, but they can move

        // Patrol settings
        this.startPos = pos.copy();
        this.patrolDistance = patrolDistance;
        this.moveSpeed = 0.05;
        this.direction = 1; // 1 for right, -1 for left
        this.dialogueCooldown = 0;
    }

    update() {
        super.update();

        // Horizontal patrol
        this.velocity.x = this.direction * this.moveSpeed;

        if (Math.abs(this.pos.x - this.startPos.x) > this.patrolDistance) {
            this.direction *= -1; // Reverse direction
        }

        // Vibrate effect
        this.pos.y = this.startPos.y + (Math.random() * 0.1 - 0.05);

        if (this.dialogueCooldown > 0) {
            this.dialogueCooldown--;
        }
    }

    collideWithObject(o) {
        if (o === phoenix && this.dialogueCooldown <= 0) {
            stateManager.emit('showDialogue', {
                text: "Maria! Why are you glowing neon pink and melting?!",
                sender: "Stagehand"
            });
            this.dialogueCooldown = 180; // ~3 seconds at 60fps

            // Hide dialogue after some time
            setTimeout(() => {
                stateManager.emit('hideDialogue');
            }, 3000);
        }
        return super.collideWithObject(o);
    }

    render() {
        this.drawColor = this.color;
        super.render();
    }
}

// --- Poster Class ---
class Poster extends EngineObject {
    constructor(pos) {
        super(pos, vec2(2, 1)); // Wider than tall
        this.color = new Color(0.8, 0.8, 0.8);
        this.setCollision(0, 0); // No collision, just a trigger area
        this.isDialogueActive = false;
    }

    update() {
        super.update();

        const dist = this.pos.distance(phoenix.pos);
        if (dist < 2 && keyWasPressed("KeyE")) {
            if (!this.isDialogueActive) {
                stateManager.emit("showDialogue", {
                    text: "POSTER: Approved corporate coversheet list. Track 1: Y.M.C.A.",
                    sender: "System"
                });
                this.isDialogueActive = true;
            } else {
                stateManager.emit("hideDialogue");
                this.isDialogueActive = false;
            }
        }

        if (dist >= 2 && this.isDialogueActive) {
            stateManager.emit("hideDialogue");
            this.isDialogueActive = false;
        }
    }

    render() {
        this.drawColor = this.color;
        super.render();
    }
}

// --- Stage Door Class ---
class StageDoor extends EngineObject {
    constructor(pos) {
        super(pos, vec2(1, 3));
        this.color = new Color(1, 0, 0.5); // Glowing magenta
        this.setCollision(1, 1);
        this.mass = 0; // Static
    }

    collideWithObject(o) {
        if (o === phoenix && keyWasPressed("KeyE")) {
            stateManager.transitionTo("GALA");
        }
        return super.collideWithObject(o);
    }

    update() {
        super.update();
        const dist = this.pos.distance(phoenix.pos);
        if (dist < 2 && keyWasPressed("KeyE")) {
            stateManager.transitionTo("GALA");
        }
    }

    render() {
        this.drawColor = this.color;
        super.render();
    }
}

export function backstageInit() {
    // Setup Level Layout (30x17)
    // Left Zone (Dressing Room): x: 0-10
    // Center Zone (Hallway): x: 10-20
    // Right Zone (Stage Entrance): x: 20-30

    // Boundary walls (using EngineObject as simple walls)
    // Floor is implicit (black background)

    // Top wall
    const topWall = new EngineObject(vec2(15, 17), vec2(30, 1));
    topWall.color = new Color(0.2, 0.2, 0.2);
    topWall.setCollision(1, 1);
    topWall.mass = 0;
    topWall.render = function() { this.drawColor = this.color; EngineObject.prototype.render.call(this); };

    // Bottom wall
    const bottomWall = new EngineObject(vec2(15, 0), vec2(30, 1));
    bottomWall.color = new Color(0.2, 0.2, 0.2);
    bottomWall.setCollision(1, 1);
    bottomWall.mass = 0;
    bottomWall.render = function() { this.drawColor = this.color; EngineObject.prototype.render.call(this); };

    // Left wall
    const leftWall = new EngineObject(vec2(0, 8.5), vec2(1, 17));
    leftWall.color = new Color(0.2, 0.2, 0.2);
    leftWall.setCollision(1, 1);
    leftWall.mass = 0;
    leftWall.render = function() { this.drawColor = this.color; EngineObject.prototype.render.call(this); };

    // Right wall
    const rightWall = new EngineObject(vec2(30, 8.5), vec2(1, 17));
    rightWall.color = new Color(0.2, 0.2, 0.2);
    rightWall.setCollision(1, 1);
    rightWall.mass = 0;
    rightWall.render = function() { this.drawColor = this.color; EngineObject.prototype.render.call(this); };

    // Phoenix starts in the dressing room
    phoenix = new Phoenix(vec2(3, 8));

    // Poster on the top wall of dressing room
    poster = new Poster(vec2(5, 16));

    // Hallway props
    for (let i = 0; i < 5; i++) {
        props.push(new Prop(vec2(12 + Math.random() * 6, 4 + i * 2)));
    }

    // Stagehands patrolling in the stage entrance
    npcs.push(new Stagehand(vec2(22, 5), 3));
    npcs.push(new Stagehand(vec2(25, 10), 4));
    npcs.push(new Stagehand(vec2(28, 14), 2));

    // Stage door in the bottom right corner
    stageDoor = new StageDoor(vec2(29.5, 2));
}

export function backstageUpdate() {}
export function backstageUpdatePost() {}
export function backstageRender() {}
export function backstageRenderPost() {}
