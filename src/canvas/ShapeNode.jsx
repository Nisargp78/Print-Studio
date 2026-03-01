import React, { useRef, useEffect } from 'react';
import { Rect, Circle, Text, Transformer, Image as KonvaImage, Star, RegularPolygon } from 'react-konva';
import useImage from 'use-image';
import IconShape from './IconShape';

const ShapeNode = ({ shapeProps, isSelected, onSelect, onChange, onChangeWithoutHistory, canvasLocked = false }) => {
    const shapeRef = useRef();
    const trRef = useRef();
    const dragStartStateRef = useRef(null);
    const isBeingDraggedRef = useRef(false);

    const startInlineTextEdit = () => {
        if (canvasLocked || shapeProps.locked || shapeProps.type !== 'text') return;

        const textNode = shapeRef.current;
        if (!textNode) return;

        onSelect?.();

        const stage = textNode.getStage();
        if (!stage) return;

        const stageBox = stage.container().getBoundingClientRect();
        const textPosition = textNode.absolutePosition();

        // Create wrapper for textarea with handles
        const wrapper = document.createElement('div');
        const textarea = document.createElement('textarea');
        wrapper.appendChild(textarea);
        document.body.appendChild(wrapper);

        const fontStyleValue = textNode.fontStyle() || 'normal';
        const isBold = fontStyleValue.includes('bold');
        const isItalic = fontStyleValue.includes('italic');

        textarea.value = textNode.text();
        const nodePadding = typeof textNode.padding() === 'number' ? textNode.padding() : 0;
        const nodeWidth = Math.max(40, textNode.width());
        const nodeHeight = Math.max(textNode.fontSize(), textNode.height());
        // Add small bottom padding for underline
        const bottomPadding = nodePadding + 4;
        
        // Style wrapper
        wrapper.style.position = 'absolute';
        wrapper.style.top = `${stageBox.top + textPosition.y}px`;
        wrapper.style.left = `${stageBox.left + textPosition.x}px`;
        wrapper.style.width = `${nodeWidth}px`;
        wrapper.style.height = `${nodeHeight + nodePadding + bottomPadding}px`;
        wrapper.style.zIndex = '1000';
        wrapper.style.border = '1px solid #3b82f6';
        wrapper.style.boxSizing = 'border-box';
        
        // Add corner and edge handles with resize functionality
        const handlePositions = [
            { top: '-5px', left: '-5px', cursor: 'nwse-resize', type: 'tl' }, // top-left
            { top: '-5px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize', type: 't' }, // top-center
            { top: '-5px', right: '-5px', cursor: 'nesw-resize', type: 'tr' }, // top-right
            { top: '50%', right: '-5px', transform: 'translateY(-50%)', cursor: 'ew-resize', type: 'r' }, // middle-right
            { bottom: '-5px', right: '-5px', cursor: 'nwse-resize', type: 'br' }, // bottom-right
            { bottom: '-5px', left: '50%', transform: 'translateX(-50%)', cursor: 'ns-resize', type: 'b' }, // bottom-center
            { bottom: '-5px', left: '-5px', cursor: 'nesw-resize', type: 'bl' }, // bottom-left
            { top: '50%', left: '-5px', transform: 'translateY(-50%)', cursor: 'ew-resize', type: 'l' }, // middle-left
        ];

        handlePositions.forEach(pos => {
            const handle = document.createElement('div');
            handle.style.position = 'absolute';
            handle.style.width = '8px';
            handle.style.height = '8px';
            handle.style.backgroundColor = 'white';
            handle.style.border = '1px solid #3b82f6';
            handle.style.cursor = pos.cursor;
            handle.style.zIndex = '1001';
            handle.style.pointerEvents = 'auto';
            Object.keys(pos).forEach(key => {
                if (key !== 'cursor' && key !== 'type') {
                    handle.style[key] = pos[key];
                }
            });
            
            // Add resize functionality
            let isResizing = false;
            let startX, startY, startWidth, startHeight, startTop, startLeft;
            
            handle.addEventListener('mousedown', (e) => {
                isResizing = true;
                startX = e.clientX;
                startY = e.clientY;
                startWidth = wrapper.offsetWidth;
                startHeight = wrapper.offsetHeight;
                startTop = wrapper.offsetTop;
                startLeft = wrapper.offsetLeft;
                e.preventDefault();
            });
            
            const handleMouseMove = (e) => {
                if (!isResizing) return;
                
                const deltaX = e.clientX - startX;
                const deltaY = e.clientY - startY;
                const type = pos.type;
                
                let newWidth = startWidth;
                let newHeight = startHeight;
                let newTop = startTop;
                let newLeft = startLeft;
                
                // Handle horizontal resizing
                if (type.includes('r')) newWidth = Math.max(40, startWidth + deltaX);
                if (type.includes('l')) {
                    newWidth = Math.max(40, startWidth - deltaX);
                    newLeft = startLeft + deltaX;
                }
                
                // Handle vertical resizing
                if (type.includes('b')) newHeight = Math.max(20, startHeight + deltaY);
                if (type.includes('t')) {
                    newHeight = Math.max(20, startHeight - deltaY);
                    newTop = startTop + deltaY;
                }
                
                wrapper.style.width = `${newWidth}px`;
                wrapper.style.height = `${newHeight}px`;
                wrapper.style.top = `${newTop}px`;
                wrapper.style.left = `${newLeft}px`;
                
                resizeTextarea();
            };
            
            const handleMouseUp = () => {
                isResizing = false;
                window.removeEventListener('mousemove', handleMouseMove);
                window.removeEventListener('mouseup', handleMouseUp);
            };
            
            handle.addEventListener('mouseenter', () => {
                if (isResizing) {
                    window.addEventListener('mousemove', handleMouseMove);
                    window.addEventListener('mouseup', handleMouseUp);
                }
            });
            
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
            
            wrapper.appendChild(handle);
        });
        
        // Style textarea
        textarea.style.position = 'relative';
        textarea.style.width = '100%';
        textarea.style.height = 'auto';
        textarea.style.fontSize = `${textNode.fontSize()}px`;
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.fontWeight = isBold ? 'bold' : 'normal';
        textarea.style.fontStyle = isItalic ? 'italic' : 'normal';
        textarea.style.lineHeight = `${textNode.lineHeight()}`;
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        textarea.style.border = 'none';
        textarea.style.padding = `${nodePadding}px ${nodePadding}px ${bottomPadding}px ${nodePadding}px`;
        textarea.style.margin = '0';
        textarea.style.boxSizing = 'border-box';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'transparent';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.whiteSpace = 'nowrap';

        const rotation = textNode.rotation();
        let transform = '';
        if (rotation) {
            transform += `rotate(${rotation}deg)`;
        }
        wrapper.style.transform = transform;
        wrapper.style.transformOrigin = 'left top';

        textNode.hide();
        if (trRef.current) trRef.current.hide();
        textNode.getLayer()?.batchDraw();

        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);

        const resizeTextarea = () => {
            // Create a temporary element to measure text width with all proper styling
            const temp = document.createElement('div');
            temp.style.position = 'absolute';
            temp.style.visibility = 'hidden';
            temp.style.whiteSpace = 'nowrap';
            temp.style.fontSize = `${textNode.fontSize()}px`;
            temp.style.fontFamily = textNode.fontFamily();
            temp.style.fontWeight = isBold ? 'bold' : 'normal';
            temp.style.fontStyle = isItalic ? 'italic' : 'normal';
            temp.style.lineHeight = `${textNode.lineHeight()}`;
            temp.style.padding = '0';
            temp.style.margin = '0';
            temp.style.border = 'none';
            temp.style.display = 'inline-block';
            
            // Ensure we measure actual text content
            const textToMeasure = textarea.value || 'a';
            temp.textContent = textToMeasure;
            
            document.body.appendChild(temp);
            // Use getBoundingClientRect for more accurate measurement including spaces
            const contentWidth = temp.getBoundingClientRect().width;
            document.body.removeChild(temp);
            
            // Measure height with textarea
            textarea.style.width = 'auto';
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            
            // Calculate new dimensions with minimal padding
            const requiredWidth = Math.max(nodeWidth, Math.ceil(contentWidth) + nodePadding * 2);
            const requiredHeight = Math.max(nodeHeight + nodePadding + bottomPadding, scrollHeight + nodePadding + bottomPadding);
            
            wrapper.style.width = `${requiredWidth}px`;
            wrapper.style.height = `${requiredHeight}px`;
            textarea.style.width = `${requiredWidth - nodePadding * 2}px`;
            textarea.style.height = `${scrollHeight}px`;
            
            // Store dimensions for later use
            wrapper.dataset.contentWidth = contentWidth;
            wrapper.dataset.scrollHeight = scrollHeight;
        };

        resizeTextarea();
        textarea.addEventListener('input', resizeTextarea);

        const removeTextarea = (save) => {
            textarea.removeEventListener('input', resizeTextarea);
            window.removeEventListener('click', handleOutsideClick);
            textarea.removeEventListener('keydown', handleKeyDown);

            if (save) {
                // Get stored dimensions from last measurement
                const contentWidth = parseInt(wrapper.dataset.contentWidth) || 0;
                const scrollHeight = parseInt(wrapper.dataset.scrollHeight) || nodeHeight;
                
                const finalWidth = Math.max(nodeWidth, contentWidth + nodePadding * 2);
                const finalHeight = Math.max(nodeHeight, scrollHeight + nodePadding + bottomPadding);
                
                onChange({
                    ...shapeProps,
                    text: textarea.value,
                    width: finalWidth,
                    height: finalHeight,
                });
            }

            if (document.body.contains(wrapper)) {
                document.body.removeChild(wrapper);
            }

            // Delay to allow React state updates to complete
            setTimeout(() => {
                textNode.show();
                if (trRef.current && isSelected) trRef.current.show();
                textNode.getLayer()?.batchDraw();
            }, 0);
        };

        const handleKeyDown = (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                removeTextarea(true);
            }
            if (e.key === 'Escape') {
                e.preventDefault();
                removeTextarea(false);
            }
        };

        const handleOutsideClick = (e) => {
            if (!wrapper.contains(e.target)) {
                removeTextarea(true);
            }
        };

        textarea.addEventListener('keydown', handleKeyDown);
        setTimeout(() => window.addEventListener('click', handleOutsideClick));
    };

    useEffect(() => {
        if (isSelected && trRef.current && shapeRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    // Update text dimensions after rendering
    useEffect(() => {
        if (shapeProps.type === 'text' && shapeRef.current) {
            const node = shapeRef.current;
            const currentWidth = node.width();
            const currentHeight = node.height();
            
            // Only update if dimensions have changed and are valid
            if (currentHeight > 0 && (
                !shapeProps.height || 
                Math.abs(shapeProps.height - currentHeight) > 1
            )) {
                // Use onChangeWithoutHistory for dimension updates to avoid creating extra history entries
                if (onChangeWithoutHistory) {
                    onChangeWithoutHistory({
                        ...shapeProps,
                        height: currentHeight,
                        width: currentWidth,
                    });
                } else {
                    onChange({
                        ...shapeProps,
                        height: currentHeight,
                        width: currentWidth,
                    });
                }
            }
        }
    }, [shapeProps.text, shapeProps.fontSize, shapeProps.fontFamily, shapeProps.fontWeight, shapeProps.fontStyle, onChangeWithoutHistory, onChange]);

    const handleDragEnd = (e) => {
        if (canvasLocked || shapeProps.locked) return;
        isBeingDraggedRef.current = false;
        // Only save history once when drag completes
        onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    const handleDragMove = (e) => {
        // Update properties in real time during drag without creating history entries
        if (canvasLocked || shapeProps.locked) return;
        onChangeWithoutHistory({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    const handleTransform = () => {
        // Don't update state during transform - just let Konva handle the visual changes
        // This prevents creating multiple history entries
        if (canvasLocked || shapeProps.locked) return;
    };

    const handleTransformEnd = () => {
        if (canvasLocked || shapeProps.locked) return;
        const node = shapeRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        // Save history only when transform ends
        if (shapeProps.type === 'rect' || shapeProps.type === 'image' || shapeProps.type.startsWith('icon-')) {
            onChange({
                ...shapeProps,
                x: node.x(),
                y: node.y(),
                width: Math.max(5, node.width() * scaleX),
                height: Math.max(5, node.height() * scaleY),
                rotation: node.rotation()
            });
        } else if (shapeProps.type === 'circle' || shapeProps.type === 'triangle' || shapeProps.type === 'pentagon' || shapeProps.type === 'hexagon') {
            onChange({
                ...shapeProps,
                x: node.x(),
                y: node.y(),
                radius: Math.max(5, (node.radius ? node.radius() : shapeProps.radius) * Math.max(scaleX, scaleY)),
                rotation: node.rotation()
            });
        } else if (shapeProps.type === 'star') {
            const scale = Math.max(scaleX, scaleY);
            onChange({
                ...shapeProps,
                x: node.x(),
                y: node.y(),
                innerRadius: Math.max(5, shapeProps.innerRadius * scale),
                outerRadius: Math.max(5, shapeProps.outerRadius * scale),
                rotation: node.rotation()
            });
        } else if (shapeProps.type === 'text') {
            onChange({
                ...shapeProps,
                x: node.x(),
                y: node.y(),
                width: Math.max(node.width() * scaleX, node.fontSize() || 20),
                height: node.height() * scaleY,
                rotation: node.rotation()
            });
        } else {
            onChange({
                ...shapeProps,
                x: node.x(),
                y: node.y(),
                rotation: node.rotation()
            });
        }
    };

    const [image] = useImage(shapeProps.type === 'image' ? shapeProps.src : '');

    const handleDragStart = () => {
        if (canvasLocked || shapeProps.locked) return;
        // Save the initial state at the start of drag
        dragStartStateRef.current = {
            x: shapeProps.x || 0,
            y: shapeProps.y || 0,
        };
        isBeingDraggedRef.current = true;
        onSelect?.();
    };

    let node = null;
    const shapeFilled = Boolean(shapeProps.shapeFilled);
    const fillColor = shapeProps.fill || '#0f172a';
    const strokeColor = shapeProps.stroke || '#0f172a';
    const shapeStrokeWidth = 4;
    const commonProps = {
        ...shapeProps,
        ref: shapeRef,
        onClick: canvasLocked ? undefined : onSelect,
        onTap: canvasLocked ? undefined : onSelect,
        onDragStart: handleDragStart,
        onDragMove: handleDragMove,
        onDragEnd: handleDragEnd,
        onTransform: handleTransform,
        onTransformEnd: handleTransformEnd,
        draggable: !shapeProps.locked && !canvasLocked,
    };

    if (shapeProps.type === 'rect') {
        node = <Rect {...commonProps} fill={shapeFilled ? fillColor : 'rgba(0,0,0,0)'} fillEnabled={true} stroke={strokeColor} strokeWidth={shapeStrokeWidth} />;
    } else if (shapeProps.type === 'circle') {
        node = <Circle {...commonProps} fill={shapeFilled ? fillColor : 'rgba(0,0,0,0)'} fillEnabled={true} stroke={strokeColor} strokeWidth={shapeStrokeWidth} />;
    } else if (shapeProps.type === 'triangle') {
        node = <RegularPolygon {...commonProps} sides={3} radius={shapeProps.radius || 50} fill={shapeFilled ? fillColor : 'rgba(0,0,0,0)'} fillEnabled={true} stroke={strokeColor} strokeWidth={shapeStrokeWidth} />;
    } else if (shapeProps.type === 'star') {
        node = <Star {...commonProps} numPoints={5} innerRadius={shapeProps.innerRadius || 25} outerRadius={shapeProps.outerRadius || 50} fill={shapeFilled ? fillColor : 'rgba(0,0,0,0)'} fillEnabled={true} stroke={strokeColor} strokeWidth={shapeStrokeWidth} />;
    } else if (shapeProps.type === 'pentagon') {
        node = <RegularPolygon {...commonProps} sides={5} radius={shapeProps.radius || 50} fill={shapeFilled ? fillColor : 'rgba(0,0,0,0)'} fillEnabled={true} stroke={strokeColor} strokeWidth={shapeStrokeWidth} />;
    } else if (shapeProps.type === 'hexagon') {
        node = <RegularPolygon {...commonProps} sides={6} radius={shapeProps.radius || 50} fill={shapeFilled ? fillColor : 'rgba(0,0,0,0)'} fillEnabled={true} stroke={strokeColor} strokeWidth={shapeStrokeWidth} />;
    } else if (shapeProps.type.startsWith('icon-')) {
        node = <IconShape {...commonProps} iconType={shapeProps.iconType || shapeProps.type} />;
    } else if (shapeProps.type === 'text') {
        const hasUnderline =
            typeof shapeProps.textDecoration === 'string' &&
            shapeProps.textDecoration.toLowerCase().includes('underline');
        const padding =
            typeof shapeProps.padding === 'number'
                ? shapeProps.padding
                : hasUnderline
                    ? 4
                    : 0;

        // Normalize font weight for Konva compatibility
        let fontWeight = shapeProps.fontWeight || 'normal';
        if (fontWeight === 'black' || fontWeight === '900') fontWeight = 'bold';
        else if (fontWeight === 'extra-bold' || fontWeight === '800') fontWeight = 'bold';
        else if (fontWeight === 'bold' || fontWeight === '700') fontWeight = 'bold';
        else if (fontWeight === 'semi-bold' || fontWeight === '600') fontWeight = 'bold';
        else fontWeight = 'normal';

        const fontStyleValue = shapeProps.fontStyle || 'normal';
        
        // Combine fontWeight and fontStyle for Konva
        let combinedFontStyle = '';
        if (fontWeight === 'bold') combinedFontStyle += 'bold';
        if (fontStyleValue.toLowerCase().includes('italic')) {
            combinedFontStyle += (combinedFontStyle ? ' italic' : 'italic');
        }
        if (!combinedFontStyle) combinedFontStyle = 'normal';

        const textProps = {
            ...commonProps,
            fontStyle: combinedFontStyle,
            align: shapeProps.align || 'left',
            padding,
            onDblClick: startInlineTextEdit,
            onDblTap: startInlineTextEdit,
        };

        node = <Text {...textProps} />;
    } else if (shapeProps.type === 'image') {
        node = <KonvaImage {...commonProps} image={image} />;
    }

    return (
        <React.Fragment>
            {node}
            {isSelected && !shapeProps.locked && (
                <Transformer
                    ref={trRef}
                    keepRatio={shapeProps.type === 'image' || shapeProps.type.startsWith('icon-')}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) return oldBox;
                        return newBox;
                    }}
                    enabledAnchors={['top-left', 'top-center', 'top-right', 'middle-right', 'bottom-right', 'bottom-center', 'bottom-left', 'middle-left']}
                    anchorSize={10}
                    anchorStroke="#3b82f6"
                    anchorFill="white"
                    anchorStrokeWidth={2}
                    borderStroke="#3b82f6"
                    borderStrokeWidth={1}
                    rotateEnabled={true}
                />
            )}
        </React.Fragment>
    );
};

export default ShapeNode;
