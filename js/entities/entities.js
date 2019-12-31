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
        
        this.name = "player";
        
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.5, 0.5);
        
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.alwaysUpdate = true;
        
        this.renderable.addAnimation("idle",  [0, 1, 2, 3, 4], 200);
        
        if (me.levelDirector.getCurrentLevel().name == "tobecontinued") {
            console.log('Playing MUSIC')
            me.audio.play("FinalFight", true);
        }
        
        var platformer_levels = ['level2'];
        
        if (platformer_levels.includes(me.levelDirector.getCurrentLevel().name)) {
            this.body.gravity = {x: 0.0, y: 0.90};
            this.body.setMaxVelocity(3, 15);
        } else {
            this.body.gravity = {x: 0.0, y: 0.0};
            this.body.setMaxVelocity(3, 3);
        }
        
        this.on_platform = false;
        
        
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
            this.body.force.x = -this.body.accel.x * me.timer.tick;
            }
        else if (me.input.isKeyPressed('right')) {
            moving = true;
            // unflip the sprite
            this.renderable.flipX(false);

            // update the entity velocity
            this.body.force.x = this.body.accel.x * me.timer.tick;
        } else {
              this.body.force.x = 0;
        }
        if (me.input.isKeyPressed('up')) {
            moving = true;
            
            // ((((!this.body.jumping) || this.on_platform) && !this.body.falling) || this.body.gravity.y == 0)
            
            if ((!this.body.jumping && !this.body.falling) || this.body.gravity.y == 0) { // TODO: Allow jumping on platforms, level2
                this.body.force.y = -this.body.accel.y * me.timer.tick;
                this.body.jumping = true;
            } else if (this.body.force.y < 0) {
                this.body.force.y += 0.05 * this.body.accel.y * me.timer.tick;
                if (this.body.force.y > 0) this.body.force.y = 0;
            }
            
            }
        else if (me.input.isKeyPressed('down')) {
            moving = true;

            // update the entity velocity
            this.body.force.y = this.body.accel.y * me.timer.tick;
        } else {
              this.body.force.y = 0;
        }
        
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        this.on_platform = false;
        
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        var dangerous_entities = ["LAVA"];
        
        if (dangerous_entities.includes(other.type)) { // response.b.body.collisionType == me.collision.types.ENEMY_OBJECT
          me.levelDirector.reloadLevel();
        }
        
        return true;
    }
});

game.LavaEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      return false;
  }
});

game.ElevatorEntity = me.Entity.extend({
  init: function (x, y, settings) {
    this._super(me.Entity, 'init', [x, y , settings]);
    
    this.direction = settings.direction;
    
    if (this.direction == "up" || this.direction == "down") {
        this.minY = settings.minY;
        this.maxY = settings.maxY;
        
        this.minX = 0;
        this.maxX = 0;
    } else {
        this.minX = settings.minX;
        this.maxX = settings.maxX;
        
        this.minY = 0;
        this.maxY = 0;
    }
    this.movement_speed = 1.5;
    
    this.alwaysUpdate = true;
    
    this.body.gravity = {x: 0.0, y: 0.0};
  },
  
  
  update: function(dt) {
        if (this.direction == "right" || this.direction == "left") {
            console.log(this.pos);
        }
      
        if (this.direction == "up") {
            this.body.vel.y = -this.movement_speed;
            if (this.pos._y < this.minY) {
                this.direction = "down";
            }
        } else if (this.direction == "down") {
            this.body.vel.y = this.movement_speed;
            if (this.pos._y > this.maxY) {
                this.direction = "up"
            }
        } else if (this.direction == "right") {
            this.body.vel.x = this.movement_speed;
            if (this.pos._x > this.maxX) {
                this.direction = "left";
            }
        } else if (this.direction == "left") {
            this.body.vel.x = -this.movement_speed;
            if (this.pos._x < this.minX) {
                this.direction = "right"
            }
        }
      
        this.body.update(dt);
        
        me.collision.check(this);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      if (other.name == "player") {
          other.on_platform = true;
      }
      return false;
  }
});