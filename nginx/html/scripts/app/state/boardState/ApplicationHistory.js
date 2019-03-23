/**
 * Container implementing undo and redo for application state
 * @constructor
 */
function ApplicationHistory() {
    this._undoStack = [];
    this._redoStack = [];
}

/**
 * Initialize the state of the application - mostly used for testing
 * @impure
 * @param initialState - must be an array of states
 * @return undefined
 */
ApplicationHistory.prototype.populateWithState = function (initialState) {
    this._undoStack = initialState;
};

/**
 * Returns the undostate stack - used for testing
 * @impure
 * @return {Array|*}
 */
ApplicationHistory.prototype.getStateStack = function () {
    return this._undoStack;
};

/**
 * Adds a new state to the undoStack - clears the redo stack
 * @impure
 * @param newState
 * @return undefined
 */
ApplicationHistory.prototype.pushState = function (newState) {
    this._redoStack = [];
    this._undoStack.push(newState);
};

/**
 * Calls undo and returns the previous state
 * @impure
 * @return {}- previous state or the first state on the stack if there is only object on the stack or undefined if
 * there is nothing in the history
 */
ApplicationHistory.prototype.undo = function () {
    let result;
    // nothing there
    if (this._undoStack.length === 0) {
        result = void 0;
    } else if (this._undoStack.length === 1) { // only one element
        result = this._undoStack[0];
    } else if (this._undoStack.length > 1) { // more than one element
        const lastState = this._undoStack.pop();
        this._redoStack.push(lastState);
        result = this._undoStack[this._undoStack.length - 1];
    }



    return result;
};

/**
 * Redo and returns a state which has previously been undone - returns undefined if there is nothing on the redo stack
 * @impure
 * @return {*} - redo state or undefined
 */
ApplicationHistory.prototype.redo = function () {
    let result;
    // nothing there
    if (this._redoStack.length === 0) {
        result = void 0;
    } else if (this._redoStack.length > 0) {
        result = this._redoStack.pop();
        this._undoStack.push(result);
    }

    return result;
};

module.exports = ApplicationHistory;
