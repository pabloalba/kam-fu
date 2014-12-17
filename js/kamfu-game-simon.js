


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
                                    gameSimon.endUserTurn();
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

    endUserTurn: function(){
        gameSimon.status = 1;
        gameSimon.index = 0;
        gameCommon.drawText("COMPUTER");
        window.setTimeout(gameSimon.computerTurn, 3000);
        for (i = 0; i < gameSimon.buttons.length; i++) {
            var button = gameSimon.buttons[i];
            if (button.active){
                window.setTimeout(function(){gameSimon.deactivateButton(button);}, 200);
            }
        }
    },

    computerTurn: function(){
        gameCommon.clearText();
        var num = Math.floor((Math.random() * 4));
        var button = gameSimon.buttons[num];
        gameSimon.sequence.push(button);
        gameSimon.playSequence(0);
    },

    startUser: function(){
        gameSimon.status = 4;
        gameCommon.drawText("YOU");
        window.setTimeout(function(){gameCommon.clearText(); gameSimon.status = 2;}, 1000);
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
            window.setTimeout(function(){gameSimon.deactivateButton(button)}, 500);

            var time = 1000 - (gameSimon.sequence.length * 50);
            if (time < 600) {
                time = 600;
            }

            console.log(time);

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
