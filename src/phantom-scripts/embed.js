﻿var ImageFisher = (function() {
    return {
        GetDataUrl: function(img) {
            // Create an empty canvas element
            var canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            // Copy the image contents to the canvas
            var ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);

            return canvas.toDataURL("image/png");
        }
    };
})();