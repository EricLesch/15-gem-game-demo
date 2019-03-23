const _ = require("lodash");
const produce = require('immer').produce;

const createTileState = require('./utils/createTileState');

const BOARD_STATE_KEY = require('./keys/boardStateKey');
const DRAG_START_KEY = require('./keys/dragStartKey');
const DRAG_MOVE_KEY = require('./keys/dragMoveKey');

const DRAG_END_KEY = require('./keys/dragEndKey');
const BOARD_STATE_ACTION_TYPE = require('./keys/boardStateActionType');
const POPULATE_BOARD_STATE_DATA_KEY = require('./keys/populateBoardStateDataKey');
const TILE_STATE_KEYS = require('./keys/tileStateKeys');

const getWhichRectanglesNeedToMoveAndHowFar = require('./utils/dragMoveUtils/getWhichRectanglesNeedToMoveAndHowFar');
const ApplicationHistory = require('./ApplicationHistory');

/**
 * Returns the initial state of the application
 * @pure
 * @returns {}
 */
function getDefaultState() {
    return {
        [BOARD_STATE_KEY.TILE_DATA]: {},
        [BOARD_STATE_KEY.TILE_SIZE]: null,
        [BOARD_STATE_KEY.BOARD_COLUMNS]: null,
        [BOARD_STATE_KEY.BOARD_ROWS]: null
    }
}

let applicationHistory;

/**
 * Reducer for the board state
 * @pure
 * @param state - the previous state of the application
 * @param action - the action passed by the dispatcher
 * @returns {Produced<*, void>}
 */
const boardStateReducer = (state, action) => {
    // Initialize the state //
    state = state || getDefaultState();

    /**
     * Produce prevents modification to the state object but allows modification of the draft object, which gets returned
     * as an immutable version of the state
     */
    let newState = produce(state,
        (draft) => {
            let tileDataForNumber;
            switch (action.type) {
                case BOARD_STATE_ACTION_TYPE.POPULATE_BOARD_STATE_DATA: // populate the initial board size
                    const tileSize = action[POPULATE_BOARD_STATE_DATA_KEY.TILE_SIZE];
                    const boardModel = action[POPULATE_BOARD_STATE_DATA_KEY.BOARD_MODEL];

                    draft[BOARD_STATE_KEY.TILE_SIZE] = tileSize;
                    draft[BOARD_STATE_KEY.TILE_DATA] = createTileState(boardModel, tileSize);
                    draft[BOARD_STATE_KEY.BOARD_COLUMNS] = boardModel[0].length;
                    draft[BOARD_STATE_KEY.BOARD_ROWS] = boardModel.length;
                    break;
                case BOARD_STATE_ACTION_TYPE.DRAG_START: // tile has started being dragged by the user
                    tileDataForNumber = draft[BOARD_STATE_KEY.TILE_DATA][action[DRAG_START_KEY.NUMBER]];

                    tileDataForNumber[TILE_STATE_KEYS.IS_DRAGGING] = true;

                    tileDataForNumber[TILE_STATE_KEYS.RECTANGLE_STARTING_DRAG_X] = tileDataForNumber[TILE_STATE_KEYS.X];
                    tileDataForNumber[TILE_STATE_KEYS.RECTANGLE_STARTING_DRAG_Y] = tileDataForNumber[TILE_STATE_KEYS.Y];

                    tileDataForNumber[TILE_STATE_KEYS.EVENT_DRAG_START_X] = action[DRAG_START_KEY.EVENT_DRAG_START_X];
                    tileDataForNumber[TILE_STATE_KEYS.EVENT_DRAG_START_Y] = action[DRAG_START_KEY.EVENT_DRAG_START_Y];

                    break;
                case BOARD_STATE_ACTION_TYPE.DRAG_END: // tile has stopped being dragged by the user
                    tileDataForNumber = draft[BOARD_STATE_KEY.TILE_DATA][action[DRAG_END_KEY.NUMBER]];

                    tileDataForNumber[TILE_STATE_KEYS.IS_DRAGGING] = false;

                    tileDataForNumber[TILE_STATE_KEYS.RECTANGLE_STARTING_DRAG_X] = null;
                    tileDataForNumber[TILE_STATE_KEYS.RECTANGLE_STARTING_DRAG_Y] = null;

                    tileDataForNumber[TILE_STATE_KEYS.EVENT_DRAG_START_X] = null;
                    tileDataForNumber[TILE_STATE_KEYS.EVENT_DRAG_START_Y] = null;

                    break;
                case BOARD_STATE_ACTION_TYPE.DRAG_MOVE: // tile is being dragged by the user
                    const tileMapData = draft[BOARD_STATE_KEY.TILE_DATA];
                    const tileMoveNumber = action[DRAG_MOVE_KEY.NUMBER];
                    tileDataForNumber = tileMapData[tileMoveNumber];

                    // ignore the move if the tile isn't marked as dragging
                    if (tileDataForNumber[TILE_STATE_KEYS.IS_DRAGGING]) {
                        const xDifference = action[DRAG_MOVE_KEY.X] - tileDataForNumber[TILE_STATE_KEYS.EVENT_DRAG_START_X] + tileDataForNumber[TILE_STATE_KEYS.RECTANGLE_STARTING_DRAG_X] - tileDataForNumber[TILE_STATE_KEYS.X];
                        const yDifference = action[DRAG_MOVE_KEY.Y] - tileDataForNumber[TILE_STATE_KEYS.EVENT_DRAG_START_Y] + tileDataForNumber[TILE_STATE_KEYS.RECTANGLE_STARTING_DRAG_Y] - tileDataForNumber[TILE_STATE_KEYS.Y];

                        if (!(xDifference === 0 && yDifference === 0)) {
                            // create a copy of the tile map data so we can debug it
                            const numberOfColumns = draft[BOARD_STATE_KEY.BOARD_COLUMNS];
                            const numberOfRows = draft[BOARD_STATE_KEY.BOARD_ROWS];
                            const tileSize = draft[BOARD_STATE_KEY.TILE_SIZE];

                            const rectanglesWhichNeedToBeMoved = getWhichRectanglesNeedToMoveAndHowFar(
                                {
                                    number: parseInt(tileMoveNumber, 10),
                                    xDifference,
                                    yDifference
                                },
                                tileMapData,
                                {
                                    numberOfColumns,
                                    numberOfRows,
                                    tileSize
                                }
                            );

                            // map all the new values to the tileMapData
                            rectanglesWhichNeedToBeMoved.acc.forEach(
                                (rectangleWhichNeedsToBeMoved) => {
                                    tileMapData[`${rectangleWhichNeedsToBeMoved.number}`][TILE_STATE_KEYS.X] = rectangleWhichNeedsToBeMoved.newX;
                                    tileMapData[`${rectangleWhichNeedsToBeMoved.number}`][TILE_STATE_KEYS.Y] = rectangleWhichNeedsToBeMoved.newY;
                                }
                            );

                            break;
                        }

                    }
            }
        }
    );

    /** handle the application history to enable undo and redo**/
    switch (action.type) {
        case BOARD_STATE_ACTION_TYPE.POPULATE_BOARD_STATE_DATA:
            applicationHistory = new ApplicationHistory();
            applicationHistory.pushState(newState);
            break;
        case BOARD_STATE_ACTION_TYPE.DRAG_MOVE:
            const tileDataForNumber = newState[BOARD_STATE_KEY.TILE_DATA][action[DRAG_MOVE_KEY.NUMBER]];
            /** only push the state if the drag actually did something */
            if (tileDataForNumber[TILE_STATE_KEYS.IS_DRAGGING]) {
                applicationHistory.pushState(newState);
            }
            break;
        case BOARD_STATE_ACTION_TYPE.UNDO:
            let previousState = applicationHistory.undo();

            if (previousState !== void 0) {
                newState = previousState;
            }
            break;
        case BOARD_STATE_ACTION_TYPE.REDO:
            let nextState = applicationHistory.redo();

            if (nextState !== void 0) {
                newState = nextState;
            }
    }

    return newState;
};

module.exports = boardStateReducer;
