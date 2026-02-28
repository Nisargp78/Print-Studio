import React from 'react';
import { useDesign } from '../context/useDesignContext';
import TextToolbar from './toolbars/TextToolbar';
import ShapeToolbar from './toolbars/ShapeToolbar';
import ImageToolbar from './toolbars/ImageToolbar';
import CommonToolbar from './toolbars/CommonToolbar';

/**
 * Dynamic Toolbar Component
 * Renders different toolbar controls based on selected element type
 */
const Toolbar = () => {
  const { selectedType, selectedElement } = useDesign();

  // Don't render toolbar if nothing is selected
  if (!selectedElement) {
    return null;
  }

  return (
    <div className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="px-4 py-3 flex items-center gap-4">
        {/* Element Type Indicator */}
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          {selectedType}
        </div>

        <div className="w-px h-6 bg-gray-200" />

        {/* Type-specific toolbar */}
        {selectedType === 'text' && <TextToolbar />}
        {selectedType === 'image' && <ImageToolbar />}
        {['rect', 'circle', 'triangle', 'star', 'pentagon', 'hexagon'].includes(selectedType) && (
          <ShapeToolbar />
        )}

        {/* Common controls for all types */}
        <div className="ml-auto">
          <CommonToolbar />
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
