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

    onLoad () {
        console.log('scene.js')
        if (this.gameMenu) {
            // 启用物理引擎
            cc.director.getPhysicsManager().enabled = true;
            // Enable debug
            // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit;
            this.isGameMenu = false;
            cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
        // 预加载场景
        var curScene = cc.director.getScene();
        if (curScene.name == 'StartMenu') {
            cc.log('sence 03 preload');
            cc.director.preloadScene('03');
            cc.log('sence GameOver preload');
            cc.director.preloadScene('GameOver');
        }

        // 为每个按钮绑定鼠标交互音效
        this.children = this.node.children;
        for (var i=0; i<this.children.length; i++) {
            this.grandchild = this.children[i].children;
            for (var j=0; j<this.grandchild.length; j++) {
                if (this.grandchild[j].getComponent(cc.Button)) {
                    this.grandchild[j].on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
                    this.grandchild[j].on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
                }
            }
        }
        if (this.backgroundAudio) {
            this.audioBackground = cc.audioEngine.play(this.backgroundAudio, true, 1);
        }
    },

    onDestroy () {
        cc.audioEngine.stop(this.audioBackground);
    },

    // 鼠标移入音效
    onMouseEnter: function () {
        cc.audioEngine.play(this.mouseEnterAudio, false, 1);
    },

    // 鼠标抬起音效
    onMouseUp: function () {
        cc.audioEngine.play(this.mouseUpAudio);
    },

    onKeyDown: function (event) {
        switch (event.keyCode) {
            case cc.macro.KEY.escape:
                if ( !this.isGameMenu ) {
                    this.openMenu();
                } else {
                    this.closeMenu();
                }
                break;
        }
    },
    openMenu: function () {
        cc.director.pause();
        this.isGameMenu = true;
        this.mask.active = true;
        this.gameMenu.active = true;
    },
    closeMenu: function () {
        cc.director.resume();
        this.isGameMenu = false;
        this.mask.active = false;
        this.gameMenu.active = false;
    },

    // Button event
    startGame: function () {
        cc.director.loadScene('03');
    },

    tryAgain: function () {
        cc.director.loadScene('03');
    },

    backToMenu: function () {
        cc.director.loadScene("StartMenu");
    },

    start () {

    },

    // update (dt) {},
});
