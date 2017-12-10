// return distance between two points
// function distance(x1, y1, x2, y2) {
//     return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
// }

function distance(x1, y1, x2, y2) {
    return Math.sqrt((Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)));
}

function angle(cx, cy, ex, ey) {
    var dy = ey - cy;
    var dx = ex - cx;
    var theta = Math.atan2(dy, dx); // range (-PI, PI]
    theta *= 180 / Math.PI; // rads to degs, range (-180, 180]
    return theta;
}

function degree(pos1, pos2) {
    var dy = pos2.x - pos1.x;
    var dx = pos2.y - pos1.y;
    var theta = Math.atan2(dy, dx);
    return theta *= 180 / Math.PI;
}

function angle360(cx, cy, ex, ey) {
    var theta = angle(cx, cy, ex, ey); // range (-180, 180]
    if (theta < 0) theta = 360 + theta; // range [0, 360)
    return theta;
}
