const BOARD_STATE_ACTION_TYPE = require('../keys/boardStateActionType');

/**
 * Wrapper function for constructing parameters for the REDO action
 * @pure
 * @returns {{}}
 */
function redo() {

    return {
        type: BOARD_STATE_ACTION_TYPE.REDO
    };
}

module.exports = redo;
