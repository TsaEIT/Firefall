/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        this.body.setVelocity(2, 2);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.alwaysUpdate = true;
        
        this.renderable.addAnimation("idle",  [0, 1, 2, 3, 4]);
        
        this.renderable.setCurrentAnimation("idle");
    },

    /**
     * update the entity
     */
    update : function (dt) {
        var moving = false;
        if (me.input.isKeyPressed('left')) {
            moving = true;
            // flip the sprite on horizontal axis
            this.renderable.flipX(true);

            // update the entity velocity
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            }
        else if (me.input.isKeyPressed('right')) {
            moving = true;
            // unflip the sprite
            this.renderable.flipX(false);

            // update the entity velocity
            this.body.vel.x += this.body.accel.x * me.timer.tick;
        } else {
              this.body.vel.x = 0;
        }
        if (me.input.isKeyPressed('up')) {
            moving = true;

            // update the entity velocity
            this.body.vel.y -= this.body.accel.y * me.timer.tick;
            }
        else if (me.input.isKeyPressed('down')) {
            moving = true;

            // update the entity velocity
            this.body.vel.y += this.body.accel.y * me.timer.tick;
        } else {
              this.body.vel.y = 0;
        }
        
        /*
        if (moving) {
            if (!this.renderable.isCurrentAnimation("walk")) {
                this.renderable.setCurrentAnimation("walk");
            }
        } else {
            if (!this.renderable.isCurrentAnimation("stand")) {
                this.renderable.setCurrentAnimation("stand");
            }
        }
        */
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        return true;
    }
});
