const _ = require("lodash");
const TILE_STATE_KEYS = require('../../keys/tileStateKeys');

/**
 * Fills in the missing axis in a result set by copying the relevant property on to each item in the set
 * For example, if we have a result set (accResults) that looks like
 * [
 *   {
 *     number: 1,
 *     newX: 233
 *   }
 * ],
 * we need to copy the value of the y from the existing data to get a complete result (i.e. both x and y)
 * So we map the y value from the tileData array value for number 1 (y: 100)
 * and end up with
 * {
 *     number: 1,
 *     newX: 233,
 *     newY: 100
 * }
 * We do the same thing for x if we have newY but newX is missing
 * @pure
 * @param accResults - the results we need to fix
 * @param tileDataArray - the array of tile data that holds the existing data
 * @param tileStateKey - either TILE_STATE_KEYS.X or TILE_STATE_KEYS.Y - denotes whether we are working with the x or y axis
 * @returns Array<{number: number, newX: number, newY: number}>
 */
function mapOtherCoordinateValuesToResults(accResults, tileDataArray, tileStateKey) {
    return accResults.map(
        (result) => {
            const tileDataForNumber = _.find(tileDataArray, [TILE_STATE_KEYS.NUMBER, result.number]);

            let newX;
            if (tileStateKey === TILE_STATE_KEYS.X) {
                newX = tileDataForNumber[TILE_STATE_KEYS.X]
            } else {
                newX = result.newX;
            }

            let newY;
            if (tileStateKey === TILE_STATE_KEYS.Y) {
                newY = tileDataForNumber[TILE_STATE_KEYS.Y];
            } else {
                newY = result.newY;
            }

            return {
                number: result.number,
                newX,
                newY
            };
        }
    );
}

module.exports = mapOtherCoordinateValuesToResults;
