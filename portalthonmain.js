g.backgroundColor = "black";
g.fps = 60;
g.smoothie.interpolate = false;
g.start();

function reset(){

}
document.onclick = function(){
  window.focus();
  if(game.menu){
    if(game.playerCount != 0){
      closeMenu();
    }
    if(game.playerCount == 1){
      setupOnePlayer();
      game.menu = false;
    }
  }
}
function menu(){
  
}
function closeMenu(){
  game.menuText.visible = false;
}
function setupOnePlayer(){
  if(game.playerCount == 1){
    portal1 = new Portal(10 * Window.tileWidth, 11 * Window.tileHeight, "magenta");
    portal2 = new Portal(23 * Window.tileWidth, 24 * Window.tileHeight, "magenta");
    portal1.link(portal2);
    portal2.link(portal1);
    portal3 = new Portal(10 * Window.tileWidth, 24 * Window.tileWidth, "blue");
    portal4 = new Portal(23 * Window.tileWidth, 11 * Window.tileWidth, "blue");
    portal3.link(portal4);
    portal4.link(portal3);
    portal5 = new Portal(43 * Window.tileWidth, 11 * Window.tileWidth, "turquoise");
    portal6 = new Portal(43 * Window.tileWidth, 24 * Window.tileWidth, "turquoise");
    portal5.link(portal6);
    portal6.link(portal5);
    Utils.moveAllToBack([portal1, portal2, portal3, portal4, portal5, portal6]);
    game.framecount = 0;
    leftArrow = g.keyboard(65);
    upArrow = g.keyboard(87);
    rightArrow = g.keyboard(68);
    downArrow = g.keyboard(83);
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
    pellet = new Pellet(10 * Window.tileWidth, 5 * Window.tileHeight);
    pellet.kill();
    player.kill();
    player.respawn();
    pellet.respawn();
    player._scoreText.visible = true;
    
  }
}
function play(){
  console.log("active");
  if(game.menu){
    menu();
  }else{
    gameLoop();
    
  }
}
function gameLoop(){
  if(game.playerCount == 1){
    if(document.hasFocus()){
    if(game.framecount % 30 == 0){
      pellet.reappear();
    }
    if(game.framecount % 60 == 0){
      pellet.disappear();
    }
    if(game.framecount % 8 == 0){
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
    game.framecount ++;
    }
  }
}
