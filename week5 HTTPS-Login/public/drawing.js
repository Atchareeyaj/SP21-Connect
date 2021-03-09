let drawing = [];
let currentPath = [];

function setup() {
  canvas = createCanvas(400, 400);
  canvas.mousePressed(startPath);
  canvas.parent('canvasContainer');
  colorPicker = createColorPicker('#ed225d');
  colorPicker.position(0, height + 20);
  
  slider = createSlider(1, 10, 5);
  slider.position(0, height + 50);
  
}

function startPath(){
  currentPath = [];
  drawing.push(currentPath);
}

function draw() {
  background(220);
  
  if(mouseIsPressed){
     var point = {
       x: mouseX,
       y: mouseY,
       col:colorPicker.color(),
       size:slider.value(),
     }
     currentPath.push(point);
     }
 noFill();

  for(let i =0; i<drawing.length; i++){
    let path = drawing[i];
    beginShape();
    for(let j=0; j<path.length; j++){
      stroke(path[j].col);
      strokeWeight(path[j].size);
      vertex(path[j].x,path[j].y);
      endShape();
    }
  }


}