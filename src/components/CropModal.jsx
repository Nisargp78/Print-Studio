import React, { useState, useRef, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const CropModal = ({ element, onClose, onCrop }) => {
  const containerRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });
  const [displaySize, setDisplaySize] = useState({ width: 0, height: 0 });
  const [scale, setScale] = useState(1);
  const [cropBox, setCropBox] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragHandle, setDragHandle] = useState(null);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setImageSrc(element.src);
  }, [element]);

  useEffect(() => {
    if (!imageSrc) return;
    
    const img = new Image();
    img.onload = () => {
      const naturalWidth = img.naturalWidth || img.width;
      const naturalHeight = img.naturalHeight || img.height;
      setImageNaturalSize({ width: naturalWidth, height: naturalHeight });

      // Scale image to fit in 600x450 display area
      const maxWidth = 600;
      const maxHeight = 450;
      const scaleW = maxWidth / naturalWidth;
      const scaleH = maxHeight / naturalHeight;
      const newScale = Math.min(scaleW, scaleH, 1);
      
      const displayW = naturalWidth * newScale;
      const displayH = naturalHeight * newScale;
      setDisplaySize({ width: displayW, height: displayH });
      setScale(newScale);

      // Initialize crop box to centered 80% of image
      const initialWidth = naturalWidth * 0.8;
      const initialHeight = naturalHeight * 0.8;
      setCropBox({
        x: (naturalWidth - initialWidth) / 2,
        y: (naturalHeight - initialHeight) / 2,
        width: initialWidth,
        height: initialHeight,
      });
    };
    img.src = imageSrc;
  }, [imageSrc]);

  const handleMouseDown = (e, handle) => {
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    
    setStartPos({ x, y });
    setDragHandle(handle);
    setIsDragging(true);
    e.preventDefault();
    e.stopPropagation();
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !dragHandle || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;

    const minSize = 50;
    let newBox = { ...cropBox };

    if (dragHandle === 'move') {
      const deltaX = x - startPos.x;
      const deltaY = y - startPos.y;
      newBox.x = Math.max(0, Math.min(cropBox.x + deltaX, imageNaturalSize.width - cropBox.width));
      newBox.y = Math.max(0, Math.min(cropBox.y + deltaY, imageNaturalSize.height - cropBox.height));
      setStartPos({ x, y });
    } else if (dragHandle === 'tl') {
      const newWidth = Math.max(minSize, cropBox.width - (x - cropBox.x));
      const newHeight = Math.max(minSize, cropBox.height - (y - cropBox.y));
      newBox.x = cropBox.x + cropBox.width - newWidth;
      newBox.y = cropBox.y + cropBox.height - newHeight;
      newBox.width = newWidth;
      newBox.height = newHeight;
    } else if (dragHandle === 'tr') {
      const newWidth = Math.max(minSize, x - cropBox.x);
      const newHeight = Math.max(minSize, cropBox.height - (y - cropBox.y));
      newBox.y = cropBox.y + cropBox.height - newHeight;
      newBox.width = newWidth;
      newBox.height = newHeight;
    } else if (dragHandle === 'bl') {
      const newWidth = Math.max(minSize, cropBox.width - (x - cropBox.x));
      const newHeight = Math.max(minSize, y - cropBox.y);
      newBox.x = cropBox.x + cropBox.width - newWidth;
      newBox.width = newWidth;
      newBox.height = newHeight;
    } else if (dragHandle === 'br') {
      newBox.width = Math.max(minSize, x - cropBox.x);
      newBox.height = Math.max(minSize, y - cropBox.y);
    }

    newBox.x = Math.max(0, Math.min(newBox.x, imageNaturalSize.width - newBox.width));
    newBox.y = Math.max(0, Math.min(newBox.y, imageNaturalSize.height - newBox.height));
    newBox.width = Math.min(newBox.width, imageNaturalSize.width - newBox.x);
    newBox.height = Math.min(newBox.height, imageNaturalSize.height - newBox.y);

    setCropBox(newBox);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setDragHandle(null);
  };

  const handleApplyCrop = () => {
    if (!imageSrc) return;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(cropBox.width);
      canvas.height = Math.round(cropBox.height);
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        img,
        Math.round(cropBox.x),
        Math.round(cropBox.y),
        Math.round(cropBox.width),
        Math.round(cropBox.height),
        0,
        0,
        Math.round(cropBox.width),
        Math.round(cropBox.height)
      );

      const croppedSrc = canvas.toDataURL('image/png');
      
      // Scale down to reasonable display size while maintaining aspect ratio
      const maxDimension = 250;
      const croppedWidth = Math.round(cropBox.width);
      const croppedHeight = Math.round(cropBox.height);
      const aspectRatio = croppedWidth / croppedHeight;
      
      let displayWidth, displayHeight;
      if (croppedWidth > croppedHeight) {
        displayWidth = Math.min(croppedWidth, maxDimension);
        displayHeight = displayWidth / aspectRatio;
      } else {
        displayHeight = Math.min(croppedHeight, maxDimension);
        displayWidth = displayHeight * aspectRatio;
      }
      
      onCrop({
        src: croppedSrc,
        width: Math.round(displayWidth),
        height: Math.round(displayHeight),
      });
    };
    img.src = imageSrc;
  };

  const displayCropBox = {
    x: cropBox.x * scale,
    y: cropBox.y * scale,
    width: cropBox.width * scale,
    height: cropBox.height * scale,
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Dialog Box */}
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between shrink-0">
          <h2 className="text-xl font-semibold text-gray-900">Crop Image</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            title="Close"
          >
            <X size={24} />
          </button>
        </div>

        {/* Image Area */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-hidden">
          <div 
            ref={containerRef}
            className="relative select-none"
            style={{
              width: displaySize.width,
              height: displaySize.height,
            }}
          >
            {/* Image */}
            {imageSrc && (
              <img
                src={imageSrc}
                alt="Crop"
                draggable={false}
                className="block w-full h-full"
                style={{
                  pointerEvents: 'none',
                  userSelect: 'none',
                }}
              />
            )}

            {/* Dark overlay outside crop area */}
            <svg
              className="absolute inset-0 pointer-events-none"
              style={{ width: displaySize.width, height: displaySize.height }}
            >
              <defs>
                <mask id="cropMask">
                  <rect width="100%" height="100%" fill="white" />
                  <rect
                    x={displayCropBox.x}
                    y={displayCropBox.y}
                    width={displayCropBox.width}
                    height={displayCropBox.height}
                    fill="black"
                  />
                </mask>
              </defs>
              <rect width="100%" height="100%" fill="rgba(0, 0, 0, 0.5)" mask="url(#cropMask)" />
            </svg>

            {/* Crop box border */}
            <div
              className="absolute border-2 border-blue-500"
              style={{
                left: displayCropBox.x,
                top: displayCropBox.y,
                width: displayCropBox.width,
                height: displayCropBox.height,
                pointerEvents: 'none',
              }}
            >
              {/* Grid lines */}
              <div className="absolute inset-0">
                <div className="absolute w-px bg-blue-500 opacity-30" style={{ left: '33.33%', height: '100%' }} />
                <div className="absolute w-px bg-blue-500 opacity-30" style={{ left: '66.66%', height: '100%' }} />
                <div className="absolute h-px bg-blue-500 opacity-30" style={{ top: '33.33%', width: '100%' }} />
                <div className="absolute h-px bg-blue-500 opacity-30" style={{ top: '66.66%', width: '100%' }} />
              </div>
            </div>

            {/* Draggable crop area */}
            <div
              className="absolute cursor-move"
              style={{
                left: displayCropBox.x,
                top: displayCropBox.y,
                width: displayCropBox.width,
                height: displayCropBox.height,
              }}
              onMouseDown={(e) => handleMouseDown(e, 'move')}
            />

            {/* Corner handles */}
            <div
              className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize shadow-lg -translate-x-1/2 -translate-y-1/2"
              style={{ left: displayCropBox.x, top: displayCropBox.y }}
              onMouseDown={(e) => handleMouseDown(e, 'tl')}
            />
            <div
              className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-nesw-resize shadow-lg -translate-x-1/2 -translate-y-1/2"
              style={{ left: displayCropBox.x + displayCropBox.width, top: displayCropBox.y }}
              onMouseDown={(e) => handleMouseDown(e, 'tr')}
            />
            <div
              className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-nesw-resize shadow-lg -translate-x-1/2 -translate-y-1/2"
              style={{ left: displayCropBox.x, top: displayCropBox.y + displayCropBox.height }}
              onMouseDown={(e) => handleMouseDown(e, 'bl')}
            />
            <div
              className="absolute w-5 h-5 bg-white border-2 border-blue-500 rounded-full cursor-nwse-resize shadow-lg -translate-x-1/2 -translate-y-1/2"
              style={{ left: displayCropBox.x + displayCropBox.width, top: displayCropBox.y + displayCropBox.height }}
              onMouseDown={(e) => handleMouseDown(e, 'br')}
            />
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3 shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyCrop}
            className="px-6 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Check size={18} />
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

export default CropModal;
