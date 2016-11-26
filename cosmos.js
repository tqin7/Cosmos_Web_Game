var my_canvas = document.getElementById('canvas');
var heading = document.getElementById('heading');
var my_div = document.getElementById('hide');
var button = document.getElementById('play');
var instructions = document.getElementById('instructions');
var instructButton = document.getElementById('instruct');
var credits = document.getElementById('credits');
var is_game_over = false;
var started = false;
var begin = false;
var i = 0;

var back = new Image();
back.src = "https://raw.githubusercontent.com/spockqin/Cosmos_Web_Game/master/ground.png";

var backgroundMusic = new Audio("https://raw.githubusercontent.com/spockqin/Cosmos_Web_Game/master/mainmusic.mp3");
var gameoverMusic = new Audio("https://raw.githubusercontent.com/spockqin/Cosmos_Web_Game/master/over.mp3");
var laserMusic = new Audio("https://raw.githubusercontent.com/spockqin/Cosmos_Web_Game/master/laser.mp3");
laserMusic.volume = .1;

var width = window.innerWidth;
var height = window.innerHeight;


var viewInstructs = true;
function viewInstructions(){
	if(viewInstructs){
		instructions.style.fontSize = '15px';
		instructions.style.visibility = 'visible';
		//instructButton.style.backgroundColor = 'rgb(72,61,139)';
		//instructButton.style.color = "white";
		instructButton.style.visibility = 'hidden';
		viewInstructs = false;
		credits.style.visibility = 'hidden';
		instructions.scrollIntoView(true);
	}else{
		//hypothetically if click the button again do what's here
	}
}

function popup(){
	started = true;
	begin = false;
	//document.body.innerHTML = '';
	backgroundMusic.play();

	my_div.remove();
	//console.log(document.getElementById("par").innerHTML);
	my_canvas.style.visibility = 'visible';
	my_canvas.height=height - 44;
	my_canvas.width=width - 23;

	play();
}

window.onload = function() {
	if(width < 600){
		heading.style.fontSize = '60px';
	}else if(width > 1200){
		heading.style.fontSize = '161px';
		heading.style.fontSize = '160px';
	}else if(width > 900){
		heading.style.fontSize = '120px';
	}else{
		heading.style.fontSize = '100px';
	}
	my_canvas.style.visibility = 'hidden';
	pageLoad();

}

function pageLoad(){
	//alert("hi");
}

document.addEventListener('keydown', function(event) {
    if (is_game_over && event.keyCode == 13){
		document.location.reload(true);
	} else if (started == false && event.keyCode == 73) {  //to get instructions
		viewInstructs = true;
		viewInstructions();
	} else if (event.keyCode == 13 && started == false) {
    	i = 2;
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
	var dx = 2;
	var dy = -2;
	var userRadius = 13;
	var bubRadius = 16;
	if (width < 700 || height < 500){
		 userRadius = 10;
		 bubRadius = 11;
	}
	var userX = (my_canvas.width-userRadius*2)/2;
	var userY = (my_canvas.height-userRadius*2)/2 - 20;
	var timer = 0;
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
	var bullets = [];
	var bullet_len = 5;
	var bulletWidth = 7;
	var move_back = true;
	var backX = 0;
	var backY = 0;
	var sniper = false;
	var win = false;

	//prevent multipl second intervals
	secondIntervalSet = true;

	//Game Over PopUP
	var gameOverButtonColor = "black";
	var gameOverTextColor = "#00FFFF";

	//Score
	var score = 0;
	var scoreX = canvas.width - 150;
	var scoreY = 40;
	var scoreTextSize = 20;
	var highscore;

	//Sound
	var soundOn = new Image();
	soundOn.src = "https://raw.githubusercontent.com/spockqin/Cosmos_Web_Game/master/sound%20on.png";
	var soundOff = new Image();
	soundOff.src = "https://raw.githubusercontent.com/spockqin/Cosmos_Web_Game/master/sound%20off.png";
	var currentSoundIcon = soundOn;

	//Corners
	var cornerCount = 1;
	var cornerX;
	var cornerY;


	//DownPresses
	var prevDown = 0;

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("click", shoot);
	document.addEventListener("mousemove", mouseMove);

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
	  if(e.keyCode == 91){
	  	prevDown = 91;
	  }
	  if(e.keyCode == 82){
	  	if (prevDown == 91){  //so we can do command + R
			return;
		}
	  	if (confirm("You pressed R. \nDo you want to Restart the game?")){
	  		document.location.reload(true);
	  	}
	  }
	  if(e.keyCode == 80){  //P for pause
	  	alert("You pressed 'P'. Game paused until you press 'OK'.");
	  }
	  if(e.keyCode == 77){  //M for mute
	  	drawSound(10, canvas.height - 5);
	  }
	  //OPTIONS
	  if(begin == false && i > 1){
		if(event.keyCode == 49){ //key code 1
			sniper = false;
			delay = 4000;
			delay2 = 10000;
			i += 1;
			begin = true;
			setIntervals();
		}else if(event.keyCode == 50){  //key code 2
			sniper = true;
			delay = 1000;
			delay2 = 50;
			i += 1;
			begin = true;
			setIntervals();
		}
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

	function withinGameOverButton(x, y){
		x1 = canvas.width/2 - 78
		x2 = canvas.width/2 + 103
		y1 = canvas.height/2 + 20
		y2 = canvas.height/2 + 53
		//console.log(x1 + ", " + x2 + ", " + y1 + ", " + y2);
		if(x > x1 && x < x2 && y > y1 && y < y2){
			return true;
		}else{
			return false;
		}
	}

	function mouseMove(e){
		if(is_game_over){  //game is over popup
			//button dimensions = canvas.width/2 - 90, canvas.height/2 + 10, 180,30
			if(withinGameOverButton(e.clientX, e.clientY)){
				gameOverButtonColor = "white";
				gameOverTextColor = "#20B2AA";
			}else{
				gameOverButtonColor = "black";
				gameOverTextColor = "#00FFFF";
			}
		}
	}


	function shoot(e){
		//sound
		drawSound(e.clientX, e.clientY);



		i += 1;
		if(sniper && is_game_over == false){
			laserMusic.play();
		}
		var cursorX = e.clientX;
		var cursorY = e.clientY;

		if(is_game_over && withinGameOverButton(cursorX, cursorY)){
			document.location.reload(true);
		}

		//OPTIONS
		if(begin == false && i > 1){
			if(cursorX < canvas.width/2){
				sniper = false;
				delay = 4000;
				delay2 = 10000;
			}else{
				sniper = true;
				delay = 1000;
				delay2 = 1;
			}
			begin = true;
			setIntervals();
		}else if(sniper && is_game_over == false){
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
			ctx.closePath();
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
		if(is_game_over && scoreTextSize < 25){
			scoreTextSize += .02;
		}
		if(is_game_over && scoreX > canvas.width/2 - 62){
				scoreX -= 1;
		}
		ctx.beginPath();
		var font = "bold " + scoreTextSize + "px Courier New";
		ctx.font = font;
		ctx.fillStyle = "white";
		ctx.fillText("Score: " + score, scoreX, scoreY);
		if(is_game_over){
			highscore = highScoreStorage();
			ctx.font = "bold 20px Courier New";
			ctx.fillText("Your High Score: " + highscore, scoreX + -50, scoreY + 30);
		}
		ctx.closePath();
	}

	function highScoreStorage(){
		if(typeof(Storage) !== "undefined") {
        	if (localStorage.highscore){
        		if (score > localStorage.highscore) {
            		localStorage.highscore = Number(score);
            	}
        	} else {
            	localStorage.highscore = score;
        	}
        	highscore = localStorage.highscore
    	} else {
    		highscore = "not supported";
    	}
    	return highscore
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
	  if(score > 40 && sniper){
	  	bubbles.push({bubX: bubStartPointX, bubY: bubStartPointY, bubSpeedX:horizontalSpeed, bubSpeedY:verticalSpeed});
	  }else if(score > 26){
	  		  	bubbles.push({bubX: bubStartPointX, bubY: bubStartPointY, bubSpeedX:horizontalSpeed, bubSpeedY:verticalSpeed});
	  }
	}

	function addCornerBubble(){
		var spice = Math.random() * 10;
		if(cornerCount == 1){
			cornerX = canvas.width - 27 - spice;
			cornerY = 15.5 + spice;
			cornerCount = 2;
		}else if(cornerCount == 2){
			cornerX = canvas.width - 23.5 - spice;
			cornerY = canvas.height - 18.5 - spice;
			cornerCount = 3;
		}else if(cornerCount == 3){
			cornerX = 30 + spice;
			cornerY = canvas.height - 18.5 - spice;
			cornerCount = 4;
		}else if(cornerCount == 4){
			cornerX = 22.5 + spice;
			cornerY = 17 + spice;
			cornerCount = 1;
		}

		
		bubbles.push({bubX: cornerX, bubY: cornerY, bubSpeedX:horizontalSpeed, bubSpeedY:verticalSpeed});

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
		ctx.beginPath();
		ctx.font = "40px Courier New";
		ctx.fillStyle = "white";
		ctx.fillText("OPTIONS", canvas.width/2 - 80, canvas.height/2 - 50);
		ctx.font = "15px Courier New";
		ctx.fillText("Click one:", canvas.width/2 - 40, canvas.height/2 - 35)
		ctx.font = "13px Courier New";
		ctx.fillText("Avoid white bubbles.", canvas.width/2 - 165, canvas.height/2 + 50)
		ctx.fillText("Shoot AND avoid bubbles.", canvas.width/2 +40, canvas.height/2 +50)
		ctx.font = "20px Courier New";
		ctx.fillStyle = "#00FFFF";
		ctx.fillText("RUNAWAY", canvas.width/2 - 100, canvas.height/2 + 30);
		ctx.fillText("SNIPER", canvas.width/2 + 40, canvas.height/2 + 30);
		ctx.closePath();
	}

	function changeSpeed(){
		if (score < 100){
			speed = .5;
		}else if (score > 100 && sniper){
			speed = 1
		} else if (score > 200 && sniper == false){
			speed = .1
		}else{
			speed = 1.2;
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
		ctx.fillStyle = gameOverButtonColor;
		ctx.fillRect(canvas.width/2 - 90, canvas.height/2 + 10, 180,30);

		ctx.font = "40px Courier New";
		ctx.fillStyle = "white";
		ctx.fillText("GAME OVER", canvas.width/2 - 110, canvas.height/2 - 20);
		ctx.font = "bold 16px Courier New";
		ctx.fillStyle = gameOverTextColor;
		ctx.fillText("ENTER to RESTART", canvas.width/2 - 77, canvas.height/2 + 30);

		ctx.closePath();
	}

	function checkCollision() {
		for (var i=0, max=bubbles.length;i<max;i++) {
			var bubble=bubbles[i];
			var bubLat = bubble.bubX;
			var bubLon = bubble.bubY;
			if (userX>bubble.bubX-bubRadius && userX<bubble.bubX+bubRadius && userY<bubble.bubY+bubRadius && userY>bubble.bubY-bubRadius) {
				backgroundMusic.pause();
				if (is_game_over == false && currentSoundIcon != soundOff){ //to just play once
					gameoverMusic.play();
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

	/*function clickAction() {
		if (click){
			laserMusic.play();
			click = false;
		}
	}*/

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

	function drawSound(x, y){
		if(x > 0 && x < 40 && y > canvas.height - 15){
			if(currentSoundIcon == soundOn){
				currentSoundIcon = soundOff;
				laserMusic.pause();
				backgroundMusic.pause();
				gameoverMusic.pause();
			}else{
				currentSoundIcon = soundOn;
				laserMusic.play();
				backgroundMusic.play();
				gameoverMusic.play();
			}
		}
		ctx.beginPath();
		ctx.drawImage(currentSoundIcon, 5, canvas.height - 18);
		ctx.strokeStyle = "#708090";
		ctx.lineWidth=1;
		ctx.rect(2, canvas.height - 18, 22, 16);
		ctx.stroke()
		ctx.closePath();
	}

	function drawInstructions() {
    	ctx.beginPath();

		ctx.font = "bold 16px Arial";
		ctx.fillStyle = "white";
		ctx.fillText("You.", canvas.width/2 - 70, canvas.height/2 - 80);
		ctx.strokeStyle = "white";
		ctx.moveTo(canvas.width/2 - 31, canvas.height/2 - 72);
		ctx.lineTo(canvas.width/2 - 15, canvas.height/2 - 50);
		ctx.moveTo(canvas.width/2 - 15, canvas.height/2 - 50);
		ctx.lineTo(canvas.width/2 - 34, canvas.height/2 - 55);
		ctx.moveTo(canvas.width/2 - 15, canvas.height/2 - 50);
		ctx.lineTo(canvas.width/2 - 8, canvas.height/2 - 62);
		ctx.stroke()
		ctx.fillText("Move using keyboard arrow keys.", canvas.width/2 - 140, canvas.height/2 + 25);
		if (sniper){
			ctx.fillText("Avoid white bubbles.", canvas.width/2 - 90, canvas.height/2 + 46)
			ctx.font = "bold 25px Arial";
			ctx.fillText("Click to shoot", canvas.width/2 - 94, canvas.height/2 + 90);
		}else{
			ctx.font = "bold 20px Arial";
			ctx.fillText("Avoid white bubbles.", canvas.width/2 - 120, canvas.height/2 + 65);
		}
		ctx.closePath();
	}

	function drawWin(){
		ctx.beginPath();
		ctx.font = " 80px Courier New";
		ctx.fillStyle = "#00BFFF";
		ctx.fillText("You won!", canvas.width/2 - 190, canvas.height/2 - 30);
		ctx.font = "bold 20px Courier New";
		ctx.fillText("But keep playing if you can! ;)", canvas.width/2 - 190, canvas.height/2 + 30);		
		ctx.closePath();
	}

	function draw(){
		ctx.beginPath();
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		backMove();
		ctx.drawImage(back, backX, backY);

		drawSound(0,0);

		if (begin == false){
			drawOptions();
		}

		if (begin){
			if (score < 40 && sniper){
				drawInstructions();
			}else if(score < 30){
				drawInstructions();
			}
			console.log(delay);
			if (score > 400 && sniper == false){
				win = true
				if(score < 600){
					drawWin();
				}
			} else if (score > 100 && sniper && secondIntervalSet){
				setInterval(addBubble, 400);
				secondIntervalSet = false;
			} else if (score > 600 && sniper){
				win = true;
				if(score < 640){
					drawWin();
				}
			}

			drawUser();
			drawScore();
			checkCollision();
			drawBubbles();
			drawBullets();
			bubblesMove();

			if(is_game_over && win == false){
				drawGameOver();
			}else if(is_game_over == false){
				userMove();
			}
		}

		timer += 1;
		if(timer % 30 == 0 && is_game_over == false){
			score += 1;
		}
		ctx.closePath();
	}

	function setIntervals(){
		setInterval(addBubble, delay);
		setInterval(changeSpeed, 1999);
		setInterval(changeBubxPosition, delay*2);
		setInterval(addCornerBubble, 7000);
		score = 0;
	}
	setInterval(draw, .1);
	//fix problem that you aren't getting out when touched
	//understand how the bubbles work!
	//more corner shots (but keep it looking random)
}