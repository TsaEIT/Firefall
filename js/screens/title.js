game.TitleScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        var backgroundImage = new me.Sprite(0, 0, {
            image: me.loader.getImage('title_screen'),
        });
		
		backgroundImage.anchorPoint.set(0, 0);
		backgroundImage.scale(me.game.viewport.width / backgroundImage.width, me.game.viewport.height / backgroundImage.height);
		
		me.game.world.addChild(backgroundImage, 1);
		
		this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
		
        me.game.world.addChild(new basic_button(124.5, 362.5, 'play_button', function() {
            me.state.change(me.state.PLAY);
			me.levelDirector.loadLevel('level1');
        }));
        
        me.game.world.addChild(new basic_button(343.5, 362.5, 'info_button', function() {
            console.log('info')
        }));
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
		me.input.unbindKey(me.input.KEY.ENTER);
		// me.event.unsubscribe(this.handler); Don't think this is important
		me.game.world.removeChild(this.HUD);
    }
});

var basic_button = me.GUI_Object.extend(
{
   init:function (x, y, image, callback)
   {
      var settings = {}
      settings.image = image;
      settings.framewidth = 165;
      settings.frameheight = 33;
      // super constructor
      this._super(me.GUI_Object, "init", [x, y, settings]);
      // define the object z order
      this.pos.z = 4;
      
      this.callback = callback;
   },

   // output something in the console
   // when the object is clicked
   onClick:function (event)
   {
      this.callback();
      return false;
   }
});