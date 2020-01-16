/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;
        
        var shadow = new surrounding_shadow(240, 192);
        
        this.addChild(shadow);
        

        // make sure we use screen coordinates
        this.floating = true;

        // give a name
        this.name = "HUD";
    }
});


/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // local copy of the global score
        this.score = -1;
    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (context) {
        // draw it baby !
    }

});

var surrounding_shadow = me.GUI_Object.extend(
{
   init:function (x, y)
   {
      var settings = {}
      settings.image = "OuterShadow.png";
      settings.framewidth = 480;
      settings.frameheight = 384;
      // super constructor
      this._super(me.GUI_Object, "init", [x, y, settings]);
      // define the object z order
      this.pos.z = 4;
   },
   
   update: function() {
       if (me.state.isCurrent(me.state.PLAY)) {
           this.alpha = 1;
       } else {
           this.alpha = 0;
       }
   },

   // output something in the console
   // when the object is clicked
   onClick:function (event)
   {
      // this.callback(this.current_HUD);
      return false;
   }
});