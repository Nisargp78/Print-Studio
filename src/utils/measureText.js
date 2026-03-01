/**
 * Measures text using Canvas 2D API - the same engine Konva uses.
 * This gives accurate dimensions for any text (including spaces) that match canvas rendering.
 */
export function measureTextCanvas(text, fontProps) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const fontSize = fontProps.fontSize || 32;
    const fontFamily = fontProps.fontFamily || 'Arial, sans-serif';
    const fontWeight = (fontProps.fontWeight === 'bold' || String(fontProps.fontWeight || '').match(/^[6-9]\d{2}$/)) ? 'bold' : 'normal';
    const fontStyle = (fontProps.fontStyle || 'normal').toLowerCase().includes('italic') ? 'italic' : 'normal';

    ctx.font = `${fontStyle} ${fontWeight} ${fontSize}px ${fontFamily}`;
    const metrics = ctx.measureText(text || 'a');
    const width = metrics.width;

    return { width, fontSize };
}
