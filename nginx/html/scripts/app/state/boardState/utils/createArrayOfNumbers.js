const _ = require('lodash');

const getRandomNumberWithMaximum = require('./getRandomNumberWithMaximum');

/**
 * Returns a single array of numbers that are randomized 0 to (numberOfColumns * numberOfRows) -1
 * e.g. createArrayOfNumbers(2, 2) would return something like [1, 2, 0, 3]
 * @impure
 * @param numberOfColumns
 * @param numberOfRows
 * @returns {Array<number>}
 */
function createArrayOfNumbers(numberOfColumns, numberOfRows) {
    const totalNumberOfSpaces = numberOfColumns * numberOfRows;

    let listOfNumbers = _.range(1, totalNumberOfSpaces);
    const blankSpaceIndex = getRandomNumberWithMaximum(totalNumberOfSpaces - 1); // calls impure function

    return _.range(0, totalNumberOfSpaces).map(
        currentIndex => {
            if (currentIndex === blankSpaceIndex) {
                return 0;
            } else {
                const randomNumberIndex = getRandomNumberWithMaximum(listOfNumbers.length); // calls impure function
                const nextNumber = listOfNumbers[randomNumberIndex];
                listOfNumbers.splice(randomNumberIndex, 1);
                return nextNumber;
            }
        }
    );
}

module.exports = createArrayOfNumbers;
