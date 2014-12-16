


var gameSimon = {
    buttonYellow: null,
    buttonGreen: null,
    buttonBlue: null,
    buttonRed: null,


    setup: function(gameBackground, gameFront, movementImage) {
        gameSimon.foregroundImage = $("#simonForeground")[0];

        gameSimon.buttonGreen = new Item(350, 50, 470, 170, 0, 0, document.getElementById("buttonGreen"), document.getElementById("buttonGreen"), '');
        gameCommon.items.push(gameSimon.buttonGreen);

        gameSimon.buttonYellow = new Item(810, 50, 930, 170, 0, 0, document.getElementById("buttonYellow"), document.getElementById("buttonYellow"), '');
        gameCommon.items.push(gameSimon.buttonYellow);

        gameSimon.buttonRed = new Item(250, 500, 370, 720, 0, 0, document.getElementById("buttonRed"), document.getElementById("buttonRed"), '');
        gameCommon.items.push(gameSimon.buttonRed);

        gameSimon.buttonBlue = new Item(910, 500, 1030, 720, 0, 0, document.getElementById("buttonBlue"), document.getElementById("buttonBlue"), '');
        gameCommon.items.push(gameSimon.buttonBlue);


    },

    onUserMove: function(){

    },

    gameLoop: function(delta){

    }
}
