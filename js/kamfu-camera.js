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
    baseImage: null,
    video: null,
    countDownElement: null,

    errorCallback: function(e) {
        console.log('Camera error', e);
    },

    preInit: function(src){
        camera.countDown = 5000 - (new Date().getTime() - camera.startupTime);
        if (camera.countDown <= 0){
            camera.baseImage = src;
            camera.initialized = true
            camera.countDownElement.addClass('start');
            camera.countDownElement.text('START!');
            window.setTimeout(function(){camera.countDownElement.text('');}, 1000);
        } else {
            camera.countDownElement.text(Math.ceil(camera.countDown/1000));
        }
    },

    snapshot: function() {
        if (camera.localMediaStream) {
            camera.ctx.drawImage(camera.video, 0, 0);
            var src = camera.canvas.toDataURL('image/webp');
            if (camera.initialized == false) {
                camera.preInit(src);
            } else {
                var diff = resemble(camera.baseImage).compareTo(src).kamfu().onComplete(camera.onSnapshot);
                //~ var diff = resemble(camera.baseImage).compareTo(src).kamfu().onComplete(function onComplete(data){
                    //~ document.getElementById("movementImage").src = data.getImageDataUrl();
                //~ });

            }
        }
    },

    loop: function(){
         camera.snapshot();
         window.setTimeout(camera.loop, 10);
    },

    setup: function(video, countDownElement, onSnapshot) {
        camera.startupTime = new Date().getTime();
        camera.video = video;
        camera.countDownElement = countDownElement;
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

    }

}
