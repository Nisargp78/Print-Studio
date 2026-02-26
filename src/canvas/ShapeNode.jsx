import React, { useRef, useEffect } from 'react';
import { Rect, Circle, Text, Transformer, Image as KonvaImage, Star, RegularPolygon } from 'react-konva';
import useImage from 'use-image';

const ShapeNode = ({ shapeProps, isSelected, onSelect, onChange }) => {
    const shapeRef = useRef();
    const trRef = useRef();

    useEffect(() => {
        if (isSelected && trRef.current && shapeRef.current) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    const handleDragEnd = (e) => {
        onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
        });
    };

    const handleTransformEnd = () => {
        if (shapeProps.locked) return;
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

    let node = null;
    const commonProps = {
        ...shapeProps,
        ref: shapeRef,
        onClick: onSelect,
        onTap: onSelect,
        onDragEnd: handleDragEnd,
        onTransformEnd: handleTransformEnd,
        draggable: !shapeProps.locked,
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
        node = <Text {...commonProps} />;
    } else if (shapeProps.type === 'image') {
        node = <KonvaImage {...commonProps} image={image} />;
    }

    return (
        <React.Fragment>
            {node}
            {isSelected && !shapeProps.locked && (
                <Transformer
                    ref={trRef}
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
