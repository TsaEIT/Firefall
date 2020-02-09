/**
 * Player Entity
 */
 
var fireball_cooldown = false;
var fireball_cooldown_period = 500;

game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        this._super(me.Entity, 'init', [x, y , settings]);
        this.name = "player";
        
        this.current_settings = settings;
        
        this.body.setVelocity(2.5, 2.5);
        this.body.setFriction(0.5, 0.5);
        
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.alwaysUpdate = true;
        
        this.renderable.addAnimation("idle",  [0, 1, 2, 3, 4], 200);
        
        if (me.levelDirector.getCurrentLevel().name == "hallway") {
            console.log('Playing MUSIC');
            me.audio.stop("Theme")
            me.audio.play("FinalFight", true);
        }
        
        var platformer_levels = ['level2', 'hallway', 'boss'];
        
        if (platformer_levels.includes(me.levelDirector.getCurrentLevel().name)) {
            this.body.gravity = {x: 0.0, y: 0.90};
            this.body.setMaxVelocity(3, 15);
        } else {
            this.body.gravity = {x: 0.0, y: 0.0};
            this.body.setMaxVelocity(3, 3);
        }
        
        this.on_platform = false;
        
        var fireball_cooldown = false;
        
        this.renderable.setCurrentAnimation("idle");
    },

    /**
     * update the entity
     */
    update : function (dt) {
        var moving = false;
        
        if (me.input.isKeyPressed('fireball')) {
            if (!fireball_cooldown) {
                var newFireballX = (this.pos.x + (this.current_settings.width/2));
                var newFireballY =(this.pos.y + (this.current_settings.height/2));
                
                var fireball = me.pool.pull('fireball', newFireballX, newFireballY);
                me.game.world.addChild(fireball);
                
                fireball_cooldown = true;
                setTimeout(function() {fireball_cooldown = false}, fireball_cooldown_period);
            }
        }
        
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
        var dangerous_entities = ["LAVA", "PINCERS"];
        var trans_entities = ["FIREBALL"];
        
        if (trans_entities.includes(other.type)) {
            return false;
        }
        
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
    
    // this.renderable.addAnimation("norm",  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15], 100);
    // this.renderable.setCurrentAnimation("norm");
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

game.Fireball = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    settings = settings || {
        image: 'fireball',
        height: 17,
        width: 11
    };
    
    x -= settings.width/2;
    y -= settings.height/2;
    
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y, settings]);
    
    this.renderable.addAnimation("burn_everything",  [0, 1], 50);
    
    this.target = [me.input.pointer.gameWorldX, me.input.pointer.gameWorldY];
    this.velocity = 3;
    
    this.dist_to_target = Math.sqrt(((this.target[0] - x) * (this.target[0] - x)) + ((this.target[1] - y) * (this.target[1] - y)));
    
    this.deltaX = ((this.target[0] - x) * this.velocity) / this.dist_to_target;
    this.deltaY = ((this.target[1] - y) * this.velocity) / this.dist_to_target;
    
    this.renderable.currentTransform.rotate( ( Math.atan2( this.target[1] - y, this.target[0] - x) ) - Math.PI/2);
    
    this.type = "FIREBALL";
    
    this.alwaysUpdate = true;
    
    this.body.gravity = {x: 0.0, y: 0.0};
    
    this.renderable.setCurrentAnimation("burn_everything");
  },
  
  update: function(dt) {
        // var mainPlayer = me.game.world.children.find(function (e) {return e.name == 'mainPlayer'});
      
        this.pos._x += this.deltaX;
        this.pos._y += this.deltaY;
      
        this.body.update(dt);
        
        me.collision.check(this);

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
  },

  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      if (other.name != "player") {
          me.game.world.removeChild(this, false);
      }
      
      return false;
  }
});

game.skelespiderEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    
    
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
    
    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(1, 1);    
    this.renderable.addAnimation("stand",  [0]);
    this.renderable.setCurrentAnimation("stand");
  },
  update : function (dt) {
     var player = me.game.world.children.find(function (e) {return e.name == 'player'});
     
     if (player.alive) {
         if (this.distanceTo(player) <= 256) {
             var angle = this.angleTo(player)
             this.body.vel.y += Math.sin(angle) * this.body.accel.y * me.timer.tick;
             this.body.vel.x += Math.cos(angle) * this.body.accel.x * me.timer.tick;
             this.body.update(dt);
         } else {
             this.body.vel.y = this.body.vel.x = 0;
             this.body.update(dt)
         }
     }
     
     // handle collisions against other shapes
     me.collision.check(this);
     
     // return true if we moved or if the renderable was updated
     return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);     
  },
  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      if (response.b.body.collisionType == me.collision.types.WORLD_SHAPE) {
          return true;
      }
      return false;
  }
});

game.pincersEntity = me.Entity.extend({
  // extending the init function is not mandatory
  // unless you need to add some extra initialization
  init: function (x, y, settings) {
    
    
    // call the parent constructor
    this._super(me.Entity, 'init', [x, y , settings]);
    
    // set the default horizontal & vertical speed (accel vector)
    this.body.setVelocity(1, 1);    
    this.renderable.addAnimation("normal_animation",  [0, 1, 2, 3, 4, 5]);
    this.renderable.setCurrentAnimation("normal_animation");
  },
  update : function (dt) {
     var player = me.game.world.children.find(function (e) {return e.name == 'player'});
     
     if (player.alive) {
         if (this.distanceTo(player) <= 256) {
             var angle = this.angleTo(player)
             this.body.vel.y += Math.sin(angle) * this.body.accel.y * me.timer.tick; // TODO: Vector Math
             this.body.vel.x += Math.cos(angle) * this.body.accel.x * me.timer.tick;
             this.body.update(dt);
         } else {
             this.body.vel.y = this.body.vel.x = 0;
             this.body.update(dt)
         }
     }
     
     // handle collisions against other shapes
     me.collision.check(this);
     
     // return true if we moved or if the renderable was updated
     return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);     
  },
  // this function is called by the engine, when
  // an object is touched by something (here collected)
  onCollision : function (response, other) {
      if (response.b.body.collisionType == me.collision.types.WORLD_SHAPE) {
          return true;
      }
      
      if (other.type == 'FIREBALL') {
            this.body.setCollisionMask(me.collision.types.NO_OBJECT);
            me.game.world.removeChild(this);
      }
      return false;
  }
});
