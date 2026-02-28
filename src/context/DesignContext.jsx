import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DesignContext } from './useDesignContext';

export const DesignProvider = ({ children }) => {
    const [elements, setElements] = useState([]);
    const [historyList, setHistoryList] = useState([]);
    const [redoList, setRedoList] = useState([]);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [clipboard, setClipboard] = useState(null);

    const [selectedId, setSelectedId] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [backgroundImage, setBackgroundImage] = useState(null);
    const [activeTab, setActiveTab] = useState('elements');
    const [isCanvasLocked, setIsCanvasLocked] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600, name: 'Default (800x600)' });
    const [zoom, setZoom] = useState(1);

    const saveHistory = (currentState) => {
        setHistoryList((prev) => [...prev, JSON.parse(JSON.stringify(currentState))]);
        setRedoList([]); // Clear redo stack on new action
    };

    const undo = () => {
        if (historyList.length === 0) return;

        const previousState = historyList[historyList.length - 1];
        const newHistory = historyList.slice(0, -1);

        setRedoList((prev) => [...prev, JSON.parse(JSON.stringify(elements))]); // Push current to redo
        setHistoryList(newHistory);
        setElements(previousState);
        setSelectedId(null);
    };

    const redo = () => {
        if (redoList.length === 0) return;

        const nextState = redoList[redoList.length - 1];
        const newRedo = redoList.slice(0, -1);

        setHistoryList((prev) => [...prev, JSON.parse(JSON.stringify(elements))]); // Push current to history
        setRedoList(newRedo);
        setElements(nextState);
        setSelectedId(null);
    };

    const addElement = (type, extraProps = {}) => {
        saveHistory(elements);

        const baseProps = {
            id: uuidv4(),
            type,
            x: 150,
            y: 150,
            fill: type !== 'image' ? '#0f172a' : undefined,
        };

        let typeDefaults = {};
        if (type === 'rect') {
            typeDefaults = { width: 100, height: 100, shapeFilled: false };
        } else if (type === 'circle') {
            typeDefaults = { radius: 50, shapeFilled: false };
        } else if (type === 'triangle' || type === 'pentagon' || type === 'hexagon') {
            typeDefaults = { radius: 50, shapeFilled: false };
        } else if (type === 'star') {
            typeDefaults = { innerRadius: 25, outerRadius: 50, shapeFilled: false };
        } else if (type === 'text') {
            typeDefaults = {
                text: 'Double click to edit',
                fontSize: 32,
                fontFamily: 'Arial, sans-serif',
                fontWeight: 'normal',
                fontStyle: 'normal',
                textDecoration: '',
                align: 'left',
                opacity: 1,
            };
        } else if (type.startsWith('icon-')) {
            // Handle icon types as vector shapes
            typeDefaults = {
                width: 50,
                height: 50,
                iconType: type,
                iconFilled: false,
            };
        }

        const newElement = { ...baseProps, ...typeDefaults, ...extraProps };

        setElements((prev) => [...prev, newElement]);

        // Auto-select text usually helps editors
        if (type === 'text') {
            setSelectedId(newElement.id);
            setActiveTab('quick_edit');
        }
    };

    const updateElement = (id, newProps) => {
        saveHistory(elements);

        setElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, ...newProps } : el))
        );
    };

    const deleteElement = (id) => {
        saveHistory(elements);

        setElements((prev) => prev.filter((el) => el.id !== id));
        if (selectedId === id) {
            setSelectedId(null);
            setActiveTab('elements');
        }
    };

    const toggleLockElement = (id) => {
        saveHistory(elements);

        setElements((prev) =>
            prev.map((el) => (el.id === id ? { ...el, locked: !el.locked } : el))
        );
    };

    const duplicateElement = (id, offset = { x: 20, y: 20 }) => {
        const source = elements.find((el) => el.id === id);
        if (!source) return;

        saveHistory(elements);

        const copy = {
            ...source,
            id: uuidv4(),
            x: (source.x ?? 0) + (offset.x ?? 0),
            y: (source.y ?? 0) + (offset.y ?? 0),
            locked: false,
        };

        setElements((prev) => [...prev, copy]);
        setSelectedId(copy.id);
        setActiveTab('quick_edit');
    };

    const copyElement = (id) => {
        const source = elements.find((el) => el.id === id);
        if (!source) return;
        setClipboard(JSON.parse(JSON.stringify(source)));
    };

    const pasteElement = () => {
        if (!clipboard) return;

        saveHistory(elements);

        const pasted = {
            ...clipboard,
            id: uuidv4(),
            x: (clipboard.x ?? 0) + 20,
            y: (clipboard.y ?? 0) + 20,
            locked: false,
        };

        setElements((prev) => [...prev, pasted]);
        setSelectedId(pasted.id);
        setActiveTab('quick_edit');
    };

    const toggleCanvasLock = () => {
        setIsCanvasLocked((prev) => !prev);
        setSelectedId(null);
    };

    const addUploadedImage = (imageData) => {
        setUploadedImages((prev) => [...prev, imageData]);
    };

    const removeUploadedImage = (id) => {
        setUploadedImages((prev) => prev.filter((img) => img.id !== id));
    };

    const addImageToCanvas = (uploadedImage) => {
        saveHistory(elements);
        setElements((prev) => [
            ...prev,
            {
                id: uuidv4(),
                type: 'image',
                x: 100,
                y: 100,
                width: 200,
                height: 200,
                src: uploadedImage.src,
                originalWidth: uploadedImage.originalWidth,
                originalHeight: uploadedImage.originalHeight,
            }
        ]);
    };

    const removeBackgroundImage = () => {
        setBackgroundImage(null);
    };

    const selectedElement = elements.find((el) => el.id === selectedId);
    const selectedType = selectedElement ? selectedElement.type : null;

    return (
        <DesignContext.Provider
            value={{
                elements,
                selectedId,
                selectedType,
                backgroundColor,
                activeTab,
                selectedElement,
                isCanvasLocked,
                historyList,
                redoList,
                uploadedImages,
                backgroundImage,
                canvasSize,
                zoom,
                undo,
                redo,
                setElements,
                setSelectedId,
                setBackgroundColor,
                setBackgroundImage,
                setActiveTab,
                setCanvasSize,
                setZoom,
                addElement,
                updateElement,
                deleteElement,
                toggleLockElement,
                duplicateElement,
                copyElement,
                pasteElement,
                toggleCanvasLock,
                addUploadedImage,
                removeUploadedImage,
                addImageToCanvas,
                removeBackgroundImage,
            }}
        >
            {children}
        </DesignContext.Provider>
    );
};
