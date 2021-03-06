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

const { Component, Fragment } = wp.element;

const {
    PanelBody,
    TextControl,
} = wp.components;

const {
    InspectorControls,
} = wp.blockEditor;

/**
 * Internal dependencies
 */
import FieldLabel from '../../field-label';
import FieldDescription from '../../field-description';
import {
    getFieldAttributes,
    FieldDefaultSettings,
} from '../../field-attributes';

/**
 * Block Edit Class.
 */
class BlockEdit extends Component {
    render() {
        const {
            attributes,
        } = this.props;

        let { className = '' } = this.props;

        className = classnames(
            'ghostkit-form-field ghostkit-form-field-phone',
            className,
        );

        className = applyFilters( 'ghostkit.editor.className', className, this.props );

        return (
            <Fragment>
                <InspectorControls>
                    <PanelBody>
                        <FieldDefaultSettings { ...this.props } />
                    </PanelBody>
                </InspectorControls>
                <div className={ className }>
                    <FieldLabel { ...this.props } />
                    <TextControl
                        type="tel"
                        { ...getFieldAttributes( attributes ) }
                    />
                    <FieldDescription { ...this.props } />
                </div>
            </Fragment>
        );
    }
}

export default BlockEdit;
