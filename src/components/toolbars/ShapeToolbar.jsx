import React from 'react';
import { useDesign } from '../../context/useDesignContext';

/**
 * ShapeToolbar Component
 * Shows fill color, stroke color, and opacity controls for shape elements
 */
const ShapeToolbar = () => {
  const { selectedElement, updateElement } = useDesign();

  if (!selectedElement) return null;

  const fill = selectedElement.fill || '#0f172a';
  const stroke = selectedElement.stroke || '#0f172a';
  const isShapeElement = ['rect', 'circle', 'triangle', 'star', 'pentagon', 'hexagon'].includes(selectedElement.type);
  const isIconElement = selectedElement.type?.startsWith('icon-');
  const shapeFilled = Boolean(selectedElement.shapeFilled);
  const iconFilled = Boolean(selectedElement.iconFilled);

  const handleUpdate = (props) => {
    updateElement(selectedElement.id, props);
  };

  return (
    <div className="flex items-center gap-2">
      {isShapeElement && (
        <>
          {/* Stroke/Outline Color */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">Stroke:</span>
            <input
              type="color"
              value={stroke}
              onChange={(e) => handleUpdate({ stroke: e.target.value })}
              className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
              title="Pick stroke/outline color"
            />
          </div>

          <div className="w-px h-6 bg-gray-200" />

          <label className="flex items-center gap-2 text-xs text-gray-700 select-none">
            <input
              type="checkbox"
              checked={shapeFilled}
              onChange={(e) => handleUpdate({ shapeFilled: e.target.checked })}
              className="w-4 h-4 cursor-pointer"
            />
            Filled
          </label>

          {shapeFilled && (
            <>
              <div className="w-px h-6 bg-gray-200" />
              
              {/* Fill Color - only show when filled */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-gray-600">Fill:</span>
                <input
                  type="color"
                  value={fill}
                  onChange={(e) => handleUpdate({ fill: e.target.value })}
                  className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                  title="Pick fill color"
                />
              </div>
            </>
          )}

          <div className="w-px h-6 bg-gray-200" />
        </>
      )}

      {isIconElement && (
        <>
          {/* Icon Fill Color */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-gray-600">Color:</span>
            <input
              type="color"
              value={fill}
              onChange={(e) => handleUpdate({ fill: e.target.value })}
              className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
              title="Pick icon color"
            />
          </div>

          <div className="w-px h-6 bg-gray-200" />

          <label className="flex items-center gap-2 text-xs text-gray-700 select-none">
            <input
              type="checkbox"
              checked={iconFilled}
              onChange={(e) => handleUpdate({ iconFilled: e.target.checked })}
              className="w-4 h-4 cursor-pointer"
            />
            Filled
          </label>

          <div className="w-px h-6 bg-gray-200" />
        </>
      )}

    </div>
  );
};

export default ShapeToolbar;
