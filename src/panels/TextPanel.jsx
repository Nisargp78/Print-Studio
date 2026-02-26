import React from 'react';
import { useDesign } from '../context/useDesignContext';

const TextPanel = () => {
    const { addElement } = useDesign();

    return (
        <div className="p-4 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800">Text</h3>
            <button
                onClick={() => addElement('text', { fontSize: 48, fontWeight: 'bold' })}
                className="w-full bg-gray-100 border border-gray-200 p-3 flex items-center justify-center font-bold text-2xl hover:bg-gray-200 transition rounded text-slate-900"
            >
                Add a heading
            </button>
            <button
                onClick={() => addElement('text', { fontSize: 32, fontWeight: 'medium' })}
                className="w-full bg-gray-100 border border-gray-200 p-3 flex items-center justify-center font-medium text-xl hover:bg-gray-200 transition rounded text-slate-800"
            >
                Add a subheading
            </button>
            <button
                onClick={() => addElement('text', { fontSize: 20 })}
                className="w-full bg-gray-100 border border-gray-200 p-3 flex items-center justify-center text-sm hover:bg-gray-200 transition rounded text-slate-700"
            >
                Add a little bit of body text
            </button>
        </div>
    );
};

export default TextPanel;
