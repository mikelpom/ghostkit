/**
 * External dependencies
 */
import classnames from 'classnames/dedupe';

/**
 * WordPress dependencies
 */
const {
    applyFilters,
} = wp.hooks;

const { Component } = wp.element;

const {
    InnerBlocks,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import metadata from './block.json';

const { name } = metadata;

export default [
    // v2.8.2
    {
        ...metadata,
        ghostkit: {
            supports: {
                styles: true,
                spacings: true,
                display: true,
                scrollReveal: true,
                customCSS: true,
            },
        },
        save: class BlockSave extends Component {
            render() {
                const {
                    align,
                    gap,
                } = this.props.attributes;

                let className = classnames(
                    'ghostkit-button-wrapper',
                    gap ? `ghostkit-button-wrapper-gap-${ gap }` : false,
                    align && align !== 'none' ? `ghostkit-button-wrapper-align-${ align }` : false
                );

                className = applyFilters( 'ghostkit.blocks.className', className, {
                    ...{
                        name,
                    },
                    ...this.props,
                } );

                return (
                    <div className={ className }>
                        <InnerBlocks.Content />
                    </div>
                );
            }
        },
    },
];
