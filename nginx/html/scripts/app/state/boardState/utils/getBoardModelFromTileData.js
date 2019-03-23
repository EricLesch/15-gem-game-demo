const _ = require('lodash');

const TILE_STATE_KEYS = require('../keys/tileStateKeys');

/**
 * Takes a map of TileStates and returns an Array<Array<number>> representing the boardModel
 * @pure
 * @param tileStateMap - hash of TileStates that look something like
 * {
 *     "1": tileDataFor1,
 *     "2": tileDataFor2,
 *     "3": tileDataFor3
 * }
 * @returns Array<Array<number>> looking something like
 *
 * [
 *   [1, 2]
 *   [0, 3]
 * ]
 *
 */
function getBoardModelFromTileData(tileStateMap) {
    const tileStateKeys = Object.keys(tileStateMap);

    const tileStateArray = tileStateKeys.map((key) => tileStateMap[key]);

    const numberOfColumns = Math.max.apply(null, tileStateArray.map((tileState) => tileState[TILE_STATE_KEYS.POSITION_COLUMN])) + 1;
    const numberOfRows = Math.max.apply(null, tileStateArray.map((tileState) => tileState[TILE_STATE_KEYS.POSITION_ROW])) + 1;

    return _.range(0, numberOfRows).map(
        (rowNumber) => {
            return _.range(0, numberOfColumns).map(
                (columnNumber) => {
                    const matchingTileState = _.find(
                        tileStateArray,
                        {
                            [TILE_STATE_KEYS.POSITION_ROW]: rowNumber,
                            [TILE_STATE_KEYS.POSITION_COLUMN]: columnNumber
                        }
                    );

                    if (matchingTileState) {
                        return matchingTileState[TILE_STATE_KEYS.NUMBER];
                    } else {
                        return 0;
                    }
                }
            );
        }
    );
}

module.exports = getBoardModelFromTileData;