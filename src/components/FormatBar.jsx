import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown, Copy, Lock, Trash2, Unlock, Image as ImageIcon, Layers, MoveUp, MoveDown, ArrowUp, ArrowDown, Droplets, FlipHorizontal, FlipVertical, Crop, Shuffle } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';
import ShapeToolbar from './toolbars/ShapeToolbar';
import TextToolbar from './toolbars/TextToolbar';
import CropModal from './CropModal';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

const FormatBar = () => {
  const {
    elements,
    selectedElement,
    updateElement,
    deleteElement,
    duplicateElement,
    toggleLockElement,
    isCanvasLocked,
    toggleCanvasLock,
    setElements,
    canvasSize,
  } = useDesign();
  const [isTransparencyOpen, setIsTransparencyOpen] = useState(false);
  const [isPositionOpen, setIsPositionOpen] = useState(false);
  const [isLayersOpen, setIsLayersOpen] = useState(false);
  const [isCropOpen, setIsCropOpen] = useState(false);
  const [isFlipOpen, setIsFlipOpen] = useState(false);

  const hasSelection = !!selectedElement;

  const transparency = useMemo(() => {
    if (!selectedElement) return 0;
    const opacity = typeof selectedElement.opacity === 'number' ? selectedElement.opacity : 1;
    return clamp(Math.round((1 - opacity) * 100), 0, 100);
  }, [selectedElement]);

  useEffect(() => {
    if (!hasSelection) {
      setIsTransparencyOpen(false);
      setIsPositionOpen(false);
      setIsLayersOpen(false);
      setIsCropOpen(false);
    }
  }, [hasSelection]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.format-dropdown')) {
        setIsTransparencyOpen(false);
        setIsPositionOpen(false);
        setIsLayersOpen(false);
      }
    };

    if (isTransparencyOpen || isPositionOpen || isLayersOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isTransparencyOpen, isPositionOpen, isLayersOpen]);

  const isLocked = hasSelection ? !!selectedElement?.locked : isCanvasLocked;

  // Element type detection
  const isText = hasSelection && selectedElement?.type === 'text';
  const isImage = hasSelection && selectedElement?.type === 'image';
  const isShape = hasSelection && selectedElement?.type && !isText && !isImage;

  // Layer management functions
  const moveLayerUp = () => {
    if (!selectedElement || !elements) return;
    const idx = elements.findIndex(el => el.id === selectedElement.id);
    if (idx < elements.length - 1) {
      const newElements = [...elements];
      [newElements[idx], newElements[idx + 1]] = [newElements[idx + 1], newElements[idx]];
      setElements(newElements);
    }
  };

  const moveLayerDown = () => {
    if (!selectedElement || !elements) return;
    const idx = elements.findIndex(el => el.id === selectedElement.id);
    if (idx > 0) {
      const newElements = [...elements];
      [newElements[idx], newElements[idx - 1]] = [newElements[idx - 1], newElements[idx]];
      setElements(newElements);
    }
  };

  const bringToFront = () => {
    if (!selectedElement || !elements) return;
    const filtered = elements.filter(el => el.id !== selectedElement.id);
    setElements([...filtered, selectedElement]);
  };

  const sendToBack = () => {
    if (!selectedElement || !elements) return;
    const filtered = elements.filter(el => el.id !== selectedElement.id);
    setElements([selectedElement, ...filtered]);
  };

  const setTransparency = (value) => {
    if (!selectedElement) return;
    const t = clamp(Number(value), 0, 100);
    updateElement(selectedElement.id, { opacity: 1 - t / 100 });
  };

  // Color property for images
  const currentFill = (selectedElement && typeof selectedElement.fill === 'string'
    ? selectedElement.fill
    : '#0f172a');

  const handleFillColorChange = (value) => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, { fill: value });
  };

  const handlePositionChange = (axis, value) => {
    if (!selectedElement) return;
    const numValue = Number(value);
    if (isNaN(numValue)) return;
    updateElement(selectedElement.id, { [axis]: numValue });
  };

  // Canvas alignment functions (for positioning elements on canvas)
  const alignLeft = () => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, { x: 0 });
  };

  const alignCenter = () => {
    if (!selectedElement || !canvasSize) return;
    const elementWidth = selectedElement.width || 100;
    const newX = (canvasSize.width - elementWidth) / 2;
    updateElement(selectedElement.id, { x: newX });
  };

  const alignRight = () => {
    if (!selectedElement || !canvasSize) return;
    const elementWidth = selectedElement.width || 100;
    const newX = canvasSize.width - elementWidth;
    updateElement(selectedElement.id, { x: newX });
  };

  const alignTop = () => {
    if (!selectedElement) return;
    updateElement(selectedElement.id, { y: 0 });
  };

  const alignMiddle = () => {
    if (!selectedElement || !canvasSize) return;
    const elementHeight = selectedElement.height || 100;
    const newY = (canvasSize.height - elementHeight) / 2;
    updateElement(selectedElement.id, { y: newY });
  };

  const alignBottom = () => {
    if (!selectedElement || !canvasSize) return;
    const elementHeight = selectedElement.height || 100;
    const newY = canvasSize.height - elementHeight;
    updateElement(selectedElement.id, { y: newY });
  };

  return (
    <div className="w-full relative overflow-visible bg-white/90 backdrop-blur border border-gray-200 shadow-sm px-2 py-2">
      <div className="relative w-full flex flex-nowrap items-center gap-1">
      {/* Text formatting controls - show only for text */}
      {isText && (
        <>
          <TextToolbar />
          <div className="w-px h-6 bg-gray-200 mx-0.5" />
        </>
      )}

      {/* Color controls - show only when nothing selected (no color for images) */}
      {(!hasSelection && !isText && !isShape && !isImage) && (
        <div className={[
          'flex items-center gap-1 mr-2 px-2 py-1 rounded',
          !hasSelection && 'opacity-40 cursor-not-allowed'
        ].join(' ')}>
          <input
            type="color"
            value={currentFill}
            onChange={(e) => handleFillColorChange(e.target.value)}
            disabled={!hasSelection}
            className={[
              'w-8 h-8 rounded border border-gray-200',
              hasSelection ? 'cursor-pointer' : 'cursor-not-allowed'
            ].join(' ')}
            title={'Fill color'}
          />
        </div>
      )}

      {/* Shape controls - show only for shapes */}
      {isShape && (
        <>
          <ShapeToolbar />
          <div className="w-px h-6 bg-gray-200 mx-0.5" />
        </>
      )}

      {/* Image controls - show only for images */}
      {isImage && (
        <>
          <button
            type="button"
            className="text-sm px-3 py-1.5 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2"
            onClick={() => {
              // Trigger file input for image replacement
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = 'image/*';
              input.onchange = (e) => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    updateElement(selectedElement.id, { src: reader.result });
                  };
                  reader.readAsDataURL(file);
                }
              };
              input.click();
            }}
            title="Replace Image"
          >
            <ImageIcon size={16} />
            Replace Image
          </button>

          {/* Flip Dropdown */}
          <div className="relative format-dropdown">
            <button
              type="button"
              className="text-sm px-3 py-1.5 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2"
              onClick={() => setIsFlipOpen((v) => !v)}
              title="Flip Image"
            >
              <Shuffle size={16} />
              Flip
              <ChevronDown size={14} />
            </button>
            {isFlipOpen && (
              <div className="absolute left-0 top-full mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 min-w-45">
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement('canvas');
                      canvas.width = img.width;
                      canvas.height = img.height;
                      const ctx = canvas.getContext('2d');
                      
                      // Flip horizontally
                      ctx.translate(canvas.width, 0);
                      ctx.scale(-1, 1);
                      ctx.drawImage(img, 0, 0);
                      
                      const flippedSrc = canvas.toDataURL('image/png');
                      updateElement(selectedElement.id, { src: flippedSrc });
                    };
                    img.src = selectedElement.src;
                    setIsFlipOpen(false);
                  }}
                >
                  <FlipHorizontal size={16} />
                  Flip Horizontal
                </button>
                <button
                  type="button"
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                  onClick={() => {
                    const img = new Image();
                    img.onload = () => {
                      const canvas = document.createElement('canvas');
                      canvas.width = img.width;
                      canvas.height = img.height;
                      const ctx = canvas.getContext('2d');
                      
                      // Flip vertically
                      ctx.translate(0, canvas.height);
                      ctx.scale(1, -1);
                      ctx.drawImage(img, 0, 0);
                      
                      const flippedSrc = canvas.toDataURL('image/png');
                      updateElement(selectedElement.id, { src: flippedSrc });
                    };
                    img.src = selectedElement.src;
                    setIsFlipOpen(false);
                  }}
                >
                  <FlipVertical size={16} />
                  Flip Vertical
                </button>
              </div>
            )}
          </div>

          {/* Crop Button */}
          <button
            type="button"
            className="text-sm px-3 py-1.5 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 flex items-center gap-2"
            onClick={() => setIsCropOpen(true)}
            title="Crop Image"
          >
            <Crop size={16} />
            Crop
          </button>

          {/* Crop Modal */}
          {isCropOpen && (
            <CropModal 
              element={selectedElement} 
              onClose={() => setIsCropOpen(false)}
              onCrop={(croppedData) => {
                updateElement(selectedElement.id, croppedData);
                setIsCropOpen(false);
              }}
            />
          )}
        </>
      )}

      {/* Position control - always show but disabled when nothing selected */}
      <div className="relative format-dropdown">
        <button
          type="button"
          onClick={() => hasSelection && setIsPositionOpen((v) => !v)}
          disabled={!hasSelection}
          className={[
            'text-sm px-3 py-1.5 rounded border flex items-center gap-2',
            hasSelection 
              ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50' 
              : 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
          ].join(' ')}
          title="Position"
        >
          Position
          <ChevronDown size={16} className="text-gray-500" />
        </button>

        {isPositionOpen && hasSelection && (
          <div className="absolute top-[calc(100%+8px)] left-0 bg-white border border-gray-200 shadow-lg rounded p-3 w-64 z-99999">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">X Position</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.x || 0)}
                  onChange={(e) => handlePositionChange('x', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Y Position</label>
                <input
                  type="number"
                  value={Math.round(selectedElement.y || 0)}
                  onChange={(e) => handlePositionChange('y', e.target.value)}
                  className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                />
              </div>

              {/* Horizontal Alignment */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Horizontal Align</label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={alignLeft}
                    className="flex-1 px-2 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700"
                    title="Align Left"
                  >
                    Left
                  </button>
                  <button
                    onClick={alignCenter}
                    className="flex-1 px-2 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700"
                    title="Align Center"
                  >
                    Center
                  </button>
                  <button
                    onClick={alignRight}
                    className="flex-1 px-2 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700"
                    title="Align Right"
                  >
                    Right
                  </button>
                </div>
              </div>

              {/* Vertical Alignment */}
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Vertical Align</label>
                <div className="flex items-center gap-1">
                  <button
                    onClick={alignTop}
                    className="flex-1 px-2 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700"
                    title="Align Top"
                  >
                    Top
                  </button>
                  <button
                    onClick={alignMiddle}
                    className="flex-1 px-2 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700"
                    title="Align Middle"
                  >
                    Middle
                  </button>
                  <button
                    onClick={alignBottom}
                    className="flex-1 px-2 py-1.5 rounded border border-gray-200 hover:bg-gray-50 text-xs font-medium text-gray-700"
                    title="Align Bottom"
                  >
                    Bottom
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Layers control - always show but disabled when nothing selected */}
      <div className="relative format-dropdown">
        <button
          type="button"
          onClick={() => hasSelection && setIsLayersOpen((v) => !v)}
          disabled={!hasSelection}
          className={[
            'text-sm px-3 py-1.5 rounded border flex items-center gap-2',
            hasSelection 
              ? 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50' 
              : 'border-gray-300 text-gray-400 bg-gray-50 cursor-not-allowed'
          ].join(' ')}
          title="Layers"
        >
          <Layers size={16} />
          Layers
        </button>

        {isLayersOpen && hasSelection && (
          <div className="absolute top-[calc(100%+8px)] left-0 bg-white border border-gray-200 shadow-lg rounded p-2 w-48 z-99999">
            <button
              onClick={bringToFront}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <ArrowUp size={16} />
              Bring to Front
            </button>
            <button
              onClick={moveLayerUp}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <MoveUp size={16} />
              Bring Forward
            </button>
            <button
              onClick={moveLayerDown}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <MoveDown size={16} />
              Send Backward
            </button>
            <button
              onClick={sendToBack}
              className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 rounded flex items-center gap-2"
            >
              <ArrowDown size={16} />
              Send to Back
            </button>
          </div>
        )}
      </div>

      <div className="w-px h-6 bg-gray-200 mx-0.5" />

      {/* Transparency */}
      <div className="relative format-dropdown">
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
          <Droplets size={16} />
          <span className="text-gray-500">{transparency}%</span>
          <ChevronDown size={16} className="text-gray-500" />
        </button>

        {isTransparencyOpen && hasSelection && (
          <div className="absolute top-[calc(100%+8px)] left-0 bg-white border border-gray-200 shadow-lg rounded p-3 w-64 z-99999">
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

      <div className="w-px h-6 bg-gray-200 mx-0.5" />

      {/* Lock */}
      <button
        type="button"
        onClick={() =>
          hasSelection && selectedElement
            ? toggleLockElement(selectedElement.id)
            : toggleCanvasLock()
        }
        className="p-2 rounded border border-transparent hover:bg-gray-50 hover:border-gray-200"
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
    </div>
  );
};

export default FormatBar;

