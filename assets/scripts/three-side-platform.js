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
        // cc.log(points.length);

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
        //check if contact points are moving into platform
        for (let i = 0; i < points.length; i++) {
            platformBody.getLinearVelocityFromWorldPoint( points[i], pointVelPlatform );
            otherBody.getLinearVelocityFromWorldPoint( points[i], pointVelOther );
            platformBody.getLocalVector( pointVelOther.subSelf(pointVelPlatform), relativeVel );
            
            // console.log(relativeVel);
            if ( relativeVel.y < 0 && !flag) {
                // store disabled state to contact
                // contact.disabled = true;
                return;
            } else if ( otherCollider.body.linearVelocity.x != 0 && flag) {
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
        contact.disabled = true;
    },

    start () {

    },

    // update (dt) {},
});
