const _ = require('lodash');
const PIXI = require('pixi.js');

const Tile = require('./Tile');

const {createStore} = require('redux');

const boardStateReducer = require('./state/boardState/boardStateReducer');

const populateBoardStateData = require('./state/boardState/actionCreators/populateBoardStateData');

const undo = require('./state/boardState/actionCreators/undo');
const redo = require('./state/boardState/actionCreators/redo');


/**
 * Takes the board model and instantiates all tiles for the given model
 * @impure
 * @param boardModel - model of the board expressed as Array<Array<number>>
 * @param boardStateStore - redux store of the board state
 * @param tileSize - the length of one side of a tile
 * @returns {Array<Tile>}
 */
function getTilesArrayFromBoardModel(boardModel, boardStateStore, tileSize) {
    const boardOfTiles = boardModel.map(
                (rowArray) => rowArray.map(
                    (number) => {
                        if (number !== 0) {
                            return new Tile( { number, boardStateStore, tileSize } );
                        } else {
                            return false;
                        }
                    }
                )
            );

    const arrayOfTiles = _.flatMap(boardOfTiles);

    // _.compact gets rid of the false value in the array
    return _.compact(arrayOfTiles);
}

/**
 * TilePuzzle - container object for the board of tiles
 * @impure
 * @param boardModel - model of the board expressed as Array<Array<number>>
 * @params - tileSize - the length of one side of a tile
 * @params - optimizeRendering - should we minimize redrawing by calling shouldComponentUpdate on each Tile?
 * @constructor
 */
function TilePuzzle(params) {
    const {
        boardModel,
        tileSize,
        optimizeRendering
    } = params;

    /** should we minimize redrawing by calling shouldComponentUpdate on each Tile? */
    this.optimizeRendering = optimizeRendering;

    /** WebGL rendering on different browsers & OS's is imprecise and will sometimes hide the lines in
     * between tiles. We are forcing PIXI to use Canvas so the demo doesn't look like poo poo */
    this.app = new PIXI.Application(
        {
            width: boardModel[0].length * tileSize,
            height: boardModel.length * tileSize,
            forceCanvas: true,
            backgroundColor: 0xFFFFFF
        }
    );

    /** Make a store to hold application state */
    this.boardStateStore = createStore(boardStateReducer);


    /** populate the boardStateStore with the data **/
    this.boardStateStore.dispatch(
        populateBoardStateData(
            {
                boardModel,
                tileSize: tileSize
            }
        )
    );

    /** Get an array of Tiles based on the board Model **/
    this.tiles = getTilesArrayFromBoardModel(boardModel, this.boardStateStore, tileSize);

    /** draw all the tiles and add them to the stage **/
    this.tiles.forEach(
         (tile) => {
            tile.draw();

            tile.graphics.forEach(
                (graphicsObject) => {
                    this.app.stage.addChild(graphicsObject);
                }
            );
        }
    );
}

/**
 * Returns the PIXI CanvasElement which needs to get appended to the DOM
 * @returns {HTMLCanvasElement}
 */
TilePuzzle.prototype.getView = function() {
    return this.app.view;
};

/**
 * Renders the tiles
 * @impure
 * @returns undefined
 */
TilePuzzle.prototype.render = function () {
    for (let i = 0, len = this.tiles.length; i < len; i++) {
        const currentTile = this.tiles[i];

        /** if optimizeRendering is enabled, then only rerender the objects whose state has changed **/
        if (!this.optimizeRendering || currentTile.shouldComponentUpdate()) {
            currentTile.draw();
        }
    }

    this.app.render(this.app.stage)
};

/**
 * Fires undo on the board state
 * @impure
 */
TilePuzzle.prototype.undo = function() {
   this.boardStateStore.dispatch(undo());
};

/**
 * Fires redo on the board state
 */
TilePuzzle.prototype.redo = function() {
    this.boardStateStore.dispatch(redo());
};

module.exports = TilePuzzle;
