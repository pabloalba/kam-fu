


var gameMenu = {
    activeButton: null,
    foregroundImage: null,

    setup: function(gameBackground, gameFront, movementImage) {
        gameMenu.activeButton = null;

        gameCommon.playMusic("audio/music_intro.ogg");
        var button = new Item(100, 75, 360, 330, 0, 0, document.getElementById("danceActive"), document.getElementById("danceInactive"), 'audio/dance.ogg', {game:gameDance});
        gameCommon.items.push(button);

        button = new Item(920, 75, 1180, 330, 0, 0, document.getElementById("ninjaActive"), document.getElementById("ninjaInactive"), 'audio/lee1.ogg', {game:gameNinja});
        gameCommon.items.push(button);

        button = new Item(920, 425, 1180, 680, 0, 0, document.getElementById("simonActive"), document.getElementById("simonInactive"), 'audio/simon.ogg', {game:gameSimon});
        gameCommon.items.push(button);

        button = new Item(100, 425, 360, 680, 0, 0, document.getElementById("changeUserActive"), document.getElementById("changeUserInactive"), 'audio/changeUser.ogg', {game:null});
        gameCommon.items.push(button);

    },

    changePlayer: function(){
        gameCommon.clearup();
        camera.initialized = false;
        camera.startupTime = 0;
    },

    onUserMove: function(){
        for (i = 0; i < gameCommon.items.length; i++) {
            var button = gameCommon.items[i];
            var active = gameCommon.checkActiveItem(button);
            //Only one active button
            if (active){
                if (gameMenu.activeButton != null) {
                    if (gameMenu.activeButton == button){
                        button.setActive(active);
                    }
                } else {
                    gameCommon.ctxBack.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
                    button.setActive(active);
                    gameMenu.activeButton = button;
                    gameCommon.playSound(button.sound);
                }
            } else {
                button.setActive(active);
                if (gameMenu.activeButton == button){
                    gameMenu.activeButton = null;
                }
            }

        }
    },

    gameLoop: function(delta){
        if (gameMenu.activeButton != null){
            var time = (new Date().getTime() - gameMenu.activeButton.activeTime);
            if (time > 1000){
                gameCommon.playSound("audio/select.ogg");
                if (gameMenu.activeButton.data.game != null){
                    gameCommon.startGame(gameMenu.activeButton.data.game);
                } else {
                    gameMenu.changePlayer();
                }
            } else {
                var x = 1280 -gameMenu.activeButton.x2 + 130;
                var y = gameMenu.activeButton.y1 + 127;
                var percent = time / 1000;

                gameCommon.ctxBack.lineWidth=20;
                gameCommon.ctxBack.strokeStyle = "#FFFF00";
                gameCommon.ctxBack.beginPath();
                gameCommon.ctxBack.arc(x, y, 160, 0, percent * 2 * Math.PI);
                gameCommon.ctxBack.stroke();
            }
        } else {
            gameCommon.ctxBack.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
        }
    }
}
