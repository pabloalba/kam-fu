var NINJA_WIDTH = 130;
var NINJA_HEIGHT = 145;


var gameNinja = {
    time: 0,
    foregroundImage: null,
    status: 0,

    setup: function(gameBackground, gameFront, movementImage) {
        gameNinja.foregroundImage = $("#ninjaForeground")[0];
        gameNinja.time = new Date().getTime();
        gameCommon.playMusic("audio/music_fight.ogg");
        var button = new Item(520, 50, 780, 305, 0, 0, document.getElementById("ninjaActive"), document.getElementById("ninjaInactive"));
        gameCommon.items.push(button);

    },

    launchNinja: function(){
        var x;
        var y;
        var velX;
        var velY;
        var type;
        var rnd;
        var pos = Math.round(Math.random() * 3);

        if (Math.random() >= 0.5){
            type = document.getElementById("ninjaBlack");
        } else {
            type = document.getElementById("ninjaWhite");
        }

        rnd = Math.round(Math.random()) +1;
        sound = 'audio/lee' + rnd + '.ogg';


        if (pos == 0){
            x = 0;
            y = Math.round(Math.random() * 720);
            if (y > 360) {
                velY = -0.2;
            } else {
                velY = 0.2;
            }
            velX = 0.4;
        }

        if (pos == 1){
            x = 1280;
            y = Math.round(Math.random() * 720);
            velX = -0.4;
            if (y > 360) {
                velY = -0.2;
            } else {
                velY = 0.2;
            }
        }

        if (pos == 2){
            x = Math.round(Math.random() * 1280);
            y = 0;
            velY = 0.2;
            if (x > 640) {
                velX = -0.2;
            } else {
                velX = 0.2;
            }
        }

        var ninja = new Item(x, y, x+NINJA_WIDTH, y+NINJA_HEIGHT, velX, velY, type, document.getElementById("ninjaExplosion"), sound);
        gameCommon.items.push(ninja);


    },

    launchNinjas: function(){
        gameNinja.launchNinja();
        window.setTimeout(gameNinja.launchNinjas, 2000);
    },

    startGame: function() {
        gameNinja.status = 1;
        gameNinja.launchNinjas();
    },

    onUserMove: function(){
        for (i = 0; i < gameCommon.items.length; i++) {
            var ninja = gameCommon.items[i];
            var active = gameCommon.checkActiveItem(ninja);
            //Only one active button
            if (active){
                gameCommon.playSound(ninja.sound);
                ninja.velX = 0;
                ninja.velY = 0;
                ninja.setActive(true);
            }
        }
    },

    gameLoop: function(delta){
        var now = new Date().getTime();
        //Splash
        if (gameNinja.status == 0) {
            var countDown = $("#countDown");
            countDown.text('READY');
            if (now - gameNinja.time > 5000){
                gameNinja.status = 1;
                gameCommon.clearItems();
                countDown.text('');
                gameNinja.startGame();
            }
        } else if (gameNinja.status == 1) {
            var kia = [];
            for (i = 0; i < gameCommon.items.length; i++) {
                var ninja = gameCommon.items[i];
                if ((ninja.active) && (now - ninja.activeTime > 500)){
                    kia.push(ninja);
                }
            }


            for (i = 0; i < kia.length; i++) {
                gameCommon.removeItem(kia[i]);
            }
        }
    }
}
