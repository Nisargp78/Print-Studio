import React from 'react';
import { useDesign } from '../context/useDesignContext';
import ElementsPanel from './ElementsPanel';
import TextPanel from './TextPanel';
import UploadPanel from './UploadPanel';
import BackgroundPanel from './BackgroundPanel';
import QuickEditPanel from './QuickEditPanel';

const PanelManager = () => {
    const { activeTab } = useDesign();

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

    return (
        <div className="w-72 bg-white border-r border-gray-200 shadow-lg z-10 flex flex-col shrink-0 overflow-y-auto">
            {renderContent()}
        </div>
    );
};

export default PanelManager;
