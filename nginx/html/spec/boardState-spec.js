const _ = require('lodash');
const {createStore} = require('redux');

const boardStateReducer = require('../scripts/app/state/boardState/boardStateReducer');

const DRAG_START_KEY = require('../scripts/app/state/boardState/keys/dragStartKey');
const TILE_STATE_KEYS = require('../scripts/app/state/boardState/keys/tileStateKeys');

const BOARD_STATE_KEY = require('../scripts/app/state/boardState/keys/boardStateKey');

const populateBoardStateData = require('../scripts/app/state/boardState/actionCreators/populateBoardStateData');
const dragStart = require('../scripts/app/state/boardState/actionCreators/dragStart');
const dragEnd = require('../scripts/app/state/boardState/actionCreators/dragEnd');
const dragMove = require('../scripts/app/state/boardState/actionCreators/dragMove');
const undo = require('../scripts/app/state/boardState/actionCreators/undo');
const redo = require('../scripts/app/state/boardState/actionCreators/redo');

const createBoard = require('../scripts/app/state/boardState/utils/createBoard');

describe('boardStateStore',
    function () {
        it('should create the tile state when the populateBoardStateData() action is passed',
            function () {
                const boardStateStore = createStore(boardStateReducer);

                const NUMBER_OF_COLUMNS = 5;
                const NUMBER_OF_ROWS = 4;

                const boardModel = createBoard(NUMBER_OF_COLUMNS, NUMBER_OF_ROWS);

                const TILE_SIZE = 100;

                boardStateStore.dispatch(
                    populateBoardStateData(
                        {
                            boardModel,
                            tileSize: TILE_SIZE,
                            numberOfColumns: NUMBER_OF_COLUMNS,
                            numberOfRows: NUMBER_OF_ROWS
                        }
                    )
                );

                const newState = boardStateStore.getState();

                // check that that the keys are there
                const boardStateKeys = Object.keys(newState[BOARD_STATE_KEY.TILE_DATA]);

                _.range(1, 20).map(number => '' + number).forEach(
                    (number) => {
                        expect(_.includes(boardStateKeys, number)).toBe(true);
                    }
                );

                // tile size should be correct
                expect(newState[BOARD_STATE_KEY.TILE_SIZE]).toBe(TILE_SIZE);
            }
        );

        it('should update the tile state with the given number when the dragStart() is called',
            function () {
                const boardStateStore = createStore(boardStateReducer);

                const NUMBER_OF_COLUMNS = 5;
                const NUMBER_OF_ROWS = 4;

                const boardModel = createBoard(NUMBER_OF_COLUMNS, NUMBER_OF_ROWS);

                const TILE_SIZE = 100;

                boardStateStore.dispatch(
                    populateBoardStateData(
                        {
                            boardModel,
                            tileSize: TILE_SIZE,
                            numberOfColumns: NUMBER_OF_COLUMNS,
                            numberOfRows: NUMBER_OF_ROWS
                        }
                    )
                );

                const NUMBER = "1";

                const eventDragStartX = 5;
                const eventDragStartY = 7;

                const oldState = boardStateStore.getState();

                const tileDataForNumber1BeforeAction = oldState[BOARD_STATE_KEY.TILE_DATA][NUMBER];

                const tileDataForNumber2BeforeAction = oldState[BOARD_STATE_KEY.TILE_DATA]["2"];

                boardStateStore.dispatch(
                    dragStart(
                        {
                            number: NUMBER,
                            eventDragStartX,
                            eventDragStartY
                        }
                    )
                );

                const newState = boardStateStore.getState();

                const tileDataForNumber1AfterAction = newState[BOARD_STATE_KEY.TILE_DATA][NUMBER];
                const tileDataForNumber2AfterAction = newState[BOARD_STATE_KEY.TILE_DATA]["2"];

                // since we are using immutable data, the references for the data before and after a changed object
                // should not be the same
                expect(tileDataForNumber1BeforeAction === tileDataForNumber1AfterAction).toBe(false);

                // since we are using immutable data, the references for the data before and after for unchanged objects
                // should be the same
                expect(tileDataForNumber2BeforeAction === tileDataForNumber2AfterAction).toBe(true);

                expect(tileDataForNumber1AfterAction[DRAG_START_KEY.NUMBER]).toBe(parseInt(NUMBER, 10));
                expect(tileDataForNumber1AfterAction[TILE_STATE_KEYS.EVENT_DRAG_START_X]).toBe(eventDragStartX);
                expect(tileDataForNumber1AfterAction[TILE_STATE_KEYS.EVENT_DRAG_START_Y]).toBe(eventDragStartY);
            }
        );

        it('should update the tile state with the given number when the dragEnd() is called',
            function () {
                const boardStateStore = createStore(boardStateReducer);

                const NUMBER_OF_COLUMNS = 5;
                const NUMBER_OF_ROWS = 4;

                const boardModel = createBoard(NUMBER_OF_COLUMNS, NUMBER_OF_ROWS);

                const TILE_SIZE = 100;

                const NUMBER = "3";

                boardStateStore.dispatch(
                    populateBoardStateData(
                        {
                            boardModel,
                            tileSize: TILE_SIZE,
                            numberOfColumns: NUMBER_OF_COLUMNS,
                            numberOfRows: NUMBER_OF_ROWS
                        }
                    )
                );

                const EVENT_DRAG_START_X = 20;
                const EVENT_DRAG_START_Y = 24;

                boardStateStore.dispatch(
                    dragStart(
                        {
                            number: NUMBER,
                            eventDragStartX: EVENT_DRAG_START_X,
                            eventDragStartY: EVENT_DRAG_START_Y
                        }
                    )
                );

                const oldState = boardStateStore.getState();

                const tileDataForNumber3BeforeAction = oldState[BOARD_STATE_KEY.TILE_DATA][NUMBER];

                expect(tileDataForNumber3BeforeAction[TILE_STATE_KEYS.EVENT_DRAG_START_X]).toBe(EVENT_DRAG_START_X);
                expect(tileDataForNumber3BeforeAction[TILE_STATE_KEYS.EVENT_DRAG_START_Y]).toBe(EVENT_DRAG_START_Y);

                boardStateStore.dispatch(
                    dragEnd(
                        {
                            number: NUMBER
                        }
                    )
                );

                const newState = boardStateStore.getState();

                const tileDataForNumber3AfterAction = newState[BOARD_STATE_KEY.TILE_DATA][NUMBER];

                expect(tileDataForNumber3AfterAction[TILE_STATE_KEYS.RECTANGLE_STARTING_DRAG_X]).toBe(null);
                expect(tileDataForNumber3AfterAction[TILE_STATE_KEYS.RECTANGLE_STARTING_DRAG_Y]).toBe(null);
                expect(tileDataForNumber3AfterAction[TILE_STATE_KEYS.EVENT_DRAG_START_X]).toBe(null);
                expect(tileDataForNumber3AfterAction[TILE_STATE_KEYS.EVENT_DRAG_START_Y]).toBe(null);


                // new reference since we are using immutable data and the values have changed
                expect(tileDataForNumber3BeforeAction === tileDataForNumber3AfterAction).toBe(false);

            }
        );

        it('should update the tile state with the given number when the dragMove() is called',
            function () {
                const boardStateStore = createStore(boardStateReducer);

                const NUMBER_OF_COLUMNS = 2;
                const NUMBER_OF_ROWS = 2;

                const boardModel = [
                    [1, 2],
                    [3, 0]
                ];

                const TILE_SIZE = 100;

                const NUMBER = "3";

                boardStateStore.dispatch(
                    populateBoardStateData(
                        {
                            boardModel,
                            tileSize: TILE_SIZE,
                            numberOfColumns: NUMBER_OF_COLUMNS,
                            numberOfRows: NUMBER_OF_ROWS
                        }
                    )
                );

                const EVENT_DRAG_START_X = 20;
                const EVENT_DRAG_START_Y = 24;

                boardStateStore.dispatch(
                    dragStart(
                        {
                            number: NUMBER,
                            eventDragStartX: EVENT_DRAG_START_X,
                            eventDragStartY: EVENT_DRAG_START_Y,
                        }
                    )
                );

                const oldState = boardStateStore.getState();

                const tileDataForNumber3BeforeAction = oldState[BOARD_STATE_KEY.TILE_DATA][NUMBER];


                expect(tileDataForNumber3BeforeAction[TILE_STATE_KEYS.EVENT_DRAG_START_X]).toBe(EVENT_DRAG_START_X);
                expect(tileDataForNumber3BeforeAction[TILE_STATE_KEYS.EVENT_DRAG_START_Y]).toBe(EVENT_DRAG_START_Y);

                const startingX = tileDataForNumber3BeforeAction[TILE_STATE_KEYS.X];
                const startingY = tileDataForNumber3BeforeAction[TILE_STATE_KEYS.Y];

                // drag the tile over to the next column to the right
                const newX = EVENT_DRAG_START_X + 100;
                const newY = 24;

                boardStateStore.dispatch(
                    dragMove(
                        {
                            number: NUMBER,
                            x: newX,
                            y: newY
                        }
                    )
                );

                const newState = boardStateStore.getState();

                const tileDataForNumber3AfterAction = newState[BOARD_STATE_KEY.TILE_DATA][NUMBER];

                expect(tileDataForNumber3AfterAction[TILE_STATE_KEYS.EVENT_DRAG_START_X]).toBe(EVENT_DRAG_START_X);
                expect(tileDataForNumber3AfterAction[TILE_STATE_KEYS.EVENT_DRAG_START_Y]).toBe(EVENT_DRAG_START_Y);

                // x should change but Y should not
                expect(tileDataForNumber3AfterAction[TILE_STATE_KEYS.X]).not.toBe(startingX);
                expect(tileDataForNumber3AfterAction[TILE_STATE_KEYS.Y]).toBe(startingY);

                // references should be different as we are using immutable data
                expect(tileDataForNumber3BeforeAction === tileDataForNumber3AfterAction).toBe(false);

            }
        );

        it('should move multiple blocks when one block is dragged and pushes another block',
            function () {
                const boardStateStore = createStore(boardStateReducer);

                const NUMBER_OF_COLUMNS = 3;
                const NUMBER_OF_ROWS = 2;

                const boardModel = [
                    [1, 2, 0],
                    [3, 5, 4]
                ];

                const TILE_SIZE = 100;

                const NUMBER = "1";

                const PUSHED_NUMBER = "2";

                boardStateStore.dispatch(
                    populateBoardStateData(
                        {
                            boardModel,
                            tileSize: TILE_SIZE,
                            numberOfColumns: NUMBER_OF_COLUMNS,
                            numberOfRows: NUMBER_OF_ROWS
                        }
                    )
                );


                const oldState = boardStateStore.getState();

                const tileDataForNumber2BeforeAction = oldState[BOARD_STATE_KEY.TILE_DATA][PUSHED_NUMBER];

                const INITIAL_X_VALUE_FOR_NUMBER_2 = 100;

                expect(tileDataForNumber2BeforeAction[TILE_STATE_KEYS.X]).toBe(INITIAL_X_VALUE_FOR_NUMBER_2);
                expect(tileDataForNumber2BeforeAction[TILE_STATE_KEYS.Y]).toBe(0);

                const EVENT_DRAG_START_X = 20;
                const EVENT_DRAG_START_Y = 24;

                const HORIZONTAL_DRAG_DISTANCE = 80;

                // we pushed the first number
                boardStateStore.dispatch(
                    dragStart(
                        {
                            number: NUMBER,
                            eventDragStartX: EVENT_DRAG_START_X,
                            eventDragStartY: EVENT_DRAG_START_Y,
                        }
                    )
                );

                // drag number 1 to the right and it should push number 2
                boardStateStore.dispatch(
                    dragMove(
                        {
                            number: NUMBER,
                            x: EVENT_DRAG_START_X + HORIZONTAL_DRAG_DISTANCE,
                            y: EVENT_DRAG_START_Y
                        }
                    )
                );

                const newState = boardStateStore.getState();

                const tileDataForNumber2AfterAction = newState[BOARD_STATE_KEY.TILE_DATA][PUSHED_NUMBER];

                expect(tileDataForNumber2AfterAction[TILE_STATE_KEYS.X]).toBe(INITIAL_X_VALUE_FOR_NUMBER_2 + HORIZONTAL_DRAG_DISTANCE);


            }
        );

        it('should return to the previous state when undo is called after dragMove has been called and should return to the state afterwards when redo is called',
            function () {
                const boardStateStore = createStore(boardStateReducer);

                const NUMBER_OF_COLUMNS = 3;
                const NUMBER_OF_ROWS = 2;

                const boardModel = [
                    [1, 2, 0],
                    [3, 5, 4]
                ];

                const TILE_SIZE = 100;

                const NUMBER = "1";

                const PUSHED_NUMBER = "2";

                boardStateStore.dispatch(
                    populateBoardStateData(
                        {
                            boardModel,
                            tileSize: TILE_SIZE,
                            numberOfColumns: NUMBER_OF_COLUMNS,
                            numberOfRows: NUMBER_OF_ROWS
                        }
                    )
                );

                const oldState = boardStateStore.getState();

                const tileDataForNumber2BeforeAction = oldState[BOARD_STATE_KEY.TILE_DATA][PUSHED_NUMBER];

                const INITIAL_X_VALUE_FOR_NUMBER_2 = 100;

                expect(tileDataForNumber2BeforeAction[TILE_STATE_KEYS.X]).toBe(INITIAL_X_VALUE_FOR_NUMBER_2);
                expect(tileDataForNumber2BeforeAction[TILE_STATE_KEYS.Y]).toBe(0);

                const EVENT_DRAG_START_X = 20;
                const EVENT_DRAG_START_Y = 24;

                const HORIZONTAL_DRAG_DISTANCE = 80;

                // we pushed the first number
                boardStateStore.dispatch(
                    dragStart(
                        {
                            number: NUMBER,
                            eventDragStartX: EVENT_DRAG_START_X,
                            eventDragStartY: EVENT_DRAG_START_Y,
                        }
                    )
                );

                // drag number 1 to the right and it should push number 2
                boardStateStore.dispatch(
                    dragMove(
                        {
                            number: NUMBER,
                            x: EVENT_DRAG_START_X + HORIZONTAL_DRAG_DISTANCE,
                            y: EVENT_DRAG_START_Y
                        }
                    )
                );

                const newState = boardStateStore.getState();

                const tileDataForNumber2AfterAction = newState[BOARD_STATE_KEY.TILE_DATA][PUSHED_NUMBER];

                expect(tileDataForNumber2AfterAction[TILE_STATE_KEYS.X]).toBe(INITIAL_X_VALUE_FOR_NUMBER_2 + HORIZONTAL_DRAG_DISTANCE);

                boardStateStore.dispatch( undo() );

                const yetAnotherState = boardStateStore.getState();

                // reference equality with the first state because we are using immutable data
                expect(yetAnotherState).toBe(oldState);

                const tileDataForNumber2AfterUndo = yetAnotherState[BOARD_STATE_KEY.TILE_DATA][PUSHED_NUMBER];

                expect(tileDataForNumber2AfterUndo[TILE_STATE_KEYS.X]).toBe(INITIAL_X_VALUE_FOR_NUMBER_2);

                boardStateStore.dispatch( redo() );

                const yetAnotherAnotherState = boardStateStore.getState();

                // reference equality with the second state because we we are using immutable data
                expect(yetAnotherAnotherState).toBe(newState);

                const tileDataForNumber2AfterRedo = yetAnotherAnotherState[BOARD_STATE_KEY.TILE_DATA][PUSHED_NUMBER];

                expect(tileDataForNumber2AfterRedo[TILE_STATE_KEYS.X]).toBe(INITIAL_X_VALUE_FOR_NUMBER_2 + HORIZONTAL_DRAG_DISTANCE);

            }
        );
    }
);
