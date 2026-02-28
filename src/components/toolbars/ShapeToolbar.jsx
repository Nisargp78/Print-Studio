import React, { useState } from 'react';
import { Droplet, ChevronDown } from 'lucide-react';
import { useDesign } from '../../context/useDesignContext';

const clamp = (n, min, max) => Math.min(max, Math.max(min, n));

/**
 * ShapeToolbar Component
 * Shows fill color, stroke color, and opacity controls for shape elements
 */
const ShapeToolbar = () => {
  const { selectedElement, updateElement } = useDesign();
  const [isOpacityOpen, setIsOpacityOpen] = useState(false);

  if (!selectedElement) return null;

  const fill = selectedElement.fill || '#0f172a';
  const opacity = selectedElement.opacity || 1;
  const transparency = clamp(Math.round((1 - opacity) * 100), 0, 100);

  const handleUpdate = (props) => {
    updateElement(selectedElement.id, props);
  };

  const setTransparency = (value) => {
    const t = clamp(Number(value), 0, 100);
    handleUpdate({ opacity: 1 - t / 100 });
  };

  return (
    <div className="flex items-center gap-3">
      {/* Fill Color */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium text-gray-600">Fill:</span>
        <button
          className="w-8 h-8 rounded border border-gray-200 bg-white flex items-center justify-center"
          title="Fill Color"
        >
          <Droplet size={16} className="text-gray-700" />
        </button>
        <input
          type="color"
          value={fill}
          onChange={(e) => handleUpdate({ fill: e.target.value })}
          className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
          title="Pick fill color"
        />
      </div>

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

export default ShapeToolbar;
