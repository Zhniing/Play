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
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        console.log('start.js') // ! 该脚本不会被执行
        // cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onMouseEnter, this);
        this.children = this.node.children;
        for (var i=0; i<this.children.length; i++) {
            if (this.children[i].getComponent(cc.Button)) {
                this.children[i].on(cc.Node.EventType.MOUSE_ENTER, this.onMouseEnter, this);
                this.children[i].on(cc.Node.EventType.MOUSE_DOWN, this.onMouseDown, this);
                this.children[i].on(cc.Node.EventType.MOUSE_UP, this.onMouseUp, this);
            }
        }
        cc.log();
        
        this.audioBackground = cc.audioEngine.play(this.backgroundAudio, true, 1);

        this._pressed = false;
    },

    onDestroy () {
        cc.audioEngine.stop(this.audioBackground);
    },

    onMouseEnter: function () {
        cc.audioEngine.play(this.mouseEnterAudio, false, 1);
    },

    onMouseDown: function () {
        this._pressed = true;
    },

    onMouseUp: function () {
        // if (this._pressed) {
            // this._pressed = false;
            cc.audioEngine.play(this.mouseUpAudio);
        // }
    },

    onStartGame: function () {
        cc.director.loadScene('Game2');
    },

    start () {

    },

    // update (dt) {},
});
