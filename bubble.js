var my_canvas = document.getElementById('canvas');
var my_div = document.getElementById('hide');
var button = document.getElementById('play');
var is_game_over = false;
var started = false;
var begin = false;
var i = 0;

var back = new Image();
back.src = "https://raw.githubusercontent.com/spockqin/Tac-Game-incomplete/master/ground.png";

var background = new Audio("https://raw.githubusercontent.com/spockqin/Tac-Game-incomplete/master/mainmusic.mp3");
var gameover = new Audio("https://raw.githubusercontent.com/spockqin/Tac-Game-incomplete/master/over.mp3");
var laser = new Audio("https://raw.githubusercontent.com/spockqin/Tac-Game-incomplete/master/laser.mp3");
laser.volume = .1;

var width = window.innerWidth;
var height = window.innerHeight;

function popup(){
	started = true;
	begin = false;
	background.play();

	my_div.remove();

	my_canvas.style.visibility = 'visible';
	my_canvas.height=height - 44;
	my_canvas.width=width - 23;

	play();
}

window.onload = function() {
	my_canvas.style.visibility = 'hidden';
}

document.addEventListener('keydown', function(event) {
    if (is_game_over && event.keyCode == 13){
		document.location.reload(true);
    }else if (event.keyCode == 13 && started == false) {
    	i = 2;
        popup();
    }
});

function play() {
	//SETTING UP CANVAS
	var ctx = my_canvas.getContext("2d");

	var dx = 2;
	var dy = -2;
	var userRadius = 13;
	var bubRadius = 16;
	if (width < 700 || height < 500){
		 userRadius = 10;
		 bubRadius = 11;
	}
	var userX = (my_canvas.width-userRadius*2)/2;
	var userY = (my_canvas.height-userRadius*2)/2;
	var timer = 0;
	var score = 0;
	var leftPressed = false;
	var rightPressed = false;
	var upPressed = false;
	var downPressed = false;
	var click = false;
	var userSpeed = 4;
	var bubSpeed = 4;
	var bubStartPointX = 20;
	var bubStartPointY = 20;
	var bubbles = [];
	var horizontalSpeed = 1;
	var verticalSpeed = 1;
	var fix_error = true;
	var delay = 0;
	var delay2 = 0;
	var scoreX = canvas.width - 150;
	var scoreY = 40;
	var bullets = [];
	var bullet_len = 5;
	var bulletWidth = 7;
	var move_back = true;
	var backX = 0;
	var backY = 0;
	var sniper = false;
	var win = false;


	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("click", shoot);

	function keyDownHandler(e) {
	  if (e.keyCode == 37 || e.keyCode == 65) {
	    leftPressed = true;
	  }
	  else if (e.keyCode == 39 || e.keyCode == 68) {
	    rightPressed = true;
	  }
	  else if (e.keyCode == 38 || e.keyCode == 87) {
	    upPressed = true;
	  }
	  else if (e.keyCode == 40 || e.keyCode == 83) {
	    downPressed = true;
	  }
	}
	function keyUpHandler(e) {
	  if (e.keyCode == 37 || e.keyCode == 65) {
	    leftPressed = false;
	  }
	  else if (e.keyCode == 39 || e.keyCode == 68) {
	    rightPressed = false;
	  }
	  else if (e.keyCode == 38 || e.keyCode == 87) {
	    upPressed = false;
	  }
	  else if (e.keyCode == 40 || e.keyCode == 83) {
	    downPressed = false;
	  }
	}


	function shoot(e){
		i += 1;
		click = true;
		var cursorX = e.clientX;
		var cursorY = e.clientY;

		//OPTIONS
		if(begin == false && i > 1){
			if(cursorX < canvas.width/2){
				sniper = false;
				delay = 5000;
				delay2 = 10000;
			}else{
				sniper = true;
				delay = 1000;
				delay2 = 500;
			}
			begin = true;
			setIntervals();
		}else if(sniper){
			vec_x = e.clientX - userX;
			vec_y = e.clientY - userY;
			create_bullet(vec_x, vec_y, userX, userY);
		}
	}

	function create_bullet(vec_x, vec_y, xStart, yStart) {
		var hypotunuse = Math.sqrt(vec_x*vec_x + vec_y*vec_y);
		var BSpdX = bullet_len*vec_x/hypotunuse;
		var BSpdY = bullet_len*vec_y/hypotunuse;
		bullets.push({xCor:xStart, yCor:yStart, xSpd:BSpdX, ySpd:BSpdY});
	}

	function drawBullets() {
		for (var i=0, max=bullets.length;i<max;i++) {
			ctx.beginPath();
			ctx.strokeStyle="red";
			ctx.lineWidth=bulletWidth;
			moveBullets();
			ctx.moveTo(bullets[i].xCor,bullets[i].yCor);
			ctx.lineTo(bullets[i].xCor+bullets[i].xSpd, bullets[i].yCor+bullets[i].ySpd);
			ctx.stroke();
		}
	}

	function moveBullets(){
		for (var i=0, max=bullets.length;i<max;i++) {
			bl = bullets[i];
			if (bl.xCor<0||bl.xCor>my_canvas.width||bl.yCor<0||bl.yCor>my_canvas.height) {
				bullets.splice(i, 1);
			}
			else {
				bl.xCor += bl.xSpd;
				bl.yCor += bl.ySpd;
			}
		}
	}
	function drawScore() {
		ctx.font = "bold 20px Courier New";
		ctx.fillStyle = "white";
		ctx.fillText("Score: " + score, scoreX, scoreY);
	}

	function drawUser() {
		ctx.beginPath();
		ctx.arc(userX, userY, userRadius, 0, 2*Math.PI);
		ctx.fillStyle = "blue";
		ctx.fill();
		ctx.closePath();
	}

	function userMove() {
	  if (leftPressed && userX - userRadius- userSpeed > 0) {
	    userX -= userSpeed;
	  }
	  if (upPressed && userY - userRadius - userSpeed > 0) {
	    userY -= userSpeed;
	  }
	  if (rightPressed && userX + userRadius + userSpeed < canvas.width) {
	    userX += userSpeed;
	  }
	  if (downPressed && userY + userRadius + userSpeed < canvas.height) {
	    userY += userSpeed;
	  }
	}

	function addBubble(){
	  if(score > 40){
	  	bubbles.push({bubX: bubStartPointX, bubY: bubStartPointY, bubSpeedX:horizontalSpeed, bubSpeedY:verticalSpeed});
	  }
	}

	function drawBubbles() {
		  for (var i=0, max=bubbles.length; i<max; i++) {
    		ctx.beginPath();
		    ctx.arc(bubbles[i].bubX, bubbles[i].bubY, bubRadius, 0, 2*Math.PI);
		    ctx.fill();
		    ctx.closePath();
  		  }
	}

	function bubblesMove() {
	  for (var i=0, max=bubbles.length; i<max; i++) {
	    bubbles[i].bubX += bubbles[i].bubSpeedX;
	    bubbles[i].bubY += bubbles[i].bubSpeedY;
	    if (bubbles[i].bubX+bubRadius > canvas.width || bubbles[i].bubX-bubRadius < 0) {
	      bubbles[i].bubSpeedX = -bubbles[i].bubSpeedX
	    }
	    if (bubbles[i].bubY+bubRadius > canvas.height || bubbles[i].bubY-bubRadius < 0) {
	      bubbles[i].bubSpeedY = -bubbles[i].bubSpeedY
	    }
	  }
	}

	function changeBubxPosition(){
	  bubStartPointX = Math.random()*canvas.width;
	  if (Math.floor(bubStartPointX) % 2 == 0) {
	    bubStartPointY = bubRadius;
	  } else {
	    bubStartPointY = canvas.height-bubRadius;
	  }
	}
	function changeBubRadius(){
		//math.random
	}

	function drawOptions(){
		ctx.font = "40px Courier New";
		ctx.fillStyle = "white";
		ctx.fillText("OPTIONS", canvas.width/2 - 80, canvas.height/2 - 50);
		ctx.font = "15px Courier New";
		ctx.fillText("Click one:", canvas.width/2 - 40, canvas.height/2 - 35)
		ctx.font = "10px Courier New";
		ctx.fillText("Avoid white bubbles.", canvas.width/2 - 135, canvas.height/2 + 50)
		ctx.fillText("Shoot AND avoid bubbles.", canvas.width/2 +40, canvas.height/2 +50)
		ctx.font = "bold 20px Courier New";
		ctx.fillStyle = "#00FFFF";
		ctx.fillText("Runaway", canvas.width/2 - 100, canvas.height/2 + 30);
		ctx.fillText("Sniper", canvas.width/2 + 40, canvas.height/2 + 30);
	}

	function changeSpeed(){
		if (score < 100){
			speed = .5
		}else if (score > 300){
			if (sniper){
				speed = .3

			}else{
				speed = .3
			}
		}else{
			speed = 1.2
		}
		horizontalSpeed = Math.random()*1.5 + speed;
	    verticalSpeed = Math.random()*1.5 + speed;
	}

	function drawGameOver(){
    	ctx.beginPath();
		ctx.fillStyle = "white";
		ctx.fillRect(canvas.width/2 - 153, canvas.height/2 - 83, 306, 155);
		ctx.fillStyle = "gray";
		ctx.fillRect(canvas.width/2 - 150, canvas.height/2 - 80, 300, 150);
		ctx.fillStyle = "black";
		ctx.fillRect(canvas.width/2 - 90, canvas.height/2 + 10, 180,30);

		ctx.font = "40px Courier New";
		ctx.fillStyle = "white";
		ctx.fillText("GAME OVER", canvas.width/2 - 110, canvas.height/2 - 20);
		ctx.font = "bold 16px Courier New";
		ctx.fillStyle = "#00FFFF";
		ctx.fillText("ENTER to RESTART", canvas.width/2 - 77, canvas.height/2 + 30);

		ctx.closePath();
	}

	function checkCollision() {
		for (var i=0, max=bubbles.length;i<max;i++) {
			var bubble=bubbles[i];
			var bubLat = bubble.bubX;
			var bubLon = bubble.bubY;
			if (userX>bubble.bubX-bubRadius && userX<bubble.bubX+bubRadius && userY<bubble.bubY+bubRadius && userY>bubble.bubY-bubRadius) {
				background.pause();
				if (is_game_over == false){
					gameover.play();
				}
				is_game_over = true;
			}
			for (var b=0, bmax=bullets.length;b<bmax;b++) {
				var blt = bullets[b];
				if (blt.xCor>bubLat-bubRadius-bulletWidth && blt.xCor<bubLat+bubRadius+bulletWidth && blt.yCor<bubLon+bubRadius+bulletWidth && blt.yCor>bubLon-bubRadius-bulletWidth) {
					bullets.splice(b, 1);
					bubbles.splice(i, 1);
					score += 5;
				}
			}	
		}
	}

	function clickAction() {
		laser.play();
		click = false;
	}

	function backMove(){
		if (move_back){
			backX -= .05;
			backY -= .05;
			if(backX <= -300){
				move_back = false;
			}
		}else{
			backX += .05;
			backY += .05;
			if(backX >= 0){
				move_back = true;
			}
		}
	}

	function drawInstructions() {
    	ctx.beginPath();

		ctx.font = "bold 16px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("You are the blue ball.", canvas.width/2 - 95, canvas.height/2 - 30);
		ctx.fillText("Avoid white bubbles using", canvas.width/2 - 110, canvas.height/2 + 30);
		ctx.fillText("your keyboard arrow keys.", canvas.width/2 - 110, canvas.height/2 + 50);
		if (sniper){
			ctx.font = "bold 20px Arial";
			ctx.fillText("Click to shoot.", canvas.width/2 - 80, canvas.height/2 + 100);
		}
		ctx.closePath();
	}

	function drawWin(){
		ctx.font = " 80px Courier New";
		ctx.fillStyle = "#00BFFF";
		ctx.fillText("You won!", canvas.width/2 - 190, canvas.height/2 - 30);
		ctx.font = "bold 20px Courier New";
		ctx.fillText("But keep playing if you can! ;)", canvas.width/2 - 190, canvas.height/2 + 30);		
	}

	function draw(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		backMove();
		ctx.drawImage(back, backX, backY);

		if (begin == false){
			drawOptions();
		}

		if (begin){
			if (score < 55){
				drawInstructions();
			}
			if (score > 400){
				delay = delay2;
			}
			if (score > 600){
				win = true;
				if(score < 640){
					drawWin();
				}
				if(sniper == false){
					delay = 20,000;
				}else{
					if(score < 650){
						delay = 3000;
					}else{
						delay = 400;
					}
				}
			}

			drawUser();
			drawScore();
			checkCollision();
			drawBubbles();
			drawBullets();
			bubblesMove();
			clickAction();

			if(is_game_over && win == false){
				drawGameOver();
				if(scoreX > canvas.width/2 - 50){
					scoreX -= 1
				}
			}else if(is_game_over == false){
				userMove();
			}
		}

		timer += 1;
		if(timer % 30 == 0 && is_game_over == false){
			score += 1;
		}
		
	}

	function setIntervals(){
		setInterval(addBubble, delay);
		setInterval(changeSpeed, 1999);
		setInterval(changeBubxPosition, delay*2);
		score = 0;
	}
	setInterval(draw, 5);
}
