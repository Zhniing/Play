// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        backgroundAudio: {
            default: null,
            url: cc.AudioClip,
        },
        mouseEnterAudio: {
            default: null,
            url: cc.AudioClip,
        },
        mouseUpAudio: {
            default: null,
            url: cc.AudioClip,
        },
        mask: {
            default: null,
            type: cc.Node,
        },
        gameMenu: {
            default: null,
            type: cc.Node,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        if (this.gameMenu) {
            cc.director.getPhysicsManager().enabled = true; // 启用物理引擎
            // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit; // Enable debug
            this.isGameMenu = false;
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
        var curScene = cc.director.getScene();
        if (curScene.name == 'StartMenu') {
            cc.log('preload');
            cc.director.preloadScene('Game');
            cc.director.preloadScene('GameOver');
        }

        this.children = this.node.children;
        for (var i=0; i<this.children.length; i++) {
            this.grandchild = this.children[i].children;
            for (var j=0; j<this.grandchild.length; j++) {
                if (this.grandchild[j].getComponent(cc.Button)) {
                    this.grandchild[j].on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
                    // this.children[i].on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
                    this.grandchild[j].on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
                }
            }
        }
        if (this.backgroundAudio) {
            this.audioBackground = cc.audioEngine.play(this.backgroundAudio, true, 1);
        }
        // cc.log(cc.audioEngine.getVolume(this.audioBackground));
        
        // if (this.mask) {
        //     this.mask.active = false;
        // }
        // if (this.gameMenu) {
        //     this.gameMenu.active = false;
        // }
    },

    onDestroy () {
        cc.audioEngine.stop(this.audioBackground);
    },

    onMouseEnter: function () {
        cc.audioEngine.play(this.mouseEnterAudio, false, 1);
    },

    // onMouseDown: function () {
    //     this._pressed = true;
    // },

    onMouseUp: function () {
        // if (this._pressed) {
            // this._pressed = false;
            cc.audioEngine.play(this.mouseUpAudio);
        // }
    },

    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.KEY.escape:
                if ( !this.isGameMenu ) {
                    this.openMenu();
                } else {
                    this.closeMenu();
                }
                break;
        }
    },
    openMenu: function () {
        // cc.director.pause();
        this.isGameMenu = true;
        this.mask.active = true;
        this.gameMenu.active = true;
    },
    closeMenu: function () {
        // cc.director.resume();
        this.isGameMenu = false;
        this.mask.active = false;
        this.gameMenu.active = false;
    },

    // Button event
    startGame: function () {
        cc.director.loadScene('Game');
    },

    tryAgain: function () {
        cc.director.loadScene('Game');
    },

    backToMenu: function () {
        cc.director.loadScene("StartMenu");
    },

    start () {

    },

    // update (dt) {},
});
