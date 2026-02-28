import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import { useDesign } from '../context/useDesignContext';
import ShapeNode from './ShapeNode';
import FormatBar from '../components/FormatBar';

const CanvasArea = ({ stageRef }) => {
    const {
        elements,
        selectedId,
        setSelectedId,
        backgroundColor,
        backgroundImage,
        canvasSize,
        zoom,
        updateElement,
        deleteElement,
        activeTab,
        setActiveTab,
        isCanvasLocked,
        undo,
        redo,
        copyElement,
        pasteElement,
    } = useDesign();

    const prevElementsLengthRef = useRef(elements.length);
    const [bgImage, setBgImage] = useState(null);

    // Load background image when it changes
    useEffect(() => {
        if (backgroundImage) {
            const img = new window.Image();
            img.src = backgroundImage;
            img.onload = () => {
                setBgImage(img);
            };
        } else {
            setBgImage(null);
        }
    }, [backgroundImage]);

    // Auto-select first text node when template loads
    useEffect(() => {
        if (isCanvasLocked) return;
        
        // Detect when new elements are added (template load or batch add)
        const elementsAdded = elements.length > prevElementsLengthRef.current;
        prevElementsLengthRef.current = elements.length;

        if (elementsAdded && !selectedId) {
            // Find first text element
            const firstTextNode = elements.find(el => el.type === 'text');
            if (firstTextNode) {
                // Small delay to ensure render is complete
                setTimeout(() => {
                    setSelectedId(firstTextNode.id);
                    setActiveTab('quick_edit');
                }, 50);
            }
        }
    }, [elements, selectedId, setSelectedId, setActiveTab, isCanvasLocked]);

    // Handle keyboard events for deleting elements and other shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check if the focus is not on an input or textarea
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA'
            );

            // Undo (Ctrl+Z)
            if (e.ctrlKey && e.key === 'z' && !e.shiftKey && !isInputFocused) {
                e.preventDefault();
                undo();
                return;
            }

            // Redo (Ctrl+Y or Ctrl+Shift+Z)
            if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
                if (!isInputFocused) {
                    e.preventDefault();
                    redo();
                    return;
                }
            }

            // Copy (Ctrl+C)
            if (e.ctrlKey && e.key === 'c' && !isInputFocused && selectedId) {
                e.preventDefault();
                copyElement(selectedId);
                return;
            }

            // Paste (Ctrl+V)
            if (e.ctrlKey && e.key === 'v' && !isInputFocused) {
                e.preventDefault();
                pasteElement();
                return;
            }

            // Delete
            if (e.key === 'Delete' && selectedId && !isInputFocused) {
                e.preventDefault();
                deleteElement(selectedId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, deleteElement, undo, redo, copyElement, pasteElement, isCanvasLocked]);

    const checkDeselect = (e) => {
        if (isCanvasLocked) return;
        const clickedOnEmpty = e.target === e.target.getStage() || 
                               e.target.attrs.id === "bg-rect" ||
                               e.target.attrs.listening === false;
        if (clickedOnEmpty) {
            setSelectedId(null);
            if (activeTab === 'quick_edit') {
                setActiveTab('elements');
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-100/50 overflow-hidden">
            {/* Format bar - fixed height */}
            <div className="flex-shrink-0">
                <FormatBar />
            </div>

            {/* Centered canvas - takes remaining space */}
            <div className="flex-1 w-full flex justify-center items-center p-2 overflow-auto">
                    <div
                        className="bg-white shadow-2xl transition-all"
                        style={{ 
                            backgroundColor: bgImage ? 'transparent' : backgroundColor,
                            backgroundImage: bgImage ? `url(${backgroundImage})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            width: canvasSize.width * zoom,
                            height: canvasSize.height * zoom,
                            transform: `scale(${zoom})`,
                            transformOrigin: 'center center',
                        }}
                    >
                        <Stage
                            width={canvasSize.width}
                            height={canvasSize.height}
                            scaleX={1}
                            scaleY={1}
                            onMouseDown={checkDeselect}
                            onTouchStart={checkDeselect}
                            ref={stageRef}
                        >
                            <Layer>
                                {/* Background Rect to ensure export has background color */}
                                <Rect
                                    x={0} y={0}
                                    width={canvasSize.width}
                                    height={canvasSize.height}
                                    fill={backgroundColor}
                                    listening={false}
                                    id="bg-rect"
                                />

                                {/* Background Image if exists */}
                                {bgImage && (
                                    <KonvaImage
                                        x={0}
                                        y={0}
                                        width={canvasSize.width}
                                        height={canvasSize.height}
                                        image={bgImage}
                                        listening={false}
                                    />
                                )}

                                {elements.map((el) => (
                                    <ShapeNode
                                        key={el.id}
                                        shapeProps={el}
                                        isSelected={el.id === selectedId}
                                        onSelect={() => {
                                            if (isCanvasLocked) return;
                                            setSelectedId(el.id);
                                            setActiveTab(el.type === 'image' ? 'upload' : 'quick_edit');
                                        }}
                                        onChange={(newProps) => updateElement(el.id, newProps)}
                                        canvasLocked={isCanvasLocked}
                                    />
                                ))}
                            </Layer>
                        </Stage>
                    </div>
                </div>
        </div>
    );
};

export default CanvasArea;
