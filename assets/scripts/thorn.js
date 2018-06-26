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

    onLoad () {
        // var nodeMap = this.node.parent.parent.getChildByName("Map");
        // var tiledMap = nodeMap.getComponent(cc.TiledMap);
        // this.mapSize = tiledMap.getMapSize();
        // this.tileSize = tiledMap.getTileSize();
        // var thornLayer = tiledMap.getLayer("地刺");

        this.nodePlayer = this.node.parent.parent.getChildByName('Player');
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        var player = this.nodePlayer.getComponent('player');
        player.hurt = true;

        // cc.log(selfCollider.offset.x);
        // cc.log(otherCollider.node.position.x + otherCollider.node.parent.width/2);
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
