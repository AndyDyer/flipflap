import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const CHAR_SET = ' ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?-:;\'"/()'.split('');
const DISPLAY_WIDTH = 15;
const DISPLAY_HEIGHT = 4;
const TOTAL_CHARS = DISPLAY_WIDTH * DISPLAY_HEIGHT;

const SplitFlapChar = ({ targetChar }) => {
  const [currentChar, setCurrentChar] = useState(' ');
  const [nextChar, setNextChar] = useState(' ');
  const [isFlipping, setIsFlipping] = useState(false);

  useEffect(() => {
    if (targetChar !== currentChar) {
      setIsFlipping(true);
      const currentIndex = CHAR_SET.indexOf(currentChar);
      const nextIndex = (currentIndex + 1) % CHAR_SET.length;
      setNextChar(CHAR_SET[nextIndex]);
    }
  }, [targetChar, currentChar]);

  const handleFlipComplete = () => {
    setCurrentChar(nextChar);
    setIsFlipping(false);
    if (nextChar !== targetChar) {
      setIsFlipping(true);
      const nextIndex = (CHAR_SET.indexOf(nextChar) + 1) % CHAR_SET.length;
      setNextChar(CHAR_SET[nextIndex]);
    }
  };

  return (
    <div className="split-flap-char">
      <div className="card">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentChar}
            className="front"
            initial={{ rotateX: 0 }}
            animate={{ rotateX: isFlipping ? -180 : 0 }}
            transition={{ duration: 0.05 }}
            onAnimationComplete={handleFlipComplete}
          >
            {currentChar}
          </motion.div>
        </AnimatePresence>
        <div className="back">{nextChar}</div>
      </div>
    </div>
  );
};

const SplitFlapDisplay = ({ text }) => {
  const displayText = text.toUpperCase().padEnd(TOTAL_CHARS, ' ').slice(0, TOTAL_CHARS);

  return (
    <div className="split-flap-display">
      {Array.from({ length: DISPLAY_HEIGHT }).map((_, rowIndex) => (
        <div key={rowIndex} className="split-flap-row">
          {displayText.slice(rowIndex * DISPLAY_WIDTH, (rowIndex + 1) * DISPLAY_WIDTH).split('').map((char, charIndex) => (
            <SplitFlapChar key={`${rowIndex}-${charIndex}`} targetChar={char} />
          ))}
        </div>
      ))}
    </div>
  );
};

const SplitFlapDemo = () => {
  const [inputText, setInputText] = useState('HELLO, WORLD!');

  const handleInputChange = (e) => {
    const newText = e.target.value.toUpperCase()
      .split('')
      .filter(char => CHAR_SET.includes(char))
      .join('')
      .slice(0, TOTAL_CHARS);
    setInputText(newText);
  };

  return (
    <div className="split-flap-demo">
      <SplitFlapDisplay text={inputText} />
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        placeholder="Enter text here (max 60 characters)"
        maxLength={TOTAL_CHARS}
      />
      <style jsx>{`
        .split-flap-demo {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
          font-family: 'Courier New', monospace;
        }
        .split-flap-display {
          display: flex;
          flex-direction: column;
          background-color: #222;
          padding: 1rem;
          border-radius: 0.5rem;
        }
        .split-flap-row {
          display: flex;
        }
        .split-flap-char {
          width: 40px;
          height: 60px;
          perspective: 1000px;
          margin: 2px;
        }
        .card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
        }
        .front, .back {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 2rem;
          background-color: #333;
          color: #fff;
          border-radius: 4px;
        }
        .back {
          transform: rotateX(180deg);
        }
        input[type="text"] {
          padding: 0.5rem;
          font-size: 1rem;
          width: 300px;
        }
      `}</style>
    </div>
  );
};

export default SplitFlapDemo;