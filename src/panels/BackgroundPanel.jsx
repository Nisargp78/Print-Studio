import React from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';

const PRESET_COLORS = [
    '#ffffff', '#3B82F6', '#FB923C', '#4ADE80', '#FACC15', '#A78BFA', '#DC2626',
    '#F97316', '#FDE047', '#78350F', '#BBF7D0', '#365314', '#1E40AF', '#67E8F9',
    '#000000'
];

const BackgroundPanel = () => {
    const { 
        backgroundColor, 
        setBackgroundColor, 
        backgroundImage, 
        setBackgroundImage,
        removeBackgroundImage 
    } = useDesign();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setBackgroundImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-4 flex flex-col gap-6">
            <div>
                <h3 className="font-semibold text-gray-800 mb-4">Background Image</h3>
                
                <div className="flex gap-2">
                    <label className="flex-1 bg-gray-800 hover:bg-gray-700 text-white p-3 flex items-center justify-center font-medium transition rounded cursor-pointer gap-2 text-sm">
                        <Upload size={16} />
                        Upload BG
                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                    </label>
                    
                    {backgroundImage && (
                        <button
                            onClick={removeBackgroundImage}
                            className="bg-gray-700 hover:bg-gray-600 text-white p-3 flex items-center justify-center font-medium transition rounded gap-2 text-sm"
                            title="Remove background image"
                        >
                            <Trash2 size={16} />
                            Remove BG
                        </button>
                    )}
                </div>
                
                {backgroundImage && (
                    <div className="mt-3 rounded overflow-hidden border-2 border-gray-200">
                        <img src={backgroundImage} alt="Background" className="w-full h-24 object-cover" />
                    </div>
                )}
            </div>

            <div>
                <h3 className="font-semibold text-gray-800 mb-3">Solid Colors</h3>
                
                <div className="grid grid-cols-5 gap-3 mb-4">
                    {PRESET_COLORS.map((color) => (
                        <button
                            key={color}
                            onClick={() => setBackgroundColor(color)}
                            className={`w-12 h-12 rounded-md cursor-pointer border-2 transition-all hover:scale-105 ${
                                backgroundColor === color ? 'border-blue-500 ring-2 ring-blue-300' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color }}
                            title={color}
                        />
                    ))}
                </div>

                <div className="flex gap-2 items-center p-3 bg-gray-50 rounded border border-gray-200">
                    <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-10 h-10 rounded cursor-pointer border-2 border-gray-300"
                    />
                    <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Custom Color</div>
                        <span className="text-sm text-gray-700 font-mono uppercase tracking-wider">
                            {backgroundColor}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BackgroundPanel;
