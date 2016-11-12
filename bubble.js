//Sharon sgrubner@illumina.com
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var userRadius = 10;
var userX = (canvas.width-userRadius*2)/2;
var userY = (canvas.height-userRadius*2)/2;
var userSpeed = 6;
var bubRadius = 12;
var bubSpeed = 4;
var bubbles = [];
var leftPressed = false;
var rightPressed = false;
var upPressed = false;
var downPressed = false;

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

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

function drawUser() {
  ctx.beginPath();
  ctx.arc(userX, userY, userRadius, 0, 2*Math.PI);
  ctx.fillStyle="#0095DD";
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

function addBubble(spdx, spdy){
  bubbles.push({bubX:50, bubY:50, bubSpeedX:spdx, bubSpeedY:spdy});
}

function drawBubbles(){
  for (var i=0, max=bubbles.length; i<max; i++) {
    ctx.beginPath();
    ctx.arc(bubbles[i].bubX, bubbles[i].bubY, bubRadius, 0, 2*Math.PI);
    ctx.stroke();
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

function changeBubSpeed(){
  bubSpeed += 1;
}

function draw(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawUser();
  drawBubbles();
  userMove();
  bubblesMove();
}

setInterval(addBubble, 200, 3, 3);
//setInterval(changeBubSpeed, 600);
setInterval(draw, 7);
