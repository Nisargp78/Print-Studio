import React, { useEffect } from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useDesign } from '../context/useDesignContext';
import ShapeNode from './ShapeNode';
import FormatBar from '../components/FormatBar';

const CanvasArea = ({ stageRef }) => {
    const {
        elements,
        selectedId,
        setSelectedId,
        backgroundColor,
        updateElement,
        deleteElement,
        activeTab,
        setActiveTab
    } = useDesign();

    // Handle keyboard events for deleting elements
    useEffect(() => {
        const handleKeyDown = (e) => {
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
    }, [selectedId, deleteElement]);

    const checkDeselect = (e) => {
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
                {/* Full‑width format bar across the canvas area */}
                <div className="sticky top-0 z-30">
                    <FormatBar />
                </div>

                {/* Centered canvas below the bar */}
                <div className="w-full flex justify-center">
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
                                            setSelectedId(el.id);
                                            setActiveTab('quick_edit');
                                        }}
                                        onChange={(newProps) => updateElement(el.id, newProps)}
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
