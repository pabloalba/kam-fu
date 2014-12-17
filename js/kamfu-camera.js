var WIDTH = 320;
var HEIGHT = 180;

var camera = {
    startupTime: 0,
    initialized: false,
    media : null,
    canvas: null,
    localMediaStream: null,
    ctx: null,
    count: 0,
    video: null,
    initCallback: function() {},

    errorCallback: function(e) {
        console.log('Camera error', e);
    },

    preInit: function(src){
        gameCommon.drawSilhouette();
        camera.countDown = 5000 - (new Date().getTime() - camera.startupTime);
        if (camera.countDown <= 0){
            imageComparator.setup(src);
            camera.initialized = true
            gameCommon.drawText("START!");
            window.setTimeout(function(){gameCommon.clearText()}, 1000);
            camera.initCallback();
        } else {
            gameCommon.drawText(""+Math.ceil(camera.countDown/1000));
        }
    },

    snapshot: function() {
        if (camera.localMediaStream) {
            if (camera.startupTime == 0){
                camera.startupTime = new Date().getTime();
            }

            try {
                camera.ctx.drawImage(camera.video, 0, 0);

                var src = camera.canvas.toDataURL('image/webp');
                if (camera.initialized == false) {
                    camera.preInit(src);
                } else {
                    imageComparator.onComplete = camera.onSnapshot;
                    imageComparator.setImage(src);
                }
            }
            catch(err) {
                console.log(err);
            }


        }
    },

    loop: function(){
         camera.snapshot();
         window.setTimeout(camera.loop, 10);
    },

    setup: function(video, onSnapshot, initCallback) {
        camera.video = video;
        camera.initCallback = initCallback;
        camera.onSnapshot = onSnapshot;

        camera.canvas = document.createElement('canvas');
        camera.canvas.id = "screenshot-canvas";
        camera.canvas.width  = WIDTH;
        camera.canvas.height = HEIGHT;
        camera.canvas.style.display   = 'none';

        camera.ctx = camera.canvas.getContext('2d');


        navigator.getUserMedia  = navigator.getUserMedia ||
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.msGetUserMedia;

        var videoConstraints = {
          video: {
            mandatory: {
              maxWidth: WIDTH,
              maxHeight: HEIGHT
            }
          }
        };


        navigator.getUserMedia(
            videoConstraints,
            function(stream) {
                video.src = window.URL.createObjectURL(stream);
                camera.localMediaStream = stream;
            },
            camera.errorCallback
        );

        window.setTimeout(camera.loop, 1000);

    }
}
