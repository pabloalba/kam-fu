var debug = false;
var IMAGE_WIDTH = 320;
var IMAGE_HEIGHT = 180;

var GAME_WIDTH = 1280;
var GAME_HEIGHT = 720;



function Item (x1, y1, x2, y2, colorInactive, colorActive1, colorActive2) {
    this.x1 = x1;
    this.x2 = x2;
    this.y1 = y1;
    this.y2 = y2;
    this.active = false;
    this.colorInactive = colorInactive;
    this.colorActive1 = colorActive1;
    this.colorActive2 = colorActive2;
    this.activeTime = Number.MAX_VALUE;
    this.inactiveTime = 0;

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


var gameMenu = {
    ctxBack:null,
    ctxFront:null,
    movementImage: null,
    movementCanvas:null,
    buttons: [],

    setup: function(gameBackground, gameFront, movementImage) {

        gameMenu.movementImage=movementImage;

        gameMenu.ctxBack=gameBackground.getContext("2d");
        gameMenu.ctxFront=gameFront.getContext("2d");



        var img=document.getElementById("backImage");
        gameMenu.ctxBack.drawImage(img,0,0);

        var button = new Item(100, 100, 250, 200, "#00FF00", "#00FFFF", "#0000FF");
        gameMenu.buttons.push(button);

    },

    interactions: function(){
        for (i = 0; i < gameMenu.buttons.length; i++) {
            var button = gameMenu.buttons[i];
            button.setActive(gameMenu.checkActiveButton(button));
        }
    },

    checkActiveButton: function(button){

        for (x=button.scaledX1;x<button.scaledX2;x++){
            if (gameMenu.checkMovementPixel(x,button.scaledY1) ||
                gameMenu.checkMovementPixel(x,button.scaledY2)){
                    return true;
            }
        }
        for (y=button.scaledY1;y<button.scaledY2;y++){
            if (gameMenu.checkMovementPixel(button.scaledX1,y) ||
                gameMenu.checkMovementPixel(button.scaledX2,y)){
                    return true;
            }
        }
        return false;
    },

    checkMovementPixel: function(x,y){
        var pixelData = gameMenu.movementCanvas.getContext('2d').getImageData(x, y, 1, 1).data;
        return (pixelData[0] == 255 &&
                pixelData[1] == 0 &&
                pixelData[2] == 255)
    },

    drawButton: function(button){
        if (button.active){
            if ((new Date().getTime() - button.activeTime) > 1500) {
                gameMenu.ctxFront.fillStyle = button.colorActive2;
            } else {
                gameMenu.ctxFront.fillStyle = button.colorActive1;
            }
        } else {
            gameMenu.ctxFront.fillStyle = button.colorInactive;
        }


        //Mirror
        gameMenu.ctxFront.fillRect((GAME_WIDTH - button.x2), button.y1, (button.x2 - button.x1),button.y2-button.y1);
    },

    mainLoop: function(){
        for (i = 0; i < gameMenu.buttons.length; i++) {
            gameMenu.drawButton (gameMenu.buttons[i]);
        }
        window.setTimeout(gameMenu.mainLoop, 10);
    }


}


$(document).ready(function() {
    console.log( "ready!" );
    var movementImage = $("#movementImage")

    if (debug) {
        movementImage.css('display','block');
    }

    var onSnapshot = function(data){
        movementImage.attr('src', data.getImageDataUrl());
        var img = movementImage[0];
        if (gameMenu.movementCanvas == null) {
            gameMenu.movementCanvas = $('<canvas/>')[0];
            gameMenu.movementCanvas.width = img.width;
            gameMenu.movementCanvas.height = img.height;
        }
        gameMenu.movementCanvas.getContext('2d').drawImage(img, 0, 0, img.width, img.height);

        gameMenu.interactions();
    }

    var gameBackground = $('#gameBackground')[0];
    var gameFront = $('#gameFront')[0];
    gameMenu.setup(gameBackground, gameFront);

    var video = document.querySelector('video');
    var countDown = $("#countDown");
    camera.setup(video,countDown, onSnapshot);
    window.setTimeout(camera.loop, 1000);

    window.setTimeout(gameMenu.mainLoop, 100);




});
