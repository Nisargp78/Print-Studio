import React from 'react';
import { Stage, Layer, Rect } from 'react-konva';
import { useDesign } from '../context/useDesignContext';
import ShapeNode from './ShapeNode';

const CanvasArea = ({ stageRef }) => {
    const {
        elements,
        selectedId,
        setSelectedId,
        backgroundColor,
        updateElement,
        activeTab,
        setActiveTab
    } = useDesign();

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
        <div className="flex-1 overflow-auto relative flex items-center justify-center p-8 bg-gray-100/50">
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
    );
};

export default CanvasArea;
