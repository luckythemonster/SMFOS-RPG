import { vec2, rgb, drawRect, drawText, keyWasPressed, setCameraPos, rand } from 'littlejsengine';
import { stateManager } from './stateManager.js';

// Combat entities
let party = [];
let enemies = [];
let combatState = 'INIT'; // INIT, MENU, PLAYER_EXECUTE, ENEMY_TURN, VICTORY, ESCAPE
let currentTurnIndex = 0;
let actionQueue = [];
let messageTimer = 0;
let messageText = '';

// Particle systems / VFX states
let vfx = [];

const COLORS = {
    phoenix: rgb(1, 0.2, 0.2),
    sticky: rgb(0.2, 1, 0.6),
    billy: rgb(1, 0.8, 0.2),
    mech: rgb(0.5, 0.5, 0.5),
    mechHurt: rgb(0.8, 0.2, 0.2),
};

export function initCombat() {
    setCameraPos(vec2(0, 0)); // Center camera

    // Initialize party (right side)
    party = [
        { name: 'Phoenix', hp: 100, maxHp: 100, pos: vec2(150, 40), color: COLORS.phoenix, targetable: true, dots: [] },
        { name: 'Sticky', hp: 150, maxHp: 150, pos: vec2(130, 0), color: COLORS.sticky, targetable: true, tauntDuration: 0, dots: [] },
        { name: 'Billy Ruben', hp: 80, maxHp: 80, pos: vec2(150, -40), color: COLORS.billy, targetable: true, dots: [] }
    ];

    // Initialize enemies (left side)
    enemies = [
        { name: 'Riot Mech 1', hp: 200, maxHp: 200, pos: vec2(-150, 20), color: COLORS.mech, targetable: true, dots: [] },
        { name: 'Riot Mech 2', hp: 200, maxHp: 200, pos: vec2(-150, -20), color: COLORS.mech, targetable: true, dots: [] }
    ];

    combatState = 'MENU';
    currentTurnIndex = 0;
    actionQueue = [];
    vfx = [];

    // Tell UI to show combat menu
    stateManager.emit('showCombatMenu', { party, enemies, currentTurnIndex });
}

function updateVFX() {
    for (let i = vfx.length - 1; i >= 0; i--) {
        vfx[i].timer -= 1/60;
        if (vfx[i].timer <= 0) vfx.splice(i, 1);
    }
}

function renderVFX() {
    for (const v of vfx) {
        if (v.type === 'LIGHTNING') {
            // Draw a zig-zag line down to the target
            let current = vec2(v.pos.x, v.pos.y + 100);
            for (let i = 0; i < 5; i++) {
                let next = vec2(v.pos.x + rand(-20, 20), v.pos.y + 100 - (i+1)*20);
                if (i === 4) next = v.pos;
                // LittleJS line drawing approximation using rotated rects is tricky,
                // just drawing small rects along the path as "sparks" for retro feel
                drawRect(current, vec2(5, 20), rgb(1, 1, 0));
                current = next;
            }
        } else if (v.type === 'MELT') {
            // Green bubbles rising
            for(let i=0; i<10; i++) {
                drawRect(vec2(v.pos.x + rand(-15, 15), v.pos.y + rand(-15, 15)), vec2(4, 4), rgb(0, 1, 0));
            }
        }
    }
}

export function updateCombat() {
    updateVFX();
    if (combatState === 'MENU') {
        // Handled by UI mostly, waiting for events
    } else if (combatState === 'PLAYER_EXECUTE') {
        // Nothing here, async handled
    } else if (combatState === 'MINIGAME_BILLY') {
        updateBillyMinigame();
    } else if (combatState === 'MINIGAME_STICKY') {
        updateStickyMinigame();
    } else if (combatState === 'ENEMY_TURN') {
        // Enemy logic...
    } else if (combatState === 'VICTORY') {
        messageTimer -= 1/60;
        if (messageTimer <= 0) {
            stateManager.transitionTo('ESCAPE');
        }
    }
}

export function renderCombat() {
    // Draw Party
    for (const p of party) {
        if (p.hp > 0) {
            drawRect(p.pos, vec2(20, 20), p.color);
            // Draw HP bar
            drawRect(vec2(p.pos.x, p.pos.y + 15), vec2(20, 4), rgb(0,0,0));
            drawRect(vec2(p.pos.x - 10 + (p.hp/p.maxHp)*10, p.pos.y + 15), vec2(20 * (p.hp/p.maxHp), 4), rgb(0,1,0));
            if (p.tauntDuration > 0) {
                // Runic decoy aura
                drawRect(p.pos, vec2(24, 24), rgb(0, 1, 1, 0.5));
            }
        }
    }

    // Draw Enemies
    for (const e of enemies) {
        if (e.hp > 0) {
            drawRect(e.pos, vec2(30, 30), e.color);
            // Draw HP bar
            drawRect(vec2(e.pos.x, e.pos.y + 20), vec2(30, 5), rgb(0,0,0));
            drawRect(vec2(e.pos.x - 15 + (e.hp/e.maxHp)*15, e.pos.y + 20), vec2(30 * (e.hp/e.maxHp), 5), rgb(1,0,0));
        }
    }

    renderVFX();
    if (combatState === 'MINIGAME_BILLY') renderBillyMinigame();
    if (combatState === 'MINIGAME_STICKY') renderStickyMinigame();

    if (messageTimer > 0) {
        drawText(messageText, vec2(0, 80), 20, rgb(1,1,1), 2, rgb(0,0,0));
    }
}

export function teardownCombat() {
    stateManager.emit('hideCombatMenu');
}

export function queueAction(action) {
    actionQueue.push(action);
    currentTurnIndex++;
    if (currentTurnIndex >= party.length) {
        combatState = 'PLAYER_EXECUTE';
        stateManager.emit('hideCombatMenu');
        executeNextAction();
    } else {
        stateManager.emit('updateCombatMenu', { currentTurnIndex });
    }
}

let activeAction = null;
let actionTimer = 0;

function executeNextAction() {
    if (actionQueue.length === 0) {
        combatState = 'ENEMY_TURN';
        executeEnemyTurn();
        return;
    }

    activeAction = actionQueue.shift();
    if (activeAction.type === 'BILLY_STRIKE') {
        // Start Billy's Rhythm Minigame
        triggerBillyMinigame(activeAction.target); combatState = "MINIGAME_BILLY";
    } else if (activeAction.type === 'STICKY_DECOY') {
        triggerStickyMinigame(); combatState = "MINIGAME_STICKY";
    } else if (activeAction.type === 'PHOENIX_MELT') {
        executePhoenixMelt(activeAction.target);
    } else {
        // Basic attack fallback
        executeBasicAttack(activeAction.actor, activeAction.target);
    }
}

function executePhoenixMelt(targetIndex) {
    if (enemies[targetIndex] && enemies[targetIndex].hp > 0) {
        // Apply DOT
        enemies[targetIndex].dots.push({ timer: 3, damage: 15 });
        showMessage("Phoenix applied Slime Melter!");
        vfx.push({ type: 'MELT', pos: enemies[targetIndex].pos, timer: 1.0 });
    }
    setTimeout(executeNextAction, 1000);
}

function executeBasicAttack(actorIndex, targetIndex) {
     setTimeout(executeNextAction, 500);
}

function executeEnemyTurn() {
    // Enemy AI
    let aliveEnemies = enemies.filter(e => e.hp > 0);
    if (aliveEnemies.length === 0) {
        combatState = 'VICTORY';
        showMessage("MECHS DEFEATED!");
        return;
    }

    let enemyIndex = 0;
    function nextEnemy() {
        if (enemyIndex >= aliveEnemies.length) {
            // End of enemy turn, process DOTs and tick taunt
            processTurnEnd();
            return;
        }

        let e = aliveEnemies[enemyIndex];
        let targets = party.filter(p => p.hp > 0);
        if (targets.length > 0) {
            let target = targets[rand(targets.length) | 0];
            // Sticky Taunt logic
            let sticky = party.find(p => p.name === 'Sticky' && p.hp > 0 && p.tauntDuration > 0);
            if (sticky) {
                target = sticky;
                showMessage("Mech attacks Sticky (Taunted)!");
            } else {
                showMessage(`Mech attacks ${target.name}!`);
            }
            target.hp -= 20;
        }

        enemyIndex++;
        setTimeout(nextEnemy, 1000);
    }
    nextEnemy();
}

function processTurnEnd() {
    // Process DOTs
    for (let e of enemies) {
        if (e.hp > 0) {
            for (let i = e.dots.length - 1; i >= 0; i--) {
                let dot = e.dots[i];
                e.hp -= dot.damage;
                vfx.push({ type: 'MELT', pos: e.pos, timer: 0.5 });
                showMessage(`Slime Melter ticked for ${dot.damage} damage!`);
                dot.timer--;
                if (dot.timer <= 0) e.dots.splice(i, 1);
            }
        }
    }

    for (let p of party) {
        if (p.hp > 0 && p.tauntDuration > 0) {
            p.tauntDuration--;
        }
    }

    // Check win/loss
    if (enemies.every(e => e.hp <= 0)) {
        combatState = 'VICTORY';
        showMessage("VICTORY!");
        return;
    }
    if (party.every(p => p.hp <= 0)) {
        combatState = 'DEFEAT';
        showMessage("PARTY WIPED!");
        return;
    }

    combatState = 'MENU';
    currentTurnIndex = 0;
    stateManager.emit('showCombatMenu', { party, enemies, currentTurnIndex });
}


function showMessage(text) {
    messageText = text;
    messageTimer = 2; // seconds
}

// Rhythm Minigame variables
let billyBeats = [];
let billyTimer = 0;
let billyHits = 0;
let billyTargetIndex = 0;

let stickyTimeline = 0;
let stickyBeats = [];
let stickyHits = 0;

// Expose these for the execution functions
export function triggerBillyMinigame(targetIndex) {
    billyTargetIndex = targetIndex;
    billyBeats = [0.5, 1.0, 1.5]; // times in seconds
    billyTimer = 0;
    billyHits = 0;
}

export function triggerStickyMinigame() {
    stickyTimeline = 0;
    // 13/8 simplified to a few off-beat presses
    stickyBeats = [0.3, 0.7, 1.2, 1.5, 2.1];
    stickyHits = 0;
}

// Update loops for minigames
export function updateBillyMinigame() {
    billyTimer += 1/60; // Assuming 60fps LittleJS update

    // Check for input
    if (keyWasPressed('Space')) {
        let hit = false;
        for (let i = 0; i < billyBeats.length; i++) {
            if (Math.abs(billyTimer - billyBeats[i]) < 0.15) {
                hit = true;
                billyHits++;
                billyBeats.splice(i, 1);
                showMessage("NICE!");
                break;
            }
        }
        if (!hit) showMessage("MISS!");
    }

    if (billyTimer > 2.0) {
        // End of minigame
        let damage = 20;
        if (billyHits === 3) damage = 60; // Bonus
        else if (billyHits > 0) damage = 30; // Partial

        if (enemies[billyTargetIndex]) {
            enemies[billyTargetIndex].hp -= damage;
            showMessage(`Billy dealt ${damage} damage!`);
            vfx.push({ type: 'LIGHTNING', pos: enemies[billyTargetIndex].pos, timer: 0.5 });
        }

        combatState = 'PLAYER_EXECUTE';
        setTimeout(executeNextAction, 1000);
    }
}

export function updateStickyMinigame() {
    stickyTimeline += 1/60;

    if (keyWasPressed('Space')) {
        let hit = false;
        for (let i = 0; i < stickyBeats.length; i++) {
            if (Math.abs(stickyTimeline - stickyBeats[i]) < 0.2) {
                hit = true;
                stickyHits++;
                stickyBeats.splice(i, 1);
                showMessage("RAD!");
                break;
            }
        }
        if (!hit) showMessage("CLANK!");
    }

    if (stickyTimeline > 2.5) {
        let sticky = party.find(p => p.name === 'Sticky');
        if (sticky) {
            if (stickyHits >= 4) {
                sticky.tauntDuration = 3;
                showMessage("Math Rock Decoy Active! (3 turns)");
            } else if (stickyHits >= 2) {
                sticky.tauntDuration = 1;
                showMessage("Math Rock Decoy Active! (1 turn)");
            } else {
                showMessage("Decoy Failed!");
            }
        }
        combatState = 'PLAYER_EXECUTE';
        setTimeout(executeNextAction, 1000);
    }
}

// Render loops for minigames
export function renderBillyMinigame() {
    drawText("AIR GUITAR STRIKE", vec2(0, 100), 20, rgb(1,1,1));
    drawRect(vec2(0, -100), vec2(200, 10), rgb(0,0,0)); // Track

    // Draw target line
    drawRect(vec2(-80, -100), vec2(5, 20), rgb(0,1,0));

    // Draw beats
    for (let beat of billyBeats) {
        let xPos = -80 + (beat - billyTimer) * 150; // Move left
        if (xPos > -100 && xPos < 100) {
            drawRect(vec2(xPos, -100), vec2(10, 10), rgb(1,0,1));
        }
    }
}

export function renderStickyMinigame() {
    drawText("13/8 MATH ROCK DECOY", vec2(0, 100), 20, rgb(1,1,1));
    drawRect(vec2(0, -100), vec2(300, 10), rgb(0,0,0)); // Track

    // Draw target line
    drawRect(vec2(-120, -100), vec2(5, 20), rgb(0,1,0));

    // Draw waveform overlay
    for (let i = 0; i < 30; i++) {
        let yOffset = Math.sin((stickyTimeline * 10) + i) * 15;
        drawRect(vec2(-150 + i * 10, -100 + yOffset), vec2(4, 4), rgb(1, 0.5, 0));
    }

    for (let beat of stickyBeats) {
        let xPos = -120 + (beat - stickyTimeline) * 100;
        if (xPos > -150 && xPos < 150) {
            drawRect(vec2(xPos, -100), vec2(8, 15), rgb(0,1,1));
        }
    }
}

// Export the current queue state for the UI
export function getCombatState() {
    return { combatState, party, enemies, currentTurnIndex };
}

// Hook up the action queue event
stateManager.on('queueCombatAction', (data) => {
    queueAction(data);
});

// Update the updateCombatMenu event to pass full state
stateManager.on('updateCombatMenu', (data) => {
    // Already handled by queueAction
});
