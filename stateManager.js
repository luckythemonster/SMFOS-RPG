// stateManager.js
class StateManager {
    constructor() {
        this.events = {};
        this.currentState = 'BACKSTAGE';
    }

    on(event, listener) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(listener);
    }

    emit(event, data) {
        if (this.events[event]) {
            this.events[event].forEach(listener => listener(data));
        }
    }

    transitionTo(newState) {
        console.log(`Transitioning state: ${this.currentState} -> ${newState}`);
        this.currentState = newState;
        this.emit('stateChange', newState);
    }
}

export const stateManager = new StateManager();
