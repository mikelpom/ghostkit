// Import CSS
import './style.scss';
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import getIcon from '../_utils/get-icon.jsx';
import deprecatedArray from './deprecated.jsx';

const { GHOSTKIT } = window;

import ColorPicker from '../_components/color-picker.jsx';
import IconPicker from '../_components/icon-picker.jsx';
import ApplyFilters from '../_components/apply-filters.jsx';

const {
    applyFilters,
} = wp.hooks;
const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    BaseControl,
    PanelBody,
    RangeControl,
    SelectControl,
    ToggleControl,
    TabPanel,
    Toolbar,
    ColorIndicator,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
    BlockControls,
} = wp.editor;

class IconBoxBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            icon,
            iconPosition,
            iconSize,
            showContent,
            iconColor,
            hoverIconColor,
            variant,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'icon_box' );

        className = classnames( 'ghostkit-icon-box', className );

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-icon-box-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    { Object.keys( availableVariants ).length > 1 ? (
                        <PanelBody>
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        </PanelBody>
                    ) : '' }
                    <PanelBody>
                        <IconPicker
                            label={ __( 'Icon' ) }
                            value={ icon }
                            onChange={ ( value ) => setAttributes( { icon: value } ) }
                        />
                        <RangeControl
                            label={ __( 'Icon Size' ) }
                            value={ iconSize }
                            onChange={ ( value ) => setAttributes( { iconSize: value } ) }
                            min={ 20 }
                            max={ 100 }
                            beforeIcon="editor-textcolor"
                            afterIcon="editor-textcolor"
                        />
                        <BaseControl
                            label={ __( 'Icon Position' ) }
                        >
                            <Toolbar controls={ [
                                {
                                    icon: 'align-center',
                                    title: __( 'Top' ),
                                    onClick: () => setAttributes( { iconPosition: 'top' } ),
                                    isActive: iconPosition === 'top',
                                },
                                {
                                    icon: 'align-left',
                                    title: __( 'Left' ),
                                    onClick: () => setAttributes( { iconPosition: 'left' } ),
                                    isActive: iconPosition === 'left',
                                },
                                {
                                    icon: 'align-right',
                                    title: __( 'Right' ),
                                    onClick: () => setAttributes( { iconPosition: 'right' } ),
                                    isActive: iconPosition === 'right',
                                },
                            ] } />
                        </BaseControl>
                        <ToggleControl
                            label={ __( 'Show Content' ) }
                            checked={ !! showContent }
                            onChange={ ( val ) => setAttributes( { showContent: val } ) }
                        />
                    </PanelBody>
                    <PanelBody title={ (
                        <Fragment>
                            { __( 'Colors' ) }
                            <ColorIndicator colorValue={ iconColor } />
                        </Fragment>
                    ) } initialOpen={ false }>
                        <TabPanel
                            className="ghostkit-control-tabs"
                            tabs={ [
                                {
                                    name: 'normal',
                                    title: __( 'Normal' ),
                                    className: 'ghostkit-control-tabs-tab',
                                },
                                {
                                    name: 'hover',
                                    title: __( 'Hover' ),
                                    className: 'ghostkit-control-tabs-tab',
                                },
                            ] }>
                            {
                                ( tabData ) => {
                                    const isHover = tabData.name === 'hover';
                                    return (
                                        <ApplyFilters name="ghostkit.editor.controls" attribute={ isHover ? 'hoverIconColor' : 'iconColor' } props={ this.props }>
                                            <ColorPicker
                                                label={ __( 'Icon' ) }
                                                value={ isHover ? hoverIconColor : iconColor }
                                                onChange={ ( val ) => setAttributes( isHover ? { hoverIconColor: val } : { iconColor: val } ) }
                                                alpha={ true }
                                            />
                                        </ApplyFilters>
                                    );
                                }
                            }
                        </TabPanel>
                    </PanelBody>
                </InspectorControls>
                <BlockControls>
                    <Toolbar controls={ [
                        {
                            icon: 'align-center',
                            title: __( 'Icon Position Top' ),
                            onClick: () => setAttributes( { iconPosition: 'top' } ),
                            isActive: iconPosition === 'top',
                        },
                        {
                            icon: 'align-left',
                            title: __( 'Icon Position Left' ),
                            onClick: () => setAttributes( { iconPosition: 'left' } ),
                            isActive: iconPosition === 'left',
                        },
                        {
                            icon: 'align-right',
                            title: __( 'Icon Position Right' ),
                            onClick: () => setAttributes( { iconPosition: 'right' } ),
                            isActive: iconPosition === 'right',
                        },
                    ] } />
                </BlockControls>
                <div className={ className }>
                    { icon ? (
                        <div className={ `ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${ iconPosition || 'left' }` }>
                            <IconPicker.Dropdown
                                onChange={ ( value ) => setAttributes( { icon: value } ) }
                                value={ icon }
                                renderToggle={ ( { onToggle } ) => (
                                    <IconPicker.Preview
                                        onClick={ onToggle }
                                        name={ icon }
                                    />
                                ) }
                            />
                        </div>
                    ) : '' }
                    { showContent ? (
                        <div className="ghostkit-icon-box-content">
                            <InnerBlocks
                                template={ [ [ 'core/paragraph', { content: __( 'Wow, this is an important icons, that you should see!' ) } ] ] }
                                templateLock={ false }
                            />
                        </div>
                    ) : '' }
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/icon-box';

export const settings = {
    title: __( 'Icon Box' ),
    description: __( 'Icons are one of the best visual replacement for text descriptions.' ),
    icon: getIcon( 'block-icon-box' ),
    category: 'ghostkit',
    keywords: [
        __( 'icon' ),
        __( 'icon-box' ),
    ],
    ghostkit: {
        previewUrl: 'https://ghostkit.io/blocks/icon-box/',
        customStylesCallback( attributes ) {
            const styles = {
                '.ghostkit-icon-box-icon': {
                    fontSize: attributes.iconSize,
                    color: attributes.iconColor,
                },
            };

            if ( attributes.hoverIconColor ) {
                styles[ '&:hover .ghostkit-icon-box-icon' ] = {
                    color: attributes.hoverIconColor,
                };
            }

            return styles;
        },
        supports: {
            styles: true,
            spacings: true,
            display: true,
            scrollReveal: true,
        },
    },
    supports: {
        html: false,
        className: false,
        anchor: true,
        align: [ 'wide', 'full' ],
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        icon: {
            type: 'string',
            default: 'fab fa-wordpress-simple',
        },
        iconPosition: {
            type: 'string',
            default: 'left',
        },
        iconSize: {
            type: 'number',
            default: 30,
        },
        showContent: {
            type: 'boolean',
            default: true,
        },
        iconColor: {
            type: 'string',
            default: '#0366d6',
        },
        hoverIconColor: {
            type: 'string',
        },
    },

    edit: IconBoxBlock,

    save: function( props ) {
        const {
            icon,
            iconPosition,
            showContent,
            variant,
        } = props.attributes;

        let className = 'ghostkit-icon-box';

        // variant classname.
        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-icon-box-variant-${ variant }` );
        }

        className = applyFilters( 'ghostkit.blocks.className', className, {
            ...{
                name,
            },
            ...props,
        } );

        return (
            <div className={ className }>
                { icon ? (
                    <div className={ `ghostkit-icon-box-icon ghostkit-icon-box-icon-align-${ iconPosition ? iconPosition : 'left' }` }>
                        <IconPicker.Render name={ icon } />
                    </div>
                ) : '' }
                { showContent ? (
                    <div className="ghostkit-icon-box-content">
                        <InnerBlocks.Content />
                    </div>
                ) : '' }
            </div>
        );
    },

    deprecated: deprecatedArray,
};
