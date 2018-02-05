g.backgroundColor = "black";
g.fps = 60;
g.smoothie.interpolate = false;
g.start();
var mousePos = new Point(0,0);
//get mouse position each frame
g.canvas.addEventListener('mousemove',function(evt){
  var rect = g.canvas.getBoundingClientRect();
  mousePos._setX(evt.clientX - rect.left);
  mousePos._setY(evt.clientY - rect.top);
});
function reset(){

}

document.onclick = function(){
  window.focus();
  if(game.menu){
    //if singleplayer text selected
    if(mousePos.x > game.singlePlayerText.position.x &&
       mousePos.x < game.singlePlayerText.position.x + game.singlePlayerText.width
       && mousePos.y > game.singlePlayerText.position.y &&
       mousePos.y < game.singlePlayerText.position.y + game.singlePlayerText.height){
       game.playerCount = 1;
    }
    if(mousePos.x > game.twoPlayerText.position.x &&
      mousePos.x < game.twoPlayerText.position.x + game.twoPlayerText.width
      && mousePos.y > game.twoPlayerText.position.y &&
      mousePos.y < game.twoPlayerText.position.y + game.twoPlayerText.height){
      game.playerCount = 2;
   }
    if(game.playerCount != 0){
      closeMenu();
    }
    if(game.playerCount == 1){
      setupOnePlayer();
      game.menu = false;
    }
    if(game.playerCount == 2){
      setupTwoPlayer();
      game.menu = false;
    }
  }
}
function menu(){
  
}
function closeMenu(){
  game.menuText.visible = false;
  game.singlePlayerText.visible = false; 
  game.twoPlayerText.visible = false;
}
function setupOnePlayer(){
  player = new Player(Utils.snapXToGrid(game.playSpace.left + game.playSpace.width/2),
  Utils.snapYToGrid(game.playSpace.top + game.playSpace.height/2),2,0x167311);
  player._scoreText = game.scoreText;
  player._scoreText.resolution = 1;
  player._scoreText.x = game.playSpace.left;
  player._scoreText.y = 7;
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
  pellet.respawn();
  player._scoreText.visible = true;
}
function setupTwoPlayer(){
  player = new Player(Utils.snapXToGrid(game.playSpace.left + 3*game.playSpace.width/4),
  Utils.snapYToGrid(game.playSpace.top + game.playSpace.height/2),2,0x167311, Direction.left);
  player2 = new Player(Utils.snapXToGrid(game.playSpace.left + game.playSpace.width/4),
  Utils.snapYToGrid(game.playSpace.top + game.playSpace.height/2),2,0x5f0291, Direction.right);
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
  leftArrow2 = g.keyboard(37);
  upArrow2 = g.keyboard(38);
  rightArrow2 = g.keyboard(39);
  downArrow2 = g.keyboard(40);
  leftArrow2.press = () =>{
    player2.controller.registerInput(Controls.left);
    player2.controller.deregisterInput(Controls.right);
  }
  rightArrow2.press = () =>{
    player2.controller.registerInput(Controls.right);
    player2.controller.deregisterInput(Controls.left);
  }
  upArrow2.press = () =>{
    player2.controller.registerInput(Controls.up);
    player2.controller.deregisterInput(Controls.down);
  }
  downArrow2.press = () =>{
    player2.controller.registerInput(Controls.down);
    player2.controller.deregisterInput(Controls.up);
  }
  pellet = new Pellet(10 * Window.tileWidth, 5 * Window.tileHeight);
  pellet.kill();
  pellet.respawn();
}
function play(){
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
  if(game.playerCount == 2){
    if(document.hasFocus()){
    if(game.framecount % 30 == 0){
      pellet.reappear();
    }
    if(game.framecount % 60 == 0){
      pellet.disappear();
    }
    if(game.framecount % 15 == 0){
      player._snake.addSegment(1);
      player2._snake.addSegment(1);
    }
    if(game.framecount % 8 == 0){
      player.performLogic();
      player2.performLogic();
    }
    if(pellet.collidesWithPlayer()){
      pellet.kill();
      pellet.respawn();
    }
    if(player._snake.alive == false){
     // player.respawn();
    }
    if(player2._snake.alive == false){
     // player2.respawn();
    }
    game.framecount ++;
    }
  }
}
