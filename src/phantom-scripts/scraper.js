var fs = require('fs');

var page = require('webpage').create(),
    address, output, size;

if (phantom.args.length < 2 || phantom.args.length > 3) {
    console.log('Usage: scaper.js URL filename');
    phantom.exit();
} else {
    address = phantom.args[0];
    output = phantom.args[1];
    page.viewportSize = { width: 600, height: 600 };
        
    page.open(address, function (status) {
        if (status !== 'success') {
            console.log('Unable to load the address!');
        }
        else {
            var scrapeOptions = {
                imageSizeFilter: { width: 90, height: 90 }
            };
            
            var scrape = {
                url: address,
                timestamp: (new Date()).toUTCString(),
                scrapeOptions: scrapeOptions,
                scrape: scrapePage(page, scrapeOptions)
            };
            
            var scrapeJson = JSON.stringify(scrape, undefined, 2);
            
            var file = fs.open(output, 'w');
            file.write(scrapeJson);
            file.flush();
            file.close();
            
            console.log('Wrote scraped result to ' + output);
        }
        
        phantom.exit();
    });
}

function scrapePage(page, options) {
    var options = options || {};
    
    var log = console.log;
    
    console.log('Scraping...');
    
    var embed = page.injectJs('embed.js');
    
    if (!embed) {
        console.log('ERROR: Embed of ImageFisher failed.');
    }
    
    // set scraper options
    var optionsFunc = 'function() { ImageFisher.ScraperOptions = ' + JSON.stringify(options) + '; }';
    page.evaluate(optionsFunc);
    
    return page.evaluate(function () {
        var scrape = {
            log: '',
            images: []
        };
        
        var options = ImageFisher.ScraperOptions;
        
        var log = function(msg) {
            scrape.log += msg + '\n';
        }
        
        if (typeof ImageFisher === 'undefined') {
            log('ERROR: ImageFisher not found. Check that it was embeded into the page.');
        }
        
        var images = document.images;
                
        if (!images || images.length === 0) {
            log('No images found.');
            return scrape;
        }
        
        for (var i = 0, len = images.length; i < len; i++) {
            var image = images[i];
            
            if (options.imageSizeFilter) {
                if (image.width < options.imageSizeFilter.width || image.height < options.imageSizeFilter.height) {
                    log('Ignoring small image: ' + image.width + 'x' + image.height + ' - ' + image.src);
                    continue;
                }
            }
            
            log('Found image: ' + image.src);
            
            var img = {
                url: image.src,
                width: image.width,
                height: image.height,
                dataUrl: ImageFisher.GetDataUrl(image)
            };
            
            scrape.images.push(img);
        }
        
        return scrape;
    });    
};