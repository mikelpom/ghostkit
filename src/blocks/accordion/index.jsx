// Import CSS
import './editor.scss';

// External Dependencies.
import classnames from 'classnames/dedupe';

// Internal Dependencies.
import elementIcon from '../_icons/accordion.svg';

const { GHOSTKIT } = window;

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    PanelBody,
    RangeControl,
    SelectControl,
} = wp.components;

const {
    InspectorControls,
    InnerBlocks,
} = wp.editor;

/**
 * Returns the layouts configuration for a given number of items.
 *
 * @param {number} attributes items attributes.
 *
 * @return {Object[]} Tabs layout configuration.
 */
const getTabsTemplate = ( attributes ) => {
    const {
        itemsCount,
    } = attributes;
    const result = [];

    for ( let k = 1; k <= itemsCount; k++ ) {
        result.push( [ 'ghostkit/accordion-item', { itemNumber: k } ] );
    }

    return result;
};

class AccordionBlock extends Component {
    render() {
        const {
            attributes,
            setAttributes,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            variant,
            itemsCount,
        } = attributes;

        const availableVariants = GHOSTKIT.getVariants( 'accordion' );

        className = classnames(
            className,
            'ghostkit-accordion'
        );

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        { Object.keys( availableVariants ).length > 1 ? (
                            <SelectControl
                                label={ __( 'Variants' ) }
                                value={ variant }
                                options={ Object.keys( availableVariants ).map( ( key ) => ( {
                                    value: key,
                                    label: availableVariants[ key ].title,
                                } ) ) }
                                onChange={ ( value ) => setAttributes( { variant: value } ) }
                            />
                        ) : '' }
                        <RangeControl
                            label={ __( 'Items' ) }
                            value={ itemsCount }
                            onChange={ ( value ) => setAttributes( { itemsCount: value } ) }
                            min={ 1 }
                            max={ 6 }
                        />
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <InnerBlocks
                        template={ getTabsTemplate( attributes ) }
                        templateLock="all"
                        allowedBlocks={ [ 'ghostkit/accordion-item' ] }
                    />
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/accordion';

export const settings = {
    title: __( 'Accordion' ),
    description: __( 'Accordion.' ),
    icon: <img className="dashicon ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'layout',
    keywords: [
        __( 'accordion' ),
        __( 'tab' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
        className: false,
        align: [ 'wide', 'full' ],
        ghostkitStyles: true,
        ghostkitIndents: true,
        ghostkitDisplay: true,
    },
    attributes: {
        variant: {
            type: 'string',
            default: 'default',
        },
        itemsCount: {
            type: 'number',
            default: 2,
        },
    },

    edit: AccordionBlock,

    save: function( { attributes, className = '' } ) {
        const {
            variant,
            itemsCount,
        } = attributes;

        className = classnames(
            className,
            'ghostkit-accordion',
            `ghostkit-accordion-${ itemsCount }`
        );

        if ( 'default' !== variant ) {
            className = classnames( className, `ghostkit-accordion-variant-${ variant }` );
        }

        return (
            <div className={ className }>
                <InnerBlocks.Content />
            </div>
        );
    },
};