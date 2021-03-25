let drawing = [];
let currentPath = [];
let isDrawing = false;
let myCol;
let mySize;
let canvas;
let count = 0;

function setup() {
    let w = document.getElementById('canvasContainer').offsetWidth;
    let h = document.getElementById('canvasContainer').offsetHeight;
    canvas = createCanvas(w, h);
    canvas.mousePressed(startPath);
    canvas.mouseReleased(endPath);
    canvas.parent('canvasContainer');
}

function startPath() {
    isDrawing = true;
    currentPath = [];
    drawing.push(currentPath);
    myCol = document.getElementById("myColor").value;
    mySize = document.getElementById("myRange").value
}

function endPath() {
    isDrawing = false;
}

function draw() {
    let myBG = document.getElementById("myBG").value
    background(myBG);

    if (isDrawing) {
        var point = {
            x: mouseX,
            y: mouseY,
            col: myCol,
            // col:colorPicker.color(),
            size: mySize
                //size:slider.value(),
        }
        currentPath.push(point);
    }
    noFill();

    for (let i = 0; i < drawing.length; i++) {
        let path = drawing[i];
        beginShape();
        for (let j = 0; j < path.length; j++) {
            stroke(path[j].col);
            strokeWeight(path[j].size);
            vertex(path[j].x, path[j].y);
            endShape();
        }
    }
}

function clearCanvas() {
    drawing.splice(0);
    console.log(claer);
    console.log(drawing);
}

function undo() {
    let lastPos = drawing.length;
    drawing.splice(lastPos - 1);
}

function saveTodb() {
    // P5 canvas is HTML 5 Canvas
    let canvasString = canvas.elt.toDataURL();
    console.log(canvasString);
    httpPost(
        "/canvas",
        'json', {
            canvas: canvasString,
            age: document.getElementById("age").value,
            religion: document.getElementById("religion").value,
            nationality: document.getElementById("nationality").value,
            gender: document.getElementById("gender").value,
            count: count
        },
        function(result) {
            console.log(result);
            count += 1;
        });
}