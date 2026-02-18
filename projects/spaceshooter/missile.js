export class Missile {

    constructor(x,y,angle,pvx,pvy,owner,color){

        const speed=7;

        this.x=x;
        this.y=y;

        this.vx=Math.cos(angle)*speed+pvx;
        this.vy=Math.sin(angle)*speed+pvy;

        this.radius=4;
        this.owner=owner;
        this.color=color;

        this.life=300;
        this.dead=false;
    }

    update(track,players){

        if(this.dead)return;

        this.x+=this.vx;
        this.y+=this.vy;

        const normal=track.getWallNormal(this.x,this.y,this.radius);

        if(normal){
            const dot=this.vx*normal.x+this.vy*normal.y;
            this.vx-=2*dot*normal.x;
            this.vy-=2*dot*normal.y;
        }

        for(const p of players){

            if(p===this.owner)continue;

            const dx=this.x-p.x;
            const dy=this.y-p.y;

            if(Math.hypot(dx,dy)<p.radius+this.radius){
                p.stun();
                this.dead=true;
                this.owner.activeMissiles--;
            }
        }

        this.life--;
        if(this.life<=0 && !this.dead){
            this.dead=true;
            this.owner.activeMissiles--;
        }
    }

    draw(ctx){
        ctx.fillStyle=this.color;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);
        ctx.fill();
    }
}
