/** @type {HTMLCanvasElement} */
const canvas = document.getElementById('canvas1')
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drawing = false;
ctx.fillStyle = 'white';
ctx.globalCompositeOperation = 'destination-over';

ctx.arc(65, 65, 3, 0, 2 * Math.PI);

class Root {
    constructor(x, y){
        // Gets the mouses current x and y corrdinates
        this.x = x;
        this.y = y; 
        this.speedX = Math.random() * 4 - 2; // sets the speed between -2 and +2
        this.speedY = Math.random() * 4 - 2;
        this.maxSize = Math.random() * 7 + 2; // how big the roots will grow. between 5 and 12 px
        this.size = Math.random() * 1 + 2; // initial size before roots start growing, 2 and 3 px
        this.vs = Math.random() * 0.2 + 0.15; // gives each root a different growth speed, velocity of speed
        this.angleX = Math.random() * 6.2 // between 0 and 6.2, to make the lines more organic
        this.angleY = Math.random() * 6.2 
        this.vax = Math.random() * 0.6 - 0.3; // velocity of angle
        this.vay = Math.random() * 0.6 - 0.3;
        this.angle = 0;
        this.va = Math.random() * 0.02 + 0.05;
        this.lightness = 10;
    }
    update(){
        this.x += this.speedX + Math.sin(this.angleX);
        this.y += this.speedY + Math.sin(this.angleY);
        this.size += this.vs;
        this.angleX += this.vax;
        this.angleY += this.vay;
        this.angle += this.va;
        if(this.lightness < 70) this.lightness += 0.25

        if (this.size < this.maxSize){
            ctx.save();
            ctx.translate(this.x, this.y)
            ctx.rotate(this.angle);
            
            ctx.fillRect(0 - this.size/2, 0 - this.size/2, this.size, this.size); 
            
            ctx.lineWidth = 0.5;
            // ctx.strokeStyle = '#3c5186';
            ctx.strokeStyle = '#143766';
            let double = this.size * 2
            ctx.strokeRect(0 - double/2, 0 - double/2, double, double);
            
            /*ctx.lineWidth = 0.1;
            ctx.strokeStyle = 'white';
            let triple = this.size * 3
            ctx.strokeRect(0 - triple/2, 0 - triple/2, triple, triple);*/
           
            requestAnimationFrame(this.update.bind(this)) // calls update over and over until the size > maxSize
            // .bind(this) passes in the original this 
            ctx.restore()
        } else {
            const flower = new Flower(this.x, this.y, this.size);
            flower.grow();
        }
    }
}

class Flower {
    constructor(x, y, size){
        this.x = x;
        this.y = y;
        this.size = size;
        this.vs = Math.random() * 0.3 + 0.2;
        this.maxFlowerSize = size + Math.random() * 100;
        this.image = new Image();
        this.image.src = 'img/flowers.png';
        this.frameSize = 100;
        this.frameX = Math.floor(Math.random() * 3);
        this.frameY = Math.floor(Math.random() * 3);
        this.size > 7 ? this.willFlower = true : this.willFlower = false;
        this.angle = 0; // for the spin of flowers
        this.va = Math.random() * 0.05 - 0.025;
    }
    grow(){
        if (this.size < this.maxFlowerSize && this.willFlower){
            this.size += this.vs;
            this.angle += this.va;

            ctx.save(); // for spin
            ctx.translate(this.x, this.y); // for spin
            ctx.drawImage(this.image, this.frameSize * this.frameX, this.frameSize * this.frameY,
                this.frameSize, this.frameSize,
                0 - this.size/2, 0 - this.size/2, this.size, this.size);
            ctx.restore(); // for spin

            requestAnimationFrame(this.grow.bind(this));
        }
        // sx sy sw sh all refer to the size of the image we are using - cropping out other flowers
    }
    
}

window.addEventListener('mousemove', function(e){
    // for loop makes 3 roots everytime
    if(drawing){
        var rect = canvas.getBoundingClientRect();
        x = (e.x - rect.left) / (rect.right - rect.left) * canvas.width
        y = (e.y - rect.top) / (rect.bottom - rect.top) * canvas.height
        for(let i = 0; i < 1; i++){
            const root = new Root(x, y);
            root.update();
        }
    }
});

window.addEventListener('mousedown', function(e){
    drawing = true;
    var rect = canvas.getBoundingClientRect();
    x = (e.x - rect.left) / (rect.right - rect.left) * canvas.width
    y = (e.y - rect.top) / (rect.bottom - rect.top) * canvas.height
    for(let i = 0; i < 30; i++){
        const root = new Root(x, y);
        root.update();
    }
});

window.addEventListener('mouseup', function(){
    drawing = false;
});
