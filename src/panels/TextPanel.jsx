import React from 'react';
import { List } from 'lucide-react';
import { useDesign } from '../context/useDesignContext';

const TextPanel = () => {
    const { addElement } = useDesign();

    return (
        <div className="p-4 flex flex-col gap-4">
            <h3 className="font-semibold text-gray-800 mb-2">Text</h3>
            
            {/* Large Header */}
            <button
                onClick={() => addElement('text', { 
                    text: 'Header',
                    fontSize: 96, 
                    fontWeight: 'bold',
                    fill: '#1f2937'
                })}
                className="w-full bg-gray-800 text-white p-4 flex items-center justify-center font-bold text-2xl hover:bg-gray-700 transition rounded"
            >
                Create header
            </button>

            {/* Medium Header */}
            <button
                onClick={() => addElement('text', { 
                    text: 'Header',
                    fontSize: 56, 
                    fontWeight: 'normal',
                    fill: '#1f2937'
                })}
                className="w-full bg-gray-700 text-white p-3 flex items-center justify-center text-lg hover:bg-gray-600 transition rounded"
            >
                Create header
            </button>

            {/* Small Header */}
            <button
                onClick={() => addElement('text', { 
                    text: 'Header',
                    fontSize: 32, 
                    fontWeight: 'normal',
                    fill: '#1f2937'
                })}
                className="w-full bg-gray-600 text-white p-3 flex items-center justify-center text-base hover:bg-gray-500 transition rounded"
            >
                Create header
            </button>

            {/* Add List */}
            <button
                onClick={() => addElement('text', { 
                    text: '• Bullet Text',
                    fontSize: 24,
                    fontWeight: 'normal',
                    fill: '#1f2937'
                })}
                className="w-full bg-gray-800 text-white p-3 flex items-center justify-center gap-2 text-sm hover:bg-gray-700 transition rounded"
            >
                <List size={20} />
                Add List
            </button>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Stylized Text Options */}
            <button
                onClick={() => addElement('text', { 
                    text: 'Adventure',
                    fontSize: 40,
                    fontWeight: 'normal',
                    fontFamily: 'cursive',
                    fill: '#1f2937'
                })}
                className="w-full bg-gray-100 border border-gray-200 p-3 flex items-center justify-center hover:bg-gray-200 transition rounded"
                style={{ fontFamily: 'cursive', fontSize: '20px' }}
            >
                Adventure
            </button>

            <button
                onClick={() => addElement('text', { 
                    text: 'Congratulations!',
                    fontSize: 36,
                    fontWeight: 'normal',
                    fontFamily: 'cursive',
                    fontStyle: 'italic',
                    fill: '#1f2937'
                })}
                className="w-full bg-gray-100 border border-gray-200 p-3 flex items-center justify-center hover:bg-gray-200 transition rounded italic"
                style={{ fontFamily: 'cursive', fontSize: '18px' }}
            >
                Congratulations!
            </button>

            <button
                onClick={() => addElement('text', { 
                    text: 'MARKETING\nPROPOSAL',
                    fontSize: 32,
                    fontWeight: 'bold',
                    fill: '#1f2937'
                })}
                className="w-full bg-gray-100 border border-gray-200 p-3 flex items-center justify-center hover:bg-gray-200 transition rounded font-bold text-sm leading-tight"
            >
                MARKETING<br/>PROPOSAL
            </button>

            <button
                onClick={() => addElement('text', { 
                    text: 'OPERATIONS\nMANAGER',
                    fontSize: 30,
                    fontWeight: 'bold',
                    fill: '#1f2937'
                })}
                className="w-full bg-gray-100 border border-gray-200 p-3 flex items-center justify-center hover:bg-gray-200 transition rounded font-bold text-sm leading-tight"
            >
                OPERATIONS<br/>MANAGER
            </button>

            <button
                onClick={() => addElement('text', { 
                    text: 'SALE',
                    fontSize: 72,
                    fontWeight: 'black',
                    fill: '#000000'
                })}
                className="w-full bg-gray-100 border border-gray-200 p-4 flex items-center justify-center hover:bg-gray-200 transition rounded font-black text-3xl"
            >
                SALE
            </button>

            <button
                onClick={() => addElement('text', { 
                    text: 'MINIMALISIM',
                    fontSize: 32,
                    fontWeight: 'normal',
                    fill: '#1f2937'
                })}
                className="w-full bg-gray-100 border border-gray-200 p-3 flex items-center justify-center hover:bg-gray-200 transition rounded text-base"
            >
                MINIMALISIM
            </button>

            <button
                onClick={() => addElement('text', { 
                    text: 'Last Forever',
                    fontSize: 40,
                    fontWeight: 'normal',
                    fontFamily: 'cursive',
                    fontStyle: 'italic',
                    fill: '#1f2937'
                })}
                className="w-full bg-gray-100 border border-gray-200 p-3 flex items-center justify-center hover:bg-gray-200 transition rounded italic"
                style={{ fontFamily: 'cursive', fontSize: '20px' }}
            >
                Last Forever
            </button>

            <button
                onClick={() => addElement('text', { 
                    text: "You're\nInvited",
                    fontSize: 48,
                    fontWeight: 'bold',
                    fill: '#000000'
                })}
                className="w-full bg-gray-100 border border-gray-200 p-4 flex items-center justify-center hover:bg-gray-200 transition rounded font-bold text-xl leading-tight"
            >
                You're<br/>Invited
            </button>
        </div>
    );
};

export default TextPanel;
