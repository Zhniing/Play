cc.Class({
    extends: cc.Component,

    properties: {
        maxSpeed: 110,
        jumps: 1,  // 单次跳跃次数（n段跳）
        acceleration: 1500,
        jumpSpeed: 520,
        drag: 600,
        jumpAudio: {
            default: null,
            url: cc.AudioClip,
        },
    },

    onLoad: function () {
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        
        this.body = this.getComponent(cc.RigidBody);
        this._up = false;
        this._alt = false;
        this._left = false;
        this._right = false;
        this._jumps = this.jumps;
        this._altPressed = false;
        this.game = this.node.parent.getComponent('game'); // 获取game控制脚本
        this.flag = false;
        this.outOfCtrl = false;
        this.prey = 0;
        this.gravity = this.body.gravityScale;
    },

    onKeyDown (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this._left = true;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this._right = true;
                break;
            case cc.macro.KEY.alt:
                if (!this._altPressed && this.body.linearVelocity.y == 0) {
                    this._alt = true;
                }
                this._altPressed = true;
                break;
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this._up = true;
                break;
            case cc.macro.KEY.down:
                this._down = true;
                break;
        }
    },

    onKeyUp (event) {
        switch(event.keyCode) {
            case cc.macro.KEY.a:
            case cc.macro.KEY.left:
                this._left = false;
                break;
            case cc.macro.KEY.d:
            case cc.macro.KEY.right:
                this._right = false;
                break;
            case cc.macro.KEY.alt:
                this._altPressed = false;
                this._alt = false;
                break;
            case cc.macro.KEY.w:
            case cc.macro.KEY.up:
                this._up = false;
                break;
            case cc.macro.KEY.down:
                this._down = false;
                break;
        }
    },

    update: function (dt) {
        var speed = this.body.linearVelocity;
        var position = this.node.convertToWorldSpace(cc.Vec2.ZERO);

        // 判断游戏是否结束
        if (position.y < 0) {
            cc.director.loadScene("GameOver");
            this.enabled = false; // 终止脚本
        }

        // 是否被碰到陷阱
        if (this.hurt && !this.outOfCtrl) { // 弹一下
            if (this.flag) speed.x = -200;
            else speed.x = 200;
            speed.y = 300;
            this.outOfCtrl = true;
            this.hurt = false;
            this.enterRope = false;
        }

        // 是否进入绳子范围
        if (this.enterRope) {
            if (!this.onRope && (this._up || this._down)  && !this.outOfCtrl) {
                if (this._down) {
                    this.node.y -= this.node.height*this.node.scale;
                }
                this.onRope = true;
                this.body.gravityScale = 0;
                this.node.x = this.ropeCenter;
                speed.y = 0;
            }
            if (this.onRope) {
                speed.x = 0;
                if (this._up) {
                    speed.y = 70;
                } else if (this._down) {
                    speed.y = -70;
                } else {
                    speed.y = 0;
                }
                if (this._left && this._altPressed) {
                    this.body.gravityScale = this.gravity;
                    speed.x = -110;
                    speed.y = 520;
                    this.onRope = false;
                } else if (this._right && this._altPressed) {
                    this.body.gravityScale = this.gravity;
                    speed.x = 110;
                    speed.y = 520;
                    this.onRope = false;
                }
            } else {
                this.body.gravityScale = this.gravity;
            }
        } else {
            this.body.gravityScale = this.gravity;
            this.onRope = false;
        }

        // Move
        if (!this.outOfCtrl) {
            if(this._left && !this.onRope) { // Left key pressed
                if(speed.x > -this.maxSpeed) {
                    // speed.x = -this.maxSpeed;
                    speed.x -= this.acceleration * dt;
                    if (speed.x <= -this.maxSpeed) {
                        speed.x = -this.maxSpeed;
                    }
                }
            } else if (this._right && !this.onRope) { // Right key pressed
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
            if (this.jumps > 0 && this._alt && !this.onRope) {
                cc.audioEngine.play(this.jumpAudio, false,  1);
                this.jumps--;
                speed.y = this.jumpSpeed;
                this._alt = false;
            }
        }

        // 连续两帧y速度为0即重置跳跃
        if (this.prey==0 && speed.y==0) {
            this.jumps = 1;
            this.outOfCtrl = false;
        }

        // Scene border 防止跑出地图边界
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
        this.prey = speed.y;
    },
});
