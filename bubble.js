var my_canvas = document.getElementById('canvas');
var my_div = document.getElementById('hide');
var button = document.getElementById('play');
var gameOver = document.getElementById('gameOverBar');
var closeBtn = document.getElementById('barClose');
console.log(my_div);

function popup(){

	//alert("Good Luck!");
	//document.body.innerHTML = '';
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

	var x = canvas.width/2;
	var y = canvas.height - 30;
	var dx = 2;
	var dy = -2;
	var ballRadius = 10
	var userRadius = 10;
	var userX = (canvas.width-userRadius*2)/2;
	var userY = (canvas.height-userRadius*2)/2;
	var timer = 0;
	var score = 0;
	var leftPressed = false;
	var rightPressed = false;
	var upPressed = false;
	var downPressed = false;
	var userSpeed = 4;
	var bubRadius = 12;
	var bubSpeed = 4;
	var bubStartPointX = 1;
	var bubStartPointY = 1;
	var bubbles = [];
	var horizontalSpeed = 1;
	var verticalSpeed = 1;

	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
	document.addEventListener("mousemove", mouseMoveHandler, false);

	function keyDownHandler(e) {
	  if (e.keyCode == 37) {
	    leftPressed = true;
	  }
	  else if (e.keyCode == 39) {
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
	function mouseMoveHandler(e){
		var cursorX = e.clientX;
		var cursorY = e.clientY;
		if (cursorX>0 && cursorX<canvas.width && cursorY>0 && cursorY<canvas.height) {
			userX = cursorX-userRadius;
			userY = cursorY-2*userRadius;
		}
	}


	function drawScore() {
		ctx.font = "bold 20px Courier New";
		ctx.fillStyle = "white";
		ctx.fillText("Score: " + score, canvas.width - 130, 40);
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

	function changeSpeed() {
	  horizontalSpeed = Math.random()*1.5 + 1;
	  verticalSpeed = Math.random()*1.5 + 1;
	}

	function checkCollision() {
		for (var i=0, max=bubbles.length;i<max;i++) {
			var bubble=bubbles[i];
			if (userX>bubble.bubX && userX<bubble.bubX+bubRadius && userY<bubble.bubY+bubRadius && userY>bubble.bubY-bubRadius) {
				alert("FUck you");
				document.location.reload();
			}
		}
	}

	function draw(){
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		drawUser();
		userMove();
		checkCollision();
		drawScore();
		drawBubbles();
		bubblesMove();

		if (score > 10) {
			clearInterval(addBubble);
		}
		timer += 1;
		if(timer % 30 == 0){
			score += 1;
		}

	}

	setInterval(draw, 5);
	setInterval(addBubble, 2000);
	setInterval(changeSpeed, 1999);


}
