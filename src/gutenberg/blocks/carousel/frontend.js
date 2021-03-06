/**
* Block Carousel
*/
const {
    GHOSTKIT,
    jQuery: $,
} = window;
const $doc = $( document );

/**
 * Prepare Carousels.
 */
$doc.on( 'initBlocks.ghostkit', function( e, self ) {
    if ( typeof window.Swiper === 'undefined' ) {
        return;
    }

    GHOSTKIT.triggerEvent( 'beforePrepareCarousels', self );

    $( '.ghostkit-carousel:not(.ghostkit-carousel-ready)' ).each( function() {
        const $carousel = $( this );
        const $items = $carousel.children( '.ghostkit-carousel-items' );
        const slidesPerView = parseInt( $carousel.attr( 'data-slides-per-view' ), 10 );

        const options = {
            speed: ( parseFloat( $carousel.attr( 'data-speed' ) ) || 0 ) * 1000,
            effect: $carousel.attr( 'data-effect' ) || 'slide',
            fadeEffect: {
                // fixed fade out for previous slider.
                crossFade: true,
            },
            spaceBetween: parseFloat( $carousel.attr( 'data-gap' ) ) || 0,
            centeredSlides: $carousel.attr( 'data-centered-slides' ) === 'true',
            freeMode: $carousel.attr( 'data-free-scroll' ) === 'true',
            loop: $carousel.attr( 'data-loop' ) === 'true',
            autoplay: parseFloat( $carousel.attr( 'data-autoplay' ) ) > 0 && {
                delay: parseFloat( $carousel.attr( 'data-autoplay' ) ) * 1000,
                disableOnInteraction: false,
            },
            navigation: $carousel.attr( 'data-show-arrows' ) === 'true' && {
                nextEl: '.ghostkit-carousel-arrow-next',
                prevEl: '.ghostkit-carousel-arrow-prev',
            },
            pagination: $carousel.attr( 'data-show-bullets' ) === 'true' && {
                el: '.ghostkit-carousel-bullets',
                clickable: true,
                dynamicBullets: $carousel.attr( 'data-dynamic-bullets' ) === 'true',
            },
            slidesPerView: 1,
            keyboard: true,
            grabCursor: true,
        };

        $carousel.addClass( 'ghostkit-carousel-ready swiper-container' );
        $items.addClass( 'swiper-wrapper' );
        $items.children().addClass( 'swiper-slide' );

        // add arrows
        if ( options.navigation ) {
            let $prevArrowIcon = $carousel.find( '.ghostkit-carousel-arrow-prev-icon' );
            let $nextArrowIcon = $carousel.find( '.ghostkit-carousel-arrow-next-icon' );

            if ( $prevArrowIcon.length ) {
                $prevArrowIcon = $prevArrowIcon.html();
            } else if ( $carousel.attr( 'data-arrow-prev-icon' ) ) {
                $prevArrowIcon = `<span class="${ $carousel.attr( 'data-arrow-prev-icon' ) }"></span>`;
            } else {
                $prevArrowIcon = '';
            }

            if ( $nextArrowIcon.length ) {
                $nextArrowIcon = $nextArrowIcon.html();
            } else if ( $carousel.attr( 'data-arrow-next-icon' ) ) {
                $nextArrowIcon = `<span class="${ $carousel.attr( 'data-arrow-next-icon' ) }"></span>`;
            } else {
                $nextArrowIcon = '';
            }

            $carousel.append( `
                <div class="ghostkit-carousel-arrow ghostkit-carousel-arrow-prev">${ $prevArrowIcon }</div>
                <div class="ghostkit-carousel-arrow ghostkit-carousel-arrow-next">${ $nextArrowIcon }</div>
            ` );
        }

        // add bullets
        if ( options.pagination ) {
            $carousel.append( '<div class="ghostkit-carousel-bullets"></div>' );
        }

        // calculate responsive.
        const breakPoints = {};
        if ( ! isNaN( slidesPerView ) ) {
            let count = slidesPerView;
            let currentPoint = Math.min( self.screenSizes.length - 1, count - 1 );

            for ( ; currentPoint >= 0; currentPoint-- ) {
                if ( count > 0 && typeof self.screenSizes[ currentPoint ] !== 'undefined' ) {
                    breakPoints[ self.screenSizes[ currentPoint ] + 1 ] = {
                        slidesPerView: count,
                    };
                }
                count -= 1;
            }

            options.slidesPerView = count || 1;
        }
        options.breakpoints = breakPoints;

        // Since Swiper 5.0 this option is removed and it is `true` by default, but in older versions it was `false`.
        // So we need to keep it as a fallback.
        options.breakpoints.breakpointsInverse = true;

        // init swiper
        new window.Swiper( $carousel[ 0 ], options );
    } );

    GHOSTKIT.triggerEvent( 'afterPrepareCarousels', self );
} );

/**
 * Re-create slides duplicates.
 * https://github.com/nolimits4web/swiper/issues/2629
 */
$doc.on( 'activateTab.ghostkit afterActivateAccordionItem.ghostkit', function( e, self, $item ) {
    const $carousels = $item.parents( '.ghostkit-carousel-ready' );

    $carousels.each( function() {
        if ( this.swiper ) {
            this.swiper.loopDestroy();
            this.swiper.loopCreate();
        }
    } );
} );
