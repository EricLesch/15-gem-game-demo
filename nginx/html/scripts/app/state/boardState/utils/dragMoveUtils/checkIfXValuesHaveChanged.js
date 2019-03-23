const TILE_STATE_KEYS = require('../../keys/tileStateKeys');
/**
 * Checks to see if the xResults actually have any values that different that the values on the tileDataMap
 * @pure
 * @param xResults - the results from the x drag computations
 * @param tileDataMap - the existing values of the tileDataMap
 * @returns {boolean} - whether or not any of the x values are different
 */
function checkIfXValuesHaveChanged(xResults, tileDataMap) {
    let somethingHasChanged = false;
    if (xResults && xResults.acc && xResults.acc.length) {
        for (let i = 0; i < xResults.acc.length; i++) {
            let currentResult = xResults.acc[i];

            if(currentResult.newX !== tileDataMap[currentResult.number][TILE_STATE_KEYS.X]) {
                somethingHasChanged = true;
                break;
            }
        }
    }

    return somethingHasChanged;
}

module.exports = checkIfXValuesHaveChanged;