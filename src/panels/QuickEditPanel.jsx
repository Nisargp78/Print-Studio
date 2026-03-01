import React from 'react';
import { Trash2 } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';

/**
 * Measures text dimensions to match Konva Text rendering.
 * Used when editing text in Quick Edit panel so the canvas text area auto-expands.
 */
function measureTextDimensions(text, element) {
    const fontSize = element.fontSize || 32;
    const fontFamily = element.fontFamily || 'Arial, sans-serif';
    const fontWeight = (element.fontWeight === 'bold' || String(element.fontWeight || '').match(/^[6-9]\d{2}$/)) ? 'bold' : 'normal';
    const fontStyle = (element.fontStyle || 'normal').toLowerCase().includes('italic') ? 'italic' : 'normal';
    const lineHeight = element.lineHeight ?? 1.2;
    const hasUnderline = typeof element.textDecoration === 'string' &&
        element.textDecoration.toLowerCase().includes('underline');
    const padding = typeof element.padding === 'number' ? element.padding : (hasUnderline ? 4 : 0);
    const bottomPadding = padding + (hasUnderline ? 4 : 0);

    const measureEl = document.createElement('div');
    measureEl.style.position = 'absolute';
    measureEl.style.visibility = 'hidden';
    measureEl.style.whiteSpace = 'pre';
    measureEl.style.fontSize = `${fontSize}px`;
    measureEl.style.fontFamily = fontFamily;
    measureEl.style.fontWeight = fontWeight;
    measureEl.style.fontStyle = fontStyle;
    measureEl.style.lineHeight = String(lineHeight);
    measureEl.style.padding = '0';
    measureEl.style.margin = '0';
    measureEl.style.border = 'none';
    measureEl.style.display = 'inline-block';
    measureEl.style.pointerEvents = 'none';
    measureEl.textContent = text || 'a';

    document.body.appendChild(measureEl);
    const rect = measureEl.getBoundingClientRect();
    document.body.removeChild(measureEl);

    // Add buffer for sub-pixel differences and leading/trailing spaces (DOM vs canvas rendering)
    const MEASURE_BUFFER = 20;
    const contentWidth = Math.max(40 - padding * 2, Math.ceil(rect.width) + MEASURE_BUFFER);
    const contentHeight = Math.max(fontSize, Math.ceil(rect.height));
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
