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
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var nodeMap = this.node.parent.getChildByName("Map");
        var tiledMap = nodeMap.getComponent(cc.TiledMap);
        this.mapSize = tiledMap.getMapSize();
        this.tileSize = tiledMap.getTileSize();
        var blockLayer = tiledMap.getLayer("砖块");

        // cc.log('mapSize: ' + mapSize);
        // cc.log('tileSize: ' + tileSize);

        this.cnt = 0;
        this.ox = 55;
        this.oy = 96;
        this.joint = false;
        this.left = 0;
        this.right = 0;
        this.len = 0;
        for (var y=this.mapSize.height-1; y>=0; y--) {
            for (var x=0; x<this.mapSize.width; x++) {
                if (blockLayer.getTileGIDAt(x,y)) {
                    if (!this.joint) {
                        this.joint = true;
                        this.left = x * this.tileSize.width;
                    }
                    this.len++;
                } else if (this.joint) {
                    this.right = x * this.tileSize.width;
                    this.addPhysicsBoxCollider((this.left + this.right) / 2 - this.ox,
                                                (this.mapSize.height - y) * this.tileSize.height - this.tileSize.height / 2 - this.oy,
                                                this.len * this.tileSize.width,
                                                this.tileSize.height);
                    this.len = 0;
                    this.cnt++;
                    this.joint = false;
                }
            }
            if (this.joint) {
                this.right = x * this.tileSize.width;
                this.addPhysicsBoxCollider((this.left + this.right) / 2 - this.ox,
                                            (this.mapSize.height - y) * this.tileSize.height - this.tileSize.height / 2 - this.oy,
                                            this.len * this.tileSize.width,
                                            this.tileSize.height);
                this.len = 0;
                this.cnt++;
                this.joint = false;
            }
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
