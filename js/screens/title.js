game.TitleScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        var backgroundImage = new me.Sprite(0, 0, {
            image: me.loader.getImage('background-image'),
        });
		
		backgroundImage.anchorPoint.set(0, 0);
		backgroundImage.scale(me.game.viewport.width / backgroundImage.width, me.game.viewport.height / backgroundImage.height);
		
		me.game.world.addChild(backgroundImage, 1);
		
		
		
		/*
		me.game.world.addChild(new (me.Renderable.extend ({
			// constructor
			init : function () {
				this._super(me.Renderable, 'init', [0, 0, me.game.viewport.width, me.game.viewport.height]);
		
				// font for the scrolling text
				this.font = new me.BitmapFont(me.loader.getBinary('font'), me.loader.getImage('font'), 0.1);
		
				// a tween to animate the arrow
				this.scrollertween = new me.Tween(this).to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
		
				this.scroller = "";
				this.scrollerpos = 600;
			},
		
			// some callback for the tween objects
			scrollover : function () {
				// reset to default value
				this.scrollerpos = 640;
				this.scrollertween.to({scrollerpos: -2200 }, 10000).onComplete(this.scrollover.bind(this)).start();
			},
		
			update : function (dt) {
				return true;
			},
		
			draw : function (renderer) {
				
			},
			onDestroyEvent : function () {
				//just in case
				this.scrollertween.stop();
			}
		})), 2);
		*/
		
		this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
		
		me.input.bindKey(me.input.KEY.ENTER, "enter", true);
		this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
			if (action === "enter") {
				// play something on tap / enter
				// this will unlock audio on mobile devices
				// me.audio.play("cling");
				me.state.change(me.state.PLAY);
				me.levelDirector.loadLevel('level1')
			}
		});
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
		me.input.unbindKey(me.input.KEY.ENTER);
		me.event.unsubscribe(this.handler);
		me.game.world.removeChild(this.HUD);
    }
});

var playButton = me.GUI_Object.extend(
{
   init:function (x, y)
   {
      var settings = {}
      settings.image = "play_button";
      settings.framewidth = 100;
      settings.frameheight = 50;
      // super constructor
      this._super(me.GUI_Object, "init", [x, y, settings]);
      // define the object z order
      this.pos.z = 4;
   },

   // output something in the console
   // when the object is clicked
   onClick:function (event)
   {
      console.log("clicked!");
      // don't propagate the event
      return false;
   }
});
