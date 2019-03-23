const BOARD_STATE_ACTION_TYPE = require('../keys/boardStateActionType');
const POPULATE_BOARD_STATE_DATA_KEY = require('../keys/populateBoardStateDataKey');

/**
 * Wrapper function for constructing parameters for the POPULATE_BOARD_STATE_DATA action
 * @pure
 * @param boardModel - Array<Array<number>> representing the board state
 * @param tileSize - the length of a side of a tile
 * @param numberOfColumns - number of columns on the board
 * @param numberOfRows - number of rows on the board
 * @returns {}
 */
function populateBoardStateData(params) {
    const {
        boardModel,
        tileSize,
        numberOfColumns,
        numberOfRows
    } = params;

    return {
        type: BOARD_STATE_ACTION_TYPE.POPULATE_BOARD_STATE_DATA,
        [POPULATE_BOARD_STATE_DATA_KEY.BOARD_MODEL]: boardModel,
        [POPULATE_BOARD_STATE_DATA_KEY.TILE_SIZE]: tileSize,
        [POPULATE_BOARD_STATE_DATA_KEY.BOARD_COLUMNS]: numberOfColumns,
        [POPULATE_BOARD_STATE_DATA_KEY.BOARD_ROWS]: numberOfRows
    };
}

module.exports = populateBoardStateData;