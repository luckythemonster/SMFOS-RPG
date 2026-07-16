import { engineInit, setCanvasFixedSize, setTileDefaultBleed, vec2 } from 'littlejsengine';
import { stateManager } from './stateManager.js';
import { setupDomOverlay } from './domOverlay.js';
import { backstageInit, backstageUpdate, backstageUpdatePost, backstageRender, backstageRenderPost } from './backstage.js';
import { initGalaMinigame, teardownGalaMinigame, galaUpdate } from './galaMinigame.js';
import { initGalaCanvas, teardownGalaCanvas, galaCanvasUpdate, galaCanvasRender } from './galaCanvas.js';
import { initRafters, updateRafters, renderRafters, teardownRafters } from './rafterScramble.js';
import { initCombat, teardownCombat, updateCombat, renderCombat } from './combatEngine.js';
import { initEscape, teardownEscape, updateEscape, renderEscape } from './airshipEscape.js';


// LittleJS initialization parameters
const canvasWidth = 480;
const canvasHeight = 270;

let previousState = 'BACKSTAGE';

function gameInit() {
    setCanvasFixedSize(vec2(canvasWidth, canvasHeight));
    setTileDefaultBleed(0.5);

    // Initial state setup
    if (stateManager.currentState === 'BACKSTAGE') {
        backstageInit();
    } else if (stateManager.currentState === 'GALA') {
        initGalaMinigame();
        initGalaCanvas();
    } else if (stateManager.currentState === 'RAFTERS') {
        initRafters();
    } else if (stateManager.currentState === 'SHOWDOWN') {
        initCombat();
    } else if (stateManager.currentState === 'ESCAPE') {
        initEscape();
    }

    previousState = stateManager.currentState;

    // Handle transitions
    stateManager.on('stateChange', (newState) => {
        // Teardown previous
        if (previousState === 'GALA') {
            teardownGalaMinigame();
            teardownGalaCanvas();
        } else if (previousState === 'RAFTERS') {
            teardownRafters();
        } else if (previousState === 'SHOWDOWN') {
            if (typeof teardownCombat === 'function') teardownCombat();
        } else if (previousState === 'ESCAPE') {
            if (typeof teardownEscape === 'function') teardownEscape();
        }

        // Init new
        if (newState === 'GALA') {
            initGalaMinigame();
            initGalaCanvas();
        } else if (newState === 'RAFTERS') {
            initRafters();
        } else if (newState === 'SHOWDOWN') {
            initCombat();
        } else if (newState === 'ESCAPE') {
            initEscape();
        }

        previousState = newState;
    });
}

function gameUpdate() {
    if (stateManager.currentState === 'BACKSTAGE') {
        backstageUpdate();
    } else if (stateManager.currentState === 'GALA') {
        galaUpdate();
        galaCanvasUpdate();
    } else if (stateManager.currentState === 'RAFTERS') {
        updateRafters();
    } else if (stateManager.currentState === 'SHOWDOWN') {
        if (typeof updateCombat === 'function') updateCombat();
    } else if (stateManager.currentState === 'ESCAPE') {
        updateEscape();
    }
}

function gameUpdatePost() {
    if (stateManager.currentState === 'BACKSTAGE') {
        backstageUpdatePost();
    }
}

function gameRender() {
    if (stateManager.currentState === 'BACKSTAGE') {
        backstageRender();
    } else if (stateManager.currentState === 'GALA') {
        galaCanvasRender();
    } else if (stateManager.currentState === 'RAFTERS') {
        renderRafters();
    } else if (stateManager.currentState === 'SHOWDOWN') {
        if (typeof renderCombat === 'function') renderCombat();
    } else if (stateManager.currentState === 'ESCAPE') {
        renderEscape();
    }
}

function gameRenderPost() {
    if (stateManager.currentState === 'BACKSTAGE') {
        backstageRenderPost();
    }
}

// Start Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost);

// Initialize DOM Overlay
setupDomOverlay();

// HMR manual reload hook to prevent LittleJS global state leakage
if (import.meta.hot) {
    import.meta.hot.accept(() => location.reload());
}
