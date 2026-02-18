export class Track {

    constructor() {

        this.outer = { x:100, y:100, w:600, h:400 };
        this.inner = { x:300, y:200, w:200, h:200 };

        this.startY = 300;
        this.startX1 = this.outer.x;
        this.startX2 = this.inner.x;

        this.cp1Y = 300;
        this.cp1X1 = this.inner.x + this.inner.w;
        this.cp1X2 = this.outer.x + this.outer.w;

        this.cp2X = 400;
        this.cp2Y1 = this.inner.y + this.inner.h;
        this.cp2Y2 = this.outer.y + this.outer.h;
    }

    draw(ctx) {

        ctx.strokeStyle = "white";
        ctx.lineWidth = 4;

        ctx.strokeRect(this.outer.x, this.outer.y, this.outer.w, this.outer.h);
        ctx.strokeRect(this.inner.x, this.inner.y, this.inner.w, this.inner.h);

        ctx.fillStyle = "yellow";
        ctx.fillRect(this.startX1, this.startY-3, this.startX2-this.startX1, 6);

        ctx.fillStyle = "red";
        ctx.fillRect(this.cp1X1, this.cp1Y-3, this.cp1X2-this.cp1X1, 6);

        ctx.fillStyle = "blue";
        ctx.fillRect(this.cp2X-3, this.cp2Y1, 6, this.cp2Y2-this.cp2Y1);
    }

    handleWallCollision(p) {

        const o=this.outer;
        const i=this.inner;

        if (p.x-p.radius<o.x){p.x=o.x+p.radius;p.vx=Math.abs(p.vx)*0.8;}
        if (p.x+p.radius>o.x+o.w){p.x=o.x+o.w-p.radius;p.vx=-Math.abs(p.vx)*0.8;}
        if (p.y-p.radius<o.y){p.y=o.y+p.radius;p.vy=Math.abs(p.vy)*0.8;}
        if (p.y+p.radius>o.y+o.h){p.y=o.y+o.h-p.radius;p.vy=-Math.abs(p.vy)*0.8;}

        if (p.x>i.x && p.x<i.x+i.w && p.y>i.y && p.y<i.y+i.h){

            const dx=p.x-(i.x+i.w/2);
            const dy=p.y-(i.y+i.h/2);

            if(Math.abs(dx)>Math.abs(dy)){
                p.x=dx>0?i.x+i.w+p.radius:i.x-p.radius;
                p.vx*=-0.8;
            }else{
                p.y=dy>0?i.y+i.h+p.radius:i.y-p.radius;
                p.vy*=-0.8;
            }
        }
    }

    getWallNormal(x,y,r){

        const o=this.outer;
        const i=this.inner;

        if(x-r<o.x)return{x:1,y:0};
        if(x+r>o.x+o.w)return{x:-1,y:0};
        if(y-r<o.y)return{x:0,y:1};
        if(y+r>o.y+o.h)return{x:0,y:-1};

        if(x>i.x && x<i.x+i.w && y>i.y && y<i.y+i.h){

            const dx=x-(i.x+i.w/2);
            const dy=y-(i.y+i.h/2);

            if(Math.abs(dx)>Math.abs(dy))
                return dx>0?{x:1,y:0}:{x:-1,y:0};
            else
                return dy>0?{x:0,y:1}:{x:0,y:-1};
        }

        return null;
    }

    updateLap(p){

        if(
            p.y>this.cp1Y-5 && p.y<this.cp1Y+5 &&
            p.x>this.cp1X1 && p.x<this.cp1X2
        ){
            if(p.lapState===0) p.lapState=1;
        }

        if(
            p.x>this.cp2X-5 && p.x<this.cp2X+5 &&
            p.y>this.cp2Y1 && p.y<this.cp2Y2
        ){
            if(p.lapState===1) p.lapState=2;
        }

        if(
            p.y>this.startY-5 && p.y<this.startY+5 &&
            p.x>this.startX1 && p.x<this.startX2
        ){
            if(p.lapState===2){
                p.score++;
                p.completedLap=true;
                p.lapState=0;
            }
        }
    }
}
