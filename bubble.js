var my_canvas = document.getElementById('canvas');
var my_div = document.getElementById('hide');
var button = document.getElementById('play');
console.log(my_div);
var is_game_over = false;

var back = new Image();
back.src = "https://raw.githubusercontent.com/spockqin/Tac-Game-incomplete/master/ground.png";

var background = new Audio("https://raw.githubusercontent.com/spockqin/Tac-Game-incomplete/master/mainmusic.mp3");
var gameover = new Audio("https://raw.githubusercontent.com/spockqin/Tac-Game-incomplete/master/over.mp3");
var laser = new Audio("https://raw.githubusercontent.com/spockqin/Tac-Game-incomplete/master/laser.mp3");
//laser.volume = .5;

function popup(){

	//alert("Good Luck!");
	//document.body.innerHTML = '';
	background.play();
	my_div.remove();
	//console.log(document.getElementById("par").innerHTML);
	my_canvas.style.visibility = 'visible';
	var width = window.innerWidth;
	var height = window.innerHeight;
	my_canvas.height=height - 39;
	my_canvas.width=width - 20;

	play();
}

window.onload = function() {
	my_canvas.style.visibility = 'hidden';
	pageLoad();

}

function pageLoad(){
	//alert("hi");
}

document.addEventListener('keydown', function(event) {
    if (is_game_over){
    	//fix_error = false;
    	document.location.reload(true);
    }
    if (event.keyCode == 13) {
        popup();
    }
});

function play() {
	//SETTING UP CANVAS
	var ctx = my_canvas.getContext("2d");

	//RECTANGLE
	/*ctx.beginPath();
	ctx.rect(my_canvas.width / 2 - 20, my_canvas.height / 2 - 20, 50, 20);
	ctx.fillStyle = "blue";
	ctx.fill();

	//CIRCLE  arc(x, y, radius, start angle, end angle)
	ctx.arc(100, 100, 50, 0, Math.PI*2);
	ctx.fillStyle = "green";
	ctx.fill();*/

	var x = my_canvas.width/2;
	var y = my_canvas.height - 30;
	var dx = 2;
	var dy = -2;
	var ballRadius = 10
	var userRadius = 10;
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
	var bubRadius = 12;
	var bubSpeed = 4;
	var bubStartPointX = 1;
	var bubStartPointY = 1;
	var bubbles = [];
	var horizontalSpeed = 1;
	var verticalSpeed = 1;
	var fix_error = true;
	var delay = 5000;
	var scoreX = canvas.width - 150;
	var scoreY = 40;
	var bullets = [];
	var bullet_len = 5;
	var bulletWidth = 7;
	var move_back = true;
	var backX = 0;
	var backY = 0;


	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("click", clickHandler);
	document.addEventListener("click", shoot);

	function keyDownHandler(e) {
	  if (e.keyCode == 37) {
	    leftPressed = true;
	  }
	  else if (e.keyCode
	   == 39) {
	    rightPressed = true;
	  }
	  else if (e.keyCode == 38) {
	    upPressed = true;
	  }
	  else if (e.keyCode == 40) {
	    downPressed = true;
	  }
	}
	function keyUpHandler(e) {
	  if (e.keyCode == 37) {
	    leftPressed = false;
	  }
	  else if (e.keyCode == 39) {
	    rightPressed = false;
	  }
	  else if (e.keyCode == 38) {
	    upPressed = false;
	  }
	  else if (e.keyCode == 40) {
	    downPressed = false;
	  }
	}

	function clickHandler() {
		click = true;
	}

	function shoot(e){
		var cursorX = e.clientX;
		var cursorY = e.clientY;
		vec_x = e.clientX - userX;
		vec_y = e.clientY - userY;
		create_bullet(vec_x, vec_y, userX, userY);
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
	  bubbles.push({bubX: 50, bubY: 50, bubSpeedX:horizontalSpeed, bubSpeedY:verticalSpeed});
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

	/*function changeBubxPosition(){
	  bubStartPointX = Math.random()*(canvas.width-1)+1;
	  if (Math.floor(bubStartPointX) % 2 == 0) {
	    bubStartPointY = 1;
	  } else {
	    bubStartPointY = canvas.height-1;
	  }
	}*/
	function changeBubRadius(){
		//math.random
	}

	function changeSpeed(){
		if (timer < 3000){
			speed = .5
		}else if (timer > 5000){
			speed = .3
		}else{
			speed = 1.5
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
		ctx.fillRect(canvas.width/2 - 72, canvas.height/2 + 10, 150,30);

		ctx.font = "40px Courier New";
		ctx.fillStyle = "white";
		ctx.fillText("GAME OVER", canvas.width/2 - 110, canvas.height/2 - 20);
		ctx.font = "bold 20px Courier New";
		ctx.fillStyle = "#00FFFF";
		ctx.fillText("REPLAY", canvas.width/2 - 32, canvas.height/2 + 30);

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
		if (click){
			if (is_game_over && fix_error){
				fix_error = false;
				document.location.reload(true);
			}else{
				laser.play();
				click = false;
			}
		}
	}
	
	function backMove(){
		if (move_back){
			backX -= .05;
			backY -= .05;
			if(backX == - back.width - ){
				move_back = false;
			}
		}else{
			backX += .05;
			backY += .05;
			if(backX == 0){
				move_back = true;
			}
		}
	}
	
	function drawInstructions() {
    	ctx.beginPath();

		ctx.font = "bold 16px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("You are the blue ball.", canvas.width/2 - 95, canvas.height/2 - 25);
		ctx.fillText("Avoid white bubbles using", canvas.width/2 - 110, canvas.height/2 + 30);
		ctx.fillText("your keyboard arrow keys.", canvas.width/2 - 110, canvas.height/2 + 50);
		
		//ctx.font = "bold 16px Trebuchet";
		//ctx.fillStyle = "blue";
		//ctx.fillText("Shoot by clicking at bubbles.", canvas.width/2 - 110, canvas.height/2 + 100);
		//ctx.fillText("Win game by killing all bubbles.", canvas.width/2 - 110, canvas.height/2 + 120);

		ctx.closePath();
	}

	function draw(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		backMove();
		ctx.drawImage(back, backX, backY);
		if (timer < 1200){
			drawInstructions();
		}
		if (timer > 15000){
			delay = 15000
		}
		drawUser();
		drawScore();
		checkCollision();
		drawBubbles();
		drawBullets();
		bubblesMove();
		clickAction();

		if(is_game_over){
			drawGameOver();
			if(scoreX > canvas.width/2 - 50){
				scoreX -= 1
				scoreY += .7
			}
		}else{
			userMove();
		}

		timer += 1;
		if(timer % 30 == 0 && is_game_over == false){
			score += 1;
		}
		
	}

	setInterval(draw, 5);
	setInterval(addBubble, delay);
	setInterval(changeSpeed, 1999);

	var connect = document.getElementById("connect");
	connect.textContent = "hello"

	//game over
	//tone down shooting sound
	//touch circumference
	//shooting + new level
}
