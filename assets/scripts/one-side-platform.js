cc.Class({
    extends: cc.Component,

    properties: {    },

    onLoad: function () {
        this.pointVelPlatform = cc.v2();
        this.pointVelOther = cc.v2();
        this.relativeVel = cc.v2();
        this.relativePoint = cc.v2();
    },

    onBeginContact: function (contact, selfCollider, otherCollider) {
        let otherBody = otherCollider.body;
        let platformBody = selfCollider.body;

        let worldManifold = contact.getWorldManifold();
        let points = worldManifold.points;

        let pointVelPlatform = this.pointVelPlatform;
        let pointVelOther = this.pointVelOther;
        let relativeVel = this.relativeVel;
        let relativePoint = this.relativePoint;

        var flag = false;
        for (var i = 0; i < points.length-1; i++) {
            if ( points[i].y != points[i+1].y ) {
                flag = true; // 碰撞点的y坐标不相等
                break;
            }
        }
        for (let i = 0; i < points.length; i++) {
            platformBody.getLinearVelocityFromWorldPoint( points[i], pointVelPlatform );
            otherBody.getLinearVelocityFromWorldPoint( points[i], pointVelOther );
            platformBody.getLocalVector( pointVelOther.subSelf(pointVelPlatform), relativeVel );
            if ( relativeVel.y < 0 && !flag) {
                return;
            }
        }
        
        contact.disabled = true; // 取消本次碰撞
    },

    // update (dt) {},
});
