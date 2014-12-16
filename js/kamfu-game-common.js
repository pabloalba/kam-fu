var debug = false;
var IMAGE_WIDTH = 320;
var IMAGE_HEIGHT = 180;

var GAME_WIDTH = 1280;
var GAME_HEIGHT = 720;



function Item (x1, y1, x2, y2, imageInactive, imageActive, sound) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.active = false;
    this.imageInactive = imageInactive;
    this.imageActive = imageActive;
    this.activeTime = Number.MAX_VALUE;
    this.inactiveTime = 0;
    this.sound = sound;

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
}


var gameCommon = {
    ctxBack:null,
    ctxFront:null,
    movementImage: null,
    movementCanvas:null,
    activeItem: null,
    items: [],
    onUserMove: function() {},
    gameLoop: function() {},
    time: 0,

    clearup: function(){
        gameCommon.items = [];
        gameCommon.onUserMove = function() {};
        gameCommon.gameLoop = function() {};
        gameCommon.ctxFront.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    },

    startGame: function(game){
        gameCommon.clearup(),
        game.setup();
        gameCommon.onUserMove = game.onUserMove;
        gameCommon.gameLoop = game.gameLoop;
    },

    setup: function(gameBackground, gameFront, movementImage) {
        gameCommon.time = new Date().getTime();

        gameCommon.movementImage=movementImage;

        gameCommon.ctxBack=gameBackground.getContext("2d");
        gameCommon.ctxFront=gameFront.getContext("2d");

        //var img=document.getElementById("backImage");
        //gameCommon.ctxBack.drawImage(img,0,0);

        gameCommon.drawSilhouette();
    },

    onSnapshot: function(data){
        gameCommon.movementImage.attr('src', data.getImageDataUrl());
        var img = gameCommon.movementImage[0];
        if (gameCommon.movementCanvas == null) {
            gameCommon.movementCanvas = $('<canvas/>')[0];
            gameCommon.movementCanvas.width = img.width;
            gameCommon.movementCanvas.height = img.height;
        }
        gameCommon.movementCanvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

        gameCommon.onUserMove();
    },



    checkActiveItem: function(item){

        for (x=item.scaledX1;x<item.scaledX2;x++){
            if (gameCommon.checkMovementPixel(x,item.scaledY1) ||
                gameCommon.checkMovementPixel(x,item.scaledY2)){
                    return true;
            }
        }
        for (y=item.scaledY1;y<item.scaledY2;y++){
            if (gameCommon.checkMovementPixel(item.scaledX1,y) ||
                gameCommon.checkMovementPixel(item.scaledX2,y)){
                    return true;
            }
        }
        return false;
    },

    checkMovementPixel: function(x,y){
        var pixelData = gameCommon.movementCanvas.getContext('2d').getImageData(x, y, 1, 1).data;
        return (pixelData[0] == 255 &&
                pixelData[1] == 0 &&
                pixelData[2] == 255)
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
        gameCommon.ctxFront.clearRect((GAME_WIDTH - item.x2), item.y1, 260, 255);
        gameCommon.ctxFront.drawImage(img,(GAME_WIDTH - item.x2), item.y1);
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
            gameCommon.drawItem (gameCommon.items[i]);
        }

        window.setTimeout(gameCommon.mainLoop, 10);
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

    var gameBackground = $('#gameBackground')[0];
    var gameFront = $('#gameFront')[0];
    gameCommon.setup(gameBackground, gameFront, movementImage);

    var video = document.querySelector('video');
    var countDown = $("#countDown");
    camera.setup(video,countDown, gameCommon.onSnapshot, gameCommon.initCallback);


    window.setTimeout(gameCommon.mainLoop, 100);

});
