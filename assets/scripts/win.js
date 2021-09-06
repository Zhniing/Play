cc.Class({
    extends: cc.Component,

    properties: {
        
    },

    onLoad () {
        console.log('win.js')
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        if (otherCollider.node.name == 'Player') {
            // var nodeWin = selfCollider.node.parent.parent.getChildByName('Animation').getChildByName('Win');
            var nodeWin = cc.find("Canvas/Camera/Win");
            var animWin = nodeWin.getComponent(cc.Animation);

            animWin.play();
        }
        
        contact.disabled = true;
    },

    start () {

    },

    // update (dt) {},
});
