import React, { useEffect, useRef, useState } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage } from 'react-konva';
import { useDesign } from '../context/useDesignContext';
import ShapeNode from './ShapeNode';
import FormatBar from '../components/FormatBar';

const getElementBounds = (element) => {
    const x = element.x ?? 0;
    const y = element.y ?? 0;

    if (element.type === 'circle') {
        const radius = element.radius ?? 50;
        return { x: x - radius, y: y - radius, width: radius * 2, height: radius * 2 };
    }

    if (element.type === 'triangle' || element.type === 'pentagon' || element.type === 'hexagon') {
        const radius = element.radius ?? 50;
        return { x: x - radius, y: y - radius, width: radius * 2, height: radius * 2 };
    }

    if (element.type === 'star') {
        const outerRadius = element.outerRadius ?? 50;
        return { x: x - outerRadius, y: y - outerRadius, width: outerRadius * 2, height: outerRadius * 2 };
    }

    if (element.type === 'text') {
        const width = element.width ?? 120;
        const height = element.height ?? (element.fontSize ?? 32);
        return { x, y, width, height };
    }

    const width = element.width ?? 100;
    const height = element.height ?? 100;
    return { x, y, width, height };
};

const hasIntersection = (a, b) => (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
);

const CanvasArea = ({ stageRef }) => {
    const {
        elements,
        selectedId,
        selectedIds,
        setSelectedId,
        setSelectedIds,
        backgroundColor,
        backgroundImage,
        canvasSize,
        zoom,
        updateElement,
        updateElementWithoutHistory,
        activeTab,
        setActiveTab,
        isCanvasLocked,
        undo,
        redo,
        copyElement,
        pasteElement,
        moveSelectedElements,
        deleteSelectedElements,
    } = useDesign();

    const prevElementsLengthRef = useRef(elements.length);
    const [bgImage, setBgImage] = useState(null);
    const [selectionRect, setSelectionRect] = useState({
        visible: false,
        x1: 0,
        y1: 0,
        x2: 0,
        y2: 0,
    });

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

        if (elementsAdded && selectedIds.length === 0) {
            // Find first text element
            const firstTextNode = elements.find(el => el.type === 'text');
            if (firstTextNode) {
                // Small delay to ensure render is complete
                setTimeout(() => {
                    setSelectedId(firstTextNode.id);
                    // Only auto-open panel if one is already open
                    if (activeTab) {
                        setActiveTab('quick_edit');
                    }
                }, 50);
            }
        }
    }, [elements, selectedIds, setSelectedId, setActiveTab, isCanvasLocked, activeTab]);

    // Handle keyboard events for deleting elements and other shortcuts
    useEffect(() => {
        const handleKeyDown = (e) => {
            // Check if the focus is not on an input or textarea
            const activeElement = document.activeElement;
            const isInputFocused = activeElement && (
                activeElement.tagName === 'INPUT' || 
                activeElement.tagName === 'TEXTAREA'
            );

            const selectedTargets = selectedIds.length ? selectedIds : (selectedId ? [selectedId] : []);

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
            if (e.ctrlKey && e.key === 'c' && !isInputFocused && selectedTargets.length === 1) {
                e.preventDefault();
                copyElement(selectedTargets[0]);
                return;
            }

            // Paste (Ctrl+V)
            if (e.ctrlKey && e.key === 'v' && !isInputFocused) {
                e.preventDefault();
                pasteElement();
                return;
            }

            // Delete
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedTargets.length > 0 && !isInputFocused) {
                e.preventDefault();
                deleteSelectedElements(selectedTargets);
                return;
            }

            // Move selected elements with arrow keys
            if (!isInputFocused && selectedTargets.length > 0 && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                e.preventDefault();
                const step = e.shiftKey ? 10 : 1;
                let deltaX = 0;
                let deltaY = 0;

                if (e.key === 'ArrowUp') deltaY = -step;
                if (e.key === 'ArrowDown') deltaY = step;
                if (e.key === 'ArrowLeft') deltaX = -step;
                if (e.key === 'ArrowRight') deltaX = step;

                moveSelectedElements(selectedTargets, deltaX, deltaY);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedId, selectedIds, deleteSelectedElements, undo, redo, copyElement, pasteElement, moveSelectedElements, isCanvasLocked]);

    const handleStageMouseDown = (e) => {
        if (isCanvasLocked) return;
        const stage = e.target.getStage();
        const pointer = stage?.getPointerPosition();
        if (!pointer) return;

        const clickedOnEmpty = e.target === stage ||
            e.target.attrs.id === 'bg-rect' ||
            e.target.attrs.listening === false;

        if (!clickedOnEmpty) return;

        setSelectionRect({
            visible: true,
            x1: pointer.x,
            y1: pointer.y,
            x2: pointer.x,
            y2: pointer.y,
        });
    };

    const handleStageMouseMove = (e) => {
        if (!selectionRect.visible) return;
        const pointer = e.target.getStage()?.getPointerPosition();
        if (!pointer) return;

        setSelectionRect((prev) => ({
            ...prev,
            x2: pointer.x,
            y2: pointer.y,
        }));
    };

    const handleStageMouseUp = () => {
        if (!selectionRect.visible) return;

        const x = Math.min(selectionRect.x1, selectionRect.x2);
        const y = Math.min(selectionRect.y1, selectionRect.y2);
        const width = Math.abs(selectionRect.x2 - selectionRect.x1);
        const height = Math.abs(selectionRect.y2 - selectionRect.y1);

        if (width < 3 && height < 3) {
            setSelectedIds([]);
            setSelectionRect({ visible: false, x1: 0, y1: 0, x2: 0, y2: 0 });
            return;
        }

        const selectionBox = { x, y, width, height };
        const idsInSelection = elements
            .filter((element) => !element.locked)
            .filter((element) => hasIntersection(getElementBounds(element), selectionBox))
            .map((element) => element.id);

        setSelectedIds(idsInSelection);
        // Only switch panels if one is already open
        if (activeTab) {
            if (idsInSelection.length === 1) {
                const selected = elements.find((element) => element.id === idsInSelection[0]);
                setActiveTab(selected?.type === 'image' ? 'upload' : 'quick_edit');
            } else {
                setActiveTab('elements');
            }
        }

        setSelectionRect({ visible: false, x1: 0, y1: 0, x2: 0, y2: 0 });
    };

    return (
        <div className="flex-1 flex flex-col bg-gray-100/50 overflow-hidden">
            {/* Format bar - fixed height */}
            <div className="shrink-0 relative z-100">
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
                            width: canvasSize.width,
                            height: canvasSize.height,
                            transform: `scale(${zoom})`,
                            transformOrigin: 'center center',
                        }}
                    >
                        <Stage
                            width={canvasSize.width}
                            height={canvasSize.height}
                            scaleX={1}
                            scaleY={1}
                            onMouseDown={handleStageMouseDown}
                            onMouseMove={handleStageMouseMove}
                            onMouseUp={handleStageMouseUp}
                            onTouchStart={handleStageMouseDown}
                            onTouchMove={handleStageMouseMove}
                            onTouchEnd={handleStageMouseUp}
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
                                        isSelected={selectedIds.includes(el.id)}
                                        onSelect={() => {
                                            if (isCanvasLocked) return;
                                            setSelectedId(el.id);
                                            // Only switch panels if one is already open
                                            if (activeTab) {
                                                setActiveTab(el.type === 'image' ? 'upload' : 'quick_edit');
                                            }
                                        }}
                                        onChange={(newProps) => updateElement(el.id, newProps)}
                                        onChangeWithoutHistory={(newProps) => updateElementWithoutHistory(el.id, newProps)}
                                        canvasLocked={isCanvasLocked}
                                    />
                                ))}

                                {selectionRect.visible && (
                                    <Rect
                                        x={Math.min(selectionRect.x1, selectionRect.x2)}
                                        y={Math.min(selectionRect.y1, selectionRect.y2)}
                                        width={Math.abs(selectionRect.x2 - selectionRect.x1)}
                                        height={Math.abs(selectionRect.y2 - selectionRect.y1)}
                                        fill="rgba(59, 130, 246, 0.12)"
                                        stroke="#3b82f6"
                                        strokeWidth={1}
                                        dash={[4, 4]}
                                        listening={false}
                                    />
                                )}
                            </Layer>
                        </Stage>
                    </div>
                </div>
        </div>
    );
};

export default CanvasArea;
