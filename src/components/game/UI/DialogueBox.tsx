/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import { motion } from 'motion/react';

export interface DialogueBoxHandle {
  advance: () => void;
}

interface DialogueBoxProps {
  messages: string[];
  onComplete: () => void;
}

/**
 * DialogueBox Component
 * Renders a retro 8-bit style dialogue box with a typewriter effect.
 */
const DialogueBox = forwardRef<DialogueBoxHandle, DialogueBoxProps>(({ messages, onComplete }, ref) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const currentMessage = messages[currentMessageIndex] || "";

  useEffect(() => {
    if (displayedText.length < currentMessage.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(currentMessage.slice(0, displayedText.length + 1));
      }, 30);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [displayedText, currentMessageIndex, currentMessage]);

  const handleNext = useCallback(() => {
    const currentMessage = messages[currentMessageIndex] || "";
    
    if (displayedText.length < currentMessage.length) {
      // Skip typewriter effect
      setDisplayedText(currentMessage);
      setIsTyping(false);
    } else if (currentMessageIndex < messages.length - 1) {
      setDisplayedText("");
      setIsTyping(true);
      setCurrentMessageIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  }, [displayedText, currentMessageIndex, messages, onComplete]);

  useImperativeHandle(ref, () => ({
    advance: handleNext
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute bottom-4 left-4 right-4 z-50"
      onClick={handleNext}
    >
      <div className="bg-black border-4 border-white p-4 font-mono text-white min-h-[100px] relative cursor-pointer select-none">
        {/* Retro Corner Accents */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-white" />
        <div className="absolute top-0 right-0 w-2 h-2 bg-white" />
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-white" />
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-white" />

        <div className="text-sm sm:text-base leading-relaxed tracking-wider uppercase">
          {displayedText}
          {!isTyping && (
            <motion.span
              animate={{ opacity: [0, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="inline-block ml-1 w-2 h-4 bg-green-500 align-middle"
            />
          )}
        </div>

        <div className="absolute bottom-2 right-4 text-[10px] text-gray-500 animate-pulse">
          [ PRESS E OR CLICK TO CONTINUE ]
        </div>
      </div>
    </motion.div>
  );
});

export default DialogueBox;
