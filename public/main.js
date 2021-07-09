const GRID_SIZE = 20;
const Width = 600;
const Height = 600;
const socket = io();

let Loop;
let world;
let snake;
let s;

function setup() {
    let canvas = createCanvas(600, 600);
    canvas.parent('sketch_holder');
    frameRate(16);
    Loop = 1;

    world = new World();
    snake = world.run();
    s = snake.copy();
}

function mousePressed() {
    if (Loop === 1) {
        noLoop();
        Loop = 0;
    }
    else if (Loop === 0) {
        loop();
        Loop = 1;
    }
}

function draw() {
    background(40);
    stroke(255);

    if(s.isAlive) {
        s.draw();
        s.move();
    }
    else {
        s = snake.copy();
    }

    push();
    stroke(75);
    for(let i = 0; i < Width; i += GRID_SIZE) {
        line(i, 0, i, Height);
    }

    for(let i = 0; i < Height; i += GRID_SIZE) {
        line(0, i, Width, i);
    }

    pop();
}

//------------------------------------------------
