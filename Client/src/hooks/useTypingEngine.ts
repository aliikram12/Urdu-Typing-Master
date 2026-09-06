import { useState, useEffect, useRef, useCallback } from 'react';
import { PhoneticMapper } from '../core/phoneticEngine';
import { getFingerForUrduChar, findKeyForUrduChar } from '../core/keyboardLayout';
import { audioEngine } from '../core/audioEngine';
import { FingerType } from '../types';

export interface CharState {
  char: string;
  status: 'pending' | 'current' | 'correct' | 'incorrect';
  typedChar?: string;
}

export interface TypingEngineOptions {
  targetText: string;
  strictMode?: boolean;
  onComplete?: (stats: {
    wpm: number;
    netWpm: number;
    accuracy: number;
    totalChars: number;
    correctChars: number;
    errors: number;
    durationSeconds: number;
    averageLatencyMs: number;
  }) => void;
  onKeyError?: (expected: string, typed: string) => void;
  onKeyCorrect?: (char: string, latencyMs: number) => void;
}

export function useTypingEngine({
  targetText,
  strictMode = false,
  onComplete,
  onKeyError,
  onKeyCorrect,
}: TypingEngineOptions) {
  const [chars, setChars] = useState<CharState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [pendingBuffer, setPendingBuffer] = useState('');
  const [isStarted, setIsStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Statistics
  const [totalKeypresses, setTotalKeypresses] = useState(0);
  const [correctKeypresses, setCorrectKeypresses] = useState(0);
  const [incorrectKeypresses, setIncorrectKeypresses] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [netWpm, setNetWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [averageLatencyMs, setAverageLatencyMs] = useState(220);

  // High resolution timing
  const startTimeRef = useRef<number | null>(null);
  const lastKeyTimeRef = useRef<number | null>(null);
  const latenciesRef = useRef<number[]>([]);
  const timerIntervalRef = useRef<number | null>(null);
  const mapperRef = useRef<PhoneticMapper>(new PhoneticMapper());
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  // Initialize or reset chars when targetText changes
  useEffect(() => {
    if (!targetText) return;
    const initial: CharState[] = Array.from(targetText).map((char, index) => ({
      char,
      status: index === 0 ? 'current' : 'pending',
    }));
    setChars(initial);
    setCurrentIndex(0);
    setPendingBuffer('');
    setIsStarted(false);
    setIsPaused(false);
    setIsCompleted(false);
    setTotalKeypresses(0);
    setCorrectKeypresses(0);
    setIncorrectKeypresses(0);
    setElapsedSeconds(0);
    setWpm(0);
    setNetWpm(0);
    setAccuracy(100);
    latenciesRef.current = [];
    mapperRef.current.reset();
    startTimeRef.current = null;
    lastKeyTimeRef.current = null;

    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
  }, [targetText]);

  // Elapsed timer loop
  useEffect(() => {
    if (isStarted && !isPaused && !isCompleted) {
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedSeconds(prev => {
          const next = prev + 0.5;
          return next;
        });
      }, 500);
    } else if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isStarted, isPaused, isCompleted]);

  // Update real-time WPM, Net WPM, and Accuracy
  useEffect(() => {
    if (elapsedSeconds <= 0) return;
    const minutes = elapsedSeconds / 60;
    const gross = Math.round((correctKeypresses / 5) / minutes);
    const errorsPerMin = Math.round(incorrectKeypresses / minutes);
    const net = Math.max(0, gross - errorsPerMin);
    const acc = totalKeypresses > 0 ? (correctKeypresses / totalKeypresses) * 100 : 100;

    setWpm(gross);
    setNetWpm(net);
    setAccuracy(Math.round(acc * 10) / 10);
  }, [elapsedSeconds, correctKeypresses, totalKeypresses, incorrectKeypresses]);

  // Handle a physical or virtual keystroke
  const handleKeystroke = useCallback(
    (key: string) => {
      if (isCompleted || isPaused || !targetText) return;

      const now = performance.now();
      if (!isStarted) {
        setIsStarted(true);
        startTimeRef.current = now;
      }

      // Latency calculation
      let latency = 250;
      if (lastKeyTimeRef.current) {
        latency = Math.round(now - lastKeyTimeRef.current);
        if (latency < 3000) {
          latenciesRef.current.push(latency);
          const avg =
            latenciesRef.current.reduce((a, b) => a + b, 0) / latenciesRef.current.length;
          setAverageLatencyMs(Math.round(avg));
        }
      }
      lastKeyTimeRef.current = now;

      // Backspace handling
      if (key === 'Backspace') {
        audioEngine.playKeyClick();
        if (pendingBuffer.length > 0) {
          setPendingBuffer('');
          mapperRef.current.reset();
          return;
        }
        if (currentIndex > 0) {
          const prevIdx = currentIndex - 1;
          setCurrentIndex(prevIdx);
          setChars(prev => {
            const copy = [...prev];
            copy[prevIdx] = { ...copy[prevIdx], status: 'current', typedChar: undefined };
            copy[currentIndex] = { ...copy[currentIndex], status: 'pending' };
            return copy;
          });
        }
        return;
      }

      // Ignore special modifier keys alone
      if (['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Tab', 'Escape'].includes(key)) {
        return;
      }

      // Target character to match
      const targetChar = targetText[currentIndex];
      if (!targetChar) return;

      setTotalKeypresses(prev => prev + 1);

      // Check with PhoneticMapper
      const mapper = mapperRef.current;
      const { emitted, pending } = mapper.handleKey(key);
      setPendingBuffer(pending);

      // Check if the current combination or key matches target
      const candidateSequence = (pendingBuffer + key);
      const isMatch =
        (emitted && emitted === targetChar) ||
        PhoneticMapper.matchesTarget(candidateSequence, targetChar) ||
        PhoneticMapper.matchesTarget(key, targetChar) ||
        (key === ' ' && targetChar === ' ') ||
        (key === '.' && targetChar === '۔') ||
        (key === ',' && targetChar === '،') ||
        (key === '?' && targetChar === '؟');

      if (isMatch) {
        // Correct character committed!
        audioEngine.playKeyClick();
        setCorrectKeypresses(prev => prev + 1);
        mapper.reset();
        setPendingBuffer('');

        if (onKeyCorrect) {
          onKeyCorrect(targetChar, latency);
        }

        const nextIndex = currentIndex + 1;
        setChars(prev => {
          const copy = [...prev];
          copy[currentIndex] = { ...copy[currentIndex], status: 'correct', typedChar: targetChar };
          if (nextIndex < copy.length) {
            copy[nextIndex] = { ...copy[nextIndex], status: 'current' };
          }
          return copy;
        });

        if (nextIndex >= targetText.length) {
          // Lesson or test completed!
          setIsCompleted(true);
          audioEngine.playSuccess();
          const totalDuration = (performance.now() - (startTimeRef.current || now)) / 1000;
          const finalMinutes = Math.max(0.1, totalDuration / 60);
          const finalGross = Math.round(((correctKeypresses + 1) / 5) / finalMinutes);
          const finalErrors = incorrectKeypresses;
          const finalNet = Math.max(0, finalGross - Math.round(finalErrors / finalMinutes));
          const finalAcc = Math.round(
            ((correctKeypresses + 1) / (totalKeypresses + 1)) * 100
          );
          const finalAvgLat =
            latenciesRef.current.length > 0
              ? Math.round(
                  latenciesRef.current.reduce((a, b) => a + b, 0) / latenciesRef.current.length
                )
              : 220;

          if (onCompleteRef.current) {
            onCompleteRef.current({
              wpm: finalGross,
              netWpm: finalNet,
              accuracy: finalAcc,
              totalChars: targetText.length,
              correctChars: targetText.length,
              errors: finalErrors,
              durationSeconds: Math.round(totalDuration),
              averageLatencyMs: finalAvgLat,
            });
          }
        } else {
          setCurrentIndex(nextIndex);
        }
      } else if (!pending) {
        // Definite incorrect keypress (not just a pending prefix)
        audioEngine.playError();
        setIncorrectKeypresses(prev => prev + 1);
        mapper.reset();
        setPendingBuffer('');

        if (onKeyError) {
          onKeyError(targetChar, key);
        }

        if (!strictMode) {
          // In relaxed mode, we mark character as incorrect but let user retry or proceed
          setChars(prev => {
            const copy = [...prev];
            copy[currentIndex] = {
              ...copy[currentIndex],
              status: 'incorrect',
              typedChar: key,
            };
            return copy;
          });
        }
      }
    },
    [
      isCompleted,
      isPaused,
      targetText,
      currentIndex,
      isStarted,
      pendingBuffer,
      correctKeypresses,
      incorrectKeypresses,
      totalKeypresses,
      strictMode,
      onKeyCorrect,
      onKeyError,
    ]
  );

  // Global window listener for keyboard
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Allow shortcuts like Ctrl+R, Ctrl+P, Escape to bubble without typing
      if (e.ctrlKey || e.altKey || e.metaKey) {
        return;
      }
      // Prevent browser space scrolling
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
      }
      handleKeystroke(e.key);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleKeystroke]);

  const togglePause = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);

  const reset = useCallback(() => {
    if (!targetText) return;
    const initial: CharState[] = Array.from(targetText).map((char, index) => ({
      char,
      status: index === 0 ? 'current' : 'pending',
    }));
    setChars(initial);
    setCurrentIndex(0);
    setPendingBuffer('');
    setIsStarted(false);
    setIsPaused(false);
    setIsCompleted(false);
    setTotalKeypresses(0);
    setCorrectKeypresses(0);
    setIncorrectKeypresses(0);
    setElapsedSeconds(0);
    setWpm(0);
    setNetWpm(0);
    setAccuracy(100);
    latenciesRef.current = [];
    mapperRef.current.reset();
    startTimeRef.current = null;
    lastKeyTimeRef.current = null;
  }, [targetText]);

  // Current active target information
  const currentTargetChar = targetText ? targetText[currentIndex] || '' : '';
  const currentFinger: FingerType = getFingerForUrduChar(currentTargetChar);
  const currentKeyInfo = findKeyForUrduChar(currentTargetChar);
  const expectedPrompt = PhoneticMapper.getPromptForUrdu(currentTargetChar);

  const progressPercent = targetText
    ? Math.min(100, Math.round((currentIndex / targetText.length) * 100))
    : 0;

  return {
    chars,
    currentIndex,
    currentTargetChar,
    currentFinger,
    currentKeyInfo,
    expectedPrompt,
    pendingBuffer,
    isStarted,
    isPaused,
    isCompleted,
    progressPercent,
    stats: {
      wpm,
      netWpm,
      accuracy,
      totalKeypresses,
      correctKeypresses,
      incorrectKeypresses,
      elapsedSeconds,
      averageLatencyMs,
    },
    handleKeystroke,
    togglePause,
    reset,
  };
}
