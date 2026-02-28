import React, { useRef } from 'react';
import TopBar from './TopBar';
import Sidebar from './Sidebar';
import PanelManager from '../panels/PanelManager';
import CanvasArea from '../canvas/CanvasArea';

const MainLayout = () => {
    // We keep the ref here so TopBar can read it for Export
    const stageRef = useRef(null);

    return (
        <div className="flex flex-col h-screen bg-gray-100 text-gray-900 font-sans">
            <TopBar stageRef={stageRef} />
            <div className="flex flex-1 overflow-hidden">
            <Sidebar />
            <PanelManager />
            <CanvasArea stageRef={stageRef} />
        </div>
        </div>
    );
};

export default MainLayout;
