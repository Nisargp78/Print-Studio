import React, { useEffect, useMemo, useState } from 'react';
import { Bold, ChevronDown, Copy, Droplet, Italic, Lock, Trash2, Underline, Unlock } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const FormatBar = () => {
  const {
    selectedElement,
    updateElement,
    deleteElement,
    duplicateElement,
    toggleLockElement,
    isCanvasLocked,
    toggleCanvasLock,
  } = useDesign();
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);

  const hasSelection = !!selectedElement;

  const transparency = useMemo(() => {
    if (!selectedElement) return 0;
    const opacity = typeof selectedElement.opacity === 'number' ? selectedElement.opacity : 1;
    return clamp(Math.round((1 - opacity) * 100), 0, 100);
  }, [selectedElement]);

  useEffect(() => {
    if (!hasSelection) setIsTransparencyOpen(false);
  }, [hasSelection]);

  const isLocked = hasSelection ? !!selectedElement?.locked : isCanvasLocked;

  const setTransparency = (value) => {
    if (!selectedElement) return;
    const t = clamp(Number(value), 0, 100);
    updateElement(selectedElement.id, { opacity: 1 - t / 100 });
  };

  const isText = hasSelection && selectedElement?.type === 'text';

  const currentFill = (selectedElement && typeof selectedElement.fill === 'string'
    ? selectedElement.fill
    : '#0f172a');

  const fontStyleCurrent = (selectedElement && selectedElement.fontStyle) || 'normal';
  const isBoldText =
    (selectedElement && selectedElement.fontWeight === 'bold') ||
    fontStyleCurrent.toLowerCase().includes('bold');
  const isItalicText = fontStyleCurrent.toLowerCase().includes('italic');
  const isUnderlineText =
    selectedElement && typeof selectedElement.textDecoration === 'string'
      ? selectedElement.textDecoration.toLowerCase().includes('underline')
      : false;

  const toggleBold = () => {
    if (!isText || !selectedElement) return;
    const nextBold = !isBoldText;
    const nextItalic = isItalicText;
    const parts = [];
    if (nextBold) parts.push('bold');
    if (nextItalic) parts.push('italic');
    const nextStyle = parts.length ? parts.join(' ') : 'normal';
    updateElement(selectedElement.id, {
      fontStyle: nextStyle,
      fontWeight: nextBold ? 'bold' : 'normal',
    });
  };

  const toggleItalic = () => {
    if (!isText || !selectedElement) return;
    const nextItalic = !isItalicText;
    const nextBold = isBoldText;
    const parts = [];
    if (nextBold) parts.push('bold');
    if (nextItalic) parts.push('italic');
    const nextStyle = parts.length ? parts.join(' ') : 'normal';
    updateElement(selectedElement.id, {
      fontStyle: nextStyle,
    });
  };

  const toggleUnderline = () => {
    if (!isText || !selectedElement) return;
    const nextUnderline = !isUnderlineText;
    updateElement(selectedElement.id, {
      textDecoration: nextUnderline ? 'underline' : '',
    });
  };

  const handleColorChange = (value) => {
    if (!isText || !selectedElement) return;
    updateElement(selectedElement.id, { fill: value });
  };

  return (
    <div className="w-full flex items-center gap-2 bg-white/90 backdrop-blur border border-gray-200 shadow-sm px-3 py-2">
        {/* Text color */}
        <div className="flex items-center gap-1 mr-2">
          <button
            type="button"
            className={[
              'w-8 h-8 rounded border flex items-center justify-center',
              isText ? 'border-gray-300 bg-white' : 'border-gray-200 bg-gray-50 cursor-not-allowed',
            ].join(' ')}
            disabled={!isText}
            title={isText ? 'Text color' : 'Select text to change color'}
          >
            <Droplet
              size={16}
              className={isText ? 'text-gray-700' : 'text-gray-300'}
            />
          </button>
          <input
            type="color"
            value={currentFill}
            onChange={(e) => handleColorChange(e.target.value)}
            disabled={!isText}
            className="w-8 h-8 rounded border border-gray-200 cursor-pointer disabled:cursor-not-allowed disabled:opacity-40"
          />
        </div>

        {/* Basic text style controls */}
        <div className="flex items-center gap-1 mr-4">
          <button
            type="button"
            onClick={toggleBold}
            disabled={!isText}
            className={[
              'w-8 h-8 rounded border text-xs flex items-center justify-center font-semibold',
              isText
                ? isBoldText
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                : 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed',
            ].join(' ')}
            title="Bold"
          >
            <Bold size={14} />
          </button>
          <button
            type="button"
            onClick={toggleItalic}
            disabled={!isText}
            className={[
              'w-8 h-8 rounded border text-xs flex items-center justify-center',
              isText
                ? isItalicText
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                : 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed',
            ].join(' ')}
            title="Italic"
          >
            <Italic size={14} />
          </button>
          <button
            type="button"
            onClick={toggleUnderline}
            disabled={!isText}
            className={[
              'w-8 h-8 rounded border text-xs flex items-center justify-center',
              isText
                ? isUnderlineText
                  ? 'bg-gray-800 text-white border-gray-800'
                  : 'bg-white text-gray-800 border-gray-300 hover:bg-gray-50'
                : 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed',
            ].join(' ')}
            title="Underline"
          >
            <Underline size={14} />
          </button>
        </div>

        {/* Placeholders (as you said Position/Layers not required now) */}
        <button
          type="button"
          className="text-sm px-2 py-1 rounded border border-gray-200 text-gray-600 bg-gray-50 cursor-not-allowed"
          disabled
        >
          Position
        </button>
        <button
          type="button"
          className="text-sm px-2 py-1 rounded border border-gray-200 text-gray-600 bg-gray-50 cursor-not-allowed"
          disabled
        >
          Layers
        </button>

        <div className="w-px h-6 bg-gray-200 mx-1" />

        {/* Transparency */}
        <div className="relative">
          <button
            type="button"
            onClick={() => (hasSelection ? setIsTransparencyOpen((v) => !v) : null)}
            disabled={!hasSelection}
            className={[
              'text-sm px-2 py-1 rounded border border-gray-200 flex items-center gap-2',
              hasSelection ? 'text-gray-800 hover:bg-gray-50' : 'text-gray-400 bg-gray-50 cursor-not-allowed',
            ].join(' ')}
            title="Transparency"
          >
            Transparency
            <span className="text-gray-500">{transparency}%</span>
            <ChevronDown size={16} className="text-gray-500" />
          </button>

          {isTransparencyOpen && hasSelection && (
            <div className="absolute top-[calc(100%+8px)] left-0 bg-white border border-gray-200 shadow-lg rounded p-3 w-64">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-800">Transparency</div>
                <div className="text-sm text-gray-600">{transparency}%</div>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={transparency}
                onChange={(e) => setTransparency(e.target.value)}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0%</span>
                <span>100%</span>
              </div>
            </div>
          )}
        </div>

        {/* Lock */}
        <button
          type="button"
        onClick={() =>
          hasSelection && selectedElement
            ? toggleLockElement(selectedElement.id)
            : toggleCanvasLock()
        }
          className={[
            'p-2 rounded border border-transparent',
          hasSelection
            ? 'hover:bg-gray-50 hover:border-gray-200'
            : 'hover:bg-gray-50 hover:border-gray-200',
          ].join(' ')}
        title={
          hasSelection
            ? isLocked
              ? 'Unlock element'
              : 'Lock element'
            : isCanvasLocked
              ? 'Unlock canvas'
              : 'Lock canvas'
        }
        >
          {isLocked ? <Unlock size={18} /> : <Lock size={18} />}
        </button>

        {/* Copy */}
        <button
          type="button"
          onClick={() => (selectedElement ? duplicateElement(selectedElement.id) : null)}
          className={[
            'p-2 rounded border border-transparent',
            hasSelection && !isLocked ? 'hover:bg-gray-50 hover:border-gray-200' : 'cursor-not-allowed opacity-40',
          ].join(' ')}
          title="Copy"
          disabled={!hasSelection || isLocked}
        >
          <Copy size={18} className={!hasSelection || isLocked ? 'text-gray-300' : 'text-gray-800'} />
        </button>

        {/* Delete */}
        <button
          type="button"
          onClick={() => (selectedElement ? deleteElement(selectedElement.id) : null)}
          className={[
            'p-2 rounded border border-transparent text-red-600',
            hasSelection && !isLocked ? 'hover:bg-red-50 hover:border-red-200' : 'cursor-not-allowed opacity-40',
          ].join(' ')}
          title="Delete"
          disabled={!hasSelection || isLocked}
        >
          <Trash2 size={18} className={!hasSelection || isLocked ? 'text-red-200' : 'text-red-600'} />
        </button>
    </div>
  );
};

export default FormatBar;

