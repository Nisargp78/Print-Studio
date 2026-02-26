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

        const newElement = {
            id: uuidv4(),
            type,
            x: 150,
            y: 150,
            fill: type !== 'image' ? '#0f172a' : undefined,
            ...extraProps
        };

        if (type === 'rect') {
            newElement.width = 100;
            newElement.height = 100;
        } else if (type === 'circle') {
            newElement.radius = 50;
        } else if (type === 'triangle' || type === 'pentagon' || type === 'hexagon') {
            newElement.radius = 50;
        } else if (type === 'star') {
            newElement.innerRadius = 25;
            newElement.outerRadius = 50;
        } else if (type === 'text') {
            newElement.text = 'Double click to edit';
            newElement.fontSize = 32;
            newElement.fontFamily = 'Inter, sans-serif';
        }

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

    const selectedElement = elements.find((el) => el.id === selectedId);

    return (
        <DesignContext.Provider
            value={{
                elements,
                selectedId,
                backgroundColor,
                activeTab,
                selectedElement,
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
            }}
        >
            {children}
        </DesignContext.Provider>
    );
};
