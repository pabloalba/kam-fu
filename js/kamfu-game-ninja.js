var NINJA_WIDTH = 130;
var NINJA_HEIGHT = 145;
var TIME = 20000;


var gameNinja = {
    time: 0,
    foregroundImage: null,
    status: 0, //0: Splash, 1: Game, 2: End
    score: 0,
    level: 0,
    life: 400,
    levelTime: TIME,

    setup: function(gameBackground, gameFront) {
        gameNinja.foregroundImage = $("#ninjaForeground")[0];
        gameNinja.time = new Date().getTime();
        gameNinja.levelTime = TIME;
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
        gameCommon.ctxBack.lineWidth=1;
        gameCommon.ctxBack.fillStyle = "#FF0000";
        gameCommon.ctxBack.strokeRect(20,20,402,40);

        gameCommon.ctxBack.strokeStyle = "#FFB107";
        gameCommon.ctxBack.fillRect(21,21,gameNinja.life,39);
    },

    createRandomNinja: function(){
        if (Math.random() >= 0.5){
            type = document.getElementById("ninjaBlack");
        } else {
            type = document.getElementById("ninjaWhite");
        }
        sound = 'audio/lee' + (Math.round(Math.random()*2) +1) + '.ogg';

        return new Item(0, 0, NINJA_WIDTH, NINJA_HEIGHT, 0, 0, type, document.getElementById("ninjaExplosion"), sound);

    },

    createNinja1: function(ninja){
        ninja = gameNinja.createRandomNinja();
        ninja.x1 = 0;
        ninja.x2 = ninja.x1 + NINJA_WIDTH;
        ninja.y1 = Math.round(Math.random() * 300);
        ninja.y2 = ninja.y1 + NINJA_HEIGHT;
        ninja.velY = 0.2;
        ninja.velX = 0.3 + (Math.random() * 0.2) + (0.1 * gameNinja.level);

        ninja.refreshScaled();
        return ninja;
    },

    createNinja2: function(ninja){
        ninja = gameNinja.createRandomNinja();
        ninja.x1 = 0;
        ninja.x2 = ninja.x1 + NINJA_WIDTH;
        ninja.y1 = Math.round(Math.random() * 300)+300;
        ninja.y2 = ninja.y1 + NINJA_HEIGHT;
        ninja.velY = -0.2;
        ninja.velX = 0.3 + (Math.random() * 0.2) + (0.1 * gameNinja.level);

        ninja.refreshScaled();
        return ninja;
    },

    createNinja3: function(ninja){
        ninja = gameNinja.createRandomNinja();
        ninja.x1 = 1280;
        ninja.x2 = ninja.x1 + NINJA_WIDTH;
        ninja.y1 = Math.round(Math.random() * 300);
        ninja.y2 = ninja.y1 + NINJA_HEIGHT;
        ninja.velY = 0.2;
        ninja.velX = -0.3 - (Math.random() * 0.2) - (0.1 * gameNinja.level);

        ninja.refreshScaled();
        return ninja;
    },

    createNinja4: function(ninja){
        ninja = gameNinja.createRandomNinja();
        ninja.x1 = 1280;
        ninja.x2 = ninja.x1 + NINJA_WIDTH;
        ninja.y1 = Math.round(Math.random() * 300)+300;
        ninja.y2 = ninja.y1 + NINJA_HEIGHT;
        ninja.velY = -0.2;
        ninja.velX = -0.3 - (Math.random() * 0.2) - (0.1 * gameNinja.level);

        ninja.refreshScaled();
        return ninja;
    },



    launchNinjas: function(){
        var ninjas = [gameNinja.createNinja1(),gameNinja.createNinja2(), gameNinja.createNinja3(), gameNinja.createNinja4()];
        var max = (gameNinja.level <= 3)?gameNinja.level:3;

        for (i=0; i<= max; i++){
            var rnd = Math.round(Math.random() * (ninjas.length-1));
            console.log("Ninja " + rnd);
            var ninja = ninjas.splice(rnd,1)[0];
            gameCommon.items.push(ninja);
        }

    },

    ninjaStream: function(){
        if (gameNinja.status == 1) {
            gameNinja.launchNinjas();
            window.setTimeout(gameNinja.ninjaStream, 2000 - (gameNinja.level * 100));
        }
    },

    startGame: function() {
        console.log("Start ninja!");
        gameNinja.status = 1;
        gameNinja.ninjaStream();
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
                    if (gameNinja.life > 0) {
                        gameNinja.life -= 100;
                    }
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
        if (now - gameNinja.time > 2000){
            if (gameNinja.status != 1) {
                gameNinja.status = 1;
                gameCommon.clearItems();
                gameCommon.clearText();
                gameNinja.startGame();
            }
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
            gameNinja.levelTime = TIME;
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
