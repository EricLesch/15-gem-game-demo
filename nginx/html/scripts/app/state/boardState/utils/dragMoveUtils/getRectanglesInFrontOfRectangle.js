const _ = require('lodash');
const TILE_STATE_KEYS = require('../../keys/tileStateKeys');
const MODE = require('../../enums/mode');

/**
 * Returns the tiles that are in front of the tile on the x-axis (i.e. tiles which might get in the way of the tile if
 * it is moved to the right
 * @pure
 * @param tileNumber - the number of the tile we are looking at
 * @param tileDataArray - array of TileData
 * @param tileSize - length of the side of a tile
 * @param mode - either MODE.FORWARD or MODE.REVERSE - determines if the algorithm is looking for values that are lower or higher
 * @param tileStateKey - either TILE_STATE_KEYS.X or TILE_STATE_KEYS.Y - determines if we are looking along the x or y axis
 * @returns {Array}
 */
function getRectanglesInFrontOfRectangle(tileNumber, tileDataArray, tileSize, mode, tileStateKey) {
    const tileStateForTileNumber = _.find(tileDataArray, [TILE_STATE_KEYS.NUMBER, tileNumber]);

    let key1, key2;
    if (tileStateKey === TILE_STATE_KEYS.X) {
        key1 = TILE_STATE_KEYS.X;
        key2 = TILE_STATE_KEYS.Y;
    } else {
        key1 = TILE_STATE_KEYS.Y;
        key2 = TILE_STATE_KEYS.X;
    }

    return _.filter(tileDataArray,
        (currentTileNumber) => {
            let key1Passed;
            if (mode === MODE.FORWARD) {
                key1Passed = (currentTileNumber[key1] > tileStateForTileNumber[key1]);
            } else {
                key1Passed = (currentTileNumber[key1] < tileStateForTileNumber[key1]);
            }
            const key2Passed1 = currentTileNumber[key2] > tileStateForTileNumber[key2] - tileSize;

            const key2Passed2 = currentTileNumber[key2] < tileStateForTileNumber[key2] + tileSize;
            return key1Passed && key2Passed1 && key2Passed2;
        }
    );
}

module.exports = getRectanglesInFrontOfRectangle;