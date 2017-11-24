/**
 * simple api for drawing to the canvas while maintaining aspect ratio and positioning with the camera
 */

let Renderer = {

    /**
     * 
     * @param {*} img 
     * @param {*} sx 
     * @param {*} sy 
     * @param {*} sw 
     * @param {*} sh 
     * @param {*} dx 
     * @param {*} dy 
     * @param {*} dw 
     * @param {*} dh 
     */
    drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh) {
        ctx.drawImage(img, sx, sy, sw, sh, dx - Camera.x, dy - Camera.y, dw, dh);
    },

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     */
    fillRect(x, y, w, h) {
        ctx.fillRect(x - Camera.x, y - Camera.y, w, h);
    },

    /**
     * 
     * @param {*} box 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     */
    fillBoxRect(box, x, y, w, h) {
        ctx.fillRect(x - Camera.x - box.width / 2, y - Camera.y - box.height / 2, w, h);
    },

    /**
     * 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     */
    rect(x, y, w, h) {
        ctx.strokeRect(x - Camera.x, y - Camera.y, w, h);
    },

    /**
     * 
     * @param {*} text 
     * @param {*} x 
     * @param {*} y 
     * @param {*} mw 
     */
    fillText(text, x, y, mw) {
        ctx.fillText(text, x - Camera.x, y - Camera.y, mw);
    },

    /**
     * 
     * @param {*} text 
     * @param {*} x 
     * @param {*} y 
     */
    fillText(text, x, y) {
        ctx.fillText(text, x - Camera.x, y - Camera.y);
    },

    /**
     * 
     * @param {Image} img 
     * @param {p2.Box} box 
     * @param {Number} sx 
     * @param {Number} xy 
     * @param {Number} sw 
     * @param {Number} sh 
     * @param {Number} dx 
     * @param {Number} dy 
     * @param {Number} dw 
     * @param {Number} dh 
     * 
     * @description draw an image onto the canvas that has a box shape attached to the body
     * same function as drawImage, just with an extra shape parameter right after img
     */
    drawBoxImage(img, box, sx, xy, sw, sh, dx, dy, dw, dh) {
        ctx.drawImage(img, sx, xy, sw, sh, (dx - Camera.x - box.width / 2), (dy - Camera.y - box.height / 2), dw, dh);
    },

    /**
     * 
     * @param {*} box 
     * @param {*} x 
     * @param {*} y 
     * @param {*} w 
     * @param {*} h 
     */
    drawShapeBoundingBox(box, x, y, w, h) {
        ctx.strokeStyle = 'green';
        ctx.strokeRect((x - Camera.x - box.width / 2), (y - Camera.y - box.height / 2), w, h);
    },


    /**
     * TODO fIX THIS
     * @param {*} font 
     * @param {*} box 
     * @param {*} x 
     * @param {*} y 
     * 
     * @description draw the xy coordinates slightly above the top left hand corner of a box
     * drawn in (x, y) format
     */
    drawPositionBox(font, box, x, y) {
        ctx.font = font;
        ctx.fillText("(" + (x - Camera.x - box.width / 2) + ", " + (y - Camera.y - box.height / 2) + ")",
            x - Camera.x - box.width / 2, y - Camera.y - box.height / 2);
    }

};