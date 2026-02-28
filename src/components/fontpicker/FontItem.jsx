import React from 'react';

const FontItem = ({ font, isSelected, onSelect }) => {
  return (
    <button
      onClick={() => onSelect(font)}
      className={`w-full px-4 py-2 text-left transition-colors border-b border-gray-100 ${
        isSelected ? 'bg-blue-500 text-white' : 'hover:bg-gray-100'
      }`}
    >
      <div
        style={{ fontFamily: font.family }}
        className="text-sm truncate"
      >
        {font.name}
      </div>
    </button>
  );
};

export default FontItem;
