import React, { useState } from 'react';
import { Image as ImageIcon, ChevronDown, FlipHorizontal, FlipVertical } from 'lucide-react';
import { useDesign } from '../../context/useDesignContext';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/**
 * ImageToolbar Component
 * Shows replace image button, flip controls, and opacity controls for image elements
 */
const ImageToolbar = () => {
  const { selectedElement, updateElement } = useDesign();
  const [isOpacityOpen, setIsOpacityOpen] = useState(false);

  if (!selectedElement) return null;

  const opacity = selectedElement.opacity || 1;
  const transparency = clamp(Math.round((1 - opacity) * 100), 0, 100);
  const scaleX = selectedElement.scaleX || 1;
  const scaleY = selectedElement.scaleY || 1;

  const handleUpdate = (props) => {
    updateElement(selectedElement.id, props);
  };

  const setTransparency = (value) => {
    const t = clamp(Number(value), 0, 100);
    handleUpdate({ opacity: 1 - t / 100 });
  };

  const handleReplaceImage = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          handleUpdate({ src: reader.result });
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleFlipHorizontal = () => {
    handleUpdate({ scaleX: scaleX === 1 ? -1 : 1 });
  };

  const handleFlipVertical = () => {
    handleUpdate({ scaleY: scaleY === 1 ? -1 : 1 });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Replace Image Button */}
      <button
        onClick={handleReplaceImage}
        className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        title="Replace Image"
      >
        <ImageIcon size={16} />
        Replace Image
      </button>

      <div className="w-px h-6 bg-gray-200" />

      {/* Flip Horizontal Button */}
      <button
        onClick={handleFlipHorizontal}
        className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        title="Flip Horizontally"
      >
        <FlipHorizontal size={16} />
      </button>

      {/* Flip Vertical Button */}
      <button
        onClick={handleFlipVertical}
        className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
        title="Flip Vertically"
      >
        <FlipVertical size={16} />
      </button>

      <div className="w-px h-6 bg-gray-200" />

      {/* Opacity/Transparency */}
      <div className="relative">
        <button
          onClick={() => setIsOpacityOpen(!isOpacityOpen)}
          className="px-3 py-1.5 bg-white border border-gray-200 rounded text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
          title="Opacity"
        >
          <span>Opacity</span>
          <span className="text-gray-500">{100 - transparency}%</span>
          <ChevronDown size={14} />
        </button>

        {isOpacityOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded shadow-lg p-3 w-56 z-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-gray-700">Opacity</span>
              <span className="text-xs text-gray-600">{100 - transparency}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={transparency}
              onChange={(e) => setTransparency(e.target.value)}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Transparent</span>
              <span>Opaque</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageToolbar;
