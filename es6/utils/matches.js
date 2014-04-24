import isClient from 'config/isClient';
import vendors from 'config/vendors';
import createElement from 'utils/createElement';

var matches, div, methodNames, unprefixed, prefixed, i, j, makeFunction;

if ( !isClient ) {
    matches = null;
}

else {
    div = createElement( 'div' );

    makeFunction = function ( methodName ) {
        return function ( node, selector ) {
            return node[ methodName ]( selector );
        };
    }

    methodNames = [ 'matches', 'matchesSelector' ];

    i = methodNames.length;
    while ( i-- ) {
        unprefixed = methodNames[i];

        if ( div[ unprefixed ] ) {
            matches = makeFunction( unprefixed );
        } else {
            j = vendors.length;
            while ( j-- ) {
                prefixed = vendors[i] + unprefixed.substr( 0, 1 ).toUpperCase() + unprefixed.substring( 1 );

                if ( div[ prefixed ] ) {
                    matches = makeFunction( prefixed );
                    break;
                }
            }
        }
    }

    // IE8...
    if ( !matches ) {
        matches = function ( node, selector ) {
            var nodes, i;

            nodes = ( node.parentNode || node.document ).querySelectorAll( selector );

            i = nodes.length;
            while ( i-- ) {
                if ( nodes[i] === node ) {
                    return true;
                }
            }

            return false;
        };
    }
}

export default matches;
