import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import FONTS from '../../data/fonts';
import FontSearch from './FontSearch';
import FontList from './FontList';

const FontPicker = ({ selectedFont, onSelectFont }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const pickerRef = React.useRef(null);

  const filteredFonts = useMemo(() => {
    if (!searchTerm) return FONTS;
    const lower = searchTerm.toLowerCase();
    return FONTS.filter(font =>
      font.name.toLowerCase().includes(lower) ||
      font.category.toLowerCase().includes(lower)
    );
  }, [searchTerm]);

  const handleSelectFont = useCallback((font) => {
    onSelectFont(font);
    setIsOpen(false);
    setSearchTerm('');
  }, [onSelectFont]);

  const handleClearSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className="relative" ref={pickerRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{ fontFamily: selectedFont?.family || 'Inter' }}
        className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 min-w-36"
        title="Font Family"
      >
        <span className="truncate text-xs">{selectedFont?.name || 'Inter'}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-2xl w-72 overflow-hidden z-50">
          <FontSearch
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onClear={handleClearSearch}
          />
          <FontList
            fonts={filteredFonts}
            selectedFont={selectedFont}
            onSelectFont={handleSelectFont}
            searchTerm={searchTerm}
          />
        </div>
      )}
    </div>
  );
};

export default FontPicker;
