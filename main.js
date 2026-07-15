import { engineInit, setCanvasFixedSize, setTileDefaultBleed, mainCanvas } from 'littlejsengine';
import { stateManager } from './stateManager.js';
import { setupDomOverlay } from './domOverlay.js';
import { backstageInit, backstageUpdate, backstageUpdatePost, backstageRender, backstageRenderPost } from './backstage.js';

// LittleJS initialization parameters
const canvasWidth = 480;
const canvasHeight = 270;

function gameInit() {
    setCanvasFixedSize(vec2(canvasWidth, canvasHeight));
    setTileDefaultBleed(0.5);

    // Initialize current state
    if (stateManager.currentState === 'BACKSTAGE') {
        backstageInit();
    }
}

function gameUpdate() {
    if (stateManager.currentState === 'BACKSTAGE') {
        backstageUpdate();
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
