const TilePuzzle = require('./TilePuzzle');

const $ = require('jquery');

const createBoard = require('./state/boardState/utils/createBoard');

/**
 * Wrapper containing an instance of the Tile Puzzle App
 * Allows the Tile Puzzle App to destroyed and recreated
 * @param numberOfColumns
 * @param numberOfRows
 * @param tileSize - length of a side of a tile
 * @constructor
 */
const PuzzleContainer = function (params) {
    const {
        numberOfColumns,
        numberOfRows,
        tileSize,
        optimizeRendering
    } = params;

    this.$tileContainer = $('<div class=tileContainer/></div>');

    /** Create a randomized board in the form Array<Array<number>> */
    const boardModel = createBoard(numberOfColumns, numberOfRows);

    this.tilePuzzle = new TilePuzzle(
        {
            boardModel,
            tileSize,
            optimizeRendering
        }
    );

    $('.container').append(this.$tileContainer);

    this.$tileContainer.append(this.tilePuzzle.getView());

    this.startAnimating();
};

/**
 * Starts animation
 * @impure
 * @return undefined
 */
PuzzleContainer.prototype.startAnimating = function () {
    const self = this;

    this.animate = true;

    requestAnimationFrame(animate);

    function animate() {
        if (self.animate) {
            self.tilePuzzle.render();

            requestAnimationFrame(animate);
        }
    }
};

/**
 * fire the undo action on the puzzle
 * @impure
 */
PuzzleContainer.prototype.undo = function () {
    this.tilePuzzle.undo();
};

/**
 * fire the redo action on the puzzle
 * @impure
 */
PuzzleContainer.prototype.redo = function () {
    this.tilePuzzle.redo();
};

module.exports = PuzzleContainer;
