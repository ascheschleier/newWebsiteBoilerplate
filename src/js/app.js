$(function(){
    resize.init();
});

var helper = {

    init: function(){

    },

    scrollTo: function(_target, _speed){
        var offset, speed;
        if(!_target){
            offset = 0;
        } else {
            offset = $(_target).offset().top;
        }
        if(!_speed){
            speed = 750;
        } else {
            speed = _speed;
        }
        var page = $("html, body");

        page.on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
            page.stop();
        });

        page.animate({ scrollTop: offset }, speed , function(){
            page.off("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove");
        });
    },

    onAnimationComplete: function($element, callback){
        var transitionEvent = helper.whichTransitionEvent();

        if(transitionEvent){ //we have the CSS transition feature
            $element.one(transitionEvent, function(e){
                // this is your completion event!
                //console.log("transition complete");
                if(callback && typeof callback == 'function'){
                    //console.log("executing callback function ");
                    callback();
                };
            });
        } else { //fallback for non CSS transition browsers
            console.log("no way to tell if transition ended, sending callback in 700ms");
            if(callback && typeof callback == 'function'){
                window.setTimeout(function(){
                    console.log("executing callback function ");
                    callback();
                },700);
            };
        }

    },
    whichTransitionEvent: function(){
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition':'transitionend',
            'OTransition':'oTransitionEnd',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        };

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

};

var breakpoint = {
    refreshValue: function(){
        this.value = window.getComputedStyle(document.querySelector('body'), ':before').getPropertyValue('content').replace(/\"/g, '');
    }
};

var resize = {
    init: function(){
        var resizeTimeout;
        breakpoint.refreshValue();
        $(window).resize(function(){
            if(resizeTimeout) {
                //clear timeout
                clearTimeout(resizeTimeout);
                resizeTimeout = null;
            }
            resizeTimeout = setTimeout(function(){
                var $body = $('body');
                /* Set data-width attribute with $window.width */
                $body.data('width', $(window).width());

                breakpoint.refreshValue();

            }, 10); //Zeitliche Toleranz des resize
        });
    }
};