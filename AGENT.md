# Slime Monsters from Outer Space - Coding and Architectural Guidelines

We are building a retro-punk JRPG web prototype.

## Tech Stack
* **Framework:** React (TypeScript)
* **Styling:** Tailwind CSS

## Architecture & Structure
### Directory Maps
Files must be placed in their respective directories exactly as follows:
* `src/components/`: Reusable UI components.
* `src/hooks/`: Custom React hooks.
* `src/state/`: State management logic.

### State Management Protocol
* Use a lightweight, localized React Context or a basic state machine.
* Do not use complex state libraries like Redux or Zustand. Simple state-drilling or Context is preferred.

### Asset/Mock Strategy
Real art assets are not yet available. Use the following strategies for placeholders:
* High-contrast colored placeholder divs.
* Emoji sprites (e.g., 🟢 for Phoenix, 🤖 for Sticky).
* Inline SVGs.

## Game States & Transitions
The vertical slice includes the following gameplay states. Do not deviate from this state machine pipeline.

1. **BACKSTAGE** -> **Trigger:** Player interacts with the Dressing Room tile after grabbing Kwik Trip loot.
2. **YMCA_GALA** -> **Trigger:** Player completes the rhythm meter to 100% (or triggers the "fail/fight" state).
3. **RAFTER_DASH** -> **Trigger:** Timer hits zero or characters successfully reach the end of the rafters lane.
4. **COMBAT_SCREEN** -> **Trigger:** The stage boss (Corporate Riot Mechs) is defeated.
5. **AIRSHIP_HEIST_OUTRO** -> **Trigger:** Interactive panels conclude.

## Tailwind Configuration (Neon Crust-Punk)
The aesthetic is 'Neon Crust-Punk'. Do not use conceptual descriptions or default Tailwind colors. You must use the following explicit hex codes, registered as custom Tailwind extensions or CSS custom variables:

* **Acid Slime Green:** `#39FF14` (Phoenix)
* **Toxic Warning Magenta:** `#FF007F` (Lucky/Menu Highlights)
* **Warning Stripe Yellow:** `#FFD700` (Rafter Lane Gaps)
* **Wasteland Charcoal:** `#121214` (Main Screen Backgrounds)
* **Radioactive Purple:** `#8A2BE2` (Slime Sea/Donald Trump's Laser)

## Button Styling & Mobile Rules
All interactive buttons must be styled like chunky arcade cabinets and be mobile-bug-resistant.

### Chunky Arcade Style CSS
Use the following principles to build buttons with a 3D physical "push" effect:

```css
/* Instruct Jules to build buttons with a 3D physical "push" effect */
.btn-arcade-cyan {
  @apply bg-cyan-400 border-4 border-black text-black font-bold uppercase
         px-6 py-3 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
         active:translate-x-[2px] active:translate-y-[2px]
         active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all;
}
```

### Mobile Touch-Target Rules
**CRITICAL:** All interactive elements, buttons, and D-pad controls must have a minimum height and width of 48px to ensure they are mobile-responsive and thumb-friendly.
