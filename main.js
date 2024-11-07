// 定义弹球计数变量

const para = document.querySelector('p');
let count = 0;

// 设置画布

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;

// 生成随机数的函数

function random(min, max) {
    const num = Math.floor(Math.random() * (max - min)) + min;
    return num;
}

// 生成随机颜色值的函数

function randomColor() {
    const color = 'rgb(' +
        random(0, 255) + ',' +
        random(0, 255) + ',' +
        random(0, 255) + ')';
    return color;
}

// 定义 Shape 构造器

function Shape(x, y, velX, velY, exists) {
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
    this.exists = exists;
}

// 定义 Ball 构造器，继承自 Shape

// 定义 Ball 构造器，继承自 Shape
function Ball(x, y, velX, velY, exists, color, size) {
    Shape.call(this, x, y, velX, velY, exists);

    this.color = color;
    this.size = size;
}

Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;

Ball.prototype.draw = function () {
    
    // 创建渐变色
    const gradient = ctx.createLinearGradient(this.x - this.size, this.y - this.size, this.x + this.size, this.y + this.size);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.5, 'yellow');
    gradient.addColorStop(1, 'blue');

    
    // 绘制小球
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);

    // 添加阴影效果
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    // 填充渐变色
    ctx.fillStyle = gradient;
    ctx.fill();
};


// 定义彩球更新函数

Ball.prototype.update = function () {
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
};

// 定义碰撞检测函数

Ball.prototype.collisionDetect = function () {
    for (var j = 0; j < balls.length; j++) {
        if (this !== balls[j]) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size && balls[j].exists) {
                balls[j].color = this.color = randomColor();
            }
        }
    }
};

// 定义 EvilCircle 构造器, 继承自 Shape

function EvilCircle(x, y, exists) {
    Shape.call(this, x, y, 20, 20, exists);

    this.color = 'white';
    this.size = 20;
}

EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;


// 定义 EvilCircle 绘制方法
EvilCircle.prototype.draw = function () {
    // 保存当前绘图状态
    ctx.save();

    // 移动到EvilCircle的中心
    ctx.translate(this.x, this.y);

    // 应用旋转，这里使用this.angle属性，它应该在update方法中更新
    ctx.rotate(this.angle);

    // 创建一个径向渐变，从中心向外
    let gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    gradient.addColorStop(0, 'red');
    gradient.addColorStop(0.5, 'black');
    gradient.addColorStop(1, 'darkred');

    // 开始绘制路径
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, 2 * Math.PI);

    // 设置阴影效果
    ctx.shadowColor = 'black';
    ctx.shadowBlur = 15;
    ctx.shadowOffsetX = 5;
    ctx.shadowOffsetY = 5;

    // 设置填充样式为渐变
    ctx.fillStyle = gradient;

    // 绘制填充
    ctx.fill();

    // 设置描边样式
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 3;

    // 绘制描边
    ctx.stroke();

    // 恢复之前的绘图状态
    ctx.restore();
};

// 在EvilCircle原型上添加angle属性和update方法来更新角度
EvilCircle.prototype.angle = 0;

EvilCircle.prototype.update = function () {
    // 更新EvilCircle的位置或者其他逻辑
    // ...

    // 更新旋转角度
    this.angle += 0.05; // 每帧旋转0.05弧度，可以根据需要调整
};

// 定义 EvilCircle 的边缘检测（checkBounds）方法

EvilCircle.prototype.checkBounds = function () {
    if ((this.x + this.size) >= width) {
        this.x -= this.size;
    }

    if ((this.x - this.size) <= 0) {
        this.x += this.size;
    }

    if ((this.y + this.size) >= height) {
        this.y -= this.size;
    }

    if ((this.y - this.size) <= 0) {
        this.y += this.size;
    }
};

// 定义 EvilCircle 控制设置（setControls）方法

EvilCircle.prototype.setControls = function () {
    window.onkeydown = e => {
        switch (e.key) {
            case 'a':
            case 'A':
            case 'ArrowLeft':
                this.x -= this.velX;
                break;
            case 'd':
            case 'D':
            case 'ArrowRight':
                this.x += this.velX;
                break;
            case 'w':
            case 'W':
            case 'ArrowUp':
                this.y -= this.velY;
                break;
            case 's':
            case 'S':
            case 'ArrowDown':
                this.y += this.velY;
                break;
        }
    };
};

// 定义 EvilCircle 冲突检测函数

EvilCircle.prototype.collisionDetect = function () {
    for (let j = 0; j < balls.length; j++) {
        if (balls[j].exists) {
            const dx = this.x - balls[j].x;
            const dy = this.y - balls[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < this.size + balls[j].size) {
                balls[j].exists = false;
                count--;
                para.textContent = '剩余彩球数：' + count;
            }
        }
    }
};


// 定义一个数组，生成并保存所有的球，

const balls = [];

while (balls.length < 25) {
    const size = random(10, 20);
    let ball = new Ball(
        // 为避免绘制错误，球至少离画布边缘球本身一倍宽度的距离
        random(0 + size, width - size),
        random(0 + size, height - size),
        random(-7, 7),
        random(-7, 7),
        true,
        randomColor(),
        size
    );
    balls.push(ball);
    count++;
    para.textContent = '剩余彩球数：' + count;
}

// 定义一个循环来不停地播放

let evil = new EvilCircle(random(0, width), random(0, height), true);
evil.setControls();

function loop() {
    ctx.fillStyle = 'rgba(0,0,0,0.25)';
    ctx.fillRect(0, 0, width, height);

    for (let i = 0; i < balls.length; i++) {
        if (balls[i].exists) {
            balls[i].draw();
            balls[i].update();
            balls[i].collisionDetect();
        }
    }

    evil.draw();
    evil.checkBounds();
    evil.collisionDetect();

    requestAnimationFrame(loop);
}

loop();
