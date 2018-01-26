"use strict";
g.backgroundColor = "black";
g.fps = 60;
g.smoothie.interpolate = false;
g.start();
if(game.playerCount == 1){
  var portal1 = new Portal(10 * Window.tileWidth, 11 * Window.tileHeight, "magenta");
  var portal2 = new Portal(23 * Window.tileWidth, 24 * Window.tileHeight, "magenta");
  portal1.link(portal2);
  portal2.link(portal1);
  var portal3 = new Portal(10 * Window.tileWidth, 24 * Window.tileWidth, "blue");
  var portal4 = new Portal(23 * Window.tileWidth, 11 * Window.tileWidth, "blue");
  portal3.link(portal4);
  portal4.link(portal3);
  var portal5 = new Portal(43 * Window.tileWidth, 11 * Window.tileWidth, "turquoise");
  var portal6 = new Portal(43 * Window.tileWidth, 24 * Window.tileWidth, "turquoise");
  portal5.link(portal6);
  portal6.link(portal5);
  var player = new Player(Utils.snapXToGrid(game.playSpace.left + game.playSpace.width/2),
  Utils.snapYToGrid(game.playSpace.top + game.playSpace.height/2),2);
  //define scoreText here as it sometimes does not appear otherwise: bug?
  player._scoreText = g.text("Score:0","32px Arial","red");
  player._scoreText.resolution = 1;
  player._scoreText.x = game.playSpace.left;
  player._scoreText.y = 7;
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
  

}
function reset(){

}
function play(){
  if(game.playerCount == 1){
    if(document.hasFocus()){
    if(framecount % 8 == 0){
    player.performLogic();
    }
    if(pellet.collidesWithPlayer()){
      pellet.kill();
      pellet.respawn();
    }
    if(player._snake.alive == false){
      pellet.respawn();
      player.respawn();
    }
    framecount ++;
    }
  }
}
