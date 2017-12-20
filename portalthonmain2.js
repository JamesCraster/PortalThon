"use strict";
const width = 700;
const height = 700;
const tileHeight = 16;
const tileWidth = 16;
var g = hexi(width, height, setup, ["Fonts/PressStart2P.ttf", "player.png", "playerup.png", "playerdown.png", "playerleft.png"],load);
g.backgroundColor = "black";
g.fps = 60;
g.smoothie.interpolate = false;
g.start();

var snake = new Snake(0,0,20);
var controller = new Controller(4);
var framecount = 0;
var leftArrow = g.keyboard(65);
var upArrow = g.keyboard(87);
var rightArrow = g.keyboard(68);
var downArrow = g.keyboard(83);
leftArrow.press = () =>{
  controller.registerInput(Controls.left);
}
rightArrow.press = () =>{
  controller.registerInput(Controls.right);
}
upArrow.press = () =>{
  controller.registerInput(Controls.up);
}
downArrow.press = () =>{
  controller.registerInput(Controls.down);
}

function load(){
}
function setup(){
  g.state = play;

}

function play(){
  if(framecount % 13 == 0){
    controller.update();
    if(controller.getOutput(Controls.up)){
      snake.face(Direction.up);
    }
    if(controller.getOutput(Controls.right)){
      snake.face(Direction.right);
    }
    if(controller.getOutput(Controls.down)){
      snake.face(Direction.down);
    }
    if(controller.getOutput(Controls.left)){
      snake.face(Direction.left);
    }
    snake.move();
  }
  framecount ++;
}
