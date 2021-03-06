/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const WPColorPicker = wp.components.ColorPicker;

const { Component } = wp.element;

const { __ } = wp.i18n;

const {
    Dropdown,
    Tooltip,
    BaseControl,
} = wp.components;

const {
    ColorPalette,
} = wp.blockEditor;

/**
 * Component Class
 */
export default class ColorPicker extends Component {
    render() {
        const {
            value,
            onChange,
            label,
            alpha = false,
            colorPalette = true,
            hint = __( 'Custom Color Picker', '@@text_domain' ),
            afterDropdownContent,
        } = this.props;

        return (
            <BaseControl
                label={ label }
                className="ghostkit-component-color-picker-wrapper"
            >
                <Dropdown
                    className={ classnames( 'components-color-palette__item-wrapper components-circular-option-picker__option-wrapper', value ? '' : 'components-color-palette__custom-color' ) }
                    contentClassName="components-color-palette__picker"
                    renderToggle={ ( { isOpen, onToggle } ) => (
                        <Tooltip text={ hint }>
                            <button
                                type="button"
                                aria-expanded={ isOpen }
                                className="components-color-palette__item components-circular-option-picker__option"
                                onClick={ onToggle }
                                aria-label={ hint }
                                style={ { color: value ? value : '' } }
                            >
                                <span className="components-color-palette__custom-color-gradient" />
                            </button>
                        </Tooltip>
                    ) }
                    renderContent={ () => (
                        <div className="ghostkit-component-color-picker">
                            <WPColorPicker
                                color={ value }
                                onChangeComplete={ ( color ) => {
                                    let colorString;

                                    if ( typeof color.rgb === 'undefined' || color.rgb.a === 1 ) {
                                        colorString = color.hex;
                                    } else {
                                        const { r, g, b, a } = color.rgb;
                                        colorString = `rgba(${ r }, ${ g }, ${ b }, ${ a })`;
                                    }

                                    onChange( colorString || '' );
                                } }
                                disableAlpha={ ! alpha }
                            />
                            { colorPalette ? (
                                <BaseControl
                                    label={ __( 'Color Palette', '@@text_domain' ) }
                                    className="ghostkit-component-color-picker-palette"
                                >
                                    <ColorPalette
                                        value={ value }
                                        onChange={ ( color ) => onChange( color || '' ) }
                                        disableCustomColors={ true }
                                    />
                                </BaseControl>
                            ) : '' }
                            { afterDropdownContent ? afterDropdownContent : '' }
                        </div>
                    ) }
                />
            </BaseControl>
        );
    }
}
