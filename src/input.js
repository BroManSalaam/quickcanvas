function bindInputHandler() {

    document.onkeydown = function (c) {

        if (c.keyCode == 37) {
            player.isLeft = true;
        }
        if (c.keyCode == 38) {
            player.isUp = true;
        }
        if (c.keyCode == 39) {
            player.isRight = true;
        }
        if (c.keyCode == 40) {
            player.isDown = true;
        }
    }

    document.onkeyup = function (c) {

        if (c.keyCode == 37) {
            player.isLeft = false;
        }
        if (c.keyCode == 38) {
            player.isUp = false;
        }
        if (c.keyCode == 39) {
            player.isRight = false;
        }
        if (c.keyCode == 40) {
            player.isDown = false;
        }
    }
}