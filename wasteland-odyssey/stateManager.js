/**
 * @file stateManager.js
 * @description A global state machine coordinating game states via a lightweight Event Emitter (Pub/Sub) pattern.
 * Valid States: 'BACKSTAGE', 'GALA', 'RAFTERS', 'SHOWDOWN', 'ESCAPE'
 */

class StateManager {
    constructor() {
        this.states = ['BACKSTAGE', 'GALA', 'RAFTERS', 'SHOWDOWN', 'ESCAPE'];
        this.currentState = null;
        this.subscribers = {};
    }

    /**
     * Subscribe to a specific state change or general 'stateChange' events.
     * @param {string} event - The event name to listen for (e.g., 'stateChange').
     * @param {Function} callback - The function to execute when the event is emitted.
     */
    subscribe(event, callback) {
        if (!this.subscribers[event]) {
            this.subscribers[event] = [];
        }
        this.subscribers[event].push(callback);
    }

    /**
     * Unsubscribe a previously registered callback.
     * @param {string} event - The event name.
     * @param {Function} callback - The function to remove.
     */
    unsubscribe(event, callback) {
        if (!this.subscribers[event]) return;
        this.subscribers[event] = this.subscribers[event].filter(cb => cb !== callback);
    }

    /**
     * Emit an event to all subscribers.
     * @param {string} event - The event name.
     * @param {any} data - The data to pass to callbacks.
     */
    emit(event, data) {
        if (!this.subscribers[event]) return;
        this.subscribers[event].forEach(callback => callback(data));
    }

    /**
     * Change the current game state and notify subscribers.
     * @param {string} newState - The new state to transition to.
     */
    setState(newState) {
        if (!this.states.includes(newState)) {
            console.error(`[StateManager] Invalid state transition attempted: ${newState}`);
            return;
        }

        if (this.currentState === newState) {
            console.warn(`[StateManager] Already in state: ${newState}`);
            return;
        }

        const previousState = this.currentState;
        this.currentState = newState;

        console.log(`[StateManager] State changed: ${previousState} -> ${newState}`);

        // Notify subscribers of the change
        this.emit('stateChange', {
            previousState,
            newState
        });
    }

    /**
     * Get the current state.
     * @returns {string|null} The current state.
     */
    getState() {
        return this.currentState;
    }
}

// Export a singleton instance
export const stateManager = new StateManager();
