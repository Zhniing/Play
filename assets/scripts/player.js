// cc.macro.ENABLE_TILEDMAP_CULLING = false;

cc.Class({
    extends: cc.Component,

    properties: {
        maxSpeed: 110,
        jumps: 1,  // 单次跳跃次数（n段跳）
        acceleration: 1500,
        jumpSpeed: 520,
        drag: 600
    },

    onLoad: function () {
        cc.director.getPhysicsManager().enabled = true; // 启用物理引擎
        // cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_shapeBit; // Enable debug

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        
        this.body = this.getComponent(cc.RigidBody);
        this._up = false;
        this._left = false;
        this._right = false;
        this._jumps = this.jumps;
        this._upPressed = false;
        this._preSpeedY = 0;

        // this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event) {
        //     this.opacity = 100;
        //     var delta = event.touch.getDelta();
        //     this.x += delta.x;
        //     this.y += delta.y;
        // }, this.node);
        // this.node.on(cc.Node.EventType.TOUCH_END, function () {
        //     this.opacity = 255;
        // }, this.node);

        // this.node.addComponent(cc.PhysicsBoxCollider);
        // var pbcs = this.node.getComponents(cc.PhysicsBoxCollider);
        // cc.log(pbcs.length);
        // pbcs[1].width = 20;
        // pbcs[1].height = 60;
        // var position = cc.Vec2.ZERO;
        // position.x = 130;
        // position.y = 100;
        //  pbcs[1].offset = position;
        // cc.log(pbcs[0].size.width);
        // cc.log(pbcs[0].size.height);
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        let otherBody = otherCollider.body;
        let platformBody = selfCollider.body;

        let worldManifold = contact.getWorldManifold();
        let points = worldManifold.points;
        // cc.log(points.length);
        var flag = false;
        for (var i = 0; i < points.length-1; i++) {
            if ( points[i].y != points[i+1].y ) {
                flag = true; // 碰撞点的y坐标不相等
                break;
            }
        }
        
        // if (points[0].y == points[1].y) {
        //     this.jumps = this._jumps;
        // }

        if ( !flag ) {
            this.jumps = this._jumps;
        }
    },

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this._left = true;
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this._right = true;
                break;
            case cc.KEY.w:
            case cc.KEY.up:
            case cc.KEY.alt:
                if (!this._upPressed && this.body.linearVelocity.y == 0) {
                    this._up = true;
                }
                this._upPressed = true;
                break;
        }
    },

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.KEY.a:
            case cc.KEY.left:
                this._left = false;
                break;
            case cc.KEY.d:
            case cc.KEY.right:
                this._right = false;
                break;
            case cc.KEY.w:
            case cc.KEY.up:
            case cc.KEY.alt:
                this._upPressed = false;
                this._up = false;
                break;
        }
    },

    update: function (dt) {
        var speed = this.body.linearVelocity;
        var position = this.node.convertToWorldSpace(cc.Vec2.ZERO);

        // 处理左右移动
        if(this._left) {
            if (position.x <= 0) {
                speed.x = 0;
            } else if(speed.x > -this.maxSpeed) {
                speed.x -= this.acceleration * dt;
                if (speed.x <= -this.maxSpeed) {
                    speed.x = -this.maxSpeed;
                }
            }
        }
        else if (this._right) {
            if (position.x >= cc.winSize.width - this.node.width * this.node.scale) {
                speed.x = 0;
            } else if(speed.x < this.maxSpeed) {
                speed.x += this.acceleration * dt;
                if (speed.x >= this.maxSpeed) {
                    speed.x = this.maxSpeed;
                }
            }
        }
        else { // 松开方向键
            if(speed.x != 0) {
                var d = this.drag * dt;
                if(Math.abs(speed.x) <= d) {
                    speed.x = 0;
                } else {
                    speed.x -= speed.x > 0 ? d : -d;
                }
            }
        }
        
        // 处理跳跃
        // if (this._preSpeedY < 0 && speed.y==0) { // 落到平台上的瞬间
        //     this.jumps = this._jumps;
        //     cc.log(1);
        // }
        if (this.jumps > 0 && this._up) {
            this.jumps--;
            speed.y = this.jumpSpeed;
            this._up = false;
        }
     
        this.body.linearVelocity = speed;
        // cc.log(speed);
        this._preSpeedY = speed.y; // 记录上一帧的速度
    },

    
});
