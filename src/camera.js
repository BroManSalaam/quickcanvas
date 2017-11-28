let Camera = {

    zoom: 1.0,
    x: 0,
    y: 0,

    xbias: 0,
    ybias: 0,

    oldzoom: 1.0,

    move: (x, y) => {
        Camera.x = x - Camera.xbias;
        Camera.y = y - Camera.ybias;
    },

    translate: (xd, yd) => {
        Camera.x += xd;
        Camera.y += yd;
    },

    zoom: (percent) => {
        ctx.scale(percent, percent);

        /*
        scaling canvas higher offcenters the camera to the top left
        smaller to the bottom right

        so if the canvas is smaller, we want to add more bias to it to shift it back towards the origin vice versa for larger 

        2 - 4.5
        1.75 - 5.5
        1.5 - 6.5
        1.25 - 10
        .75 - 5.5
        .5 - 2
        .25 - .75
        .125 - .3

        */

        let scale = 2;
        
        if (percent < 1.0) {
            Camera.xbias = $(window).width() / scale;
            Camera.ybias = $(window).height() / scale;
        } else {
            Camera.xbias = -$(window).width() / scale;
            Camera.ybias = -$(window).height() / scale;
        }
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