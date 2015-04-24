/* jQuery scrollslider plugin | */
(function($) { 
    var defaults = {
        height : 500,
        debug : false,
        content : 'img'
    };
    var options;

    $.fn.scrollSlider = function( params ) {
        options = $.extend({}, defaults, options, params );

        var log = function( message ) {
            options['debug'] && console.log( message );
        }

        /*
        Slider elements 
        */
        var $slider = $(this);
        var $viewport = $slider.find('.viewport');
        var $overview = $slider.find('.overview');
        var $scrollbar = $slider.find('.scrollbar');
        var $track = $scrollbar.find('.track');

        $track.css('position', 'relative');
        $track.css('left', 0);

        /*
        Set default height
        */
        $viewport.height( options.height );

        //slider.find('.overview img:last').on('load', 

        $(window).load( function() {

            var $controlButtons = {};
            $controlButtons['left'] = $("a[data-sslider-control=left]");
            $controlButtons['right'] = $("a[data-sslider-control=right]");
            
            var contentWidth = 0;
            var imagesMargin = [];
            
            $overview.find( options.content ).each( function( i, e ) {
                imagesMargin.push( contentWidth );
                contentWidth += $(e).outerWidth( true );
            });

            //Fix last imagesMargin
            var lastImageMargin = imagesMargin.pop();

            lastImageMargin -= ($viewport.width() - $overview.find( options.content + ':last').outerWidth());
            imagesMargin.push( lastImageMargin );

            if ( $viewport.width() > contentWidth ) {
                $scrollbar.hide();
                $controlButtons['left'].hide();
                $controlButtons['right'].hide();
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

            /**
            Buttons event
            **/
            
            $controlButtons['left'].on('click', function() {
                var ml = parseInt( $overview.css('margin-left') );

                for ( var i = imagesMargin.length-1; i >=0; --i ) {
                    if ( -imagesMargin[i] > ml ) {
                        $overview.animate({'margin-left' : -imagesMargin[i]}, 'fast');
                        $track.animate({
                            'left': imagesMargin[i]*k
                        }, 'fast');
                        break;
                    }
                }

                return false;
            });

            $controlButtons['right'].on('click', function() {
                var ml = parseInt( $overview.css('margin-left') );

                for( var m in imagesMargin ) {
                    if ( -imagesMargin[m] < ml ) {
                        $overview.animate({'margin-left' : -imagesMargin[m]}, 'fast');
                        log( k );
                        log( imagesMargin[m]*k );
                        $track.animate({
                            'left': Math.round( imagesMargin[m]*k )
                        }, 'fast');
                        break;
                    }
                }

                return false;
            });
        });

        return this;
    };

})(jQuery);