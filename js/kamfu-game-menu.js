


var gameMenu = {
    activeButton: null,

    setup: function(gameBackground, gameFront, movementImage) {
        var button = new Item(100, 100, 360, 355, document.getElementById("danceActive"), document.getElementById("danceInactive"), 'audio/dance.ogg');
        gameCommon.items.push(button);

        button = new Item(920, 100, 1180, 355, document.getElementById("ninjaActive"), document.getElementById("ninjaInactive"), 'audio/lee1.ogg');
        gameCommon.items.push(button);


        button = new Item(560, 0, 720, 145, document.getElementById("simonActive"), document.getElementById("simonInactive"), 'audio/menu.ogg');
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
                    document.getElementById('effect').src = button.sound;
                    document.getElementById('effect').play()
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

    }
}
