import React, { useMemo, useState } from 'react';
import { Image as ImageIcon, Plus, X } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';
import { v4 as uuidv4 } from 'uuid';

const UploadPanel = () => {
    const { 
        addUploadedImage, 
        removeUploadedImage, 
        uploadedImages, 
        addImageToCanvas,
        selectedElement 
    } = useDesign();

    const [imageLoadingStates, setImageLoadingStates] = useState({});

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                const img = new Image();
                img.onload = () => {
                    const newImageId = uuidv4();
                    setImageLoadingStates((prev) => ({ ...prev, [newImageId]: false }));
                    addUploadedImage({
                        id: newImageId,
                        src: reader.result,
                        originalWidth: img.width,
                        originalHeight: img.height,
                        name: file.name,
                    });
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddToCanvas = (uploadedImage) => {
        addImageToCanvas(uploadedImage);
    };

    const handleDelete = (id) => {
        removeUploadedImage(id);
        setImageLoadingStates((prev) => {
            const newState = { ...prev };
            delete newState[id];
            return newState;
        });
    };

    const handleImageLoad = (id) => {
        setImageLoadingStates((prev) => ({ ...prev, [id]: false }));
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
        <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto">
            <h3 className="font-semibold text-gray-800">File Upload</h3>
            
            <p className="text-sm text-gray-600">Upload images to add them to your design</p>
            
            <label className="w-full bg-gray-800 hover:bg-gray-700 text-white p-3 flex items-center justify-center font-medium transition rounded cursor-pointer gap-2">
                <Plus size={18} />
                Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>

            {/* Display uploaded images */}
            {uploadedImages.length > 0 && (
                <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Uploaded Images ({uploadedImages.length})</h4>
                    <div className="grid grid-cols-2 gap-3">
                        {uploadedImages.map((image) => (
                            <div 
                                key={image.id} 
                                className="relative group rounded-md overflow-hidden border-2 border-gray-300 hover:border-blue-500 transition bg-gray-50 flex items-center justify-center"
                                style={{ minHeight: '120px' }}
                            >
                                <img 
                                    src={image.src} 
                                    alt={image.name}
                                    onLoad={() => handleImageLoad(image.id)}
                                    className="max-w-full max-h-full w-auto h-auto"
                                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                                />
                                
                                {/* Overlay on hover */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                    <button
                                        onClick={() => handleAddToCanvas(image)}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1 whitespace-nowrap"
                                        title="Add to canvas"
                                    >
                                        <ImageIcon size={14} />
                                        Add
                                    </button>
                                    <button
                                        onClick={() => handleDelete(image.id)}
                                        className="bg-red-500 hover:bg-red-600 text-white p-1 rounded"
                                        title="Delete"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Show image properties when selected */}
            {imageParams && (
                <div className="mt-4 space-y-2 text-sm text-gray-700 border-t pt-4">
                    <h4 className="font-medium text-gray-800">Selected Image Properties</h4>
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
