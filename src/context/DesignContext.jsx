import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DesignContext } from './useDesignContext';

export const DesignProvider = ({ children }) => {
    const [elements, setElements] = useState([]);
    const [historyList, setHistoryList] = useState([]);
    const [redoList, setRedoList] = useState([]);

    const [selectedId, setSelectedId] = useState(null);
    const [backgroundColor, setBackgroundColor] = useState('#ffffff');
    const [activeTab, setActiveTab] = useState('elements');
    const [isCanvasLocked, setIsCanvasLocked] = useState(false);

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
            typeDefaults = { width: 100, height: 100 };
        } else if (type === 'circle') {
            typeDefaults = { radius: 50 };
        } else if (type === 'triangle' || type === 'pentagon' || type === 'hexagon') {
            typeDefaults = { radius: 50 };
        } else if (type === 'star') {
            typeDefaults = { innerRadius: 25, outerRadius: 50 };
        } else if (type === 'text') {
            typeDefaults = {
                text: 'Double click to edit',
                fontSize: 32,
                fontFamily: 'Inter, sans-serif',
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

    const toggleCanvasLock = () => {
        setIsCanvasLocked((prev) => !prev);
        setSelectedId(null);
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
                undo,
                redo,
                setElements,
                setSelectedId,
                setBackgroundColor,
                setActiveTab,
                addElement,
                updateElement,
                deleteElement,
                toggleLockElement,
                duplicateElement,
                toggleCanvasLock,
            }}
        >
            {children}
        </DesignContext.Provider>
    );
};
