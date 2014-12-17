var imageComparator = {
    originalContext: null,
    actualContext: null,
    tolerance: 50,
    onComplete: function(){},

    setup: function(originalImageSrc) {
        var image = new Image();
        image.src = originalImageSrc;

        var originalCanvas = $('<canvas/>')[0];
        originalCanvas.width = image.width;
        originalCanvas.height = image.height;
        imageComparator.originalContext = originalCanvas.getContext('2d');
        imageComparator.originalContext.drawImage(image, 0, 0, image.width, image.height);

        var actualCanvas = $('<canvas/>')[0];

        actualCanvas.width = image.width;
        actualCanvas.height = image.height;
        imageComparator.actualContext = actualCanvas.getContext('2d');
    },

    setImage: function(imageSrc){
        var image = new Image();
        image.src = imageSrc;
        imageComparator.actualContext.drawImage(image, 0, 0, image.width, image.height);

        imageComparator.onComplete();
    },

    checkPixelChanged: function(x,y){
        var pixelDataOriginal = imageComparator.originalContext.getImageData(x, y, 1, 1).data;
        var pixelDataActual = imageComparator.actualContext.getImageData(x, y, 1, 1).data;
        return ((Math.abs(pixelDataOriginal[0] - pixelDataActual[0]) > imageComparator.tolerance) ||
                (Math.abs(pixelDataOriginal[1] - pixelDataActual[1]) > imageComparator.tolerance) ||
                (Math.abs(pixelDataOriginal[2] - pixelDataActual[2]) > imageComparator.tolerance))
    }
}
