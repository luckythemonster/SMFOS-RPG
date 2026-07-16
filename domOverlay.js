import { stateManager } from './stateManager.js';

export function setupDomOverlay() {
    const dialogueBox = document.getElementById('dialogueBox');
    const dialogueSender = document.getElementById('dialogueSender');
    const dialogueText = document.getElementById('dialogueText');
    const timerContainer = document.getElementById('timerContainer');
    const timerText = document.getElementById('timerText');

    stateManager.on('showDialogue', (data) => {
        dialogueSender.textContent = data.sender;
        dialogueText.textContent = data.text;
        dialogueBox.classList.remove('hidden');
    });

    stateManager.on('hideDialogue', () => {
        dialogueBox.classList.add('hidden');
    });

    stateManager.on('rafterTimerShow', () => {
        if (timerContainer) timerContainer.classList.remove('hidden');
    });

    stateManager.on('rafterTimerHide', () => {
        if (timerContainer) {
            timerContainer.classList.add('hidden');
            timerText.classList.remove('timer-danger');
        }
    });

    stateManager.on('rafterTimerUpdate', (data) => {
        if (timerText) {
            timerText.textContent = data.time.toString();
            if (data.time < 10) {
                timerText.classList.add('timer-danger');
            } else {
                timerText.classList.remove('timer-danger');
            }
        }
    });
}
