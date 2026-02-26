import React from 'react';
import { Palette, Download, Undo as UndoIcon, Redo as RedoIcon } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';

const TopBar = ({ stageRef }) => {
    const { setSelectedId, undo, redo, historyList, redoList } = useDesign();

    const handleExport = () => {
        setSelectedId(null); // Deselect items to remove transform bounding box
        setTimeout(() => {
            if (!stageRef.current) return;
            const uri = stageRef.current.toDataURL();
            const link = document.createElement('a');
            link.download = 'design.png';
            link.href = uri;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }, 50);
    };

    return (
        <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-20 shrink-0">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Palette size={20} className="text-white" />
                </div>
                <div className="font-bold text-xl text-gray-800 tracking-tight">UseToPrint</div>
            </div>

            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                    <button
                        onClick={undo}
                        disabled={historyList.length === 0}
                        className="p-2 bg-black text-white hover:bg-gray-800 rounded disabled:opacity-30 disabled:hover:bg-black transition"
                        title="Undo"
                    >
                        <UndoIcon size={18} />
                    </button>
                    <button
                        onClick={redo}
                        disabled={redoList.length === 0}
                        className="p-2 bg-black text-white hover:bg-gray-800 rounded disabled:opacity-30 disabled:hover:bg-black transition"
                        title="Redo"
                    >
                        <RedoIcon size={18} />
                    </button>
                </div>

                <button
                    onClick={handleExport}
                    className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg text-sm font-medium transition-colors shadow-sm"
                >
                    <Download size={16} /> Download
                </button>
            </div>
        </div>
    );
};

export default TopBar;
