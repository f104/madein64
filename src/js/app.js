import $ from 'jquery';
import Choices from 'choices.js';
import noUiSlider from 'nouislider';
import 'slick-carousel';
import 'lazysizes';
import page from 'page';
var app = {

    breakpoints: {
        sm: 320,
        md: 768,
        lg: 1280
    },
    media: 320,
    resizeEventName: 'app_resize',
    submitEventName: 'app_submit',
    fancyOptions: {
        autoFocus: false,
        touch: false,
//        baseClass: 'popup',
        closeExisting: true,
        autoFocus: false,
        backFocus: false,
    },
    yandexKey: 'b55a6bc2-55f2-4ab4-afcb-34c0d6fe6d2c',

    init: function () {
        // read config
        if (typeof appConfig === 'object') {
            Object.keys(appConfig).forEach(key => {
                if (Object.prototype.hasOwnProperty.call(app, key)) {
                    app[key] = appConfig[key];
                }
            });
        }

        // Init page
        this.page = page;
        this.page.init.call(this);

        app.checkMedia();
        app.window.on('resize', app.checkMedia);
        app.fixedHeaderHeight = $('.js-fixed-header').outerHeight();
        window.jQuery = $;
        window.app = app;

        // Init forms
//        this.forms = forms;
//        this.forms.init.call(this);

        app.document.ready(function () {
            app.initHeaderCart();
            app.initMobileMenu();
            app.initSelect();
            app.initRange();
            app.initProductSlider();
            app.initVendorSlider();
            app.initPopup();
            app.initQty();
            app.initSDEKAutocomlete();
            app.initToggleHidden();
            app.initBackTop();
            app.initShare();
            app.initMap();

            app.body.addClass('_init');
        });

        app.window.on('load', function () {
            app.initFixedOrder();
        });

        app.document.on(app.resizeEventName, function () {
        });

        // Antispam
        setTimeout(function () {
            $('input[name="email3"],input[name="email"],input[name="text"]').attr('value', '').val('');
        }, 5000);
    },

    /**
     * Init custom selects
     */
    initSelect() {
        if (!$('.js-select').length)
            return;
        $('.js-select').each(function(){
            let choices = new Choices($(this)[0], {
                searchEnabled: false,
                itemSelectText: '',
            });
            $(this).data('choices', choices);
        })
    },

    /**
     * Init header cart show/hide
     */
    initHeaderCart() {
        let $toggler = $('.js-header-cart__toggler');
        let $dropdown = $('.js-header-cart__dropdown');
        let $menuToggler = $('.js-m-menu__toggler');
        let $menu = $('.js-m-menu__menu');
        if ($dropdown.length) {
            $toggler.on('click', function () {
                $dropdown.toggleClass('_active');
                $menuToggler.removeClass('_active');
                $menu.removeClass('_active');
                app.body.removeClass('_frozen');
                return false;
            });
            $dropdown.on('click', function (e) {
                e.stopPropagation();
            });
            app.document.on('click', function () {
                $dropdown.removeClass('_active');
            })
        }
    },

    /**
     * Init mobile menu
     */
    initMobileMenu() {
        let $toggler = $('.js-m-menu__toggler');
        let $menu = $('.js-m-menu__menu');
        let $menuOverlay = $('.js-m-menu__overlay');
        let $cart = $('.js-header-cart__dropdown');
        if ($menu.length) {
            $toggler.on('click', function () {
                $toggler.toggleClass('_active');
                $menu.toggleClass('_active');
                app.body.toggleClass('_frozen');
                $cart.removeClass('_active');
            });
            $menuOverlay.on('click', function (e) {
                $toggler.click();
            });
            app.document.on(app.resizeEventName, function () {
                if (app.media == app.breakpoints.lg) {
                    $toggler.removeClass('_active');
                    $menu.removeClass('_active');
                    app.body.removeClass('_frozen');
                }
            });
        }
    },

    /**
     * Init share
     */
    initShare() {
        var share = {
            vkontakte: function (purl, ptitle, pimg, text) {
                var url = 'http://vkontakte.ru/share.php?';
                url += 'url=' + encodeURIComponent(purl);
                url += '&title=' + encodeURIComponent(ptitle);
                url += '&description=' + encodeURIComponent(text);
                url += '&image=' + encodeURIComponent(pimg);
                url += '&noparse=true';
                share.popup(url);
            },
            odnoklassniki: function (purl) {
                var url = 'https://connect.ok.ru/dk?st.cmd=WidgetSharePreview&service=odnoklassniki';
                url += '&st.shareUrl=' + encodeURIComponent(purl);
                share.popup(url);
            },
            facebook: function (purl, ptitle, pimg, text) {
                var url = 'http://www.facebook.com/sharer.php?s=100';
                url += '&p[title]=' + encodeURIComponent(ptitle);
                url += '&p[summary]=' + encodeURIComponent(text);
                url += '&p[url]=' + encodeURIComponent(purl);
                url += '&p[images][0]=' + encodeURIComponent(pimg);
                share.popup(url);
            },
            twitter: function (purl, ptitle) {
                var url = 'http://twitter.com/share?';
                url += 'text=' + encodeURIComponent(ptitle);
                url += '&url=' + encodeURIComponent(purl);
                share.popup(url);
            },
            popup: function (url) {
                window.open(url, '', 'toolbar=0,status=0,width=626,height=436');
            }
        };
        $('.js-share').on('click', function (e) {
            e.preventDefault();
            var $this = $(this);
            var ptitle = $('meta[property="og:title"]').attr('content');
            var pdesc = $('meta[property="og:description"]').attr('content');
            var pimg = $('meta[property="og:image"]').attr('content');
            if ($this.hasClass('_facebook')) {
                share.facebook(location.href, ptitle, pimg, pdesc);
            } else if ($this.hasClass('_twitter')) {
                share.twitter(location.href, ptitle);
            } else if ($this.hasClass('_odnoklassniki')) {
                share.odnoklassniki(location.href);
            } else if ($this.hasClass('_vkontakte')) {
                share.vkontakte(location.href, ptitle, pimg, pdesc);
            }
        });
    },

    /**
     * Init nouislider
     */
    initRange() {
        $('.js-range').each(function (index, elem) {
            let slider = $(elem).find('.js-range__target')[0],
                    $inputs = $(elem).find('input'),
                    from = $inputs.first()[0],
                    to = $inputs.last()[0],
                    $text = $(elem).find('.js-range__text'),
                    fromText = $text.first()[0],
                    toText = $text.last()[0];
            if (slider && from && to && fromText && toText) {
                var min = parseInt(from.value) || 0,
                        max = parseInt(to.value) || 0;
                noUiSlider.create(slider, {
                    start: [
                        min,
                        max
                    ],
                    connect: true,
                    range: {
                        'min': min,
                        'max': max
                    }
                });
                let snapValues = [from, to], snapText = [fromText, toText];
                slider.noUiSlider.on('update', function (values, handle) {
                    let value = Math.round(values[handle]);
                    snapValues[handle].value = value;
                    snapText[handle].innerText = value;
                });
                from.addEventListener('change', function () {
                    slider.noUiSlider.set([this.value, null]);
                });
                to.addEventListener('change', function () {
                    slider.noUiSlider.set([null, this.value]);
                });
            }
        });
    },

    /**
     * Init product slider
     */
    initProductSlider() {
        $('.js-product-slider').slick({
            dots: false,
            arrows: false,
            infinite: false,
            asNavFor: '.js-product-slider-nav',
        });
        $('.js-product-slider-nav').slick({
            dots: false,
            arrows: false,
            infinite: false,
            slidesToShow: 1,
            focusOnSelect: true,
            variableWidth: true,
            asNavFor: '.js-product-slider',
        });
    },

    /**
     * Init product slider
     */
    initVendorSlider() {
        $('.js-vendor-slider').slick({
            dots: false,
            arrows: false,
            infinite: false,
            variableWidth: true,
        });
    },

    initPopup() {
        require("@fancyapps/fancybox");
        $('.js-popup').fancybox(this.fancyOptions);
        if (window.location.hash) {
            var $cnt = $(window.location.hash);
            if ($cnt.length && $cnt.hasClass('popup')) {
                $.fancybox.open($cnt, this.fancyOptions);
            }
        }
    },

    /**
     * plus/minus input
     */
    initQty() {
        $('.js-qty').each(function () {
            let $plus = $(this).find('.js-qty__plus'),
                    $minus = $(this).find('.js-qty__minus'),
                    $input = $(this).find('.js-qty__input'),
                    min = parseInt($input.attr('min')) || 0, max = parseInt($input.attr('max')) || 0;
            $plus.on('click', function (e) {
                let newVal = parseInt($input.val()) + 1;
                if (!max || (newVal <= max)) {
                    $input.val(newVal);
                    $input.trigger('change');
                }
            });
            $minus.on('click', function (e) {
                let newVal = parseInt($input.val()) - 1;
                if (!min || (newVal >= min)) {
                    $input.val(newVal);
                    $input.trigger('change');
                }
            });
        });
        // submit quantity form on cart when quantity changed
        $('#msCart .js-qty__input').on('change', function (e) {
            $(this).parent('form').submit();
        });
    },

    initSDEKAutocomlete() {
        let $input = $('.js-cdek-autocomplete');
        if (!$input.length) {
            return;
        }
        require('libs/jquery.auto-complete.js');
        let xhr;
        $input.autoComplete({
            minChars: 3,
            source: function (term, response) {
                try {
                    xhr.abort();
                } catch (e) {
                    console.log(e);
                }
                xhr = $.ajax({
                    dataType: 'json',
                    url: '//api.cdek.ru/city/getListByTerm/jsonp.php?callback=?',
                    data: {q: term},
                    success: function (data) {
//                        console.log(data);
                        let suggestions = [];
                        if (data.geonames) {
                            data.geonames.forEach((el) => {
                                suggestions.push(el.cityName);
                            });
                        }
                        response(data.geonames || []);
                    },
                    beforeSend: function () {
                        $input.parent().addClass('_loading');
                    },

                }).always(function () {
                    $input.parent().removeClass('_loading');
                });
            },
            renderItem: function (item, search) {
                search = search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
                let re = new RegExp('(' + search.split(' ').join('|') + ')', 'gi');
                return `<div class="autocomplete-suggestion" data-id="${item.id}" data-val="${item.cityName}">` + item.cityName.replace(re, '<b>$1</b>') + '</div>';
            },
            onSelect: function (e, term, item) {
                $('[name="cdek_city_id"]').val(item.data('id')).trigger('change');
                $input.attr('data-selected', 'true');
            }
//        }).on('keypress', function(e) {
//            let code = e.keyCode || e.which;
//            if (code === 13) {
//                $(this).blur();
//                return false;
//            }
        }).on('keyup', function() {
            $(this).attr('data-selected', 'false');
        }).on('blur', function() {
            if (!$(this).attr('data-selected') || $(this).attr('data-selected') !== 'true') {
                $(this).val('').trigger('change');
                $('[name="cdek_city_id"]').val('').trigger('change');
            }
        });
    },

    initToggleHidden() {
        let className = 'hidden';
        this.document.on('click', '.js-toggle-hidden__toggler', function(){
            let targetSelector = $(this).data('toggle');
            if (targetSelector) {
                let $items = $(this).parents('.js-toggle-hidden').find('.js-toggle-hidden__item').addClass(className);
                $items.filter(targetSelector).removeClass(className);
            }
        });
        $('.js-toggle-hidden__toggler:checked[data-toggle]').trigger('click');
    },

    initBackTop() {
        let $btn = $('.js-back-top');
        if (!$btn.length) {
            return;
        }
        const show = () => {
            app.window.scrollTop() > 100 ? $btn.addClass('_active') : $btn.removeClass('_active');
        };
        show();
        app.window.on('scroll', show);
        $btn.on('click', function () {
            $('html, body').animate({scrollTop: 0}, 500);
        });
    },

    /**
     * фиксация подвала в заказе
     */
    initFixedOrder() {
        let $cnt = $('.js-checkout__cost'), className = 'checkout__fixed-cost', breakpoint = 0;
        if (!$cnt.length) {
            return;
        }
        const pin = () => {
            app.window.scrollTop() < breakpoint ? app.body.addClass(className) : app.body.removeClass(className);
        };
        const calc = () => {
            app.body.removeClass(className);
            app.window.off('scroll', pin);
            breakpoint = $cnt.offset().top + $cnt.outerHeight() - app.window.outerHeight();
            if (app.window.scrollTop() < breakpoint) {
                app.body.addClass(className);
            }
            app.window.on('scroll', pin);
        };
        calc();
        app.window.on('resize', function () {
            calc();
        });
    },

    initMap() {
        let cntId = 'map', $cnt = $('#' + cntId);
        if (!$cnt.length) {
            return;
        }
        if (typeof (ymaps) === 'undefined') {
            $.ajax({
                url: `//api-maps.yandex.ru/2.1/?apikey=${app.yandexKey}&lang=ru_RU&mode=debug`,
                dataType: "script",
                cache: true,
                success: function () {
                    ymaps.ready(drawMap);
                }
            });
        } else {
            ymaps.ready(drawMap);
        }

        const drawMap = function () {
            let geo = $cnt.data('geo');
            if (!geo) {
                console.log('Geo data not found');
                $cnt.hide();
                return;
            }
            geo = geo.split(',');

            let map = new ymaps.Map(cntId, {
                center: geo,
                zoom: 13,
                controls: ['zoomControl']
            }, {
                suppressMapOpenBlock: true,
            });
            map.behaviors.disable('scrollZoom');
            let tplPlacemark = ymaps.templateLayoutFactory.createClass(
                    `<div class="placemark">
                        <svg xmlns="http://www.w3.org/2000/svg" width="40" height="43.301" version="1.0" viewBox="0 0 16.087 17.513" clip-rule="evenodd" fill-rule="evenodd" image-rendering="optimizeQuality" shape-rendering="geometricPrecision" text-rendering="geometricPrecision"><path d="M9.042 17.305c3.433-1.247 6.427-3.424 6.999-6.003.747-3.37-3.224-5.65-6.804-3.586-.965.502-1.437.53-2.387 0-3.58-2.063-7.551.216-6.804 3.586.572 2.579 3.56 4.77 6.999 6.003.797.285 1.257.269 1.997 0z" fill="red"/><path d="M12.056 0c.442 1.83.857 3.78-.768 5.216-1.568 1.385-3.997 1.484-4.64.8-1.353-1.437.09-3.848 1.727-4.064C10.051 1.732 11 .962 12.055 0z" fill="#96bb40"/></svg>
                    </div>`
                    );
            let placemark = new ymaps.Placemark(geo, {},
                    {
                        iconLayout: tplPlacemark,
                        iconImageSize: [40, 50],
                        iconShape: {
                            type: 'Rectangle',
                            // Прямоугольник описывается в виде двух точек - верхней левой и нижней правой.
                            coordinates: [
                                [-20, -40], [20, 0]
                            ]
                        },
                        cursor: 'default'
                    });
            map.geoObjects.add(placemark);
        }
    },

    /**
     * Проверяет размер окна и пишет его в app.media
     * @returns void
     */
    checkMedia() {
        let current = app.media;
        for (let key in app.breakpoints) {
            if (app.window.outerWidth() >= app.breakpoints[key]) {
                app.media = app.breakpoints[key];
            }
//            console.log(app.media);
        }
        if (app.media != current) {
            app.document.trigger(app.resizeEventName, {media: app.media});
        }
    },

};
app.init();
