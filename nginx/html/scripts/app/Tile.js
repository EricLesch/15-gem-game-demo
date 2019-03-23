const PIXI = require('pixi.js');

const dragMove = require('./state/boardState/actionCreators/dragMove');
const dragEnd = require('./state/boardState/actionCreators/dragEnd');
const dragStart = require('./state/boardState/actionCreators/dragStart');

const TILE_STATE_KEYS = require('./state/boardState/keys/tileStateKeys');
const BOARD_STATE_KEY = require('./state/boardState/keys/boardStateKey');

/**
 * Grabs the coordinate from the event
 * @pure
 * @param event - PIXI.js event
 * @returns {{x: number, y: number}}
 */
function getPointFromEvent(event) {
    return {
        x: event.data.originalEvent.clientX,
        y: event.data.originalEvent.clientY
    };
}

/**
 * Grabs the state for this tile
 * @pure
 * @param boardStateStore - redux store for boardState
 * @param number - number (id) of the Tile
 * @returns TileData
 */
function getTileDataForNumber(boardStateStore, number) {
    const newState = boardStateStore.getState();

    return newState[BOARD_STATE_KEY.TILE_DATA][number];
}

/**
 * Represents a Tile on the board
 * @impure
 * @param number - number(id) of the object
 * @param boardStateStore - redux store for boardState
 * @param tileSize - length of a side of a tile
 * @constructor
 */
function Tile(params) {
    const {
        number,
        boardStateStore,
        tileSize
    } = params;

    /**
     * It would probably(?) be more efficient to instantiate a single PIXI.Graphics object to use across all tile
     * instances for rendering instead of using one for each Tile but that would make event handling more complicated
     * and more difficult to read so I'm not going to do that for this exercise
     */
    this.rectangle = new PIXI.Graphics();

    this.boardStateStore = boardStateStore;

    /** Rectangle should detect mouse events */
    this.rectangle.interactive = true;

    this._textStyle = {
        fontFamily: 'Arial, Helvetica Neue, Helvetica, sans-serif',
        fontSize: Math.floor(tileSize * 0.3),
        fill: 0xFFFFFF,
        align: 'center'
    };

    this.text = new PIXI.Text(number, this._textStyle);

    /** Need to get the text dimensions for text centering */
    this.textBoundingRect = this.text.getBounds(true);

    /** Convert the number to a string so it can be used for lookup in the boardState store*/
    this.number = number + '';

    /** Graphics */
    this.graphics = [this.rectangle, this.text];

    /** Bind methods so *this* keyword works **/
    this._onDragStart = this._onDragStart.bind(this);
    this._onDragEnd = this._onDragEnd.bind(this);
    this._onDragMove = this._onDragMove.bind(this);

    this.rectangle
        // events for drag start
        .on('mousedown', this._onDragStart)
        .on('touchstart', this._onDragStart)
        // events for drag end
        .on('mouseup', this._onDragEnd)
        .on('mouseupoutside', this._onDragEnd)
        .on('touchend', this._onDragEnd)
        .on('touchendoutside', this._onDragEnd)
        // events for drag move
        .on('mousemove', this._onDragMove)
        .on('touchmove', this._onDragMove);

    /** Store the last state so it can be compared to a new state when shouldComponentUpdate is called */
    this.lastState = getTileDataForNumber(this.boardStateStore, this.number);
}

/**
 * Checks whether or not the object needs to be rerendered - if the state of the object hasn't changed, we don't need
 * to rerender
 * @impure
 * @returns {boolean}
 */
Tile.prototype.shouldComponentUpdate = function () {
    const nextState = getTileDataForNumber(this.boardStateStore, this.number);
    /** We can check reference equality to see if the data has changed because the store is using immutable data **/
    if (this.lastState !== nextState) {
        this.lastState = nextState;
        return true;
    } else {
        return false;
    }
};

/**
 * Draws the triangle and updates the position of the text
 * @impure
 * @returns undefined
 */
Tile.prototype.draw = function () {
    const tileData = getTileDataForNumber(this.boardStateStore, this.number);

    /** logging whether or not this method was called for performance demonstration purposes */
    console.log(`Rendering ${this.number}`);

    const x = tileData[TILE_STATE_KEYS.X];
    const y = tileData[TILE_STATE_KEYS.Y];
    const width = tileData[TILE_STATE_KEYS.WIDTH];
    const height = tileData[TILE_STATE_KEYS.HEIGHT];

    this.rectangle.clear();
    this.rectangle.lineStyle(1, 0xc0c0c0, 1);
    this.rectangle.beginFill(0x114262);
    this.rectangle.drawRect(x, y, width, height);
    this.rectangle.endFill();

    // make sure the text is centered
    this.text.x = x + (width / 2) - (this.textBoundingRect.width / 2);
    this.text.y = y + (height / 2) - (this.textBoundingRect.height / 2);
};

/**
 * Fired on mousedown or touchstart - sends the point information to the boardStateStore
 * @impure
 * @param event - PIXI.js event
 * @private
 */
Tile.prototype._onDragStart = function (event) {
    const point = getPointFromEvent(event);

    this.boardStateStore.dispatch(
        dragStart(
            {
                number: this.number,
                eventDragStartX: point.x,
                eventDragStartY: point.y
            }
        )
    );
};


/**
 * Fired on mouseup or touchend - notifies the boardStateStore
 * @impure
 * @private
 */
Tile.prototype._onDragEnd = function () {
    this.boardStateStore.dispatch(
        dragEnd(
            {
                number: this.number
            }
        )
    );
};

/**
 * Fired on mousemove - notifies the boardStateStore
 * @impure
 * @param event - PIXI.js event
 * @private
 */
Tile.prototype._onDragMove = function (event) {
    const point = getPointFromEvent(event);

    this.boardStateStore.dispatch(
        dragMove(
            {
                number: this.number,
                x: point.x,
                y: point.y
            }
        )
    );
};

module.exports = Tile;
