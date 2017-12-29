"use strict"
const width = 700;
const height = 700;
const tileHeight = 16;
const tileWidth = 16;
var g = hexi(width, height, setup, ["Fonts/PressStart2P.ttf", "player.png", "playerup.png", "playerdown.png", "playerleft.png"],load);


function load(){
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
  _set(point){
    this._x = point.x;
    this._y = point.y;
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
}

class typeList{
  constructor(){
    this._list = [];
  }
  push(type){
    this._list.push(type);
  }
  contains(type){
    for(var i = 0; i < this._list.length; i++){
      if(this._list[i] == type){
        return true;
      }
    }
    return false;
  }
}
var gLevel = new Level([]);

class Tile{
  constructor(x,y,type){
    this._position = new Point(x,y);
    this._anchor = new Point(0,0);
    this._type = type;
    gLevel.push(this);
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
  }
  _updateRectanglePosition(){
    this._rectangle.position.x = this.position.x;
    this._rectangle.position.y = this.position.y;
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
    for(var i = 0; i < gLevel._tilemap.length; i++){
      if(g.hitTestRectangle(this.drawable, gLevel._tilemap[i].drawable)){
        if(gLevel._tilemap[i].type == "head"){
          return true;
        }
      }
    }
    return false;
  }
}

class Sprite extends Tile{
  constructor(x,y,type,textures){
    super(x,y,type);
    this._sprite = g.sprite(textures);
    this._sprite.position.x = x;
    this._sprite.position.y = y;
  }
  _updateSpritePosition(){
    this._sprite.position.x = this.position.x;
    this._sprite.position.y = this.position.y;
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
}

class Head extends Sprite{
  constructor(x,y){
    super(x,y,"head",["player.png","playerdown.png", "playerleft.png", "playerup.png"]);
  }
}

class Segment extends Rectangle{
  constructor(x,y){
    super(x,y,"segment",tileWidth,tileHeight,0x167311);
  }
}

class Wall extends Rectangle{
  constructor(x,y){
    super(x,y,"wall",tileWidth,tileHeight,"purple");
  }
}

class Portal extends Rectangle{
  constructor(x,y,color){
    super(x,y,"portal",tileWidth, tileHeight,color);
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
    super(x,y,"pellet",tileWidth, tileHeight, "yellow");
  }
}

class Snake{
  constructor(x,y, length){
    this._alive = true;
    this._previousDirection;
    this._body = [];
    this._initialPoolSize = 30;
    //add length segments to the body
    for(var i = 0; i < length; i++){
      this._body.push(new Segment(-100,-100));
      this._body[this._body.length - 1]._rectangle.visible = false;
    }
    //add initalPoolSize many segments to the pool
    this._pool = [];
    for(var i = 0; i < this._initialPoolSize; i++){
      this._pool.push(new Segment(-100,-100));
      this._pool[this._pool.length - 1]._rectangle.visible = false;
    }
    this._head = new Head(x,y);
    this._vx = 1;
    this._vy = 0;
  }
  get alive(){
    return this._alive;
  }
  move(){
    //move last segment to head and make visible
    this._body[this._body.length - 1].put(this._head);
    this._body[this._body.length - 1]._rectangle.visible = true;
    //move head in direction
    this._head.put(this._head.position.x + this._vx * tileWidth, this._head.position.y + this._vy * tileHeight);
    //make the last segment the first
    this._body = [""].concat(this._body);
    this._body[0] = this._body.pop();
  }
  addSegment(number){
    //move 'number' segments from pool to body
    for(var i = 0; i < number; i++){
      this._pool[this._pool.length - 1]._rectangle.visible = true;
      this._body.push(this._pool.pop());
      this._body[this._body.length - 1].put(this._body[this._body.length - 2]);
    }
  }
  clearSegments(){
    var length = this._body.length;
    for(var i = 0; i < length; i++){
      this._body[this._body.length - 1]._rectangle.visible = false;
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
      this._head._sprite.show(3);
    }
    if(toFace == Direction.left){
      this._vx = -1;
      this._vy = 0;
      this._head._sprite.show(2);
    }
    if(toFace == Direction.down){
      this._vx = 0;
      this._vy = 1;
      this._head._sprite.show(1);
    }
    if(toFace == Direction.right){
      this._vx = 1;
      this._vy = 0;
      this._head._sprite.show(0);
    }
  }
  //returns all the tiles 1 tile infront of the snake (including the head of the snake itself)
  look(){
    this._head._sprite.position.x += this._vx * tileWidth;
    this._head._sprite.position.y += this._vy * tileHeight;
    var collidedWith = new typeList();
    for(var i = 0; i < gLevel._tilemap.length; i++){
      if(g.hitTestRectangle(this._head._sprite, gLevel._tilemap[i].drawable)){
        collidedWith.push(gLevel._tilemap[i].type);
      }
    }
    this._head._sprite.position.x -= this._vx * tileWidth;
    this._head._sprite.position.y -= this._vy * tileHeight;
    return collidedWith;
  }
  put(x,y){
    this._head.put(x,y);
  }
  kill(){
    this.put(-100,-100);
    this._vx = 0;
    this._vy = 0;
    this.clearSegments()
    this._alive = false;
  }
  respawn(x,y,segments){
    this.put(x,y);
    this.face(Direction.right);
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
}

class Player{
  constructor(x,y,length){
    //40px produces no blur
    //32px also produces no blur
    this._score = 0;
    this.controller = new Controller(4);
    this._snake = new Snake(x,y,length);
    this._inputs = [Direction.none, Direction.none];
  }
  kill(){
    this.clearScore();
    this._inputs = [Direction.none, Direction.none];
    this.controller.clearAll();
    this._snake.kill();
    this._snake.respawn(0,0,3);    
  }
  get score(){
    return this._score;
  }
  _setScoreText(string){
    this._scoreText.text = "Score:" + string;
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
      if(this._snake.direction == Direction.right || this._snake.direction == Direction.left){
        this._snake.face(this._inputs[1]);
        this._inputs[1] = Direction.none;
      }else if(this._snake.direction == Direction.up || this._snake.direction == Direction.down){
        this._snake.face(this._inputs[0]);
        this._inputs[0] = Direction.none;
      }
      if(this._snake.previousDirection == this._snake.direction){
        if(this._snake.direction == this._inputs[0] || this._snake.direction == Direction.opposite(this._inputs[0])){
          this._inputs[0] = Direction.none;
        }
        if(this._snake.direction == this._inputs[1] || this._snake.direction == Direction.opposite(this._inputs[1])){
          this._inputs[1] = Direction.none;
        }
      }
      var collisions = this._snake.look();
      if(collisions.contains("pellet")){
        this.incrementScore();
        this._snake.addSegment(3);
      }
      if(collisions.contains("segment")||collisions.contains("wall")){
        this.kill();
      }else{
        this._snake.move();
      }
      if(this._snake.position.x >=  width){
        this._snake.put(0,this._snake.position.y);
      }else if(this._snake.position.x < 0){
        this._snake.put(width - tileWidth, this._snake.position.y);
      }else if(this._snake.position.y < 0){
        this._snake.put(this._snake.position.x, height - tileHeight);
      }else if(this._snake.position.y >= height){
        this._snake.put(this._snake.position.x, 0);
      }
  }
  }
}


var player = new Player(0,0,2);

function setup(){
  g.state = play;
  player._scoreText = g.text("Score:0","32px PressStart2P","red");
  player._scoreText.resolution = 1;
}
