import React from 'react';

const SidebarItem = ({ icon: IconComponent, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex flex-col items-center justify-center gap-2 w-full py-4 transition-all ${isActive
                ? 'bg-gray-800 text-white'
                : 'text-gray-700 hover:bg-gray-100'
                }`}
        >
            <IconComponent size={24} />
            <span className="text-[11px] font-medium">{label}</span>
        </button>
    );
};

export default SidebarItem;
