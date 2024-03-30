const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
const body = document.getElementById("body");

const width = canvas.width; //300
const height = canvas.height; // 300
let score = 0;
const scoreContainer = document.getElementById("score_container");


class Circle {

    constructor(x, y, r, color, xSpeed, ySpeed) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.color = color;
        this.xSpeed = xSpeed;
        this.ySpeed = ySpeed;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.r, 0, Math.PI*2);
        ctx.fill();
    }

    move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
    }
};

class Rectangle {

    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }

    drawRect() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h, this.color);
    }

    moveRect() {
        this.x += 1;
    }
};

// Array of disappearing blocks after they got hit with a ball.
const blocksArray = []; 
for (let i = 10; i < width-10; i+=10) {
    blocksArray.push(new Rectangle(i, 0, 10, 10, "black"));
}

let rightWall = new Rectangle(width-10, 0, 10, height, "red");
let leftWall = new Rectangle(0, 0, 10, height, "red");
let redCircle = new Circle(width/2, height/2, 5, "red", 1, -2);
let bouncePlatform = new Rectangle(40, height-10, 40, 10, "green");

// Function that allows user to move green platform.
body.addEventListener('keydown', function keyPress(event) { 
    let key = event.key;
    
    if (key === "ArrowRight" && bouncePlatform.x < 250) {
        bouncePlatform.x += 15;
    }if (key === "ArrowLeft" && bouncePlatform.x > 10) {
        bouncePlatform.x -= 15;
    }else {
        null;
    }

});

// Collision detection func between red circle (ball) and target object (block).
function rectCircleColliding(target){ 

    let distX = Math.abs(redCircle.x - target.x-target.w/2);
    let distY = Math.abs(redCircle.y - target.y-target.h/2);

    if (distX > (target.w/2 + redCircle.r)) { return false; }
    if (distY > (target.h/2 + redCircle.r)) { return false; }

    if (distX <= (target.w/2)) { return true; } 
    if (distY <= (target.h/2)) { return true; }

    let dx=distX-target.w/2;
    let dy=distY-target.h/2;
    return (dx*dx+dy*dy<=(redCircle.r*redCircle.r));

};


function gameOver(intervalId) {
    clearInterval(intervalId);
};

// Game loop function
let intervalId = setInterval(() => {
    
    ctx.clearRect(0, 0, width, height);

    // Collision detection for bounce platform.
    const xRangeToPlatfrom = Math.abs(redCircle.x+redCircle.r - bouncePlatform.x);
    const yRangeToPlatform = Math.abs(redCircle.y-redCircle.r - bouncePlatform.y+bouncePlatform.h);
    if (rectCircleColliding(bouncePlatform)) { 
        redCircle.ySpeed = -redCircle.ySpeed;
    }

    if (redCircle.x+redCircle.r >= rightWall.x || redCircle.x-redCircle.r <= leftWall.x+leftWall.w) { // Collision detection for left, right walls and top.
        redCircle.xSpeed = -redCircle.xSpeed;
    }else if (redCircle.y-redCircle.r <= 0) {
        redCircle.ySpeed = -redCircle.ySpeed;
    }else if (redCircle.y+redCircle.r > height) {
        return gameOver();
        // redCircle.ySpeed = -redCircle.ySpeed;
    }


    // Collision detection for each element of upper blocks array
    for (let i = 0; i < blocksArray.length; i++) { 

        const element = blocksArray[i];
        const xRange = Math.abs(redCircle.x+redCircle.r - element.x);
        const yRange = Math.abs(redCircle.y-redCircle.r - element.y+element.h);

        if (rectCircleColliding(element)) {
            if (xRange > yRange) {
                redCircle.xSpeed = -redCircle.xSpeed;
                element.x = null;
                element.y = null;
                score += 1;
                break;    
            }else if (yRange > xRange) {
                redCircle.ySpeed = -redCircle.ySpeed;
                element.x = null;
                element.y = null;
                score += 1;
                break;  
            }
        }
    };


    // Drawing black blocks elemtns from the array.
    for (let i = 0; i < blocksArray.length; i++) { 
        const element = blocksArray[i];
        element.drawRect();
    }
    
    bouncePlatform.drawRect();
    leftWall.drawRect();
    rightWall.drawRect();
    redCircle.draw();
    redCircle.move();
    scoreContainer.innerText = score;

}, 16,6);