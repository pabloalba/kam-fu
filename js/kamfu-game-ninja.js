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

    setup: function(gameBackground, gameFront) {
        gameNinja.foregroundImage = $("#ninjaForeground")[0];
        gameNinja.time = new Date().getTime();
        gameNinja.levelTime = 20000;
        gameNinja.status= 0,
        gameNinja.score= 0,
        gameNinja.level= 0,
        gameNinja.life= 400,
        gameCommon.playMusic("audio/music_fight.ogg");
        gameCommon.drawText('READY');
    },

    drawGameData: function(){
        gameCommon.ctxBack.font = "bold 96px Nunito";
        gameCommon.ctxBack.clearRect(0, 0, 450, 200);
        gameCommon.ctxBack.clearRect(1000, 0, 402, 200);
        gameCommon.ctxBack.clearRect(500, 450, 290, 250);
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
        gameCommon.ctxBack.fillText(s, 550, 650);
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


        if (Math.random() >= 0.5){
            x = 0;
            y = Math.round(Math.random() * 720);
            if (y > 360) {
                velY = -0.2;
            } else {
                velY = 0.2;
            }
            velX = 0.4;
        } else {
            x = 1280;
            y = Math.round(Math.random() * 720);
            velX = -0.4;
            if (y > 360) {
                velY = -0.2;
            } else {
                velY = 0.2;
            }
        }

        velY = velY * (1+(gameNinja.level/10));
        velX = velX * (1+(gameNinja.level/10));



        var ninja = new Item(x, y, x+NINJA_WIDTH, y+NINJA_HEIGHT, velX, velY, type, document.getElementById("ninjaExplosion"), sound);
        gameCommon.items.push(ninja);


    },

    launchNinjas: function(){
        if (gameNinja.status == 1) {
            gameNinja.launchNinja();
            window.setTimeout(gameNinja.launchNinjas, 2000 - (gameNinja.level * 50));
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
            ((x > 385) && (x < 885) && (y>320)) ||
            ((x > 520) && (x < 760) && (y>50))
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
        if (now - gameNinja.time > 5000){
            gameNinja.status = 1;
            gameCommon.clearItems();
            gameCommon.clearText();
            gameNinja.startGame();
        }
    },

    gameTick: function(delta){
        var now = new Date().getTime();
        gameNinja.levelTime -= delta;
        if (gameNinja.life <= 0) {
            gameCommon.drawText('YOU LOSE!');
            gameNinja.status = 2;
            window.setTimeout(function(){gameCommon.startGame(gameMenu)}, 2000);
        }
        if (gameNinja.levelTime <= 0) {
            gameCommon.drawText('NEXT LEVEL!');
            gameNinja.level++;
            gameNinja.status = 0;
            gameNinja.time = now;
            gameNinja.levelTime = 20000;
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
