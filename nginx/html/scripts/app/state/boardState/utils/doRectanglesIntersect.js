/**
 * Tests whether or not two rectangles intersect
 * @pure
 * @param rect1 - minx, miny, maxX, maxY
 * @param rect2 - minx, miny, maxX, maxY
 * @returns {boolean}
 */
function doRectanglesIntersect(rect1, rect2) {
    const differenceX1 = rect2.minX - rect1.maxX;
    const differenceY1 = rect2.minY - rect1.maxY;
    const differenceX2 = rect1.minX - rect2.maxX;
    const differenceY2 = rect1.minY - rect2.maxY;

    return !(differenceX1 >= 0 || differenceY1 >= 0 || differenceX2 >= 0 || differenceY2 >= 0);
}

module.exports = doRectanglesIntersect;
