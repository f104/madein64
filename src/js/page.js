import $ from 'jquery';
import svg4everybody from 'svg4everybody';
import browser from 'browser-detect';

var page = {
    init: function () {
        const app = this;

        // Base components
        app.window = $(window);
        app.document = $(document);
        app.html = $("html");
        app.body = $("body");

        // App params
        app.browser = browser();
        app.mobile = app.browser.mobile;
        app.html.removeClass('no-js').addClass(app.mobile ? "mobile" : "desktop").addClass(app.browser.name);

        // svg4everybody | Init
        if (!app.mobile) {
            svg4everybody();
        }

    }

};

export default page;
