import { FingerType, KeyboardKeyInfo } from '../types';

export const KEYBOARD_ROWS: KeyboardKeyInfo[][] = [
  // ROW 1: Number Row
  [
    { code: 'Backquote', normal: '`', shift: '~', urduNormal: 'ّ', urduShift: 'ٌ', finger: 'left-pinky', row: 1 },
    { code: 'Digit1', normal: '1', shift: '!', urduNormal: '۱', urduShift: '!', finger: 'left-pinky', row: 1 },
    { code: 'Digit2', normal: '2', shift: '@', urduNormal: '۲', urduShift: '@', finger: 'left-ring', row: 1 },
    { code: 'Digit3', normal: '3', shift: '#', urduNormal: '۳', urduShift: '#', finger: 'left-middle', row: 1 },
    { code: 'Digit4', normal: '4', shift: '$', urduNormal: '۴', urduShift: '؀', finger: 'left-index', row: 1 },
    { code: 'Digit5', normal: '5', shift: '%', urduNormal: '۵', urduShift: '٪', finger: 'left-index', row: 1 },
    { code: 'Digit6', normal: '6', shift: '^', urduNormal: '۶', urduShift: '؏', finger: 'right-index', row: 1 },
    { code: 'Digit7', normal: '7', shift: '&', urduNormal: '۷', urduShift: 'ۖ', finger: 'right-index', row: 1 },
    { code: 'Digit8', normal: '8', shift: '*', urduNormal: '۸', urduShift: '٭', finger: 'right-middle', row: 1 },
    { code: 'Digit9', normal: '9', shift: '(', urduNormal: '۹', urduShift: ')', finger: 'right-ring', row: 1 },
    { code: 'Digit0', normal: '0', shift: ')', urduNormal: '۰', urduShift: '(', finger: 'right-pinky', row: 1 },
    { code: 'Minus', normal: '-', shift: '_', urduNormal: '-', urduShift: '_', finger: 'right-pinky', row: 1 },
    { code: 'Equal', normal: '=', shift: '+', urduNormal: '=', urduShift: '+', finger: 'right-pinky', row: 1 },
    { code: 'Backspace', normal: 'Backspace', shift: '', urduNormal: '⌫', finger: 'right-pinky', row: 1, width: 'w-18 md:w-20' },
  ],
  // ROW 2: QWERTY Row
  [
    { code: 'Tab', normal: 'Tab', shift: '', urduNormal: '⇥', finger: 'left-pinky', row: 2, width: 'w-14 md:w-16' },
    { code: 'KeyQ', normal: 'q', shift: 'Q', urduNormal: 'ق', urduShift: 'ء', finger: 'left-pinky', row: 2 },
    { code: 'KeyW', normal: 'w', shift: 'W', urduNormal: 'و', urduShift: 'ّ', finger: 'left-ring', row: 2 },
    { code: 'KeyE', normal: 'e', shift: 'E', urduNormal: 'ع', urduShift: 'ؑ', finger: 'left-middle', row: 2 },
    { code: 'KeyR', normal: 'r', shift: 'R', urduNormal: 'ر', urduShift: 'ڑ', finger: 'left-index', row: 2 },
    { code: 'KeyT', normal: 't', shift: 'T', urduNormal: 'ت', urduShift: 'ٹ', finger: 'left-index', row: 2 },
    { code: 'KeyY', normal: 'y', shift: 'Y', urduNormal: 'ے', urduShift: 'َ', finger: 'right-index', row: 2 },
    { code: 'KeyU', normal: 'u', shift: 'U', urduNormal: 'ء', urduShift: 'ئ', finger: 'right-index', row: 2 },
    { code: 'KeyI', normal: 'i', shift: 'I', urduNormal: 'ی', urduShift: 'ِ', finger: 'right-middle', row: 2 },
    { code: 'KeyO', normal: 'o', shift: 'O', urduNormal: 'ہ', urduShift: 'ھ', finger: 'right-ring', row: 2 },
    { code: 'KeyP', normal: 'p', shift: 'P', urduNormal: 'پ', urduShift: 'ُ', finger: 'right-pinky', row: 2 },
    { code: 'BracketLeft', normal: '[', shift: '{', urduNormal: ']', urduShift: '}', finger: 'right-pinky', row: 2 },
    { code: 'BracketRight', normal: ']', shift: '}', urduNormal: '[', urduShift: '{', finger: 'right-pinky', row: 2 },
    { code: 'Backslash', normal: '\\', shift: '|', urduNormal: '\\', urduShift: '|', finger: 'right-pinky', row: 2 },
  ],
  // ROW 3: Home Row (ASDF - JKL;)
  [
    { code: 'CapsLock', normal: 'Caps', shift: '', urduNormal: '⇪', finger: 'left-pinky', row: 3, width: 'w-16 md:w-18' },
    { code: 'KeyA', normal: 'a', shift: 'A', urduNormal: 'ا', urduShift: 'آ', finger: 'left-pinky', row: 3 },
    { code: 'KeyS', normal: 's', shift: 'S', urduNormal: 'س', urduShift: 'ص', finger: 'left-ring', row: 3 },
    { code: 'KeyD', normal: 'd', shift: 'D', urduNormal: 'د', urduShift: 'ڈ', finger: 'left-middle', row: 3 },
    { code: 'KeyF', normal: 'f', shift: 'F', urduNormal: 'ف', urduShift: 'ف', finger: 'left-index', row: 3 },
    { code: 'KeyG', normal: 'g', shift: 'G', urduNormal: 'گ', urduShift: 'غ', finger: 'left-index', row: 3 },
    { code: 'KeyH', normal: 'h', shift: 'H', urduNormal: 'ہ', urduShift: 'ح', finger: 'right-index', row: 3 },
    { code: 'KeyJ', normal: 'j', shift: 'J', urduNormal: 'ج', urduShift: 'ض', finger: 'right-index', row: 3 },
    { code: 'KeyK', normal: 'k', shift: 'K', urduNormal: 'ک', urduShift: 'خ', finger: 'right-middle', row: 3 },
    { code: 'KeyL', normal: 'l', shift: 'L', urduNormal: 'ل', urduShift: 'ؒ', finger: 'right-ring', row: 3 },
    { code: 'Semicolon', normal: ';', shift: ':', urduNormal: '؛', urduShift: ':', finger: 'right-pinky', row: 3 },
    { code: 'Quote', normal: "'", shift: '"', urduNormal: '‘', urduShift: '“', finger: 'right-pinky', row: 3 },
    { code: 'Enter', normal: 'Enter', shift: '', urduNormal: '↵', finger: 'right-pinky', row: 3, width: 'w-20 md:w-22' },
  ],
  // ROW 4: Bottom Row (ZXCV - NM,.)
  [
    { code: 'ShiftLeft', normal: 'Shift', shift: '', urduNormal: '⇧', finger: 'left-pinky', row: 4, width: 'w-20 md:w-24' },
    { code: 'KeyZ', normal: 'z', shift: 'Z', urduNormal: 'ز', urduShift: 'ذ', finger: 'left-pinky', row: 4 },
    { code: 'KeyX', normal: 'x', shift: 'X', urduNormal: 'ش', urduShift: 'ژ', finger: 'left-ring', row: 4 },
    { code: 'KeyC', normal: 'c', shift: 'C', urduNormal: 'چ', urduShift: 'ث', finger: 'left-middle', row: 4 },
    { code: 'KeyV', normal: 'v', shift: 'V', urduNormal: 'ط', urduShift: 'ظ', finger: 'left-index', row: 4 },
    { code: 'KeyB', normal: 'b', shift: 'B', urduNormal: 'ب', urduShift: 'ؓ', finger: 'left-index', row: 4 },
    { code: 'KeyN', normal: 'n', shift: 'N', urduNormal: 'ن', urduShift: 'ں', finger: 'right-index', row: 4 },
    { code: 'KeyM', normal: 'm', shift: 'M', urduNormal: 'م', urduShift: 'ؐ', finger: 'right-index', row: 4 },
    { code: 'Comma', normal: ',', shift: '<', urduNormal: '،', urduShift: '>', finger: 'right-middle', row: 4 },
    { code: 'Period', normal: '.', shift: '>', urduNormal: '۔', urduShift: '<', finger: 'right-ring', row: 4 },
    { code: 'Slash', normal: '/', shift: '?', urduNormal: '/', urduShift: '؟', finger: 'right-pinky', row: 4 },
    { code: 'ShiftRight', normal: 'Shift', shift: '', urduNormal: '⇧', finger: 'right-pinky', row: 4, width: 'w-20 md:w-24' },
  ],
  // ROW 5: Modifier & Space Row
  [
    { code: 'ControlLeft', normal: 'Ctrl', urduNormal: 'Ctrl', finger: 'left-pinky', row: 5, width: 'w-14' },
    { code: 'AltLeft', normal: 'Alt', urduNormal: 'Alt', finger: 'thumb', row: 5, width: 'w-14' },
    { code: 'Space', normal: 'Space', urduNormal: 'فاصلہ (Space)', finger: 'thumb', row: 5, width: 'flex-1 min-w-[160px]' },
    { code: 'AltRight', normal: 'Alt', urduNormal: 'Alt', finger: 'thumb', row: 5, width: 'w-14' },
    { code: 'ControlRight', normal: 'Ctrl', urduNormal: 'Ctrl', finger: 'right-pinky', row: 5, width: 'w-14' },
  ]
];

// Finger colors for ergonomic visual coding
export const FINGER_CONFIG: Record<FingerType, { name: string; urduName: string; color: string; hand: 'left' | 'right' }> = {
  'left-pinky': { name: 'Left Pinky', urduName: 'بائیں چھنگلی', color: '#A855F7', hand: 'left' },
  'left-ring': { name: 'Left Ring', urduName: 'بائیں کلمہ', color: '#06B6D4', hand: 'left' },
  'left-middle': { name: 'Left Middle', urduName: 'بائیں درمیانی', color: '#10B981', hand: 'left' },
  'left-index': { name: 'Left Index', urduName: 'بائیں شہادت', color: '#3B82F6', hand: 'left' },
  'thumb': { name: 'Thumbs', urduName: 'دونوں انگوٹھے', color: '#F59E0B', hand: 'left' },
  'right-index': { name: 'Right Index', urduName: 'دائیں شہادت', color: '#3B82F6', hand: 'right' },
  'right-middle': { name: 'Right Middle', urduName: 'دائیں درمیانی', color: '#10B981', hand: 'right' },
  'right-ring': { name: 'Right Ring', urduName: 'دائیں کلمہ', color: '#06B6D4', hand: 'right' },
  'right-pinky': { name: 'Right Pinky', urduName: 'دائیں چھنگلی', color: '#A855F7', hand: 'right' },
};

// Fast lookup maps
const CODE_TO_KEY = new Map<string, KeyboardKeyInfo>();
const URDU_TO_KEY = new Map<string, { key: KeyboardKeyInfo; requiresShift: boolean }>();

for (const row of KEYBOARD_ROWS) {
  for (const k of row) {
    CODE_TO_KEY.set(k.code, k);
    if (k.urduNormal) {
      URDU_TO_KEY.set(k.urduNormal, { key: k, requiresShift: false });
    }
    if (k.urduShift) {
      URDU_TO_KEY.set(k.urduShift, { key: k, requiresShift: true });
    }
  }
}

export function getKeyByCode(code: string): KeyboardKeyInfo | undefined {
  return CODE_TO_KEY.get(code);
}

export function findKeyForUrduChar(char: string): { key: KeyboardKeyInfo; requiresShift: boolean } | undefined {
  return URDU_TO_KEY.get(char);
}

export function getFingerForUrduChar(char: string): FingerType {
  const match = URDU_TO_KEY.get(char);
  if (match) {
    return match.key.finger;
  }
  if (char === ' ') return 'thumb';
  return 'right-index';
}
