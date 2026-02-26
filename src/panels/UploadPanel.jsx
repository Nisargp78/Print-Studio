import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';
import { v4 as uuidv4 } from 'uuid';

const UploadPanel = () => {
    const { setElements, setActiveTab } = useDesign();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setElements((prev) => [
                    ...prev,
                    {
                        id: uuidv4(),
                        type: 'image',
                        x: 100,
                        y: 100,
                        width: 200,
                        height: 200,
                        src: reader.result,
                    }
                ]);
                setActiveTab('quick_edit');
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="p-4 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800">File Upload</h3>
            <label className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 flex items-center justify-center font-medium transition rounded cursor-pointer gap-2 shadow-sm">
                <ImageIcon size={18} />
                Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
            <p className="text-xs text-gray-500 text-center mt-2">Upload PNG, JPG from your computer.</p>
        </div>
    );
};

export default UploadPanel;
