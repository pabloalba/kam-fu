var HAND_WIDTH = 160;
var HAND_HEIGHT = 150;


var gameDance = {
    time:0,
    status: 0, //0: Splash, 1: Select, 2: Play, 3: End
    tempo: 1155,
    song: [],
    audio: null,
    index: 0,
    lastNoteIndex: -1,
    score: 0,
    manualTime: [],


    setup: function(gameBackground, gameFront, movementImage) {
        gameDance.time = new Date().getTime();
        gameDance.status = 0;
        gameDance.foregroundImage = $("#danceForeground")[0];
        gameDance.audio = document.getElementById('effect');
        gameCommon.drawText('READY');

    },

    startSelectSong:function(){
        gameDance.status = 1;
        gameCommon.items = [];
        var button;
        button = new Item(210, 400, 370, 542, 0, 0, document.getElementById("song1"), document.getElementById("song1"), '');
        gameCommon.items.push(button);

        button = new Item(910, 400, 1070, 542, 0, 0, document.getElementById("song2"), document.getElementById("song2"), '');
        gameCommon.items.push(button);
    },


    startSong: function(){
        gameCommon.items = [];
        var button;
        button = new Item(910, 400, 1070, 542, 0, 0, document.getElementById("hand1Black"), document.getElementById("hand1Black"), '', {black:document.getElementById("hand1Black"), color: document.getElementById("hand1Color"), success:document.getElementById("hand1Success"), circleColor:"#924FC4", songTime: 0});
        gameCommon.items.push(button);

        button = new Item(210, 400, 370, 542, 0, 0, document.getElementById("hand2Black"), document.getElementById("hand2Black"), '', {black:document.getElementById("hand2Black"), color: document.getElementById("hand2Color"), success:document.getElementById("hand2Success"), circleColor:"#20FF15", songTime: 0});
        gameCommon.items.push(button);

        button = new Item(810, 0, 970, 150, 0, 0, document.getElementById("hand3Black"), document.getElementById("hand3Black"), '', {black:document.getElementById("hand3Black"), color: document.getElementById("hand3Color"), success:document.getElementById("hand3Success"), circleColor:"#151BFF", songTime: 0});
        gameCommon.items.push(button);

        button = new Item(310, 0, 470, 150, 0, 0, document.getElementById("hand4Black"), document.getElementById("hand4Black"), '', {black:document.getElementById("hand4Black"), color: document.getElementById("hand4Color"), success:document.getElementById("hand4Success"), circleColor:"#FEFB16", songTime: 0});
        gameCommon.items.push(button);


        gameDance.index = 0;
        gameDance.lastIndex = -1;
        gameDance.score = 0;

        gameDance.status = 2;
        gameCommon.clearText();
        gameDance.audio.play();

        /*$("#debugText").keypress(function() {
            console.log("ok");
            gameDance.manualTime.push(Math.round(gameDance.audio.currentTime * 1000));
        });

        gameDance.manualTime = []; */
    },



    loadSong:function(times, song){
        gameDance.song = [];

        for (i = 0; i < times.length; i++) {
            var move = [];
            if (Math.random() >= 0.9){
                move.push(2);
                move.push(3);
            } else {
                var num1 = Math.floor((Math.random() * 4));
                move.push(num1);
            }

            gameDance.song.push({time: times[i], move:move});
        }
        gameDance.song.push({time: times[times.length-1]+1000, move:[]});

        gameDance.audio.src = song;
    },

    loadSong1: function(){
        var times = [0, 1246.392, 2452.849, 3477.259, 4645.179, 5778.85, 6950.129, 8077.553, 9180.35, 10285.418, 11440.654, 12619.347, 13797.267, 14938.079, 16100.018, 17232.084, 18434.316, 19666.335, 20806.662, 21981.66, 23133.134, 24362.017, 25524.235, 26656.131, 27878.651, 29037.538, 30168.652, 31371.486, 32534.671, 33692.619, 34916.486, 36015.270, 37191.205, 38353.975, 39487.409, 40651.904, 41750.555, 42917.766, 44103.790, 45259.956];
        gameDance.loadSong(times, 'audio/storm.ogg');


    },

    loadSong2: function(){
        var times = [0, 2809.342, 3750.7980000000002, 4726.061, 5602.103999999999, 6512.142, 7437.101000000001, 8336.485, 9232.835, 10196.04, 11148.711000000001, 12049.425, 12950.608, 13903.231, 14831.394, 15716.575, 16652.194000000003, 17541.494, 18441.841, 19407.091999999997, 20371.511000000002, 21316.669, 22191.895, 23151.385000000002, 24027.997, 24992.439000000002, 25936.934, 26825.527000000002, 27784.15, 28659.691, 29617.673, 30499.082000000002, 31436.437, 32384.495000000003, 33297.913, 34219.87, 35137.28, 36033.443, 37000.891, 37900.728, 38791.671, 39741.433, 40698.565, 41634.793000000005, 42568.325000000004, 43482.354999999996, 44368.582];
        gameDance.loadSong(times, 'audio/reggae.ogg');
    },

    onUserMove: function(){
        if (gameDance.status == 1 || gameDance.status == 2) {
            for (i = 0; i < gameCommon.items.length; i++) {
                var button = gameCommon.items[i];
                var active = gameCommon.checkActiveItem(button);
                if (active){
                    //Should have been a while inactive
                    if ((!button.active) && (new Date().getTime() - button.inactiveTime > 300)) {
                        if (gameDance.status == 2) {
                            button.data.songTime = gameDance.audio.currentTime * 1000;
                        }
                        button.setActive(true);
                    }
                } else {
                    //Should have been a while active
                    if ((button.active) && (new Date().getTime() - button.activeTime > 300)) {
                        if (gameDance.status == 2) {
                            button.data.songTime = 0;
                        }
                        button.setActive (false);
                    }
                }
            }
        }
    },

    splash: function(){
        var now = new Date().getTime();
        if (now - gameDance.time > 2000){
            gameDance.startSelectSong();
        }
    },

    circleHand: function(num, fraction){
        var hand = gameCommon.items[num];
        gameCommon.ctxBack.beginPath();
        gameCommon.ctxBack.arc(1280 - (hand.x2 - 80), hand.y1 + 75, fraction * 70, 0, 2 * Math.PI, false);
        gameCommon.ctxBack.lineWidth = 1;
        gameCommon.ctxBack.fillStyle = hand.data.circleColor;
        gameCommon.ctxBack.strokeStyle = hand.data.circleColor;
        gameCommon.ctxBack.fill();
        gameCommon.ctxBack.stroke();

    },

    drawGameData: function(){
        if (gameDance.status == 2) {
            gameCommon.ctxBack.font = "bold 90px Nunito";
            gameDance.drawTime();
        }
    },

    drawTime: function(){
        gameCommon.ctxBack.fillStyle = "#000055";

        gameCommon.ctxBack.beginPath();
        gameCommon.ctxBack.arc(640, 680, 130, 0, 2 * Math.PI, false);
        gameCommon.ctxBack.fill();
        gameCommon.ctxBack.strokeStyle = "#000055";
        gameCommon.ctxBack.stroke();



        gameCommon.ctxBack.fillStyle = "#FFFFFF";
        var s = ""+Math.round((gameDance.audio.duration - gameDance.audio.currentTime));
        if (s != "NaN") {
            while (s.length < 3) s = "0" + s;
            gameCommon.ctxBack.fillText(s, 555, 655);
        }
    },

    clearUpHands: function(){
        for (i = 0; i< 4; i++){
            var hand = gameCommon.items[i];
            hand.imageInactive = gameCommon.items[i].data.black;
            hand.imageActive = gameCommon.items[i].data.black;
            gameCommon.ctxBack.clearRect(hand.x1, hand.y1, HAND_WIDTH, HAND_HEIGHT)
        }
    },



    gameLoop: function(delta){
        //Splash
        if (gameDance.status == 0) {
            gameDance.splash();
        } else if (gameDance.status == 1) {
            if (gameCommon.items[0].active){
                window.setTimeout(function(){
                    gameDance.loadSong1();
                    gameDance.startSong();
                }, 500);

            } else if (gameCommon.items[1].active){
                window.setTimeout(function(){
                    gameDance.loadSong2();
                    gameDance.startSong();
                }, 500);
            }
        } else if (gameDance.status == 2) {
            var timeElapsed = gameDance.audio.currentTime * 1000;

            if (gameDance.index < gameDance.song.length -1) {
                //Clearup
                gameDance.clearUpHands();

                if (timeElapsed >= gameDance.song[gameDance.index+1].time){
                    gameDance.index++;
                }

                if (gameDance.index < gameDance.song.length - 1) {
                    var hands = gameDance.song[gameDance.index].move;
                    var timeLast = gameDance.song[gameDance.index].time;
                    var timeNext = gameDance.song[gameDance.index + 1].time;
                    var timeBetween = timeNext - timeLast;
                    var timeFromLast = timeElapsed - timeLast;
                    var timeToNext = timeNext - timeElapsed;



                    if (gameDance.index > 0) {
                        if (timeFromLast < 400) {
                            var actives = true;
                            var mediumTime = 0;
                            for (i=0; i< hands.length; i++) {
                                var hand = gameCommon.items[hands[i]];
                                hand.imageInactive = gameCommon.items[hands[i]].data.color;
                                hand.imageActive = gameCommon.items[hands[i]].data.success;
                                actives = actives && hand.active;
                                mediumTime += hand.data.songTime;
                            }


                            if ((actives) && (gameDance.lastNoteIndex != gameDance.index)){
                                gameDance.lastNoteIndex = gameDance.index;
                                mediumTime = mediumTime / hands.length;
                                var time = timeLast - mediumTime;
                                gameDance.score += 80;
                                if (time < -100) {
                                    //NONE
                                } else if (time < -50) {
                                    gameCommon.drawText("SOON");
                                    gameDance.score -= (200-time);
                                } else if (time < 50) {
                                    gameCommon.drawText("PERFECT");
                                    gameDance.score += 200;
                                } else if (time < 200) {
                                    gameCommon.drawText("LATE");
                                    gameDance.score += (200-time);
                                }
                                window.setTimeout(gameCommon.clearText, 200);
                            }
                        }
                    }

                    if (gameDance.index < gameDance.song.length-2) {

                        var nextHands = gameDance.song[gameDance.index + 1].move;
                        var fraction = 1 - (timeToNext / timeBetween);
                        for (i=0; i< nextHands.length; i++) {
                            gameDance.circleHand(nextHands[i], fraction);
                        }
                    }
                }
            } else {
                gameDance.clearUpHands();
                gameDance.status = 3;
                gameDance.audio.pause();
                gameCommon.drawText('SCORE: '+Math.round(gameDance.score));
                //console.log(gameDance.manualTime);
                window.setTimeout(function(){gameCommon.startGame(gameMenu)}, 4000);
            }

        }
        gameDance.drawGameData();
    }
}
