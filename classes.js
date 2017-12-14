"use strict"
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

class Tile{
  constructor(x,y,type){
    this._position = new Point(x,y);
    this._anchor = new Point(0,0);
    this._type = type;
  }
  get position(){
    return this._position;
  }
  get type(){
    return this.type;
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
