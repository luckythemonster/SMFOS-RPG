/**
 * @file main.js
 * @description Main entry point. Bootstraps the application, configures the state manager, and handles Vite HMR.
 */

import { stateManager } from './stateManager.js';
import { canvasEngine } from './canvasEngine.js';
// We import domOverlay to ensure it initializes and subscribes to stateManager
import './domOverlay.js';

// Vite Hot Module Replacement (HMR) hook
// Forces a full page reload when code changes to prevent LittleJS state leakage.
if (import.meta.hot) {
    import.meta.hot.accept(() => location.reload());
}

function bootstrap() {
    console.log('[Main] Bootstrapping Wasteland Odyssey...');

    // 1. Start the canvas engine (LittleJS)
    canvasEngine.start();

    // 2. Set the initial game state
    // This will trigger events to both canvasEngine and domOverlay
    stateManager.setState('BACKSTAGE');
}

// Start the game
bootstrap();
