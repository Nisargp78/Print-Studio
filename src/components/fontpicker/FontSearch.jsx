import React, { useCallback } from 'react';
import { Search, X } from 'lucide-react';

const FontSearch = ({ searchTerm, onSearchChange, onClear }) => {
  const handleChange = useCallback((e) => {
    onSearchChange(e.target.value);
  }, [onSearchChange]);

  return (
    <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 z-10">
      <div className="mb-2 text-xs font-semibold text-gray-600">SELECT FONT</div>
      <div className="relative">
        <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={handleChange}
          className="w-full pl-7 pr-7 py-1.5 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
          autoFocus
        />
        {searchTerm && (
          <button
            onClick={onClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

export default FontSearch;
