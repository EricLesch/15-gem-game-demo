/**
 * Enumeration which represents the different properties of the object hash storing data in the boardStateStore
 * @type {{TILE_SIZE: string, BOARD_COLUMNS: string, BOARD_ROWS: string, TILE_DATA: string}}
 */
const BOARD_STATE_KEY = {
    TILE_DATA: "TILE_DATA",
    TILE_SIZE: "TILE_SIZE",
    BOARD_COLUMNS: "BOARD_COLUMNS",
    BOARD_ROWS: "BOARD_ROWS"
};

module.exports = BOARD_STATE_KEY;
