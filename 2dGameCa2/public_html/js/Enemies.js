var Enemies = Class.extend({
	init: function(enSprite, x, y, w, h){
		
       this.enSprite = enSprite;
       this.x = x;
       this.y = y;
       this.w = w;
       this.h = h;
       this.eBullets = [];
       this.ENEMY_SHOOT_FREQUENCY = 50;
    },
});