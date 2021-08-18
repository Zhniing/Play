cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
         // 创建 easeInOut 缓动对象，慢到快，然后慢。
        var moveTo = cc.moveBy(2, cc.v2(200, 0)).easing(cc.easeInOut(3.0));
        var moveBack = cc.moveBy(2, cc.v2(-200, 0)).easing(cc.easeCubicActionInOut());
        var moveAction = cc.repeatForever(cc.sequence(moveTo, moveBack));
        this.node.runAction(moveAction);
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == 'Player') {
            var player = otherCollider.node.getComponent('player');
            player.hurt = true;
            if (selfCollider.node.x > otherCollider.node.x) {
                player.flag = true; // 往左弹
            } else {
                player.flag = false; // 往右弹
            }
        }
        
        contact.disabled = true;
    },

    start () {

    },

    // update (dt) { },
});
