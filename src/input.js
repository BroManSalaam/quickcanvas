function bindInputHandler() {

	document.onkeydown = function(c) {

		if (c.keyCode == 65) {
			player.isLeft = true;
		}
		if (c.keyCode == 87) {
			player.isUp = true;
		}
		if (c.keyCode == 68) {
			player.isRight = true;
		}
		if (c.keyCode == 83) {
			player.isDown = true;
		}

		if (c.keyCode == 69) { // 69!!!! <- real mature seth
			player.shouldFollow = true;
		}

	}

	document.onkeyup = function(c) {

		if (c.keyCode == 65) {
			player.isLeft = false;
		}
		if (c.keyCode == 87) {
			player.isUp = false;
		}
		if (c.keyCode == 68) {
			player.isRight = false;
		}
		if (c.keyCode == 83) {
			player.isDown = false;
		}
		if (c.keyCode == 69) {
			player.shouldFollow = false;
		}
	}

	document.addEventListener('click', function(e) {
		player.bullet_isAdded = false;
		game.setClick(e.pageX, e.pageY);
	}, true);


	document.addEventListener('mousemove', function(e) {
		game.setMouseLocation(e.pageX, e.pageY);
	});
}