/**
 * @file canvasEngine.js
 * @description Initializes LittleJS and handles the main game loop, rendering, and WebGL context.
 */

import {
    engineInit,
    setCameraPos,
    setCanvasFixedSize,
    setTileDefaultBleed,
    drawRect,
    vec2,
    rgb,
    hsl
} from 'littlejsengine';

import { stateManager } from './stateManager.js';

class CanvasEngine {
    constructor() {
        this.currentState = null;

        // Bind methods
        this.gameInit = this.gameInit.bind(this);
        this.gameUpdate = this.gameUpdate.bind(this);
        this.gameUpdatePost = this.gameUpdatePost.bind(this);
        this.gameRender = this.gameRender.bind(this);
        this.gameRenderPost = this.gameRenderPost.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);

        // Subscribe to state changes to alter rendering logic
        stateManager.subscribe('stateChange', this.handleStateChange);
    }

    /**
     * Start the LittleJS engine.
     */
    start() {
        console.log('[CanvasEngine] Initializing LittleJS...');

        // Configure LittleJS
        // Prevent tile seam artifacts
        setTileDefaultBleed(0.5);

        // Target resolution of 480x270 (16:9)
        setCanvasFixedSize(vec2(480, 270));

        // Start the engine with our callbacks
        engineInit(
            this.gameInit,
            this.gameUpdate,
            this.gameUpdatePost,
            this.gameRender,
            this.gameRenderPost
            // We pass an empty string for the image source to mock it for now.
            // When an image is ready, pass 'tiles.png' here.
            // ''
        );
    }

    handleStateChange({ previousState, newState }) {
        console.log(`[CanvasEngine] Reacting to state change: ${newState}`);
        this.currentState = newState;
        // In a full game, we would clean up entities from previousState and spawn entities for newState here.
    }

    // --- LittleJS Engine Callbacks ---

    gameInit() {
        console.log('[CanvasEngine] Game Init completed.');
        // Center camera
        setCameraPos(vec2(0, 0));
    }

    gameUpdate() {
        // Update game logic (physics, input, etc.) per frame
    }

    gameUpdatePost() {
        // Post-update logic (camera tracking, etc.)
    }

    gameRender() {
        // Render game objects.
        // We use mocked shapes/colors based on the current state.

        const state = this.currentState || stateManager.getState();

        switch (state) {
            case 'BACKSTAGE':
                // Dark, brooding colors
                drawRect(vec2(0, 0), vec2(20, 15), rgb(0.1, 0.1, 0.1));
                // A mock character/object
                drawRect(vec2(-2, 0), vec2(2, 4), rgb(0.8, 0.2, 0.8)); // Neon pinkish
                break;

            case 'GALA':
                // Bright, flashing colors
                drawRect(vec2(0, 0), vec2(20, 15), rgb(0.2, 0.0, 0.2));
                // Mock crowd
                for(let i=0; i<5; i++) {
                   drawRect(vec2(-5 + i*2.5, Math.sin(Date.now()/500 + i)*2), vec2(1, 2), hsl(i*0.2, 1, 0.5));
                }
                break;

            case 'RAFTERS':
                // Stealthy, high altitude
                drawRect(vec2(0, 0), vec2(20, 15), rgb(0.05, 0.05, 0.1));
                // Mock beams
                drawRect(vec2(0, -3), vec2(20, 1), rgb(0.3, 0.3, 0.3));
                // Player sneaking
                drawRect(vec2(0, -2.5), vec2(1, 1), rgb(0, 1, 0)); // Neon green
                break;

            case 'SHOWDOWN':
                // Aggressive red/orange
                drawRect(vec2(0, 0), vec2(20, 15), rgb(0.2, 0, 0));
                // Boss
                drawRect(vec2(0, 2), vec2(6, 6), rgb(1, 0, 0));
                // Player
                drawRect(vec2(0, -4), vec2(2, 2), rgb(0, 1, 0));
                break;

            case 'ESCAPE':
                // Moving background effect
                drawRect(vec2(0, 0), vec2(20, 15), rgb(0, 0.1, 0.2));
                let offset = (Date.now() / 100) % 5;
                for(let i=-2; i<3; i++) {
                    drawRect(vec2(0, i*5 - offset), vec2(20, 0.5), rgb(0, 0.5, 1));
                }
                break;

            default:
                // Default empty state
                drawRect(vec2(0, 0), vec2(20, 15), rgb(0, 0, 0));
                break;
        }
    }

    gameRenderPost() {
        // Draw things over the main game but under the DOM overlay (e.g., debug text)
    }
}

export const canvasEngine = new CanvasEngine();
