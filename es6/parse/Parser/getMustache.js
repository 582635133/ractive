import types from 'config/types';
import normaliseKeypath from 'utils/normaliseKeypath';
import getKeypathExpression from 'parse/Parser/expressions/getKeypathExpression';
import getExpression from 'parse/Parser/expressions/getExpression';

export default function ( token ) {
    var stub, isSection, type, nextToken, fragment;

    if ( token.type === types.MUSTACHE || token.type === types.TRIPLE ) {
        if ( token.mustacheType === types.SECTION || token.mustacheType === types.INVERTED ) {
            isSection = true;
        }

        this.pos += 1;

        if ( token.type === types.TRIPLE ) {
            type = types.TRIPLE;
        } else if ( isSection ) {
            type = types.SECTION;
        } else {
            type = token.mustacheType;
        }

        stub = {
            t: type
        };

        if ( token.ref ) {
            stub.r = token.ref;
        }

        if ( token.keypathExpression ) {
            stub.kx = getKeypathExpression( token.keypathExpression );
        }

        if ( token.expression ) {
            stub.x = getExpression( token.expression );
            //stub.x = new ExpressionStub( token.expression ).toJSON();
        }


        if ( isSection ) {
            if ( token.mustacheType === types.INVERTED ) {
                stub.n = 1; // TODO change this to `1` - more compact
            }

            if ( token.indexRef ) {
                stub.i = token.indexRef;
            }

            fragment = [];

            nextToken = this.next();
            while ( nextToken ) {
                if ( nextToken.mustacheType === types.CLOSING ) {
                    validateClosing(stub, nextToken);
                    this.pos += 1;
                    break;
                }

                fragment.push( this.getItem() );
                nextToken = this.next();
            }

            if ( fragment.length ) {
                stub.f = fragment;
            }
        }

        return stub;
    }
};

function validateClosing(stub, token){
    var opening = stub.r,
        closing = normaliseKeypath( token.ref.trim() );

    if ( !opening || !closing ) { return; }

    if( stub.i ) { opening += ':' + stub.i; }

    if ( opening.substr( 0, closing.length) !== closing ) {

        throw new Error( 'Could not parse template: Illegal closing section {{/'
            + closing + '}}. Expected {{/' + stub.r + '}} on line '+ token.getLinePos() );
    }
}
