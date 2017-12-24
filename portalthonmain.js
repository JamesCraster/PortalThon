"use strict";
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
  controller.deregisterInput(Controls.right);
}
rightArrow.press = () =>{
  controller.registerInput(Controls.right);
  controller.deregisterInput(Controls.left);
}
upArrow.press = () =>{
  controller.registerInput(Controls.up);
  controller.deregisterInput(Controls.down);
}
downArrow.press = () =>{
  controller.registerInput(Controls.down);
  controller.deregisterInput(Controls.up);
}

var inputs = [Direction.none, Direction.none];
function play(){
  if(framecount % 13 == 0){
    controller.update();
    if(controller.getOutput(Controls.up)){
      inputs[1] = Direction.up;
    }
    if(controller.getOutput(Controls.right)){
      inputs[0] = Direction.right;
    }
    if(controller.getOutput(Controls.down)){
      inputs[1] = Direction.down;
    }
    if(controller.getOutput(Controls.left)){
      inputs[0] = Direction.left;
    }
    if(snake.direction == Direction.right || snake.direction == Direction.left){
      snake.face(inputs[1]);
      inputs[1] = Direction.none;
    }else if(snake.direction == Direction.up || snake.direction == Direction.down){
      snake.face(inputs[0]);
      inputs[0] = Direction.none;
    }
    if(snake.previousDirection == snake.direction){
      if(snake.direction == inputs[0] || snake.direction == Direction.opposite(inputs[0])){
        inputs[0] = Direction.none;
      }
      if(snake.direction == inputs[1] || snake.direction == Direction.opposite(inputs[1])){
        inputs[1] = Direction.none;
      }
    }
    var collisions = snake.look();
    if(collisions.contains("segment")||collisions.contains("wall")){
      snake.kill();
    }
    snake.move();
  }
  framecount ++;
}
