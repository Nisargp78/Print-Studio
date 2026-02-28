import React, { useMemo } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';
import { v4 as uuidv4 } from 'uuid';

const UploadPanel = () => {
    const { setElements, setActiveTab, selectedElement } = useDesign();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
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
                            originalWidth: img.width,
                            originalHeight: img.height,
                        }
                    ]);
                    setActiveTab('upload');
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const isImageSelected = selectedElement && selectedElement.type === 'image';
    
    // Convert pixels to inches (96 DPI standard for screen)
    const pxToInches = (px) => (px / 96).toFixed(2);
    
    // Calculate image parameters reactively
    const imageParams = useMemo(() => {
        if (!isImageSelected) return null;
        
        const x = selectedElement.x || 0;
        const y = selectedElement.y || 0;
        const width = selectedElement.width || 0;
        const height = selectedElement.height || 0;
        const resolution = Math.sqrt(width * width + height * height).toFixed(2);
        
        return {
            left: pxToInches(x),
            top: pxToInches(y),
            width: pxToInches(width),
            height: pxToInches(height),
            resolution
        };
    }, [isImageSelected, selectedElement]);

    return (
        <div className="p-4 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800 mb-2">File Upload</h3>
            
            <p className="text-sm text-gray-600">Do you want to upload your own images?</p>
            
            <label className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 flex items-center justify-center font-medium transition rounded cursor-pointer gap-2">
                <ImageIcon size={18} />
                Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>

            {imageParams && (
                <div className="mt-4 space-y-2 text-sm text-gray-700 border-t pt-4">
                    <div>
                        <span className="font-medium">Left:</span> {imageParams.left} inches
                    </div>
                    <div>
                        <span className="font-medium">Top:</span> {imageParams.top} inches
                    </div>
                    <div>
                        <span className="font-medium">Width:</span> {imageParams.width} inches
                    </div>
                    <div>
                        <span className="font-medium">Height:</span> {imageParams.height} inches
                    </div>
                    <div>
                        <span className="font-medium">Resolution:</span> {imageParams.resolution} px
                    </div>
                </div>
            )}
        </div>
    );
};

export default UploadPanel;
