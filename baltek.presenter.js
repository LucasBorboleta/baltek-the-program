"use strict";
///////////////////////////////////////////////////////////////////////////////
baltek.presenter = { initCalled: false };

baltek.presenter.$init = function(){
    if ( ! baltek.presenter.initCalled ) {
        baltek.presenter.initCalled = true;

        // Init any package used by this one
        baltek.debug.$init();
        baltek.rules.$init();
        baltek.utils.$init();
        baltek.widget.$init();
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.Presenter = function(){
    this.$init();
};

baltek.utils.inherit(baltek.presenter.Presenter, Object);

baltek.presenter.Presenter.prototype.$init = function(){

    this.blueAgent = { kind: "" };
    this.redAgent = { kind: "" };

    this.i18nTranslator = new baltek.i18n.Translator(baltek.i18n.translations, "fr" );

    this.rulesEngine = new baltek.rules.Engine();
    this.fieldNx = this.rulesEngine.getFieldNx();
    this.fieldNy = this.rulesEngine.getFieldNy();
    baltek.draw.setDimensions(this.fieldNx, this.fieldNy);
    var ix = 0;
    var iy = 0;
    var b = null;
    for (ix=0; ix<this.fieldNx; ix++) {
        for (iy=0; iy<this.fieldNy; iy++) {
            b = new baltek.draw.Box(ix, iy, "XXX");
            b.draw();
            b.enableSelection();
        }
    }

    this.startGame = new baltek.widget.Button( "Baltek_ButtonZone_StartGame" , this.i18nTranslator);
    this.startGame.registerObserver(this);

    this.restartGame = new baltek.widget.Button( "Baltek_ButtonZone_RestartGame" , this.i18nTranslator);
    this.restartGame.registerObserver(this);

    this.resumeGame = new baltek.widget.Button( "Baltek_ButtonZone_ResumeGame" , this.i18nTranslator );
    this.resumeGame.registerObserver(this);

    this.quitGame = new baltek.widget.Button( "Baltek_ButtonZone_QuitGame" , this.i18nTranslator);
    this.quitGame.registerObserver(this);

    this.blueKind = new baltek.widget.Selector( "Baltek_ButtonZone_BlueKind", this.i18nTranslator,
                                         [ "human", "ai1", "ai2", "ai3" ] );
    this.blueKind.registerObserver(this);

    this.redKind = new baltek.widget.Selector( "Baltek_ButtonZone_RedKind", this.i18nTranslator,
                                        [ "human", "ai1", "ai2", "ai3" ] );
    this.redKind.registerObserver(this);

    this.kickoff = new baltek.widget.Button( "Baltek_ButtonZone_Kickoff" , this.i18nTranslator);
    this.kickoff.registerObserver(this);

    this.useBonus = new baltek.widget.Selector( "Baltek_ButtonZone_UseBonus", this.i18nTranslator,
                                         [ "no", "yes" ] );
    this.useBonus.registerObserver(this);

    this.endTurn = new baltek.widget.Button( "Baltek_ButtonZone_EndTurn" , this.i18nTranslator);
    this.endTurn.registerObserver(this);

    this.language = new baltek.widget.Selector( "Baltek_ButtonZone_Language", this.i18nTranslator,
                                         this.i18nTranslator.getAvailableLanguages() );
    this.language.registerObserver(this);
    this.language.setSelection(this.i18nTranslator.getLanguage());

    this.coordinates = new baltek.widget.Selector( "Baltek_ButtonZone_Coordinates", this.i18nTranslator,
                                             [ "no", "yes" ] );
    this.coordinates.registerObserver(this);

    this.rules = new baltek.widget.FileButton( "Baltek_ButtonZone_Rules" , this.i18nTranslator);
    //this.rules.registerObserver(this);

    this.help = new baltek.widget.FileButton( "Baltek_ButtonZone_Help" , this.i18nTranslator);
    //this.help.registerObserver(this);

    this.about = new baltek.widget.FileButton( "Baltek_ButtonZone_About" , this.i18nTranslator);
    //this.about.registerObserver(this);

    this.state = baltek.presenter.StateIsReadyToStart.getInstance();
    this.state.enter(this);
}

baltek.presenter.Presenter.prototype.disableAllGameButtons = function(){
    this.restartGame.enable(false);
    this.startGame.enable(false);
    this.blueKind.enable(false);
    this.redKind.enable(false);
    this.kickoff.enable(false);
    this.useBonus.enable(false);
    this.endTurn.enable(false);
    this.resumeGame.enable(false);
    this.quitGame.enable(false);
}

baltek.presenter.Presenter.prototype.hideAllGameButtons = function(){
    this.restartGame.show(false);
    this.startGame.show(false);
    this.blueKind.show(false);
    this.redKind.show(false);
    this.kickoff.show(false);
    this.useBonus.show(false);
    this.endTurn.show(false);
    this.resumeGame.show(false);
    this.quitGame.show(false);
}

baltek.presenter.Presenter.prototype.updateFromObservable = function(observable){
    if ( observable === this.startGame ) {
        this.state.updateFromStartGame(this);

    } else if ( observable === this.restartGame ) {
        this.state.updateFromRestartGame(this);

    } else if ( observable === this.resumeGame ) {
        this.state.updateFromResumeGame(this);

    } else if ( observable === this.quitGame ) {
        this.state.updateFromQuitGame(this);

    } else if ( observable === this.blueKind ) {
        this.state.updateFromBlueKind(this);

    } else if ( observable === this.redKind ) {
        this.state.updateFromRedKind(this);

    } else if ( observable === this.kickoff ) {
        this.state.updateFromKickoff(this);

    } else if ( observable === this.useBonus ) {
        this.state.updateFromUseBonus(this);

    } else if ( observable === this.endTurn ) {
        this.state.updateFromEndTurn(this);

    } else if ( observable === this.language ) {
        this.state.updateFromLanguage(this);

    } else if ( observable === this.coordinates ) {
        this.state.updateFromCoordinates(this);

    } else {
        baltek.utils.assert( false, "observable not managed" );
    }
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.State = function(){
    this.$init();
};

baltek.utils.inherit(baltek.presenter.State, Object);

baltek.presenter.State.prototype.$init = function(){
}

baltek.presenter.State.prototype.enter = function(presenter){
    presenter.hideAllGameButtons();
    presenter.disableAllGameButtons();
}

baltek.presenter.State.prototype.setState = function(presenter, state){
    presenter.state = state;
    presenter.state.enter(presenter);
}

baltek.presenter.State.prototype.updateFromBlueKind = function(presenter){
    baltek.utils.assert( false, "unexpected call" );
}

baltek.presenter.State.prototype.updateFromCoordinates = function(presenter){
    baltek.debug.writeMessage( "baltek.presenter.State.prototype.updateFromCoordinates: " +
                                        presenter.coordinates.element.id + " has notified me." );
}

baltek.presenter.State.prototype.updateFromEndTurn = function(presenter){
    baltek.utils.assert( false, "unexpected call" );
}

baltek.presenter.State.prototype.updateFromKickoff = function(presenter){
    baltek.utils.assert( false, "unexpected call" );
}

baltek.presenter.State.prototype.updateFromLanguage = function(presenter){
    presenter.i18nTranslator.setLanguage(presenter.language.getSelection());
}

baltek.presenter.State.prototype.updateFromRedKind = function(presenter){
    baltek.utils.assert( false, "unexpected call" );
}

baltek.presenter.State.prototype.updateFromRestartGame = function(presenter){
    baltek.utils.assert( false, "unexpected call" );
}

baltek.presenter.State.prototype.updateFromResumeGame = function(presenter){
    baltek.utils.assert( false, "unexpected call" );
}

baltek.presenter.State.prototype.updateFromStartGame = function(presenter){
    baltek.utils.assert( false, "unexpected call" );
}

baltek.presenter.State.prototype.updateFromUseBonus = function(presenter){
    baltek.utils.assert( false, "unexpected call" );
}

baltek.presenter.State.prototype.updateFromQuitGame = function(presenter){
    baltek.utils.assert( false, "unexpected call" );
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.StateIsFinished = function(){
    this.$init();
};
//.............................................................................
baltek.presenter.StateIsFinished.instance_ = null;

baltek.presenter.StateIsFinished.getInstance = function(){
    if ( baltek.presenter.StateIsFinished.instance_ === null ) {
        baltek.presenter.StateIsFinished.instance_ = new baltek.presenter.StateIsFinished();
    }
    return baltek.presenter.StateIsFinished.instance_;
}
//.............................................................................
baltek.utils.inherit(baltek.presenter.StateIsFinished, baltek.presenter.State);

baltek.presenter.StateIsFinished.prototype.$init = function(){
    baltek.presenter.StateIsFinished.super.$init.call(this);
}

baltek.presenter.StateIsFinished.prototype.enter = function(presenter){
    presenter.hideAllGameButtons();
    presenter.restartGame.show(true);
    presenter.blueKind.show(true);
    presenter.redKind.show(true);

    presenter.disableAllGameButtons();
    presenter.restartGame.enable(true);
}

baltek.presenter.StateIsFinished.prototype.updateFromRestartGame = function(presenter){
    this.setState(presenter, baltek.presenter.StateIsReadyToStart.getInstance());
}

baltek.presenter.StateIsFinished.prototype.updateFromQuitGame = function(presenter){
    this.setState(presenter, baltek.presenter.StateIsFinished.getInstance());
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.StateIsReadyToStart = function(){
    this.$init();
};
//.............................................................................
baltek.presenter.StateIsReadyToStart.instance_ = null;

baltek.presenter.StateIsReadyToStart.getInstance = function(){
    if ( baltek.presenter.StateIsReadyToStart.instance_ === null ) {
        baltek.presenter.StateIsReadyToStart.instance_ = new baltek.presenter.StateIsReadyToStart();
    }
    return baltek.presenter.StateIsReadyToStart.instance_;
}
//.............................................................................
baltek.utils.inherit(baltek.presenter.StateIsReadyToStart, baltek.presenter.State);

baltek.presenter.StateIsReadyToStart.prototype.$init = function(){
    baltek.presenter.StateIsReadyToStart.super.$init.call(this);
}

baltek.presenter.StateIsReadyToStart.prototype.enter = function(presenter){
    presenter.hideAllGameButtons();
    presenter.startGame.show(true);
    presenter.blueKind.show(true);
    presenter.redKind.show(true);

    presenter.disableAllGameButtons();
    presenter.startGame.enable(true);
    presenter.blueKind.enable(true);
    presenter.redKind.enable(true);
}

baltek.presenter.StateIsReadyToStart.prototype.updateFromBlueKind = function(presenter){
    presenter.blueAgent.kind = presenter.blueKind.getSelection();
    this.setState(presenter, baltek.presenter.StateIsReadyToStart.getInstance());
}

baltek.presenter.StateIsReadyToStart.prototype.updateFromRedKind = function(presenter){
    presenter.redAgent.kind = presenter.redKind.getSelection();
    this.setState(presenter, baltek.presenter.StateIsReadyToStart.getInstance());
}

baltek.presenter.StateIsReadyToStart.prototype.updateFromStartGame = function(presenter){
    presenter.blueAgent.kind = presenter.blueKind.getSelection();
    presenter.redAgent.kind = presenter.redKind.getSelection();
    this.setState(presenter, baltek.presenter.StateIsRunning.getInstance());
}

///////////////////////////////////////////////////////////////////////////////
baltek.presenter.StateIsRunning = function(){
    this.$init();
};
//.............................................................................
baltek.presenter.StateIsRunning.instance_ = null;

baltek.presenter.StateIsRunning.getInstance = function(){
    if ( baltek.presenter.StateIsRunning.instance_ === null ) {
        baltek.presenter.StateIsRunning.instance_ = new baltek.presenter.StateIsRunning();
    }
    return baltek.presenter.StateIsRunning.instance_;
}
//.............................................................................
baltek.utils.inherit(baltek.presenter.StateIsRunning, baltek.presenter.State);

baltek.presenter.StateIsRunning.prototype.$init = function(){
    baltek.presenter.StateIsRunning.super.$init.call(this);
}

baltek.presenter.StateIsRunning.prototype.enter = function(presenter){
    presenter.hideAllGameButtons();
    presenter.quitGame.show(true);
    presenter.blueKind.show(true);
    presenter.redKind.show(true);

    presenter.disableAllGameButtons();
    presenter.quitGame.enable(true);
}

baltek.presenter.StateIsRunning.prototype.updateFromQuitGame = function(presenter){
    this.setState(presenter, baltek.presenter.StateIsReadyToQuit.getInstance());
}
///////////////////////////////////////////////////////////////////////////////
baltek.presenter.StateIsReadyToQuit = function(){
    this.$init();
};
//.............................................................................
baltek.presenter.StateIsReadyToQuit.instance_ = null;

baltek.presenter.StateIsReadyToQuit.getInstance = function(){
    if ( baltek.presenter.StateIsReadyToQuit.instance_ === null ) {
        baltek.presenter.StateIsReadyToQuit.instance_ = new baltek.presenter.StateIsReadyToQuit();
    }
    return baltek.presenter.StateIsReadyToQuit.instance_;
}
//.............................................................................
baltek.utils.inherit(baltek.presenter.StateIsReadyToQuit, baltek.presenter.State);

baltek.presenter.StateIsReadyToQuit.prototype.$init = function(){
    baltek.presenter.StateIsReadyToQuit.super.$init.call(this);
}

baltek.presenter.StateIsReadyToQuit.prototype.enter = function(presenter){
    presenter.hideAllGameButtons();
    presenter.resumeGame.show(true);
    presenter.quitGame.show(true);
    presenter.blueKind.show(true);
    presenter.redKind.show(true);

    presenter.disableAllGameButtons();
    presenter.resumeGame.enable(true);
    presenter.quitGame.enable(true);
}

baltek.presenter.StateIsReadyToQuit.prototype.updateFromResumeGame = function(presenter){
    this.setState(presenter, baltek.presenter.StateIsRunning.getInstance());
}

baltek.presenter.StateIsReadyToQuit.prototype.updateFromQuitGame = function(presenter){
    this.setState(presenter, baltek.presenter.StateIsFinished.getInstance());
}
///////////////////////////////////////////////////////////////////////////////
