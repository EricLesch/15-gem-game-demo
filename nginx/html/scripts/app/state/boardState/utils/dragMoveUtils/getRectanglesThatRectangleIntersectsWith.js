const _ = require('lodash');
const doRectanglesIntersect = require('../doRectanglesIntersect');

const getMinMaxXandYForRect = require('./getMinMaxXandYForRect');

/**
 * Determines which rectangles in the array 'rectanglesToTestForIntersection' intersect with the passed 'rectangle'
 * @pure
 * @param rectangle - rectangle we are testing
 * @param rectanglesToTestForIntersection - array of rectangles we are testing against
 * @returns {Array} - rectangles in the array of rectangles that intersect
 */
function getRectanglesThatRectangleIntersectsWith(rectangle, rectanglesToTestForIntersection) {
    const rectangleWithMinMaxXandY = getMinMaxXandYForRect(rectangle);
    const rectsToTestForIntersectionWithMinMaxXandY = rectanglesToTestForIntersection.map(getMinMaxXandYForRect);

    return _.filter(
        rectsToTestForIntersectionWithMinMaxXandY,
        (currentRectangle) => doRectanglesIntersect(rectangleWithMinMaxXandY, currentRectangle)
    );
}

module.exports = getRectanglesThatRectangleIntersectsWith;