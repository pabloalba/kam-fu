


var gameMenu = {
    activeButton: null,
    foregroundImage: null,

    setup: function(gameBackground, gameFront, movementImage) {

        gameCommon.playMusic("audio/music_intro.ogg");
        var button = new Item(100, 100, 360, 355, 0, 0, document.getElementById("danceActive"), document.getElementById("danceInactive"), 'audio/dance.ogg', {game:gameDance});
        gameCommon.items.push(button);

        button = new Item(920, 100, 1180, 355, 0, 0, document.getElementById("ninjaActive"), document.getElementById("ninjaInactive"), 'audio/lee1.ogg', {game:gameNinja});
        gameCommon.items.push(button);


        button = new Item(560, 0, 720, 145, 0, 0, document.getElementById("simonActive"), document.getElementById("simonInactive"), 'audio/simon.ogg', {game:gameSimon});
        gameCommon.items.push(button);

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
        if ((gameMenu.activeButton != null) &&
            (new Date().getTime() - gameMenu.activeButton.activeTime) > 3000){
                gameCommon.playSound("audio/select.ogg");
                gameCommon.startGame(gameMenu.activeButton.data.game);
        }
    }
}
