import { stateManager } from './stateManager.js';

let typingInterval = null;
let currentFullText = "";

export function setupDomOverlay() {
    const dialogueBox = document.getElementById('dialogueBox');
    const dialogueSender = document.getElementById('dialogueSender');
    const dialogueText = document.getElementById('dialogueText');
    const timerContainer = document.getElementById('timerContainer');
    const timerText = document.getElementById('timerText');

    // Cinematic Overlays
    const letterboxTop = document.getElementById('letterboxTop');
    const letterboxBottom = document.getElementById('letterboxBottom');
    const fadeOverlay = document.getElementById('fadeOverlay');
    const endLogo = document.getElementById('endLogo');
    const spacePrompt = document.getElementById('spacePrompt');

    function typewriter(text, element) {
        if (typingInterval) clearInterval(typingInterval);
        element.textContent = "";
        let i = 0;

        typingInterval = setInterval(() => {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
            } else {
                clearInterval(typingInterval);
                typingInterval = null;
                // Signal that typing is done
                stateManager.emit('dialogueTypingDone');
            }
        }, 30); // 30ms per character
    }

    dialogueBox.addEventListener('click', () => {
        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
            dialogueText.textContent = currentFullText;
            stateManager.emit('dialogueTypingDone');
        } else {
            // If already done typing and clicked, we can emit a next event
            stateManager.emit('dialogueNext');
        }
    });

    stateManager.on('showDialogue', (data) => {
        dialogueSender.textContent = data.sender;
        currentFullText = data.text;
        dialogueBox.classList.remove('hidden');
        typewriter(data.text, dialogueText);
    });

    stateManager.on('hideDialogue', () => {
        dialogueBox.classList.add('hidden');
        if (typingInterval) {
            clearInterval(typingInterval);
            typingInterval = null;
        }
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

    // Cinematic Events
    stateManager.on('showLetterbox', () => {
        letterboxTop.classList.remove('hidden');
        letterboxBottom.classList.remove('hidden');
        // Force reflow
        void letterboxTop.offsetWidth;
        letterboxTop.classList.add('active');
        letterboxBottom.classList.add('active');
    });

    stateManager.on('hideLetterbox', () => {
        letterboxTop.classList.remove('active');
        letterboxBottom.classList.remove('active');
        setTimeout(() => {
            letterboxTop.classList.add('hidden');
            letterboxBottom.classList.add('hidden');
        }, 1000);
    });

    stateManager.on('showSpacePrompt', () => {
        spacePrompt.classList.remove('hidden');
    });

    stateManager.on('hideSpacePrompt', () => {
        spacePrompt.classList.add('hidden');
    });

    stateManager.on('showFade', () => {
        fadeOverlay.classList.remove('hidden');
        endLogo.classList.remove('hidden');
        void fadeOverlay.offsetWidth;
        fadeOverlay.classList.add('active');
    });
}
