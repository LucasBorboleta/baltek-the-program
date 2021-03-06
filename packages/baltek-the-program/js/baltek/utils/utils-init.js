"use strict";
/* BALTEK-THE-PROGRAM-LICENSE-MD-BEGIN
# LICENSE

[![GNU General Public License](../packages/gnu-gpl/pictures/gplv3-88x31.png)](http://www.gnu.org/licenses)

BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.

Copyright (C) 2017-2018 Lucas Borboleta ([lucas.borboleta@free.fr](mailto:lucas.borboleta@free.fr)) and Baltekians (see [CONTRIBUTORS.md](./CONTRIBUTORS.md) file).

Attribute work to URL <https://github.com/LucasBorboleta/baltek-the-program>.

This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses>.
BALTEK-THE-PROGRAM-LICENSE-MD-END */
///////////////////////////////////////////////////////////////////////////////
baltek.utils = { };
baltek.utils.__initModuleCalled = false;

baltek.utils.__initModule = function(){

    if ( baltek.utils.__initModuleCalled ) return;
    baltek.utils.__initModuleCalled = true;

    // Init required modules
    baltek.debug.__initModule();

    // Init inner classes
    baltek.utils.Dispatcher.__initClass();
    baltek.utils.Observable.__initClass();

    baltek.utils.prngSeed = 0;
    baltek.utils.prngInit(0);
};

baltek.utils.assert = function(condition, message){
    if ( ! condition ) {

        var text = "ASSERTION FAILED";

        if ( message !== undefined ) {
            text += ": " + message + " !";
        } else {
            text += " !";
        }

        if ( baltek.isInteractive ) {
            var error = new Error();
            text += "\n\n STACK TRACE: " + error.stack;
        }

        baltek.debug.writeMessage(text);

        if ( baltek.isInteractive ) {
            alert(text);
        }

        throw text;
    }
};

baltek.utils.getOwnProperties = function(anObject){
    var properties = [];
    var aProperty;
    for ( aProperty in anObject ) {
        if ( anObject.hasOwnProperty(aProperty) ) {
            properties.push(aProperty);
        }
    }
    properties.sort();
    return properties;
};

baltek.utils.hasValue = function(array, value){
    baltek.utils.assert( Array.isArray(array) );
    return (array.indexOf(value) > -1);
};

baltek.utils.inherit = function(childConstructor, parentConstructor){
    if ( childConstructor.prototype !== childConstructor ) {

        if ( parentConstructor !== Object ) {
            parentConstructor.__initClass();
        }

        // Copied from: http://javascriptissexy.com/oop-in-javascript-what-you-need-to-know/
        // OOP In JavaScript: What You NEED to Know
        // march. 19 2013
        // (Object Oriented JavaScript: Only Two Techniques Matter)

        var copyOfParent = Object.create(parentConstructor.prototype);
        copyOfParent.constructor = childConstructor;
        childConstructor.prototype = copyOfParent;

        // Adds the parent as "super" to the childConstructor.
        // Adding "super" to childConstructor.prototype leads to infinite recursion!
        // Using "super" minimizes the occurence of the parentConstructor name
        // in the block of code that defines the child. The unique occurence is
        // in the "inherit(childConstructor, parentConstructor)"
        // statement.
        childConstructor.super = parentConstructor.prototype;
    }
};

///////////////////////////////////////////////////////////////////////////////
/**
 * Creates a pseudo-random value generator. The seed must be an integer.
 *
 * Uses an optimized version of the Park-Miller prng.
 * http://www.firstpr.com.au/dsp/rand31/
 */

baltek.utils.prngInit = function(seed) {
  baltek.utils.prngSeed = seed % 2147483647;
  if (baltek.utils.prngSeed <= 0) baltek.utils.prngSeed += 2147483646;
};

/**
 * Returns a pseudo-random value between 1 and 2^32 - 2.
 */
baltek.utils.prngNext = function () {
  return baltek.utils.prngSeed = baltek.utils.prngSeed * 16807 % 2147483647;
};


/**
 * Returns a pseudo-random floating point number in range [0, 1).
 */
baltek.utils.prngNextFoat = function () {
  // We know that result of next() will be 1 to 2147483646 (inclusive).
  return (baltek.utils.prngNext() - 1) / 2147483646;
};

baltek.utils.random = function(){
    //return Math.random();
    var x = baltek.utils.prngNextFoat();
    baltek.debug.writeMessage("baltek.utils.random(): " + x)
    return x;
};
///////////////////////////////////////////////////////////////////////////////


baltek.utils.repeatString = function(value, count){
    // Workaround because not support of String.repeat in Internet-Explorer-11
    var text = "";
    var i = 0;
    for ( i=0; i<count; i++ ) {
        text += value;
    }
    return text;
};

baltek.utils.sleep = function(milliseconds){
    var initiation = new Date().getTime();
    while ( (new Date().getTime() - initiation) < milliseconds ) {
    };
}
///////////////////////////////////////////////////////////////////////////////
