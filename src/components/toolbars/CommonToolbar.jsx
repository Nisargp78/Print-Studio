import React, { useState, useEffect } from 'react';
import { Lock, Unlock, Copy, Trash2, Layers, ChevronDown, ArrowUp, ArrowDown, MoveUp, MoveDown, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';
import { useDesign } from '../../context/useDesignContext';

/**
 * CommonToolbar Component
 * Shows position, layers, lock, copy, and delete controls for all element types
 */
const CommonToolbar = () => {
  const {
    elements,
    selectedElement,
    updateElement,
    deleteElement,
    duplicateElement,
    toggleLockElement,
    setElements,
  } = useDesign();

  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.common-toolbar-dropdown')) {
        setIsPositionOpen(false);
        setIsLayersOpen(false);
      }
    };

    if (isPositionOpen || isLayersOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isPositionOpen, isLayersOpen]);

  if (!selectedElement) return null;

  const isLocked = !!selectedElement.locked;

  const handlePositionChange = (axis, value) => {
    const numValue = Number(value);
    if (!isNaN(numValue)) {
      updateElement(selectedElement.id, { [axis]: numValue });
    }
  };

  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;

  const alignLeft = () => {
    handlePositionChange('x', 0);
  };

  const alignCenter = () => {
    const elementWidth = selectedElement.width || 100;
    const centerX = (CANVAS_WIDTH - elementWidth) / 2;
    handlePositionChange('x', Math.round(centerX));
  };

  const alignRight = () => {
    const elementWidth = selectedElement.width || 100;
    const rightX = CANVAS_WIDTH - elementWidth;
    handlePositionChange('x', Math.round(rightX));
  };

  const alignTop = () => {
    handlePositionChange('y', 0);
  };

  const alignMiddle = () => {
    const elementHeight = selectedElement.height || 100;
    const middleY = (CANVAS_HEIGHT - elementHeight) / 2;
    handlePositionChange('y', Math.round(middleY));
  };

  const alignBottom = () => {
    const elementHeight = selectedElement.height || 100;
    const bottomY = CANVAS_HEIGHT - elementHeight;
    handlePositionChange('y', Math.round(bottomY));
  };

  // Layer management functions
  const moveLayerUp = () => {
    const idx = elements.findIndex((el) => el.id === selectedElement.id);
    if (idx < elements.length - 1) {
      const newElements = [...elements];
      [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
      setElements(newElements);
    }
  };

  const moveLayerDown = () => {
    const idx = elements.findIndex((el) => el.id === selectedElement.id);
    if (idx > 0) {
      const newElements = [...elements];
      [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
      setElements(newElements);
    }
  };

  const bringToFront = () => {
    const filtered = elements.filter((el) => el.id !== selectedElement.id);
    setElements([...filtered, selectedElement]);
  };

  const sendToBack = () => {
    const filtered = elements.filter((el) => el.id !== selectedElement.id);
    setElements([selectedElement, ...filtered]);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Position */}
      <div className="relative common-toolbar-dropdown">
        <button
          onClick={() => setIsPositionOpen(!isPositionOpen)}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          title="Position"
        >
          Position
          <ChevronDown size={14} />
        </button>

        {isPositionOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg p-3 w-56 z-50">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">X</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.x || 0)}
                  onChange={(e) => handlePositionChange('x', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Y</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.y || 0)}
                  onChange={(e) => handlePositionChange('y', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Quick Align - Horizontal</label>
                <div className="flex gap-2">
                  <button
                    onClick={alignLeft}
                    className="flex-1 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-xs flex items-center justify-center gap-1 transition"
                    title="Align Left"
                  >
                    <AlignLeft size={14} />
                    Left
                  </button>
                  <button
                    onClick={alignCenter}
                    className="flex-1 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-xs flex items-center justify-center gap-1 transition"
                    title="Align Center"
                  >
                    <AlignCenter size={14} />
                    Center
                  </button>
                  <button
                    onClick={alignRight}
                    className="flex-1 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-xs flex items-center justify-center gap-1 transition"
                    title="Align Right"
                  >
                    <AlignRight size={14} />
                    Right
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-2 block">Quick Align - Vertical</label>
                <div className="flex gap-2 flex-col">
                  <button
                    onClick={alignTop}
                    className="flex-1 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-xs flex items-center justify-center gap-1 transition"
                    title="Align Top"
                  >
                    <ArrowUp size={14} />
                    Top
                  </button>
                  <button
                    onClick={alignMiddle}
                    className="flex-1 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-xs flex items-center justify-center gap-1 transition"
                    title="Align Middle"
                  >
                    <MoveUp size={14} />
                    Middle
                  </button>
                  <button
                    onClick={alignBottom}
                    className="flex-1 px-2 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded text-xs flex items-center justify-center gap-1 transition"
                    title="Align Bottom"
                  >
                    <ArrowDown size={14} />
                    Bottom
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Layers */}
      <div className="relative common-toolbar-dropdown">
        <button
          onClick={() => setIsLayersOpen(!isLayersOpen)}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          title="Layers"
        >
          <Layers size={16} />
          Layers
          <ChevronDown size={14} />
        </button>

        {isLayersOpen && (
          <div className="absolute top-full right-0 mt-2 bg-white border border-gray-200 rounded shadow-lg p-2 w-48 z-50">
            <button
              onClick={() => {
                bringToFront();
                setIsLayersOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <ArrowUp size={16} />
              Bring to Front
            </button>
            <button
              onClick={() => {
                moveLayerUp();
                setIsLayersOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <MoveUp size={16} />
              Bring Forward
            </button>
            <button
              onClick={() => {
                moveLayerDown();
                setIsLayersOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <MoveDown size={16} />
              Send Backward
            </button>
            <button
              onClick={() => {
                sendToBack();
                setIsLayersOpen(false);
              }}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <ArrowDown size={16} />
              Send to Back
            </button>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-200" />

      {/* Lock */}
      <button
        onClick={() => toggleLockElement(selectedElement.id)}
        className="p-2 rounded border border-transparent hover:bg-gray-50 hover:border-gray-200"
        title={isLocked ? 'Unlock' : 'Lock'}
      >
        {isLocked ? (
          <Unlock size={18} className="text-gray-600" />
        ) : (
          <Lock size={18} className="text-gray-600" />
        )}
      </button>

      {/* Copy */}
      <button
        onClick={() => duplicateElement(selectedElement.id)}
        disabled={isLocked}
        className={`p-2 rounded border border-transparent ${
          isLocked
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:bg-gray-50 hover:border-gray-200'
        }`}
        title="Copy"
      >
        <Copy size={18} className={isLocked ? 'text-gray-300' : 'text-gray-600'} />
      </button>

      {/* Delete */}
      <button
        onClick={() => deleteElement(selectedElement.id)}
        disabled={isLocked}
        className={`p-2 rounded border border-transparent text-red-600 ${
          isLocked
            ? 'opacity-40 cursor-not-allowed'
            : 'hover:bg-red-50 hover:border-red-200'
        }`}
        title="Delete"
      >
        <Trash2 size={18} className={isLocked ? 'text-red-200' : 'text-red-600'} />
      </button>
    </div>
  );
};

export default CommonToolbar;
