cc.Class({
    extends: cc.Component,

    properties: {
        target: {
            default: null,
            type: cc.Node
        }
    },

    onLoad: function () {
        this.camera = this.getComponent(cc.Camera);
    },

    onEnable: function () {
        // cc.director.getPhysicsManager().attachDebugDrawToCamera(this.camera);
    },
    onDisable: function () {
        // cc.director.getPhysicsManager().detachDebugDrawFromCamera(this.camera);
    },

    lateUpdate: function (dt) {
        let targetPos = this.target.convertToWorldSpaceAR(cc.Vec2.ZERO);
        var y = this.target.y;
        if (y > 0 && y < this.node.parent.getChildByName('Map').height - this.node.parent.height - 17) {
            this.node.y = y;
        }
    },
});