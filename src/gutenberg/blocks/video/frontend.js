/**
* Block Video
*/
import { throttle } from 'throttle-debounce';
import rafl from 'rafl';

const {
    GHOSTKIT,
    jQuery: $,
} = window;

const $doc = $( document );

// set video size
function setFullscreenVideoSize() {
    $( '.ghostkit-video-fullscreen:visible .ghostkit-video-fullscreen-frame' ).each( function() {
        const $this = $( this );
        const aspectRatio = $this.data( 'ghostkit-video-aspect-ratio' ) || 16 / 9;
        let resultW;
        let resultH;

        if ( aspectRatio > window.innerWidth / window.innerHeight ) {
            resultW = window.innerWidth * 0.9;
            resultH = resultW / aspectRatio;
        } else {
            resultH = window.innerHeight * 0.9;
            resultW = resultH * aspectRatio;
        }

        $this.css( {
            width: resultW,
            height: resultH,
            top: ( window.innerHeight - resultH ) / 2,
            left: ( window.innerWidth - resultW ) / 2,
        } );
    } );
}

// Set FS video size.
const throttledSetFullscreenVideoSize = throttle( 200, () => {
    rafl( () => {
        setFullscreenVideoSize();
    } );
} );
$( window ).on( 'DOMContentLoaded load resize orientationchange', () => {
    throttledSetFullscreenVideoSize();
} );

/**
 * Prepare Videos.
 */
$doc.on( 'initBlocks.ghostkit', function( e, self ) {
    if ( typeof window.VideoWorker === 'undefined' ) {
        return;
    }

    GHOSTKIT.triggerEvent( 'beforePrepareVideo', self );

    $( '.ghostkit-video:not(.ghostkit-video-ready)' ).each( function() {
        const $this = $( this ).addClass( 'ghostkit-video-ready' );
        const url = $this.attr( 'data-video' );
        const clickAction = $this.attr( 'data-click-action' );

        const videoAutoplay = $this.attr( 'data-video-autoplay' ) === 'true';
        const videoAutopause = $this.attr( 'data-video-autopause' ) === 'true';

        let fullscreenCloseIcon = $this.find( '.ghostkit-video-fullscreen-close-icon' );
        if ( fullscreenCloseIcon.length ) {
            fullscreenCloseIcon = fullscreenCloseIcon.html();
        } else if ( $this.attr( 'data-fullscreen-action-close-icon' ) ) {
            fullscreenCloseIcon = `<span class="${ $this.attr( 'data-fullscreen-action-close-icon' ) }"></span>`;
        } else {
            fullscreenCloseIcon = '';
        }

        const fullscreenBackgroundColor = $this.attr( 'data-fullscreen-background-color' );

        let $poster = $this.find( '.ghostkit-video-poster' );
        let $fullscreenWrapper = false;
        let $iframe = false;
        let mute = 0;

        let aspectRatio = $this.attr( 'data-video-aspect-ratio' );
        if ( aspectRatio && aspectRatio.split( ':' )[ 0 ] && aspectRatio.split( ':' )[ 1 ] ) {
            aspectRatio = aspectRatio.split( ':' )[ 0 ] / aspectRatio.split( ':' )[ 1 ];
        } else {
            aspectRatio = 16 / 9;
        }

        // mute if volume 0
        if ( ! parseFloat( $this.attr( 'data-video-volume' ) ) ) {
            mute = 1;
        }

        // mute if autoplay
        if ( videoAutoplay ) {
            mute = 1;
        }

        const api = new window.VideoWorker( url, {
            autoplay: 0,
            loop: 0,
            mute: mute,
            volume: parseFloat( $this.attr( 'data-video-volume' ) ) || 0,
            showContols: 1,
        } );

        if ( api && api.isValid() ) {
            let loaded = 0;
            let clicked = 0;
            let isPlaying = false;

            // add play event
            $this.on( 'click', function() {
                if ( clicked ) {
                    return;
                }
                clicked = 1;

                // fullscreen video
                if ( 'fullscreen' === clickAction ) {
                    // add loading button
                    if ( ! loaded ) {
                        $this.addClass( 'ghostkit-video-loading' );

                        api.getIframe( ( iframe ) => {
                            // add iframe
                            $iframe = $( iframe );
                            const $parent = $iframe.parent();

                            $fullscreenWrapper = $( `<div class="ghostkit-video-fullscreen" style="background-color: ${ fullscreenBackgroundColor };">` )
                                .appendTo( 'body' )
                                .append( $( `<div class="ghostkit-video-fullscreen-close">${ fullscreenCloseIcon }</div>` ) )
                                .append( $( '<div class="ghostkit-video-fullscreen-frame">' ).append( $iframe ) );
                            $fullscreenWrapper.data( 'ghostkit-video-aspect-ratio', aspectRatio );
                            $parent.remove();

                            $fullscreenWrapper.fadeIn( 200 );

                            $fullscreenWrapper.on( 'click', '.ghostkit-video-fullscreen-close', () => {
                                api.pause();
                                $fullscreenWrapper.fadeOut( 200 );
                            } );

                            setFullscreenVideoSize();
                            api.play();
                        } );

                        loaded = 1;
                    } else if ( $fullscreenWrapper ) {
                        $fullscreenWrapper.fadeIn( 200 );
                        api.play();
                    }

                // plain video
                } else if ( ! loaded ) {
                    $this.addClass( 'ghostkit-video-loading' );

                    api.getIframe( ( iframe ) => {
                        // add iframe
                        $iframe = $( iframe );
                        const $parent = $iframe.parent();
                        $( '<div class="ghostkit-video-frame">' ).appendTo( $this ).append( $iframe );
                        $parent.remove();
                        api.play();
                    } );

                    loaded = 1;
                } else {
                    api.play();
                }
            } );

            // set thumb
            if ( ! $poster.length ) {
                api.getImageURL( function( imgSrc ) {
                    $poster = $( `<div class="ghostkit-video-poster"><img src="${ imgSrc }" alt=""></div>` );
                    $this.append( $poster );
                } );
            }

            let autoplayOnce = false;

            api.on( 'ready', () => {
                $this.removeClass( 'ghostkit-video-loading' );
                if ( 'fullscreen' !== clickAction ) {
                    $this.addClass( 'ghostkit-video-playing' );
                }
                api.play();
            } );
            api.on( 'play', () => {
                isPlaying = true;
            } );
            api.on( 'pause', () => {
                isPlaying = false;
                autoplayOnce = true;
                if ( 'fullscreen' === clickAction ) {
                    clicked = 0;
                }
            } );

            if ( 'fullscreen' !== clickAction && ( videoAutoplay || videoAutopause ) ) {
                self.throttleScroll( () => {
                    // autoplay
                    if ( ! autoplayOnce && ! isPlaying && videoAutoplay && self.isElementInViewport( $this[ 0 ], 0.6 ) ) {
                        if ( clicked ) {
                            api.play();
                        } else {
                            $this.click();
                        }
                    }

                    // autopause
                    if ( isPlaying && videoAutopause && ! self.isElementInViewport( $this[ 0 ], 0.6 ) ) {
                        api.pause();
                    }
                } );
            }
        }
    } );

    GHOSTKIT.triggerEvent( 'afterPrepareVideo', self );
} );
