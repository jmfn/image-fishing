image-fishing
=============

Web Scraper that extracts images from a web page, built with phantomjs. Output returns image info and includes base64 encoded data URL.

Usage: phantomjs src/phantom-scripts/scraper.js http://google.com/ output.json

Example output:
<pre><code>
{
  "url": "http://google.com",
  "timestamp": "Sun, 06 May 2012 22:26:22 GMT",
  "scrapeOptions": {
    "imageSizeFilter": {
      "width": 90,
      "height": 90
    }
  },
  "scrape": {
    "images": [
      {
        "dataUrl": "data:image/png;base64,.....",
        "height": 95,
        "url": "http://www.google.com/intl/en_ALL/images/srpr/logo1w.png",
        "width": 275
      }
    ],
    "log": "Ignoring small image: 48x48 - http://www.google.com/images/icons/product/chrome-48.png\nFound image: http://www.google.com/intl/en_ALL/images/srpr/logo1w.png\n"
  }
}
</code></pre>