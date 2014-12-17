$(document).ready(function() {
    console.log( "ready!" );

    var gameForeground = $('#gameForeground')[0];
    var gameFront = $('#gameFront')[0];
    var gameBack = $('#gameBack')[0];
    var gameText = $('#gameText')[0];
    gameCommon.setup(gameForeground, gameFront, gameBack, gameText);

    var video = document.querySelector('video');
    camera.setup(video, gameCommon.onSnapshot, gameCommon.initCallback);

    window.setTimeout(gameCommon.mainLoop, 100);



    $( "body" ).click(function() {
        var r = confirm("Reset camera?");
        if (r == true) {
            gameCommon.clearup();
            camera.initialized = false;
            camera.startupTime = 0;
        }
    });

});
