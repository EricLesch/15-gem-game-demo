const DRAG_MOVE_KEY = require('../keys/dragMoveKey');
const BOARD_STATE_ACTION_TYPE = require('../keys/boardStateActionType');

/**
 * Wrapper function for constructing parameters for the DRAG_MOVE action
 * @pure
 * @param number - number of the tile which fired the dragMove action
 * @param x - x coordinate
 * @param y - y coordinate
 * @returns {}
 */
function dragMove(params) {
   const {
       number,
       x,
       y
   } = params;

   return {
       type: BOARD_STATE_ACTION_TYPE.DRAG_MOVE,
       [DRAG_MOVE_KEY.NUMBER]: number,
       [DRAG_MOVE_KEY.X]: x,
       [DRAG_MOVE_KEY.Y]: y
   };
}

module.exports = dragMove;