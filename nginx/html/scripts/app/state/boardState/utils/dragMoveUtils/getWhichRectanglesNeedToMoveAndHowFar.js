const _ = require('lodash');
const getRectanglesInFrontOfRectangle = require("./getRectanglesInFrontOfRectangle");
const getRectanglesThatArePushedBackwards = require('./getRectanglesThatArePushedBackwards');
const TILE_STATE_KEYS = require('../../keys/tileStateKeys');
const MODE = require("../../enums/mode");
const getRectanglesThatArePushedForward = require('./getRectanglesThatArePushedForward');
const mapOtherCoordinateValuesToResults = require("./mapOtherCoordinateValuesToResults");
const checkIfXValuesHaveChanged = require('./checkIfXValuesHaveChanged');
/**
 * Takes information about how far a tile has been dragged and the data for the tiles, and returns the
 * new position of all the tiles that should be moved
 * @pure
 * @param dragMoveInfo.number - the number of the tile that is trying to move
 * @param dragMoveInfo.xDifference - how far the tile is trying to move in the x direction
 * @param dragMoveInfo.yDifference - how far the tile is trying to move in the y direction
 * @param tileDataMap - the map of the tile data from the state container
 * @param boardDimensions.numberOfColumns - the number of columns on the board
 * @param boardDimensions.numberOfRows - the number of rows on the board
 * @param boardDimensions.tileSize - the length of a side of a tile
 * @returns {acc: Array<{number: number, newX: number, newY: number}>,maximumAllowableMovement: number }
 */
function getWhichRectanglesNeedToMoveAndHowFar(dragMoveInfo, tileDataMap, boardDimensions) {
    const {
        number,
        xDifference,
        yDifference
    } = dragMoveInfo;

    const {
        numberOfColumns,
        numberOfRows,
        tileSize
    } = boardDimensions;

    const xCoordinateOfWall = tileSize * numberOfColumns;
    const yCoordinateOfWall = tileSize * numberOfRows;

    const oldRectanglePositionAndNumber = tileDataMap[`${number}`];

    const tileDataArray = _.map(tileDataMap, (tileData) => tileData);

    let result;

    if (xDifference > 0) {
        const arrayOfRectanglesInFrontOfRectangle = getRectanglesInFrontOfRectangle(number, tileDataArray, tileSize, MODE.FORWARD, TILE_STATE_KEYS.X);
        result = getRectanglesThatArePushedForward(oldRectanglePositionAndNumber, xDifference, arrayOfRectanglesInFrontOfRectangle, xCoordinateOfWall, tileSize, TILE_STATE_KEYS.X);
    } else if (xDifference < 0) {
        const arrayOfRectanglesInBackOfRectangle = getRectanglesInFrontOfRectangle(number, tileDataArray, tileSize, MODE.REVERSE, TILE_STATE_KEYS.X);
        result = getRectanglesThatArePushedBackwards(oldRectanglePositionAndNumber, xDifference, arrayOfRectanglesInBackOfRectangle, xCoordinateOfWall, tileSize, TILE_STATE_KEYS.X);
    }

    if (result && result.acc && result.acc.length) {
        result.acc = mapOtherCoordinateValuesToResults(result.acc, tileDataArray, TILE_STATE_KEYS.Y);
    }

    /** check if any of the values returned by the x result set are actually different than the existing values */
    const xValuesHaveChanged = checkIfXValuesHaveChanged(result, tileDataMap);

    /** if none of the x values changed, then we need to check for the y values */
    if (!xValuesHaveChanged) {
        if (yDifference > 0) {
            const arrayOfRectanglesInFrontOfRectangle = getRectanglesInFrontOfRectangle(number, tileDataArray, tileSize, MODE.FORWARD, TILE_STATE_KEYS.Y);
            result = getRectanglesThatArePushedForward(oldRectanglePositionAndNumber, yDifference, arrayOfRectanglesInFrontOfRectangle, yCoordinateOfWall, tileSize, TILE_STATE_KEYS.Y);
        } else if (yDifference < 0) {
            const arrayOfRectanglesInBackOfRectangle = getRectanglesInFrontOfRectangle(number, tileDataArray, tileSize, MODE.REVERSE, TILE_STATE_KEYS.Y);
            result = getRectanglesThatArePushedBackwards(oldRectanglePositionAndNumber, yDifference, arrayOfRectanglesInBackOfRectangle, yCoordinateOfWall, tileSize, TILE_STATE_KEYS.Y);
        }

        if (result && result.acc && result.acc.length) {
            result.acc = mapOtherCoordinateValuesToResults(result.acc, tileDataArray, TILE_STATE_KEYS.X);
        }
    }

    return result;
}

module.exports = getWhichRectanglesNeedToMoveAndHowFar;