import React, { useState } from 'react';
import { URDU_TO_ENGLISH_MAP, MULTI_KEY_MAPPINGS } from '../../core/phoneticEngine';
import { X, Search, Keyboard, BookOpen, Layers } from 'lucide-react';

interface KeyboardReferenceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KeyboardReferenceModal: React.FC<KeyboardReferenceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'single' | 'multi' | 'special'>('single');

  if (!isOpen) return null;

  const singleKeys = Object.entries(URDU_TO_ENGLISH_MAP).map(([urdu, prompts]) => {
    const primary = prompts[0] || '';
    const isShift = primary.length === 1 && primary === primary.toUpperCase() && /[A-Z]/.test(primary);
    return {
      urdu,
      prompts,
      primary,
      isShift,
    };
  });

  const multiKeys = Object.entries(MULTI_KEY_MAPPINGS).map(([seq, urdu]) => ({
    seq,
    urdu,
  }));

  const specialKeys = [
    { urdu: 'ء', name: 'Hamza', key: 'u / U' },
    { urdu: 'ۂ', name: 'Choti He with Hamza', key: 'Shift + G' },
    { urdu: 'ئ', name: 'Ye with Hamza', key: 'y then hamza' },
    { urdu: 'ؤ', name: 'Waw with Hamza', key: 'w then hamza' },
    { urdu: '؍', name: 'Urdu Date Sign', key: '/' },
    { urdu: '؁', name: 'Urdu Sanah (Year)', key: 'Shift + #' },
    { urdu: '؀', name: 'Urdu Number Sign', key: 'Shift + $' },
    { urdu: '۔', name: 'Urdu Full Stop (Khatma)', key: '.' },
    { urdu: '،', name: 'Urdu Comma (Sakta)', key: ',' },
    { urdu: '؟', name: 'Urdu Question Mark', key: '?' },
  ];

  const filteredSingle = singleKeys.filter(
    k =>
      k.urdu.includes(searchQuery) ||
      k.prompts.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredMulti = multiKeys.filter(
    k =>
      k.urdu.includes(searchQuery) ||
      k.seq.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-3xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-xl">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white">
                Urdu Phonetic Keyboard Reference Map
              </h2>
              <p className="text-xs text-slate-400">
                Complete mapping between English QWERTY keys and Urdu Nastaliq characters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex-1 max-w-xs">
            <Search className="w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search letter or key..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'single'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Single Keys ({singleKeys.length})
            </button>
            <button
              onClick={() => setActiveTab('multi')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'multi'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Multi-Key Shortcuts ({multiKeys.length})
            </button>
            <button
              onClick={() => setActiveTab('special')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'special'
                  ? 'bg-blue-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Punctuation & Diacritics
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'single' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredSingle.map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-urdu text-2xl font-bold text-amber-300">
                      {item.urdu}
                    </span>
                    {item.isShift && (
                      <span className="text-[9px] font-bold text-blue-400 bg-blue-500/10 px-1 rounded">
                        SHIFT
                      </span>
                    )}
                  </div>
                  <kbd className="font-mono text-xs font-bold text-white bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 shadow-sm">
                    {item.prompts.map(p => (p.length === 1 ? p.toUpperCase() : p)).join(' / ')}
                  </kbd>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'multi' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {filteredMulti.map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <span className="font-urdu text-2xl font-bold text-emerald-400">
                      {item.urdu}
                    </span>
                  </div>
                  <div className="text-right">
                    <kbd className="font-mono text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 shadow-sm">
                      {item.seq.toUpperCase()}
                    </kbd>
                    <div className="text-[10px] text-slate-500 mt-1">
                      Type &quot;{item.seq}&quot;
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'special' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specialKeys.map((item, i) => (
                <div
                  key={i}
                  className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-urdu text-2xl font-bold text-cyan-300">
                      {item.urdu}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {item.name}
                    </span>
                  </div>
                  <kbd className="font-mono text-xs font-bold text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Standard Urdu Phonetic 1.0 (CRULP / NLA Layout)</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
