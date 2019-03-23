const _ = require("lodash");

const MODE = require('../scripts/app/state/boardState/enums/mode');
const TILE_STATE_KEYS = require('../scripts/app/state/boardState/keys/tileStateKeys');

const createTileState = require('../scripts/app/state/boardState/utils/createTileState');
const getMaxPointForRectangle = require('../scripts/app/state/boardState/utils/getMaxPointForRectangle');
const getRandomNumberWithMaximum = require('../scripts/app/state/boardState/utils/getRandomNumberWithMaximum');
const createBoard = require('../scripts/app/state/boardState/utils/createBoard');
const createArrayOfNumbers = require('../scripts/app/state/boardState/utils/createArrayOfNumbers');
const doRectanglesIntersect = require('../scripts/app/state/boardState/utils/doRectanglesIntersect');
const getRectanglesInFrontOfRectangle = require('../scripts/app/state/boardState/utils/dragMoveUtils/getRectanglesInFrontOfRectangle');
const getSmallestDistanceBetweenRectAndRectanglesInFront = require('../scripts/app/state/boardState/utils/dragMoveUtils/getSmallestDistanceBetweenRectAndRectanglesInFront');
const getRectanglesThatRectangleIntersectsWith = require('../scripts/app/state/boardState/utils/dragMoveUtils/getRectanglesThatRectangleIntersectsWith');

const getWhichRectanglesNeedToMoveAndHowFar = require('../scripts/app/state/boardState/utils/dragMoveUtils/getWhichRectanglesNeedToMoveAndHowFar');

function compareArraysForValueEquality(array1, array2) {
    return JSON.stringify(array1.sort()) === JSON.stringify(array2.sort());
}

describe('getRandomNumberWithMaximum(max)',
    function () {
        it("should return numbers in a range of 0 to 9 when passed 10 as a parameter ",
            function () {
                const testArray = _.times(1000, () => getRandomNumberWithMaximum(10));

                // make sure that the getRandomNumberWithMaximum function returns possible numbers 0 to 9 inclusive
                _.range(0, 10).forEach(
                    (num) => {
                        expect(_.includes(testArray, num)).toBe(true);
                    }
                );
            }
        );
    }
);

describe('createArrayOfNumbers(width, height)',
    function () {
        it('should create an array of 16 numbers(0 to 15) when passed width of 4 and a height of 4',
            function () {

                // test 100 times to make sure the results are always correct
                _.times(100, () => {
                        const randomizedArrayOfNumbers = createArrayOfNumbers(4, 4);

                        expect(randomizedArrayOfNumbers.length).toBe(16);

                        _.range(0, 16).forEach(
                            (num) => {
                                expect(_.includes(randomizedArrayOfNumbers, num)).toBe(true);
                            }
                        );
                    }
                );
            }
        );

    }
);

describe('createBoard(width, height)',
    function () {
        it('should create an array of arrays with 4 rows and 5 columns when passed a width of 5 and a height of 4, populated with random numbers',
            function () {
                const board = createBoard(5, 4);

                expect(board.length).toBe(4);
                expect(board[0].length).toBe(5);
            }
        );
    }
);

describe('createTileState(boardModel, tileSize)',
    function () {
        it('should create a tile data model when passed a boardModel',
            function () {
                const NUMBER_OF_COLUMNS = 2;
                const NUMBER_OF_ROWS = 2;

                const boardModel = createBoard(NUMBER_OF_COLUMNS, NUMBER_OF_ROWS);

                const tileStateMap = createTileState(boardModel, 100);

                const tileStateMapKeysArray = Object.keys(tileStateMap);

                _.range(1, 4).forEach(
                    (number) => {
                        // make sure all the keys are correct
                        expect(_.includes(tileStateMapKeysArray, number + '')).toBe(true);
                    }
                );

                const tileStateKeysArray = Object.keys(TILE_STATE_KEYS);

                _.each(
                    tileStateMap,
                    (tileState) => {
                        // make sure all the keys are present
                        tileStateKeysArray.forEach(
                            (tileStateKey) => {
                                expect(tileState[tileStateKey] !== void 0).toBe(true);
                            }
                        )
                    }
                );
            }
        )
    }
);

describe('getMaxPointForRectangle({x, y, height, width})',
    function () {
        it('should return the maxpoint {x: maxX, y, maxY} for a rectangle with the given x, y, width, and height dimensions',
            function () {
                const maxPoint = getMaxPointForRectangle(
                    {
                        x: 10,
                        y: 20,
                        height: 100,
                        width: 100
                    }
                );

                expect(maxPoint.x).toBe(110);
                expect(maxPoint.y).toBe(120);

            }
        );
    }
);

describe('doRectanglesIntersect(rect1, rect2)',
    function () {
        it('should return true if the rectangles intersect',
            function () {
                const rect1 = {
                    minX: 10,
                    minY: 20,
                    maxX: 110,
                    maxY: 120
                };

                const rect2 = {
                    minX: 109,
                    minY: 119,
                    maxX: 209,
                    maxY: 219
                };

                expect(doRectanglesIntersect(rect1, rect2)).toBe(true);

                expect(doRectanglesIntersect(rect2, rect1)).toBe(true);
            }
        );

        it('should return false if the rectangles do not intersect',
            function () {
                const rect1 = {
                    minX: 10,
                    minY: 20,
                    maxX: 110,
                    maxY: 120
                };

                const rect2 = {
                    minX: 111,
                    minY: 119,
                    maxX: 209,
                    maxY: 219
                };

                expect(doRectanglesIntersect(rect1, rect2)).toBe(false);

                expect(doRectanglesIntersect(rect2, rect1)).toBe(false);
            }
        );

    }
);

describe('getTilesInFrontOfTile(tileState)',
    function () {
        it('should return the numbers directly in front of it',
            function () {
                const tileSize = 100;

                const boardModel = [
                    [1, 0, 2, 6],
                    [3, 5, 7, 4],
                    [8, 9, 10, 11],
                    [12, 13, 14, 15]
                ];

                const tileStateMap = createTileState(boardModel, tileSize);

                const tileStateArray = _.map(tileStateMap, (tileState => tileState));

                const tilesInFrontOfTile = getRectanglesInFrontOfRectangle(3, tileStateArray, tileSize, MODE.FORWARD, TILE_STATE_KEYS.X);

                const tileNumbersInFrontOfTile = tilesInFrontOfTile.map((tile) => tile[TILE_STATE_KEYS.NUMBER]);

                expect(compareArraysForValueEquality(tileNumbersInFrontOfTile, [5, 7, 4])).toBe(true)
            }
        );


        it('should return the numbers directly in front of it when there is a blank space',
            function () {
                const tileSize = 100;

                const boardModel = [
                    [1, 0, 2, 6],
                    [3, 5, 7, 4],
                    [8, 9, 10, 11],
                    [12, 13, 14, 15]
                ];

                const tileStateMap = createTileState(boardModel, tileSize);

                const tileStateArray = _.map(tileStateMap, (tileState => tileState));

                const tilesInFrontOfTile = getRectanglesInFrontOfRectangle(1, tileStateArray, tileSize, MODE.FORWARD, TILE_STATE_KEYS.X);

                const tileNumbersInFrontOfTile = tilesInFrontOfTile.map((tile) => tile[TILE_STATE_KEYS.NUMBER]);

                expect(compareArraysForValueEquality(tileNumbersInFrontOfTile, [2, 6])).toBe(true)
            }
        );

        it('should return numbers that are slightly ahead of it',
            function () {

                const bunchOfRectangles = [
                    {
                        NUMBER: 1,
                        X: 100,
                        Y: 100,
                        WIDTH: 100,
                        HEIGHT: 100,
                        IS_DRAGGING: false,
                        EVENT_DRAG_START_X: null,
                        EVENT_DRAG_START_Y: null,
                        RECTANGLE_STARTING_DRAG_X: null,
                        RECTANGLE_STARTING_DRAG_Y: null,
                        POSITION_COLUMN: 0,
                        POSITION_ROW: 0
                    },
                    {
                        NUMBER: 2,
                        X: 200,
                        Y: 1,
                        WIDTH: 100,
                        HEIGHT: 100,
                        IS_DRAGGING: false,
                        EVENT_DRAG_START_X: null,
                        EVENT_DRAG_START_Y: null,
                        RECTANGLE_STARTING_DRAG_X: null,
                        RECTANGLE_STARTING_DRAG_Y: null,
                        POSITION_COLUMN: 2,
                        POSITION_ROW: 0
                    },
                    {
                        NUMBER: 3,
                        X: 200,
                        Y: 199,
                        WIDTH: 100,
                        HEIGHT: 100,
                        IS_DRAGGING: false,
                        EVENT_DRAG_START_X: null,
                        EVENT_DRAG_START_Y: null,
                        RECTANGLE_STARTING_DRAG_X: null,
                        RECTANGLE_STARTING_DRAG_Y: null,
                        POSITION_COLUMN: 0,
                        POSITION_ROW: 1
                    },
                    {
                        NUMBER: 4,
                        X: 300,
                        Y: 0,
                        WIDTH: 100,
                        HEIGHT: 100,
                        IS_DRAGGING: false,
                        EVENT_DRAG_START_X: null,
                        EVENT_DRAG_START_Y: null,
                        RECTANGLE_STARTING_DRAG_X: null,
                        RECTANGLE_STARTING_DRAG_Y: null,
                        POSITION_COLUMN: 3,
                        POSITION_ROW: 1
                    },
                    {
                        NUMBER: 5,
                        X: 300,
                        Y: 100,
                        WIDTH: 100,
                        HEIGHT: 100,
                        IS_DRAGGING: false,
                        EVENT_DRAG_START_X: null,
                        EVENT_DRAG_START_Y: null,
                        RECTANGLE_STARTING_DRAG_X: null,
                        RECTANGLE_STARTING_DRAG_Y: null,
                        POSITION_COLUMN: 1,
                        POSITION_ROW: 1
                    },
                    {
                        NUMBER: 6,
                        X: 300,
                        Y: 200,
                        WIDTH: 100,
                        HEIGHT: 100,
                        IS_DRAGGING: false,
                        EVENT_DRAG_START_X: null,
                        EVENT_DRAG_START_Y: null,
                        RECTANGLE_STARTING_DRAG_X: null,
                        RECTANGLE_STARTING_DRAG_Y: null,
                        POSITION_COLUMN: 3,
                        POSITION_ROW: 0
                    },
                    {
                        NUMBER: 7,
                        X: 400,
                        Y: 100,
                        WIDTH: 100,
                        HEIGHT: 100,
                        IS_DRAGGING: false,
                        EVENT_DRAG_START_X: null,
                        EVENT_DRAG_START_Y: null,
                        RECTANGLE_STARTING_DRAG_X: null,
                        RECTANGLE_STARTING_DRAG_Y: null,
                        POSITION_COLUMN: 2,
                        POSITION_ROW: 1
                    }
                ];

                const tilesInFrontOfTile = getRectanglesInFrontOfRectangle(1, bunchOfRectangles, 100, MODE.FORWARD, TILE_STATE_KEYS.X);

                const tileNumbersInFrontOfTile = tilesInFrontOfTile.map((tile) => tile[TILE_STATE_KEYS.NUMBER]);

                expect(compareArraysForValueEquality(tileNumbersInFrontOfTile, [2, 3, 5, 7])).toBe(true);
            }
        )
    }
);

describe('getRectanglesThatRectangleIntersectsWith(rect, rectangles) ',
    function () {

        it('should match rectangles when they intersect but not when they touch',
            function () {
                const rect = {
                    NUMBER: 7,
                    X: 400,
                    Y: 100,
                    WIDTH: 100,
                    HEIGHT: 100,
                };

                const bunchOfRectangles = [
                    {
                        NUMBER: 1,
                        X: 100,
                        Y: 100,
                        WIDTH: 100,
                        HEIGHT: 100
                    },
                    {
                        NUMBER: 2,
                        X: 200,
                        Y: 1,
                        WIDTH: 100,
                        HEIGHT: 100
                    },
                    {
                        NUMBER: 3,
                        X: 200,
                        Y: 199,
                        WIDTH: 100,
                        HEIGHT: 100
                    },
                    {
                        NUMBER: 4,
                        X: 300,
                        Y: 0,
                        WIDTH: 100,
                        HEIGHT: 100
                    },
                    {
                        NUMBER: 5,
                        X: 300,
                        Y: 100,
                        WIDTH: 100,
                        HEIGHT: 100
                    },
                    {
                        NUMBER: 6,
                        X: 301,
                        Y: 199,
                        WIDTH: 100,
                        HEIGHT: 100
                    },
                    {
                        NUMBER: 7,
                        X: 400,
                        Y: 100,
                        WIDTH: 100,
                        HEIGHT: 100
                    }
                ];

                const rectanglesRectIntersectsWith = getRectanglesThatRectangleIntersectsWith(rect, bunchOfRectangles);

                const numbersThatMatch = rectanglesRectIntersectsWith.map((rect) => rect.number);

                expect(compareArraysForValueEquality(numbersThatMatch, [6, 7])).toBe(true);
            }
        );

        describe('getSmallestDistanceBetweenRectAndRectanglesInFront(rectangles, rectanglesToCompare)',
            function () {
                it('should return the shortest distance on the x axis', function () {
                        const testRectangle = {
                            number: 1,
                            minX: 100,
                            minY: 100,
                            maxX: 200,
                            maxY: 200
                        };

                        const stuffToTest = [
                            {

                                // 1st one is 3 away
                                number: 2,
                                minX: 203,
                                minY: 1,
                                maxX: 303,
                                maxY: 101
                            },
                            {
                                //2nd one is 1 away
                                number: 3,
                                minX: 201,
                                minY: 199,
                                maxX: 301,
                                maxY: 299
                            }
                        ];

                        const {
                            smallestDistance,
                            nextRectangleGettingPushedMinMax
                        } = getSmallestDistanceBetweenRectAndRectanglesInFront(testRectangle, stuffToTest, MODE.FORWARD, TILE_STATE_KEYS.X);

                        expect(smallestDistance).toBe(1);

                        expect(nextRectangleGettingPushedMinMax.number).toBe(3)
                    }
                );
            }
        );
    }
);

describe('getWhichRectanglesNeedToMoveAndHowFar(dragMoveInfo, tileData, boardDimensions)',
    function () {
        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile being moved has enough space in front of it and no wall in front of it, it should move freely`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 3,
                    numberOfRows: 3,
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 100,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 0,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            },
                        '3':
                            {
                                NUMBER: 3,
                                X: 100,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 1
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: 100,
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(1);

                expect(rectanglesNeedToMoveAndHowFar.acc[0].newX).toBe(200);
                expect(rectanglesNeedToMoveAndHowFar.acc[0].newY).toBe(0);
                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(100);

            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved and the wall is directly in front of it, it should not move`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 2, // wall should be at 200
                    numberOfRows: 3,
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 100,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 0,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            },
                        '3':
                            {
                                NUMBER: 3,
                                X: 100,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 1
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: 100,
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(0);

                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(0);

            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved and the space between the wall and the tiles is less than the amount that the
            tile wants to move, then the tile should be allowed to move up to the wall, but not beyond the wall`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 2, // wall should be at 200
                    numberOfRows: 3,
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 50, // right side of rectangle should be at 150
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 0,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            },
                        '3':
                            {
                                NUMBER: 3,
                                X: 100,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 1
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: 100, // trying to move 100 but can only move 50
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(1);

                expect(rectanglesNeedToMoveAndHowFar.acc[0].newX).toBe(100); // touches the wall on the right side at 200
                expect(rectanglesNeedToMoveAndHowFar.acc[0].newY).toBe(0);

                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(50);
            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved and there is a tile in front of it, but there is enough space in between the 
            tile and the next tile, it should move freely`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 3,
                    numberOfRows: 3,
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 50, // right side of rectangle should be at 150
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 200, // in front of tile 1 by 50
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            },
                        '3':
                            {
                                NUMBER: 3,
                                X: 100,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 1
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: 50, // trying to move 50 and should be able to move exactly 50 but no more
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(1);

                expect(rectanglesNeedToMoveAndHowFar.acc[0].newX).toBe(100); // touches the wall on the right side at 200
                expect(rectanglesNeedToMoveAndHowFar.acc[0].newY).toBe(0);

                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(50);
            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved and there is a tile in front of it, but there is not space in between the
            tile and the next tile, it should move up until it is touching the next rectangle`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 3,
                    numberOfRows: 3,
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 51, // right side of rectangle should be at 151
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 200, // in front of tile 1 by 49
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            },
                        '3':
                            {
                                NUMBER: 3,
                                X: 100,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 1
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: 50, // trying to move 50 and should be able to move 49
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(1);

                expect(rectanglesNeedToMoveAndHowFar.acc[0].newX).toBe(100); // touches the wall on the right side at 200
                expect(rectanglesNeedToMoveAndHowFar.acc[0].newY).toBe(0);

                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(49);
            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved and there is a tile in front of it, and there is a little space in between the
            tile and the next tile, and there is a little bit of space in between that tile and the wall, it should move freely`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 3,
                    numberOfRows: 3,
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 0, // right side of rectangle should be at 100
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 150, // in front of tile 1 by 50
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            },
                        '3':
                            {
                                NUMBER: 3,
                                X: 100,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 1
                            }
                    };

                // In this example we are trying to move 100 and which should be ok because there is 50 between tile 1 and 2,
                // and 50 between tile 2 and the wall
                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: 100,
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(2);

                const rectangle1 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 1]);
                const rectangle2 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 2]);

                expect(rectangle1.newX).toBe(100); // touches tile 2 on the right side at 200
                expect(rectangle1.newY).toBe(0);

                expect(rectangle2.newX).toBe(200); // touches the wall on the right side at 300
                expect(rectangle2.newY).toBe(0);


                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(100);
            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved and there are spaced tiles in front of it whose tiles are distanced apart and 
            the sum of their distance is equal to the amount the that the tile is trying to move, then the tile should
             move the whole distance`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 5,
                    numberOfRows: 3,
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 0, // right side of rectangle should be at 100
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 125, // in front of tile 1 by 25
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            },
                        '3':
                            {
                                NUMBER: 3,
                                X: 250, // in front of the tile 2 by 25
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 1
                            },
                        '4':
                            {
                                NUMBER: 4,
                                X: 375, // in front of the tile 3 by 25
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 1
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: 100,
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(4);

                const rectangle1 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 1]);
                const rectangle2 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 2]);

                const rectangle3 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 3]);
                const rectangle4 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 4]);

                expect(rectangle1.newX).toBe(100); // got pushed 100
                expect(rectangle1.newY).toBe(0);

                expect(rectangle2.newX).toBe(200); // got pushed 75
                expect(rectangle2.newY).toBe(0);

                expect(rectangle3.newX).toBe(300); // got pushed 50
                expect(rectangle2.newY).toBe(0);

                expect(rectangle4.newX).toBe(400); // got pushed 25
                expect(rectangle2.newY).toBe(0);


                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(100);
            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved and there are spaced tiles in front of it whose tiles are distanced apart and 
            the sum of their distance is equal to the amount the that the tile is trying to move, then the tile should
             move the whole distance`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 4,
                    numberOfRows: 3,
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 25, // right side of rectangle should be at 100
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 150, // in front of tile 1 by 25
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            },
                        '3':
                            {
                                NUMBER: 3,
                                X: 275, // in front of the tile 2 by 25
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 1
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: 100,
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(3);

                const rectangle1 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 1]);
                const rectangle2 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 2]);

                const rectangle3 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 3]);

                expect(rectangle1.newX).toBe(100); // got pushed 75
                expect(rectangle1.newY).toBe(0);

                expect(rectangle2.newX).toBe(200); // got pushed 50
                expect(rectangle2.newY).toBe(0);

                expect(rectangle3.newX).toBe(300); // got pushed 25
                expect(rectangle2.newY).toBe(0);

                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(75);
            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved and there are spaced tiles in front of it whose tiles are distanced apart and 
            the sum of their distance is less to the amount the that the tile is trying to move, then the tile should
             one the distance that is available`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 4,
                    numberOfRows: 3,
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 100,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 200,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            },
                        '3':
                            {
                                NUMBER: 3,
                                X: 300,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 1
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: 200,
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(0);

                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(0);
            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved to the left and there is a wall next to it`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 1,
                    numberOfRows: 1,
                    tileSize: 100
                };

                const tileData = {
                        '1':
                            {
                                NUMBER: 1,
                                X: 0,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: -10,
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(0);

                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(0);
            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved to the left and there is a wall next to it`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 2,
                    numberOfRows: 1,
                    tileSize: 100
                };

                const tileData = {
                        '1':
                            {
                                NUMBER: 1,
                                X: 10,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: -11,
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(1);

                const rectangle1 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 1]);

                expect(rectangle1.newX).toBe(0); // got pushed 75

                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(10);
            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved to the left and there is a wall next to it`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 2,
                    numberOfRows: 1,
                    tileSize: 100
                };

                const tileData = {
                        '1':
                            {
                                NUMBER: 1,
                                X: 10,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: -5,
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(1);

                const rectangle1 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 1]);

                expect(rectangle1.newX).toBe(5);

                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(5);
            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved and there are spaced tiles in front of it whose tiles are distanced apart and 
            the sum of their distance is less to the amount the that the tile is trying to move, then the tile should
             one the distance that is available`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 4,
                    numberOfRows: 3,
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 100,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 200,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 2,
                        xDifference: -50,
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(2);

                const rectangle1 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 1]);
                const rectangle2 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 2]);

                expect(rectangle1.newX).toBe(50); // got pushed 75
                expect(rectangle1.newY).toBe(0);
                expect(rectangle2.newX).toBe(150); // got pushed 50
                expect(rectangle2.newY).toBe(0);

                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(50);
            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved and there are spaced tiles in front of it whose tiles are distanced apart and 
            the sum of their distance is less to the amount the that the tile is trying to move, then the tile should
             one the distance that is available`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 4,
                    numberOfRows: 3,
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 25,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 150,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 2,
                        xDifference: -50,
                        yDifference: 0
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(2);

                const rectangle1 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 1]);
                const rectangle2 = _.find(rectanglesNeedToMoveAndHowFar.acc, ['number', 2]);

                expect(rectangle1.newX).toBe(0); // got pushed 25
                expect(rectangle1.newY).toBe(0);
                expect(rectangle2.newX).toBe(100); // got pushed 50
                expect(rectangle2.newY).toBe(0);

                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(50);
            }
        );

        /** ----------- y tests ----------- */
        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile being moved has enough space in front of it and no wall in front of it, it should move freely`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 3,
                    numberOfRows: 3,
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 0,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 100,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            },
                        '3':
                            {
                                NUMBER: 3,
                                X: 100,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 1
                            }
                    };

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: 0,
                        yDifference: 100
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(1);

                expect(rectanglesNeedToMoveAndHowFar.acc[0].newX).toBe(0);
                expect(rectanglesNeedToMoveAndHowFar.acc[0].newY).toBe(200);
                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(100);

            }
        );

        it(`should return an array of the tiles that need to change and the distance that they need to move
            - when a tile is being moved and the wall is directly in front of it, it should not move`,
            function () {

                const boardDimensions = {
                    numberOfColumns: 2,
                    numberOfRows: 2,// wall should be at 200
                    tileSize: 100
                };

                const tileData =
                    {
                        '1':
                            {
                                NUMBER: 1,
                                X: 0,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 0
                            },
                        '2':
                            {
                                NUMBER: 2,
                                X: 100,
                                Y: 0,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 0,
                                POSITION_ROW: 1
                            },
                        '3':
                            {
                                NUMBER: 3,
                                X: 100,
                                Y: 100,
                                WIDTH: 100,
                                HEIGHT: 100,
                                IS_DRAGGING: false,
                                EVENT_DRAG_START_X: null,
                                EVENT_DRAG_START_Y: null,
                                RECTANGLE_STARTING_DRAG_X: null,
                                RECTANGLE_STARTING_DRAG_Y: null,
                                POSITION_COLUMN: 1,
                                POSITION_ROW: 1
                            }
                    };

                    debugger;

                const rectanglesNeedToMoveAndHowFar = getWhichRectanglesNeedToMoveAndHowFar(
                    {
                        number: 1,
                        xDifference: 0,
                        yDifference: 100
                    },
                    tileData,
                    boardDimensions
                );

                expect(rectanglesNeedToMoveAndHowFar.acc.length).toBe(0);

                expect(rectanglesNeedToMoveAndHowFar.maximumAllowableMovement).toBe(0);

            }
        )
    }
);
