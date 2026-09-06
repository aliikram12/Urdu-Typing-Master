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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0B1120]/85 backdrop-blur-md select-none">
      <div className="neu-card-raised w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col max-h-[85vh] shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Modal Header */}
        <div className="p-5 border-b border-white/[0.07] bg-[#111C31] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#2563EB]/15 text-[#38BDF8] rounded-2xl border border-[#2563EB]/30 shadow-sm">
              <Keyboard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-[#F8FAFC]">
                Urdu Phonetic Keyboard Reference Map
              </h2>
              <p className="text-xs text-[#94A3B8]">
                Complete mapping between English QWERTY keys and Urdu Nastaliq characters
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="neu-btn-secondary p-2 rounded-xl text-[#94A3B8] hover:text-[#F8FAFC] transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Tabs */}
        <div className="p-4 border-b border-white/[0.06] bg-[#0E1626] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 neu-input px-3 py-1.5 rounded-xl flex-1 max-w-xs">
            <Search className="w-4 h-4 text-[#64748B]" />
            <input
              type="text"
              placeholder="Search letter or key..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-[#F8FAFC] placeholder-[#64748B] focus:outline-none w-full"
            />
          </div>

          <div className="flex items-center gap-1 bg-[#070B14] p-1 rounded-xl border border-white/[0.06] text-xs shadow-inner">
            <button
              onClick={() => setActiveTab('single')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'single'
                  ? 'neu-btn-primary text-xs shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Single Keys ({singleKeys.length})
            </button>
            <button
              onClick={() => setActiveTab('multi')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'multi'
                  ? 'neu-btn-primary text-xs shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Multi-Key Shortcuts ({multiKeys.length})
            </button>
            <button
              onClick={() => setActiveTab('special')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
                activeTab === 'special'
                  ? 'neu-btn-primary text-xs shadow-sm'
                  : 'text-[#94A3B8] hover:text-[#F8FAFC]'
              }`}
            >
              Punctuation & Diacritics
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-[#111C31]">
          {activeTab === 'single' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredSingle.map((item, i) => (
                <div
                  key={i}
                  className="neu-inset p-3 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-urdu text-2xl font-bold text-[#FACC15]">
                      {item.urdu}
                    </span>
                    {item.isShift && (
                      <span className="text-[9px] font-bold text-[#38BDF8] bg-[#38BDF8]/15 px-1 py-0.5 rounded border border-[#38BDF8]/25">
                        SHIFT
                      </span>
                    )}
                  </div>
                  <kbd className="font-mono text-xs font-bold text-[#F8FAFC] bg-[#16233A] px-2 py-1 rounded-lg border border-white/[0.08] shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
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
                  className="neu-inset p-3 rounded-2xl flex items-center justify-between"
                >
                  <div>
                    <span className="font-urdu text-2xl font-bold text-emerald-400">
                      {item.urdu}
                    </span>
                  </div>
                  <div className="text-right">
                    <kbd className="font-mono text-xs font-bold text-[#F8FAFC] bg-[#16233A] px-2.5 py-1 rounded-lg border border-white/[0.08] shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                      {item.seq.toUpperCase()}
                    </kbd>
                    <div className="text-[10px] text-[#64748B] mt-1">
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
                  className="neu-inset p-3 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-urdu text-2xl font-bold text-[#38BDF8]">
                      {item.urdu}
                    </span>
                    <span className="text-xs text-[#94A3B8] font-medium">
                      {item.name}
                    </span>
                  </div>
                  <kbd className="font-mono text-xs font-bold text-[#F8FAFC] bg-[#16233A] px-2.5 py-1 rounded-lg border border-white/[0.08] shadow-[0_2px_4px_rgba(0,0,0,0.4)]">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#0E1626] border-t border-white/[0.06] flex items-center justify-between text-xs text-[#94A3B8]">
          <span>Standard Urdu Phonetic 1.0 (CRULP / NLA Layout)</span>
          <button
            onClick={onClose}
            className="neu-btn-secondary px-4 py-1.5 rounded-xl font-semibold cursor-pointer text-[#F8FAFC]"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
