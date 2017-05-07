var Ship = Class.extend({
init: function(shSprite, x, y, health) {
		
       this.shSprite = shSprite;
       this.x = x;
       this.y = y;
       this.health = health;
       this.shipExploding = false;
       this.exTimer =0;
       this.count = 0;
    },
    moveShip : function()
{
    if (input.isDown(40))
    {
        ship.y += 4;
    }
    if (input.isDown(38))
    {
        ship.y -= 4;

    }
    ship.y = Math.max(Math.min(ship.y, screen.height - ((shSprite.h / 2) + 35)), 0);
},
shoot: function(enemys)
{
    
    if (input.isPressed(32))
    {
    	 if(SOUND)
        {
        shootSound = document.getElementById("shoot");
        shootSound.play();
        }
        
        bullets.push(new Bullet(ship.x + (shSprite.w * .9), ship.y + (shSprite.h / 2), -8, 12, 4, "#FFFF00"));
    }
    for (var i = 0, len = bullets.length; i < len; i++)
    {
        if (bullets[i] !== undefined)
        {
            var b = bullets[i];

            b.update(calcPps(-BULLET_MOVE_SPEED));//updates bullet pos

            if ( b.x > (screen.width - 100))//if the bullet is 100px from top of screen remove it
            {
                bullets.splice(i, 1);//remove 1 bullet
                i--;
                len--;
                continue;
            }

            for (var j = 0, len2 = enemys.length; j < len2; j++)
            {
                var a = enemys[j];
                if (HitEnemy(b.x, b.y, b.width, b.height, a.x, a.y, a.w, a.h))// if bullet hits enemy, remove bullet and enemy
                {
                	if (SOUND)
                    {
                        enemyExplode = document.getElementById("enemyDown");
                        enemyExplode.play();
                    }
                    enemys.splice(j, 1);
                    j--;
                    len2--;
                    bullets.splice(i, 1);
                    i--;
                    len--;
                    score++;
                    saveHighscore();
                }
                }
            }
        }
    },
 shipExplode : function()
{
    if (!this.shipExploding)
    {
        exTimer.start();
        this.shipExploding = true;
         if(SOUND)
        {
        playerExplode = document.getElementById("death");
        playerExplode.play(); 
        }
    }
    if (exTimer.getElapsedTime() > 200)//updates ship frame every .2 of a second
    {
        exFrame++;
        if (exFrame === 8)
        {
            gameLost();
        }
        this.shSprite = exSprite[exFrame];
        exTimer.reset();
        this.shipExploding = false;
    }
}
 });