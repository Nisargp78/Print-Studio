import React from 'react';
import { List } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';

const TEXT_PRESETS = [
    {
        id: 'adventure',
        text: 'Adventure',
        fontFamily: '"Rock Salt", cursive',
        fontSize: 40,
        fontStyle: 'normal',
        fill: '#000000',
        align: 'left'
    },
    {
        id: 'congratulations',
        text: 'Congratulations!',
        fontFamily: '"Bilbo Swash Caps", cursive',
        fontSize: 44,
        fontStyle: 'normal',
        fill: '#000000',
        align: 'left'
    },
    {
        id: 'marketing',
        text: 'MARKETING\nPROPOSAL',
        fontFamily: 'Alata, sans-serif',
        fontSize: 32,
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#000000',
        align: 'center'
    },
    {
        id: 'operations',
        text: 'OPERATIONS\nMANAGER',
        fontFamily: 'Oswald, sans-serif',
        fontSize: 34,
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#000000',
        align: 'center'
    },
    {
        id: 'sale',
        text: 'SALE',
        fontFamily: 'Anton, sans-serif',
        fontSize: 72,
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#000000',
        align: 'center'
    },
    {
        id: 'minimalism',
        text: 'MINIMALISIM',
        fontFamily: 'Raleway, sans-serif',
        fontSize: 32,
        fontStyle: 'normal',
        fill: '#000000',
        align: 'left'
    },
    {
        id: 'lastforever',
        text: 'Last Forever',
        fontFamily: '"Great Vibes", cursive',
        fontSize: 56,
        fontStyle: 'normal',
        fill: '#000000',
        align: 'left'
    },
    {
        id: 'invited',
        text: "You're\nInvited",
        fontFamily: '"Yeseva One", serif',
        fontSize: 56,
        fontWeight: 'bold',
        fontStyle: 'normal',
        fill: '#000000',
        align: 'left'
    }
];

const TextPanel = () => {
    const { addElement } = useDesign();

    const createText = (props) => ({
        fontSize: 32,
        fontWeight: 'normal',
        fontFamily: 'cursive',
        fontStyle: 'normal',
        textDecoration: '',
        align: 'left',
        fill: '#1f2937',
        ...props,
    });

    React.useEffect(() => {
        const loadedFonts = new Set();
        TEXT_PRESETS.forEach(preset => {
            const fontFamily = preset.fontFamily.split(',')[0].replace(/['"]/g, '').trim();
            if (!loadedFonts.has(fontFamily) && !['Arial', 'Arial Black', 'sans-serif', 'cursive', 'serif', 'monospace'].includes(fontFamily)) {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(/\s+/g, '+')}`;
                document.head.appendChild(link);
                loadedFonts.add(fontFamily);
            }
        });
    }, []);

    return (
        <div className="p-4 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800 mb-2">Text</h3>
            
            <button onClick={() => addElement('text', createText({ text: 'Header', fontSize: 80, fontWeight: 'bold', fontFamily: 'Arial, sans-serif' }))} className="w-full bg-gray-800 text-white p-4 flex items-center justify-center font-bold text-2xl hover:bg-gray-700 transition rounded">Create header</button>
            <button onClick={() => addElement('text', createText({ text: 'Header', fontSize: 56, fontFamily: 'Arial, sans-serif' }))} className="w-full bg-gray-700 text-white p-3 flex items-center justify-center text-lg hover:bg-gray-600 transition rounded">Create header</button>
            <button onClick={() => addElement('text', createText({ text: 'Header', fontSize: 32, fontFamily: 'Arial, sans-serif' }))} className="w-full bg-gray-600 text-white p-3 flex items-center justify-center text-base hover:bg-gray-500 transition rounded">Create header</button>
            
            <button onClick={() => addElement('text', createText({ text: '• Bullet Text', fontSize: 24, fontFamily: 'Arial, sans-serif', fill: '#1f2937' }))} className="w-full bg-gray-800 text-white p-3 flex items-center justify-center gap-2 text-sm hover:bg-gray-700 transition rounded"><List size={20} />Add List</button>

            {TEXT_PRESETS.map(preset => {
                const displayText = preset.text.replace(/\n/g, ' ');
                const fontStyle = {
                    fontFamily: preset.fontFamily,
                    fontStyle: preset.fontStyle,
                    fontWeight: preset.fontWeight || 'normal'
                };
                
                return (
                    <button 
                        key={preset.id}
                        onClick={() => addElement('text', createText(preset))} 
                        className="w-full bg-gray-100 border border-gray-200 p-3 flex items-center justify-center hover:bg-gray-200 transition rounded"
                        style={fontStyle}
                    >
                        {displayText}
                    </button>
                );
            })}
        </div>
    );
};

export default TextPanel;
