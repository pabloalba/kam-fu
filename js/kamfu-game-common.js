var debug = false;
var IMAGE_WIDTH = 320;
var IMAGE_HEIGHT = 180;

var GAME_WIDTH = 1280;
var GAME_HEIGHT = 720;



function Item (x1, y1, x2, y2, velX, velY, imageInactive, imageActive, sound, data) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.velX = velX;
    this.velY = velY;
    this.active = false;
    this.imageInactive = imageInactive;
    this.imageActive = imageActive;
    this.activeTime = Number.MAX_VALUE;
    this.inactiveTime = 0;
    this.sound = sound;
    this.data = data;

    this.scaledX1 = Math.round(x1 * IMAGE_WIDTH / GAME_WIDTH);
    this.scaledX2 = Math.round(x2 * IMAGE_WIDTH / GAME_WIDTH);
    this.scaledY1 = Math.round(y1 * IMAGE_HEIGHT / GAME_HEIGHT);
    this.scaledY2 = Math.round(y2 * IMAGE_HEIGHT / GAME_HEIGHT);

    this.setActive = function(active){

        if (active && (!this.active)){
            this.activeTime = new Date().getTime();
            this.inactiveTime = Number.MAX_VALUE;
        }

        if (!active && this.active){
            this.activeTime = Number.MAX_VALUE;
            this.inactiveTime = new Date().getTime();
        }

        this.active = active;
    }

    this.refreshScaled = function() {
        this.scaledX1 = Math.round(this.x1 * IMAGE_WIDTH / GAME_WIDTH);
        this.scaledX2 = Math.round(this.x2 * IMAGE_WIDTH / GAME_WIDTH);
        this.scaledY1 = Math.round(this.y1 * IMAGE_HEIGHT / GAME_HEIGHT);
        this.scaledY2 = Math.round(this.y2 * IMAGE_HEIGHT / GAME_HEIGHT);
    }
}


var gameCommon = {
    ctxForeGround:null,
    ctxFront:null,
    movementImage: null,
    activeItem: null,
    items: [],
    onUserMove: function() {},
    gameLoop: function() {},
    time: 0,

    clearItems: function(){
        gameCommon.items = [];
        gameCommon.ctxFront.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    },

    clearup: function(){
        gameCommon.stopMusic();
        gameCommon.clearItems();
        gameCommon.onUserMove = function() {};
        gameCommon.gameLoop = function() {};
        gameCommon.ctxFront.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    },

    startGame: function(game){
        gameCommon.clearup(),
        game.setup();
        gameCommon.onUserMove = game.onUserMove;
        gameCommon.gameLoop = game.gameLoop;

        if (game.foregroundImage != null) {
            gameCommon.ctxForeGround.drawImage(game.foregroundImage,0,0);
        } else {
            gameCommon.ctxForeGround.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        }
    },

    setup: function(gameForeground, gameFront, movementImage) {
        gameCommon.time = new Date().getTime();

        gameCommon.movementImage=movementImage;

        gameCommon.ctxForeGround=gameForeground.getContext("2d");
        gameCommon.ctxFront=gameFront.getContext("2d");

        gameCommon.drawSilhouette();
    },

    onSnapshot: function(data){
        //gameCommon.movementImage.attr('src', data.getImageDataUrl());
        gameCommon.onUserMove();
    },

    removeItem: function(item){
        var index = gameCommon.items.indexOf(item);

        if (index > -1) {
            gameCommon.items.splice(index, 1);
            gameCommon.clearItem(item);
        }
    },
    checkActiveItem: function(item){

        for (x=item.scaledX1;x<item.scaledX2;x++){
            if (imageComparator.checkPixelChanged(x,item.scaledY1) ||
                imageComparator.checkPixelChanged(x,item.scaledY2)){
                    console.log(true);
                    return true;
            }
        }
        for (y=item.scaledY1;y<item.scaledY2;y++){
            if (imageComparator.checkPixelChanged(item.scaledX1,y) ||
                imageComparator.checkPixelChanged(item.scaledX2,y)){
                    console.log(true);
                    return true;
            }
        }
        console.log(false);
        return false;
    },

    drawItem: function(item){
        //(new Date().getTime() - item.activeTime) > 3000)
        var img;
        if (item.active){
            img=item.imageActive;
        } else {
            img=item.imageInactive;
        }


        //Mirror
        gameCommon.ctxFront.drawImage(img,(GAME_WIDTH - item.x2), item.y1);
    },

    clearItem: function(item){
        gameCommon.ctxFront.clearRect((GAME_WIDTH - item.x2), item.y1, 260, 255);
    },


    drawSilhouette:  function(){
        var img=document.getElementById("silhouette");
        gameCommon.ctxFront.drawImage(img,390,247);
    },

    mainLoop: function(){
        var time = new Date().getTime()
        var delta = time - gameCommon.time;
        gameCommon.time = time;

        gameCommon.gameLoop(delta);

        for (i = 0; i < gameCommon.items.length; i++) {
            var item = gameCommon.items[i];
            gameCommon.clearItem(item);
            var antes = item.x1;
            item.x1 = Math.round(item.x1 + (delta * item.velX));
            item.x2 = Math.round(item.x2 + (delta * item.velX));
            item.y1 = Math.round(item.y1 + (delta * item.velY));
            item.y2 = Math.round(item.y2 + (delta * item.velY));
            item.refreshScaled();
            gameCommon.drawItem (item);
        }

        gameCommon.drawSilhouette();

        window.setTimeout(gameCommon.mainLoop, 10);
    },

    playMusic: function(music){
        document.getElementById('music').src = music;
        document.getElementById('music').play()
    },

    stopMusic: function(){
        document.getElementById('music').pause();
    },

    playSound: function(sound){
        document.getElementById('effect').src = sound;
        document.getElementById('effect').play()
    },

    initCallback: function(){
        gameCommon.startGame(gameMenu);
    }

}


$(document).ready(function() {
    console.log( "ready!" );
    var movementImage = $("#movementImage");

    if (debug) {
        movementImage.css('display','block');
    }

    var gameForeground = $('#gameForeground')[0];
    var gameFront = $('#gameFront')[0];
    gameCommon.setup(gameForeground, gameFront, movementImage);

    var video = document.querySelector('video');
    var countDown = $("#countDown");
    camera.setup(video,countDown, gameCommon.onSnapshot, gameCommon.initCallback);


    window.setTimeout(gameCommon.mainLoop, 100);

});
