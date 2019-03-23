const BOARD_STATE_ACTION_TYPE = require('../keys/boardStateActionType');

/**
 * Wrapper function for constructing parameters for the UNO action
 * @pure
 * @returns {{}}
 */
function undo() {

    return {
        type: BOARD_STATE_ACTION_TYPE.UNDO
    };
}

module.exports = undo;
