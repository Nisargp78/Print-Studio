import React from 'react';
import { Path, Group, Rect } from 'react-konva';

// SVG path data for common icons
const ICON_PATHS = {
    'icon-truck': {
        path: 'M16 3h4l3 7v6h-2a3 3 0 11-6 0H9a3 3 0 11-6 0H1V7h10V3h5zm0 2v4h3.382l-2.118-4H16zm-8 6h12v5h.17a3.001 3.001 0 015.66 0h.17v-3.764L23.118 9H8v2zm-4 0H2v5h.17a3.001 3.001 0 015.66 0H8v-5H4z',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-home': {
        path: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-phone': {
        path: 'M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-mail': {
        path: 'M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z M22 6l-10 7L2 6',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-mappin': {
        path: 'M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z M12 13a3 3 0 100-6 3 3 0 000 6z',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-star': {
        path: 'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-heart': {
        path: 'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-user': {
        path: 'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 100-8 4 4 0 000 8z',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-settings': {
        path: 'M12 15a3 3 0 100-6 3 3 0 000 6z M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-check': {
        path: 'M20 6L9 17l-5-5',
        viewBox: '0 0 24 24',
        scale: 2.5
    },
    'icon-x': {
        path: 'M18 6L6 18M6 6l12 12',
        viewBox: '0 0 24 24',
        scale: 2.5
    },
    'icon-search': {
        path: 'M11 19a8 8 0 100-16 8 8 0 000 16z M21 21l-4.35-4.35',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-cart': {
        path: 'M9 2L1 5v14l8 3 8-3 8 3V8l-8-3-8 3z M9 2v20 M17 5v20',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-info': {
        path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 16v-4 M12 8h.01',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-clock': {
        path: 'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 6v6l4 2',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-wrench': {
        path: 'M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-paintbrush': {
        path: 'M18.37 2.63L14 7l-1.59-1.59a2 2 0 00-2.82 0L8 7l9 9 1.59-1.59a2 2 0 000-2.82L17 10l4.37-4.37a2.12 2.12 0 10-3-3z M9 8L4 13c-1.5 1.5-1.5 4 0 5.5l.5.5A3.92 3.92 0 008 20h0a4 4 0 004-4v-.5',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-leaf': {
        path: 'M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12',
        viewBox: '0 0 24 24',
        scale: 2
    },
    'icon-vote': {
        path: 'M9 11l3 3L22 4 M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11',
        viewBox: '0 0 24 24',
        scale: 2
    },
};

const IconShape = React.forwardRef(({ iconType, fill, iconFilled = false, width = 50, height = 50, ...otherProps }, ref) => {
    const iconData = ICON_PATHS[iconType];
    
    if (!iconData) {
        // Fallback to a simple rect if icon not found
        return <Rect {...otherProps} ref={ref} width={width} height={height} fill={fill} />;
    }

    const { path, viewBox, scale = 2 } = iconData;
    const [, , vbWidth, vbHeight] = viewBox.split(' ').map(Number);
    
    // Calculate scale to fit the desired width/height
    const scaleX = (width / vbWidth) * scale;
    const scaleY = (height / vbHeight) * scale;

    return (
        <Group {...otherProps} ref={ref} width={width} height={height}>
            <Rect
                x={0}
                y={0}
                width={width}
                height={height}
                fill="rgba(0,0,0,0.001)"
                strokeEnabled={false}
            />
            <Path
                data={path}
                fill={iconFilled ? fill : undefined}
                fillEnabled={iconFilled}
                scaleX={scaleX}
                scaleY={scaleY}
                strokeWidth={2}
                stroke={fill}
                lineCap="round"
                lineJoin="round"
            />
        </Group>
    );
});

IconShape.displayName = 'IconShape';

export default IconShape;
