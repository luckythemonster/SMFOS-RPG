/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GameEntity } from './fathersShipEntities';

/**
 * City Sound Entities
 * Dynamically generated based on rehearsalStage.
 */
export function getCitySoundEntities(rehearsalStage: number): GameEntity[] {
  const entities: GameEntity[] = [];

  // Exit Door (Always present in the hallway/room context if needed)
  entities.push({
    id: 'city_sound_exit',
    name: 'Soundproof Door',
    position: { x: 9, y: 4 },
    color: '#4a3a2a', // Brown
    isSolid: true,
    dialogue: rehearsalStage >= 9 
      ? ["Time to head to Palmer's."] 
      : ["We can't leave yet. We need a drummer... and a gig."]
  });

  if (rehearsalStage === 1) {
    // Stage 1: The Hallway
    entities.push({
      id: 'bajonka_hallway',
      name: 'Bajonka',
      position: { x: 9, y: 3 },
      color: '#d4af37', // Brown
      isSolid: true,
      dialogue: [
        "Bajonka is sitting perfectly still outside Room 4.",
        "A clipboard with a pen rests neatly by her paws.",
        "She sneezes."
      ]
    });
  }

  if (rehearsalStage === 2) {
    // Stage 2: The Eruption
    entities.push({
      id: 'phoenix',
      name: 'Phoenix',
      position: { x: 7, y: 7 },
      color: '#ff8800', // Orange
      isSolid: true,
      dialogue: ["My brain thinks we should have asked his rate first. We have exactly four dollars and a half-ounce of weed."]
    });
    entities.push({
      id: 'ryan',
      name: 'Ryan',
      position: { x: 10, y: 7 },
      color: '#0000ff', // Blue
      isSolid: true,
      dialogue: ["..."]
    });
    entities.push({
      id: 'roland_amp',
      name: 'Roland JC-40',
      position: { x: 10, y: 10 },
      color: '#808080', // Gray
      isSolid: true,
      dialogue: [
        "Lucky stomps a distortion pedal.",
        "1, 2, 3, 4!"
      ]
    });
  }

  if (rehearsalStage === 3) {
    // Stage 3: The Contract
    entities.push({
      id: 'phoenix',
      name: 'Phoenix',
      position: { x: 7, y: 7 },
      color: '#ff8800', // Orange
      isSolid: true,
      dialogue: ["..."]
    });
    entities.push({
      id: 'ryan',
      name: 'Ryan',
      position: { x: 10, y: 7 },
      color: '#0000ff', // Blue
      isSolid: true,
      dialogue: [
        "...",
        "So, do I get the gig?"
      ]
    });
    entities.push({
      id: 'bajonka_contract',
      name: 'Bajonka',
      position: { x: 11, y: 7 },
      color: '#d4af37', // Brown
      isSolid: true,
      dialogue: [
        "Bajonka trots up from behind the kit.",
        "She drops a fully drafted, legally binding band agreement onto Ryan's snare drum."
      ]
    });
    entities.push({
      id: 'roland_amp',
      name: 'Roland JC-40',
      position: { x: 10, y: 10 },
      color: '#808080', // Gray
      isSolid: true,
      dialogue: ["The amp hums with residual slime energy."]
    });
  }

  if (rehearsalStage === 4) {
    // Stage 4: The Setup (1 Month Later)
    entities.push({
      id: 'brian',
      name: 'Brian',
      position: { x: 12, y: 7 },
      color: '#f5f5dc', // Beige/Tan
      isSolid: true,
      dialogue: ["Do we really need all the political stickers? We’re going to alienate the market."]
    });
    entities.push({
      id: 'phoenix',
      name: 'Phoenix',
      position: { x: 7, y: 7 },
      color: '#ff8800', // Orange
      isSolid: true,
      dialogue: ["I'm not a 'man,' Brian. And no."]
    });
    entities.push({
      id: 'ryan',
      name: 'Ryan',
      position: { x: 10, y: 7 },
      color: '#0000ff', // Blue
      isSolid: true,
      dialogue: ["[I give this guy three weeks. Tops.]"]
    });
    entities.push({
      id: 'pedalboard',
      name: 'Pristine Pedalboard',
      position: { x: 12, y: 8 },
      color: '#d3d3d3', // Light Gray
      isSolid: true,
      dialogue: ["A $2,000 boutique pedalboard. It looks like it's never seen a drop of beer."]
    });
    entities.push({
      id: 'roland_amp',
      name: 'Roland JC-40',
      position: { x: 10, y: 10 },
      color: '#808080', // Gray
      isSolid: true,
      dialogue: [
        "The band hits the chorus. The cosmic slime syncs perfectly.",
        "A massive, physical 'KRAAAAANG' manifests in the air!",
        "The giant floating 'G' swings around and violently knocks over Brian's $8 iced coffee!"
      ]
    });
  }

  if (rehearsalStage === 5) {
    // Stage 5: The Confrontation
    entities.push({
      id: 'brian',
      name: 'Brian',
      position: { x: 12, y: 7 },
      color: '#f5f5dc', // Beige/Tan
      isSolid: true,
      dialogue: [
        "I'm not here to have fun!",
        "I'm not into this creative shit. You're wasting my time!"
      ]
    });
    entities.push({
      id: 'phoenix',
      name: 'Phoenix',
      position: { x: 7, y: 7 },
      color: '#ff8800', // Orange
      isSolid: true,
      dialogue: ["..."]
    });
    entities.push({
      id: 'ryan',
      name: 'Ryan',
      position: { x: 10, y: 7 },
      color: '#0000ff', // Blue
      isSolid: true,
      dialogue: ["..."]
    });
    entities.push({
      id: 'pedalboard',
      name: 'Pristine Pedalboard',
      position: { x: 12, y: 8 },
      color: '#555555', // Dark Gray (ruined)
      isSolid: true,
      dialogue: ["The pedalboard is smoking. Brian's iced coffee has shorted out the boutique delay circuits."]
    });
    entities.push({
      id: 'roland_amp',
      name: 'Roland JC-40',
      position: { x: 10, y: 10 },
      color: '#808080', // Gray
      isSolid: true,
      dialogue: ["The amp seems satisfied."]
    });
  }

  if (rehearsalStage === 6) {
    // Stage 6: The Misinterpretation (Lucky's Ultimatum)
    entities.push({
      id: 'brian',
      name: 'Brian',
      position: { x: 12, y: 7 },
      color: '#f5f5dc',
      isSolid: true,
      dialogue: ["..."]
    });
    entities.push({
      id: 'phoenix',
      name: 'Phoenix',
      position: { x: 7, y: 7 },
      color: '#ff8800',
      isSolid: true,
      dialogue: ["..."]
    });
    entities.push({
      id: 'ryan',
      name: 'Ryan',
      position: { x: 10, y: 7 },
      color: '#0000ff',
      isSolid: true,
      dialogue: ["..."]
    });
    entities.push({
      id: 'roland_amp',
      name: 'Roland JC-40',
      position: { x: 10, y: 10 },
      color: '#808080',
      isSolid: true,
      dialogue: [
        "Lucky unplugs their guitar with a loud POP.",
        "Listen to me very carefully, Brian.",
        "You need to stop being an asshole, or you are fired.",
        "We clearly have fundamental differences, but don't bring whatever is going on at home to rehearsal."
      ]
    });
  }

  if (rehearsalStage === 7) {
    // Stage 7: Brian's Meltdown
    entities.push({
      id: 'brian',
      name: 'Brian',
      position: { x: 12, y: 7 },
      color: '#f5f5dc',
      isSolid: true,
      dialogue: [
        "Did you just say my foundation is broken?!",
        "Are you calling my house crooked?!",
        "I know what you meant! My property values are fine! You’re just jealous of my equity!"
      ]
    });
    entities.push({
      id: 'phoenix',
      name: 'Phoenix',
      position: { x: 7, y: 7 },
      color: '#ff8800',
      isSolid: true,
      dialogue: ["..."]
    });
    entities.push({
      id: 'ryan',
      name: 'Ryan',
      position: { x: 10, y: 7 },
      color: '#0000ff',
      isSolid: true,
      dialogue: ["..."]
    });
  }

  if (rehearsalStage === 8) {
    // Stage 8: The Exit & The Dog
    entities.push({
      id: 'phoenix',
      name: 'Phoenix',
      position: { x: 7, y: 7 },
      color: '#ff8800',
      isSolid: true,
      dialogue: ["My brain thinks he might have been having a stroke."]
    });
    entities.push({
      id: 'ryan',
      name: 'Ryan',
      position: { x: 10, y: 7 },
      color: '#0000ff',
      isSolid: true,
      dialogue: ["[Well. His timing was terrible anyway.]"]
    });
    entities.push({
      id: 'bajonka_final',
      name: 'Bajonka',
      position: { x: 9, y: 6 }, // Near mic stand
      color: '#d4af37',
      isSolid: true,
      dialogue: ["Bajonka walks over, drops a crumpled flyer on the floor, sneezes, and walks back out."]
    });
  }

  if (rehearsalStage === 9) {
    // Stage 9: The Flyer
    entities.push({
      id: 'phoenix',
      name: 'Phoenix',
      position: { x: 7, y: 7 },
      color: '#ff8800',
      isSolid: true,
      dialogue: ["We have a gig?"]
    });
    entities.push({
      id: 'ryan',
      name: 'Ryan',
      position: { x: 10, y: 7 },
      color: '#0000ff',
      isSolid: true,
      dialogue: ["..."]
    });
    entities.push({
      id: 'palmers_flyer',
      name: 'Palmer\'s Flyer',
      position: { x: 9, y: 6 },
      color: '#ffffff', // White
      isSolid: false,
      dialogue: ["GIG TONIGHT: PALMER'S BAR - NO GUITAR SOLO NECESSARY."]
    });
  }

  return entities;
}
