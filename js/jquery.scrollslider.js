/* jQuery scrollslider plugin | */
(function($) { 
    var defaults = {
        height : 500
    };
    var options;

    $.fn.scrollSlider = function( params ) {
        options = $.extend({}, defaults, options, params );

        /*
        Slider elements 
        */
        var $slider = $(this);
        var $viewport = $slider.find('.viewport');
        var $overview = $slider.find('.overview');
        var $scrollbar = $slider.find('.scrollbar');
        var $track = $scrollbar.find('.track');

        /*
        Set default height
        */
        $viewport.height( options.height );

        $slider.find('.overview img:last').on('load', function() {
            
            var contentWidth = 0;
            
            $overview.find('img').each( function( i, e ) {
                console.log(e);
                contentWidth += $(e).outerWidth( true );
            });

            if ( $viewport.width() > contentWidth ) {
                $scrollbar.hide();
                return;
            }

            /**
            Offseting variables
            **/
            var maxOffset = contentWidth - $slider.width(); //max offset for slider
            var minOffset = 0; //min offset is default by 0

            var k = ($scrollbar.width()-$track.width())/maxOffset;//multiplier for scrollbar positioning

            /**
            Events
            **/

            /**
            Mousewheel element 
            **/

            $slider.on("mousewheel DOMMouseScroll", function( e ) {
                //Scroll delta
                var delta = (e.type === 'DOMMouseScroll' ?
                             e.originalEvent.detail * -40 :
                             e.originalEvent.wheelDelta);

                var overviewOffset = parseInt( $overview.css('margin-left') );
                var offset = overviewOffset + delta;

                if ( offset < minOffset && offset > -maxOffset ) {
                    //Standart situation, slides work, event return false
                    $overview.css('margin-left', offset);
                    $track.offset({
                        left: -offset*k + $scrollbar.offset().left
                    });

                    return false;
                } else if ( offset >= minOffset ) {
                    //Positioning on min offset, event return true
                    $overview.css('margin-left', minOffset);
                    $track.offset({
                        left: -minOffset*k + $scrollbar.offset().left
                    });
                    return true;
                } else if ( offset <= -maxOffset ) {
                    //Positioning on max offset, event return true
                    $overview.css('margin-left', -maxOffset);
                    $track.offset({
                        left: maxOffset*k + $scrollbar.offset().left
                    });
                    return true;
                }

                return true;
            });

            /** 
            Scrollbar event
            **/

            var $dragging = null;
            var minPageX = $scrollbar.offset().left;
            var maxPageX = minPageX + $scrollbar.width() - $track.width();

            $(document).on("mousemove", function(e) {
                if ($dragging) {
                    var trackOffset = e.pageX - $track.width()/2

                    if ( trackOffset > minPageX && trackOffset < maxPageX ) {
                        $dragging.offset({
                            left: trackOffset
                        });

                        var offset = $dragging.offset().left - minPageX;
                        $overview.css('margin-left', -offset/k );
                    }
                }
            });
            
            $(document).on("mousedown", '.track', function (e) {
                $dragging = $(e.target);
            });
            
            $(document).on("mouseup", function (e) {
                $dragging = null;
            });
                         
        });

        return this;
    };

})(jQuery);