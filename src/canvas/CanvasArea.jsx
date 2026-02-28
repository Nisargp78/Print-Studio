import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useDesign } from '../context/useDesignContext';
import ShapeNode from './ShapeNode';
import Toolbar from '../components/Toolbar';

const CanvasArea = ({ stageRef }) => {
    const {
        elements,
        selectedId,
        setSelectedId,
        backgroundColor,
        updateElement,
        deleteElement,
        activeTab,
        setActiveTab,
        isCanvasLocked,
    } = useDesign();

    const prevElementsLengthRef = useRef(elements.length);

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

    // Handle keyboard events for deleting elements
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (isCanvasLocked) return;
            if (e.key === 'Delete' && selectedId) {
                // Check if the focus is not on an input or textarea
                const activeElement = document.activeElement;
                const isInputFocused = activeElement && (
                    activeElement.tagName === 'INPUT' || 
                    activeElement.tagName === 'TEXTAREA'
                );
                
                if (!isInputFocused) {
                    e.preventDefault();
                    deleteElement(selectedId);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, deleteElement, isCanvasLocked]);

    const checkDeselect = (e) => {
        if (isCanvasLocked) return;
        const clickedOnEmpty = e.target === e.target.getStage() || e.target.attrs.id === "bg-rect";
        if (clickedOnEmpty) {
            setSelectedId(null);
            if (activeTab === 'quick_edit') {
                setActiveTab('elements');
            }
        }
    };

    return (
        <div className="flex-1 overflow-auto bg-gray-100/50">
            <div className="min-h-full w-full flex flex-col">
                {/* Top dynamic toolbar */}
                <Toolbar />

                {/* Centered canvas */}
                <div className="w-full flex justify-center flex-1">
                    <div
                        className="bg-white shadow-2xl max-w-full max-h-full transition-shadow hover:shadow-xl"
                        style={{ backgroundColor }}
                    >
                        <Stage
                            width={800}
                            height={600}
                            onMouseDown={checkDeselect}
                            onTouchStart={checkDeselect}
                            ref={stageRef}
                        >
                            <Layer>
                                {/* Background Rect to ensure export has background color */}
                                <Rect
                                    x={0} y={0}
                                    width={800} height={600}
                                    fill={backgroundColor}
                                    listening={false}
                                    id="bg-rect"
                                />

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
        </div>
    );
};

export default CanvasArea;
