/**
 * @file domOverlay.js
 * @description A lightweight DOM module that binds state metrics to the #hud-overlay layer.
 * Listens to stateManager events to render appropriate UI.
 */

import { stateManager } from './stateManager.js';

class DOMOverlay {
    constructor() {
        this.overlayEl = document.getElementById('hud-overlay');
        if (!this.overlayEl) {
            console.error('[DOMOverlay] #hud-overlay element not found!');
            return;
        }

        // Bind the method to ensure 'this' context is correct when called by event emitter
        this.handleStateChange = this.handleStateChange.bind(this);

        // Subscribe to state changes
        stateManager.subscribe('stateChange', this.handleStateChange);

        console.log('[DOMOverlay] Initialized and subscribed to stateManager.');
    }

    /**
     * Clear the current overlay content.
     */
    clearOverlay() {
        this.overlayEl.innerHTML = '';
    }

    /**
     * Handle state transitions and render the corresponding UI.
     * @param {Object} data - Contains previousState and newState.
     */
    handleStateChange({ previousState, newState }) {
        this.clearOverlay();

        switch (newState) {
            case 'BACKSTAGE':
                this.renderBackstageHUD();
                break;
            case 'GALA':
                this.renderGalaHUD();
                break;
            case 'RAFTERS':
                this.renderRaftersHUD();
                break;
            case 'SHOWDOWN':
                this.renderShowdownHUD();
                break;
            case 'ESCAPE':
                this.renderEscapeHUD();
                break;
            default:
                console.warn(`[DOMOverlay] No HUD rendering defined for state: ${newState}`);
        }
    }

    // --- State-specific Rendering Methods ---

    renderBackstageHUD() {
        const panel = document.createElement('div');
        panel.className = 'hud-panel';
        panel.style.position = 'absolute';
        panel.style.bottom = '20px';
        panel.style.left = '20px';
        panel.style.width = 'calc(100% - 40px)';

        panel.innerHTML = `
            <h2 class="glitch-text">BACKSTAGE</h2>
            <p>System Check: OK. Awaiting cue...</p>
            <div style="display: flex; gap: 10px; margin-top: 15px;">
                <button class="punk-btn" id="btn-next-state">ENTER GALA</button>
            </div>
        `;

        this.overlayEl.appendChild(panel);

        // Example interactivity: manually trigger next state
        document.getElementById('btn-next-state').addEventListener('click', () => {
            stateManager.setState('GALA');
        });
    }

    renderGalaHUD() {
        const panel = document.createElement('div');
        panel.className = 'hud-panel';
        panel.style.position = 'absolute';
        panel.style.top = '20px';
        panel.style.right = '20px';

        panel.innerHTML = `
            <h2 class="glitch-text" style="color: var(--neon-pink)">GALA</h2>
            <p>HP: <span style="color: var(--neon-green)">100/100</span></p>
            <p>Status: Mingling</p>
            <button class="punk-btn" id="btn-next-state" style="margin-top: 10px;">TO THE RAFTERS</button>
        `;

        this.overlayEl.appendChild(panel);

        document.getElementById('btn-next-state').addEventListener('click', () => {
            stateManager.setState('RAFTERS');
        });
    }

    renderRaftersHUD() {
        const panel = document.createElement('div');
        panel.className = 'hud-panel';
        panel.style.position = 'absolute';
        panel.style.top = '20px';
        panel.style.left = '20px';

        panel.innerHTML = `
            <h2 class="glitch-text">RAFTERS</h2>
            <p>Stealth Mode: <span style="color: yellow">ACTIVE</span></p>
            <button class="punk-btn" id="btn-next-state" style="margin-top: 10px;">TRIGGER SHOWDOWN</button>
        `;

        this.overlayEl.appendChild(panel);

        document.getElementById('btn-next-state').addEventListener('click', () => {
            stateManager.setState('SHOWDOWN');
        });
    }

    renderShowdownHUD() {
        const panel = document.createElement('div');
        panel.className = 'hud-panel';
        panel.style.position = 'absolute';
        panel.style.bottom = '20px';
        panel.style.left = '50%';
        panel.style.transform = 'translateX(-50%)';
        panel.style.textAlign = 'center';

        panel.innerHTML = `
            <h1 class="glitch-text" style="color: red; border-color: red;">SHOWDOWN</h1>
            <p>BOSS HP: <span style="color: red">5000/5000</span></p>
            <button class="punk-btn" id="btn-next-state" style="border-color: red; color: red;">ESCAPE!</button>
        `;

        this.overlayEl.appendChild(panel);

        document.getElementById('btn-next-state').addEventListener('click', () => {
            stateManager.setState('ESCAPE');
        });
    }

    renderEscapeHUD() {
         const panel = document.createElement('div');
        panel.className = 'hud-panel';
        panel.style.position = 'absolute';
        panel.style.top = '50%';
        panel.style.left = '50%';
        panel.style.transform = 'translate(-50%, -50%)';
        panel.style.textAlign = 'center';

        panel.innerHTML = `
            <h1 class="glitch-text" style="color: cyan;">ESCAPE SEQUENCE</h1>
            <p>RUN!</p>
            <button class="punk-btn" id="btn-next-state">RESTART BACKSTAGE</button>
        `;

        this.overlayEl.appendChild(panel);

        document.getElementById('btn-next-state').addEventListener('click', () => {
            stateManager.setState('BACKSTAGE');
        });
    }
}

// Export a singleton instance
export const domOverlay = new DOMOverlay();
