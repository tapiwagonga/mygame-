var upPressed = false;
var downPressed = false;
var leftPressed = false;
var rightPressed = false;
var lastPressed = false;
var timeout;
var bombInterval;
var lives = 3;
var isHit = false;
var gameStarted = false; 
function keyup(event) {
 // Check if the game has started
	if (!gameStarted) return;

	var player = document.getElementById('player');
	if (event.keyCode == 37) {
		leftPressed = false;
		lastPressed = 'left';
	}
	if (event.keyCode == 39) {
		rightPressed = false;
		lastPressed = 'right';
	}
	if (event.keyCode == 38) {
		upPressed = false;
		lastPressed = 'up';
	}
	if (event.keyCode == 40) {
		downPressed = false;
		lastPressed = 'down';
	}

	player.className = 'character stand ' + lastPressed;
}

function move() {
	// Check if the game has started
	if (!gameStarted) return;

	var player = document.getElementById('player');
	var positionLeft = player.offsetLeft;
	var positionTop = player.offsetTop;
	if (downPressed) {
		var newTop = positionTop + 1;
		var element = document.elementFromPoint(positionLeft, newTop + 46);
		player.className = 'character walk down';
		if (element.classList.contains('solid') == false) {
			player.style.top = newTop + 'px';
		}

		if (leftPressed == false && rightPressed == false) {
			player.className = 'character walk down';
		}
	}
	if (upPressed) {
		var newTop = positionTop - 1;
		player.className = 'character walk up';
		var element = document.elementFromPoint(positionLeft, newTop);

		if (element.classList.contains('solid') == false) {
			player.style.top = newTop + 'px';
		}

		if (leftPressed == false && rightPressed == false) {
			player.className = 'character walk up';
		}
	}
	if (leftPressed) {
		var newLeft = positionLeft - 1;
		player.className = 'character walk left';
		var element = document.elementFromPoint(newLeft, player.offsetTop);
		if (element.classList.contains('solid') == false) {
			player.style.left = newLeft + 'px';
		}
	}

	if (rightPressed) {
		player.className = 'character walk right';
		var newLeft = positionLeft + 1;
		var element = document.elementFromPoint(newLeft + 32, player.offsetTop);
		if (element.classList.contains('solid') == false) {
			player.style.left = newLeft + 'px';
		}
	}
}

function keydown(event) {
	// Check if the game has started
	if (!gameStarted) return;

	if (event.keyCode == 37) {
		leftPressed = true;
	}
	if (event.keyCode == 39) {
		rightPressed = true;
	}
	if (event.keyCode == 38) {
		upPressed = true;
	}
	if (event.keyCode == 40) {
		downPressed = true;
	}
}

function myLoadFunction() {
	var start = document.getElementById('start');
	start.addEventListener('click', startGame);
	var elements = document.getElementsByTagName("li");
	setInterval(positionTank, 300);
}

function startGame() {
	var start = document.getElementById('start');
	start.style.display = 'none';

	timeout = setInterval(move, 1);
	document.addEventListener('keydown', keydown);
	document.addEventListener('keyup', keyup);

	bombInterval = setInterval(function () {
		generateBomb();
	}, 2000);

	gameStarted = true; // Set the game started flag
	lives = 3; // Reset the player's lives
	updateLivesDisplay();
}
function generateBomb() {
	// Check if the game has started
	if (!gameStarted) return;
  
	var tankElements = document.getElementsByClassName("tank");
  
	for (var i = 0; i < tankElements.length; i++) {
	  var tank = tankElements[i];
	  var tankTop = tank.offsetTop;
	  var tankLeft = tank.offsetLeft;
  
	  var bomb = document.createElement("div");
	  bomb.classList.add("bomb");
	  bomb.style.top = tankTop + 10 + "px";
	  bomb.style.left = tankLeft + "px";
	  document.body.appendChild(bomb);
  
	  moveBomb(bomb);
	}
  
	// Randomize bomb generation frequency
	var randomFrequency = Math.ceil(Math.random() * 2000) + 1000;
	setTimeout(generateBomb, randomFrequency);
  }
function positionTank() {
	// Check if the game has started
	if (!gameStarted) return;
  
	var tanks = document.getElementsByClassName("tank");
	for (var i = 0; i < tanks.length; i++) {
	  var random = Math.ceil(Math.random() * 10);
	  tanks[i].style.top = random + "0vh";
  
	  var bomb = document.createElement("div");
	  bomb.classList = "bomb";
	  bomb.style.top = tanks[i].offsetTop + "px";
	  bomb.style.left = tanks[i].offsetLeft + "px";
	  document.body.appendChild(bomb);
  
	  moveBomb(bomb);
	  moveBombs();
	}
  
	// Randomize tank speed
	var randomSpeed = Math.ceil(Math.random() * 5) + 1;
	setTimeout(positionTank, randomSpeed * 1000);
  }

function moveBomb(bomb) {
	var tankRect = bomb.parentNode.getBoundingClientRect();
	var left = bomb.offsetLeft;
	var top = bomb.offsetTop;
  
	var horizontalSpeed = Math.random() * 2 - 1; // Random horizontal speed between -1 and 1
	var verticalSpeed = Math.random() * 2 - 1; // Random vertical speed between -1 and 1
  
	var interval = setInterval(function () {
	  left += horizontalSpeed;
	  top += verticalSpeed;
  
	  if (left > tankRect.left && left < tankRect.right && top > tankRect.top && top < tankRect.bottom) {
		bomb.style.left = left + "px";
		bomb.style.top = top + "px";
	  } else {
		explodeBomb(bomb); // Call the explodeBomb function
		clearInterval(interval);
	  }
  
	  checkCollision(bomb);
	}, 10);
  }
  

function explodeBomb(bomb) {
	bomb.classList = 'explosion';

	// Randomize explosion position
	var randomTop = Math.floor(Math.random() * (window.innerHeight - 100)) + 'px';
	var randomLeft = Math.floor(Math.random() * (window.innerWidth - 100)) + 'px';

	bomb.style.top = randomTop;
	bomb.style.left = randomLeft;

	// Delay removing the explosion class
	setTimeout(function () {
		bomb.parentNode.removeChild(bomb);
	}, 1000);
}

function checkCollision(bomb) {
	var player = document.getElementById('player');
	var playerRect = player.getBoundingClientRect();
	var bombRect = bomb.getBoundingClientRect();

	if (
		bombRect.left < playerRect.right &&
		bombRect.right > playerRect.left &&
		bombRect.top < playerRect.bottom &&
		bombRect.bottom > playerRect.top
	) {
		// Collision detected
		if (!isHit) {
			isHit = true; // Set the player as hit
			lives--; // Subtract a life
			updateLivesDisplay(); // Update the HTML list

			player.classList.add('hit'); // Add the "hit" class for the hit animation

			setTimeout(function () {
				player.classList.remove('hit'); // Remove the "hit" class after a delay
				isHit = false; // Reset the hit state
			}, 500); // Adjust the duration of the hit animation (in milliseconds)

			if (lives === 0) {
				gameOver();
			}
		}
	}
}

function updateLivesDisplay() {
	var livesList = document.getElementsByClassName('health')[0].getElementsByTagName('li');

	for (var i = 0; i < livesList.length; i++) {
		if (i < lives) {
			livesList[i].style.backgroundColor = 'red'; // Mark the remaining lives as red
		} else {
			livesList[i].style.backgroundColor = 'transparent'; // Clear the remaining life slots
		}
	}
}
function gameOver() {
    clearInterval(timeout);
    clearInterval(bombInterval);
    document.removeEventListener('keydown', keydown);
    document.removeEventListener('keyup', keyup);

    var player = document.getElementById('player');
    player.classList = 'character stand down dead';

    var playAgainButton = document.createElement('button');
    playAgainButton.id = 'play-again';
    playAgainButton.textContent = 'Play Again';
    playAgainButton.addEventListener('click', restartGame);

    var playAgainContainer = document.createElement('div');
    playAgainContainer.id = 'play-again-container';
    playAgainContainer.appendChild(playAgainButton);

    document.body.appendChild(playAgainContainer);
}
function restartGame() {
    var playAgainContainer = document.getElementById('play-again-container');
    playAgainContainer.parentNode.removeChild(playAgainContainer);

    // Reset the game state and variables
    var player = document.getElementById('player');
    player.className = 'character stand down';

    // Reset any other game variables or state
    lives = 3;
    updateLivesDisplay();

    // Start the game again
    timeout = setInterval(move, 1);
    document.addEventListener('keydown', keydown);
    document.addEventListener('keyup', keyup);

    bombInterval = setInterval(function() {
        generateBomb();
    }, 2000);

    gameStarted = true; // Set the game started flag
}





document.addEventListener('DOMContentLoaded', myLoadFunction);
