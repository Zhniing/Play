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
        cc.director.getPhysicsManager().enabled = true; // 启用物理引擎
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit; // Enable debug

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        // if (cc.director.isPaused) {
        //     cc.director.resume();
        // }
        this.isMenu = false;
        this.mask.active = false;
        this.gameMenu.active = false;
    },

    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.KEY.escape:
                if ( !this.isMenu ) {
                    this.openMenu();
                } else {
                    this.closeMenu();
                }
                break;
        }
    },

    onBackToMenu: function () {
        cc.director.loadScene("StartMenu");
    },

    openMenu: function () {
        // cc.director.pause();
        this.isMenu = true;
        this.mask.active = true;
        this.gameMenu.active = true;
    },

    closeMenu: function () {
        // cc.director.resume();
        this.isMenu = false;
        this.mask.active = false;
        this.gameMenu.active = false;
    },

    start () {

    },

    // update (dt) {},
});
