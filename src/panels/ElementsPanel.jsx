import React from 'react';
import { Square, Circle, Triangle, Star, Hexagon, Pentagon } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';

const ElementsPanel = () => {
    const { addElement } = useDesign();

    return (
        <div className="p-4 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800">Shapes</h3>
            <div className="grid grid-cols-2 gap-3">
                <button
                    onClick={() => addElement('rect')}
                    className="aspect-square bg-gray-100 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-200 transition group"
                >
                    <Square size={36} className="text-slate-800" />
                </button>
                <button
                    onClick={() => addElement('circle')}
                    className="aspect-square bg-gray-100 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-200 transition group"
                >
                    <Circle size={36} className="text-slate-800" />
                </button>
                <button
                    onClick={() => addElement('triangle')}
                    className="aspect-square bg-gray-100 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-200 transition group"
                >
                    <Triangle size={36} className="text-slate-800" />
                </button>
                <button
                    onClick={() => addElement('star')}
                    className="aspect-square bg-gray-100 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-200 transition group"
                >
                    <Star size={36} className="text-slate-800" />
                </button>
                <button
                    onClick={() => addElement('pentagon')}
                    className="aspect-square bg-gray-100 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-200 transition group"
                >
                    <Pentagon size={36} className="text-slate-800" />
                </button>
                <button
                    onClick={() => addElement('hexagon')}
                    className="aspect-square bg-gray-100 border border-gray-200 rounded flex items-center justify-center hover:bg-gray-200 transition group"
                >
                    <Hexagon size={36} className="text-slate-800" />
                </button>
            </div>
        </div>
    );
};

export default ElementsPanel;
