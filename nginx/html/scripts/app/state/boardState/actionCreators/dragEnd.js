const BOARD_STATE_ACTION_TYPE = require('../keys/boardStateActionType');
const DRAG_END_KEY = require('../keys/dragEndKey');

/**
 * Wrapper function for constructing parameters for the DRAG_END action
 * @pure
 * @param number - represents the number of the tile dragEnd is fired from
 * @returns {{}}
 */
function dragEnd(params) {
    const {
        number
    } = params;

    return {
        type: BOARD_STATE_ACTION_TYPE.DRAG_END,
        [DRAG_END_KEY.NUMBER]: number
    };
}

module.exports = dragEnd;