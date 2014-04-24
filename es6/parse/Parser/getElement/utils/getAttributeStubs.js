import getStringFragment from 'parse/Parser/utils/getStringFragment';

export default function ( attributes ) {
    var a;

    a = {};

    attributes.forEach( function ( attribute ) {
        var value;

        if ( attribute.value ) {
            value = getStringFragment( attribute.value );

            if ( value.length === 1 && typeof value[0] === 'string' ) {
                value = value[0];
            }
        } else {
            value = 0;
        }

        a[ attribute.name ] = value;
    });

    return a;
};
