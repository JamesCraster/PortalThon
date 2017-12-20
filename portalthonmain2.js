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

//enum class for snake directions
const Direction = {
  up:"up",
  left:"left",
  right:"right",
  down:"down"
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
  registerInput(control){
    this._input[control] = 1;
  }
  getOutput(control){
    return this._output[control];
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
    this._body = [];
    this._initialPoolSize = 30;
    for(var i = 0; i < length; i++){
      this._body.push(new Segment(x,y));
      this._body[this._body.length - 1]._rectangle.visible = false;
    }
    this._pool = [];
    for(var i = 0; i < this._initialPoolSize; i++){
      this._pool.push(new Segment(x,y));
      this._pool[this._pool.length - 1]._rectangle.visible = false;
    }
    this._head = new Head(x,y);
    this._vx = 1;
    this._vy = 0;
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
  face(direction){
    if(direction == Direction.up){
      this._vx = 0;
      this._vy = -1;
      this._head._sprite.show(3);
    }
    if(direction == Direction.left){
      this._vx = -1;
      this._vy = 0;
      this._head._sprite.show(2);
    }
    if(direction == Direction.down){
      this._vx = 0;
      this._vy = 1;
      this._head._sprite.show(1);
    }
    if(direction == Direction.right){
      this._vx = 1;
      this._vy = 0;
      this._head._sprite.show(0);
    }
  }
}

class Level{
  constructor(){
    this._tilemap = [];
  }
}

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
