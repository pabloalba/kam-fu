


var gameSimon = {
    buttons: [],
    sequence: [],
    index: 0,
    time:0,
    status: 0, //0: Splash, 1: Machine, 2: User, 3: End, 4: Pause


    setup: function(gameBackground, gameFront, movementImage) {
        gameSimon.time = new Date().getTime();
        gameSimon.status = 0;
        gameSimon.foregroundImage = $("#simonForeground")[0];
        gameSimon.buttons = [];

        var button;
        button = new Item(1010, 50, 1130, 170, 0, 0, document.getElementById("buttonYellow"), document.getElementById("buttonYellowBig"), 'audio/note1.ogg');
        gameCommon.items.push(button);
        gameSimon.buttons.push(button);

        button = new Item(150, 50, 270, 170, 0, 0, document.getElementById("buttonGreen"), document.getElementById("buttonGreenBig"), 'audio/note2.ogg');
        gameCommon.items.push(button);
        gameSimon.buttons.push(button);

        button = new Item(1010, 500, 1130, 720, 0, 0, document.getElementById("buttonBlue"), document.getElementById("buttonBlueBig"), 'audio/note3.ogg');
        gameCommon.items.push(button);
        gameSimon.buttons.push(button);

        button = new Item(150, 500, 270, 720, 0, 0, document.getElementById("buttonRed"), document.getElementById("buttonRedBig"), 'audio/note4.ogg');
        gameCommon.items.push(button);
        gameSimon.buttons.push(button);

        gameSimon.sequence = [];
        gameSimon.addSequence();
        gameSimon.addSequence();
        gameSimon.index = 0;

        gameCommon.drawText('READY');
    },

    activateButton: function(button){
        if (!button.active){
            button.x1 = button.x1 - 40;
            button.x2 = button.x2 + 40;
            button.y1 = button.y1 - 40;
            button.y2 = button.y2 + 40;
            button.refreshScaled();
            button.setActive(true);
            window.setTimeout(function(){gameSimon.deactivateButton(button)}, 400);
        }
    },

    deactivateButton: function(button){
        if (button.active){ //Prevent double deactivation
            button.setActive(false);
            button.x1 = button.x1 + 40;
            button.x2 = button.x2 - 40;
            button.y1 = button.y1 + 40;
            button.y2 = button.y2 - 40;
            button.refreshScaled();
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
                    if ((!anyActive) && (new Date().getTime() - button.inactiveTime > 500)) {
                        gameSimon.activateButton(button);
                        if (gameSimon.sequence[gameSimon.index] == button){
                            gameCommon.playSound(button.sound);
                            gameSimon.index++;
                            if (gameSimon.index == gameSimon.sequence.length){
                                gameSimon.endUserTurn();
                            }
                        } else {
                            gameSimon.endGame();
                        }
                    }
                }
            }
        }
    },

    endUserTurn: function(){
        gameSimon.status = 1;
        gameSimon.index = 0;
        gameCommon.drawText("COMPUTER");
        window.setTimeout(gameSimon.computerTurn, 2000);
    },

    addSequence: function(){
        var num = Math.floor((Math.random() * 4));
        var button = gameSimon.buttons[num];
        gameSimon.sequence.push(button);
    },

    computerTurn: function(){
        gameCommon.clearText();
        gameSimon.addSequence();
        gameSimon.playSequence(0);
    },

    startUser: function(){
        gameSimon.status = 4;
        gameCommon.drawText("YOU");
        gameSimon.status = 2;
        window.setTimeout(function(){gameCommon.clearText();}, 1000);
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
            var button = gameSimon.sequence[index];
            gameCommon.playSound(button.sound);
            gameSimon.activateButton(button);

            var time = 900 - (gameSimon.sequence.length * 50);
            if (time < 500) {
                time = 500;
            }
            window.setTimeout(function(){gameSimon.playSequence(index+1)}, time);
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
