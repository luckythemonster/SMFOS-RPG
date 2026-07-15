import { engineInit, setCanvasFixedSize, setTileDefaultBleed, vec2 } from 'littlejsengine';
import { stateManager } from './stateManager.js';
import { setupDomOverlay } from './domOverlay.js';
import { backstageInit, backstageUpdate, backstageUpdatePost, backstageRender, backstageRenderPost } from './backstage.js';
import { initGalaMinigame, teardownGalaMinigame, galaUpdate } from './galaMinigame.js';
import { initGalaCanvas, teardownGalaCanvas, galaCanvasUpdate, galaCanvasRender } from './galaCanvas.js';

// LittleJS initialization parameters
const canvasWidth = 480;
const canvasHeight = 270;

function gameInit() {
    setCanvasFixedSize(vec2(canvasWidth, canvasHeight));
    setTileDefaultBleed(0.5);

    // Initial state setup
    if (stateManager.currentState === 'BACKSTAGE') {
        backstageInit();
    } else if (stateManager.currentState === 'GALA') {
        initGalaMinigame();
        initGalaCanvas();
    }

    // Handle transitions
    stateManager.on('stateChange', (newState) => {
        // Teardown previous (we just check the transitions for now, usually you'd keep track of old state)
        // Here we just teardown everything to be safe or map properly.
        // Actually since we only have BACKSTAGE -> GALA -> RAFTERS defined right now:
        if (newState === 'GALA') {
            // Teardown backstage if needed
            initGalaMinigame();
            initGalaCanvas();
        } else if (newState === 'RAFTERS') {
            teardownGalaMinigame();
            teardownGalaCanvas();
            // initRafters() would go here
        }
    });
}

function gameUpdate() {
    if (stateManager.currentState === 'BACKSTAGE') {
        backstageUpdate();
    } else if (stateManager.currentState === 'GALA') {
        galaUpdate();
        galaCanvasUpdate();
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
