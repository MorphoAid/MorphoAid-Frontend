/**
 * bbox.js — BBox conversion utilities
 *
 * Input format: normalized center-based xywh
 *   { x, y, w, h }  — all values in [0..1]
 *   x, y = center of the box (relative to image dimensions)
 *   w, h = width/height (relative to image dimensions)
 *
 * Output: pixel rect suitable for CSS absolute positioning
 *   { left, top, width, height }  — values in pixels
 */

/**
 * Convert one normalized center-xywh bbox to a CSS pixel rect.
 * @param {{ x: number, y: number, w: number, h: number }} bbox
 * @param {number} containerWidth  - pixel width of the image container
 * @param {number} containerHeight - pixel height of the image container
 * @returns {{ left: number, top: number, width: number, height: number }}
 */
export function bboxToPixelRect(bbox, containerWidth, containerHeight) {
    const { x, y, w, h } = bbox
    return {
        left: (x - w / 2) * containerWidth,
        top: (y - h / 2) * containerHeight,
        width: w * containerWidth,
        height: h * containerHeight,
    }
}

/**
 * Convert pixel rect to a CSS style object (string values with 'px').
 * @param {{ left: number, top: number, width: number, height: number }} rect
 * @returns {Record<string, string>}
 */
export function pixelRectToStyle(rect) {
    return {
        left: rect.left + 'px',
        top: rect.top + 'px',
        width: rect.width + 'px',
        height: rect.height + 'px',
    }
}

/**
 * Convenience: go directly from normalized bbox → CSS style object.
 */
export function bboxToStyle(bbox, containerWidth, containerHeight) {
    return pixelRectToStyle(bboxToPixelRect(bbox, containerWidth, containerHeight))
}
