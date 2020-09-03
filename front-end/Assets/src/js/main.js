// put jQuery on the global namespace to access via the console and allow plugins to be dropped-in
global.jQuery = require('jquery');
global.$ = global.jQuery;
global.Handlebars = require('./vendor/handlebars-v4.2.0.js');

// 'js/jquery.min.js',

require('./vendor/jquery.appendAround.js');
require('./vendor/jquery.serializeObject.js');
require('./vendor/jquery.autocomplete.js');
require('./vendor/jquery.cookie.js');
require('./vendor/jquery.validate.js');
require('./vendor/jquery.floatlabels.js');
require('./vendor/jquery.externalLink.js');
require('./vendor/jquery.productInterest.js');//WEB-2626
require('./modules/sifter.js');
require('./modules/sift-generator.js'); 
require('./vendor/jquery.fancybox.js'); 
require('./vendor/jquery.scrollspy.js');
require('./modules/utilities.js');
//Removed GeoIP implementation. DXP-291
//require('./modules/geoip.js'); //added js file for GeoIP.
require('./modules/header-prompt.js'); //added js file for GeoIP.
require('./modules/menu.js');
require('./modules/jquery.backDetect.js');
require('./modules/opentip.js');
require('./modules/menu-adapter.js');
require('./modules/menu-adapter-manager.js');
require('./modules/owl.carousel.js');
require('./vendor/jquery.responsiveTabs.js');
require('./vendor/jquery.marquee.js');
require('./modules/read-eloqua-cookie.js');
require('./vendor/jquery.mixitup.min.js');
require('./vendor/jquery.product-sort.js');
// require('./vendor/jquery.navigation.js');
require('./vendor/jquery.dropdown.js');
require('./vendor/jquery.nav.js');
require('./modules/read-adobe-s_vi-variable.js');
require('./modules/nav-loader.js');
require('./modules/customer-story.js');
require('./modules/state-select.js');
require('./modules/equal-heights.js');
require('./modules/center-align-content.js');
require('./modules/main.js');
require('./vendor/jquery.smooth-scroll.js');
require('./vendor/jquery.swiftype.autocomplete.js');
require('./modules/demandbase-formconfig.js');
require('./vendor/jquery.fs.wallpaper.js');
require('./modules/accordion.js');
require('./modules/truesight.js');
require('./modules/support.js');
require('./modules/ticker.js');
require('./modules/t-minus-countdown.js');
require('./vendor/jquery.stickynav.js'); 
require('./modules/industry.js');
require('./modules/patternLibrary.js');
require("./modules/carouselautoplay.js");
require("./modules/simpletabs.js");
require("./modules/filterList.js");
require("./modules/education.js");
require("./modules/resourceHubTrials.js");
require("./modules/modalVideo.js");
require("./modules/partners.js");
require("./vendor/vidbg.js");
require("./modules/category-page.js")
require("./modules/events.js");
//require("./modules/youtube.js");
require("./vendor/aos.js");
require("./modules/homepage-aos.js");
require('./vendor/jquery.validate.input.js');
//require("./vendor/jquery.slimscroll.min.js");
//require("./vendor/jquery.fullPage.min.js");


require('./modules/contact-form.js');
require('./modules/document_container.js');
require('./modules/imageAlignment.js');
require('./modules/arrowBG.js');

require('./modules/quote-review.js');
require('./modules/customers-section.js');
require('./modules/landingPage-arrowBG.js');
require('./modules/boxy-header.js');
require('./modules/handlebarHelpers.js');
require('./modules/resource-center.js');
require('./modules/language-selector.js');

