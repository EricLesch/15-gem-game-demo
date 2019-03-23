const _ = require("lodash");
const TILE_STATE_KEYS = require('../../keys/tileStateKeys');
const MODE = require('../../enums/mode');
const getRectanglesThatRectangleIntersectsWith = require('./getRectanglesThatRectangleIntersectsWith');
const getMinMaxXandYForRect = require('./getMinMaxXandYForRect');
const getSmallestDistanceBetweenRectAndRectanglesInFront = require('./getSmallestDistanceBetweenRectAndRectanglesInFront');
const getRectanglesInFrontOfRectangle = require('./getRectanglesInFrontOfRectangle');

/**
 * Finds the rectangles that are pushed forward(i.e. in a negative x or y direction) by a dragMove and determines how far the
 * current dragged rectangle can move and how far each intersecting rectangle in front of it can move - this algorithm
 * takes into account the location of the wall, which can limit how far the rectangles can move
 * @pure
 * @recursive - not tail recursive unfortunately
 * @param oldRectPositionAndNumber - the previous position of the rectangle before it is being dragged
 * @param distanceToMove - how far the user is trying to move the rectangle
 * @param arrayOfRectanglesInFrontOfRectangle - an array of rectangles that in between it and the wall on the axis that it is trying to move
 * @param coordinateOfWall - position of the wall
 * @param tileSize - the length of a side of a rectangle
 * @param tileStateKey - either TILE_STATE_KEYS.X or TILE_STATE_KEYS.Y - denotes whether we are calculating on the x or y axis
 * @returns {{acc: ({number: *}[]|Array|*), maximumAllowableMovement: number}|{acc: Array, maximumAllowableMovement: number}}
 */
function getRectanglesThatArePushedForward(oldRectPositionAndNumber, distanceToMove, arrayOfRectanglesInFrontOfRectangle, coordinateOfWall, tileSize, tileStateKey) {
    let result;

    let positionProp = tileStateKey === TILE_STATE_KEYS.X
        ? "newX"
        : "newY";

    let maximumAllowableMovementResult, newPosition;

    const number = oldRectPositionAndNumber[TILE_STATE_KEYS.NUMBER];

    // allowing rectangles to move farther than the tilesize will break the logic and is illegal anyway.
    if (distanceToMove > tileSize) {
        result = {
            acc: [],
            maximumAllowableMovement: 0
        };
    } else {
        const newRectPositionAndNumber = Object.assign({}, oldRectPositionAndNumber, {[tileStateKey]: oldRectPositionAndNumber[tileStateKey] + distanceToMove});

        // rectangles intersect
        const rectanglesThatIntersect = getRectanglesThatRectangleIntersectsWith(newRectPositionAndNumber, arrayOfRectanglesInFrontOfRectangle);
        let acc;
        if (rectanglesThatIntersect.length) {
            const minMaxOfOldRectPositionAndNumber = getMinMaxXandYForRect(oldRectPositionAndNumber);

            const {
                smallestDistance,
                nextRectangleGettingPushedMinMax
            } = getSmallestDistanceBetweenRectAndRectanglesInFront(minMaxOfOldRectPositionAndNumber, rectanglesThatIntersect, MODE.FORWARD, tileStateKey);

            const nextRectangleGettingPushed = _.find(arrayOfRectanglesInFrontOfRectangle, [TILE_STATE_KEYS.NUMBER, nextRectangleGettingPushedMinMax.number]);

            const newArrayOfRectanglesInFrontOfRectangle = getRectanglesInFrontOfRectangle(nextRectangleGettingPushed[TILE_STATE_KEYS.NUMBER], arrayOfRectanglesInFrontOfRectangle, tileSize, MODE.FORWARD, tileStateKey);

            const rectanglesThatArePushedForward = getRectanglesThatArePushedForward(nextRectangleGettingPushed, distanceToMove - smallestDistance, newArrayOfRectanglesInFrontOfRectangle, coordinateOfWall, tileSize, tileStateKey);

            acc = rectanglesThatArePushedForward.acc;
            let maximumAllowableMovement = rectanglesThatArePushedForward.maximumAllowableMovement;

            if (maximumAllowableMovement === 0) {
                maximumAllowableMovementResult = smallestDistance;
                newPosition = oldRectPositionAndNumber[tileStateKey] + smallestDistance;
            } else if (maximumAllowableMovement + smallestDistance >= distanceToMove) {
                maximumAllowableMovementResult = maximumAllowableMovement + smallestDistance;
                newPosition = oldRectPositionAndNumber[tileStateKey] + distanceToMove;
            } else {
                maximumAllowableMovementResult = maximumAllowableMovement + smallestDistance;
                newPosition = oldRectPositionAndNumber[tileStateKey] + maximumAllowableMovement + smallestDistance;
            }

            acc.push(
                {
                    number,
                    [positionProp]: newPosition
                }
            );

        } else {
            const distanceBetweenWallAndRect = coordinateOfWall - (oldRectPositionAndNumber[tileStateKey] + tileSize);
            if (distanceBetweenWallAndRect === 0) {
                maximumAllowableMovementResult = 0;
                acc = [];
            } else {
                if (distanceBetweenWallAndRect < distanceToMove) {
                    maximumAllowableMovementResult = distanceBetweenWallAndRect;
                    newPosition = oldRectPositionAndNumber[tileStateKey] + distanceBetweenWallAndRect;
                } else {
                    maximumAllowableMovementResult = distanceToMove;
                    newPosition = oldRectPositionAndNumber[tileStateKey] + distanceToMove;
                }

                acc = [
                    {
                        number,
                        [positionProp]: newPosition
                    }
                ];
            }

        }

        result = {
            acc,
            maximumAllowableMovement: maximumAllowableMovementResult
        };
    }

    return result;
}

module.exports = getRectanglesThatArePushedForward;