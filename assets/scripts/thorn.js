cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        this.nodePlayer = this.node.parent.parent.getChildByName('Player');
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        var player = this.nodePlayer.getComponent('player');
        player.hurt = true;
        if (selfCollider.offset.x > otherCollider.node.position.x) {
            player.flag = true; // 往左弹
        } else {
            player.flag = false; // 往右弹
        }

        contact.disabled = true;
    },

    start () {

    },

    // update (dt) {},
});
