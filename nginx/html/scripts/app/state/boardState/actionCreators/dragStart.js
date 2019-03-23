const BOARD_STATE_ACTION_TYPE = require("../keys/boardStateActionType");
const DRAG_START_KEY = require('../keys/dragStartKey');

/**
 * Wrapper function for constructing parameters for the DRAG_START action
 * @pure
 * @param number - number of the tile which fired the dragStart action
 * @param eventDragStartX - x coordinate for the beginning of dragging
 * @param eventDragStartY - x coordinate for the end of dragging
 * @returns {}
 */
function dragStart(params) {
    const {
        number,
        eventDragStartX,
        eventDragStartY
    } = params;

    return {
        type: BOARD_STATE_ACTION_TYPE.DRAG_START,
        [DRAG_START_KEY.EVENT_DRAG_START_X]: eventDragStartX,
        [DRAG_START_KEY.EVENT_DRAG_START_Y]: eventDragStartY,
        [DRAG_START_KEY.NUMBER]: number
    };
}

module.exports = dragStart;
