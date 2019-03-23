const _ = require('lodash');

const TILE_STATE_KEYS = require('../keys/tileStateKeys');

/**
 * Returns the data containing the state of a Tile
 * @pure
 * @param number - number of the tile
 * @param tileSize - length of a side of a tile
 * @param rowIndex - The index of the row where the Tile is residing
 * @param columnIndex - The index of the row where the Tile is residing
 * @returns {{[p: string]: boolean|null|number|string}}
 */
function createTileStateFromData(params) {
    const {
        number,
        tileSize,
        rowIndex,
        columnIndex
    } = params;

    return {
        [TILE_STATE_KEYS.NUMBER]: number,
        [TILE_STATE_KEYS.X]: columnIndex * tileSize,
        [TILE_STATE_KEYS.Y]: rowIndex * tileSize,
        [TILE_STATE_KEYS.WIDTH]: tileSize,
        [TILE_STATE_KEYS.HEIGHT]: tileSize,
        [TILE_STATE_KEYS.IS_DRAGGING]: false,
        [TILE_STATE_KEYS.EVENT_DRAG_START_X]: null,
        [TILE_STATE_KEYS.EVENT_DRAG_START_Y]: null,
        [TILE_STATE_KEYS.RECTANGLE_STARTING_DRAG_X]: null,
        [TILE_STATE_KEYS.RECTANGLE_STARTING_DRAG_Y]: null,
        [TILE_STATE_KEYS.POSITION_COLUMN]: columnIndex,
        [TILE_STATE_KEYS.POSITION_ROW]: rowIndex
    };
}

/**
 * Creates a hash of the tile data where each key is a string representation of the number of each Tile
 * e.g. passing boardModel
 * [
 *   [1, 2]
 *   [0, 3]
 * ]
 *
 * would return something like
 * {
 *     "1": tileDataFor1,
 *     "2": tileDataFor2,
 *     "3": tileDataFor3
 * }
 * @pure
 * @param boardModel - Array<Array<number>> representing the board
 * @param tileSize -  length of a side of a tile
 * @returns {[p: string]: TileData}
 */
function createTileState(boardModel, tileSize) {
    const boardOfTileData = boardModel.map(
        (rowArray, rowIndex) => rowArray.map(
            (number, columnIndex) => {
                if (number !== 0) {
                    return createTileStateFromData(
                        {
                            number,
                            tileSize,
                            rowIndex,
                            columnIndex
                        }
                    );
                } else {
                    return false;
                }
            }
        )
    );

    /** _.compact removes the false value in the array */
    const arrayOfTileData = _.compact(_.flatMap(boardOfTileData));

    const hashOfTileData = {};

    arrayOfTileData.forEach(
        (tileData) => {
             hashOfTileData[tileData[TILE_STATE_KEYS.NUMBER]] = tileData;
        }
    );

    return hashOfTileData;
}

module.exports = createTileState;
