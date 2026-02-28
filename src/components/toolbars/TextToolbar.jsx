import React, { useState, useMemo } from 'react';
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, Droplet, ChevronDown } from 'lucide-react';
import { useDesign } from '../../context/useDesignContext';
import FontPicker from '../fontpicker/FontPicker';
import FONTS from '../../data/fonts';

const FONT_SIZES = [12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64];

const TextToolbar = () => {
  const { selectedElement, updateElement } = useDesign();
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);

  if (!selectedElement) return null;

  const fontSize = selectedElement.fontSize || 32;
  const fontFamily = selectedElement.fontFamily || 'Inter, sans-serif';
  const fontWeight = selectedElement.fontWeight || 'normal';
  const fontStyle = selectedElement.fontStyle || 'normal';
  const textDecoration = selectedElement.textDecoration || '';
  const textAlign = selectedElement.textAlign || 'left';
  const fill = selectedElement.fill || '#000000';

  const selectedFont = useMemo(() => {
    return FONTS.find(f => f.family === fontFamily) || FONTS[0];
  }, [fontFamily]);

  const isBold = fontWeight === 'bold';
  const isItalic = fontStyle.toLowerCase().includes('italic');
  const isUnderline = textDecoration.toLowerCase().includes('underline');

  const handleUpdate = (props) => {
    updateElement(selectedElement.id, props);
  };

  const toggleBold = () => {
    handleUpdate({
      fontWeight: isBold ? 'normal' : 'bold',
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

  const setTextAlign = (align) => {
    handleUpdate({ textAlign: align });
  };

  const handleFontSelect = (font) => {
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
            textAlign === 'left'
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
            textAlign === 'center'
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
            textAlign === 'right'
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
