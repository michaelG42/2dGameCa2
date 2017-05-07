
function Screen(width, height)// creates canvas
{
    this.canvas = document.createElement("canvas");
    this.canvas.width = this.width = width;
    this.canvas.height = this.height = height;
    this.ctx = this.canvas.getContext("2d");
    
    document.body.appendChild(this.canvas);

}
;

Screen.prototype.clear = function ()//clears screen
{
    
    this.ctx.clearRect(0, 0, this.width, this.height);
};
Screen.prototype.drawSprite = function (sp, y, x)//draws a sprite
{
    if (sp !== null)
    {
        this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, y, x, sp.w, sp.h);
    }
};

Screen.prototype.drawBullet = function (bullet)//draws bullet to screen
{
    this.ctx.fillStyle = bullet.color;
    this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
};

function Sprite(img, x, y, w, h, name)//creates sprite
{
    this.img = img;
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.name = name;
}
;

function InputHandeler()// handles input
{
    this.down = {};
    this.pressed = {};
    var _this = this;
    document.addEventListener("keydown", function (evt) {
        _this.down[evt.keyCode] = true;
    });
    document.addEventListener("keyup", function (evt) {
        delete _this.down[evt.keyCode];
        delete _this.pressed[evt.keyCode];
    });
}
;

InputHandeler.prototype.isDown = function (code)//if key held down
{
    return this.down[code];
};

InputHandeler.prototype.isPressed = function (code)// if key pressed
{
    if (this.pressed[code])
    {
        return false;
    } else if (this.down[code])
    {
        return this.pressed[code] = true;
    }

    return false;

};

function HitEnemy(ax, ay, aw, ah, bx, by, bw, bh)// checks if bullet hits enemy by comparing the x and y position + the widths an heights
{
    return ax < bx + bw && bx < ax + aw && ay < by + bh && by < ay + ah;
}
;

function HitShip(ax, ay, aw, ah, bx, by, bw, bh)// checks if bullet hits ship by comparing the x and y position + the widths an heights
{
    return ax + 60 < bx + bw && bx + 60 < ax + aw && ay < by + bh && by < ay + ah;
}
;


//this wouldnt work, not sure why, wanted to use it for collision detection
//was trying to take the ships x position away from the bullets x 
//and if the absolute value vas less than  ships width then it was a hit
//wanted the same for y position
//function HitShip(shipx, shipy, shipw, shiph, bx, by, bw, bh ) 
//{
//    var xRange = Math.abs(bx+bw - shipx+shipw);
//    var yRange = Math.abs(by+bh - shipy+shiph);
//    
//    var hit; 
//    
//    if (xRange < 50 && yRange < 50)
//    {
//        window.alert("x " + xRange + "y" + yRange);
//        hit = true;
//    }
//    else 
//    {
//        hit = false;
//    }
//    
//    return hit;
//};

function Bullet(x, y, vel, w, h, color)// create bullet
{
    this.x = x;
    this.y = y;
    this.vel = vel;
    this.width = w;
    this.height = h;
    this.color = color;
}
;

Bullet.prototype.update = function (vel)// update bullet position 
{
    this.x -= vel;
};


