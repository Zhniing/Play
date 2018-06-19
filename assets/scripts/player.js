// cc.macro.ENABLE_TILEDMAP_CULLING = false;

cc.Class({
    extends: cc.Component,

    properties: {
        maxSpeed: 110,
        jumps: 1,  // 单次跳跃次数（n段跳）
        acceleration: 1500,
        jumpSpeed: 520,
        drag: 600,
    },

    onLoad: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        
        this.body = this.getComponent(cc.RigidBody);
        this._up = false;
        this._left = false;
        this._right = false;
        this._jumps = this.jumps;
        this._upPressed = false;
        this.game = this.node.parent.getComponent('game'); // 获取game控制脚本
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

        if (position.y < 0) {
            cc.director.loadScene("GameOver");
            this.enabled = false;
        }

        // Move
        if(this._left) { // Left key pressed
            if(speed.x > -this.maxSpeed) {
                // speed.x = -this.maxSpeed;
                speed.x -= this.acceleration * dt;
                if (speed.x <= -this.maxSpeed) {
                    speed.x = -this.maxSpeed;
                }
            }
        } else if (this._right) { // Right key pressed
            if(speed.x < this.maxSpeed) {
                // speed.x = this.maxSpeed;
                speed.x += this.acceleration * dt;
                if (speed.x >= this.maxSpeed) {
                    speed.x = this.maxSpeed;
                }
            }
        } else { // Release the key
            if(speed.x != 0) {
                var d = this.drag * dt;
                if(Math.abs(speed.x) <= d) {
                    speed.x = 0;
                } else {
                    speed.x -= speed.x > 0 ? d : -d;
                }
            }
        }

        // Jump
        if (this.jumps > 0 && this._up) {
            this.jumps--;
            speed.y = this.jumpSpeed;
            this._up = false;
        }

        // Scene border
        var l = -this.node.parent.width/2 + this.node.width*this.node.scale/2;
        var r = this.node.parent.width/2 - this.node.width*this.node.scale/2;
        if ( this.node.x < l) {
            speed.x = 0;
            this.node.x = l;
        } else if (this.node.x > r) {
            speed.x = 0;
            this.node.x = r;
        }
        
        // Implement
        this.body.linearVelocity = speed;
    },

    
});
