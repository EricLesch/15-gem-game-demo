const TILE_STATE_KEYS = require("../../keys/tileStateKeys");

/**
 * Returns the min and max X and Y values of a passed rectangle
 * @pure
 * @param rectangle
 * @returns {{number: *, minY: *, minX: *, maxY: *, maxX: *}}
 */
function getMinMaxXandYForRect(rectangle) {
    return {
        number: rectangle[TILE_STATE_KEYS.NUMBER],
        minX: rectangle[TILE_STATE_KEYS.X],
        minY: rectangle[TILE_STATE_KEYS.Y],
        maxX: rectangle[TILE_STATE_KEYS.X] + rectangle[TILE_STATE_KEYS.WIDTH],
        maxY: rectangle[TILE_STATE_KEYS.Y] + rectangle[TILE_STATE_KEYS.HEIGHT]
    };
}

module.exports = getMinMaxXandYForRect;
