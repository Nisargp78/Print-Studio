import React from 'react';
import { Trash2 } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';

const QuickEditPanel = () => {
    const {
        elements,
        updateElement,
        deleteElement,
        setSelectedId,
        setActiveTab
    } = useDesign();

    // Filter only text elements
    const textElements = elements.filter(el => el.type === 'text');

    const handleTextClick = (elementId) => {
        setSelectedId(elementId);
        setActiveTab('text');
    };

    const handleKeyDown = (e, elementId) => {
        if (e.key === 'Delete' && e.ctrlKey) {
            e.preventDefault();
            deleteElement(elementId);
        }
    };

    const handleDelete = (e, elementId) => {
        e.stopPropagation();
        deleteElement(elementId);
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800 mb-2">Quick Edit Text</h3>

            {textElements.length === 0 ? (
                <div className="text-sm text-gray-500 italic text-center py-8">
                    No text elements on canvas. Add text to edit here.
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {textElements.map((element) => (
                        <div 
                            key={element.id} 
                            className="flex flex-col gap-2 relative group"
                            onClick={() => handleTextClick(element.id)}
                        >
                            <div className="relative">
                                <textarea
                                    value={element.text}
                                    onChange={(e) => {
                                        e.stopPropagation();
                                        updateElement(element.id, { text: e.target.value });
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => handleKeyDown(e, element.id)}
                                    className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors resize-none"
                                    rows={3}
                                    placeholder="Enter text..."
                                />
                                <button
                                    onClick={(e) => handleDelete(e, element.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Delete text (or Ctrl+Delete)"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default QuickEditPanel;
