

(function ($) {

    $.extend({
        viewport: function () {
            var w = $(window);
            return { height: w.height(), width: w.width(), top: w.scrollTop(), left: w.scrollLeft() };

        },
        format: function (source) {
            var result = source;
            $.each(arguments, function (i, n) {
                result = result.replace(new RegExp("\\{" + (i - 1) + "\\}", "g"), n);
            });
            return result;
        },

        adlnk: {
            log: function (l) {
                $.ajax({
                    crossDomain: true,
                    dataType: "jsonp",
                    url: l,
                    jsonpCallback: '_',
                    data: { "rf": document.referrer, "w": screen.width, "h": screen.height }
                });
            },
            fit: function () {
                var _v = $.viewport();
                $('#ifr').height(_v.height - $('#head').height());

            },

            skip: function (lnk) {
                if (this.idle == 1)
                    return;

                this.idle = 1;
                var _wait = 6;
                var _t = window.setInterval(function () {

                    _wait--;
                    $('#skip-ad').text('Wait: ' + _wait);
                    if (_wait == 0) {
                        window.clearInterval(_t);
                        $('#skip-ad').removeClass('wait').text('SKIP AD!').bind('mousedown', function() {
                            $(this).attr('href', lnk);
                        });
                    }
                }, 1000);
            },

            init:function(lnk) {
                $(window).unbind('.adkai-idle').bind('mousemove.adkai-idle keydown.adkai-idle DOMMouseScroll.adkai-idle mousewheel.adkai-idle mousedown.adkai-idle touchstart.adkai-idle touchmove.adkai-idle focus.adkai-idle', $.proxy(function () {

                    this.skip(lnk);

                }, this));
            }
        }



    });

})(jQuery);
