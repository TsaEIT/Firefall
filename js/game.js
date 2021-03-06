
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0,
        current_audio_name: "",
        current_audio_id: 0,
        passed_check: false
    },

    

    // Run on page load.
    "onload" : function () {
        // Initialize the video.
        if (!me.video.init(480, 384, {wrapper : "screen", scale : "auto", scaleMethod : "fit"})) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        // Initialize the audio.
        me.audio.init("mp3, ogg");

        // set and load all resources.
        // (this will also automatically switch to the loading screen)
        me.loader.preload(game.resources, this.loaded.bind(this));
    },

    // Run on game resources loaded.
    "loaded" : function () {
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());
        
        me.input.registerPointerEvent("pointerdown", this, function(e) {console.log("click")});

        // add our player entity in the entity pool
        me.pool.register("lavaEntity", game.LavaEntity);
        me.pool.register("elevatorEntity", game.ElevatorEntity);
        me.pool.register("fireball", game.Fireball);
        me.pool.register("shadowball", game.ShadowBall);
        
        me.pool.register("skelespider", game.skelespiderEntity);
        me.pool.register("pincers", game.pincersEntity);
        me.pool.register("spikeEntity", game.SpikeEntity);
        me.pool.register("bossEntity", game.bossEntity);
        
        me.pool.register("checkPointEntity", game.checkPointEntity);
        
        me.pool.register("mainPlayer", game.PlayerEntity);
        
        me.input.bindKey(me.input.KEY.UP,  "up");
        me.input.bindKey(me.input.KEY.DOWN, "down");
        me.input.bindKey(me.input.KEY.LEFT,  "left");
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        
        me.input.bindKey(me.input.KEY.F, "fireball");
        
        me.input.bindKey(me.input.KEY.W,  "up");
        me.input.bindKey(me.input.KEY.S, "down");
        me.input.bindKey(me.input.KEY.A,  "left");
        me.input.bindKey(me.input.KEY.D, "right");

        // Start the game.
        me.state.change(me.state.MENU);
    }
};

function play_audio(name) {
    if (game.data.current_audio_id != 0 && game.data.current_audio_name != "") {
    me.audio.stop(game.data.current_audio_name, game.data.current_audio_id);
    }
    game.data.current_audio_name = name;
    game.data.current_audio_id = me.audio.play(name, true);
}