import React, { useState } from 'react';
import { 
    Square, Circle, Triangle, Star, Hexagon, Pentagon,
    Truck, Vote, Leaf, Wrench, Paintbrush, Home,
    Mail, Phone, MapPin, Clock, User, Heart,
    ShoppingCart, Search, Check, X, Info
} from 'lucide-react';
import { useDesign } from '../context/useDesignContext';

const CATEGORIES = [
    { id: 'select', name: 'Please select one' },
    { id: 'shapes', name: 'Shapes' },
    { id: 'business', name: 'Business Card' },
    { id: 'postcard', name: 'Postcard' },
    { id: 'movers', name: 'Movers' },
    { id: 'election', name: 'Election' },
    { id: 'lawncare', name: 'Lawn Care' },
    { id: 'plumbing', name: 'Plumbing' },
    { id: 'painting', name: 'Painting' },
    { id: 'roofing', name: 'Roofing' },
    { id: 'icons', name: 'Icon' },
];

const ELEMENTS_BY_CATEGORY = {
    shapes: [
        { type: 'rect', icon: Square, label: 'Rectangle' },
        { type: 'circle', icon: Circle, label: 'Circle' },
        { type: 'triangle', icon: Triangle, label: 'Triangle' },
        { type: 'star', icon: Star, label: 'Star' },
        { type: 'pentagon', icon: Pentagon, label: 'Pentagon' },
        { type: 'hexagon', icon: Hexagon, label: 'Hexagon' },
    ],
    movers: [
        { type: 'icon-truck', icon: Truck, label: 'Truck' },
        { type: 'icon-home', icon: Home, label: 'Home' },
        { type: 'icon-mappin', icon: MapPin, label: 'Location' },
        { type: 'icon-phone', icon: Phone, label: 'Phone' },
    ],
    election: [
        { type: 'icon-vote', icon: Vote, label: 'Vote' },
        { type: 'icon-check', icon: Check, label: 'Check' },
        { type: 'icon-star', icon: Star, label: 'Star' },
        { type: 'icon-user', icon: User, label: 'User' },
    ],
    lawncare: [
        { type: 'icon-leaf', icon: Leaf, label: 'Leaf' },
        { type: 'icon-wrench', icon: Wrench, label: 'Tool' },
        { type: 'icon-phone', icon: Phone, label: 'Phone' },
        { type: 'icon-clock', icon: Clock, label: 'Clock' },
    ],
    plumbing: [
        { type: 'icon-wrench', icon: Wrench, label: 'Wrench' },
        { type: 'icon-phone', icon: Phone, label: 'Phone' },
        { type: 'icon-home', icon: Home, label: 'Home' },
    ],
    painting: [
        { type: 'icon-paintbrush', icon: Paintbrush, label: 'Brush' },
        { type: 'icon-home', icon: Home, label: 'Home' },
        { type: 'icon-phone', icon: Phone, label: 'Phone' },
        { type: 'icon-star', icon: Star, label: 'Star' },
    ],
    roofing: [
        { type: 'icon-home', icon: Home, label: 'Home' },
        { type: 'icon-wrench', icon: Wrench, label: 'Tool' },
        { type: 'icon-phone', icon: Phone, label: 'Phone' },
        { type: 'icon-mappin', icon: MapPin, label: 'Location' },
    ],
    business: [
        { type: 'icon-mail', icon: Mail, label: 'Email' },
        { type: 'icon-phone', icon: Phone, label: 'Phone' },
        { type: 'icon-mappin', icon: MapPin, label: 'Location' },
        { type: 'icon-user', icon: User, label: 'User' },
    ],
    postcard: [
        { type: 'icon-mail', icon: Mail, label: 'Mail' },
        { type: 'icon-heart', icon: Heart, label: 'Heart' },
        { type: 'icon-star', icon: Star, label: 'Star' },
        { type: 'icon-home', icon: Home, label: 'Home' },
    ],
    icons: [
        { type: 'icon-search', icon: Search, label: 'Search' },
        { type: 'icon-cart', icon: ShoppingCart, label: 'Cart' },
        { type: 'icon-check', icon: Check, label: 'Check' },
        { type: 'icon-x', icon: X, label: 'Close' },
        { type: 'icon-info', icon: Info, label: 'Info' },
        { type: 'icon-heart', icon: Heart, label: 'Heart' },
        { type: 'icon-star', icon: Star, label: 'Star' },
        { type: 'icon-user', icon: User, label: 'User' },
    ],
};

const ElementsPanel = () => {
    const { addElement } = useDesign();
    const [selectedCategory, setSelectedCategory] = useState('shapes');

    const currentElements = ELEMENTS_BY_CATEGORY[selectedCategory] || [];

    return (
        <div className="p-4 flex flex-col gap-4 h-full overflow-y-auto">
            <div>
                <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none cursor-pointer"
                >
                    {CATEGORIES.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>
            </div>

            {selectedCategory === 'select' ? (
                <div className="text-center text-gray-500 text-sm py-8">
                    Please select a category to view elements
                </div>
            ) : (
                <div className="grid grid-cols-3 gap-3">
                    {currentElements.map((element) => {
                        const IconComponent = element.icon;
                        return (
                            <button
                                key={element.type}
                                onClick={() => addElement(element.type)}
                                className="aspect-square bg-gray-50 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-blue-50 hover:border-blue-300 transition group relative"
                                title={element.label}
                            >
                                <IconComponent size={32} className="text-slate-700 group-hover:text-blue-600" />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default ElementsPanel;
