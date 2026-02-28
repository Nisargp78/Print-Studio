import React, { useRef, useEffect } from 'react';
import { Rect, Circle, Text, Transformer, Image as KonvaImage, Star, RegularPolygon } from 'react-konva';
import useImage from 'use-image';

const ShapeNode = ({ shapeProps, isSelected, onSelect, onChange, canvasLocked = false }) => {
    const shapeRef = useRef();
    const trRef = useRef();

    const startInlineTextEdit = () => {
        if (canvasLocked || shapeProps.locked || shapeProps.type !== 'text') return;

        const textNode = shapeRef.current;
        if (!textNode) return;

        onSelect?.();

        const stage = textNode.getStage();
        if (!stage) return;

        const stageBox = stage.container().getBoundingClientRect();
        const textPosition = textNode.absolutePosition();

        const textarea = document.createElement('textarea');
        document.body.appendChild(textarea);

        const fontStyleValue = textNode.fontStyle() || 'normal';
        const isBold = fontStyleValue.includes('bold');
        const isItalic = fontStyleValue.includes('italic');

        textarea.value = textNode.text();
        const nodePadding = typeof textNode.padding() === 'number' ? textNode.padding() : 0;
        const nodeWidth = Math.max(40, textNode.width());
        const nodeHeight = Math.max(textNode.fontSize(), textNode.height());
        textarea.style.position = 'absolute';
        textarea.style.top = `${stageBox.top + textPosition.y}px`;
        textarea.style.left = `${stageBox.left + textPosition.x}px`;
        textarea.style.width = `${nodeWidth}px`;
        textarea.style.height = 'auto';
        textarea.style.minHeight = `${nodeHeight}px`;
        textarea.style.fontSize = `${textNode.fontSize()}px`;
        textarea.style.fontFamily = textNode.fontFamily();
        textarea.style.fontWeight = isBold ? 'bold' : 'normal';
        textarea.style.fontStyle = isItalic ? 'italic' : 'normal';
        textarea.style.lineHeight = `${textNode.lineHeight()}`;
        textarea.style.textAlign = textNode.align();
        textarea.style.color = textNode.fill();
        textarea.style.border = '0';
        textarea.style.padding = `${nodePadding}px`;
        textarea.style.margin = '0';
        textarea.style.boxSizing = 'border-box';
        textarea.style.overflow = 'hidden';
        textarea.style.background = 'white';
        textarea.style.outline = 'none';
        textarea.style.resize = 'none';
        textarea.style.zIndex = '1000';
        textarea.style.transformOrigin = 'left top';

        const rotation = textNode.rotation();
        let transform = '';
        if (rotation) {
            transform += `rotate(${rotation}deg)`;
        }
        textarea.style.transform = transform;

        textNode.hide();
        if (trRef.current) trRef.current.hide();
        textNode.getLayer()?.batchDraw();

        textarea.focus();
        textarea.setSelectionRange(textarea.value.length, textarea.value.length);

        const resizeTextarea = () => {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.max(nodeHeight, textarea.scrollHeight)}px`;
        };

        resizeTextarea();
        textarea.addEventListener('input', resizeTextarea);

        const removeTextarea = (save) => {
            textarea.removeEventListener('input', resizeTextarea);
            window.removeEventListener('click', handleOutsideClick);
            textarea.removeEventListener('keydown', handleKeyDown);

            if (save) {
                onChange({
                    ...shapeProps,
                    text: textarea.value,
                });
            }

            if (document.body.contains(textarea)) {
                document.body.removeChild(textarea);
            }

            textNode.show();
            if (trRef.current && isSelected) trRef.current.show();
            textNode.getLayer()?.batchDraw();
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
            if (e.target !== textarea) {
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

    const handleDragEnd = (e) => {
        if (canvasLocked || shapeProps.locked) return;
        onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    const handleDragMove = (e) => {
        if (canvasLocked || shapeProps.locked) return;
        onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    const handleTransform = () => {
        if (canvasLocked || shapeProps.locked) return;
        const node = shapeRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        if (shapeProps.type === 'rect' || shapeProps.type === 'image') {
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
        } else {
            onChange({
                ...shapeProps,
                x: node.x(),
                y: node.y(),
                rotation: node.rotation()
            });
        }
    };

    const handleTransformEnd = () => {
        if (canvasLocked || shapeProps.locked) return;
        const node = shapeRef.current;
        if (!node) return;

        const scaleX = node.scaleX();
        const scaleY = node.scaleY();

        node.scaleX(1);
        node.scaleY(1);

        if (shapeProps.type === 'rect' || shapeProps.type === 'image') {
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
        onSelect?.();
    };

    let node = null;
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
        node = <Rect {...commonProps} />;
    } else if (shapeProps.type === 'circle') {
        node = <Circle {...commonProps} />;
    } else if (shapeProps.type === 'triangle') {
        node = <RegularPolygon {...commonProps} sides={3} radius={shapeProps.radius || 50} />;
    } else if (shapeProps.type === 'star') {
        node = <Star {...commonProps} numPoints={5} innerRadius={shapeProps.innerRadius || 25} outerRadius={shapeProps.outerRadius || 50} />;
    } else if (shapeProps.type === 'pentagon') {
        node = <RegularPolygon {...commonProps} sides={5} radius={shapeProps.radius || 50} />;
    } else if (shapeProps.type === 'hexagon') {
        node = <RegularPolygon {...commonProps} sides={6} radius={shapeProps.radius || 50} />;
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
        if (fontStyleValue === 'italic') {
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
                    keepRatio={shapeProps.type === 'image'}
                    boundBoxFunc={(oldBox, newBox) => {
                        if (newBox.width < 5 || newBox.height < 5) return oldBox;
                        return newBox;
                    }}
                />
            )}
        </React.Fragment>
    );
};

export default ShapeNode;
