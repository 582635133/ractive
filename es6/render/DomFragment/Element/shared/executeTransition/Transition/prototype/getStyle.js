import legacy from 'legacy';
import isClient from 'config/isClient';
import isArray from 'utils/isArray';
import prefix from 'render/DomFragment/Element/shared/executeTransition/Transition/helpers/prefix';

var getComputedStyle;

if ( !isClient ) {
    return;
}

getComputedStyle = window.getComputedStyle || legacy.getComputedStyle;

export default function ( props ) {
    var computedStyle, styles, i, prop, value;

    computedStyle = window.getComputedStyle( this.node );

    if ( typeof props === 'string' ) {
        value = computedStyle[ prefix( props ) ];
        if ( value === '0px' ) {
            value = 0;
        }
        return value;
    }

    if ( !isArray( props ) ) {
        throw new Error( 'Transition#getStyle must be passed a string, or an array of strings representing CSS properties' );
    }

    styles = {};

    i = props.length;
    while ( i-- ) {
        prop = props[i];
        value = computedStyle[ prefix( prop ) ];
        if ( value === '0px' ) {
            value = 0;
        }
        styles[ prop ] = value;
    }

    return styles;
};
