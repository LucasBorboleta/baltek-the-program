"use strict";
/*
BALTEK (the program) implements BALTEK (the rules), a turn-based board game, inspired from football.
Copyright (C) 2017  Lucas Borboleta (lucas.borboleta@free.fr)

This file is part of BALTEK (the program).

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
///////////////////////////////////////////////////////////////////////////////
var baltek = { };
baltek.__initModuleCalled = false;

baltek.__initModule = function(){

    if ( baltek.__initModuleCalled ) return;
    baltek.__initModuleCalled = true;

    // Init required packages
    baltek.debug.__initModule();
    baltek.presenter.__initModule();

    // Init inner classes
    // None

    baltek.thePresenter = new baltek.presenter.Presenter();
    baltek.debug.writeMessage( "baltek.__initModule(): done" );
};
///////////////////////////////////////////////////////////////////////////////