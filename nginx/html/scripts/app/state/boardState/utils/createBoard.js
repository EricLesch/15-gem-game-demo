const _ = require('lodash');

const createArrayOfNumbers = require('./createArrayOfNumbers');

/**
 * creates an array or arrays of randomized numbers between 0 and ((numberOfColumns * numberOrRows) - 1)
 * e.g. createBoard(2, 2) would return something like
 * [
 *   [2, 1],
 *   [0, 3]
 * ]
 * @impure
 * @param numberOfColumns
 * @param numberOrRows
 * @returns {Array<number>}
 */
function createBoard(numberOfColumns, numberOrRows) {
    let listOfNumbers = createArrayOfNumbers(numberOfColumns, numberOrRows); // calls an impure function here

    return _.range(1, numberOrRows + 1).map(
        () => {
            return _.range(1, numberOfColumns + 1).map(
                () => {
                    const first = listOfNumbers[0];
                    listOfNumbers = listOfNumbers.slice(1);
                    return first;
                }
            );
        }
    );
}

module.exports = createBoard;
