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
        var nodeMap = this.node.parent.parent.getChildByName("Map");
        var tiledMap = nodeMap.getComponent(cc.TiledMap);
        this.mapSize = tiledMap.getMapSize();
        this.tileSize = tiledMap.getTileSize();
        var blockLayer = tiledMap.getLayer("砖块");
      
        // cc.log('mapSize: ' + mapSize);
        // cc.log('tileSize: ' + tileSize);

        // Offset
        this.ox = 23;
        this.oy = 0;
        // Joint
        var joint = false;
        var leftPos = 0;
        var rightPos = 0;
        var len = 0;
        // Number
        this.cnt = 0;
        for (var y=this.mapSize.height-1; y>=0; y--) {
            for (var x=0; x<this.mapSize.width; x++) {
                if (blockLayer.getTileGIDAt(x,y)) {
                    if (!joint) {
                        joint = true;
                        leftPos = x * this.tileSize.width;
                    }
                    len++;
                } else if (joint) {
                    rightPos = x * this.tileSize.width;
                    this.addPhysicsBoxCollider((leftPos + rightPos) / 2 - this.ox,
                                                (this.mapSize.height - y) * this.tileSize.height - this.tileSize.height/2 - this.oy,
                                                len * this.tileSize.width,
                                                this.tileSize.height);
                    len = 0;
                    this.cnt++;
                    joint = false;
                }
            }
            // if (joint) {
            //     rightPos = x * this.tileSize.width;
            //     this.addPhysicsBoxCollider((leftPos + rightPos) / 2 - this.ox,
            //                                 (this.mapSize.height - y) * this.tileSize.height - this.tileSize.height / 2 - this.oy,
            //                                 len * this.tileSize.width,
            //                                 this.tileSize.height);
            //     len = 0;
            //     this.cnt++;
            //     joint = false;
            // }
        }
        // this.addPhysicsBoxCollider(cc.winSize.width-10,this.mapSize.height*this.tileSize.height/2,1,this.mapSize.height*this.tileSize.height);
        // this.addPhysicsBoxCollider(10,this.mapSize.height*this.tileSize.height/2,1,this.mapSize.height*this.tileSize.height);
        cc.log('Blocks: ' + this.node.getComponents(cc.PhysicsBoxCollider).length);
    },

    addPhysicsBoxCollider: function (x,y,w,h) {
        
        this.node.addComponent(cc.PhysicsBoxCollider);
        var newBox = this.node.getComponents(cc.PhysicsBoxCollider)[this.cnt];
        newBox.size.width = w;
        newBox.size.height = h;
        // cc.log("newBox.size.width: "+ newBox.size.width);
        // cc.log("newBox.size.height: "+ newBox.size.height);
        // newBox.size.width = 20;
        // newBox.size.height = 60;
        var pos = cc.Vec2.ZERO;
        pos.x = x;
        pos.y = y;
        // cc.log('pos.x: ' + pos.x);
        // cc.log('pos.y: ' + pos.y);
        // pos.x = 130;
        // pos.y = 100;
        newBox.offset = pos;
        
    },

    start () {

    },

    // update (dt) {},
});
