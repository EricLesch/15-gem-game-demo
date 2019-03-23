/**
 * Enumeration which represents the different actions that can be passed to the boardStateStore
 * @type {{DRAG_MOVE: string, POPULATE_BOARD_STATE_DATA: string, DRAG_START: string, DRAG_END: string}}
 */
const BOARD_STATE_ACTION_TYPE = {
    POPULATE_BOARD_STATE_DATA: "POPULATE_BOARD_STATE_DATA",
    DRAG_START: "DRAG_START",
    DRAG_END: "DRAG_END",
    DRAG_MOVE: "DRAG_MOVE",
    UNDO: "UNDO",
    REDO: "REDO"
};

module.exports = BOARD_STATE_ACTION_TYPE;
