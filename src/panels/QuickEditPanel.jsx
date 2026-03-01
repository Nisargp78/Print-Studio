import React from 'react';
import { Trash2 } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';
import { measureTextCanvas } from '../utils/measureText';

/**
 * Measures text using Canvas 2D API - same engine as Konva. Accurate for any text (1 space, 10 spaces, etc).
 */
function measureTextDimensions(text, element) {
    const fontSize = element.fontSize || 32;
    const lineHeight = element.lineHeight ?? 1.2;
    const hasUnderline = typeof element.textDecoration === 'string' &&
        element.textDecoration.toLowerCase().includes('underline');
    const padding = typeof element.padding === 'number' ? element.padding : (hasUnderline ? 4 : 0);
    const bottomPadding = padding + (hasUnderline ? 4 : 0);

    const measured = measureTextCanvas(text, element);
    if (!measured) return { width: 80, height: fontSize + padding + bottomPadding };

    const contentWidth = Math.max(40 - padding * 2, Math.ceil(measured.width) + 4);
    const contentHeight = fontSize * (parseFloat(lineHeight) || 1.2);
    const width = contentWidth + padding * 2;
    const height = contentHeight + padding + bottomPadding;

    return { width, height };
}

const QuickEditPanel = () => {
    const {
        elements,
        updateElement,
        deleteElement,
        setSelectedId,
        setActiveTab,
        isCanvasLocked,
    } = useDesign();

    // Filter only text elements
    const textElements = elements.filter(el => el.type === 'text');

    const handleTextClick = (elementId) => {
        if (isCanvasLocked) return;
        setSelectedId(elementId);
        setActiveTab('text');
    };

    const handleKeyDown = (e, elementId) => {
        if (isCanvasLocked) return;
        if (e.key === 'Delete' && e.ctrlKey) {
            e.preventDefault();
            deleteElement(elementId);
        }
    };

    const handleDelete = (e, elementId) => {
        e.stopPropagation();
        if (isCanvasLocked) return;
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
                                        const newText = e.target.value;
                                        const { width, height } = measureTextDimensions(newText, element);
                                        updateElement(element.id, { text: newText, width, height });
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                    onKeyDown={(e) => handleKeyDown(e, element.id)}
                                    className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50 hover:bg-white transition-colors resize-none"
                                    rows={3}
                                    placeholder="Enter text..."
                                />
                                <button
                                    onClick={(e) => handleDelete(e, element.id)}
                                    className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                                    title={isCanvasLocked ? 'Canvas locked' : 'Delete text (or Ctrl+Delete)'}
                                    disabled={isCanvasLocked}
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
