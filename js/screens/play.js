game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;

        // Add our HUD to the game world, add it last so that this is on top of the rest.
        // Can also be forced by specifying a "Infinity" z value to the addChild function.
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
        
        var shadow = new surrounding_shadow(240, 192);
        
        console.log('test')
        
        this.HUD.addChild(shadow);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
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
      this.pos.z = 1;
   },

   // output something in the console
   // when the object is clicked
   onClick:function (event)
   {
      // this.callback(this.current_HUD);
      return false;
   }
});