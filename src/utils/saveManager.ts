/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

const SAVE_KEY = 'smfos_save';

/**
 * Saves the current game state to local storage.
 * @param state The game state object to save.
 */
export function saveGame(state: any) {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(SAVE_KEY, serializedState);
    return true;
  } catch (err) {
    console.error('Failed to save game:', err);
    return false;
  }
}

/**
 * Loads the game state from local storage.
 * @returns The saved game state or null if no save exists.
 */
export function loadGame() {
  try {
    const serializedState = localStorage.getItem(SAVE_KEY);
    if (serializedState === null) {
      return null;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Failed to load game:', err);
    return null;
  }
}

/**
 * Clears the saved game state from local storage.
 */
export function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}
