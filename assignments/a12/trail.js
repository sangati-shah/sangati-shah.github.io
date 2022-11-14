// setup canvas

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const output = document.querySelector('.output');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

function submit() {
    alert(output.textContent);
}

function reset() {
    outputInt = "";
    output.textContent = outputInt;
}

const submitButton = document.querySelector('.submit-button').addEventListener('click', submit);
const resetButton = document.querySelector('.reset-button').addEventListener('click', reset);

// function to generate random number

function random(min, max) {
  const num = Math.floor(Math.random() * (max - min + 1)) + min;
  return num;
}

// function to generate random color

function randomRGB() {
        return (
          "rgba(" +
          Math.round(Math.random() * 250) +
          "," +
          Math.round(Math.random() * 250) +
          "," +
          Math.round(Math.random() * 250) +
          "," +
          Math.ceil(Math.random() * 10) / 10 +
          ")"
        );
    // return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

class Ball {
    constructor(x, y, velX, velY, color, size, num) {
      this.x = x;
      this.y = y;
      this.velX = velX;
      this.velY = velY;
      this.color = color;
      this.size = size;
      this.num = num;
    }
    
    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
        if ((this.x + this.size) >= width) {
          this.velX = -(this.velX);
        }
      
        if ((this.x - this.size) <= 0) {
          this.velX = -(this.velX);
        }
      
        if ((this.y + this.size) >= height) {
          this.velY = -(this.velY);
        }
      
        if ((this.y - this.size) <= 0) {
          this.velY = -(this.velY);
        }
      
        this.x += this.velX;
        this.y += this.velY;
    }

    collisionDetect() {
        for (const ball of balls) {
          if (this !== ball) {
            const dx = this.x - ball.x;
            const dy = this.y - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
      
            if (distance < this.size + ball.size) {
              ball.color = this.color = randomRGB();
            }
          }
        }
    }

    displayNum() {
        var mousex = 0;
        var mousey = 0;

        addEventListener("click", function() {
            mousex = event.clientX;
            mousey = event.clientY;

            console.log(this.x, this.y, mousex, mousey)
        })
    }
}

const balls = [];

while (balls.length < 25) {
  const size = random(20, 30);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size,
    random(1, 9)
  );

  balls.push(ball);
}

var mousex = 0;
var mousey = 0;

function loop() {
    ctx.fillStyle = "rgba(255, 255, 255)";
    ctx.fillRect(0, 0, width, height);

    var mousex = 0;
    var mousey = 0;

    for (const ball of balls) {
        ball.draw();
        ball.update();
        ball.collisionDetect();
        ball.displayNum();
    }
  
    requestAnimationFrame(loop);
}

loop();




  
  
  