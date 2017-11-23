let Camera = {

    zoom: 1.0,
    x: 0,
    y: 0,

    xbias : 0,
    ybias : 0,

    oldscale : 1.0,

    move: (x, y) => {
        Camera.x = x + Camera.xbias;
        Camera.y = y + Camera.ybias;
    },

    translate: (xd, yd) => {
        Camera.x += xd;
        Camera.y += yd;
    },

    zoom: function(percent, w, h) {
        ctx.scale(percent, percent);
        let change = percent - Camera.oldscale;
        console.log(change);
        Camera.xbias = w * change;
        Camera.ybias = h * change;
    }
};

/**
 * to draw
 *  object.x - Camera.x
 *  object.y - Camera.y
 * 
 * this moves everything drawn onto the canvas back according on the camera position
 * this works for negative coordinates as well
 * 
 */