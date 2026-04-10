/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'motion/react';
import { useGameState } from '../../../context/GameStateContext';

/**
 * BattleScreen Component
 * A full-screen turn-based combat interface.
 */
export default function BattleScreen() {
  const { state, setFlag, markEnemyDefeated } = useGameState();
  
  const combatants = useMemo(() => {
    return state.currentEnemy?.id === 'brian_suburbanite' 
      ? ['lucky'] 
      : state.activeParty;
  }, [state.currentEnemy?.id, state.activeParty.join(',')]);

  // Battle Stats State
  const [partyVolumes, setPartyVolumes] = useState<{ [key: string]: number }>(() => {
    const volumes: { [key: string]: number } = {};
    combatants.forEach(id => {
      volumes[id] = state.partyStats[id as keyof typeof state.partyStats]?.currentVolume || 0;
    });
    return volumes;
  });
  const [enemyVolume, setEnemyVolume] = useState(state.currentEnemy?.volume || 100);
  const [currentTurn, setCurrentTurn] = useState<'player' | 'enemy'>('player');
  const [partyTurnIndex, setPartyTurnIndex] = useState(0);
  const [isBattleOver, setIsBattleOver] = useState(false);
  const [battleLogs, setBattleLogs] = useState<string[]>([`A ${state.currentEnemy?.name || 'Enemy'} blocks the path!`]);
  const [turnCount, setTurnCount] = useState(0);
  const [enemyAttackDebuff, setEnemyAttackDebuff] = useState(0);
  
  // Reset turn state when combatants or enemy changes
  useEffect(() => {
    setPartyTurnIndex(0);
    setCurrentTurn('player');
    setTurnCount(0);
    setEnemyAttackDebuff(0);
    setIsBattleOver(false);
  }, [combatants.join(','), state.currentEnemy?.id]);

  // Auto-skip defeated members
  useEffect(() => {
    if (isBattleOver || currentTurn === 'enemy') return; // STRICT GUARD

    const currentFighter = combatants[partyTurnIndex];
    if (!currentFighter || partyVolumes[currentFighter] > 0) return; // STRICT GUARD

    const nextIndex = partyTurnIndex + 1;
    if (nextIndex >= combatants.length) {
      setPartyTurnIndex(0);
      setCurrentTurn('enemy');
      setTurnCount(prev => prev + 1);
    } else {
      setPartyTurnIndex(nextIndex);
    }
  }, [partyTurnIndex, combatants, partyVolumes, isBattleOver, currentTurn]);

  const isDroneScripted = state.currentEnemy?.id === 'vanguard_riot_drone';
  const isBarScripted = state.currentEnemy?.id === 'palmers_bar_structure';
  const isRyanScripted = state.currentEnemy?.id === 'ryan_possession';
  const isLibraryScripted = state.currentEnemy?.id === 'library_crowd';
  const isBrianDuel = state.currentEnemy?.id === 'brian_suburbanite';
  const isLasersteinBoss = state.currentEnemy?.id === 'laserstein_dome';

  // Handle Enemy Turn
  useEffect(() => {
    if (currentTurn !== 'enemy' || isBattleOver) return; // STRICT GUARD

    const timer = setTimeout(() => {
      let battleEndedInternally = false;

      if (isLibraryScripted) {
        if (turnCount === 0) {
          setBattleLogs(prev => [...prev, "The crowd stares. The silence is heavier than any distortion pedal."]);
        } else if (turnCount === 1) {
          setBattleLogs(prev => [...prev, "A single cough echoes from the back. Lucky's hands are shaking."]);
        } else if (turnCount >= 2) {
          setBattleLogs(prev => [...prev, "THE TERRIFYING LIBRARIAN: SHHHHHHHHHHH!"]);
          setIsBattleOver(true);
          battleEndedInternally = true;
          setTimeout(() => {
            const recoveredStats = { ...state.partyStats };
            combatants.forEach(id => {
              if (recoveredStats[id as keyof typeof recoveredStats]) {
                recoveredStats[id as keyof typeof recoveredStats].currentVolume = recoveredStats[id as keyof typeof recoveredStats].maxVolume;
              }
            });
            setFlag('partyStats', recoveredStats);
            setFlag('rehearsalStage', 11);
            setFlag('inBattle', false);
            setFlag('currentEnemy', null);
            setFlag('currentQuest', "Check the Merch Table.");
          }, 1500);
        }
      } else if (isRyanScripted) {
        if (turnCount === 0) {
          setBattleLogs(prev => [...prev, "[Well. I guess my arms belong to the goo now.]"]);
        } else if (turnCount === 1) {
          setBattleLogs(prev => [...prev, "[Tempo's good, though. Very steady.]"]);
        } else if (turnCount >= 2) {
          setBattleLogs(prev => [...prev, "[Ride cymbal sounds a bit tinny. Should probably buy a new one.]"]);
          setIsBattleOver(true);
          battleEndedInternally = true;
          setTimeout(() => {
            const recoveredStats = { ...state.partyStats };
            combatants.forEach(id => {
              if (recoveredStats[id as keyof typeof recoveredStats]) {
                recoveredStats[id as keyof typeof recoveredStats].currentVolume = recoveredStats[id as keyof typeof recoveredStats].maxVolume;
              }
            });
            setFlag('partyStats', recoveredStats);
            setFlag('rehearsalStage', 3);
            setFlag('inBattle', false);
            setFlag('currentEnemy', null);
          }, 1500);
        }
      } else if (isBarScripted) {
        if (turnCount === 0) {
          setBattleLogs(prev => [...prev, "[I've been fighting the possession. That was a mistake.]"]);
        } else if (turnCount === 1) {
          setBattleLogs(prev => [...prev, "[I am not trapped in the goo. The goo is trapped in the pocket.]"]);
        } else if (turnCount >= 2) {
          setBattleLogs(prev => [...prev, "Rhythm achieved. Structural integrity compromised."]);
          setEnemyVolume(0);
          setIsBattleOver(true);
          battleEndedInternally = true;
          setTimeout(() => {
            const recoveredStats = { ...state.partyStats };
            combatants.forEach(id => {
              if (recoveredStats[id as keyof typeof recoveredStats]) {
                recoveredStats[id as keyof typeof recoveredStats].currentVolume = recoveredStats[id as keyof typeof recoveredStats].maxVolume;
              }
            });
            setFlag('partyStats', recoveredStats);
            setFlag('currentMap', 'palmersBarRubble');
            setFlag('inBattle', false);
            setFlag('currentEnemy', null);
          }, 1500);
        }
      } else if (isDroneScripted) {
        if (turnCount === 0) {
          setBattleLogs(prev => [...prev, "Riot Drone locks onto Lucky's chest! Red targeting laser paints the stage."]);
        } else {
          const damage = Math.max(1, 10 - enemyAttackDebuff);
          const livingMembers = combatants.filter(id => partyVolumes[id] > 0);
          if (livingMembers.length > 0) {
            const targetId = livingMembers[Math.floor(Math.random() * livingMembers.length)];
            setPartyVolumes(prev => ({ ...prev, [targetId]: Math.max(0, prev[targetId] - damage) }));
            setBattleLogs(prev => [...prev, `The Drone fires! ${targetId.toUpperCase()} loses ${damage} Volume.`]);
          }
        }
      } else if (isBrianDuel) {
        const rand = Math.random();
        const log = rand > 0.5 
          ? "Brian plays a sterile chord! 8 damage." 
          : "Brian complains about his property values! 8 damage.";
        const damage = 8;
        setPartyVolumes(prev => ({ ...prev, lucky: Math.max(0, prev.lucky - damage) }));
        setBattleLogs(prev => [...prev, log]);
      } else {
        const damage = Math.max(1, 10 - enemyAttackDebuff);
        const livingMembers = combatants.filter(id => partyVolumes[id] > 0);
        if (livingMembers.length > 0) {
          const targetId = livingMembers[Math.floor(Math.random() * livingMembers.length)];
          setPartyVolumes(prev => ({ ...prev, [targetId]: Math.max(0, prev[targetId] - damage) }));
          setBattleLogs(prev => [...prev, `${state.currentEnemy?.name || 'The Enemy'} attacks! ${targetId.toUpperCase()} loses ${damage} Volume.`]);
        }
      }

      if (!battleEndedInternally) {
        setPartyTurnIndex(0);
        setCurrentTurn('player');
        setTurnCount(prev => prev + 1);
        setEnemyAttackDebuff(0);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [currentTurn, isBattleOver, state.currentEnemy?.id, turnCount, setFlag, isRyanScripted, isBarScripted, isDroneScripted, isBrianDuel, isLibraryScripted, combatants.join(','), enemyAttackDebuff, JSON.stringify(partyVolumes)]);

  // Monitor Win/Loss Conditions
  useEffect(() => {
    if (isBattleOver) return;

    if (enemyVolume <= 0) {
      if (isBarScripted) return; // Handle this in the scripted turn logic

      setIsBattleOver(true);
      
      if (isDroneScripted) {
        setBattleLogs(prev => [...prev, "Drone shattered! The main doors are breaching! LOAD OUT!"]);
        setTimeout(() => {
          const recoveredStats = { ...state.partyStats };
          combatants.forEach(id => {
            if (recoveredStats[id as keyof typeof recoveredStats]) {
              recoveredStats[id as keyof typeof recoveredStats].currentVolume = recoveredStats[id as keyof typeof recoveredStats].maxVolume;
            }
          });
          setFlag('partyStats', recoveredStats);
          setFlag('currentMap', 'undergroundBarnRaid');
          setFlag('inBattle', false);
          setFlag('currentEnemy', null);
        }, 1500);
      } else if (isBrianDuel) {
        setBattleLogs(prev => [...prev, "Brian is defeated!", "Brian drops his pick in disgust. 'This neighborhood has gone to the dogs!'"]);
        setTimeout(() => {
          const recoveredStats = { ...state.partyStats };
          combatants.forEach(id => {
            if (recoveredStats[id as keyof typeof recoveredStats]) {
              recoveredStats[id as keyof typeof recoveredStats].currentVolume = recoveredStats[id as keyof typeof recoveredStats].maxVolume;
            }
          });
          setFlag('partyStats', recoveredStats);
          setFlag('rehearsalStage', 7);
          setFlag('inBattle', false);
          setFlag('currentEnemy', null);
        }, 1500);
      } else if (isLasersteinBoss) {
        setBattleLogs(prev => [...prev, "A colossal shockwave rips through the room! The reinforced glass dome shatters into the vacuum of space!"]);
        setTimeout(() => {
          const recoveredStats = { ...state.partyStats };
          combatants.forEach(id => {
            if (recoveredStats[id as keyof typeof recoveredStats]) {
              recoveredStats[id as keyof typeof recoveredStats].currentVolume = recoveredStats[id as keyof typeof recoveredStats].maxVolume;
            }
          });
          setFlag('partyStats', recoveredStats);
          setFlag('currentMap', 'orbitalVacuumEscape');
          setFlag('currentQuest', "Vacuum Escape!");
          setFlag('playerPosition', { x: 10, y: 13 });
          setFlag('inBattle', false);
          setFlag('currentEnemy', null);
        }, 1500);
      } else {
        setBattleLogs(prev => [...prev, `${state.currentEnemy?.name || 'The enemy'} is defeated!`]);
        if (state.currentEnemy?.id) {
          markEnemyDefeated(state.currentEnemy.id);
        }
        
        // Persist party volumes
        const newPartyStats = { ...state.partyStats };
        Object.keys(partyVolumes).forEach(id => {
          if (newPartyStats[id as keyof typeof newPartyStats]) {
            newPartyStats[id as keyof typeof newPartyStats].currentVolume = partyVolumes[id];
          }
        });
        setFlag('partyStats', newPartyStats);

        setTimeout(() => {
          setFlag('inBattle', false);
          setFlag('currentEnemy', null);
        }, 1500);
      }
    } else {
      const isPartyDefeated = combatants.every(id => partyVolumes[id] <= 0);
      if (isPartyDefeated) {
        setIsBattleOver(true);
        setBattleLogs(prev => [...prev, "The Noise dies out..."]);
        
        // Persist party volumes
        const newPartyStats = { ...state.partyStats };
        Object.keys(partyVolumes).forEach(id => {
          if (newPartyStats[id as keyof typeof newPartyStats]) {
            newPartyStats[id as keyof typeof newPartyStats].currentVolume = 0;
          }
        });
        setFlag('partyStats', newPartyStats);

        setTimeout(() => {
          // Quick heal to prevent overworld crashes
          const recoveredStats = { ...state.partyStats };
          combatants.forEach(id => {
            if (recoveredStats[id as keyof typeof recoveredStats]) {
              recoveredStats[id as keyof typeof recoveredStats].currentVolume = recoveredStats[id as keyof typeof recoveredStats].maxVolume;
            }
          });
          setFlag('partyStats', recoveredStats);
          setFlag('inBattle', false);
          setFlag('currentEnemy', null);
        }, 1500);
      }
    }
  }, [enemyVolume, JSON.stringify(partyVolumes), isBattleOver, setFlag, state.currentEnemy?.id, markEnemyDefeated, isBarScripted, isDroneScripted, isBrianDuel, combatants.join(',')]);

  if (!state.inBattle) return null;

  const handleSkill = (skill: any) => {
    if (currentTurn !== 'player' || isBattleOver || !currentMemberStats) return;

    const memberId = combatants[partyTurnIndex];
    if (partyVolumes[memberId] <= 0) {
      // Skip turn if member is defeated
      if (partyTurnIndex + 1 < combatants.length) {
        setPartyTurnIndex(partyTurnIndex + 1);
      } else {
        setPartyTurnIndex(0);
        setCurrentTurn('enemy');
      }
      return;
    }

    if (isBarScripted && turnCount === 1) {
      setBattleLogs(prev => [...prev, "Ryan dissolves into pure cosmic matter! The Eternity hits Palmer's Bar for 9999 damage!"]);
      setCurrentTurn('enemy');
      return;
    }

    if (isDroneScripted && turnCount === 1) {
      const damage = 200;
      setEnemyVolume(prev => Math.max(0, prev - damage));
      setBattleLogs(prev => [...prev, "Lucky's leg liquefies and snaps across the stage! SMASH! Lucky hits the drone perfectly in time with Warner's crash cymbal!"]);
      setCurrentTurn('enemy');
      return;
    }

    const stats = state.partyStats[memberId as keyof typeof state.partyStats];
    let log = "";

    if (skill.name === '13/8 Clank') {
      const rand = Math.random();
      let damage = 0;
      if (rand < 0.5) {
        log = "Sticky plays an undanceable 13/8 rhythm. 0 damage.";
      } else if (rand < 0.9) {
        damage = 25;
        log = "Sticky clanks the snare. 25 damage.";
      } else {
        damage = 999;
        log = "The math-rock rhythm magically aligns! 999 damage!";
      }
      setEnemyVolume(prev => Math.max(0, prev - damage));
    } else if (skill.type === 'damage') {
      let damage = Math.floor(stats.noisePower * skill.multiplier);
      damage = Math.max(1, damage - state.stressLevel);
      if (isLibraryScripted) damage = Math.floor(damage / 2);

      if (isLasersteinBoss && (memberId === 'lucky' || memberId === 'diego')) {
        damage = Math.floor(damage / 2);
        log = `${memberId.toUpperCase()} uses ${skill.name}, but their inner truth is compromised! ${damage} Volume damage.`;
      } else {
        log = `${memberId.toUpperCase()} uses ${skill.name}! ${state.currentEnemy?.name || 'The enemy'} takes ${damage} Volume damage.`;
      }

      setEnemyVolume(prev => Math.max(0, prev - damage));

      if (skill.recoil) {
        // Recoil fix: 10% of Lucky's own max volume
        const recoilDamage = Math.floor(stats.maxVolume * skill.recoil);
        setPartyVolumes(prev => ({ ...prev, [memberId]: Math.max(0, prev[memberId] - recoilDamage) }));
        log += ` ${memberId.toUpperCase()} takes ${recoilDamage} recoil damage!`;
      }
    } else if (skill.type === 'debuff') {
      setEnemyAttackDebuff(prev => prev + 10);
      log = `${memberId.toUpperCase()} uses ${skill.name}! Enemy attack power decreased.`;
    } else if (skill.type === 'heal') {
      // Heal random living member
      const livingMembers = combatants.filter(id => partyVolumes[id] > 0);
      if (livingMembers.length > 0) {
        const targetId = livingMembers[Math.floor(Math.random() * livingMembers.length)];
        const healAmount = Math.floor(stats.noisePower * skill.multiplier);
        const maxVol = state.partyStats[targetId as keyof typeof state.partyStats].maxVolume;
        setPartyVolumes(prev => ({ ...prev, [targetId]: Math.min(maxVol, prev[targetId] + healAmount) }));
        log = `${memberId.toUpperCase()} uses ${skill.name}! ${targetId.toUpperCase()} restored ${healAmount} Volume.`;
      }
    }

    setBattleLogs(prev => [...prev, log]);

    // Next turn logic
    const nextIndex = partyTurnIndex + 1;
    if (nextIndex >= combatants.length) {
      setPartyTurnIndex(0);
      setCurrentTurn('enemy');
    } else {
      setPartyTurnIndex(nextIndex);
    }
  };

  const currentMemberId = combatants[partyTurnIndex];
  const currentMemberStats = state.partyStats[currentMemberId as keyof typeof state.partyStats];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[100] bg-black flex flex-col font-mono text-green-500 p-2 sm:p-6 uppercase tracking-widest overflow-hidden"
    >
      {/* Enemy Section */}
      <div className="flex-1 flex flex-col items-center justify-center border-b-2 border-green-900/30 min-h-0">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-red-600 border-4 border-red-900 mb-2 sm:mb-4 animate-pulse shrink-0" />
        <div className="text-sm sm:text-xl mb-1 sm:mb-2">{state.currentEnemy?.name || 'ENEMY'}</div>
        <div className="flex gap-2 sm:gap-4 text-[10px] sm:text-xs">
          <span>VOL: {enemyVolume}/{state.currentEnemy?.volume || 100}</span>
          {enemyAttackDebuff > 0 && <span className="text-red-400">DEBUFFED: -{enemyAttackDebuff}</span>}
        </div>
      </div>

      {/* Battle Log */}
      <div className="h-16 sm:h-24 flex flex-col items-center justify-center text-center text-[10px] sm:text-sm px-2 sm:px-4 border-b-2 border-green-900/30 italic shrink-0 overflow-y-auto">
        {battleLogs.slice(-3).map((log, i) => (
          <p key={i} className="animate-in fade-in duration-300">{log}</p>
        ))}
      </div>

      {/* Player Section */}
      <div className="flex-1 flex flex-col justify-end gap-2 sm:gap-6 min-h-0">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-4">
          {combatants.map(id => {
            const stats = state.partyStats[id as keyof typeof state.partyStats];
            const isCurrent = id === currentMemberId && currentTurn === 'player';
            const colorClass = id === 'lucky' ? 'border-green-500 text-green-500' :
                               id === 'phoenix' ? 'border-orange-500 text-orange-500' :
                               id === 'warner' ? 'border-blue-500 text-blue-500' :
                               id === 'diego' ? 'border-red-500 text-red-500' :
                               id === 'sticky' ? 'border-cyan-500 text-cyan-500' :
                               'border-green-500 text-green-500';

            return (
              <div key={id} className={`border-l-2 pl-2 ${colorClass} ${isCurrent ? 'bg-green-900/20' : ''}`}>
                <div className="text-[10px] sm:text-sm">{id.toUpperCase()}</div>
                <div className="text-[8px] sm:text-[10px] flex flex-col">
                  <span>VOL: {partyVolumes[id]}/{stats?.maxVolume || 0}</span>
                  <span>NOISE: {stats?.noisePower || 0}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Menu */}
        <div className="flex flex-col items-center gap-2 pb-2 sm:pb-4">
          {isBattleOver && (
            <div className="text-sm sm:text-lg font-bold animate-pulse text-red-500">BATTLE CONCLUDED</div>
          )}
          
          {!isBattleOver && currentTurn === 'player' && currentMemberId && currentMemberStats && (
            <>
              <div className="text-xs mb-1">SELECT SKILL FOR {currentMemberId.toUpperCase()}</div>
              <div className="flex gap-2 sm:gap-4 justify-center">
                {currentMemberStats.skills.map((skill, idx) => (
                  <button
                    key={idx}
                    disabled={partyVolumes[currentMemberId] <= 0}
                    onClick={() => handleSkill(skill)}
                    className="px-4 py-2 sm:px-8 sm:py-3 bg-green-900/20 border-2 border-green-500 hover:bg-green-500 hover:text-black transition-colors text-xs sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {skill.name}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Scanline Effect Overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,118,0.06))] bg-[length:100%_2px,3px_100%]" />
    </motion.div>
  );
}
