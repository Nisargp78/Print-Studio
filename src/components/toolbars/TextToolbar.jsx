import React, { useState, useMemo, useEffect } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Droplet, ChevronDown } from 'lucide-react';
import { useDesign } from '../../context/useDesignContext';
import FontPicker from '../fontpicker/FontPicker';
import FONTS from '../../data/fonts';

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 44, 48, 56, 64, 72, 80, 96, 120];

const SYSTEM_FONTS = new Set([
  'arial',
  'arial black',
  'inter',
  'helvetica',
  'helvetica neue',
  'verdana',
  'tahoma',
  'trebuchet ms',
  'lucida grande',
  'century gothic',
  'segoe ui',
  'candara',
  'calibri',
  'franklin gothic medium',
  'haettenschweiler',
  'ms gothic',
  'times new roman',
  'georgia',
  'garamond',
  'palatino',
  'baskerville',
  'cambria',
  'constantia',
  'rockwell',
  'bookman old style',
  'comic sans ms',
  'brush script mt',
  'lucida handwriting',
  'apple chancery',
  'bradley hand',
  'impact',
  'copperplate',
  'papyrus',
  'luminari',
  'trattatello',
  'courier new',
  'courier',
  'lucida console',
  'monaco',
  'consolas',
  'menlo',
  'sans-serif',
  'serif',
  'monospace',
  'cursive',
  'fantasy',
  'script'
]);

const ensureGoogleFont = (familyValue) => {
  const primary = (familyValue || '').split(',')[0].replace(/["']/g, '').trim();
  if (!primary) return;
  if (SYSTEM_FONTS.has(primary.toLowerCase())) return;

  const id = `font-${primary.toLowerCase().replace(/\s+/g, '-')}`;
  if (document.getElementById(id)) return;

  const link = document.createElement('link');
  link.id = id;
  link.rel = 'stylesheet';
  link.href = `https://fonts.googleapis.com/css2?family=${primary.replace(/\s+/g, '+')}:wght@400;700&display=swap`;
  document.head.appendChild(link);
};

const TextToolbar = () => {
  const { selectedElement, updateElement } = useDesign();
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);

  if (!selectedElement || selectedElement.type !== 'text') return null;

  const fontSize = selectedElement.fontSize || 32;
  const fontFamily = selectedElement.fontFamily || 'cursive';
  const fontWeight = selectedElement.fontWeight || 'normal';
  const fontStyle = selectedElement.fontStyle || 'normal';
  const textDecoration = selectedElement.textDecoration || '';
  const align = selectedElement.align || 'left';
  const fill = selectedElement.fill || '#000000';

  const selectedFont = useMemo(() => {
    // Try exact match first
    let font = FONTS.find(f => f.family === fontFamily);
    // If no exact match, try partial match
    if (!font) {
      font = FONTS.find(f => 
        fontFamily.toLowerCase().includes(f.name.toLowerCase()) ||
        f.family.toLowerCase().includes(fontFamily.toLowerCase())
      );
    }
    // Check for generic font families
    if (!font) {
      const lowerFamily = fontFamily.toLowerCase().trim();
      if (lowerFamily === 'cursive' || lowerFamily.endsWith('cursive')) {
        font = FONTS.find(f => f.family === 'cursive');
      } else if (lowerFamily === 'fantasy' || lowerFamily.endsWith('fantasy')) {
        font = FONTS.find(f => f.family === 'fantasy');
      } else if (lowerFamily === 'monospace' || lowerFamily.endsWith('monospace')) {
        font = FONTS.find(f => f.family === 'monospace');
      } else if (lowerFamily === 'serif' || lowerFamily.endsWith('serif')) {
        font = FONTS.find(f => f.family === 'serif');
      } else if (lowerFamily === 'sans-serif' || lowerFamily.endsWith('sans-serif')) {
        font = FONTS.find(f => f.family === 'sans-serif');
      }
    }
    // If still no match, create a display font from the fontFamily string
    if (!font) {
      const displayName = fontFamily
        .split(',')[0]
        .replace(/['"]/g, '')
        .trim()
        .split('-')[0]
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      font = { name: displayName, family: fontFamily, category: 'custom' };
    }
    return font;
  }, [fontFamily]);

  const isBold = fontWeight === 'bold';
  const isItalic = fontStyle === 'italic';
  const isUnderline = textDecoration.toLowerCase().includes('underline');

  useEffect(() => {
    ensureGoogleFont(fontFamily);
  }, [fontFamily]);

  const handleUpdate = (props) => {
    updateElement(selectedElement.id, props);
  };

  const toggleBold = () => {
    let newWeight = 'normal';
    if (!isBold) {
      // If not bold, make it bold
      newWeight = 'bold';
    } else {
      // If already bold (any variant), set to normal
      newWeight = 'normal';
    }
    handleUpdate({
      fontWeight: newWeight,
    });
  };

  const toggleItalic = () => {
    const newStyle = isItalic ? 'normal' : 'italic';
    handleUpdate({
      fontStyle: newStyle,
    });
  };

  const toggleUnderline = () => {
    handleUpdate({
      textDecoration: isUnderline ? '' : 'underline',
    });
  };

  const setTextAlign = (alignValue) => {
    handleUpdate({ align: alignValue });
  };

  const handleFontSelect = (font) => {
    ensureGoogleFont(font.family);
    handleUpdate({ fontFamily: font.family });
  };

  return (
    <div className="flex items-center gap-3">
      <FontPicker
        selectedFont={selectedFont}
        onSelectFont={handleFontSelect}
      />

      {/* Font Size Dropdown */}
      <div className="relative">
        <button
          onClick={() => setIsFontSizeOpen(!isFontSizeOpen)}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2 min-w-20"
          title="Font Size"
        >
          <span>{fontSize}px</span>
          <ChevronDown size={14} />
        </button>

        {isFontSizeOpen && (
          <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50 max-h-60 overflow-y-auto w-24">
            {FONT_SIZES.map((size) => (
              <button
                key={size}
                onClick={() => {
                  handleUpdate({ fontSize: size });
                  setIsFontSizeOpen(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-blue-50 ${
                  fontSize === size ? 'bg-blue-100 font-semibold' : ''
                }`}
              >
                {size}px
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* Text Style Controls */}
      <div className="flex items-center gap-1">
        <button
          onClick={toggleBold}
          className={`w-8 h-8 rounded border flex items-center justify-center ${
            isBold
              ? 'bg-gray-800 border-gray-800 text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          title="Bold"
        >
          <Bold size={16} />
        </button>

        <button
          onClick={toggleItalic}
          className={`w-8 h-8 rounded border flex items-center justify-center ${
            isItalic
              ? 'bg-gray-800 border-gray-800 text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          title="Italic"
        >
          <Italic size={16} />
        </button>

        <button
          onClick={toggleUnderline}
          className={`w-8 h-8 rounded border flex items-center justify-center ${
            isUnderline
              ? 'bg-gray-800 border-gray-800 text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          title="Underline"
        >
          <Underline size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* Text Alignment */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => setTextAlign('left')}
          className={`w-8 h-8 rounded border flex items-center justify-center ${
            align === 'left'
              ? 'bg-gray-800 border-gray-800 text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>

        <button
          onClick={() => setTextAlign('center')}
          className={`w-8 h-8 rounded border flex items-center justify-center ${
            align === 'center'
              ? 'bg-gray-800 border-gray-800 text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>

        <button
          onClick={() => setTextAlign('right')}
          className={`w-8 h-8 rounded border flex items-center justify-center ${
            align === 'right'
              ? 'bg-gray-800 border-gray-800 text-white'
              : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
          }`}
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* Color Picker */}
      <div className="flex items-center gap-2">
        <button
          className="w-8 h-8 rounded border border-gray-200 bg-white flex items-center justify-center"
          title="Text Color"
        >
          <Droplet size={16} className="text-gray-700" />
        </button>
        <input
          type="color"
          value={fill}
          onChange={(e) => handleUpdate({ fill: e.target.value })}
          className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
          title="Pick text color"
        />
      </div>
    </div>
  );
};

export default TextToolbar;
