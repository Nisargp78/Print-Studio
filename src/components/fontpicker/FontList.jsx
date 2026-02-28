import React, { useMemo, useRef, useEffect } from 'react';
import FontItem from './FontItem';

const ITEM_HEIGHT = 36;
const VISIBLE_ITEMS = 12;

const FontList = ({ fonts, selectedFont, onSelectFont, searchTerm }) => {
  const scrollContainerRef = useRef(null);

  const selectedIndex = fonts.findIndex(f => f.family === selectedFont?.family);

  useEffect(() => {
    if (selectedIndex >= 0 && scrollContainerRef.current) {
      const selectedTop = selectedIndex * ITEM_HEIGHT;
      const containerHeight = VISIBLE_ITEMS * ITEM_HEIGHT;
      const scrollContainer = scrollContainerRef.current;

      if (selectedTop < scrollContainer.scrollTop) {
        scrollContainer.scrollTop = selectedTop;
      } else if (selectedTop + ITEM_HEIGHT > scrollContainer.scrollTop + containerHeight) {
        scrollContainer.scrollTop = selectedTop + ITEM_HEIGHT - containerHeight;
      }
    }
  }, [selectedIndex, searchTerm]);

  return (
    <div
      ref={scrollContainerRef}
      className="overflow-y-auto border-t border-gray-200"
      style={{ maxHeight: `${ITEM_HEIGHT * VISIBLE_ITEMS}px` }}
    >
      {fonts.length === 0 ? (
        <div className="px-4 py-8 text-center text-sm text-gray-500">
          No fonts found
        </div>
      ) : (
        fonts.map((font) => (
          <FontItem
            key={font.family}
            font={font}
            isSelected={selectedFont?.family === font.family}
            onSelect={onSelectFont}
          />
        ))
      )}
    </div>
  );
};

export default FontList;
