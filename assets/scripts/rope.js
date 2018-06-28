cc.Class({
    extends: cc.Component,

    properties: {
        
    },

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
