"use strict";
function loadLevel(level, width, height, tileSize){
  levelVector = [];
  for(var x = 0; x < width/tileSize; x++){
    levelVector.push([]);
  }
  var count = 0;
  for(var x = 0; x < levelVector.length; x++){
    for(var y = 0; y < height/tileSize; y++){
      count ++;
      if(count <= level.length && count != 0){
          levelVector[x].push(parseInt(level[count]));
      }
      if(count == level.length){
        levelVector[x][y] = 0;
      }
    }
  }
  return levelVector;
}

function placePortal(levelVector, portal, id){
  for(var x = 0; x < levelVector.length; x++){
    for(var y = 0; y < levelVector[x].length; y++){
      if(levelVector[x][y] == id){
        portal.position.x = x * tileSize;
        portal.position.y = y * tileSize + tileSize;
      }
    }
  }
}

function placePellet(pellet, levelVector){
  var goldCount = 0;
  var distance = 2;
  var xPos = pellet.position.x/tileSize;
  var yPos = pellet.position.y/tileSize - 1;
  for(var x = 0; x < levelVector.length; x++){
    for(var y = 0; y < levelVector[x].length; y++){
      if(levelVector[x][y] == 1 && (x < xPos - distance || x > xPos + distance || y < yPos - distance || y > yPos + distance)){
        goldCount ++;
      }
    }
  }
  var position = Math.floor(Math.random() * (goldCount - 0.1));
  //console.log("calling");
  var count = 0;
  var breaker = 0;
  var active = 0;
  for(var x = 0; x < levelVector.length; x++){
    for(var y = 0; y < levelVector[x].length; y++){
      if(levelVector[x][y] == 1 && (x < xPos - distance || x > xPos + distance || y < yPos - distance || y > yPos + distance)){
        if(count == position){
          pellet.position.x = x * tileSize;
          pellet.position.y = y * tileSize + 16;
        //  console.log(pellet.position.x);
        //  console.log(pellet.position.y);
        }
        count++;
      }
    }
  }
  //return levelVector[pellet.position.x/tileSize][pellet.position.y/tileSize - 1] == 1;
}

const width = 512;
const height = 256;
const tileSize = 16;
const level =
'00011111111111110001111111111111000112221111111100011222112211210001111111221121000111711111111100011111111111110001111111111111000111221111151100011222111111110001122211111111000111111111122100011111111112210001131111111111000111111111111100011111111111110001111001111111000111110111111100011111111111110001222111111111000122211111222100012221111122210001111111112221000111111211111100016111121111110001111112111811000111111211111100012211111111110001211111122211000121141112221100011111111111110001111111111111';
var levelVector = [];
levelVector = loadLevel(level, width, height, tileSize);
var direction = ["none", "none"];
var framecount = 0;
var previousDirection = 2;
var previousPreviousDirection = 0;
var score = 0;
var addNew = 0;
var segments = [];
var pool = [];
var pelletCount = 0;
var portal = 0;
var poisons = [];
