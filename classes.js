"use strict"


//pick dimensions divisible by 16
var Window;
  
PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
Window.tileHeight = 16;
Window.tileWidth = 16;
Window.width = 50 * Window.tileWidth;
Window.height = 37 * Window.tileHeight;
var g = hexi(Window.width, Window.height, setup, ["Fonts/PressStart2P.ttf","player.png"]);
g.renderer.resolution = 2;
class Utils{
  static snapXToGrid(x){
    return Math.floor(x/Window.tileWidth)*Window.tileWidth;
  }
  static snapYToGrid(y){
    return Math.floor(y/Window.tileHeight)*Window.tileHeight;
  }
  static moveToBack(entity){
    g.stage.remove(entity.drawable);
    g.stage.addChildAt(entity.drawable, 0);
  }
  static moveAllToBack(entities){
    for(var i = 0; i < entities.length; i++){
      Utils.moveToBack(entities[i]);
    }
  }
}
class Point{
  constructor(x,y){
    this._x = x;
    this._y = y;
  }
  get x(){
    return this._x;
  }
  get y(){
    return this._y;
  }
  _setX(x){
    this._x = x;
  }
  _setY(y){
    this._y = y;
  }
  _set(point,y){
    if(point instanceof Point){
      this._x = point.x;
      this._y = point.y;
    }else{
       this._x = point;
       this._y = y;
    }
  }
  equals(other){
    return this.x == other.x && this.y == other.y;
  }
}

class PlaySpace{
  constructor(top,left,width,height){
    this.top = top;
    this.left = left;
    this.width = width;
    this.height = height; 
  }
}

class Level{
  constructor(tilemap){
    this._tilemap = tilemap;
  }
  push(tile){
    this._tilemap.push(tile);
  }
  contains(type){
    for(var i = 0; i < this._tilemap.length; i++){
      if(this._tilemap[i].type == type){
        return true;
      }
    }
    return false;
  }
  //returns true if contains at least 'number' of 'type'
  containsCount(type,number){
    var count = 0;
    for(var i = 0; i < this._tilemap.length; i++){
      if(this._tilemap[i].type == type){
        count += 1;
        if(count == number){
          return true;
        }
      }
    }
    return false;
  }
  get(type){
    for(var i = 0; i < this._tilemap.length; i++){
      if(this._tilemap[i].type == type){
        return this._tilemap[i];
      }
    }
  }
}

class Game{
  constructor(top,left,width,height){
    this.gLevel = new Level([]);
    this.playSpace = new PlaySpace(top,left,width,height);
    this.playerCount = 1;
  }
}
var game = new Game(Window.tileHeight * 3,Window.tileWidth,Window.width-Window.tileWidth * 2,Window.height-(Window.tileHeight * 3) - Window.tileHeight);
game.playerCount = 0;
class Tile{
  constructor(x,y,type){
    this._position = new Point(x,y);
    this._anchor = new Point(0,0);
    this._type = type;
    game.gLevel.push(this);
  }
  get position(){
    return this._position;
  }
  get type(){
    return this._type;
  }
  _put(){
    //If a Tile or Point has been passed
    if(arguments.length == 1){
      if(arguments[0] instanceof Point){
        this._position._set(arguments[0]);
      }else if (arguments[0] instanceof Tile) {
        this._position._set(arguments[0].position);
      }
    //If two coordinates have been passed
    }else{
      this._position._setX(arguments[0]);
      this._position._setY(arguments[1]);
    }
  }

}


//enum for snake directions
const Direction = {
  up:"up",
  left:"left",
  right:"right",
  down:"down",
  none:"none"
}
Direction.opposite = function(direction){
  if(direction == Direction.up){
    return Direction.down;
  }
  if(direction == Direction.down){
    return Direction.up;
  }
  if(direction == Direction.left){
    return Direction.right;
  }
  if(direction == Direction.right){
    return Direction.left;
  }
}

//enum class for controls
const Controls = {
  up:0,
  down:1,
  left:2,
  right:3
}
/*class receives key presses in real time, but outputs them once a frame, to avoid a keypress
occurring during the logical evaluation.*/
class Controller{
  constructor(number){
    this._input = [];
    this._output = [];
    for(var i = 0; i < number; i++){
      this._input.push(0);
      this._output.push(0);
    }
  } 
  //to be called once per frame
  update(){
    for(var i = 0; i < this._output.length; i++){
      this._output[i] = this._input[i];
    }
    //clear all inputs
    for(var i = 0; i < this._input.length; i++){
      this._input[i] = 0;
    }
  }
  //clear one input
  deregisterInput(control){
    this._input[control] = 0;
  }
  //enter an input
  registerInput(control){
    this._input[control] = 1;
  }
  //receive output
  getOutput(control){
    return this._output[control];
  }
  //clear all inputs and outputs
  clearAll(){
    for(var i = 0; i < this._input.length; i++){
      this._input[i] = 0;
      this._output[i] = 0
    }
  }
}
class Rectangle extends Tile{
  constructor(x,y,type,width,height, color){
    super(x,y,type);
    this._rectangle = g.rectangle(width,height,color);
    this._rectangle.position.x = x;
    this._rectangle.position.y = y;
    //offset compensates for moving the anchor of the rectangle
    this._offset = new Point(0,0);
    //move rectangle into correct position;
    this._updateRectanglePosition();
  }
  //moves rectangle (the drawable that is visible to the player) into the position
  //dictated by the logic
  _updateRectanglePosition(){
    this._rectangle.position.x = this.position.x + this._offset.x;
    this._rectangle.position.y = this.position.y + this._offset.y;
  }
  put(x,y){
    if(typeof y != 'undefined'){
      super._put(x,y);
    }else{
      super._put(x);
    }
    this._updateRectanglePosition();
  }
  get drawable(){
    return this._rectangle;
  }
  kill(){
    this.put(-100,-100);
    this._rectangle.visible = false;
  }
  collidesWithPlayer(){
    for(var i = 0; i < game.gLevel._tilemap.length; i++){
      if(game.gLevel._tilemap[i].type == "head"){
        if(g.hitTestRectangle(this.drawable, game.gLevel._tilemap[i].drawable)){
          return true;
        }
      }
    }
    return false;
  }
}

class Sprite extends Tile{
  constructor(x,y,type,textures, offset){
    super(x,y,type);
    this._sprite = g.sprite(textures);
    this._sprite.position.x = x;
    this._sprite.position.y = y;
    //offset compensates for moving the anchor of the sprite
    this._offset = new Point(0,0);
    if(offset){
      this._offset = offset;
    }
    //move sprite into correct position
    this._updateSpritePosition();
  }
  //moves sprite (the drawable that is visible to the player) into the position
  //dictated by the logic
  _updateSpritePosition(){
    this._sprite.position.x = this.position.x + this._offset.x;
    this._sprite.position.y = this.position.y + this._offset.y;
  }
  put(x,y){
    if(typeof y != 'undefined'){
      super._put(x,y);
    }else{
      super._put(x);
    }
    this._updateSpritePosition();
  }
  get drawable(){
    return this._sprite;
  }
  //only move the logical position and not the sprite (useful for death animation)
  putLogical(x,y){
    this._position._set(x,y);
  }
}

class Head extends Sprite{
  constructor(x,y,offset,sprite){
    if(sprite == undefined){
      super(x,y,"head",["player.png"],offset);
    }else{
      super(x,y,"head",[sprite],offset);
    }
  }
}

class Segment extends Rectangle{
  constructor(x,y,color){
    super(x,y,"segment",Window.tileWidth,Window.tileHeight,color);
  }
}

class Wall extends Rectangle{
  constructor(x,y){
    super(x,y,"wall",Window.tileWidth,Window.tileHeight,"purple");
  }
}

class Portal extends Rectangle{
  constructor(x,y,color){
    super(x,y,"portal",Window.tileWidth, Window.tileHeight,color);
    this._pair;
  }
  link(portal){
    this._pair = portal;
  }
  get destination(){
    return this._pair;
  }
}

class Pellet extends Rectangle{
  constructor(x,y){
    super(x,y,"pellet",Window.tileWidth, Window.tileHeight, "yellow");
  }
  disappear(){
    this.drawable.visible = false;
  }
  reappear(){
    this.drawable.visible = true;
  }
  respawn(){
    this.drawable.visible = true;
    //place pellet within play area
    //pellet.put(Utils.snapXToGrid(Math.floor(Math.random() * (game.playSpace.width - Window.tileWidth))+game.playSpace.left),
    //Utils.snapYToGrid(Math.floor(Math.random() * (game.playSpace.height - Window.tileHeight))+game.playSpace.top));
   
    //list all positions in the playspace and append them to the list
    var numberOfXChoices = game.playSpace.width/Window.tileWidth;
    var numberOfYChoices = game.playSpace.height/Window.tileHeight;
    var choices = [];
    var validSpawn = 0;
    for(var x = 0; x < numberOfXChoices; x++){
      for(var y = 0; y < numberOfYChoices; y++){
        choices.push([x*Window.tileWidth + game.playSpace.left,y*Window.tileHeight + game.playSpace.top]);
      }
    }
    var randno = 0;
    var exit = 0;
    while(!validSpawn){
      exit = 0;
      //pick a random position from the list
      randno = Math.floor(Math.random() * choices.length);
      
      //test validity of position
      for(var i = 0; i < game.gLevel._tilemap.length; i++){
        if(game.gLevel._tilemap[i].position.x == choices[randno][0] &&
           game.gLevel._tilemap[i].position.y == choices[randno][1]){
          exit = 1;
        }
      }
      if(!exit){
        validSpawn = 1;
      }else{
        choices.splice(randno, 1);
      }
    }
    this.put(choices[randno][0], choices[randno][1]);

  }
}

class Snake{
  constructor(x,y, length, color, direction, sprite){
    this._alive = true;
    this._previousDirection;
    this._body = [];
    this._initialPoolSize = 30;
    this._color = color;
    this._framecount = 6;
    //add length segments to the body
    for(var i = 0; i < length; i++){
      this._body.push(new Segment(-100,-100, this._color));
      this._body[this._body.length - 1]._rectangle.visible = false;
    }
    //add initalPoolSize many segments to the pool
    this._pool = [];
    for(var i = 0; i < this._initialPoolSize; i++){
      this._pool.push(new Segment(-100,-100, this._color));
      this._pool[this._pool.length - 1]._rectangle.visible = false;
    }
    if(sprite == undefined){
      this._head = new Head(x,y,new Point(8,8));
    }else{
      this._head = new Head(x,y,new Point(8,8), sprite);
    }
    this._head.drawable.anchor.x = 0.5;
    this._head.drawable.anchor.y = 0.5;
    //set starting direction
    if(direction){
      this.face(direction);
    }else{
      this.face(Direction.right);
    }
  }
  get alive(){
    return this._alive;
  }
  get framecount(){
    return this._framecount;
  }
  move(){
    //move last segment to head and make visible
    this._body[this._body.length - 1].put(this._head);
    this._body[this._body.length - 1]._rectangle.visible = true;
    //move head in direction
    this._head.put(this._head.position.x + this._vx * Window.tileWidth, this._head.position.y + this._vy * Window.tileHeight);
    //make the last segment the first
    this._body = [""].concat(this._body);
    this._body[0] = this._body.pop();
  }
  addSegment(number){
    //move 'number' segments from pool to body
    while(number > this._pool.length){
      this._pool.push(new Segment(-100,-100, this._color));
      this._pool[this._pool.length - 1]._rectangle.visible = false;
    }
    for(var i = 0; i < number; i++){
      this._pool[this._pool.length - 1]._rectangle.visible = true;
      this._body.push(this._pool.pop());
      this._body[this._body.length - 1].put(this._body[this._body.length - 2]);
    }
  }
  //move all segments back into the pool
  clearSegments(){
    var length = this._body.length;
    for(var i = 0; i < length; i++){
      this._body[this._body.length - 1]._rectangle.visible = false;
      //move segments to the 'garbage' position of -100,-100
      this._body[this._body.length - 1].put(-100,-100);
      this._pool.push(this._body.pop());
    }
  }
  face(toFace){
    this._previousDirection = this.direction;
    //pick velocity and rotate the head in the desired direction
    if(toFace == Direction.up){
      this._vx = 0;
      this._vy = -1;
      this._head.drawable.rotation = Math.PI * 3 /2;
    }
    if(toFace == Direction.left){
      this._vx = -1;
      this._vy = 0;
      this._head.drawable.rotation = Math.PI;
    }
    if(toFace == Direction.down){
      this._vx = 0;
      this._vy = 1;
      this._head.drawable.rotation = Math.PI * 1/2;
    }
    if(toFace == Direction.right){
      this._vx = 1;
      this._vy = 0;
      this._head.drawable.rotation = 0;
    }
  }
  wrap(){
    if(this.position.x >=  game.playSpace.left + game.playSpace.width){
      this.put(game.playSpace.left,this.position.y);
    }else if(this.position.x < game.playSpace.left){
      this.put(game.playSpace.left + game.playSpace.width - Window.tileWidth, this.position.y);
    }else if(this.position.y < game.playSpace.top){
      this.put(this.position.x, game.playSpace.top + game.playSpace.height - Window.tileHeight);
    }else if(this.position.y >= game.playSpace.top + game.playSpace.height){
      this.put(this.position.x, game.playSpace.top);
    }
  }
  //returns all the tiles 1 tile infront of the snake (including the head of the snake itself)
  look(){
    //move head forwards by 1 tile
    this.translate(this._vx * Window.tileWidth,this._vy * Window.tileHeight);
    this.wrap();
    var collidedWith = new Level([]);
    var adjustedPosition = new Point(0,0);
    adjustedPosition._setX(this._head._sprite.position.x - this._head._offset.x);
    adjustedPosition._setY(this._head._sprite.position.y - this._head._offset.y);
    for(var i = 0; i < game.gLevel._tilemap.length; i++){
      if(adjustedPosition.equals(game.gLevel._tilemap[i].position)){
        collidedWith.push(game.gLevel._tilemap[i]);
      }
    }
    //move head backwards by 1 tile to return it to original position
    this.translate(-this._vx * Window.tileWidth,-this._vy * Window.tileHeight);
    this.wrap();
    return collidedWith;
  }
  put(x,y){
    this._head.put(x,y);
  }
  translate(x,y){
    this._head.put(this._head.position.x + x, this._head.position.y + y);
  }
  kill(){
    //move head but not head sprite as head sprite needs to undergo death animation
    //this._head.putLogical(-100,-100);
    this._head.put(-100,-100);
    this._vx = 0;
    this._vy = 0;
    this.clearSegments()
    this._alive = false;
  }
  respawn(x,y,segments, direction){
    this.reappear();
    this.put(x,y);
    if(direction == undefined){
      direction = Direction.right;
    }
    this.face(direction);
    this.addSegment(segments);
    this._alive = true;
  }
  get previousDirection(){
    return this._previousDirection;
  }
  get direction(){
    if(this._vx == 1){
      return Direction.right;
    }
    if(this._vx == -1){
      return Direction.left;
    }
    if(this._vy == 1){
      return Direction.down;
    }
    if(this._vy == -1){
      return Direction.up;
    }
  }
  get position(){
    return this._head.position;
  }
  get alive(){
    return this._alive;
  }
  disappear(){
    this._head.drawable.visible = false;
  }
  reappear(){
    this._head.drawable.visible = true;
  }
}

class Player{
  constructor(x,y,length,color,direction,sprite){
    //40px produces no blur
    //32px also produces no blur
    this._score = 0;
    this.controller = new Controller(4);
    this._snake = new Snake(x,y,length,color,direction,sprite);
    this._inputs = [Direction.none, Direction.none];
    this._respawnPosition = new Point(x, y);
    this._startDirection = direction;
  }
  kill(){
    this.clearScore();
    this._inputs = [Direction.none, Direction.none];
    this.controller.clearAll();
    this._snake.kill(); 
  }
  get framecount(){
    return this._snake.framecount;
  }
  respawn(){
   // this._snake.respawn(Utils.snapXToGrid(game.playSpace.left + game.playSpace.width/2),
   // Utils.snapYToGrid(game.playSpace.top + game.playSpace.height/2),2);    
      this._snake.respawn(this._respawnPosition.x, this._respawnPosition.y,2, this._startDirection);

  }
  get score(){
    return this._score;
  }
  _setScoreText(string){
    if(this._scoreText){
      this._scoreText.text = "Score:" + string;
    }
  }
  clearScore(){
    this._score = 0;
    this._setScoreText(this._score.toString());
  }
  incrementScore(){
    this._score ++;
    this._setScoreText(this._score.toString());
  }
  performLogic(){
    this.controller.update();
    if(this.controller.getOutput(Controls.up)){
      this._inputs[1] = Direction.up;
    }
    if(this.controller.getOutput(Controls.right)){
      this._inputs[0] = Direction.right;
    }
    if(this.controller.getOutput(Controls.down)){
      this._inputs[1] = Direction.down;
    }
    if(this.controller.getOutput(Controls.left)){
      this._inputs[0] = Direction.left;
    }
    if(this._snake.alive){
      //deal with multiple inputs at a time, for example [right, down]
      if(this._snake.direction == Direction.right || this._snake.direction == Direction.left){
        this._snake.face(this._inputs[1]);
        this._inputs[1] = Direction.none;
      }else if(this._snake.direction == Direction.up || this._snake.direction == Direction.down){
        this._snake.face(this._inputs[0]);
        this._inputs[0] = Direction.none;
      }
      //get rid of second input if it has been around for more than one move.
      if(this._snake.previousDirection == this._snake.direction){
        if(this._snake.direction == this._inputs[0] || this._snake.direction == Direction.opposite(this._inputs[0])){
          this._inputs[0] = Direction.none;
        }
        if(this._snake.direction == this._inputs[1] || this._snake.direction == Direction.opposite(this._inputs[1])){
          this._inputs[1] = Direction.none;
        }
      }
      var collisions = this._snake.look();
      //collision logic:
      if(collisions.contains("pellet")){
        this.incrementScore();
        if(game.playerCount == 1){
          this._snake.addSegment(20);
        }
      }
      if(collisions.contains("segment")||collisions.contains("wall")||collisions.containsCount("head",2)){
        this.kill();
      }else{
        this._snake.move();
        if(collisions.contains("portal")){
          this._snake.put(collisions.get("portal").destination.position);
          //test again for segments, walls and pellets on other side of portal
          collisions = this._snake.look();
          if(collisions.contains("segment")||collisions.contains("wall")||collisions.containsCount("head",2)){
            this.kill();
          }else if(collisions.contains("pellet")){
            this.incrementScore();
            if(game.playerCount == 1){
              this._snake.addSegment(20);
            }
          }
          //move head one forward
          this._snake._head.put(this._snake._head.position.x + this._snake._vx * Window.tileWidth,
             this._snake._head.position.y + this._snake._vy * Window.tileHeight);   
        }
      }
      //make snake wrap around edges of play space
      this._snake.wrap();
    }
  }
}

function setup(){
  g.state = play;
  game.menu = true;
  //define scoreText here as it sometimes does not appear otherwise: bug?
  game.scoreText = g.text("Score:0", "32px PressStart2P","red");
  game.scoreText.visible = false;
  game.scoreText.resolution = 4;
  
  game.menuText = g.text("Wormhole", "64px PressStart2P", "red");
  game.menuText.position.x = Utils.snapXToGrid(140);
  game.menuText.position.y = Utils.snapYToGrid(148);
  game.menuText.resolution = 4;
  game.singlePlayerText = g.text("Singleplayer","32px PressStart2P","red");
  game.singlePlayerText.position.x = 128;
  game.singlePlayerText.position.y = 295;
  game.singlePlayerText.resolution = 4;
  game.twoPlayerText = g.text("Two player","32px PressStart2P","red");
  game.twoPlayerText.position.x = 125;
  game.twoPlayerText.position.y = 385;
  game.twoPlayerText.resolution = 4;
  game.player1WinText = g.text("Player 1 wins!", "32px PressStart2P","green");
  game.player1WinText.visible = false;
  game.player1WinText.position.x = 172;
  game.player1WinText.position.y = 7;
  game.player1WinText.resolution = 4;
  game.player2WinText = g.text("Player 2 wins!", "32px PressStart2P","purple");
  game.player2WinText.visible = false;
  game.player2WinText.position.x = 172;
  game.player2WinText.position.y = 7;
  game.player2WinText.resolution = 4;
  game.countdownText = g.text("3", "40px PressStart2P", "red");
  game.countdownText.visible = false;
  game.countdownText.position.x = 370;
  game.countdownText.position.y = 230;
  game.countdownText.resolution = 4;

  game.shortened = 0;
  //define scoreText here as it sometimes does not appear otherwise: bug?
  //borders of the playspace
  var line = g.line("red",3,game.playSpace.left,game.playSpace.top-2,game.playSpace.left + game.playSpace.width,game.playSpace.top-2);
  var line = g.line("red",3,game.playSpace.left,game.playSpace.top + game.playSpace.height + 1
  ,game.playSpace.left + game.playSpace.width, game.playSpace.top + game.playSpace.height + 1);
  var line = g.line("red",3,game.playSpace.left-1,game.playSpace.top-3,game.playSpace.left-1,game.playSpace.top + game.playSpace.height + 3);
  var line = g.line("red",3,game.playSpace.left + game.playSpace.width + 2,game.playSpace.top-3
  ,game.playSpace.left + game.playSpace.width + 2, game.playSpace.top + game.playSpace.height + 3);

}
