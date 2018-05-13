// cc.macro.ENABLE_TILEDMAP_CULLING = false;

cc.Class({
    extends: cc.Component,

    properties: {
        maxSpeed: 300,
        jumps: 2,  // 单次跳跃次数（n段跳）
        acceleration: 1500,
        jumpSpeed: 500,
        jumpHeight: 100,
        drag: 600
    },

    onLoad: function () {
        cc.director.getPhysicsManager().enabled = true; // 启用物理引擎

        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

        this._up = false;
        this._left = false;
        this._right = false;
        this._jumppoint = this.node.y;
        this._upPressed = false;
        
        this.body = this.getComponent(cc.RigidBody);
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        this.jumps = 2;
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
            case cc.KEY.up:
                if (!this._upPressed) {
                    this._up = true;
                }
                this._upPressed = true;
                this._jumppoint = this.node.y;
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
            case cc.KEY.up:
                this._upPressed = false;
                this._up = false;
                this.jumps--;
                break;
        }
    },

    update: function (dt) {
        var speed = this.body.linearVelocity;

        // 处理左右移动
        if(this._left) {
            if(speed.x > -this.maxSpeed) {
                speed.x -= this.acceleration * dt;
                if (speed.x <= -this.maxSpeed) {
                    speed.x = -this.maxSpeed;
                }
                
            }
        }
        else if (this._right) {
            if(speed.x < this.maxSpeed) {
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
        if (this.node.y - this._jumppoint > this.jumpHeight) {
            this._up = false;
        }
        if (this.jumps > 0 && this._up) {
            speed.y = this.jumpSpeed;
        }
        
        this.body.linearVelocity = speed;
    },

    
});
