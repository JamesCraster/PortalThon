//"use strict";
//init.js comes before this file.
var g = hexi(width, height, setup, ["Fonts/PressStart2P.ttf", "player.png", "playerup.png", "playerdown.png", "playerleft.png"]);
var canvas = document.getElementsByTagName("canvas")[0];
canvas.style.left = "0px";
canvas.style.top = "0px";
canvas.style.position = "absolute";
canvas.width = 0;
canvas.height = 0;

g.fps = 60;
g.smoothie.interpolate = false;
menuDiv.style.display='block';
menuText = document.getElementById('menuText');
resumeText = document.getElementById('resumeText');
var doNothingClock = 0;
var initialTime = Date.now();
g.start();
g.backgroundColor = "black";
document.addEventListener("mousedown", function(){menuDiv.style.display = 'none'; g.state = pause; /*canvas.mozRequestFullScreen()*/});
const playerSpeed = tileSize;
var portals = [];
var portals2 = [];
var portals3 = [];
var green = 0x167311
for(var i = 0; i < 50; i++){
  segments.push(g.rectangle(tileSize,tileSize,green));
  segments[segments.length-1].visible = false;
}
for(var i = 0; i < 100; i++){
  pool.push(g.rectangle(tileSize,tileSize,green));
  pool[pool.length-1].visible = false;
}
var player = g.sprite(["player.png","playerdown.png", "playerleft.png", "playerup.png"]);


var pellet = g.rectangle(tileSize,tileSize,"gold");
var cover = g.rectangle(tileSize,tileSize,"black");
const topBarHeight = 16*3;
function load(){
  g.loadingBar();
}
function menu(){
  if((Math.floor((Date.now()-initialTime)/400) + 1) % 2.5 == 0){
    menuText.style.color = "black";
  }else{
    menuText.style.color = "white";
  }
}
function setup(){
  scoreText = g.text("Score:0","34px PressStart2P","red");
  scoreText.position.x = 5;
  scoreText.position.y = 8;
  const line = g.line("red",3,0,topBarHeight-2,width,topBarHeight-2);
  cover.visible = false;
  g.state = menu;
  player.vx = playerSpeed;
  player.position.x = width/2;
  player.position.y = height/2;
  var leftArrow = g.keyboard(65);
  var upArrow = g.keyboard(87);
  var rightArrow = g.keyboard(68);
  var downArrow = g.keyboard(83);
  var pKey = g.keyboard(80);

  for(var x = 0; x < levelVector.length; x++){
    for(var y = 0; y < levelVector[x].length; y++){
      if(levelVector[x][y] == 2 && y * tileSize > 16*1){
        poisons.push(g.rectangle(tileSize,tileSize,0x990099));
        poisons[poisons.length-1].position.x = x * tileSize;
        poisons[poisons.length-1].position.y = y * tileSize + tileSize;
      }
    }
  }
  portals = [g.rectangle(tileSize,tileSize,"blue"),g.rectangle(tileSize,tileSize,"blue")];
  portals2 = [g.rectangle(tileSize,tileSize,"red"),g.rectangle(tileSize,tileSize,"red")];
  portals3 = [g.rectangle(tileSize,tileSize,0x16CAC3),g.rectangle(tileSize,tileSize,0x16CAC3)];
  placePortal(levelVector,portals[0],3);
  placePortal(levelVector,portals[1],4);
  placePortal(levelVector,portals2[0],5);
  placePortal(levelVector,portals2[1],6);
  placePortal(levelVector,portals3[0],7);
  placePortal(levelVector,portals3[1],8);

  placePellet(pellet, levelVector);

  leftArrow.press = () =>{
      direction[0] = "left";
  }
  rightArrow.press = () =>{
      direction[0] = "right";
  }
  upArrow.press = () =>{
      direction[1] = "up";
  }
  downArrow.press = () =>{
      direction[1] = "down";
  }
  pKey.press = () =>{
    placePellet(pellet, levelVector);
  }
  for(var x = 0; x < levelVector.length; x ++){
    //console.log(levelVector[x]);
  }
}
function reset(){
  firstTime = performance.now();
  player.vx = playerSpeed;
  player.vy = 0;
  player.position.x = width/2;
  player.position.y = height/2;
  framecount = 0;
  score = 0;
  scoreText.text = "Score:0";
  while(segments.length > 50){
    pool.push(segments.pop());
    pool[pool.length-1].visible = false;
  }
  for(var i = 0; i < pool.length; i++){
    pool[i].visible = false;
  }
  for(var i = 0; i < segments.length; i++){
    segments[i].position.x = -30;
    segments[i].position.y = -30;
    segments[i].visible = false;
  }
  placePellet(pellet, levelVector);
  direction = ["none","none"];
  for(var x = 0; x < levelVector.length; x++){
    for(var y = 0; y < levelVector.length; y++){
      if(levelVector[x][y] == 9){
        levelVector[x][y] = 1;
      }
    }
  }
  player.show(0);
}
function pause(){
  if(document.hasFocus()){
	   canvas.width = width;
     canvas.height = height;
	   div.style.display='none';
     g.state = play;
     resumeText.style.color = "white";
   }else{
     if((Math.floor((Date.now()-initialTime)/400) + 1) % 2.5 == 0){
       resumeText.style.color = "black";
     }else{
       resumeText.style.color = "white";
     }
   }
}
function doNothing(){
  if(Date.now() - doNothingClock > 500){
    g.state = play;
    doNothingClock = 0;
    reset();
  }
}
function play(){
  if(!document.hasFocus()){
	     canvas.width = 0;
	     canvas.height = 0;
	     div.style.display='block';
       g.state = pause;
       initialTime = Date.now();
   }

  if(framecount % 13 == 0){
    if(previousDirection != 1 && previousDirection != 3 && direction[1] == "down" && !portal && levelVector[player.position.x/tileSize][player.position.y/tileSize] != 2){
      player.vy = playerSpeed;
      player.vx = 0;
      direction[1] = "none";
    }
    if(previousDirection != 3 && previousDirection != 1 && direction[1] == "up" && !portal && levelVector[player.position.x/tileSize][player.position.y/tileSize - 2] != 2){
      player.vy = -playerSpeed;
      player.vx = 0;
      direction[1] = "none";
    }
    if(previousDirection != 2 && previousDirection != 4 && direction[0] == "left" && !portal && (player.position.x == 0 || levelVector[player.position.x/tileSize - 1][player.position.y/tileSize - 1] != 2)){
      player.vx= -playerSpeed;
      player.vy = 0;
      direction[0] = "none";
    }
    if(previousDirection != 4 && previousDirection != 2 && direction[0] == "right" && !portal && (player.position.x == width - tileSize || levelVector[player.position.x/tileSize + 1][player.position.y/tileSize - 1] != 2)){
      player.vx = playerSpeed;
      player.vy = 0;
      direction[0] = "none";
    }
    if(direction[1] == "down" && (player.vy == -playerSpeed || player.vy == playerSpeed)){
      direction[1] = "none";
    }
    if(direction[1] == "up" && (player.vy == -playerSpeed || player.vy == playerSpeed)){
      direction[1] = "none";
    }
    if(direction[0] == "right" && (player.vx == -playerSpeed || player.vx == playerSpeed)){
      direction[0] = "none";
    }
    if(direction[0] == "left" && (player.vx == -playerSpeed || player.vx == playerSpeed)){
      direction[0] = "none";
    }
    previousPreviousDirection = previousDirection;
    if(player.vy == -playerSpeed){
      previousDirection = 1;
    }
    if(player.vy == playerSpeed){
      previousDirection = 3;
    }
    if(player.vx == playerSpeed){
      previousDirection = 2;
    }
    if(player.vx == -playerSpeed){
      previousDirection = 4
    }
    if(player.vx == playerSpeed){
      player.show(0);
    }
    if(player.vy == playerSpeed){
      player.show(1);
    }
    if(player.vy == -playerSpeed){
      player.show(3);
    }
    if(player.vx == -playerSpeed){
      player.show(2);
    }
    if(segments.length > 0){
      segments = [""].concat(segments);
      if(!addNew){
        if(segments[segments.length-1].position.x/tileSize >= 0 && segments[segments.length-1].position.x/tileSize < levelVector.length && segments[segments.length-1].position.y/tileSize - 1 >= 0 && segments[segments.length-1].position.y/tileSize - 1 <= levelVector[0].length){
         //THIS LINE MUST BE TURNING LEGITIMATE BLOCKS INTO 1'S!
          //console.log(levelVector[segments[segments.length-1].position.x/tileSize][segments[segments.length-1].position.y/tileSize - 1]);
          if(levelVector[segments[segments.length-1].position.x/tileSize][segments[segments.length-1].position.y/tileSize - 1] == 9){
            levelVector[segments[segments.length-1].position.x/tileSize][segments[segments.length-1].position.y/tileSize - 1] = 1;
          }
        }
        segments[0] = segments.pop();
        segments[0].visible = true;
      }else{
        segments[0] = pool.pop();
        segments[0].visible = true;
      }
      segments[0].position.x = player.position.x;
      segments[0].position.y = player.position.y;
      if(segments[0].position.x/tileSize >= 0 && segments[0].position.x/tileSize < levelVector.length && segments[0].position.y/tileSize - 1 >= 0 && segments[0].position.y/tileSize - 1 <= levelVector[0].length){
        if(levelVector[segments[0].position.x/tileSize][segments[0].position.y/tileSize - 1] == 1){
          levelVector[segments[0].position.x/tileSize][segments[0].position.y/tileSize - 1] = 9;
        }
      }
    }else{
      if(addNew){
        segments.push(pool.pop());
        segments[0].visible = true;
        segments[0].position.x = player.position.x;
        segments[0].position.y = player.position.y;
        if(levelVector[segments[0].position.x/tileSize][segments[0].position.y/tileSize - 1] == 1){
          levelVector[segments[0].position.x/tileSize][segments[0].position.y/tileSize - 1] = 9;
        }
      }
    }
    g.move(player);
    addNew = false;
    portal = 0;
    if(g.hitTestRectangle(player,portals[0])){
      player.position.x = portals[1].position.x;
      player.position.y = portals[1].position.y;
      portal = 1;
    }else if(g.hitTestRectangle(player,portals[1])){
      player.position.x = portals[0].position.x;
      player.position.y = portals[0].position.y;
      portal = 1;
    }
    if(g.hitTestRectangle(player,portals2[0])){
      player.position.x = portals2[1].position.x;
      player.position.y = portals2[1].position.y;
      portal = 1;
    }else if(g.hitTestRectangle(player,portals2[1])){
      player.position.x = portals2[0].position.x;
      player.position.y = portals2[0].position.y;
      portal = 1;
    }
    if(g.hitTestRectangle(player,portals3[0])){
      player.position.x = portals3[1].position.x;
      player.position.y = portals3[1].position.y;
      portal = 1;
    }else if(g.hitTestRectangle(player,portals3[1])){
      player.position.x = portals3[0].position.x;
      player.position.y = portals3[0].position.y;
      portal = 1;
    }
    if(player.position.x >= width){
      player.position.x = 0;
    }else if(player.position.x < 0){
      player.position.x = width-tileSize;
    }
    if(player.position.y >= height){
      player.position.y = topBarHeight;
    }else if(player.position.y < topBarHeight){
      player.position.y = height-tileSize;
    }
    for(var i = 0; i < segments.length; i++){
      if(g.hitTestRectangle(player,segments[i]) && !portal){
        g.state = doNothing;
        doNothingClock = Date.now();
        if(previousDirection == 2){
          player.position.x -= 16;
        }if(previousDirection == 4){
          player.position.x += 16;
        }if(previousDirection == 1){
          player.position.y += 16;
        }if(previousDirection == 3){
          player.position.y -= 16;
        }
        break;
      }
    }
    for(var i = 0; i < poisons.length; i++){
      if(g.hitTestRectangle(player,poisons[i]) && !portal){
        g.state = doNothing;
        doNothingClock = Date.now();
        if(previousDirection == 2){
          player.position.x -= 16;
        }if(previousDirection == 4){
          player.position.x += 16;
        }if(previousDirection == 1){
          player.position.y += 16;
        }if(previousDirection == 3){
          player.position.y -= 16;
        }
        break;
      }
    }
    if(g.hitTestRectangle(player,pellet)){
      score++;
      addNew = true;
      scoreText.text = "Score:" + score.toString();
      placePellet(pellet, levelVector);
    }
  }
  if(framecount % 20 == 0){
    pellet.visible = !pellet.visible;
  }
  framecount ++;
}
