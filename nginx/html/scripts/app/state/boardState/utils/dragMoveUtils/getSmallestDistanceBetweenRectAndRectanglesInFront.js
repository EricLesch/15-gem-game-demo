const MODE = require('../../enums/mode');
const TILE_STATE_KEYS = require('../../keys/tileStateKeys');

/**
 * Returns the shortest distance between the passed rectangle and all rectangles on the same axis and the nextRectangle
 * that will be pushed by the pushed rectangle
 * @pure
 * @param rect - The rectangle being tested
 * @param rectanglesInFrontOfRect - the different rectangles in front of the rectangle
 * @param mode - MODE.FORWARD or MODE.REVERSE - determines whether the algorithm is looking at values above the rect's or below the rect's
 * @param tileStateKey - either TILE_STATE_KEYS.X or TILE_STATE_KEYS.Y - determines which axis the algorithm is looking across
 * @returns {{nextRectangleGettingPushed: *, smallestDistance: number}}
 */
function getSmallestDistanceBetweenRectAndRectanglesInFront(rect, rectanglesInFrontOfRect, mode, tileStateKey) {
    let smallestDistance = Infinity;
    let nextRectangleGettingPushedMinMax = null;

    rectanglesInFrontOfRect.forEach(
        (rectangle) => {
            let distance;
            if (tileStateKey === TILE_STATE_KEYS.X) {
                if (mode === MODE.FORWARD) {
                    distance = rectangle.minX - rect.maxX;
                } else {
                    distance = rect.minX - rectangle.maxX;
                }
            } else {
                if (mode === MODE.FORWARD) {
                    distance = rectangle.minY - rect.maxY;
                } else {
                    distance = rect.minY - rectangle.maxY;
                }
            }

            if (distance < smallestDistance) {
                smallestDistance = distance;
                nextRectangleGettingPushedMinMax = rectangle;
            }
        }
    );

    return {
        smallestDistance: smallestDistance,
        nextRectangleGettingPushedMinMax: nextRectangleGettingPushedMinMax
    };
}

module.exports = getSmallestDistanceBetweenRectAndRectanglesInFront;