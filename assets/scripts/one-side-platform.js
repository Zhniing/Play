// http://www.iforce2d.net/b2dtut/one-way-walls

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
        let cache = this._pointsCache;

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
        // console.log(points);
        // check if contact points are moving into platform
        for (let i = 0; i < points.length; i++) {
            platformBody.getLinearVelocityFromWorldPoint( points[i], pointVelPlatform );
            // console.log(pointVelPlatform);
            otherBody.getLinearVelocityFromWorldPoint( points[i], pointVelOther );
            // console.log(pointVelOther);
            platformBody.getLocalVector( pointVelOther.subSelf(pointVelPlatform), relativeVel );
            // console.log(relativeVel);
            if ( relativeVel.y < 0 && !flag) {
                return;
            }
            // if ( relativeVel.y < -32 ) //if moving down faster than 32 pixel/s (1m/s), handle as before
            //     return;  //point is moving into platform, leave contact solid and exit
            // else if ( relativeVel.y < 32 ) { //if moving slower than 32 pixel/s (1m/s)
            //     //borderline case, moving only slightly out of platform
            //     platformBody.getLocalPoint( points[i], relativePoint );
            //     let platformFaceY = selfCollider.getAABB().height / 2;  //front of platform, should only used on a box collider
            //     if ( relativePoint.y > platformFaceY - 0.1*32 )
            //         return;  //contact point is less than 3.2pixel (10cm) inside front face of platfrom
            // }
            // else {
            //     //moving up faster than 1 m/s
                
            // }
        }
        
        // store disabled state to contact
        contact.disabled = true; // 取消本次碰撞
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
