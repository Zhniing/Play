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
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == 'Player') {
            var player = otherCollider.node.getComponent('player');
            player.enterRope = true;
            player.ropeCenter = selfCollider.offset.x;
        }
        contact.disabled = true;
    },

    onEndContact: function (contact, selfCollider, otherCollider) {
        // cc.log('end');
        if (otherCollider.node.name == 'Player') {
            var player = otherCollider.node.getComponent('player');
            player.enterRope = false;
        }
    },

    start () {

    },

    // update (dt) {},
});
