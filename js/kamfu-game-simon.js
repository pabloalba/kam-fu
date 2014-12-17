


var gameSimon = {
    buttons: [],
    sequence: [],
    index: 0,
    time:0,
    status: 0, //0: Splash, 1: Machine, 2: User, 3: End


    setup: function(gameBackground, gameFront, movementImage) {
        gameSimon.time = new Date().getTime();
        gameSimon.status = 0;
        gameSimon.foregroundImage = $("#simonForeground")[0];
        gameSimon.buttons = [];

        var button;
        button = new Item(810, 50, 930, 170, 0, 0, document.getElementById("buttonYellow"), document.getElementById("buttonYellowBig"), 'audio/note1.ogg');
        gameCommon.items.push(button);
        gameSimon.buttons.push(button);

        button = new Item(350, 50, 470, 170, 0, 0, document.getElementById("buttonGreen"), document.getElementById("buttonGreenBig"), 'audio/note2.ogg');
        gameCommon.items.push(button);
        gameSimon.buttons.push(button);

        button = new Item(910, 500, 1030, 720, 0, 0, document.getElementById("buttonBlue"), document.getElementById("buttonBlueBig"), 'audio/note3.ogg');
        gameCommon.items.push(button);
        gameSimon.buttons.push(button);

        button = new Item(250, 500, 370, 720, 0, 0, document.getElementById("buttonRed"), document.getElementById("buttonRedBig"), 'audio/note4.ogg');
        gameCommon.items.push(button);
        gameSimon.buttons.push(button);

        gameSimon.sequence = [];
        gameSimon.index = 0;

        gameCommon.drawText('READY');
    },

    activateButton: function(button){
        console.log("Activate: " + gameSimon.status);
        if (gameSimon.status == 1 || gameSimon.status == 2){
            button.x1 = button.x1 - 40;
            button.x2 = button.x2 + 40;
            button.y1 = button.y1 - 40;
            button.y2 = button.y2 + 40;
            button.refreshScaled();
            button.setActive(true);
            gameCommon.clearFrontContext();
        }
    },

    deactivateButton: function(button){
        console.log("Dectivate: " + gameSimon.status);
        if (gameSimon.status == 1 || gameSimon.status == 2){
            button.x1 = button.x1 + 40;
            button.x2 = button.x2 - 40;
            button.y1 = button.y1 + 40;
            button.y2 = button.y2 - 40;
            button.refreshScaled();
            button.setActive(false);
            gameCommon.clearFrontContext();
        }
    },


    onUserMove: function(){
        if (gameSimon.status == 2) {
            var anyActive = gameSimon.buttons[0].active ||
                            gameSimon.buttons[1].active ||
                            gameSimon.buttons[2].active ||
                            gameSimon.buttons[3].active;
            for (i = 0; i < gameCommon.items.length; i++) {
                var button = gameCommon.items[i];
                var active = gameCommon.checkActiveItem(button);
                if (active){
                    //Should have been a while inactive
                    if (new Date().getTime() - button.inactiveTime > 500) {
                        if (!anyActive){
                            gameSimon.activateButton(button);
                            if (gameSimon.sequence[gameSimon.index] == button){
                                gameCommon.playSound(button.sound);
                                gameSimon.index++;
                                if (gameSimon.index == gameSimon.sequence.length){
                                    console.log("computer");
                                    gameSimon.status = 1;
                                    gameCommon.drawText("COMPUTER");
                                    window.setTimeout(gameSimon.computerTurn, 3000);
                                }
                            } else {
                                gameSimon.endGame();
                            }
                        }
                    }
                } else {
                    if (button.active){
                        //Should have been a while active
                        if (new Date().getTime() - button.activeTime > 500) {
                            gameSimon.deactivateButton(button);
                        }
                    }
                }
            }
        }
    },

    computerTurn: function(){
        gameSimon.status = 1;
        gameCommon.clearText();
        for (i = 0; i < gameSimon.buttons.length; i++) {
            var button = gameSimon.buttons[i];
            if (button.active){
                gameSimon.deactivateButton(button);
            }
        }
        gameSimon.index = 0;
        var num = Math.floor((Math.random() * 4));
        var button = gameSimon.buttons[num];
        gameSimon.sequence.push(button);
        gameSimon.playSequence(0);
    },

    startUser: function(){
        gameCommon.drawText("YOU");
        window.setTimeout(function(){gameCommon.clearText()}, 1000);
        gameSimon.status = 2;
        gameSimon.index = 0;
    },

    endGame: function(){
        gameSimon.status = 3;
        gameCommon.playSound('audio/wrong.ogg');
        gameCommon.drawText('YOU LOSE!');
        window.setTimeout(function(){gameCommon.startGame(gameMenu)}, 2000);
    },

    playSequence: function(index){
        if (index == gameSimon.sequence.length){
            window.setTimeout(function(){gameSimon.startUser();}, 1000);
        } else {
            console.log("Index: "+index + "Length: "+gameSimon.sequence.length);
            var button = gameSimon.sequence[index];
            gameCommon.playSound(button.sound);
            gameSimon.activateButton(button);
            window.setTimeout(function(){console.log('A '+gameSimon.status);gameSimon.deactivateButton(button)}, 500);
            window.setTimeout(function(){gameSimon.playSequence(index+1)}, 1000);
        }
    },


    splash: function(){
        var now = new Date().getTime();
        if (now - gameSimon.time > 2000){
            gameSimon.status = 1;
            gameCommon.clearText();
            gameCommon.drawText("COMPUTER");
            window.setTimeout(gameSimon.computerTurn, 2000);
        }
    },

    gameLoop: function(delta){
        //Splash
        if (gameSimon.status == 0) {
            gameSimon.splash();
        }
    }
}
