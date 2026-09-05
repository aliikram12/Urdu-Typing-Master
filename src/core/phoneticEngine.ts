export interface PhoneticMapping {
  [roman: string]: string;
}

// Comprehensive Urdu Phonetic Map (Single + Multi-key sequences)
export const MULTI_KEY_MAPPINGS: PhoneticMapping = {
  'sh': 'ش',
  'kh': 'خ',
  'gh': 'غ',
  'ch': 'چ',
  'zh': 'ژ',
  'ph': 'پھ',
  'bh': 'بھ',
  'th': 'تھ',
  'Th': 'ٹھ',
  'dh': 'دھ',
  'Dh': 'ڈھ',
  'jh': 'جھ',
  'chh': 'چھ',
  'khh': 'کھ',
  'ghh': 'گھ',
  'aa': 'آ',
  'oo': 'و',
  'ee': 'ی',
  'Rh': 'ڑھ',
  'rh': 'رھ',
};

export const SINGLE_KEY_MAPPINGS: PhoneticMapping = {
  'a': 'ا',
  'A': 'آ',
  'b': 'ب',
  'B': 'ؓ',
  'p': 'پ',
  'P': 'ُ',
  't': 'ت',
  'T': 'ٹ',
  'j': 'ج',
  'J': 'ض',
  'd': 'د',
  'D': 'ڈ',
  'r': 'ر',
  'R': 'ڑ',
  'z': 'ز',
  'Z': 'ذ',
  's': 'س',
  'S': 'ص',
  'k': 'ک',
  'K': 'خ',
  'g': 'گ',
  'G': 'غ',
  'l': 'ل',
  'L': 'ؒ',
  'm': 'م',
  'M': 'ؐ',
  'n': 'ن',
  'N': 'ں',
  'w': 'و',
  'W': 'ّ',
  'h': 'ہ',
  'H': 'ح',
  'o': 'ہ',
  'O': 'ھ',
  'y': 'ی',
  'Y': 'ے',
  'q': 'ق',
  'Q': 'ء',
  'f': 'ف',
  'F': 'ف',
  'c': 'چ',
  'C': 'ث',
  'v': 'ط',
  'V': 'ظ',
  'x': 'ش',
  'X': 'ژ',
  'e': 'ع',
  'E': 'ؑ',
  'i': 'ی',
  'I': 'ِ',
  'u': 'ء',
  'U': 'ئ',
  ' ': ' ',
  '.': '۔',
  ',': '،',
  '?': '؟',
  ';': '؛',
  ':': ':',
  '!': '!',
  '-': '-',
  '(': ')',
  ')': '(',
  '0': '۰',
  '1': '۱',
  '2': '۲',
  '3': '۳',
  '4': '۴',
  '5': '۵',
  '6': '۶',
  '7': '۷',
  '8': '۸',
  '9': '۹',
};

// Prefixes of multi-character mappings to support buffered composition
const MULTI_PREFIXES = new Set<string>();
for (const seq of Object.keys(MULTI_KEY_MAPPINGS)) {
  for (let i = 1; i < seq.length; i++) {
    MULTI_PREFIXES.add(seq.substring(0, i));
  }
}

// Reverse mapping: Urdu character -> list of accepted English keystrokes / sequences
export const URDU_TO_ENGLISH_MAP: Record<string, string[]> = {
  'ا': ['a'],
  'آ': ['A', 'aa'],
  'ب': ['b'],
  'پ': ['p'],
  'ت': ['t'],
  'ٹ': ['T'],
  'ث': ['C'],
  'ج': ['j'],
  'چ': ['c', 'ch'],
  'ح': ['H'],
  'خ': ['K', 'kh'],
  'د': ['d'],
  'ڈ': ['D'],
  'ذ': ['Z'],
  'ر': ['r'],
  'ڑ': ['R'],
  'ز': ['z'],
  'ژ': ['X', 'zh'],
  'س': ['s'],
  'ش': ['x', 'sh'],
  'ص': ['S'],
  'ض': ['J'],
  'ط': ['v'],
  'ظ': ['V'],
  'ع': ['e'],
  'غ': ['G', 'gh'],
  'ف': ['f', 'F'],
  'ق': ['q'],
  'ک': ['k'],
  'گ': ['g'],
  'ل': ['l'],
  'م': ['m'],
  'ن': ['n'],
  'ں': ['N'],
  'و': ['w', 'o'],
  'ہ': ['h', 'o'],
  'ھ': ['O', 'h'],
  'ء': ['Q', 'u'],
  'ی': ['i', 'y'],
  'ے': ['Y', 'y'],
  'ئ': ['U'],
  'پھ': ['ph'],
  'بھ': ['bh'],
  'تھ': ['th'],
  'ٹھ': ['Th'],
  'جھ': ['jh'],
  'چھ': ['chh'],
  'دھ': ['dh'],
  'ڈھ': ['Dh'],
  'کھ': ['khh'],
  'گھ': ['ghh'],
  '۔': ['.'],
  '،': [','],
  '؟': ['?'],
  '؛': [';'],
  ' ': [' '],
  '۰': ['0'],
  '۱': ['1'],
  '۲': ['2'],
  '۳': ['3'],
  '۴': ['4'],
  '۵': ['5'],
  '۶': ['6'],
  '۷': ['7'],
  '۸': ['8'],
  '۹': ['9'],
};

export class PhoneticMapper {
  private buffer: string = '';

  public reset() {
    this.buffer = '';
  }

  public getBuffer(): string {
    return this.buffer;
  }

  /**
   * Process a single character input.
   * Returns emitted Urdu string (can be empty if waiting for multi-key sequence)
   * and whether the buffer is currently in an intermediate sequence.
   */
  public handleKey(key: string): { emitted: string; pending: string; consumed: boolean } {
    if (key.length !== 1) {
      return { emitted: '', pending: this.buffer, consumed: false };
    }

    const nextBuffer = this.buffer + key;

    // Check if nextBuffer is exact match in multi-key
    if (MULTI_KEY_MAPPINGS[nextBuffer]) {
      const emitted = MULTI_KEY_MAPPINGS[nextBuffer];
      this.buffer = '';
      return { emitted, pending: '', consumed: true };
    }

    // Check if nextBuffer is a prefix of any multi-key sequence
    if (MULTI_PREFIXES.has(nextBuffer)) {
      this.buffer = nextBuffer;
      return { emitted: '', pending: this.buffer, consumed: true };
    }

    // If we had a pending buffer that had a single mapping, emit it first
    let emitted = '';
    if (this.buffer.length > 0) {
      emitted += SINGLE_KEY_MAPPINGS[this.buffer] || this.buffer;
      this.buffer = '';
    }

    // Now process the current key
    if (MULTI_PREFIXES.has(key)) {
      this.buffer = key;
      return { emitted, pending: this.buffer, consumed: true };
    }

    emitted += SINGLE_KEY_MAPPINGS[key] || key;
    return { emitted, pending: '', consumed: true };
  }

  /**
   * Check if a typed sequence or single key matches the target Urdu character.
   */
  public static matchesTarget(typedRoman: string, targetUrduChar: string): boolean {
    const accepted = URDU_TO_ENGLISH_MAP[targetUrduChar];
    if (accepted) {
      if (accepted.includes(typedRoman)) return true;
    }
    const single = SINGLE_KEY_MAPPINGS[typedRoman];
    if (single === targetUrduChar) return true;
    const multi = MULTI_KEY_MAPPINGS[typedRoman];
    if (multi === targetUrduChar) return true;

    return false;
  }

  /**
   * Get primary display prompt for an Urdu character (e.g. 'ش' -> 'sh' or 'x')
   */
  public static getPromptForUrdu(char: string): string {
    const list = URDU_TO_ENGLISH_MAP[char];
    if (list && list.length > 0) {
      return list[0];
    }
    return '';
  }

  /**
   * Convert entire roman text to Urdu
   */
  public static transliterate(text: string): string {
    let result = '';
    let i = 0;
    while (i < text.length) {
      // Try 3-char match
      const three = text.substring(i, i + 3);
      if (MULTI_KEY_MAPPINGS[three]) {
        result += MULTI_KEY_MAPPINGS[three];
        i += 3;
        continue;
      }
      // Try 2-char match
      const two = text.substring(i, i + 2);
      if (MULTI_KEY_MAPPINGS[two]) {
        result += MULTI_KEY_MAPPINGS[two];
        i += 2;
        continue;
      }
      // 1-char match
      const one = text[i];
      result += SINGLE_KEY_MAPPINGS[one] || one;
      i += 1;
    }
    return result;
  }
}
