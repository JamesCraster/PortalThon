"use strict";
g.backgroundColor = "black";
g.fps = 60;
g.smoothie.interpolate = false;
g.start();


var framecount = 0;
var leftArrow = g.keyboard(65);
var upArrow = g.keyboard(87);
var rightArrow = g.keyboard(68);
var downArrow = g.keyboard(83);
leftArrow.press = () =>{
  player.controller.registerInput(Controls.left);
  player.controller.deregisterInput(Controls.right);
}
rightArrow.press = () =>{
  player.controller.registerInput(Controls.right);
  player.controller.deregisterInput(Controls.left);
}
upArrow.press = () =>{
  player.controller.registerInput(Controls.up);
  player.controller.deregisterInput(Controls.down);
}
downArrow.press = () =>{
  player.controller.registerInput(Controls.down);
  player.controller.deregisterInput(Controls.up);
}
var pellet = new Pellet(10 * Window.tileWidth, 5 * Window.tileHeight);
pellet.kill();
pellet.respawn();
var portal1 = new Portal(5 * Window.tileWidth, 5 * Window.tileHeight, "magenta");
var portal2 = new Portal(10 * Window.tileWidth, 10 * Window.tileWidth, "magenta");
portal1.link(portal2);
portal2.link(portal1);
function reset(){

}
function play(){
  if(framecount % 12 == 0){
   player.performLogic();
  }
  if(pellet.collidesWithPlayer()){
    pellet.kill();
    pellet.respawn();
  }
  framecount ++;
}
