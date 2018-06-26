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
        speed: 100,
        // direct: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
         // 创建 easeInOut 缓动对象，慢到快，然后慢。
        var moveTo = cc.moveBy(3, cc.p(200, 0)).easing(cc.easeInOut(3.0));
        var moveBack = cc.moveBy(3, cc.p(-200, 0)).easing(cc.easeCubicActionInOut());
        var moveAction = cc.repeatForever(cc.sequence(moveTo, moveBack));
        this.node.runAction(moveAction);
        // this.ball = this.node.getComponent(cc.PhysicsBoxCollider);
        // this.body = this.node.getComponent(cc.RigidBody);
        // this.direct = 1;
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == 'Player') {
            // cc.log('ball');
            var player = otherCollider.node.getComponent('player');
            player.hurt = true;
            // cc.log(selfCollider.offset.x);
            // cc.log(otherCollider.node.position.x + otherCollider.node.parent.width/2);
            if (selfCollider.node.x > otherCollider.node.position.x + otherCollider.node.parent.width/2) {
                player.flag = true; // 往左弹
            } else {
                player.flag = false; // 往右弹
            }
        }
        
        contact.disabled = true;
    },

    start () {

    },

    update (dt) { },
});
