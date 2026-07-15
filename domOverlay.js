import { stateManager } from './stateManager.js';

export function setupDomOverlay() {
    const dialogueBox = document.getElementById('dialogueBox');
    const dialogueSender = document.getElementById('dialogueSender');
    const dialogueText = document.getElementById('dialogueText');

    stateManager.on('showDialogue', (data) => {
        dialogueSender.textContent = data.sender;
        dialogueText.textContent = data.text;
        dialogueBox.classList.remove('hidden');
    });

    stateManager.on('hideDialogue', () => {
        dialogueBox.classList.add('hidden');
    });
}
