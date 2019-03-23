/**
 * Returns a random number in between 0 and x, not including X
 * e.g. getRandomNumberWithMaximum(10) would return a number between 0 and 9
 * @impure
 * @param x - upper bound
 * @returns {number}
 */
function getRandomNumberWithMaximum(x) {
    return Math.floor(Math.random() * x);
}

module.exports = getRandomNumberWithMaximum;
