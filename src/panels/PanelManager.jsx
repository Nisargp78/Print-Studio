import React from 'react';
import { X } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';
import ElementsPanel from './ElementsPanel';
import TextPanel from './TextPanel';
import UploadPanel from './UploadPanel';
import BackgroundPanel from './BackgroundPanel';
import QuickEditPanel from './QuickEditPanel';

const PanelManager = () => {
    const { activeTab, setActiveTab } = useDesign();

    const renderContent = () => {
        switch (activeTab) {
            case 'elements':
                return <ElementsPanel />;
            case 'text':
                return <TextPanel />;
            case 'upload':
                return <UploadPanel />;
            case 'background':
                return <BackgroundPanel />;
            case 'quick_edit':
                return <QuickEditPanel />;
            default:
                return null;
        }
    };

    const getPanelTitle = () => {
        switch (activeTab) {
            case 'elements':
                return 'Elements';
            case 'text':
                return 'Text';
            case 'upload':
                return 'Uploads';
            case 'background':
                return 'Background';
            case 'quick_edit':
                return 'Quick Edit';
            default:
                return '';
        }
    };

    if (!activeTab) return null;

    return (
        <div className="w-72 bg-white border-r border-gray-200 shadow-lg z-10 flex flex-col shrink-0 overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h2 className="font-semibold text-gray-800">{getPanelTitle()}</h2>
                <button
                    onClick={() => setActiveTab(null)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Close Panel"
                >
                    <X size={18} className="text-gray-600" />
                </button>
            </div>
            {renderContent()}
        </div>
    );
};

export default PanelManager;
