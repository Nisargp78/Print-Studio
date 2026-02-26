import React from 'react';
import { Trash2 } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';

const QuickEditPanel = () => {
    const {
        selectedElement,
        updateElement,
        deleteElement
    } = useDesign();

    if (!selectedElement) {
        return (
            <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-4">Quick Edit</h3>
                <div className="text-sm text-gray-500 italic text-center py-8">
                    Select an element on the canvas to edit its properties.
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800">Quick Edit</h3>

            <div className="flex flex-col gap-5">
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-100 p-2 rounded text-center">
                    {selectedElement.type} Selected
                </div>

                {selectedElement.type !== 'image' && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                        <input
                            type="color"
                            value={selectedElement.fill || '#000000'}
                            onChange={(e) => updateElement(selectedElement.id, { fill: e.target.value })}
                            className="w-full h-10 rounded cursor-pointer bg-transparent border-0"
                        />
                    </div>
                )}

                {selectedElement.type === 'text' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Text content</label>
                            <textarea
                                value={selectedElement.text}
                                onChange={(e) => updateElement(selectedElement.id, { text: e.target.value })}
                                className="w-full border border-gray-300 rounded p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                                rows={3}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Font Size</label>
                            <input
                                type="number"
                                value={selectedElement.fontSize || 24}
                                onChange={(e) => updateElement(selectedElement.id, { fontSize: parseInt(e.target.value) || 24 })}
                                className="w-full border border-gray-300 rounded p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                            />
                        </div>
                    </>
                )}

                <button
                    onClick={() => deleteElement(selectedElement.id)}
                    className="mt-4 flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-3 rounded-md text-sm font-medium transition-colors border border-red-200"
                >
                    <Trash2 size={16} /> Delete Element
                </button>
            </div>
        </div>
    );
};

export default QuickEditPanel;
