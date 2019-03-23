/**
 * Returns the point
 * @pure
 * @param x - top left x
 * @param y - top left y
 * @param height
 * @param width
 * @returns {{x: *, y: *}} - the x and y of bottom left point
 */
function getMaxPointForRectangle(params) {
    let {
        x,
        y,
        height,
        width
    } = params;

    return {
        x: x + width,
        y: y + height
    };
}

module.exports = getMaxPointForRectangle;