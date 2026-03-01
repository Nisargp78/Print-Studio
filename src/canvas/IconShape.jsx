import React from 'react';
import { Path, Group, Rect } from 'react-konva';

// SVG path data for common icons
const ICON_PATHS = {
    'icon-truck': {
        path: 'M3 7h11v8H3z M14 10h4l3 3v2h-7z M7 18a2 2 0 100 4 2 2 0 000-4z M18 18a2 2 0 100 4 2 2 0 000-4z',
        viewBox: '0 0 24 24',
        scale: 1
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
        path: 'M12 16a4 4 0 100-8 4 4 0 000 8z M12 2v3 M12 19v3 M2 12h3 M19 12h3 M4.93 4.93l2.12 2.12 M16.95 16.95l2.12 2.12 M4.93 19.07l2.12-2.12 M16.95 7.05l2.12-2.12',
        viewBox: '0 0 24 24',
        scale: 1
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
        path: 'M6 6h15l-1.5 8h-12z M6 6L5 3H2 M9 18a1.5 1.5 0 100 3 1.5 1.5 0 000-3z M17 18a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
        viewBox: '0 0 24 24',
        scale: 1
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
        path: 'M14 4l6 6 M17 1l6 6 M13 5l7 7-7 7-7-7z M3 21l5-5 M2 22l2-2',
        viewBox: '0 0 24 24',
        scale: 1
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
