let str = '';
let letters = [];
let i= 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background("#8CE0F4");
  fill(255,255,255);
  noStroke();

// let splitString = split(str, ',');
for(let i=0; i<letters.length; i++){
  
  if(letters[i].y < height){
     letters[i].y++;
     }else{
    // letters.splice(i, 1); 
       letters[i].y = height;
     }
  textSize(letters[i].size);   
  text(letters[i].char,letters[i].x , letters[i].y);   
}
}

function createLetter(){
let chars = str.split('');
let x = random(width);
  let size = Math.round(random(10,100));
  letters.push(new Letter(chars[i],x,0,size));
i++;
}

class Letter{
constructor(char,x,y,size){
this.char = char;
  this.x = x;
  this.y = y;
  this.size = size;
}  
}

function keyTyped(){
str += key; 
// str += ',';  
createLetter();
}

function keyPressed() {
  if (keyCode == DELETE || keyCode == BACKSPACE) {
    str = str.substring(0,max(0,str.length-1));
    createLetter();
  }
}

 