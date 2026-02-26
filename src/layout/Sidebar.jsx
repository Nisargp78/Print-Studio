import React from 'react';
import { Type, Image as ImageIcon, Palette, Shapes, PenTool } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';
import SidebarItem from '../components/SidebarItem';

const TABS = [
    { id: 'quick_edit', icon: PenTool, label: 'Quick Edit' },
    { id: 'text', icon: Type, label: 'Text' },
    { id: 'elements', icon: Shapes, label: 'Elements' },
    { id: 'upload', icon: ImageIcon, label: 'Uploads' },
    { id: 'background', icon: Palette, label: 'Background' },
];

const Sidebar = () => {
    const { activeTab, setActiveTab } = useDesign();

    return (
        <div className="w-24 bg-gray-50 border-r border-gray-200 flex flex-col items-center py-6 gap-1 z-20 shrink-0">
            {TABS.map((item) => (
                <SidebarItem
                    key={item.id}
                    icon={item.icon}
                    label={item.label}
                    isActive={activeTab === item.id}
                    onClick={() => setActiveTab(item.id)}
                />
            ))}
        </div>
    );
};

export default Sidebar;
