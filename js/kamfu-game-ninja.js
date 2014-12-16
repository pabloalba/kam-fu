var NINJA_WIDTH = 130;
var NINJA_HEIGHT = 145;


var gameNinja = {
    time: 0,
    foregroundImage: null,
    status: 0,
    score: 0,
    level: 0,
    life: 400,
    levelTime: 20000,

    setup: function(gameBackground, gameFront, movementImage) {
        gameNinja.foregroundImage = $("#ninjaForeground")[0];
        gameNinja.time = new Date().getTime();
        gameNinja.levelTime = 20000;
        gameNinja.status= 0,
        gameNinja.score= 0,
        gameNinja.level= 0,
        gameNinja.life= 400,
        gameCommon.playMusic("audio/music_fight.ogg");
    },

    drawGameData: function(){
        gameCommon.ctxBack.font = "bold 96px Nunito";
        gameCommon.ctxBack.clearRect(0, 0, 1280, 200);
        gameNinja.drawScore();
        gameNinja.drawLife();
        gameNinja.drawTime();
    },

    drawScore: function(){
        gameCommon.ctxBack.fillStyle = "#FFB107";
        var s = gameNinja.score+"";
        while (s.length < 3) s = "0" + s;
        gameCommon.ctxBack.fillText(s, 1000, 80);
    },

    drawTime: function(){
        gameCommon.ctxBack.fillStyle = "#0000FF";
        var s = Math.ceil(gameNinja.levelTime / 1000)+"";
        while (s.length < 3) s = "0" + s;
        gameCommon.ctxBack.fillText(s, 600, 80);
    },

    drawLife: function(){
        gameCommon.ctxBack.fillStyle = "#FF0000";
        gameCommon.ctxBack.strokeRect(20,20,402,40);

        gameCommon.ctxBack.strokeStyle = "#FFB107";
        gameCommon.ctxBack.fillRect(21,21,gameNinja.life,39);
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
        if (gameNinja.status == 1) {
            gameNinja.launchNinja();
            window.setTimeout(gameNinja.launchNinjas, 2000);
        }
    },

    startGame: function() {
        gameNinja.status = 1;
        gameNinja.launchNinjas();
    },

    checkPunch: function(ninja){
        var x = (ninja.x1 + ninja.x2) / 2;
        var y = (ninja.y1 + ninja.y2) / 2;

        if (
            ((x > 320) && (x < 960) && (y>500)) ||
            ((x > 520) && (x < 760) && (y>125))
            ){
                return true;
            }
        return false;
    },

    onUserMove: function(){
        for (i = 0; i < gameCommon.items.length; i++) {
            var ninja = gameCommon.items[i];
            if (!ninja.active){
                var checkPunch = gameNinja.checkPunch(ninja);
                var active = gameCommon.checkActiveItem(ninja);
                if (checkPunch){
                    gameCommon.playSound('audio/ouch.ogg');
                    ninja.velX = 0;
                    ninja.velY = 0;
                    ninja.imageActive = null;
                    ninja.setActive(true);
                    gameNinja.life -= 100;
                } else if (active){
                    gameCommon.playSound(ninja.sound);
                    ninja.velX = 0;
                    ninja.velY = 0;
                    ninja.setActive(true);
                    gameNinja.score += 10;
                }


            }
        }
    },

    splash: function(){
        var now = new Date().getTime();
        var countDown = $("#countDown");
        countDown.text('READY');
        if (now - gameNinja.time > 5000){
            gameNinja.status = 1;
            gameCommon.clearItems();
            countDown.text('');
            gameNinja.startGame();
        }
    },

    gameTick: function(delta){
        var now = new Date().getTime();
        var countDown = $("#countDown");
        gameNinja.levelTime -= delta;
        if (gameNinja.life <= 0) {
            countDown.text('YOU LOSE!');
            gameNinja.status = 2;
            window.setTimeout(function(){countDown.text('');gameCommon.startGame(gameMenu)}, 2000);
        }
        if (gameNinja.levelTime <= 0) {
            countDown.text('TIME UP!');
            gameNinja.status = 2;
            window.setTimeout(function(){countDown.text('');gameCommon.startGame(gameMenu)}, 2000);
        } else {
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
    },



    gameLoop: function(delta){

        gameNinja.drawGameData();
        //Splash
        if (gameNinja.status == 0) {
            gameNinja.splash()
        } else if (gameNinja.status == 1) {
            gameNinja.gameTick(delta);
        }
    }
}
