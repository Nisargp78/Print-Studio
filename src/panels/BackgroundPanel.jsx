import React from 'react';
import { useDesign } from '../context/useDesignContext';

const BackgroundPanel = () => {
    const { backgroundColor, setBackgroundColor } = useDesign();

    return (
        <div className="p-4 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800">Background</h3>
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Canvas Color</label>
                <div className="flex gap-2 items-center">
                    <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-0 p-0 shadow-sm"
                    />
                    <span className="text-sm text-gray-600 font-mono border border-gray-200 px-2 py-1 rounded bg-gray-50 uppercase tracking-wider">
                        {backgroundColor}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default BackgroundPanel;
