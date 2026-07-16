import { engineInit, setCanvasFixedSize, setTileDefaultBleed, vec2 } from 'littlejsengine';
import { stateManager } from './stateManager.js';
import { setupDomOverlay } from './domOverlay.js';
import { backstageInit, backstageUpdate, backstageUpdatePost, backstageRender, backstageRenderPost } from './backstage.js';
import { initGalaMinigame, teardownGalaMinigame, galaUpdate } from './galaMinigame.js';
import { initGalaCanvas, teardownGalaCanvas, galaCanvasUpdate, galaCanvasRender } from './galaCanvas.js';
import { initRafters, updateRafters, renderRafters, teardownRafters } from './rafterScramble.js';

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
        }

        // Init new
        if (newState === 'GALA') {
            initGalaMinigame();
            initGalaCanvas();
        } else if (newState === 'RAFTERS') {
            initRafters();
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
